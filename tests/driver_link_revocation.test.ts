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
import type * as StoreModule from '../src/lib/server/store';
import type * as DriverLinkModule from '../src/app/api/driver-link/route';
import type * as DriverRouteModule from '../src/app/api/driver/[token]/route';

const { driverToken, verifyDriverToken, verifyActiveDriverToken, assertDriverLinkActive } = req(
  '../src/lib/server/tokens',
) as typeof TokensModule;
const { readDemo, mutateDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { POST: driverLinkPost } = req('../src/app/api/driver-link/route') as typeof DriverLinkModule;
const { GET: driverRouteGet } = req(
  '../src/app/api/driver/[token]/route',
) as typeof DriverRouteModule;

const DRIVER = 'driver-1';

async function clearRevocation() {
  await mutateDemo((d) => {
    const driver = d.users.find((u) => u.id === DRIVER);
    if (driver) driver.links_revoked_at = null;
  });
}

function post(body: unknown) {
  return new Request('http://localhost:3000/api/driver-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin: 'http://localhost:3000' },
    body: JSON.stringify(body),
  });
}

test('a driver token records when it was issued', () => {
  const claim = verifyDriverToken(driverToken('org-1', DRIVER));
  assert.ok(typeof claim.iat === 'number', 'an issue time is required to revoke anything');
  assert.ok(claim.iat! <= Date.now() && claim.iat! > Date.now() - 60000);
  assert.ok(claim.exp > claim.iat!);
});

test('cancelling links refuses the link already on the driver phone', async () => {
  await clearRevocation();
  const org = (await readDemo()).organization.id;
  const existing = driverToken(org, DRIVER);

  // Works before cancelling.
  await verifyActiveDriverToken(existing);

  const res = await driverLinkPost(post({ driver_id: DRIVER, revoke: true }));
  assert.equal(res.status, 200);
  const body = (await res.json()) as { revoked: boolean; revoked_at: string };
  assert.equal(body.revoked, true);

  await assert.rejects(() => verifyActiveDriverToken(existing), /cancelled/i);
});

test('the driver route itself refuses a cancelled link', async () => {
  await clearRevocation();
  const org = (await readDemo()).organization.id;
  const existing = driverToken(org, DRIVER);

  const before = await driverRouteGet(new Request('http://localhost:3000/x'), {
    params: Promise.resolve({ token: existing }),
  });
  assert.equal(before.status, 200);

  await driverLinkPost(post({ driver_id: DRIVER, revoke: true }));

  const after = await driverRouteGet(new Request('http://localhost:3000/x'), {
    params: Promise.resolve({ token: existing }),
  });
  assert.notEqual(after.status, 200);
  const err = (await after.json()) as { error: string };
  assert.match(err.error, /cancelled/i);
});

test('issuing a new link after cancelling restores access', async () => {
  await clearRevocation();
  const org = (await readDemo()).organization.id;
  const old = driverToken(org, DRIVER);
  await driverLinkPost(post({ driver_id: DRIVER, revoke: true }));
  await assert.rejects(() => verifyActiveDriverToken(old), /cancelled/i);

  // The hauler sends a fresh link; the driver is back at work.
  const issued = await driverLinkPost(post({ driver_id: DRIVER }));
  const { url } = (await issued.json()) as { url: string };
  const fresh = url.replace('/driver/', '');
  await verifyActiveDriverToken(fresh);

  // And the cancelled one stays cancelled.
  await assert.rejects(() => verifyActiveDriverToken(old), /cancelled/i);
});

test('a link with no issue time is refused once a driver has been cancelled', async () => {
  // Links minted before this feature carry no issue time. Once a driver has
  // been cancelled there is no way to tell such a link is recent, so the safe
  // reading is that it is old.
  await clearRevocation();
  const org = (await readDemo()).organization.id;

  await assertDriverLinkActive({ org, driver: DRIVER });

  await driverLinkPost(post({ driver_id: DRIVER, revoke: true }));
  await assert.rejects(() => assertDriverLinkActive({ org, driver: DRIVER }), /cancelled/i);
});

test('cancelling one driver does not touch another', async () => {
  await clearRevocation();
  const org = (await readDemo()).organization.id;
  const other = 'driver-2';
  await mutateDemo((d) => {
    const driver = d.users.find((u) => u.id === other);
    if (driver) driver.links_revoked_at = null;
  });

  const otherToken = driverToken(org, other);
  await driverLinkPost(post({ driver_id: DRIVER, revoke: true }));
  await verifyActiveDriverToken(otherToken);
});

test('cancelling refuses an unknown driver', async () => {
  const res = await driverLinkPost(post({ driver_id: 'not-a-driver', revoke: true }));
  assert.notEqual(res.status, 200);
  const err = (await res.json()) as { error: string };
  assert.match(err.error, /driver not found/i);
});

test('a demo link names the sandbox it was issued from', async () => {
  const org = (await readDemo()).organization.id;
  const claim = verifyDriverToken(driverToken(org, DRIVER, undefined, 'sandbox-aaaaaaaaaaaa'));
  assert.equal(claim.sid, 'sandbox-aaaaaaaaaaaa');

  // Issued without one, nothing is carried.
  assert.equal(verifyDriverToken(driverToken(org, DRIVER)).sid, undefined);
});

test('cancelling in one sandbox does not cancel a link from another', async () => {
  const org = (await readDemo()).organization.id;
  const theirs = 'sandbox-bbbbbbbbbbbb';
  const someoneElse = 'sandbox-cccccccccccc';

  // Each sandbox starts from the seed, so neither driver is cancelled.
  await mutateDemo((d) => {
    const driver = d.users.find((u) => u.id === DRIVER);
    if (driver) driver.links_revoked_at = null;
  }, theirs);
  await mutateDemo((d) => {
    const driver = d.users.find((u) => u.id === DRIVER);
    if (driver) driver.links_revoked_at = null;
  }, someoneElse);

  const theirLink = driverToken(org, DRIVER, undefined, theirs);
  const otherLink = driverToken(org, DRIVER, undefined, someoneElse);

  await mutateDemo((d) => {
    const driver = d.users.find((u) => u.id === DRIVER);
    if (driver) driver.links_revoked_at = new Date().toISOString();
  }, theirs);

  await assert.rejects(() => verifyActiveDriverToken(theirLink), /cancelled/i);
  await verifyActiveDriverToken(otherLink);
});
