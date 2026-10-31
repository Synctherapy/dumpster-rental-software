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
