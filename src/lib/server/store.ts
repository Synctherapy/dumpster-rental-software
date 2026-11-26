import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { demoOrg, seed } from '../seed';
import type { Workspace } from '../types';

export function demoDataDirectory() {
  if (process.env.ROLLOS_DATA_DIR) return process.env.ROLLOS_DATA_DIR;
  if (process.env.VERCEL) return path.join('/tmp', '.rollos');
  return path.join(process.cwd(), '.rollos');
}

const directory = demoDataDirectory();
const defaultFilename = path.join(directory, 'demo.json');

export interface DemoPhotoRecord {
  bytes: Buffer;
  metadata: { job_id: string; org_id: string };
}

const globalStore = globalThis as typeof globalThis & {
  rollosDemoQueue?: { queue: Promise<unknown> };
  rollosDemoMemory?: Workspace;
  rollosDemoSessions?: Map<string, Workspace>;
  rollosDemoPhotos?: Map<string, DemoPhotoRecord>;
  rollosFsDisabled?: boolean;
};

const state = (globalStore.rollosDemoQueue ??= { queue: Promise.resolve() });
const sessions = (globalStore.rollosDemoSessions ??= new Map<string, Workspace>());
const photos = (globalStore.rollosDemoPhotos ??= new Map<string, DemoPhotoRecord>());

export const DEMO_ORG_ID = demoOrg;
export const DEMO_SLUGS = new Set(['greenline', 'demo']);

/**
 * True when operating on the interactive demo sandbox — either because the
 * entire server is running in demo mode OR because the target organization is
 * the seeded demo workspace visited by an unsigned prospect on the live site.
 */
export function isDemoOrg(orgId?: string | null): boolean {
  return isDemo() || orgId === demoOrg;
}

/** True for the marketing site's reserved public demo booking/portal slugs. */
export function isReservedDemoSlug(slug?: string | null): boolean {
  if (!slug) return false;
  return DEMO_SLUGS.has(slug.trim().toLowerCase());
}

export function isDemo() {
  if (process.env.ROLLOS_DEMO === 'true') {
    return true;
  }
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (hasUrl && hasAnon && hasService) {
    return false;
  }

  if (hasUrl || hasAnon || hasService) {
    // Fail closed. Falling back to demo mode here would turn a deployment that
    // lost one environment variable into a public sandbox with authentication
    // effectively off, which is the opposite of what README.md and CLAUDE.md
    // both promise. Names only — never log the values.
    const missing = [
      hasUrl ? null : 'NEXT_PUBLIC_SUPABASE_URL',
      hasAnon ? null : 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      hasService ? null : 'SUPABASE_SERVICE_ROLE_KEY',
    ].filter(Boolean);
    throw new Error(
      `Supabase configuration is incomplete: ${missing.join(', ')} not set. ` +
        'Set the missing values, or set ROLLOS_DEMO=true to run the demo deliberately.',
    );
  }

  return true;
}

export const DEMO_SESSION_COOKIE = 'rollos_demo_session';
export const DEMO_MODE_COOKIE = 'rollos_demo_mode';
const DEMO_SESSION_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;
const DEMO_SESSION_MAX_AGE = 30 * 86400;
const DEMO_MODE_MAX_AGE = 7 * 86400;

export const MAX_DEMO_JOBS = 80;
export const MAX_DEMO_CONTAINERS = 120;
export const MAX_DEMO_USERS = 30;
export const MAX_DEMO_PAYMENTS = 160;
export const MAX_DEMO_NOTIFICATIONS = 120;
export const MAX_DEMO_PHOTO_BYTES = 2 * 1024 * 1024;

function enforceSandboxCaps(data: Workspace) {
  if (Array.isArray(data.jobs) && data.jobs.length > MAX_DEMO_JOBS) {
    data.jobs.length = MAX_DEMO_JOBS;
  }
  if (Array.isArray(data.containers) && data.containers.length > MAX_DEMO_CONTAINERS) {
    data.containers.length = MAX_DEMO_CONTAINERS;
  }
  if (Array.isArray(data.users) && data.users.length > MAX_DEMO_USERS) {
    data.users.length = MAX_DEMO_USERS;
  }
  if (Array.isArray(data.payments) && data.payments.length > MAX_DEMO_PAYMENTS) {
    data.payments.length = MAX_DEMO_PAYMENTS;
  }
  if (
    Array.isArray(data.notifications_log) &&
    data.notifications_log.length > MAX_DEMO_NOTIFICATIONS
  ) {
    data.notifications_log.length = MAX_DEMO_NOTIFICATIONS;
  }
}

export async function getRequestDemoSession(): Promise<{
  inRequestScope: boolean;
  sessionId: string | null;
}> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieSession = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
    return {
      inRequestScope: true,
      sessionId: cookieSession && DEMO_SESSION_PATTERN.test(cookieSession) ? cookieSession : null,
    };
  } catch {
    return { inRequestScope: false, sessionId: null };
  }
}

/**
 * Reads the visitor's private demo sandbox id.
 *
 * The id used to be accepted from an `x-demo-session` request header that the
 * browser minted with Math.random(). Anyone could therefore name someone else's
 * sandbox and read or write it, and two visitors could collide by chance. It is
 * now a server-issued HttpOnly cookie only: callers cannot choose it.
 */
export async function getDemoSessionId(): Promise<string | null> {
  const { sessionId } = await getRequestDemoSession();
  return sessionId;
}

/** True when a visitor (even one signed into a real account) opted into viewing the demo tour. */
export async function isDemoViewRequested(): Promise<boolean> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get(DEMO_MODE_COOKIE)?.value === '1';
  } catch {
    return false;
  }
}

export async function setDemoViewCookie(enabled: boolean): Promise<void> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    if (enabled) {
      cookieStore.set(DEMO_MODE_COOKIE, '1', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: DEMO_MODE_MAX_AGE,
        secure: process.env.NODE_ENV === 'production',
      });
    } else {
      cookieStore.delete(DEMO_MODE_COOKIE);
    }
  } catch {}
}

/**
 * Like getDemoSessionId, but issues a sandbox to a visitor who does not have
 * one yet. Only callable where cookies can be set (route handlers and server
 * actions); in a server component the write is ignored and the caller falls
 * back to a read-only view of the shared sample data.
 */
export async function ensureDemoSessionId(): Promise<string | null> {
  const existing = await getDemoSessionId();
  if (existing) return existing;
  const issued = randomUUID().replace(/-/g, '');
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    cookieStore.set(DEMO_SESSION_COOKIE, issued, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: DEMO_SESSION_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
    });
    return issued;
  } catch {
    // A server component cannot set cookies; the next API call will issue one.
    return null;
  }
}

function getMemoryData(): Workspace {
  if (!globalStore.rollosDemoMemory) {
    globalStore.rollosDemoMemory = seed();
  }
  return globalStore.rollosDemoMemory;
}

async function loadSessionData(sessionId: string): Promise<Workspace> {
  if (sessions.has(sessionId)) {
    return sessions.get(sessionId)!;
  }
  if (!globalStore.rollosFsDisabled) {
    const sessionFile = path.join(directory, `demo-${sessionId}.json`);
    try {
      const data = JSON.parse(await readFile(sessionFile, 'utf8'));
      sessions.set(sessionId, data);
      return data;
    } catch {}
  }
  // Cloned fresh seed data for this visitor session
  const fresh = seed();
  sessions.set(sessionId, fresh);
  return fresh;
}

export async function readDemo(explicitSessionId?: string): Promise<Workspace> {
  const sessionId = explicitSessionId || (await getDemoSessionId());

  if (sessionId) {
    return loadSessionData(sessionId);
  }

  if (globalStore.rollosFsDisabled) {
    return getMemoryData();
  }
  try {
    const data = JSON.parse(await readFile(defaultFilename, 'utf8'));
    globalStore.rollosDemoMemory = data;
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('Filesystem read failed in demo mode, falling back to in-memory store:', error);
      globalStore.rollosFsDisabled = true;
    }
    return getMemoryData();
  }
}

// Session-isolated demo mutations: visitors can test custom business names and dispatches safely
export async function mutateDemo<T>(
  fn: (data: Workspace) => T | Promise<T>,
  explicitSessionId?: string,
): Promise<T> {
  // Never let an HTTP request without a cookie mutate shared global sample data:
  // auto-issue a private cookie session whenever cookies() is writable.
  const sessionId = explicitSessionId || (await getDemoSessionId()) || (await ensureDemoSessionId());

  const run = state.queue.then(async () => {
    let data: Workspace;

    if (sessionId) {
      data = await loadSessionData(sessionId);
      const result = await fn(data);
      enforceSandboxCaps(data);
      sessions.set(sessionId, data);

      // Keep in-memory cache bounded (max 500 active demo sessions)
      if (sessions.size > 500) {
        const oldestKey = sessions.keys().next().value;
        if (oldestKey) sessions.delete(oldestKey);
      }

      if (!globalStore.rollosFsDisabled) {
        try {
          await mkdir(directory, { recursive: true });
          const sessionFile = path.join(directory, `demo-${sessionId}.json`);
          await writeFile(sessionFile + '.tmp', JSON.stringify(data, null, 2), { mode: 0o600 });
          await rename(sessionFile + '.tmp', sessionFile);
        } catch {
          // In-memory sessions map handles persistence when filesystem is read-only
        }
      }
      return result;
    }

    // Default global fallback (only reached in Node unit tests outside HTTP request scope)
    if (globalStore.rollosFsDisabled) {
      data = getMemoryData();
    } else {
      try {
        data = JSON.parse(await readFile(defaultFilename, 'utf8'));
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          console.warn('Filesystem read failed during demo mutation, falling back to in-memory store:', error);
          globalStore.rollosFsDisabled = true;
        }
        data = getMemoryData();
      }
    }

    const result = await fn(data);
    enforceSandboxCaps(data);
    globalStore.rollosDemoMemory = data;

    if (!globalStore.rollosFsDisabled) {
      try {
        await mkdir(directory, { recursive: true });
        await writeFile(defaultFilename + '.tmp', JSON.stringify(data, null, 2), { mode: 0o600 });
        await rename(defaultFilename + '.tmp', defaultFilename);
      } catch (writeError) {
        console.warn('Filesystem write failed in demo mode; persisting in-memory store instead:', writeError);
        globalStore.rollosFsDisabled = true;
      }
    }

    return result;
  });
  state.queue = run.catch(() => {});
  return run;
}

export async function resetDemoSession(explicitSessionId?: string): Promise<Workspace> {
  return mutateDemo((d) => {
    const fresh = seed();
    for (const key of Object.keys(d) as (keyof Workspace)[]) {
      delete d[key];
    }
    Object.assign(d, fresh);
    return d;
  }, explicitSessionId);
}

export async function saveDemoPhoto(
  filename: string,
  bytes: Buffer,
  metadata: { job_id: string; org_id: string },
): Promise<void> {
  if (bytes.byteLength > MAX_DEMO_PHOTO_BYTES) {
    throw new Error('Demo sample photos must be under 2 MB.');
  }
  photos.set(filename, { bytes, metadata });
  if (photos.size > 200) {
    const oldest = photos.keys().next().value;
    if (oldest) photos.delete(oldest);
  }
  const photoDir = path.join(demoDataDirectory(), 'photos');
  try {
    await mkdir(photoDir, { recursive: true });
    await writeFile(path.join(photoDir, filename), bytes);
    await writeFile(path.join(photoDir, filename + '.json'), JSON.stringify(metadata));
  } catch {
    // Read-only serverless filesystems fall back cleanly to the in-memory photo cache.
  }
}

export async function readDemoPhoto(filename: string): Promise<DemoPhotoRecord | null> {
  const cached = photos.get(filename);
  if (cached) return cached;
  const photoDir = path.join(demoDataDirectory(), 'photos');
  try {
    const [bytes, rawMeta] = await Promise.all([
      readFile(path.join(photoDir, filename)),
      readFile(path.join(photoDir, filename + '.json'), 'utf8'),
    ]);
    const record: DemoPhotoRecord = { bytes, metadata: JSON.parse(rawMeta) };
    photos.set(filename, record);
    return record;
  } catch {
    return null;
  }
}
