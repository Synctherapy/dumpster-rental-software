import { defineConfig } from '@playwright/test';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  fullyParallel: false,
  timeout: 60000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'http://127.0.0.1:3100',
    headless: true,
    launchOptions: {
      ...(existsSync('/usr/bin/chromium') ? { executablePath: '/usr/bin/chromium' } : {}),
      args: ['--no-sandbox'],
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --hostname 127.0.0.1 --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
    timeout: 120000,
    env: { ROLLOS_DEMO: 'true', ROLLOS_DATA_DIR: mkdtempSync(path.join(tmpdir(), 'rollos-e2e-')) },
  },
});
