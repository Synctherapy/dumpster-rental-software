import 'server-only';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';
import { seed } from '../seed';
import type { Workspace } from '../types';
const directory = process.env.ROLLOS_DATA_DIR || path.join(process.cwd(), '.rollos');
const filename = path.join(directory, 'demo.json');
const globalStore = globalThis as typeof globalThis & {
  rollosDemoQueue?: { queue: Promise<unknown> };
};
const state = (globalStore.rollosDemoQueue ??= { queue: Promise.resolve() });
export function isDemo() {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
    return false;
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
    throw new Error('Supabase configuration is incomplete. Demo fallback is disabled.');
  if (process.env.NODE_ENV === 'production' && process.env.ROLLOS_DEMO !== 'true')
    throw new Error('Set up Supabase or explicitly enable ROLLOS_DEMO=true for a demo deployment.');
  return true;
}
export async function readDemo(): Promise<Workspace> {
  await state.queue;
  try {
    return JSON.parse(await readFile(filename, 'utf8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    return seed();
  }
}
// One Node process owns the local demo file. Hosted multi-instance deployments use Postgres.
export async function mutateDemo<T>(fn: (data: Workspace) => T | Promise<T>): Promise<T> {
  const run = state.queue.then(async () => {
    let data: Workspace;
    try {
      data = JSON.parse(await readFile(filename, 'utf8'));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      data = seed();
    }
    const result = await fn(data);
    await mkdir(directory, { recursive: true });
    await writeFile(filename + '.tmp', JSON.stringify(data, null, 2), { mode: 0o600 });
    await rename(filename + '.tmp', filename);
    return result;
  });
  state.queue = run.catch(() => {});
  return run;
}
