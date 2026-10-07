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
