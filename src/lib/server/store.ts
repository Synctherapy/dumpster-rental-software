import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { seed } from '../seed';
import type { Workspace } from '../types';

const directory = process.env.ROLLOS_DATA_DIR || path.join(process.cwd(), '.rollos');
const defaultFilename = path.join(directory, 'demo.json');

const globalStore = globalThis as typeof globalThis & {
  rollosDemoQueue?: { queue: Promise<unknown> };
  rollosDemoMemory?: Workspace;
  rollosDemoSessions?: Map<string, Workspace>;
  rollosFsDisabled?: boolean;
};

const state = (globalStore.rollosDemoQueue ??= { queue: Promise.resolve() });
const sessions = (globalStore.rollosDemoSessions ??= new Map<string, Workspace>());

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
const DEMO_SESSION_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;
const DEMO_SESSION_MAX_AGE = 30 * 86400;

/**
 * Reads the visitor's private demo sandbox id.
 *
 * The id used to be accepted from an `x-demo-session` request header that the
 * browser minted with Math.random(). Anyone could therefore name someone else's
 * sandbox and read or write it, and two visitors could collide by chance. It is
 * now a server-issued HttpOnly cookie only: callers cannot choose it.
 */
export async function getDemoSessionId(): Promise<string | null> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieSession = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
    if (cookieSession && DEMO_SESSION_PATTERN.test(cookieSession)) {
      return cookieSession;
    }
    return null;
  } catch {
    return null;
  }
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
  const sessionId = explicitSessionId || (await getDemoSessionId());

  const run = state.queue.then(async () => {
    let data: Workspace;

    if (sessionId) {
      data = await loadSessionData(sessionId);
      const result = await fn(data);
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

    // Default global fallback (for tests without request context)
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
