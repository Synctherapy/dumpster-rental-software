import { addDays, today, type Workspace, type Job, type JobStatus } from './types';
import { quote } from './pricing';
export const demoOrg = '00000000-0000-4000-8000-000000000001';
export function seed(): Workspace {
  const org_id = demoOrg;
  const pricing_rules = [10, 20, 30, 40].map((size, i) => ({
    id: `rule-${size}`,
    org_id,
    size_yards: size,
    base_price_cents: [32500, 42500, 52500, 62500][i],
    included_days: 7,
    extra_day_cents: 2000,
    included_tons: [1, 2, 3, 4][i],
    overage_per_ton_cents: 8500,
    service_zips: [
      '78701',
      '78702',
      '78703',
      '78704',
      '78705',
      '78745',
      '78748',
      '78749',
      '78750',
      '78613',
      '78660',
    ],
  }));
  const users: Workspace['users'] = [
    { id: 'owner', org_id, name: 'Alex Morgan', phone: '', role: 'owner' },
    { id: 'driver-1', org_id, name: 'Marcus Johnson', phone: '', role: 'driver' },
    { id: 'driver-2', org_id, name: 'Sarah Chen', phone: '', role: 'driver' },
    { id: 'driver-3', org_id, name: 'David Miller', phone: '', role: 'driver' },
  ];
  const containers: Workspace['containers'] = Array.from({ length: 18 }, (_, i) => ({
    id: `container-${i + 1}`,
    org_id,
    label: `GL-${String(i + 1).padStart(3, '0')}`,
    size_yards: [10, 20, 20, 30, 40, 10][i % 6],
    status: i === 17 ? 'maintenance' : 'yard',
    current_job_id: null,
  }));
  const examples: [string, string, number, JobStatus, number, string][] = [
    ['James Wilson', '1420 South Lamar Blvd', 20, 'booked', 0, 'Home renovation'],
    ['Olivia Martinez', '805 East 6th Street', 30, 'booked', 1, 'Construction debris'],
    ['Noah Thompson', '2401 Barton Springs Rd', 10, 'booked', 2, 'Garage cleanout'],
    ['Emma Davis', '1800 East Cesar Chavez St', 20, 'dispatched', 0, 'Kitchen remodel'],
    ['Liam Anderson', '6300 West William Cannon Dr', 40, 'dispatched', 1, 'Commercial demolition'],
    ['Sophia Garcia', '3100 South Congress Ave', 20, 'delivered', -2, 'Roofing project'],
    ['William Brown', '1205 West 5th Street', 30, 'delivered', -3, 'Full home renovation'],
    ['Isabella Lee', '4400 Burnet Road', 10, 'picked_up', -7, 'Yard cleanup'],
    ['Lucas Taylor', '2210 Riverside Drive', 20, 'completed', -8, 'Residential cleanout'],
  ];
  const jobs: Job[] = examples.map(([name, address, size, status, offset, notes], i) => {
    const rule = pricing_rules.find((r) => r.size_yards === size)!;
    const delivery_date = addDays(today(), offset);
    const pickup_date = addDays(delivery_date, 7);
    const container = containers.find(
      (c) => c.size_yards === size && !c.current_job_id && c.status === 'yard',
    );
    const active = ['dispatched', 'delivered'].includes(status);
    if (active && container) {
      container.current_job_id = `job-${i + 1}`;
      container.status = 'on_site';
    }
    return {
      id: `job-${i + 1}`,
      org_id,
      customer_name: name,
      customer_phone: '+15125550100',
      customer_email: `${name.split(' ')[0].toLowerCase()}@example.com`,
      delivery_address: address + ', Austin, TX',
      zip: '78704',
      size_yards: size,
      delivery_date,
      pickup_date,
      status,
      price_cents: rule.base_price_cents,
      deposit_cents: quote(rule, delivery_date, pickup_date, 25).deposit,
      tons_included: rule.included_tons,
      tons_actual: status === 'completed' ? 2.5 : null,
      extra_day_cents: rule.extra_day_cents,
      driver_id: active ? users[1 + (i % 3)].id : null,
      container_id: active ? (container?.id ?? null) : null,
      notes,
      signature: { name, timestamp: new Date().toISOString(), ip: 'demo' },
      created_at: new Date().toISOString(),
      delivered_at: status === 'delivered' ? new Date().toISOString() : null,
      picked_up_at: null,
      proof_url: null,
      stripe_customer_id: null,
      stripe_payment_method_id: null,
      booking_key: `seed-${i}`,
      pricing_snapshot: rule,
    };
  });
  return {
    organization: {
      id: org_id,
      name: 'Greenline Hauling',
      slug: 'greenline',
      phone: '+15125550100',
      timezone: 'America/Chicago',
      stripe_connect_account_id: null,
      subscription_status: 'inactive',
      pricing_config: { deposit_percent: 25, tax_rate_percent: 8.25 },
      tax_rate_percent: 8.25,
      calendar_token: 'demo-calendar-token',
      google_review_url: 'https://g.page/r/sample-google-review',
    },
    users,
    containers,
    jobs,
    pricing_rules,
    payments: jobs.map((j) => ({
      id: `payment-${j.id}`,
      org_id,
      job_id: j.id,
      stripe_payment_intent_id: null,
      amount_cents: j.deposit_cents,
      application_fee_cents: Math.round(j.deposit_cents * 0.01),
      status: 'demo',
      idempotency_key: `deposit-${j.id}`,
      created_at: j.created_at,
      refunded_cents: 0,
    })),
    notifications_log: [],
    demo: true,
  };
}
