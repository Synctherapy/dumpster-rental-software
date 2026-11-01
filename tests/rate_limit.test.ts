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

import type * as RateLimitModule from '../src/lib/server/rate-limit';
import type * as AuthRouteModule from '../src/app/api/auth/route';

const { allowRequest, clientIp, LIMITS, enforceRateLimit } = req(
  '../src/lib/server/rate-limit',
) as typeof RateLimitModule;
const { POST: authPost } = req('../src/app/api/auth/route') as typeof AuthRouteModule;

test('a bucket allows its budget and then refuses', async () => {
  const bucket = `unit:${Math.random()}`;
  for (let i = 0; i < 3; i += 1) {
    assert.equal(await allowRequest(bucket, 3, 60), true, `call ${i + 1} should be allowed`);
  }
  assert.equal(await allowRequest(bucket, 3, 60), false, 'the fourth is over budget');
  assert.equal(await allowRequest(bucket, 3, 60), false, 'and it stays refused');
});

test('buckets are independent', async () => {
  const a = `unit:a:${Math.random()}`;
  const b = `unit:b:${Math.random()}`;
  assert.equal(await allowRequest(a, 1, 60), true);
  assert.equal(await allowRequest(a, 1, 60), false);
  assert.equal(await allowRequest(b, 1, 60), true, 'a different caller has its own budget');
});

test('the window rolls forward', async () => {
  const bucket = `unit:window:${Math.random()}`;
  assert.equal(await allowRequest(bucket, 1, 1), true);
  assert.equal(await allowRequest(bucket, 1, 1), false);
  await new Promise((resolve) => setTimeout(resolve, 1100));
  assert.equal(await allowRequest(bucket, 1, 1), true, 'budget returns once the window passes');
});

test('the caller address prefers the header the platform controls', () => {
  const request = new Request('http://localhost:3000/x', {
    headers: {
      'x-vercel-forwarded-for': '203.0.113.5',
      'x-real-ip': '198.51.100.1',
      'x-forwarded-for': '1.1.1.1, 2.2.2.2',
    },
  });
  assert.equal(clientIp(request), '203.0.113.5');

  const fallback = new Request('http://localhost:3000/x', {
    headers: { 'x-forwarded-for': '1.1.1.1, 2.2.2.2' },
  });
  assert.equal(clientIp(fallback), '1.1.1.1', 'takes the first hop, not the chain');

  assert.equal(clientIp(new Request('http://localhost:3000/x')), 'unknown-client');
});

test('enforceRateLimit throws the error that becomes a 429', async () => {
  const request = new Request('http://localhost:3000/x', {
    headers: { 'x-real-ip': `203.0.113.${Math.floor(Math.random() * 200) + 1}` },
  });
  for (let i = 0; i < LIMITS.sign.limit; i += 1) {
    await enforceRateLimit(request, 'sign');
  }
  await assert.rejects(() => enforceRateLimit(request, 'sign'), /RATE_LIMITED/);
});

test('POST /api/auth answers 429 once a caller is over budget', async () => {
  const ip = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
  const call = () =>
    authPost(
      new Request('http://localhost:3000/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:3000',
          'x-real-ip': ip,
        },
        body: JSON.stringify({ action: 'login', email: 'a@example.com', password: 'password123' }),
      }),
    );

  for (let i = 0; i < LIMITS.auth.limit; i += 1) {
    const res = await call();
    assert.notEqual(res.status, 429, `call ${i + 1} must be within budget`);
  }

  const limited = await call();
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('Retry-After'), '60');
  const body = (await limited.json()) as { error: string };
  assert.match(body.error, /too many requests/i);
});

test('callers behind one shared address get independent budgets', async () => {
  // The case that matters for real haulers: an office behind a single router,
  // or two drivers on the same mobile network. Keying on identity rather than
  // address means one cannot spend the other's allowance.
  const sharedAddress = `203.0.113.${Math.floor(Math.random() * 200) + 1}`;
  const request = new Request('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: { 'x-real-ip': sharedAddress },
  });

  const driverA = `org-1:driver-a-${Math.random()}`;
  const driverB = `org-1:driver-b-${Math.random()}`;

  for (let i = 0; i < LIMITS.upload.limit; i += 1) {
    await enforceRateLimit(request, 'upload', driverA);
  }
  await assert.rejects(
    () => enforceRateLimit(request, 'upload', driverA),
    /RATE_LIMITED/,
    'the driver who used their allowance is limited',
  );

  // The second driver, same address, is untouched.
  await enforceRateLimit(request, 'upload', driverB);
  await enforceRateLimit(request, 'upload', driverB);
});

test('one hauler cannot exhaust another hauler phone-order budget', async () => {
  const request = new Request('http://localhost:3000/api/jobs/quick', { method: 'POST' });
  const orgA = `org-a-${Math.random()}`;
  const orgB = `org-b-${Math.random()}`;

  for (let i = 0; i < LIMITS.quickOrder.limit; i += 1) {
    await enforceRateLimit(request, 'quickOrder', orgA);
  }
  await assert.rejects(() => enforceRateLimit(request, 'quickOrder', orgA), /RATE_LIMITED/);
  await enforceRateLimit(request, 'quickOrder', orgB);
});

test('login throttles the account under attack, not the office it is attacked from', async () => {
  const office = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
  const request = new Request('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'x-real-ip': office },
  });

  const victim = `victim-${Math.random()}@example.com`;
  for (let i = 0; i < LIMITS.auth.limit; i += 1) {
    await enforceRateLimit(request, 'auth', victim);
  }
  await assert.rejects(() => enforceRateLimit(request, 'auth', victim), /RATE_LIMITED/);

  // A colleague at the same office signing into their own account is fine.
  await enforceRateLimit(request, 'auth', `colleague-${Math.random()}@example.com`);

  // The address guard is wide enough that it is not what a real office hits.
  assert.ok(
    LIMITS.authAddress.limit > LIMITS.auth.limit * 4,
    'the address guard must be far wider than a single account budget',
  );
});

test('a hauler at work is never throttled on the paths they use most', () => {
  // Marking a job delivered, picking it up, and reading the dashboard carry no
  // throttle at all: those are the actions a driver and dispatcher repeat all
  // day, and none of them cost money per call.
  const names = Object.keys(LIMITS);
  for (const unthrottled of ['driver', 'workspace', 'jobsPatch', 'calendar']) {
    assert.ok(!names.includes(unthrottled), `${unthrottled} must not have a budget`);
  }
});
