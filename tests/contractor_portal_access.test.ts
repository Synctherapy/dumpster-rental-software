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

import type * as TokensModule from '../src/lib/server/tokens';
import type * as ContractorLinkModule from '../src/app/api/contractor-link/route';

const { contractorToken, verifyContractorToken, driverToken, verifyDriverToken } = req(
  '../src/lib/server/tokens',
) as typeof TokensModule;
const { POST: contractorLinkPost } = req(
  '../src/app/api/contractor-link/route',
) as typeof ContractorLinkModule;

test('contractor token round-trips the organization and trade account', () => {
  const token = contractorToken('org-1', 'Tony Rizzo Roofing');
  const claim = verifyContractorToken(token);
  assert.equal(claim.org, 'org-1');
  assert.equal(claim.account, 'Tony Rizzo Roofing');
  assert.ok(claim.exp > Date.now());
});

test('contractor token rejects a tampered account name', () => {
  const token = contractorToken('org-1', 'Tony Rizzo Roofing');
  const [, signature] = token.split('.');
  const forged =
    Buffer.from(
      JSON.stringify({ org: 'org-1', account: 'Someone Else', exp: Date.now() + 60000 }),
    ).toString('base64url') +
    '.' +
    signature;
  assert.throws(() => verifyContractorToken(forged), /Invalid contractor portal link/);
});

test('contractor token rejects a tampered signature', () => {
  const token = contractorToken('org-1', 'Tony Rizzo Roofing');
  const [payload] = token.split('.');
  assert.throws(
    () => verifyContractorToken(`${payload}.${Buffer.from('nope').toString('base64url')}`),
    /Invalid contractor portal link/,
  );
});

test('contractor token refuses to outlive its expiry', () => {
  const expired = contractorToken('org-1', 'Tony Rizzo Roofing', -1000);
  assert.throws(() => verifyContractorToken(expired), /expired/);
});

test('driver and contractor tokens are not interchangeable', () => {
  // Both are signed with the same secret, so the payload shape must be checked.
  const driver = driverToken('org-1', 'driver-1');
  assert.throws(() => verifyContractorToken(driver), /Invalid contractor portal link/);

  const contractor = contractorToken('org-1', 'Tony Rizzo Roofing');
  assert.throws(() => verifyDriverToken(contractor), /Invalid driver link/);
});

test('POST /api/contractor-link mints a signed link scoped to the caller organization', async () => {
  const request = new Request('http://localhost:3000/api/contractor-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin: 'http://localhost:3000' },
    body: JSON.stringify({ account_name: 'Tony Rizzo Roofing' }),
  });
  const res = await contractorLinkPost(request);
  assert.equal(res.status, 200);
  const json = (await res.json()) as { url: string; account_name: string };
  assert.equal(json.account_name, 'Tony Rizzo Roofing');

  const token = new URL(`http://localhost:3000${json.url}`).searchParams.get('t');
  assert.ok(token, 'link must carry a signed token');
  const claim = verifyContractorToken(token!);
  assert.equal(claim.account, 'Tony Rizzo Roofing');
  assert.ok(claim.org.length > 0);
});

test('POST /api/contractor-link rejects a cross-site caller', async () => {
  const request = new Request('http://localhost:3000/api/contractor-link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      origin: 'https://attacker.example',
      'sec-fetch-site': 'cross-site',
    },
    body: JSON.stringify({ account_name: 'Tony Rizzo Roofing' }),
  });
  const res = await contractorLinkPost(request);
  assert.equal(res.status, 403);
});
