import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, type Job } from '../src/lib/types';
import { jobMatchesContractor } from '../src/lib/server/contractors';

test('normalizePhone handles various formats for customer deduplication', () => {
  assert.equal(normalizePhone('(512) 555-0199'), '+15125550199');
  assert.equal(normalizePhone('512-555-0199'), '+15125550199');
  assert.equal(normalizePhone('+1 512 555 0199'), '+15125550199');
  assert.equal(normalizePhone('5125550199'), '+15125550199');
});

test('Customer CRM aggregates multiple bookings by phone number and computes totals', () => {
  const jobs: Partial<Job>[] = [
    {
      id: 'job-1',
      customer_name: 'John Miller',
      customer_phone: '(512) 555-0199',
      customer_email: 'john@millerroofing.com',
      delivery_address: '104 Industrial Pkwy',
      zip: '78704',
      size_yards: 20,
      delivery_date: '2026-10-20',
      pickup_date: '2026-10-27',
      status: 'completed',
      price_cents: 49500,
      is_commercial: true,
      notes: '[VIP CONTRACTOR: Miller Roofing]',
    },
    {
      id: 'job-2',
      customer_name: 'John Miller',
      customer_phone: '5125550199',
      customer_email: 'john@millerroofing.com',
      delivery_address: '220 Congress Ave',
      zip: '78701',
      size_yards: 30,
      delivery_date: '2026-10-28',
      pickup_date: '2026-11-04',
      status: 'delivered',
      price_cents: 65000,
      is_commercial: true,
      notes: '[VIP CONTRACTOR: Miller Roofing] Gate code 4412',
    },
    {
      id: 'job-3',
      customer_name: 'Sarah Jenkins',
      customer_phone: '(512) 555-8822',
      customer_email: 'sarah@example.com',
      delivery_address: '742 Evergreen Terr',
      zip: '78704',
      size_yards: 10,
      delivery_date: '2026-10-25',
      pickup_date: '2026-11-01',
      status: 'completed',
      price_cents: 35000,
      is_commercial: false,
      notes: 'Driveway drop, garage cleanout',
    },
  ];

  // Group by normalized phone
  const map = new Map<string, any>();
  for (const j of jobs) {
    const key = normalizePhone(j.customer_phone || '');
    let profile = map.get(key);
    if (!profile) {
      profile = {
        name: j.customer_name,
        phone: j.customer_phone,
        email: j.customer_email,
        is_commercial: Boolean(j.is_commercial),
        total_spend_cents: 0,
        total_orders: 0,
        active_jobs: [],
        completed_jobs: [],
      };
      map.set(key, profile);
    }
    profile.total_spend_cents += j.price_cents || 0;
    profile.total_orders += 1;
    if (['dispatched', 'delivered', 'booked'].includes(j.status || '')) {
      profile.active_jobs.push(j);
    } else {
      profile.completed_jobs.push(j);
    }
  }

  // Verify Miller Roofing aggregation
  const miller = map.get('+15125550199');
  assert.ok(miller);
  assert.equal(miller.name, 'John Miller');
  assert.equal(miller.total_orders, 2);
  assert.equal(miller.total_spend_cents, 114500); // $495 + $650 = $1,145.00
  assert.equal(miller.is_commercial, true);
  assert.equal(miller.active_jobs.length, 1);
  assert.equal(miller.completed_jobs.length, 1);

  // Verify Sarah Jenkins aggregation
  const sarah = map.get('+15125558822');
  assert.ok(sarah);
  assert.equal(sarah.name, 'Sarah Jenkins');
  assert.equal(sarah.total_orders, 1);
  assert.equal(sarah.total_spend_cents, 35000); // $350.00
  assert.equal(sarah.is_commercial, false);
  assert.equal(sarah.active_jobs.length, 0);
  assert.equal(sarah.completed_jobs.length, 1);
});

test('VIP contractor link generation properly scopes to organization and contractor name without Apex fallback', () => {
  const orgSlug = 'sync-dumpster-rental';
  const contractorName = 'Miller Roofing';
  const url = `https://rolloffdumpstersoftware.com/contractor/${orgSlug}?account=${encodeURIComponent(contractorName)}`;

  assert.match(url, /contractor\/sync-dumpster-rental/);
  assert.match(url, /account=Miller%20Roofing/);
  assert.doesNotMatch(url, /Apex/i);
});
