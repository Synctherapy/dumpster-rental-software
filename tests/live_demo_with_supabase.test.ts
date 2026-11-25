import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';

const req = createRequire(import.meta.url);
const serverOnlyPath = req.resolve('server-only');
req.cache[serverOnlyPath] = {
  id: serverOnlyPath,
  filename: serverOnlyPath,
  loaded: true,
  exports: {},
} as unknown as NodeModule;

const dbWrites: { table: string; op: string }[] = [];

const supabasePath = req.resolve('../src/lib/server/supabase');
req.cache[supabasePath] = {
  id: supabasePath,
  filename: supabasePath,
  loaded: true,
  exports: {
    admin() {
      return {
        from(table: string) {
          return {
            select() {
              const query = {
                eq() {
                  return query;
                },
                in() {
                  return Promise.resolve({ data: [], error: null });
                },
                single() {
                  return Promise.resolve({ data: null, error: { message: 'Row not found' } });
                },
                maybeSingle() {
                  return Promise.resolve({ data: null, error: null });
                },
              };
              return query;
            },
            upsert() {
              dbWrites.push({ table, op: 'upsert' });
              return {
                select() {
                  return Promise.resolve({
                    data: null,
                    error: { message: 'Unexpected production DB upsert for demo org' },
                  });
                },
              };
            },
            insert() {
              dbWrites.push({ table, op: 'insert' });
              return Promise.resolve({
                data: null,
                error: { message: 'Unexpected production DB insert for demo org' },
              });
            },
            update() {
              dbWrites.push({ table, op: 'update' });
              const query = {
                eq() {
                  return query;
                },
                is() {
                  return query;
                },
                select() {
                  return query;
                },
                single() {
                  return Promise.resolve({ data: null, error: { message: 'Unexpected update' } });
                },
              };
              return query;
            },
          };
        },
        rpc(fn: string) {
          if (fn === 'rate_limit_hit') {
            return Promise.resolve({
              data: [{ allowed: true, count: 1, retry_after_s: 0 }],
              error: null,
            });
          }
          dbWrites.push({ table: `rpc:${fn}`, op: 'rpc' });
          return Promise.resolve({
            data: null,
            error: { message: `Unexpected RPC ${fn} for demo org` },
          });
        },
      };
    },
    async identity() {
      throw new Error('UNAUTHORIZED');
    },
    async maybeIdentity() {
      return null;
    },
  },
} as unknown as NodeModule;

import type * as StoreModule from '../src/lib/server/store';
import type * as PublicRouteModule from '../src/app/api/public/[slug]/route';
import type * as JobsModule from '../src/lib/server/jobs';
import type * as DriverLinkModule from '../src/app/api/driver-link/route';
import type * as DriverRouteModule from '../src/app/api/driver/[token]/route';
import type * as UploadRouteModule from '../src/app/api/upload/route';
import type * as PhotosRouteModule from '../src/app/api/photos/[file]/route';
import { seed } from '../src/lib/seed';
import { addDays, today } from '../src/lib/types';

const { isDemo, mutateDemo, readDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { GET: publicGet } = req('../src/app/api/public/[slug]/route') as typeof PublicRouteModule;
const { book, changeJob } = req('../src/lib/server/jobs') as typeof JobsModule;
const { POST: driverLinkPost } = req('../src/app/api/driver-link/route') as typeof DriverLinkModule;
const { GET: driverRouteGet } = req(
  '../src/app/api/driver/[token]/route',
) as typeof DriverRouteModule;
const { POST: uploadPost } = req('../src/app/api/upload/route') as typeof UploadRouteModule;
const { GET: photoGet } = req('../src/app/api/photos/[file]/route') as typeof PhotosRouteModule;

const ENV_KEYS = [
  'ROLLOS_DEMO',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DRIVER_TOKEN_SECRET',
] as const;

async function withProductionEnv(fn: () => Promise<void>) {
  await mutateDemo((d) => {
    Object.assign(d, seed());
  });
  const saved = new Map(ENV_KEYS.map((k) => [k, process.env[k]]));
  try {
    delete process.env.ROLLOS_DEMO;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://prod-example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-prod-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-prod-key';
    process.env.DRIVER_TOKEN_SECRET = '0123456789abcdef0123456789abcdef0123456789abcdef';
    assert.equal(isDemo(), false, 'must simulate production mode with Supabase configured');
    await fn();
  } finally {
    for (const [k, v] of saved) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
  }
}

test('live production mode serves /api/public/greenline while keeping mistyped slugs 404', async () => {
  await withProductionEnv(async () => {
    const okRes = await publicGet(new Request('https://rolloffdumpstersoftware.com/api/public/greenline'), {
      params: Promise.resolve({ slug: 'greenline' }),
    });
    assert.equal(okRes.status, 200);
    const body = (await okRes.json()) as { demo: boolean; organization: { name: string } };
    assert.equal(body.demo, true);
    assert.equal(body.organization.name, 'Greenline Hauling');

    // Mistyped slugs must still fail closed rather than becoming fake storefronts.
    const badRes = await publicGet(
      new Request('https://rolloffdumpstersoftware.com/api/public/nonexistent-typo-hauler'),
      { params: Promise.resolve({ slug: 'nonexistent-typo-hauler' }) },
    );
    assert.notEqual(badRes.status, 200);
    const badBody = (await badRes.json()) as { error: string };
    assert.match(badBody.error, /not found/i);
  });
});

test('live production mode completes demo booking, dispatch, driver route, and photo upload end-to-end without touching production tables', async () => {
  dbWrites.length = 0;
  await withProductionEnv(async () => {
    const delivery = addDays(today(), 2);
    const pickup = addDays(today(), 9);

    // 1. Visitor books a dumpster on /book/greenline
    const booked = await book(
      {
        slug: 'greenline',
        size_yards: 20,
        delivery_date: delivery,
        pickup_date: pickup,
        zip: '78704',
        customer_name: 'Live Demo Visitor',
        customer_phone: '512-555-0144',
        customer_email: 'visitor@example.com',
        delivery_address: '900 Demo Congress Ave, Austin, TX',
        notes: 'Testing live website demo',
        protective_boards: true,
        signature_name: 'Live Demo Visitor',
        accepted_terms: true,
        booking_key: randomUUID(),
      },
      '203.0.113.10',
      'https://rolloffdumpstersoftware.com',
    );
    assert.equal(booked.demo, true);
    assert.ok(booked.job?.id);

    // 2. Unsigned visitor dispatches the job on /dashboard
    const demoState = await readDemo();
    const available20 = demoState.containers.find(
      (c) => c.size_yards === 20 && c.status === 'yard' && !c.current_job_id,
    );
    assert.ok(available20, 'expected available 20-yard demo container');

    const dispatched = await changeJob(
      booked.job!.id,
      {
        status: 'dispatched',
        driver_id: 'driver-1',
        container_id: available20.id,
      },
      'https://rolloffdumpstersoftware.com',
    );
    assert.equal(dispatched.status, 'dispatched');

    // 3. Unsigned visitor opens a driver magic link in demo mode
    const linkRes = await driverLinkPost(
      new Request('https://rolloffdumpstersoftware.com/api/driver-link', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'https://rolloffdumpstersoftware.com',
        },
        body: JSON.stringify({ driver_id: 'driver-1' }),
      }),
    );
    assert.equal(linkRes.status, 200);
    const { url } = (await linkRes.json()) as { url: string };
    const token = url.replace('/driver/', '');

    const routeRes = await driverRouteGet(
      new Request(`https://rolloffdumpstersoftware.com/api/driver/${token}`),
      { params: Promise.resolve({ token }) },
    );
    assert.equal(routeRes.status, 200);
    const routeJson = (await routeRes.json()) as { demo: boolean; jobs: { id: string }[] };
    assert.equal(routeJson.demo, true);
    assert.ok(routeJson.jobs.some((j) => j.id === booked.job!.id));

    // 4. Demo driver uploads a delivery photo and marks delivered
    const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
    const form = new FormData();
    form.append('photo', new File([pngBytes], 'proof.png', { type: 'image/png' }));
    form.append('job_id', booked.job!.id);
    form.append('token', token);

    const uploadRes = await uploadPost(
      new Request('https://rolloffdumpstersoftware.com/api/upload', {
        method: 'POST',
        headers: { origin: 'https://rolloffdumpstersoftware.com' },
        body: form,
      }),
    );
    assert.equal(uploadRes.status, 200);
    const { url: photoUrl } = (await uploadRes.json()) as { url: string };
    assert.match(photoUrl, /^\/api\/photos\/[0-9a-f-]+\.png$/);

    const file = photoUrl.split('/').pop()!;
    const servedPhoto = await photoGet(new Request(`https://rolloffdumpstersoftware.com${photoUrl}`), {
      params: Promise.resolve({ file }),
    });
    assert.equal(servedPhoto.status, 200);

    const delivered = await changeJob(
      booked.job!.id,
      { status: 'delivered', proof_url: photoUrl },
      'https://rolloffdumpstersoftware.com',
      { org: demoState.organization.id, driver: 'driver-1' },
    );
    assert.equal(delivered.status, 'delivered');

    assert.equal(dbWrites.length, 0, 'demo actions must never write to production Supabase tables');
  });
});
