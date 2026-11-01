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
import type * as OptOutModule from '../src/lib/server/opt-outs';
import type * as TwilioRouteModule from '../src/app/api/webhooks/twilio/route';
import type * as ReviewRequestRouteModule from '../src/app/api/jobs/[id]/review-request/route';

const { readDemo, mutateDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { isOptedOut } = req('../src/lib/server/opt-outs') as typeof OptOutModule;
const { POST: twilioWebhookPost } = req(
  '../src/app/api/webhooks/twilio/route',
) as typeof TwilioRouteModule;
const { POST: reviewRequestPost } = req(
  '../src/app/api/jobs/[id]/review-request/route',
) as typeof ReviewRequestRouteModule;

const DEDICATED = '+15128429102';

async function prepareOrg() {
  await mutateDemo((d) => {
    d.organization.twilio_phone_number = DEDICATED;
    d.organization.phone = '+15125550100';
    d.organization.slug = 'greenline';
  });
  const d = await readDemo();
  return d.organization.id;
}

function inboundSms(from: string, body: string) {
  return new Request('http://localhost:3000/api/webhooks/twilio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ From: from, To: DEDICATED, Body: body }).toString(),
  });
}

function missedCall(from: string) {
  return new Request('http://localhost:3000/api/webhooks/twilio?type=voice_action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      CallSid: 'CA000000000000000000000000000001',
      From: from,
      To: DEDICATED,
      DialCallStatus: 'no-answer',
    }).toString(),
  });
}

async function marketingTextsTo(phone: string) {
  const d = await readDemo();
  return d.notifications_log.filter((n) => n.template === 'missed_call_autoreply' && n.to === phone)
    .length;
}

test('texting STOP records an opt-out and draws no auto-reply', async () => {
  const orgId = await prepareOrg();
  const caller = '+15129990001';

  const res = await twilioWebhookPost(inboundSms(caller, 'STOP'));
  assert.equal(res.status, 200);
  assert.equal(await res.text(), '<Response/>', 'an opt-out must not be answered');
  assert.equal(await isOptedOut(orgId, caller), true);
});

test('opt-out keywords are matched with trailing punctuation and any casing', async () => {
  const orgId = await prepareOrg();
  for (const [caller, body] of [
    ['+15129990002', 'stop!'],
    ['+15129990003', 'Unsubscribe.'],
    ['+15129990004', ' QUIT '],
  ] as const) {
    await twilioWebhookPost(inboundSms(caller, body));
    assert.equal(await isOptedOut(orgId, caller), true, `${body} should opt out`);
  }
});

test('a missed call does not send the marketing text to an opted-out number', async () => {
  const orgId = await prepareOrg();
  const caller = '+15129990005';

  await twilioWebhookPost(inboundSms(caller, 'STOP'));
  assert.equal(await isOptedOut(orgId, caller), true);

  const before = await marketingTextsTo(caller);
  const res = await twilioWebhookPost(missedCall(caller));
  assert.equal(res.status, 200);
  assert.equal(
    await marketingTextsTo(caller),
    before,
    'promotional auto-text must be suppressed after STOP',
  );
});

test('a missed call still sends the marketing text to a number that never opted out', async () => {
  await prepareOrg();
  const caller = '+15129990006';

  const before = await marketingTextsTo(caller);
  const res = await twilioWebhookPost(missedCall(caller));
  assert.equal(res.status, 200);
  assert.equal(await marketingTextsTo(caller), before + 1);
});

test('texting START puts a number back on the list', async () => {
  const orgId = await prepareOrg();
  const caller = '+15129990007';

  await twilioWebhookPost(inboundSms(caller, 'STOP'));
  assert.equal(await isOptedOut(orgId, caller), true);

  await twilioWebhookPost(inboundSms(caller, 'start'));
  assert.equal(await isOptedOut(orgId, caller), false);

  const before = await marketingTextsTo(caller);
  await twilioWebhookPost(missedCall(caller));
  assert.equal(await marketingTextsTo(caller), before + 1, 'opting back in restores the text');
});

test('HELP suppresses the auto-reply without opting the number out', async () => {
  const orgId = await prepareOrg();
  const caller = '+15129990008';

  const res = await twilioWebhookPost(inboundSms(caller, 'HELP'));
  assert.equal(await res.text(), '<Response/>');
  assert.equal(await isOptedOut(orgId, caller), false, 'HELP is an info keyword, not an opt-out');
});

test('a missed call on a number the organization does not own is ignored', async () => {
  await prepareOrg();
  const caller = '+15129990009';

  const res = await twilioWebhookPost(
    new Request('http://localhost:3000/api/webhooks/twilio?type=voice_action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        CallSid: 'CA000000000000000000000000000002',
        From: caller,
        To: '+15550000000',
        DialCallStatus: 'no-answer',
      }).toString(),
    }),
  );
  assert.equal(res.status, 200);
  assert.equal(await marketingTextsTo(caller), 0);
});

test('review request route rejects sending SMS to opted-out customers and succeeds when opted in', async () => {
  await prepareOrg();
  const caller = '+15129990010';

  // Ensure organization has a review link configured and seed a test job
  let jobId = '';
  await mutateDemo((d) => {
    d.organization.google_review_url = 'https://g.page/r/review-test';
    const sample = d.jobs[0];
    sample.customer_phone = caller;
    jobId = sample.id;
  });

  // 1. Opt out via inbound STOP message
  await twilioWebhookPost(inboundSms(caller, 'STOP'));
  assert.equal(await isOptedOut((await readDemo()).organization.id, caller), true);

  // 2. Attempt to trigger review request -> must be rejected
  const reqObj = new Request(`http://localhost:3000/api/jobs/${jobId}/review-request`, {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
  });
  const resRejected = await reviewRequestPost(reqObj, { params: Promise.resolve({ id: jobId }) });
  assert.equal(resRejected.status, 400);
  const dataRejected = await resRejected.json();
  assert.match(dataRejected.error, /opted out/i);

  // 3. Opt back in via START message
  await twilioWebhookPost(inboundSms(caller, 'START'));
  assert.equal(await isOptedOut((await readDemo()).organization.id, caller), false);

  // 4. Trigger review request again -> must succeed and record notification
  const reqObj2 = new Request(`http://localhost:3000/api/jobs/${jobId}/review-request`, {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
  });
  const resAllowed = await reviewRequestPost(reqObj2, { params: Promise.resolve({ id: jobId }) });
  assert.equal(resAllowed.status, 200);
  const dataAllowed = await resAllowed.json();
  assert.equal(dataAllowed.ok, true);

  const demoData = await readDemo();
  const reviewNotif = demoData.notifications_log.find(
    (n) => n.template === 'review_request' && n.to === caller,
  );
  assert.ok(reviewNotif, 'Review request notification should be recorded after opt-in');
});
