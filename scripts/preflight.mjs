#!/usr/bin/env node
/**
 * Production readiness check.
 *
 * Run this against the real project before letting anyone sign up:
 *
 *   npm run preflight
 *
 * It talks to the configured Supabase project with the keys in the environment
 * and verifies the things the application assumes at runtime: that every
 * migration has been applied, that each stored procedure exists and is callable
 * by the server but not by the browser, that the browser cannot write the
 * tables it must not, and that the external service settings are present and
 * well formed.
 *
 * It only reads, and it never prints the value of a key or a secret — only
 * whether one is set and whether its shape looks right.
 *
 * Add --signup to also create one throwaway account, confirm the signup trigger
 * builds the organization correctly, and delete it again.
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

// Next.js loads .env.local itself; a plain script has to.
for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key] === undefined) {
      process.env[key] = raw.replace(/^["']|["']$/g, '');
    }
  }
}

const results = [];
const record = (group, name, status, detail = '') => results.push({ group, name, status, detail });
const pass = (g, n, d) => record(g, n, 'pass', d);
const fail = (g, n, d) => record(g, n, 'fail', d);
const warn = (g, n, d) => record(g, n, 'warn', d);
const skip = (g, n, d) => record(g, n, 'skip', d);

/**
 * A request that never arrived proves nothing. Without this, an unreachable
 * project reported "not callable from the browser" and "rejected the probe, as
 * expected" for every check — a preflight that reassures you wrongly is worse
 * than no preflight.
 */
const TRANSPORT =
  /fetch failed|network|ENOTFOUND|ECONNREFUSED|ECONNRESET|EAI_AGAIN|timeout|socket/i;
const unreachable = (error) =>
  Boolean(error) && !error.code && TRANSPORT.test(error.message ?? String(error));

const URL_KEY = 'NEXT_PUBLIC_SUPABASE_URL';
const ANON_KEY = 'NEXT_PUBLIC_SUPABASE_ANON_KEY';
const SERVICE_KEY = 'SUPABASE_SERVICE_ROLE_KEY';

/* ---------------------------------------------------------------- settings */

const G = 'Settings';
const set = (k) => Boolean(process.env[k] && process.env[k].trim());

for (const key of [URL_KEY, ANON_KEY, SERVICE_KEY]) {
  if (set(key)) pass(G, `${key} is set`);
  else fail(G, `${key} is set`, 'required; the app refuses to start without all three');
}

if (set('ROLLOS_DEMO')) {
  if (process.env.ROLLOS_DEMO === 'true')
    fail(
      G,
      'ROLLOS_DEMO is not forcing demo mode',
      'set to true, so the live app serves sample data',
    );
  else pass(G, 'ROLLOS_DEMO is not forcing demo mode');
}

if (set('APP_URL')) {
  const value = process.env.APP_URL.trim();
  if (!/^https:\/\//.test(value)) fail(G, 'APP_URL is an https origin', 'must start with https://');
  else if (value.endsWith('/'))
    fail(G, 'APP_URL has no trailing slash', 'remove the trailing slash');
  else pass(G, 'APP_URL is an https origin without a trailing slash');
} else {
  fail(G, 'APP_URL is set', 'driver links, webhooks and receipts build absolute URLs from it');
}

if (set('DRIVER_TOKEN_SECRET')) {
  const length = process.env.DRIVER_TOKEN_SECRET.trim().length;
  if (length < 32) fail(G, 'DRIVER_TOKEN_SECRET is long enough', `${length} characters; needs 32+`);
  else pass(G, 'DRIVER_TOKEN_SECRET is long enough', `${length} characters`);
} else {
  fail(G, 'DRIVER_TOKEN_SECRET is set', 'signs driver and contractor portal links');
}

if (set('DRIVER_LINK_TTL_HOURS')) {
  const hours = Number(process.env.DRIVER_LINK_TTL_HOURS);
  if (!Number.isFinite(hours) || hours < 1 || hours > 720)
    warn(G, 'DRIVER_LINK_TTL_HOURS is in range', 'out of 1-720, so the 168 hour default applies');
  else pass(G, 'DRIVER_LINK_TTL_HOURS is in range', `${hours} hours`);
}

if (set('STRIPE_SECRET_KEY')) {
  const key = process.env.STRIPE_SECRET_KEY.trim();
  if (key.startsWith('sk_live_')) pass(G, 'Stripe key is present', 'live mode');
  else if (key.startsWith('sk_test_'))
    warn(G, 'Stripe key is present', 'test mode: no real charges');
  else fail(G, 'Stripe key looks valid', 'must start with sk_test_ or sk_live_');
  if (set('STRIPE_WEBHOOK_SECRET')) pass(G, 'STRIPE_WEBHOOK_SECRET is set');
  else fail(G, 'STRIPE_WEBHOOK_SECRET is set', 'without it every Stripe webhook is rejected');
} else {
  warn(G, 'Stripe is configured', 'no card payments or subscriptions until set');
}

const twilio = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_FROM_NUMBER'];
if (twilio.every(set)) pass(G, 'Twilio is configured');
else if (twilio.some(set))
  fail(G, 'Twilio is fully configured', `missing: ${twilio.filter((k) => !set(k)).join(', ')}`);
else warn(G, 'Twilio is configured', 'no SMS will be sent');

if (set('RESEND_API_KEY') && set('EMAIL_FROM')) pass(G, 'Email is configured');
else if (set('RESEND_API_KEY') || set('EMAIL_FROM'))
  fail(G, 'Email is fully configured', 'needs both RESEND_API_KEY and EMAIL_FROM');
else warn(G, 'Email is configured', 'no confirmations or receipts will be sent');

if (set('CRON_SECRET')) pass(G, 'CRON_SECRET is set');
else fail(G, 'CRON_SECRET is set', 'the daily reminder endpoint refuses every request without it');

if (!set('ADMIN_ALERT_EMAIL') && set('EMAIL_FROM'))
  warn(
    G,
    'Owner order alerts go where you expect',
    'ADMIN_ALERT_EMAIL unset, so they go to EMAIL_FROM',
  );

/* ---------------------------------------------------------------- database */

if (!set(URL_KEY) || !set(SERVICE_KEY)) {
  skip('Database', 'all checks', 'Supabase keys missing');
  report();
} else {
  await database();
  report();
}

async function database() {
  const db = createClient(process.env[URL_KEY], process.env[SERVICE_KEY], {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const anon = set(ANON_KEY)
    ? createClient(process.env[URL_KEY], process.env[ANON_KEY], {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

  const T = 'Tables and columns';
  // Selecting a named column with no rows is the cheapest way to ask whether a
  // migration has been applied: a missing column is an error, not empty data.
  const columns = {
    organizations: ['id', 'slug', 'subscription_status', 'pricing_config', 'twilio_phone_number'],
    users: ['id', 'org_id', 'role', 'email', 'links_revoked_at'],
    jobs: [
      'id',
      'booking_key',
      'protective_boards',
      'signed_by_customer',
      'is_commercial',
      'swap_parent_job_id',
      'swapped_from_container_label',
      'scale_ticket_url',
    ],
    containers: ['id', 'status', 'current_job_id'],
    pricing_rules: ['id', 'service_zips', 'included_tons'],
    payments: ['id', 'idempotency_key', 'refunded_cents'],
    notifications_log: ['id', 'dedupe_key'],
    delivery_proofs: ['id', 'storage_key'],
    stripe_events: ['id'],
    invoice_attempts: ['id'],
    sms_opt_outs: ['org_id', 'phone', 'opted_out_at'],
    rate_limits: ['bucket', 'window_start', 'hits'],
  };

  // Reachability first: everything below is meaningless if the project cannot
  // be contacted, and would otherwise report misleading passes.
  const reach = await db.from('organizations').select('id').limit(0);
  if (unreachable(reach.error)) {
    fail(
      T,
      'the Supabase project is reachable',
      `${reach.error.message} — check ${URL_KEY} and your network`,
    );
    skip('Stored procedures', 'all checks', 'project unreachable');
    skip('Browser cannot write what it must not', 'all checks', 'project unreachable');
    skip('Supporting services', 'all checks', 'project unreachable');
    skip('Signup', 'all checks', 'project unreachable');
    return;
  }
  if (reach.error) {
    fail(T, 'the service role can read the schema', reach.error.message);
  } else {
    pass(T, 'the Supabase project is reachable');
  }

  for (const [table, cols] of Object.entries(columns)) {
    const { error } = await db.from(table).select(cols.join(',')).limit(0);
    if (!error) pass(T, `${table} (${cols.length} columns)`);
    else if (unreachable(error)) fail(T, table, `could not verify: ${error.message}`);
    else fail(T, table, `${error.message} — a migration is probably missing`);
  }

  const P = 'Stored procedures';
  // Called with values that cannot match anything. A procedure that does not
  // exist reports PGRST202; anything else means it exists and ran.
  const probes = [
    ['rate_limit_hit', { p_bucket: `preflight:${randomUUID()}`, p_limit: 1, p_window_seconds: 1 }],
    ['reserve_booking', { p_job: { org_id: randomUUID() } }],
    ['transition_job', { p_id: randomUUID(), p_org: randomUUID(), p_patch: {}, p_driver: null }],
    ['prepare_invoice', { p_job_id: randomUUID(), p_org: randomUUID() }],
    ['save_settings', { p_org: randomUUID(), p_input: {} }],
    ['attach_scale_ticket', { p_id: randomUUID(), p_org: randomUUID(), p_url: 'preflight' }],
    [
      'apply_stripe_event',
      { p_event_id: `preflight_${randomUUID()}`, p_type: 'preflight.probe', p_object: {} },
    ],
  ];
  for (const [name, args] of probes) {
    const { error } = await db.rpc(name, args);
    if (!error) pass(P, `${name} is callable by the server`);
    else if (unreachable(error)) fail(P, `${name} exists`, `could not verify: ${error.message}`);
    else if (error.code === 'PGRST202')
      fail(P, `${name} exists`, 'not found — apply the migrations');
    else pass(P, `${name} is callable by the server`, 'exists and rejected the probe, as expected');
  }

  const S = 'Browser cannot write what it must not';
  if (!anon) {
    skip(S, 'all checks', `${ANON_KEY} missing`);
  } else {
    const upgrade = await anon
      .from('organizations')
      .update({ subscription_status: 'active' })
      .eq('id', randomUUID())
      .select('id');
    if (unreachable(upgrade.error))
      fail(
        S,
        'organizations is not writable from the browser',
        `could not verify: ${upgrade.error.message}`,
      );
    else if (upgrade.error)
      pass(S, 'organizations is not writable from the browser', upgrade.error.message.slice(0, 60));
    else if ((upgrade.data ?? []).length === 0)
      warn(
        S,
        'organizations is not writable from the browser',
        'refused silently rather than by privilege; apply 202610310004',
      );
    else fail(S, 'organizations is not writable from the browser', 'the self-upgrade path is open');

    for (const [name, args] of probes) {
      if (name === 'rate_limit_hit') continue;
      const { error } = await anon.rpc(name, args);
      if (unreachable(error))
        fail(S, `${name} is not callable from the browser`, `could not verify: ${error.message}`);
      else if (error) pass(S, `${name} is not callable from the browser`);
      else fail(S, `${name} is not callable from the browser`, 'privileged procedure is exposed');
    }

    const read = await anon.from('jobs').select('id').limit(1);
    if (unreachable(read.error))
      fail(
        S,
        'jobs are not readable without signing in',
        `could not verify: ${read.error.message}`,
      );
    else if (read.error || (read.data ?? []).length === 0)
      pass(S, 'jobs are not readable without signing in');
    else
      fail(
        S,
        'jobs are not readable without signing in',
        `${read.data.length} row(s) returned to an anonymous reader`,
      );
  }

  const F = 'Supporting services';
  // Delivery photos go into this bucket; without it the driver's upload fails.
  try {
    const bucket = await db.storage.getBucket('delivery-proofs');
    if (bucket.error) fail(F, 'the delivery-proofs storage bucket exists', bucket.error.message);
    else if (bucket.data?.public)
      fail(
        F,
        'the delivery-proofs bucket is private',
        'public, so delivery photos are world-readable',
      );
    else pass(F, 'the delivery-proofs storage bucket exists and is private');
  } catch (err) {
    warn(F, 'the delivery-proofs storage bucket exists', `could not check: ${err.message}`);
  }

  if (set('STRIPE_SECRET_KEY') && /^sk_(test|live)_/.test(process.env.STRIPE_SECRET_KEY.trim())) {
    try {
      const { default: Stripe } = await import('stripe');
      const client = new Stripe(process.env.STRIPE_SECRET_KEY.trim());
      const account = await client.accounts.retrieve();
      pass(F, 'the Stripe key works', `account ${account.id}`);
      if (account.charges_enabled) pass(F, 'the Stripe account can take charges');
      else warn(F, 'the Stripe account can take charges', 'charges are not enabled yet');
    } catch (err) {
      fail(F, 'the Stripe key works', err.message.slice(0, 90));
    }
  }

  const A = 'Signup';
  // Supabase serves its auth configuration publicly; this is what decides
  // whether a visitor can create an account at all.
  try {
    const settings = await fetch(`${process.env[URL_KEY].replace(/\/$/, '')}/auth/v1/settings`, {
      headers: { apikey: process.env[ANON_KEY] ?? '' },
    });
    if (!settings.ok) {
      warn(A, 'signup is enabled', `auth settings returned ${settings.status}`);
    } else {
      const config = await settings.json();
      if (config.disable_signup === true)
        fail(
          A,
          'signup is enabled',
          'signups are disabled in Supabase Auth, so nobody can register',
        );
      else pass(A, 'signup is enabled');
      if (config.mailer_autoconfirm === true)
        warn(
          A,
          'new accounts confirm their email',
          'auto-confirm is on, so addresses are unverified',
        );
      else pass(A, 'new accounts confirm their email', 'confirmation email required');
    }
  } catch (err) {
    warn(A, 'signup is enabled', `could not reach auth settings: ${err.message}`);
  }

  const trigger = await db
    .from('users')
    .select('id,org_id,email')
    .not('email', 'is', null)
    .limit(1);
  if (trigger.error) fail(A, 'existing accounts carry an email', trigger.error.message);
  else if ((trigger.data ?? []).length > 0)
    pass(A, 'existing accounts carry an email', 'the billing lookup can find them');
  else warn(A, 'existing accounts carry an email', 'no accounts yet, so nothing to check');

  if (!process.argv.includes('--signup')) {
    skip(A, 'end-to-end signup', 'pass --signup to create and delete one throwaway account');
    return;
  }

  const email = `preflight+${randomUUID().slice(0, 8)}@example.com`;
  const created = await db.auth.admin.createUser({
    email,
    password: randomUUID(),
    email_confirm: true,
    user_metadata: { name: 'Preflight Owner', company: 'Preflight Hauling' },
  });
  if (created.error || !created.data?.user) {
    fail(A, 'a new account can be created', created.error?.message ?? 'no user returned');
    return;
  }
  const userId = created.data.user.id;
  let orgId = null;
  try {
    const owner = await db.from('users').select('org_id,role,email').eq('id', userId).maybeSingle();
    if (owner.error || !owner.data) {
      fail(
        A,
        'signup builds the owner record',
        owner.error?.message ?? 'no row — is the trigger installed?',
      );
    } else {
      orgId = owner.data.org_id;
      pass(A, 'signup builds the owner record', `role ${owner.data.role}`);
      if (owner.data.email === email) pass(A, 'signup records the owner email');
      else fail(A, 'signup records the owner email', 'billing cannot match this account later');
    }

    if (orgId) {
      const org = await db.from('organizations').select('name,slug').eq('id', orgId).maybeSingle();
      if (org.data?.name === 'Preflight Hauling')
        pass(A, 'signup builds the organization', `slug ${org.data.slug}`);
      else fail(A, 'signup builds the organization', 'company name from signup was not applied');

      const rules = await db.from('pricing_rules').select('size_yards').eq('org_id', orgId);
      if ((rules.data ?? []).length >= 4)
        pass(A, 'signup seeds the dumpster sizes', `${rules.data.length} sizes`);
      else
        fail(
          A,
          'signup seeds the dumpster sizes',
          `${(rules.data ?? []).length} found, expected 4`,
        );

      const plan = await db
        .from('organizations')
        .select('subscription_status')
        .eq('id', orgId)
        .maybeSingle();
      if (plan.data?.subscription_status !== 'active')
        pass(
          A,
          'a new account does not start on a paid plan',
          `status ${plan.data?.subscription_status}`,
        );
      else
        fail(
          A,
          'a new account does not start on a paid plan',
          'new signups would get paid features free',
        );
    }
  } finally {
    // Clean up in dependency order so nothing is orphaned.
    if (orgId) {
      await db.from('pricing_rules').delete().eq('org_id', orgId);
      await db.from('users').delete().eq('org_id', orgId);
    }
    const removed = await db.auth.admin.deleteUser(userId);
    if (orgId) await db.from('organizations').delete().eq('id', orgId);
    const left = orgId
      ? await db.from('organizations').select('id').eq('id', orgId).maybeSingle()
      : { data: null };
    if (!removed.error && !left.data) pass(A, 'the throwaway account was removed');
    else
      warn(
        A,
        'the throwaway account was removed',
        `clean up by hand: organization ${orgId ?? 'unknown'}, auth user ${userId}`,
      );
  }
}

/* ------------------------------------------------------------------ report */

function report() {
  const mark = { pass: '  ok  ', fail: ' FAIL ', warn: ' warn ', skip: ' --   ' };
  let group = '';
  for (const r of results) {
    if (r.group !== group) {
      group = r.group;
      process.stdout.write(`\n${group}\n`);
    }
    process.stdout.write(`  [${mark[r.status]}] ${r.name}${r.detail ? ` — ${r.detail}` : ''}\n`);
  }
  const failed = results.filter((r) => r.status === 'fail');
  const warned = results.filter((r) => r.status === 'warn');
  process.stdout.write(
    `\n${results.filter((r) => r.status === 'pass').length} passed, ${failed.length} failed, ${warned.length} to look at\n`,
  );
  if (failed.length) {
    process.stdout.write('\nNot ready. Fix the FAIL lines above before anyone signs up.\n');
    process.exit(1);
  }
  process.stdout.write('\nReady for live traffic.\n');
  process.exit(0);
}
