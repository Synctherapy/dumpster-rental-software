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

import type * as PricingModule from '../src/lib/pricing';
import type * as JobsModule from '../src/lib/server/jobs';
import type * as StoreModule from '../src/lib/server/store';
import type * as BillingRouteModule from '../src/app/api/billing/route';
import type * as SwapRouteModule from '../src/app/api/jobs/[id]/swap/route';
import type * as SettingsRouteModule from '../src/app/api/settings/route';

const {
  STARTER_SUBSCRIPTION_CENTS,
  GROWTH_SUBSCRIPTION_CENTS,
  SUBSCRIPTION_CENTS,
} = req('../src/lib/pricing') as typeof PricingModule;
const {
  changeJob,
  recordOfflinePayment,
  swapContainer,
} = req('../src/lib/server/jobs') as typeof JobsModule;
const { mutateDemo, readDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { POST: billingHandler } = req('../src/app/api/billing/route') as typeof BillingRouteModule;
const { POST: swapHandler } = req('../src/app/api/jobs/[id]/swap/route') as typeof SwapRouteModule;
const { POST: settingsHandler } = req('../src/app/api/settings/route') as typeof SettingsRouteModule;

test('tiered subscription pricing constants are correctly defined', () => {
  assert.equal(STARTER_SUBSCRIPTION_CENTS, 2900); // $29/mo
  assert.equal(GROWTH_SUBSCRIPTION_CENTS, 14900); // $149/mo
  assert.equal(SUBSCRIPTION_CENTS, 2900);
});

test('offline payment gating rejects when organization subscription is inactive', async () => {
  // Ensure subscription_status is inactive in demo store
  await mutateDemo((d) => {
    d.organization.subscription_status = 'inactive';
  });

  const demoData = await readDemo();
  const job = demoData.jobs.find((j) => ['dispatched', 'delivered'].includes(j.status))!;
  assert.ok(job);

  for (const offlineType of ['cash', 'check', 'net_30', 'in_person_card']) {
    await assert.rejects(
      async () => {
        await changeJob(
          job.id,
          { payment_type: offlineType },
          'http://localhost:3000',
        );
      },
      {
        message:
          'Offline payments (cash/check/net-30) require an active Starter ($29/mo) or Growth ($149/mo) plan.',
      },
    );

    await assert.rejects(
      async () => {
        await recordOfflinePayment(job.id, {
          type: offlineType,
        });
      },
      {
        message:
          'Offline payments (cash/check/net-30) require an active Starter ($29/mo) or Growth ($149/mo) plan.',
      },
    );
  }
});

test('offline payment gating allows recording when organization subscription is active', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const demoData = await readDemo();
  const job = demoData.jobs.find((j) => ['dispatched', 'delivered'].includes(j.status))!;
  assert.ok(job);

  const updated = await changeJob(
    job.id,
    { payment_type: 'cash' },
    'http://localhost:3000',
  );
  assert.equal(updated.payment_type, 'cash');

  const recorded = await recordOfflinePayment(job.id, {
    type: 'check',
    amount_cents: 42500,
  });
  assert.equal(recorded.ok, true);
  assert.equal(recorded.job.payment_type, 'check');
  assert.equal(recorded.payment.status, 'demo');
  assert.equal(recorded.payment.amount_cents, 42500);
});

test('container swap rejects when subscription is not active', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'inactive';
  });

  const demoData = await readDemo();
  const job = demoData.jobs.find((j) => ['delivered', 'dispatched'].includes(j.status))!;

  await assert.rejects(
    async () => {
      await swapContainer(job.id, {}, 'http://localhost:3000');
    },
    {
      message: 'Container swaps require an active Starter ($29/mo) or Growth ($149/mo) plan.',
    },
  );
});

test('container swap rejects when original job is not in delivered or dispatched status', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const demoData = await readDemo();
  const completedJob = demoData.jobs.find((j) => j.status === 'completed')!;
  assert.ok(completedJob);

  await assert.rejects(
    async () => {
      await swapContainer(completedJob.id, {}, 'http://localhost:3000');
    },
    {
      message: 'Job must be delivered or dispatched to execute a container swap.',
    },
  );
});

test('container swap successfully creates linked replacement job when active', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const demoData = await readDemo();
  const deliveredJob = demoData.jobs.find((j) => j.status === 'delivered')!;
  assert.ok(deliveredJob);

  const res = await swapContainer(
    deliveredJob.id,
    {
      target_size: 30,
      delivery_date: '2026-10-15',
      driver_id: 'driver-1',
      notes: 'Customer requested swap before noon',
    },
    'http://localhost:3000',
  );

  assert.ok(res.swap_job);
  assert.ok(res.previous_job);
  assert.equal(res.previous_job.id, deliveredJob.id);

  // Check replacement job attributes
  const swap = res.swap_job;
  assert.equal(swap.is_swap, true);
  assert.equal(swap.size_yards, 30);
  assert.equal(swap.delivery_date, '2026-10-15');
  assert.equal(swap.driver_id, 'driver-1');
  assert.equal(swap.status, 'dispatched');
  assert.equal(swap.delivery_address, deliveredJob.delivery_address);
  assert.equal(swap.customer_name, deliveredJob.customer_name);
  assert.ok(swap.notes.includes('Swap replacement for container'));
  assert.ok(swap.notes.includes('Customer requested swap before noon'));

  // Verify in demo store
  const freshStore = await readDemo();
  const storedSwap = freshStore.jobs.find((j) => j.id === swap.id);
  assert.ok(storedSwap);
  assert.equal(storedSwap.is_swap, true);
});

test('POST /api/jobs/[id]/swap route functions correctly', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const demoData = await readDemo();
  const dispatchedJob = demoData.jobs.find((j) => j.status === 'dispatched')!;
  assert.ok(dispatchedJob);

  const req = new Request('http://localhost:3000/api/jobs/' + dispatchedJob.id + '/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_size: 20 }),
  });

  const response = await swapHandler(req, {
    params: Promise.resolve({ id: dispatchedJob.id }),
  });
  assert.equal(response.status, 200);

  const json = (await response.json()) as {
    swap_job: { is_swap: boolean; size_yards: number; delivery_address: string };
    previous_job: { id: string };
  };
  assert.ok(json.swap_job);
  assert.equal(json.swap_job.is_swap, true);
  assert.equal(json.swap_job.size_yards, 20);
  assert.equal(json.swap_job.delivery_address, dispatchedJob.delivery_address);
});

test('POST /api/billing route activates subscription in demo mode', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'inactive';
  });

  const billingReq = new Request('http://localhost:3000/api/billing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan: 'growth' }),
  });

  const res = await billingHandler(billingReq);
  assert.equal(res.status, 200);
  const json = (await res.json()) as { url: string };
  assert.ok(json.url.includes('/settings?billing=success'));

  const after = await readDemo();
  assert.equal(after.organization.subscription_status, 'active');
});

test('POST /api/settings rejects disabling customer fee when plan is inactive', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'inactive';
  });

  const demoData = await readDemo();
  const req = new Request('http://localhost:3000/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: demoData.organization.name,
      slug: demoData.organization.slug,
      phone: demoData.organization.phone,
      currency: 'usd',
      deposit_percent: 100,
      customer_fee_enabled: false, // Attempt to disable fee without active plan
      pricing_rules: demoData.pricing_rules.map((r) => ({
        size_yards: r.size_yards,
        base_price_cents: r.base_price_cents,
        included_days: r.included_days,
        extra_day_cents: r.extra_day_cents,
        included_tons: r.included_tons,
        overage_per_ton_cents: r.overage_per_ton_cents,
        service_zips: r.service_zips,
      })),
    }),
  });

  const res = await settingsHandler(req);
  assert.equal(res.status, 400);
  const json = (await res.json()) as { error: string };
  assert.equal(
    json.error,
    'Disabling the $11.95 reservation fee requires an active Starter ($29/mo) or Growth ($149/mo) plan.',
  );
});

test('POST /api/settings allows custom dumpster size (e.g. 15-yard) and allows disabling fee when active', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const demoData = await readDemo();
  const customRules = [
    {
      size_yards: 15,
      base_price_cents: 37500,
      included_days: 7,
      extra_day_cents: 2000,
      included_tons: 2,
      overage_per_ton_cents: 8500,
      service_zips: ['78704'],
    },
    {
      size_yards: 20,
      base_price_cents: 42500,
      included_days: 7,
      extra_day_cents: 2000,
      included_tons: 2,
      overage_per_ton_cents: 8500,
      service_zips: ['78704'],
    },
  ];

  const req = new Request('http://localhost:3000/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: demoData.organization.name,
      slug: demoData.organization.slug,
      phone: demoData.organization.phone,
      currency: 'usd',
      deposit_percent: 100,
      customer_fee_enabled: false,
      pricing_rules: customRules,
    }),
  });

  const res = await settingsHandler(req);
  assert.equal(res.status, 200);

  const after = await readDemo();
  assert.equal(after.organization.pricing_config.customer_fee_enabled, false);
  const rule15 = after.pricing_rules.find((r) => r.size_yards === 15);
  assert.ok(rule15);
  assert.equal(rule15.base_price_cents, 37500);
});

