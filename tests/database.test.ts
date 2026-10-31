import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { addDays, today } from '../src/lib/types';
// Embedded real Postgres validates SQL functions and RLS without external credentials.
// Supabase auth/storage schemas and default grants are reproduced here; hosted integration
// acceptance still needs a real project. gen_random_uuid() is built into Postgres.
async function database() {
  const db = new PGlite();
  await db.exec(`
 create role anon; create role authenticated; create role service_role bypassrls;
 create schema auth; create schema storage;
 create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 grant usage on schema public,auth to authenticated,anon,service_role;
 alter default privileges in schema public grant select,insert,update,delete on tables to authenticated,service_role;
 `);
  const sql = await readFile('supabase/migrations/202610060001_foundation.sql', 'utf8');
  await db.exec(sql.replace('create extension if not exists pgcrypto;', ''));
  await db.exec(await readFile('supabase/migrations/202610060002_full_rental.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/202610060003_subscription.sql', 'utf8'));
  await db.exec(
    await readFile(
      'supabase/migrations/202610060004_prohibited_items_and_operating_days.sql',
      'utf8',
    ),
  );
  await db.exec(
    await readFile('supabase/migrations/202610080001_swap_and_offline_payments.sql', 'utf8'),
  );
  await db.exec(
    await readFile('supabase/migrations/202610090001_custom_dumpster_sizes.sql', 'utf8'),
  );
  await db.exec(await readFile('supabase/migrations/202610110001_pickup_proof.sql', 'utf8'));
  await db.exec(
    await readFile('supabase/migrations/202610140001_fix_payments_and_stripe_fees.sql', 'utf8'),
  );
  await db.exec(
    await readFile('supabase/migrations/202610140002_dedicated_twilio_numbers.sql', 'utf8'),
  );
  await db.exec(await readFile('supabase/migrations/202610310001_sms_opt_outs.sql', 'utf8'));
  await db.exec(
    await readFile('supabase/migrations/202610310002_job_columns_behind_code.sql', 'utf8'),
  );
  await db.exec(await readFile('supabase/migrations/202610310003_rate_limits.sql', 'utf8'));
  await db.exec(
    await readFile('supabase/migrations/202610310004_lock_organization_writes.sql', 'utf8'),
  );
  await db.exec(
    await readFile('supabase/migrations/202610310005_driver_link_revocation.sql', 'utf8'),
  );
  return db;
}
test('migration applies and tenant RLS rejects cross-organization access and role escalation', async () => {
  const db = await database();
  try {
    await db.exec(await readFile('supabase/tests/tenant_isolation.sql', 'utf8'));
  } finally {
    await db.close();
  }
});
test('payment failure, retried success, reordered failure, and refund are transactional and idempotent', async () => {
  const db = await database();
  try {
    const owner = randomUUID();
    await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2)', [
      owner,
      { name: 'Test Owner', company: 'SQL Test Hauler' },
    ]);
    const org = (await db.query<{ id: string }>('select id from public.organizations')).rows[0].id;
    await db.query("update organizations set stripe_connect_account_id='acct_test' where id=$1", [
      org,
    ]);
    await db.query("update pricing_rules set service_zips=array['78704'] where org_id=$1", [org]);
    const driver = randomUUID();
    await db.query("insert into users(id,org_id,name,role) values($1,$2,'Driver','driver')", [
      driver,
      org,
    ]);
    const container = randomUUID();
    await db.query("insert into containers(id,org_id,label,size_yards) values($1,$2,'T-1',20)", [
      container,
      org,
    ]);
    const input = {
      id: randomUUID(),
      org_id: org,
      size_yards: 20,
      zip: '78704',
      delivery_date: addDays(today(), 1),
      pickup_date: addDays(today(), 8),
      booking_key: randomUUID(),
      customer_name: 'Test Customer',
      customer_phone: '+15125550123',
      customer_email: 'sql@example.com',
      delivery_address: '123 Main Street',
      notes: '',
      signature: { name: 'Test Customer', timestamp: new Date().toISOString(), ip: 'test' },
    };
    const reservation = (
      await db.query<{ job: { id: string; deposit_cents: number } }>(
        'select reserve_booking($1) as job',
        [input],
      )
    ).rows[0].job;
    assert.equal(reservation.deposit_cents, 42500);
    const object = {
      id: 'pi_test_deposit',
      amount: 42500,
      application_fee_amount: 0,
      currency: 'usd',
      customer: 'cus_test',
      payment_method: 'pm_test',
      metadata: { job_id: reservation.id, org_id: org, kind: 'deposit' },
    };
    const event = async (id: string, type: string, o: unknown) =>
      db.query('select apply_stripe_event($1,$2,$3)', [id, type, o]);
    await event('evt_failed', 'payment_intent.payment_failed', object);
    assert.equal(
      (await db.query<{ status: string }>('select status from jobs')).rows[0].status,
      'quoted',
    );
    await event('evt_success', 'payment_intent.succeeded', object);
    await event('evt_success', 'payment_intent.succeeded', object);
    await event('evt_success_other', 'payment_intent.succeeded', object);
    await event('evt_late_failed', 'payment_intent.payment_failed', object);
    assert.equal(
      (await db.query<{ count: number }>('select count(*)::int as count from payments')).rows[0]
        .count,
      1,
    );
    assert.equal(
      (await db.query<{ status: string }>('select status from payments')).rows[0].status,
      'succeeded',
    );
    assert.equal(
      (await db.query<{ status: string }>('select status from jobs')).rows[0].status,
      'booked',
    );
    await db.query('select transition_job($1,$2,$3)', [
      reservation.id,
      org,
      { status: 'dispatched', driver_id: driver, container_id: container },
    ]);
    assert.equal(
      (await db.query<{ status: string }>('select status from containers')).rows[0].status,
      'on_site',
    );
    await assert.rejects(
      db.query('select transition_job($1,$2,$3)', [reservation.id, org, { status: 'delivered' }]),
      /proof/i,
    );
    await db.query('select transition_job($1,$2,$3)', [
      reservation.id,
      org,
      { status: 'delivered', proof_url: 'https://example.com/photo.png' },
    ]);
    await db.query('select transition_job($1,$2,$3)', [
      reservation.id,
      org,
      { status: 'picked_up', tons_actual: 3.2, pickup_proof_url: 'https://example.com/pickup.png' },
    ]);
    const pickedUpJob = (
      await db.query<{ pickup_proof_url: string }>(
        'select pickup_proof_url from jobs where id=$1',
        [reservation.id],
      )
    ).rows[0];
    assert.equal(pickedUpJob.pickup_proof_url, 'https://example.com/pickup.png');
    assert.equal(
      (await db.query<{ status: string }>('select status from containers')).rows[0].status,
      'yard',
    );
    await assert.rejects(
      db.query('select prepare_invoice($1,$2) as invoice', [reservation.id, org]),
      /scale ticket/i,
    );
    await db.query('select attach_scale_ticket($1,$2,$3)', [
      reservation.id,
      org,
      '/api/proof/11111111-1111-1111-1111-111111111111',
    ]);
    const bill = (
      await db.query<{ invoice: { amount_cents: number } }>(
        'select prepare_invoice($1,$2) as invoice',
        [reservation.id, org],
      )
    ).rows[0].invoice;
    assert.equal(bill.amount_cents, 10200);
    await assert.rejects(
      db.query('select transition_job($1,$2,$3)', [reservation.id, org, { tons_actual: 0 }]),
      /locked/i,
    );
    const final = {
      ...object,
      id: 'pi_test_invoice',
      amount: 10200,
      application_fee_amount: 0,
      metadata: { ...object.metadata, kind: 'invoice' },
    };
    await event('evt_final', 'payment_intent.succeeded', final);
    await event('evt_final', 'payment_intent.succeeded', final);
    assert.equal(
      (await db.query<{ status: string }>('select status from jobs')).rows[0].status,
      'completed',
    );
    await event('evt_refund', 'charge.refunded', {
      payment_intent: 'pi_test_invoice',
      amount_refunded: 10200,
    });
    await event('evt_refund', 'charge.refunded', {
      payment_intent: 'pi_test_invoice',
      amount_refunded: 10200,
    });
    const refunds = (
      await db.query<{ status: string; refunded_cents: number }>(
        "select status,refunded_cents from payments where stripe_payment_intent_id='pi_test_invoice'",
      )
    ).rows[0];
    assert.equal(refunds.status, 'refunded');
    assert.equal(refunds.refunded_cents, 10200);
    // A processing exception rolls back the event claim, making a corrected replay possible.
    const bad = { ...object, id: 'pi_bad', amount: 1 };
    await assert.rejects(event('evt_bad', 'payment_intent.succeeded', bad), /amount/i);
    assert.equal(
      (
        await db.query<{ count: number }>(
          "select count(*)::int as count from stripe_events where id='evt_bad'",
        )
      ).rows[0].count,
      0,
    );
  } finally {
    await db.close();
  }
});

test('stripe deposit with application fee and offline payments record properly into payments', async () => {
  const db = await database();
  try {
    const owner = randomUUID();
    await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2)', [
      owner,
      { name: 'Fee Test Owner', company: 'Fee Test Hauler' },
    ]);
    const org = (
      await db.query<{ org_id: string }>('select org_id from public.users where id=$1', [owner])
    ).rows[0].org_id;
    await db.query(
      "update organizations set stripe_connect_account_id='acct_fee_test' where id=$1",
      [org],
    );
    await db.query("update pricing_rules set service_zips=array['78704'] where org_id=$1", [org]);

    const container = randomUUID();
    await db.query("insert into containers(id,org_id,label,size_yards) values($1,$2,'T-FEE',20)", [
      container,
      org,
    ]);
    const container2 = randomUUID();
    await db.query(
      "insert into containers(id,org_id,label,size_yards) values($1,$2,'T-OFFLINE',20)",
      [container2, org],
    );

    // 1. Test Stripe deposit payment with application fee ($11.95 = 1195 cents)
    // Server computes price with reservation fee + add-on, passing price_cents & deposit_cents into reserve_booking
    const bookingInput = {
      id: randomUUID(),
      org_id: org,
      size_yards: 20,
      zip: '78704',
      delivery_date: addDays(today(), 2),
      pickup_date: addDays(today(), 9),
      booking_key: randomUUID(),
      customer_name: 'Fee Customer',
      customer_phone: '+15125550199',
      customer_email: 'fee@example.com',
      delivery_address: '100 Main St',
      price_cents: 43695,
      deposit_cents: 43695,
      notes: '',
      signature: { name: 'Fee Customer', timestamp: new Date().toISOString(), ip: 'test' },
    };
    const reservation = (
      await db.query<{ job: { id: string; deposit_cents: number; price_cents: number } }>(
        'select reserve_booking($1) as job',
        [bookingInput],
      )
    ).rows[0].job;
    assert.equal(reservation.deposit_cents, 43695);
    assert.equal(reservation.price_cents, 43695);

    const stripeDepositObject = {
      id: 'pi_test_with_fee',
      amount: 43695,
      application_fee_amount: 1195,
      currency: 'usd',
      customer: 'cus_fee_test',
      payment_method: 'pm_fee_test',
      metadata: { job_id: reservation.id, org_id: org, kind: 'deposit' },
    };
    await db.query('select apply_stripe_event($1,$2,$3)', [
      'evt_deposit_fee_succeeded',
      'payment_intent.succeeded',
      stripeDepositObject,
    ]);

    const stripePayment = (
      await db.query<{
        stripe_payment_intent_id: string;
        amount_cents: number;
        application_fee_cents: number;
        status: string;
      }>(
        "select stripe_payment_intent_id, amount_cents, application_fee_cents, status from payments where stripe_payment_intent_id='pi_test_with_fee'",
      )
    ).rows[0];
    assert.ok(stripePayment, 'Stripe payment with application fee must exist');
    assert.equal(stripePayment.stripe_payment_intent_id, 'pi_test_with_fee');
    assert.equal(stripePayment.amount_cents, 43695);
    assert.equal(stripePayment.application_fee_cents, 1195);
    assert.equal(stripePayment.status, 'succeeded');

    // 2. Test offline payment (e.g. offline_cash_...)
    const offlineJobId = randomUUID();
    const offlineBookingInput = {
      id: offlineJobId,
      org_id: org,
      size_yards: 20,
      zip: '78704',
      delivery_date: addDays(today(), 3),
      pickup_date: addDays(today(), 10),
      booking_key: randomUUID(),
      customer_name: 'Offline Customer',
      customer_phone: '+15125550188',
      customer_email: 'offline@example.com',
      delivery_address: '200 Pine St',
      price_cents: 42500,
      deposit_cents: 42500,
      notes: '[Phone Order]',
      signature: { name: 'Offline Customer', timestamp: new Date().toISOString(), ip: 'phone' },
    };
    await db.query('select reserve_booking($1)', [offlineBookingInput]);

    const offlinePaymentIntentId = `offline_cash_${randomUUID().slice(0, 8)}`;
    await db.query(
      `insert into payments (org_id, job_id, stripe_payment_intent_id, amount_cents, application_fee_cents, status, idempotency_key)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [
        org,
        offlineJobId,
        offlinePaymentIntentId,
        42500,
        0,
        'succeeded',
        `offline-cash-${offlineJobId}`,
      ],
    );

    const offlinePayment = (
      await db.query<{
        stripe_payment_intent_id: string;
        amount_cents: number;
        application_fee_cents: number;
        status: string;
      }>(
        'select stripe_payment_intent_id, amount_cents, application_fee_cents, status from payments where stripe_payment_intent_id=$1',
        [offlinePaymentIntentId],
      )
    ).rows[0];
    assert.ok(offlinePayment, 'Offline payment must exist');
    assert.equal(offlinePayment.stripe_payment_intent_id, offlinePaymentIntentId);
    assert.equal(offlinePayment.amount_cents, 42500);
    assert.equal(offlinePayment.application_fee_cents, 0);
    assert.equal(offlinePayment.status, 'succeeded');

    // 3. Verify constraint still rejects payment intent IDs that are neither pi_% nor offline_%
    await assert.rejects(
      db.query(
        `insert into payments (org_id, job_id, stripe_payment_intent_id, amount_cents, application_fee_cents, status, idempotency_key)
         values ($1, $2, 'invalid_id_format', 42500, 0, 'succeeded', 'invalid-key')`,
        [org, offlineJobId],
      ),
      /payments_stripe_payment_intent_id_check/i,
    );
  } finally {
    await db.close();
  }
});

test('dedicated twilio numbers migration adds columns and index to organizations table', async () => {
  const db = await database();
  try {
    const owner = randomUUID();
    await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2)', [
      owner,
      { name: 'Twilio Test Owner', company: 'Twilio Test Hauler' },
    ]);
    const org = (await db.query<{ id: string }>('select id from public.organizations')).rows[0].id;

    // Verify columns exist and can be updated
    await db.query(
      `update organizations
       set twilio_phone_number = '+15128429102',
           twilio_phone_sid = 'PN1234567890abcdef',
           last_booking_at = now(),
           number_warning_sent_at = now()
       where id = $1`,
      [org],
    );

    const updated = (
      await db.query<{
        twilio_phone_number: string;
        twilio_phone_sid: string;
        last_booking_at: string;
        number_warning_sent_at: string;
      }>(
        'select twilio_phone_number, twilio_phone_sid, last_booking_at, number_warning_sent_at from organizations where id = $1',
        [org],
      )
    ).rows[0];

    assert.equal(updated.twilio_phone_number, '+15128429102');
    assert.equal(updated.twilio_phone_sid, 'PN1234567890abcdef');
    assert.ok(updated.last_booking_at);
    assert.ok(updated.number_warning_sent_at);
  } finally {
    await db.close();
  }
});

async function consolidatedDatabase() {
  const db = new PGlite();
  await db.exec(`
 create role anon; create role authenticated; create role service_role bypassrls;
 create schema auth; create schema storage;
 create table auth.users(id uuid primary key,raw_user_meta_data jsonb,email text);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 grant usage on schema public,auth to authenticated,anon,service_role;
 alter default privileges in schema public grant select,insert,update,delete on tables to authenticated,service_role;
 `);
  const sql = await readFile(
    'supabase/migrations/202610160001_consolidated_production.sql',
    'utf8',
  );
  await db.exec(sql.replace('create extension if not exists pgcrypto;', ''));
  // The README tells operators to apply these after the consolidated file, so
  // this is the shape a live project actually has.
  for (const later of [
    '202610310001_sms_opt_outs',
    '202610310002_job_columns_behind_code',
    '202610310003_rate_limits',
    '202610310004_lock_organization_writes',
    '202610310005_driver_link_revocation',
  ]) {
    await db.exec(await readFile(`supabase/migrations/${later}.sql`, 'utf8'));
  }
  return db;
}

test('consolidated production migration applies cleanly and populates email on create_hauler', async () => {
  const db = await consolidatedDatabase();
  try {
    const owner = randomUUID();
    const testEmail = 'hauler@example.com';
    await db.query('insert into auth.users(id,raw_user_meta_data,email) values($1,$2,$3)', [
      owner,
      { name: 'Consolidated Owner', company: 'Consolidated Hauler' },
      testEmail,
    ]);
    const user = (
      await db.query<{ id: string; email: string; role: string }>(
        'select id, email, role from public.users where id = $1',
        [owner],
      )
    ).rows[0];
    assert.equal(user.id, owner);
    assert.equal(user.email, testEmail);
    assert.equal(user.role, 'owner');

    const org = (await db.query<{ id: string }>('select id from public.organizations')).rows[0].id;
    assert.ok(org);
  } finally {
    await db.close();
  }
});

test('job columns the application writes all exist, and the waiver gate is write-once', async () => {
  const db = await database();
  try {
    const columns = await db.query<{
      column_name: string;
      is_nullable: string;
      column_default: string | null;
    }>(
      `select column_name, is_nullable, column_default from information_schema.columns
        where table_schema='public' and table_name='jobs'
          and column_name in ('protective_boards','signed_by_customer','is_commercial',
                              'swap_parent_job_id','swapped_from_container_label')`,
    );
    assert.equal(columns.rows.length, 5, 'all five previously missing columns must exist');

    const gate = columns.rows.find((c) => c.column_name === 'signed_by_customer')!;
    assert.equal(gate.is_nullable, 'NO', 'a nullable gate would defeat a write-once filter');

    // The org, its owner row and default pricing rules are created by the
    // trigger on auth.users, the same way the other tests in this file set up.
    await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2)', [
      randomUUID(),
      { name: 'Test Owner', company: 'Writeonce Hauling' },
    ]);
    const orgId = (await db.query<{ id: string }>('select id from public.organizations')).rows[0]
      .id;
    await db.query("update pricing_rules set service_zips=array['78704'] where org_id=$1", [orgId]);
    await db.query("insert into containers(id,org_id,label,size_yards) values($1,$2,'GL-200',20)", [
      randomUUID(),
      orgId,
    ]);

    // An online booking goes through reserve_booking, which must now persist
    // both of the fields it previously dropped.
    const booked = await db.query<{ reserve_booking: Record<string, unknown> }>(
      'select public.reserve_booking($1)',
      [
        JSON.stringify({
          id: randomUUID(),
          org_id: orgId,
          customer_name: 'Dana Reyes',
          customer_phone: '+15125550123',
          customer_email: 'dana@example.com',
          delivery_address: '900 E 5th St, Austin, TX',
          zip: '78704',
          size_yards: 20,
          delivery_date: today(),
          pickup_date: addDays(today(), 7),
          notes: '',
          protective_boards: true,
          signature: { name: 'Dana Reyes', timestamp: new Date().toISOString(), ip: '203.0.113.7' },
          booking_key: randomUUID(),
        }),
      ],
    );
    const job = booked.rows[0].reserve_booking as {
      id: string;
      protective_boards: boolean;
      signed_by_customer: boolean;
    };
    assert.equal(job.protective_boards, true, 'a paid add-on must not be dropped on insert');
    assert.equal(job.signed_by_customer, true, 'an online booking is signed when it is placed');

    // A phone order starts unsigned; the first remote signature takes, the second does not.
    const phoneJob = randomUUID();
    await db.query(
      `insert into public.jobs(id,org_id,customer_name,customer_phone,customer_email,delivery_address,
         zip,size_yards,delivery_date,pickup_date,status,price_cents,deposit_cents,tons_included,
         extra_day_cents,notes,signature,booking_key,pricing_snapshot,signed_by_customer)
       values($1,$2,'Phone Caller','+15125550124','caller@example.com','1 Dispatch Way',
         '78704',20,$3,$4,'booked',42500,42500,2,2000,'[Phone Order]',$5,$6,'{}'::jsonb,false)`,
      [
        phoneJob,
        orgId,
        today(),
        addDays(today(), 7),
        JSON.stringify({
          name: 'Phone Caller (Phone Order)',
          timestamp: new Date().toISOString(),
          ip: 'dispatch-phone',
        }),
        randomUUID(),
      ],
    );

    const first = await db.query(
      `update public.jobs set signature=$2, signed_by_customer=true
        where id=$1 and signed_by_customer is false returning id`,
      [
        phoneJob,
        JSON.stringify({
          name: 'Phone Caller',
          timestamp: new Date().toISOString(),
          ip: '203.0.113.9',
        }),
      ],
    );
    assert.equal(first.rows.length, 1, 'the customer must be able to sign once');

    const second = await db.query(
      `update public.jobs set signature=$2, signed_by_customer=true
        where id=$1 and signed_by_customer is false returning id`,
      [
        phoneJob,
        JSON.stringify({
          name: 'Imposter',
          timestamp: new Date().toISOString(),
          ip: '198.51.100.4',
        }),
      ],
    );
    assert.equal(second.rows.length, 0, 'a second signature must match no row');

    const stored = await db.query<{ name: string }>(
      `select signature->>'name' as name from public.jobs where id=$1`,
      [phoneJob],
    );
    assert.equal(stored.rows[0].name, 'Phone Caller', 'the original signature must survive');
  } finally {
    await db.close();
  }
});

test('the rate limiter counts per bucket, resets on window roll, and is atomic', async () => {
  const db = await database();
  try {
    const hit = async (bucket: string, limit: number, windowSeconds: number) =>
      (
        await db.query<{ rate_limit_hit: boolean }>('select public.rate_limit_hit($1,$2,$3)', [
          bucket,
          limit,
          windowSeconds,
        ])
      ).rows[0].rate_limit_hit;

    // Three allowed, the fourth refused.
    assert.equal(await hit('ip:1.2.3.4:book', 3, 3600), true);
    assert.equal(await hit('ip:1.2.3.4:book', 3, 3600), true);
    assert.equal(await hit('ip:1.2.3.4:book', 3, 3600), true);
    assert.equal(await hit('ip:1.2.3.4:book', 3, 3600), false);
    assert.equal(await hit('ip:1.2.3.4:book', 3, 3600), false);

    // A different caller has its own budget.
    assert.equal(await hit('ip:5.6.7.8:book', 3, 3600), true);

    // A different endpoint for the same caller has its own budget too.
    assert.equal(await hit('ip:1.2.3.4:login', 3, 3600), true);

    // Once the window has rolled past, the count starts again.
    await db.query(
      "update public.rate_limits set window_start = now() - interval '2 hours' where bucket = $1",
      ['ip:1.2.3.4:book'],
    );
    assert.equal(await hit('ip:1.2.3.4:book', 3, 3600), true);
    const after = await db.query<{ hits: number }>(
      'select hits from public.rate_limits where bucket = $1',
      ['ip:1.2.3.4:book'],
    );
    assert.equal(after.rows[0].hits, 1, 'a rolled window restarts at one');

    // Concurrent hits must not both read a stale count: ten parallel calls
    // against a limit of four must allow exactly four.
    const parallel = await Promise.all(
      Array.from({ length: 10 }, () => hit('ip:9.9.9.9:burst', 4, 3600)),
    );
    assert.equal(
      parallel.filter(Boolean).length,
      4,
      `expected exactly 4 allowed, got ${parallel.filter(Boolean).length}`,
    );

    // Housekeeping removes only stale buckets.
    await db.query(
      "update public.rate_limits set window_start = now() - interval '3 days' where bucket = $1",
      ['ip:5.6.7.8:book'],
    );
    await db.query('select public.prune_rate_limits()');
    const left = await db.query<{ bucket: string }>('select bucket from public.rate_limits');
    assert.ok(!left.rows.some((r) => r.bucket === 'ip:5.6.7.8:book'), 'stale bucket pruned');
    assert.ok(
      left.rows.some((r) => r.bucket === 'ip:9.9.9.9:burst'),
      'live bucket kept',
    );
  } finally {
    await db.close();
  }
});

test('driver link revocation is recorded on the crew row', async () => {
  const db = await database();
  try {
    const column = await db.query<{ data_type: string; is_nullable: string }>(
      `select data_type, is_nullable from information_schema.columns
        where table_schema='public' and table_name='users' and column_name='links_revoked_at'`,
    );
    assert.equal(column.rows.length, 1, 'the revocation column must exist');
    assert.match(column.rows[0].data_type, /timestamp/);
    assert.equal(
      column.rows[0].is_nullable,
      'YES',
      'a driver who was never cancelled has no value',
    );

    await db.query('insert into auth.users(id,raw_user_meta_data) values($1,$2)', [
      randomUUID(),
      { name: 'Test Owner', company: 'Revocation Hauling' },
    ]);
    const orgId = (await db.query<{ id: string }>('select id from public.organizations')).rows[0]
      .id;
    const driver = randomUUID();
    await db.query("insert into users(id,org_id,name,role) values($1,$2,'Fired Driver','driver')", [
      driver,
      orgId,
    ]);

    const fresh = await db.query<{ links_revoked_at: string | null }>(
      'select links_revoked_at from public.users where id=$1',
      [driver],
    );
    assert.equal(fresh.rows[0].links_revoked_at, null, 'a new driver starts unrevoked');

    await db.query('update public.users set links_revoked_at = now() where id=$1 and org_id=$2', [
      driver,
      orgId,
    ]);
    const revoked = await db.query<{ links_revoked_at: string | null }>(
      'select links_revoked_at from public.users where id=$1',
      [driver],
    );
    assert.ok(revoked.rows[0].links_revoked_at, 'cancelling stores the moment it happened');
  } finally {
    await db.close();
  }
});

test('a brand-new hauler signs up and runs a first job through to its invoice', async () => {
  // Everything the live product does on the database, in the order a real
  // account does it, through the same stored procedures the application calls,
  // against the migration set the README tells operators to apply.
  const db = await consolidatedDatabase();
  try {
    const ownerId = randomUUID();
    const ownerEmail = `owner-${randomUUID().slice(0, 8)}@example.com`;

    // 1. Signup. The trigger on auth.users builds the whole workspace.
    await db.query('insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)', [
      ownerId,
      ownerEmail,
      { name: 'Dana Reyes', company: 'Reyes Roll-Off' },
    ]);

    const owner = (
      await db.query<{ org_id: string; role: string; email: string }>(
        'select org_id, role, email from public.users where id=$1',
        [ownerId],
      )
    ).rows[0];
    assert.ok(owner, 'signup must create the owner record');
    assert.equal(owner.role, 'owner');
    assert.equal(owner.email, ownerEmail, 'billing matches an account by this address');
    const org = owner.org_id;

    const created = (
      await db.query<{ name: string; slug: string; subscription_status: string }>(
        'select name, slug, subscription_status from public.organizations where id=$1',
        [org],
      )
    ).rows[0];
    assert.equal(created.name, 'Reyes Roll-Off');
    assert.match(created.slug, /^reyes-roll-off-/, 'slug is derived from the company name');
    assert.notEqual(created.subscription_status, 'active', 'a new signup is not on a paid plan');

    const seeded = await db.query<{ size_yards: number }>(
      'select size_yards from public.pricing_rules where org_id=$1 order by size_yards',
      [org],
    );
    assert.deepEqual(
      seeded.rows.map((r) => r.size_yards),
      [10, 20, 30, 40],
      'signup seeds the four dumpster sizes',
    );

    // 2. The hauler sets their pricing and service area.
    await db.query('select public.save_settings($1,$2)', [
      org,
      {
        name: 'Reyes Roll-Off',
        phone: '+15125550100',
        slug: 'reyes-roll-off',
        deposit_percent: 100,
        pricing_rules: [
          {
            size_yards: 20,
            base_price_cents: 42500,
            included_days: 7,
            extra_day_cents: 2000,
            included_tons: 2,
            overage_per_ton_cents: 9500,
            service_zips: ['78704'],
          },
        ],
      },
    ]);
    const configured = await db.query<{ size_yards: number; service_zips: string[] }>(
      'select size_yards, service_zips from public.pricing_rules where org_id=$1',
      [org],
    );
    assert.equal(configured.rows.length, 1, 'sizes they removed are pruned');
    assert.deepEqual(configured.rows[0].service_zips, ['78704']);

    // 3. Crew and fleet.
    const driver = randomUUID();
    const container = randomUUID();
    await db.query("insert into users(id,org_id,name,role) values($1,$2,'Marcus','driver')", [
      driver,
      org,
    ]);
    await db.query("insert into containers(id,org_id,label,size_yards) values($1,$2,'RR-20',20)", [
      container,
      org,
    ]);

    // 4. A customer books, choosing the protective-boards add-on.
    const jobId = randomUUID();
    const booking = (
      await db.query<{ job: Record<string, unknown> }>('select reserve_booking($1) as job', [
        {
          id: jobId,
          org_id: org,
          size_yards: 20,
          zip: '78704',
          delivery_date: addDays(today(), 1),
          pickup_date: addDays(today(), 8),
          booking_key: randomUUID(),
          customer_name: 'Pat Vance',
          customer_phone: '+15125550133',
          customer_email: 'pat@example.com',
          delivery_address: '501 Oltorf St, Austin, TX',
          notes: 'Gate code 4417',
          protective_boards: true,
          signature: { name: 'Pat Vance', timestamp: new Date().toISOString(), ip: '203.0.113.9' },
        },
      ])
    ).rows[0].job;
    assert.equal(booking.status, 'quoted', 'a booking is a quote until the deposit clears');
    assert.equal(booking.deposit_cents, 42500);
    assert.equal(booking.protective_boards, true, 'the paid add-on must be recorded');
    assert.equal(booking.signed_by_customer, true, 'booking online signs the agreement');

    // 5. The deposit clears.
    await db.query('select apply_stripe_event($1,$2,$3)', [
      `evt_${randomUUID()}`,
      'payment_intent.succeeded',
      {
        id: `pi_${randomUUID()}`,
        amount: 42500,
        application_fee_amount: 1275,
        currency: 'usd',
        customer: 'cus_live',
        payment_method: 'pm_live',
        metadata: { job_id: jobId, org_id: org, kind: 'deposit' },
      },
    ]);
    const paid = await db.query<{ status: string }>('select status from public.jobs where id=$1', [
      jobId,
    ]);
    assert.equal(paid.rows[0].status, 'booked', 'a cleared deposit confirms the booking');

    // 6. Dispatch, deliver, pick up.
    const transition = (id: string, patch: unknown, asDriver: string | null = null) =>
      db.query('select transition_job($1,$2,$3,$4)', [id, org, patch, asDriver]);

    await transition(jobId, { status: 'dispatched', driver_id: driver, container_id: container });
    const onSite = await db.query<{ status: string; current_job_id: string }>(
      'select status, current_job_id from public.containers where id=$1',
      [container],
    );
    assert.equal(onSite.rows[0].status, 'on_site', 'dispatch takes the container out of the yard');
    assert.equal(onSite.rows[0].current_job_id, jobId);

    await assert.rejects(
      () => transition(jobId, { status: 'delivered' }, driver),
      /proof/i,
      'a driver cannot mark delivered without a photo',
    );
    await transition(
      jobId,
      { status: 'delivered', proof_url: `/api/proof/${randomUUID()}` },
      driver,
    );
    await transition(jobId, { status: 'picked_up', tons_actual: 3.4 }, driver);

    // 7. The invoice. Over tonnage, so the scale ticket is required first.
    await assert.rejects(
      () => db.query('select prepare_invoice($1,$2)', [jobId, org]),
      /scale ticket/i,
      'an overage cannot be charged without the landfill ticket',
    );
    await db.query('select attach_scale_ticket($1,$2,$3)', [
      jobId,
      org,
      `/api/photos/${randomUUID()}.png`,
    ]);
    const invoice = (
      await db.query<{ invoice: { amount_cents: number } }>(
        'select prepare_invoice($1,$2) as invoice',
        [jobId, org],
      )
    ).rows[0].invoice;
    // 1.4 tons over at $95 is $133, and the deposit already covered the rental.
    assert.equal(invoice.amount_cents, 13300, 'the balance is the tonnage overage alone');

    // 8. The job is locked once invoiced.
    await assert.rejects(
      () => transition(jobId, { status: 'cancelled' }),
      /closed or its invoice is locked/i,
    );

    // 9. And the owner still cannot promote themselves through the browser.
    //
    // SET LOCAL only applies inside a transaction, and each statement here is
    // its own transaction, so the role has to be set for the session.
    await db.query('set role authenticated');
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [ownerId]);
    await assert.rejects(
      () => db.query("update public.organizations set subscription_status='active'"),
      /permission denied/i,
      'an owner must not be able to grant themselves a paid plan',
    );
    const visible = await db.query<{ count: string | number }>('select count(*) from public.jobs');
    assert.equal(
      Number(visible.rows[0].count),
      1,
      'the owner sees their own job and no other business',
    );
    await db.query('reset role');
  } finally {
    await db.close();
  }
});
