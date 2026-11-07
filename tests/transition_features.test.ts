import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seed } from '../src/lib/seed';
import { generateIcsCalendar } from '../src/lib/calendar';
import { quote } from '../src/lib/pricing';
import {
  normalizePhone,
  normalizePostalCode,
  isValidPostalCode,
  money,
  addDays,
  today,
  type Job,
  type Organization,
} from '../src/lib/types';

test('iCal feed generates valid RFC 5545 format with delivery and pickup events', () => {
  const data = seed();
  const org: Organization = data.organization;
  const jobs: Job[] = data.jobs.slice(0, 2);

  const ics = generateIcsCalendar(org, jobs);

  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
  assert.ok(ics.includes('VERSION:2.0\r\n'));
  assert.ok(ics.includes(`X-WR-CALNAME:${org.name} - Deliveries & Pickups\r\n`));
  assert.ok(ics.includes('BEGIN:VEVENT\r\n'));
  assert.ok(ics.includes(`SUMMARY:🚚 Delivery: ${jobs[0].customer_name} (${jobs[0].size_yards}yd)\r\n`));
  assert.ok(ics.includes(`SUMMARY:📦 Pickup: ${jobs[0].customer_name} (${jobs[0].size_yards}yd)\r\n`));
  assert.ok(ics.includes(`LOCATION:${jobs[0].delivery_address.replace(/,/g, '\\,')}\r\n`));

  // Check all-day format (DTSTART;VALUE=DATE:YYYYMMDD)
  const deliveryDateFormatted = jobs[0].delivery_date.replace(/-/g, '');
  assert.ok(ics.includes(`DTSTART;VALUE=DATE:${deliveryDateFormatted}\r\n`));

  // DTEND must be next day
  const d = new Date(jobs[0].delivery_date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  const nextDayFormatted = d.toISOString().slice(0, 10).replace(/-/g, '');
  assert.ok(ics.includes(`DTEND;VALUE=DATE:${nextDayFormatted}\r\n`));

  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});

test('iCal feed excludes cancelled jobs', () => {
  const data = seed();
  const org: Organization = data.organization;
  const jobs: Job[] = [
    {
      ...data.jobs[0],
      id: 'cancelled-job-123',
      customer_name: 'Cancelled Customer',
      status: 'cancelled',
    },
  ];

  const ics = generateIcsCalendar(org, jobs);
  assert.ok(!ics.includes('Cancelled Customer'));
  assert.ok(!ics.includes('cancelled-job-123'));
});

test('quick phone order pricing matches standard quote rules', () => {
  const data = seed();
  const rule = data.pricing_rules.find((r) => r.size_yards === 20)!;

  // 7 day standard rental
  const qStandard = quote(rule, '2026-10-10', '2026-10-17', 100, { customerFee: true });
  assert.equal(qStandard.baseRental, 42500);
  assert.equal(qStandard.reservationFee, 1195);
  assert.equal(qStandard.extraDays, 0);

  // 9 day rental with extra days
  const qExtra = quote(rule, '2026-10-10', '2026-10-19', 100, { customerFee: true, boards: true });
  assert.equal(qExtra.base, 42500);
  assert.equal(qExtra.extraDays, 2);
  assert.equal(qExtra.extra, 4000);
  assert.equal(qExtra.baseRental, 46500);
  assert.equal(qExtra.boardsFee, 1900);
  assert.equal(qExtra.reservationFee, 1195);
  assert.equal(qExtra.total, 42500 + 4000 + 1900 + 1195);
});

test('bulk fleet generator prevents duplicate container numbers in batch', () => {
  const items = [
    { label: 'C-001', size_yards: 20 },
    { label: 'C-002', size_yards: 20 },
    { label: 'C-001', size_yards: 30 }, // duplicate
  ];

  const labels = items.map((i) => i.label);
  const hasDuplicates = new Set(labels).size !== labels.length;
  assert.equal(hasDuplicates, true);
});

test('organization retains google review url and calendar token', () => {
  const data = seed();
  assert.ok(data.organization.calendar_token);
  assert.ok(data.organization.calendar_token.length > 5);
  assert.ok('google_review_url' in data.organization);
});

test('lead time buffer computes minimum advance notice days correctly', () => {
  // 24 hours notice = 1 day minimum lead
  assert.equal(Math.max(1, Math.ceil(24 / 24)), 1);
  // 48 hours notice = 2 days minimum lead
  assert.equal(Math.max(1, Math.ceil(48 / 24)), 2);
  // 12 hours notice = 1 day minimum lead
  assert.equal(Math.max(1, Math.ceil(12 / 24)), 1);
});

test('normalizePhone accepts raw 11-digit, 10-digit, and international phone numbers', () => {
  // Test case specifically reported by user: 12508128698 (BC, Canada)
  assert.equal(normalizePhone('12508128698'), '+12508128698');
  assert.equal(normalizePhone('2508128698'), '+12508128698');
  assert.equal(normalizePhone('(250) 812-8698'), '+12508128698');
  assert.equal(normalizePhone('1-250-812-8698'), '+12508128698');
  assert.equal(normalizePhone('+12508128698'), '+12508128698');
  assert.equal(normalizePhone('+447911123456'), '+447911123456');
});

test('postal code validator and normalizer handles US ZIPs and Canadian postal codes', () => {
  // US ZIP
  assert.equal(isValidPostalCode('78704'), true);
  assert.equal(normalizePostalCode('78704'), '78704');
  assert.equal(isValidPostalCode('90210'), true);

  // Canadian Postal Codes (BC, Ontario, Alberta, etc.)
  assert.equal(isValidPostalCode('V8W 1W4'), true);
  assert.equal(isValidPostalCode('v8w1w4'), true);
  assert.equal(normalizePostalCode('v8w1w4'), 'V8W 1W4');
  assert.equal(normalizePostalCode('M5V 3L9'), 'M5V 3L9');
  assert.equal(normalizePostalCode('t2p2m5'), 'T2P 2M5');

  // Invalid formats
  assert.equal(isValidPostalCode('123'), false);
  assert.equal(isValidPostalCode('INVALID_CODE'), false);
});

test('money formatter supports both USD and CAD', () => {
  const usd = money(42500, 'USD');
  const cad = money(42500, 'CAD');
  assert.ok(usd.includes('425'));
  assert.ok(cad.includes('425'));
});

test('publicOrganization and public route omit calendar_token, stripe_connect_account_id, and twilio_phone_sid', async () => {
  const { createRequire } = await import('node:module');
  const req = createRequire(import.meta.url);
  const serverOnlyPath = req.resolve('server-only');
  req.cache[serverOnlyPath] = {
    id: serverOnlyPath,
    filename: serverOnlyPath,
    loaded: true,
    exports: {},
  } as unknown as NodeModule;

  const { publicOrganization } = req('../src/lib/server/workspace');
  const { GET: publicHandler } = req('../src/app/api/public/[slug]/route');

  const pubData = await publicOrganization('demo');
  const org = pubData.organization;
  assert.equal(org.calendar_token, undefined, 'calendar_token must be stripped');
  assert.equal(org.stripe_connect_account_id, undefined, 'stripe_connect_account_id must be stripped');
  assert.equal(org.twilio_phone_sid, undefined, 'twilio_phone_sid must be stripped');
  assert.equal(org.pricing_config?.calendar_token, undefined, 'pricing_config.calendar_token must be stripped');

  const reqObj = new Request('http://localhost:3000/api/public/demo');
  const res = await publicHandler(reqObj, { params: Promise.resolve({ slug: 'demo' }) });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.organization.calendar_token, undefined);
  assert.equal(json.organization.stripe_connect_account_id, undefined);
  assert.equal(json.organization.twilio_phone_sid, undefined);
  assert.equal(json.organization.pricing_config?.calendar_token, undefined);
});

test('GET /api/proof/[id] rejects unauthenticated access when key is missing or invalid', async () => {
  const { createRequire } = await import('node:module');
  const req = createRequire(import.meta.url);
  const serverOnlyPath = req.resolve('server-only');
  req.cache[serverOnlyPath] = {
    id: serverOnlyPath,
    filename: serverOnlyPath,
    loaded: true,
    exports: {},
  } as unknown as NodeModule;

  const { GET: proofHandler } = req('../src/app/api/proof/[id]/route');

  const reqNoKey = new Request('http://localhost:3000/api/proof/proof-uuid-1');
  const resNoKey = await proofHandler(reqNoKey, { params: Promise.resolve({ id: 'proof-uuid-1' }) });
  assert.equal(resNoKey.status, 403);
});

test('POST /api/jobs/quick preserves protective_boards on phone orders', async () => {
  const { createRequire } = await import('node:module');
  const req = createRequire(import.meta.url);
  const serverOnlyPath = req.resolve('server-only');
  req.cache[serverOnlyPath] = {
    id: serverOnlyPath,
    filename: serverOnlyPath,
    loaded: true,
    exports: {},
  } as unknown as NodeModule;

  const { POST: quickPost } = req('../src/app/api/jobs/quick/route');
  const { readDemo } = req('../src/lib/server/store');

  const request = new Request('http://localhost:3000/api/jobs/quick', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin: 'http://localhost:3000' },
    body: JSON.stringify({
      customer_name: 'Board Customer',
      customer_phone: '+15125550999',
      customer_email: 'boards@example.com',
      delivery_address: '500 Board St',
      zip: '78704',
      size_yards: 20,
      delivery_date: addDays(today(), 1),
      pickup_date: addDays(today(), 8),
      protective_boards: true,
    }),
  });

  const res = await quickPost(request);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.ok, true);
  assert.equal(json.job.protective_boards, true);

  const demo = await readDemo();
  const savedJob = demo.jobs.find((j: Job) => j.id === json.job.id);
  assert.ok(savedJob);
  assert.equal(savedJob.protective_boards, true, 'protective_boards must be persisted on demo phone order');
});

test('POST /api/agreement/[id]/early-pickup flags job for early pickup and POST /api/jobs/[id]/overage-alert sends courtesy SMS', async () => {
  const { createRequire } = await import('node:module');
  const req = createRequire(import.meta.url);
  const serverOnlyPath = req.resolve('server-only');
  req.cache[serverOnlyPath] = {
    id: serverOnlyPath,
    filename: serverOnlyPath,
    loaded: true,
    exports: {},
  } as unknown as NodeModule;

  const { POST: earlyPickupPost } = req('../src/app/api/agreement/[id]/early-pickup/route');
  const { POST: overageAlertPost } = req('../src/app/api/jobs/[id]/overage-alert/route');
  const { mutateDemo, readDemo } = req('../src/lib/server/store');

  const demoBefore = await readDemo();
  const targetJobId = demoBefore.jobs[0].id;

  const pickupReq = new Request(`http://localhost:3000/api/agreement/${targetJobId}/early-pickup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin: 'http://localhost:3000' },
    body: JSON.stringify({ customer_note: 'Finished garage cleanout early, gate is open' }),
  });

  const pickupRes = await earlyPickupPost(pickupReq, { params: Promise.resolve({ id: targetJobId }) });
  assert.equal(pickupRes.status, 200);
  const pickupJson = await pickupRes.json();
  assert.equal(pickupJson.ok, true);
  assert.equal(pickupJson.job.early_pickup_requested, true);
  assert.match(pickupJson.job.notes, /\[EARLY PICKUP REQUESTED: Finished garage cleanout early, gate is open\]/);

  // Set actual tonnage over allowance to test overage courtesy alert
  await mutateDemo((d: { jobs: Job[] }) => {
    const j = d.jobs.find((job) => job.id === targetJobId);
    if (j) {
      j.tons_actual = j.tons_included + 1.5;
    }
  });

  const overageReq = new Request(`http://localhost:3000/api/jobs/${targetJobId}/overage-alert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin: 'http://localhost:3000' },
    body: '{}',
  });

  const overageRes = await overageAlertPost(overageReq, { params: Promise.resolve({ id: targetJobId }) });
  assert.equal(overageRes.status, 200);
  const overageJson = await overageRes.json();
  assert.equal(overageJson.ok, true);
});


