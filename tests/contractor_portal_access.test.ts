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

const {
  contractorToken,
  verifyContractorToken,
  driverToken,
  verifyDriverToken,
  driverLinkTtlMs,
  driverLinkTtlForPickup,
  latestActivePickup,
  MIN_DRIVER_LINK_MS,
  MAX_DRIVER_LINK_MS,
} = req('../src/lib/server/tokens') as typeof TokensModule;
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

test('driver links last 7 days by default, and respect DRIVER_LINK_TTL_HOURS', () => {
  const previous = process.env.DRIVER_LINK_TTL_HOURS;
  const fallback = 168 * 3600000;
  try {
    delete process.env.DRIVER_LINK_TTL_HOURS;
    assert.equal(driverLinkTtlMs(), fallback, 'default covers a full rental cycle');

    process.env.DRIVER_LINK_TTL_HOURS = '24';
    assert.equal(driverLinkTtlMs(), 24 * 3600000, 'a shorter window must be configurable');

    process.env.DRIVER_LINK_TTL_HOURS = '720';
    assert.equal(driverLinkTtlMs(), 720 * 3600000);

    // Out-of-range and nonsense values fall back rather than granting a long link.
    for (const bad of ['0', '-5', '100000', 'forever', '']) {
      process.env.DRIVER_LINK_TTL_HOURS = bad;
      assert.equal(driverLinkTtlMs(), fallback, `${bad || '(empty)'} must fall back`);
    }
  } finally {
    if (previous === undefined) delete process.env.DRIVER_LINK_TTL_HOURS;
    else process.env.DRIVER_LINK_TTL_HOURS = previous;
  }
});

test('a driver token issued now expires within the configured window', () => {
  const token = driverToken('org-1', 'driver-1');
  const claim = verifyDriverToken(token);
  const hours = (claim.exp - Date.now()) / 3600000;
  assert.ok(hours > 167 && hours <= 168, `expected ~168h, got ${hours.toFixed(2)}h`);
});

function daysFromNow(days: number) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

test('a driver link ends the day after the pickup it was sent for', () => {
  // A 7-day rental should give roughly an 8-day link, a 14-day rental 15.
  const week = driverLinkTtlForPickup(daysFromNow(7)) / 86400000;
  assert.ok(week > 7.5 && week <= 9, `7-day rental gave ${week.toFixed(2)} days`);

  const fortnight = driverLinkTtlForPickup(daysFromNow(14)) / 86400000;
  assert.ok(fortnight > 14.5 && fortnight <= 16, `14-day rental gave ${fortnight.toFixed(2)} days`);

  assert.ok(fortnight > week, 'a longer rental must give a longer-lived link');
});

test('a same-day job still gives the driver a usable window', () => {
  // Measured from the start of the pickup day, so a job picked up today already
  // runs past tomorrow without needing the floor.
  const sameDay = driverLinkTtlForPickup(daysFromNow(0));
  assert.ok(
    sameDay >= MIN_DRIVER_LINK_MS,
    `same-day pickup gave ${(sameDay / 3600000).toFixed(1)}h`,
  );
  assert.ok(sameDay < 2 * 86400000, 'but not longer than the job needs');

  // The floor is what protects a link issued for a pickup already in the past.
  assert.equal(driverLinkTtlForPickup(daysFromNow(-3)), MIN_DRIVER_LINK_MS);
});

test('a long rental is covered, but a mistyped year is not', () => {
  // Settings allow up to 90 included days, so a 90-day rental must get a link
  // that outlives it rather than being clipped by the ceiling.
  const ninety = driverLinkTtlForPickup(daysFromNow(90)) / 86400000;
  assert.ok(ninety > 90.5 && ninety <= 92, `90-day rental gave ${ninety.toFixed(2)} days`);

  assert.equal(driverLinkTtlForPickup('2099-01-01'), MAX_DRIVER_LINK_MS);
  assert.equal(MAX_DRIVER_LINK_MS, 120 * 86400000);
});

test('a missing or malformed pickup date falls back to the configured default', () => {
  const fallback = driverLinkTtlMs();
  for (const bad of [null, undefined, '', 'next tuesday', '2026-13-45x', '26-01-01']) {
    assert.equal(driverLinkTtlForPickup(bad as string | null | undefined), fallback, `${bad}`);
  }
});

test('an issued dispatch link really expires after that job pickup', () => {
  const pickup = daysFromNow(14);
  const token = driverToken('org-1', 'driver-1', driverLinkTtlForPickup(pickup));
  const days = (verifyDriverToken(token).exp - Date.now()) / 86400000;
  assert.ok(days > 14.5 && days <= 16, `expected ~15 days, got ${days.toFixed(2)}`);
});

test('a link sent outside any one job covers the driver latest pickup', () => {
  const jobs = [
    { driver_id: 'driver-1', status: 'dispatched', pickup_date: daysFromNow(3) },
    { driver_id: 'driver-1', status: 'delivered', pickup_date: daysFromNow(12) },
    { driver_id: 'driver-1', status: 'completed', pickup_date: daysFromNow(40) },
    { driver_id: 'driver-2', status: 'dispatched', pickup_date: daysFromNow(30) },
  ];
  // The finished job and the other driver's job must not extend this link.
  assert.equal(latestActivePickup(jobs, 'driver-1'), daysFromNow(12));
  assert.equal(latestActivePickup([], 'driver-1'), null);
});
