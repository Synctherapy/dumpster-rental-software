import 'server-only';
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
    console.warn('Supabase configuration is incomplete (some keys are missing). Falling back to demo mode.');
    return true;
  }

  return true;
}

export async function getDemoSessionId(): Promise<string | null> {
  try {
    const { cookies, headers } = await import('next/headers');
    const headerStore = await headers();
    const headerSession = headerStore.get('x-demo-session');
    if (headerSession && /^[a-zA-Z0-9_-]{8,64}$/.test(headerSession)) {
      return headerSession;
    }
    const cookieStore = await cookies();
    const cookieSession = cookieStore.get('rollos_demo_session')?.value;
    if (cookieSession && /^[a-zA-Z0-9_-]{8,64}$/.test(cookieSession)) {
      return cookieSession;
    }
    return null;
  } catch {
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
