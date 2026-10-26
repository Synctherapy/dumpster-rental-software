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

import type * as JobsModule from '../src/lib/server/jobs';
import type * as StoreModule from '../src/lib/server/store';
import type * as ContractorRouteModule from '../src/app/api/contractor/[slug]/route';
import type * as RemindersRouteModule from '../src/app/api/reminders/route';

const { chargeInvoice, changeJob, swapContainer } = req(
  '../src/lib/server/jobs',
) as typeof JobsModule;
const { mutateDemo, readDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { GET: contractorGet, POST: contractorPost } = req(
  '../src/app/api/contractor/[slug]/route',
) as typeof ContractorRouteModule;
const { GET: remindersGet } = req(
  '../src/app/api/reminders/route',
) as typeof RemindersRouteModule;

test('GET /api/contractor/[slug] returns active bins and consolidated monthly Net-30 statement', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const request = new Request(
    'http://localhost:3000/api/contractor/greenline?account=Apex+Roofing',
    { method: 'GET' },
  );
  const res = await contractorGet(request, {
    params: Promise.resolve({ slug: 'greenline' }),
  });
  assert.equal(res.status, 200);

  const json = (await res.json()) as {
    organization: Record<string, unknown>;
    jobs: Array<{ id: string }>;
    statement: {
      account_name: string;
      billing_period: string;
      jobs_count: number;
      base_rental_cents: number;
      total_due_cents: number;
      line_items: Array<{ job_id: string }>;
    };
  };

  assert.equal(json.statement.account_name, 'Apex Roofing');
  assert.ok(json.statement.billing_period.includes('Consolidated Net-30'));
  assert.ok(json.statement.jobs_count > 0);
  assert.ok(json.statement.total_due_cents >= json.statement.base_rental_cents);
  assert.equal(json.organization.calendar_token, undefined);
  assert.equal(json.organization.twilio_phone_sid, undefined);
});

test('POST /api/contractor/[slug] action=order creates Net-30 commercial job without credit card re-entry', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const request = new Request('http://localhost:3000/api/contractor/greenline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'order',
      account_name: 'Tony Rizzo Roofing',
      customer_name: 'Tony Rizzo',
      customer_phone: '5125550199',
      customer_email: 'tony@rizzoroofing.com',
      delivery_address: '1420 South Lamar Blvd, Austin, TX',
      zip: '78704',
      size_yards: 20,
      delivery_date: '2026-11-05',
      notes: 'Drop near shingle pallet on left side of driveway',
    }),
  });

  const res = await contractorPost(request, {
    params: Promise.resolve({ slug: 'greenline' }),
  });
  assert.equal(res.status, 200);

  const json = (await res.json()) as {
    ok: boolean;
    job: {
      id: string;
      is_commercial: boolean;
      payment_type: string;
      status: string;
      notes: string;
    };
  };

  assert.equal(json.ok, true);
  assert.equal(json.job.is_commercial, true);
  assert.equal(json.job.payment_type, 'net_30');
  assert.equal(json.job.status, 'booked');
  assert.ok(json.job.notes.includes('[VIP CONTRACTOR: Tony Rizzo Roofing]'));
});

test('POST /api/contractor/[slug] action=swap executes 1-tap swap and resolves container lock contention', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const demoData = await readDemo();
  const activeJob = demoData.jobs.find(
    (j) => j.status === 'delivered' && j.container_id !== null,
  )!;
  assert.ok(activeJob);
  const originalContainerId = activeJob.container_id;

  const request = new Request('http://localhost:3000/api/contractor/greenline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'swap',
      job_id: activeJob.id,
      account_name: 'Tony Rizzo Roofing',
      target_size: activeJob.size_yards,
      delivery_date: '2026-11-06',
      notes: 'Crew 1 filled bin by 11:30 AM, need fresh 20yd before 1 PM',
    }),
  });

  const res = await contractorPost(request, {
    params: Promise.resolve({ slug: 'greenline' }),
  });
  assert.equal(res.status, 200);

  const json = (await res.json()) as {
    ok: boolean;
    swap_job: {
      id: string;
      is_swap: boolean;
      is_commercial: boolean;
      payment_type: string;
      container_id: string | null;
      swap_parent_job_id: string | null;
      swapped_from_container_label: string | null;
    };
    previous_job: {
      id: string;
      container_id: string | null;
    };
  };

  assert.equal(json.ok, true);
  assert.equal(json.swap_job.is_swap, true);
  assert.equal(json.swap_job.is_commercial, true);
  assert.equal(json.swap_job.payment_type, 'net_30');
  assert.equal(json.swap_job.swap_parent_job_id, activeJob.id);
  assert.ok(json.swap_job.swapped_from_container_label);

  // Original container remains on previous_job while replacement container is distinct
  assert.equal(json.previous_job.container_id, originalContainerId);
  if (json.swap_job.container_id) {
    assert.notEqual(json.swap_job.container_id, originalContainerId);
  }
});

test('swapContainer assigns distinct yard container and populates swap_parent_job_id & swapped_from_container_label', async () => {
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });

  const demoData = await readDemo();
  const deliveredJob = demoData.jobs.find(
    (j) => j.status === 'delivered' && j.container_id !== null,
  )!;
  assert.ok(deliveredJob);

  const res = await swapContainer(
    deliveredJob.id,
    {
      target_size: deliveredJob.size_yards,
      delivery_date: '2026-11-07',
      driver_id: 'driver-1',
    },
    'http://localhost:3000',
  );

  assert.equal(res.swap_job.swap_parent_job_id, deliveredJob.id);
  assert.ok(res.swap_job.swapped_from_container_label);
  assert.equal(res.previous_job.container_id, deliveredJob.container_id);
});

test('chargeInvoice requires scale ticket on overage and sends automated final receipt SMS with certified scale ticket link', async () => {
  const targetJobId = await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
    const j = d.jobs.find((item) => item.id === 'job-8') ?? d.jobs[0]!;
    j.status = 'picked_up';
    j.tons_actual = j.tons_included + 1.5;
    j.scale_ticket_url = null;
    d.payments = d.payments.filter((p) => p.idempotency_key !== `invoice-${j.id}`);
    d.notifications_log = d.notifications_log.filter(
      (n) => !(n.job_id === j.id && n.template === 'invoice_receipt'),
    );
    return j.id;
  });

  const demoData = await readDemo();
  const pickedUpJob = demoData.jobs.find((j) => j.id === targetJobId)!;
  assert.ok(pickedUpJob);

  // Attempting to charge overage without scale ticket must reject
  await assert.rejects(
    async () => {
      await chargeInvoice(pickedUpJob.id);
    },
    {
      message: 'Attach the landfill scale ticket before charging an overage.',
    },
  );

  // Attach certified landfill scale ticket
  await changeJob(
    pickedUpJob.id,
    { scale_ticket_url: '/api/photos/certified-scale-slip-104.jpg' },
    'http://localhost:3000',
  );

  // Charge invoice now succeeds and triggers automated SMS receipt with agreement/scale-ticket link
  const payment = await chargeInvoice(pickedUpJob.id);
  assert.ok(payment);

  const fresh = await readDemo();
  const receiptSms = fresh.notifications_log.find(
    (n) => n.job_id === pickedUpJob.id && n.template === 'invoice_receipt',
  );
  assert.ok(receiptSms, 'Expected automated invoice_receipt SMS notification to be logged');
  assert.equal(receiptSms.channel, 'sms');
});

test('GET /api/reminders preserves dedicated Twilio phone number past 45 days of inactivity when on Winter Yard Hold ($10/mo)', async () => {
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  await mutateDemo((d) => {
    d.organization.subscription_status = 'winter_hold';
    d.organization.twilio_phone_number = '+15125550199';
    d.organization.twilio_phone_sid = 'PN_WINTER_HOLD_TEST';
    d.organization.last_booking_at = sixtyDaysAgo;
    d.organization.number_warning_sent_at = null;
  });

  const res = await remindersGet(new Request('http://localhost:3000/api/reminders'));
  assert.equal(res.status, 200);

  const after = await readDemo();
  assert.equal(
    after.organization.twilio_phone_number,
    '+15125550199',
    'Winter Yard Hold must preserve dedicated Twilio phone number during off-season inactivity',
  );
  assert.equal(after.organization.number_warning_sent_at, null);

  // Restore active state for demo store
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
    d.organization.last_booking_at = new Date().toISOString();
  });
});

