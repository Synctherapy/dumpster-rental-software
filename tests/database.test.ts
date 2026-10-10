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
      { status: 'picked_up', tons_actual: 3.2 },
    ]);
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
