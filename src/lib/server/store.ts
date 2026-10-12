import 'server-only';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { seed } from '../seed';
import type { Workspace } from '../types';

const directory = process.env.ROLLOS_DATA_DIR || path.join(process.cwd(), '.rollos');
const filename = path.join(directory, 'demo.json');

const globalStore = globalThis as typeof globalThis & {
  rollosDemoQueue?: { queue: Promise<unknown> };
  rollosDemoMemory?: Workspace;
  rollosFsDisabled?: boolean;
};

const state = (globalStore.rollosDemoQueue ??= { queue: Promise.resolve() });

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

function getMemoryData(): Workspace {
  if (!globalStore.rollosDemoMemory) {
    globalStore.rollosDemoMemory = seed();
  }
  return globalStore.rollosDemoMemory;
}

export async function readDemo(): Promise<Workspace> {
  await state.queue;
  if (globalStore.rollosFsDisabled) {
    return getMemoryData();
  }
  try {
    const data = JSON.parse(await readFile(filename, 'utf8'));
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

// One Node process owns the local demo file. Hosted multi-instance deployments use Postgres.
export async function mutateDemo<T>(fn: (data: Workspace) => T | Promise<T>): Promise<T> {
  const run = state.queue.then(async () => {
    let data: Workspace;
    if (globalStore.rollosFsDisabled) {
      data = getMemoryData();
    } else {
      try {
        data = JSON.parse(await readFile(filename, 'utf8'));
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
        await writeFile(filename + '.tmp', JSON.stringify(data, null, 2), { mode: 0o600 });
        await rename(filename + '.tmp', filename);
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
