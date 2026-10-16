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
  await db.exec(await readFile('supabase/migrations/202610060004_prohibited_items_and_operating_days.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/202610080001_swap_and_offline_payments.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/202610090001_custom_dumpster_sizes.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/202610110001_pickup_proof.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/202610140001_fix_payments_and_stripe_fees.sql', 'utf8'));
  await db.exec(await readFile('supabase/migrations/202610140002_dedicated_twilio_numbers.sql', 'utf8'));
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
    const pickedUpJob = (await db.query<{ pickup_proof_url: string }>('select pickup_proof_url from jobs where id=$1', [reservation.id])).rows[0];
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
    await db.query("update organizations set stripe_connect_account_id='acct_fee_test' where id=$1", [org]);
    await db.query("update pricing_rules set service_zips=array['78704'] where org_id=$1", [org]);

    const container = randomUUID();
    await db.query("insert into containers(id,org_id,label,size_yards) values($1,$2,'T-FEE',20)", [
      container,
      org,
    ]);
    const container2 = randomUUID();
    await db.query("insert into containers(id,org_id,label,size_yards) values($1,$2,'T-OFFLINE',20)", [
      container2,
      org,
    ]);

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
  const sql = await readFile('supabase/migrations/202610160001_consolidated_production.sql', 'utf8');
  await db.exec(sql.replace('create extension if not exists pgcrypto;', ''));
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



