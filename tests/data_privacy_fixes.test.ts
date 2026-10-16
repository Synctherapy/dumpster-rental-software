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

import type * as WorkspaceModule from '../src/lib/server/workspace';
import type * as PublicRouteModule from '../src/app/api/public/[slug]/route';
import type * as SettingsRouteModule from '../src/app/api/settings/route';
import type * as ProofRouteModule from '../src/app/api/proof/[id]/route';
import type * as AuthRouteModule from '../src/app/api/auth/route';
import type * as StoreModule from '../src/lib/server/store';

const { publicOrganization } = req('../src/lib/server/workspace') as typeof WorkspaceModule;
const { GET: publicHandler } = req('../src/app/api/public/[slug]/route') as typeof PublicRouteModule;
const { POST: settingsHandler } = req('../src/app/api/settings/route') as typeof SettingsRouteModule;
const { GET: proofHandler } = req('../src/app/api/proof/[id]/route') as typeof ProofRouteModule;
const { POST: authHandler } = req('../src/app/api/auth/route') as typeof AuthRouteModule;
const { readDemo, mutateDemo } = req('../src/lib/server/store') as typeof StoreModule;

test('publicOrganization strips calendar_token, stripe_connect_account_id, and twilio_phone_sid', async () => {
  // Ensure demo store has sensitive tokens populated
  await mutateDemo((d) => {
    d.organization.calendar_token = 'secret-calendar-token-123';
    d.organization.pricing_config.calendar_token = 'secret-calendar-token-123';
    d.organization.stripe_connect_account_id = 'acct_secret_123';
    d.organization.twilio_phone_sid = 'PN_secret_123';
  });

  const res = await publicOrganization('demo');
  const org = res.organization as Record<string, unknown>;

  assert.equal(org.calendar_token, undefined, 'calendar_token must be stripped');
  assert.equal(org.stripe_connect_account_id, undefined, 'stripe_connect_account_id must be stripped');
  assert.equal(org.twilio_phone_sid, undefined, 'twilio_phone_sid must be stripped');

  const config = org.pricing_config as Record<string, unknown> | undefined;
  assert.ok(config, 'pricing_config should exist');
  assert.equal(config.calendar_token, undefined, 'pricing_config.calendar_token must be stripped');
});

test('GET /api/public/[slug] omits calendar_token and internal tokens from JSON response', async () => {
  await mutateDemo((d) => {
    d.organization.calendar_token = 'secret-calendar-token-123';
    d.organization.pricing_config.calendar_token = 'secret-calendar-token-123';
    d.organization.stripe_connect_account_id = 'acct_secret_123';
    d.organization.twilio_phone_sid = 'PN_secret_123';
  });

  const reqObj = new Request('http://localhost:3000/api/public/demo');
  const res = await publicHandler(reqObj, { params: Promise.resolve({ slug: 'demo' }) });
  assert.equal(res.status, 200);

  const json = await res.json();
  const org = json.organization;

  assert.equal(org.calendar_token, undefined, 'calendar_token must not be in json');
  assert.equal(org.stripe_connect_account_id, undefined, 'stripe_connect_account_id must not be in json');
  assert.equal(org.twilio_phone_sid, undefined, 'twilio_phone_sid must not be in json');
  assert.equal(org.pricing_config?.calendar_token, undefined, 'pricing_config.calendar_token must not be in json');
});

test('POST /api/settings preserves existing calendar_token in demo mode', async () => {
  const secretToken = 'active-subscriber-token-999';
  await mutateDemo((d) => {
    d.organization.calendar_token = secretToken;
    d.organization.pricing_config.calendar_token = secretToken;
  });

  const reqObj = new Request('http://localhost:3000/api/settings', {
    method: 'POST',
    headers: {
      origin: 'http://localhost:3000',
      host: 'localhost:3000',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Retained Token Hauler',
      phone: '5125551234',
      slug: 'retained-token-hauler',
      deposit_percent: 50,
      customer_fee_enabled: true,
      pricing_rules: [
        {
          size_yards: 10,
          base_price_cents: 35000,
          included_days: 7,
          extra_day_cents: 1500,
          included_tons: 2,
          overage_per_ton_cents: 8500,
          service_zips: ['78701'],
        },
      ],
    }),
  });

  const res = await settingsHandler(reqObj);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);

  const updated = await readDemo();
  assert.equal(updated.organization.name, 'Retained Token Hauler');
  assert.equal(updated.organization.calendar_token, secretToken);
  assert.equal(updated.organization.pricing_config.calendar_token, secretToken);
});

test('GET /api/proof/[id] rejects unauthenticated requests without matching key', async () => {
  const reqNoKey = new Request('http://localhost:3000/api/proof/proof-uuid-1');
  const resNoKey = await proofHandler(reqNoKey, { params: Promise.resolve({ id: 'proof-uuid-1' }) });
  assert.equal(resNoKey.status, 403); // Missing key throws FORBIDDEN (403)

  const reqBadKey = new Request('http://localhost:3000/api/proof/proof-uuid-1?key=wrong-key');
  const resBadKey = await proofHandler(reqBadKey, { params: Promise.resolve({ id: 'proof-uuid-1' }) });
  // Non-existent proof ID throws 'Proof not found' (400)
  assert.equal(resBadKey.status, 400);
});

test('POST /api/auth returns demo success in demo mode and rejects cross-site requests', async () => {
  // Demo mode signup returns ok: true, demo: true
  const signupReq = new Request('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: {
      origin: 'http://localhost:3000',
      host: 'localhost:3000',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      action: 'signup',
      email: 'owner@example.com',
      password: 'password123',
      name: 'Test Owner',
      company: 'Test Hauling Co',
    }),
  });
  const res = await authHandler(signupReq);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.ok, true);
  assert.equal(json.demo, true);

  // Cross-site request is rejected with 403 FORBIDDEN
  const evilReq = new Request('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: {
      origin: 'https://evil.com',
      'sec-fetch-site': 'cross-site',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      action: 'signup',
      email: 'owner@example.com',
      password: 'password123',
    }),
  });
  const evilRes = await authHandler(evilReq);
  assert.equal(evilRes.status, 403);
});
