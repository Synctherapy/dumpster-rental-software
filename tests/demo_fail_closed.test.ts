import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const req = createRequire(import.meta.url);
const serverOnlyPath = req.resolve('server-only');
req.cache[serverOnlyPath] = {
  id: serverOnlyPath,
  filename: serverOnlyPath,
  loaded: true,
  exports: {},
} as unknown as NodeModule;

import type * as StoreModule from '../src/lib/server/store';
const { isDemo } = req('../src/lib/server/store') as typeof StoreModule;

const KEYS = [
  'ROLLOS_DEMO',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

/** Runs fn with exactly the given Supabase-related variables set. */
function withEnv(env: Partial<Record<(typeof KEYS)[number], string>>, fn: () => void) {
  const saved = new Map(KEYS.map((k) => [k, process.env[k]]));
  try {
    for (const k of KEYS) delete process.env[k];
    for (const [k, v] of Object.entries(env)) process.env[k] = v;
    fn();
  } finally {
    for (const [k, v] of saved) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

test('no Supabase configuration at all runs the demo', () => {
  withEnv({}, () => assert.equal(isDemo(), true));
});

test('complete Supabase configuration runs for real', () => {
  withEnv(
    {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon',
      SUPABASE_SERVICE_ROLE_KEY: 'service',
    },
    () => assert.equal(isDemo(), false),
  );
});

test('partial Supabase configuration fails closed instead of becoming a public demo', () => {
  // One dropped variable used to silently turn a production deployment into an
  // open sandbox. README.md and CLAUDE.md both promise it fails instead.
  withEnv({ NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' }, () => {
    assert.throws(() => isDemo(), /incomplete/i);
  });
  withEnv(
    {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon',
    },
    () => {
      assert.throws(() => isDemo(), /SUPABASE_SERVICE_ROLE_KEY/);
    },
  );
});

test('the failure names the missing variables and never their values', () => {
  withEnv(
    { NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'sh-secret-value' },
    () => {
      try {
        isDemo();
        assert.fail('expected incomplete configuration to throw');
      } catch (err) {
        const message = (err as Error).message;
        assert.match(message, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
        assert.doesNotMatch(message, /sh-secret-value/, 'must not leak a key value');
        assert.doesNotMatch(message, /example\.supabase\.co/, 'must not echo configuration values');
      }
    },
  );
});

test('ROLLOS_DEMO=true runs the demo deliberately, even with partial configuration', () => {
  withEnv(
    { ROLLOS_DEMO: 'true', NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co' },
    () => assert.equal(isDemo(), true),
  );
});
