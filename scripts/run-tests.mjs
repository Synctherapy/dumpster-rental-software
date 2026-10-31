#!/usr/bin/env node
// Runs the test suite against a throwaway data directory.
//
// The demo store lives in .rollos/ and its path is resolved when the module
// loads, so it cannot be redirected from inside a test. Without this, a running
// `npm run dev` (or any stray `next start`) writes to the same demo file the
// suite reads, and tests fail for reasons that have nothing to do with the code.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dataDir = mkdtempSync(join(tmpdir(), 'rollos-test-'));

const result = spawnSync(
  process.execPath,
  [
    join('node_modules', 'tsx', 'dist', 'cli.mjs'),
    '--test',
    '--test-concurrency=1',
    ...(process.argv.slice(2).length ? process.argv.slice(2) : ['tests/*.test.ts']),
  ],
  {
    stdio: 'inherit',
    env: { ...process.env, ROLLOS_DATA_DIR: dataDir },
  },
);

try {
  rmSync(dataDir, { recursive: true, force: true });
} catch {}

process.exit(result.status ?? 1);
