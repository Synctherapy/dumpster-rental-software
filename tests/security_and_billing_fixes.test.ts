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

import type * as StoreModule from '../src/lib/server/store';
import type * as PhoneModule from '../src/lib/server/phone';
import type * as BillingRouteModule from '../src/app/api/billing/route';
import type * as StripeWebhookModule from '../src/app/api/webhooks/stripe/route';
import type * as TwilioWebhookModule from '../src/app/api/webhooks/twilio/route';

const { readDemo, mutateDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { checkAndTriggerPhoneProvisioning, releaseOrganizationPhone } =
  req('../src/lib/server/phone') as typeof PhoneModule;
const { POST: billingHandler } = req('../src/app/api/billing/route') as typeof BillingRouteModule;
const { POST: stripeWebhookHandler } =
  req('../src/app/api/webhooks/stripe/route') as typeof StripeWebhookModule;
const { POST: twilioWebhookHandler } =
  req('../src/app/api/webhooks/twilio/route') as typeof TwilioWebhookModule;

test('Stripe subscription lifecycle webhooks handle deleted, updated, and invoice.payment_failed', async () => {
  const subId = 'sub_test_lifecycle_123';
  await mutateDemo((d) => {
    d.organization.stripe_subscription_id = subId;
    d.organization.subscription_status = 'active';
  });

  // 1. customer.subscription.updated -> trialing
  const updateReq1 = new Request('http://localhost:3000/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'evt_1',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: subId,
          status: 'trialing',
        },
      },
    }),
  });
  const res1 = await stripeWebhookHandler(updateReq1);
  assert.equal(res1.status, 200);
  let state = await readDemo();
  assert.equal(state.organization.subscription_status, 'trialing');

  // 2. invoice.payment_failed -> past_due
  const invoiceFailReq = new Request('http://localhost:3000/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'evt_2',
      type: 'invoice.payment_failed',
      data: {
        object: {
          id: 'in_123',
          subscription: subId,
        },
      },
    }),
  });
  const res2 = await stripeWebhookHandler(invoiceFailReq);
  assert.equal(res2.status, 200);
  state = await readDemo();
  assert.equal(state.organization.subscription_status, 'past_due');

  // 3. customer.subscription.deleted -> canceled
  const deleteReq = new Request('http://localhost:3000/api/webhooks/stripe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'evt_3',
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: subId,
          status: 'canceled',
        },
      },
    }),
  });
  const res3 = await stripeWebhookHandler(deleteReq);
  assert.equal(res3.status, 200);
  state = await readDemo();
  assert.equal(state.organization.subscription_status, 'canceled');
});

test('Billing checkout prevents open redirect and sanitizes success_url / cancel_url', async () => {
  const origin = 'http://localhost:3000';

  // 1. Untrusted external domain should fall back to safe default relative URL
  const evilReq = new Request(`${origin}/api/billing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan: 'starter',
      success_url: 'https://evil.com/phishing',
      cancel_url: '//evil.com/phishing',
    }),
  });
  const evilRes = await billingHandler(evilReq);
  assert.equal(evilRes.status, 200);
  const evilJson = (await evilRes.json()) as { url: string };
  assert.equal(evilJson.url, `${origin}/dashboard?onboarding=true&billing=success`);

  // 2. Safe relative path starting with '/' is allowed and resolved against origin
  const relativeReq = new Request(`${origin}/api/billing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan: 'starter',
      success_url: '/custom-dashboard?billing=success',
    }),
  });
  const relativeRes = await billingHandler(relativeReq);
  assert.equal(relativeRes.status, 200);
  const relativeJson = (await relativeRes.json()) as { url: string };
  assert.equal(relativeJson.url, `${origin}/custom-dashboard?billing=success`);

  // 3. Absolute URL on same origin is allowed
  const trustedReq = new Request(`${origin}/api/billing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan: 'starter',
      success_url: `${origin}/dashboard?billing=success`,
    }),
  });
  const trustedRes = await billingHandler(trustedReq);
  assert.equal(trustedRes.status, 200);
  const trustedJson = (await trustedRes.json()) as { url: string };
  assert.equal(trustedJson.url, `${origin}/dashboard?billing=success`);
});

test('checkAndTriggerPhoneProvisioning requires active paid subscription', async () => {
  const demoData = await readDemo();
  const orgId = demoData.organization.id;

  // Release any existing twilio phone
  await releaseOrganizationPhone(orgId);

  // Setup prerequisites: stripe connect account, container, phone
  await mutateDemo((d) => {
    d.organization.stripe_connect_account_id = 'acct_123';
    d.organization.phone = '+15125550199';
    d.organization.twilio_phone_number = null;
    d.organization.twilio_phone_sid = null;
    d.organization.subscription_status = 'free'; // inactive/free tier
  });

  // 1. Inactive / free tier organization should NOT trigger phone provisioning
  const resFree = await checkAndTriggerPhoneProvisioning(orgId);
  assert.equal(resFree, null);
  let after = await readDemo();
  assert.equal(after.organization.twilio_phone_number, null);

  // 2. Active subscription organization should successfully trigger phone provisioning
  await mutateDemo((d) => {
    d.organization.subscription_status = 'active';
  });
  const resActive = await checkAndTriggerPhoneProvisioning(orgId);
  assert.ok(resActive);
  after = await readDemo();
  assert.equal(after.organization.twilio_phone_number, resActive);
});

test('Twilio inbound SMS webhook suppresses auto-reply for carrier opt-out keywords', async () => {
  const dedicatedNumber = '+15128429102';
  await mutateDemo((d) => {
    d.organization.twilio_phone_number = dedicatedNumber;
    d.organization.phone = '+15125550100';
    d.organization.name = 'Greenline Hauling';
  });

  const optOutWords = ['STOP', 'stop', 'UNSUBSCRIBE', 'cancel', 'QUIT', 'help', 'Stop!'];

  for (const word of optOutWords) {
    const body = new URLSearchParams({
      From: '+15129990001',
      To: dedicatedNumber,
      Body: word,
    }).toString();

    const req = new Request('http://localhost:3000/api/webhooks/twilio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const res = await twilioWebhookHandler(req);
    assert.equal(res.status, 200);
    const text = await res.text();
    // Auto-reply should be suppressed -> returns <Response/>
    assert.equal(text, '<Response/>');
  }
});

test('Twilio inbound SMS rate limiting allows 3 auto-replies per hour and suppresses subsequent ones', async () => {
  const dedicatedNumber = '+15128429102';
  const spammerPhone = '+15129994444';

  await mutateDemo((d) => {
    d.organization.twilio_phone_number = dedicatedNumber;
    d.organization.phone = '+15125550100';
    d.organization.name = 'Greenline Hauling';
  });

  // Clear any existing rate limit history for spammerPhone
  const globalStore = globalThis as unknown as { rollosTwilioAutoReplyHistory?: Map<string, number[]> };
  if (globalStore.rollosTwilioAutoReplyHistory) {
    globalStore.rollosTwilioAutoReplyHistory.delete(spammerPhone);
  }

  // First 3 messages should receive auto-reply
  for (let i = 1; i <= 3; i++) {
    const body = new URLSearchParams({
      From: spammerPhone,
      To: dedicatedNumber,
      Body: `Legitimate question #${i}`,
    }).toString();

    const req = new Request('http://localhost:3000/api/webhooks/twilio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const res = await twilioWebhookHandler(req);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.match(text, /<Response><Message>Thank you!/);
  }

  // 4th message in the same hour exceeds rate limit -> auto-reply suppressed
  const spamBody = new URLSearchParams({
    From: spammerPhone,
    To: dedicatedNumber,
    Body: 'Flood message #4',
  }).toString();

  const spamReq = new Request('http://localhost:3000/api/webhooks/twilio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: spamBody,
  });

  const spamRes = await twilioWebhookHandler(spamReq);
  assert.equal(spamRes.status, 200);
  const spamText = await spamRes.text();
  assert.equal(spamText, '<Response/>');
});
