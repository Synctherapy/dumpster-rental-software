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

import type * as TwilioModule from '../src/lib/server/twilio';
import type * as StoreModule from '../src/lib/server/store';
import type * as SeedModule from '../src/lib/seed';
import type * as JobsModule from '../src/lib/server/jobs';
import type * as TwilioRouteModule from '../src/app/api/webhooks/twilio/route';
import type * as RemindersRouteModule from '../src/app/api/reminders/route';

const { extractAreaCode, ensureOrganizationPhone, releaseOrganizationPhone } =
  req('../src/lib/server/twilio') as typeof TwilioModule;
const { readDemo, mutateDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { demoOrg } = req('../src/lib/seed') as typeof SeedModule;
const { recordBookingOccurred } = req('../src/lib/server/jobs') as typeof JobsModule;
const { POST: twilioWebhookPost } = req('../src/app/api/webhooks/twilio/route') as typeof TwilioRouteModule;
const { GET: remindersGet } = req('../src/app/api/reminders/route') as typeof RemindersRouteModule;

test('extractAreaCode extracts local area code, skips toll-free, and falls back to ZIP or 512', () => {
  // Direct phone area code extraction
  assert.equal(extractAreaCode('+15125550123'), '512');
  assert.equal(extractAreaCode('5125550123'), '512');
  assert.equal(extractAreaCode('(214) 555-0199'), '214');

  // Toll-free phone numbers (800, 888, 877) should be bypassed to inspect ZIP
  assert.equal(extractAreaCode('+18005550123', '78704'), '512');
  assert.equal(extractAreaCode('+18885550123', '90210'), '310');
  assert.equal(extractAreaCode('+18775550123', '10001'), '212');

  // ZIP prefix mapping
  assert.equal(extractAreaCode(undefined, '78704'), '512');
  assert.equal(extractAreaCode(undefined, '75001'), '214');
  assert.equal(extractAreaCode(undefined, '60601'), '312');
  assert.equal(extractAreaCode(undefined, '98101'), '206');
  assert.equal(extractAreaCode(undefined, '30301'), '404');

  // Default fallback
  assert.equal(extractAreaCode(undefined, undefined), '512');
  assert.equal(extractAreaCode('invalid', '99999'), '512');
});

test('ensureOrganizationPhone and releaseOrganizationPhone manage phone in demo mode', async () => {
  // Ensure we start clean
  await releaseOrganizationPhone(demoOrg);
  let state = await readDemo();
  assert.equal(state.organization.twilio_phone_number, null);
  assert.equal(state.organization.twilio_phone_sid, null);

  // First call should generate and persist a simulated local phone number
  const phone = await ensureOrganizationPhone(demoOrg);
  assert.ok(phone);
  assert.match(phone, /^\+1\d{10}$/);

  state = await readDemo();
  assert.equal(state.organization.twilio_phone_number, phone);
  assert.ok(state.organization.twilio_phone_sid?.startsWith('PN_demo_'));

  // Calling again returns the already provisioned number
  const second = await ensureOrganizationPhone(demoOrg);
  assert.equal(second, phone);

  // Releasing the phone clears the fields
  const released = await releaseOrganizationPhone(demoOrg);
  assert.equal(released, true);

  state = await readDemo();
  assert.equal(state.organization.twilio_phone_number, null);
  assert.equal(state.organization.twilio_phone_sid, null);
});

test('POST /api/webhooks/twilio handles inbound SMS forwarding and TwiML response', async () => {
  // Set up dedicated number on demo organization
  const dedicatedNumber = '+15128429102';
  await mutateDemo((d) => {
    d.organization.twilio_phone_number = dedicatedNumber;
    d.organization.phone = '+15125550100';
    d.organization.name = 'Greenline Hauling';
  });

  const body = new URLSearchParams({
    From: '+15129998877',
    To: dedicatedNumber,
    Body: 'Can you deliver the dumpster by 8 AM?',
  }).toString();

  const req = new Request('http://localhost:3000/api/webhooks/twilio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const res = await twilioWebhookPost(req);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/xml');

  const text = await res.text();
  assert.match(text, /<Response><Message>Thank you! We have forwarded your message to Greenline Hauling\.<\/Message><\/Response>/);

  // Check that inbound notification was recorded in notifications_log
  const demoState = await readDemo();
  const inboundLog = demoState.notifications_log.find(
    (n) => n.template === 'inbound_reply' && n.channel === 'sms' && n.to === '+15125550100',
  );
  assert.ok(inboundLog, 'Inbound SMS should be logged in notifications_log');
});

test('POST /api/webhooks/twilio handles inbound Voice call forwarding with Dial TwiML containing action callback', async () => {
  const dedicatedNumber = '+15128429102';
  await mutateDemo((d) => {
    d.organization.twilio_phone_number = dedicatedNumber;
    d.organization.phone = '+15125550100';
  });

  const body = new URLSearchParams({
    CallSid: 'CA1234567890abcdef',
    From: '+15129998877',
    To: dedicatedNumber,
  }).toString();

  const req = new Request('http://localhost:3000/api/webhooks/twilio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const res = await twilioWebhookPost(req);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/xml');

  const text = await res.text();
  assert.match(
    text,
    /<Response><Dial timeout="20" action="\/api\/webhooks\/twilio\?type=voice_action">\+15125550100<\/Dial><\/Response>/,
  );
});

test('POST /api/webhooks/twilio handles voice action callback with DialCallStatus=no-answer and sends auto-textback', async () => {
  const dedicatedNumber = '+15128429102';
  const callerPhone = '+15129997766';
  await mutateDemo((d) => {
    d.organization.twilio_phone_number = dedicatedNumber;
    d.organization.phone = '+15125550100';
    d.organization.slug = 'greenline';
  });

  const body = new URLSearchParams({
    CallSid: 'CA1234567890abcdef',
    From: callerPhone,
    To: dedicatedNumber,
    DialCallStatus: 'no-answer',
  }).toString();

  const req = new Request('http://localhost:3000/api/webhooks/twilio?type=voice_action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const res = await twilioWebhookPost(req);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/xml');

  const text = await res.text();
  assert.equal(text, '<Response/>');

  // Verify missed call auto-reply was recorded in notifications_log
  const demoState = await readDemo();
  const missedCallLog = demoState.notifications_log.find(
    (n) => n.template === 'missed_call_autoreply' && n.channel === 'sms' && n.to === callerPhone,
  );
  assert.ok(missedCallLog, 'Missed call SMS auto-reply should be logged in notifications_log');
});

test('Inactivity cron warns at 40 days and releases phone at 45 days in reminders route', async () => {
  const dedicatedNumber = '+15128429102';

  // Case 1: 41 days old, warning not sent yet -> sends warning email & marks timestamp
  const date41DaysAgo = new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString();
  await mutateDemo((d) => {
    d.organization.twilio_phone_number = dedicatedNumber;
    d.organization.last_booking_at = date41DaysAgo;
    d.organization.number_warning_sent_at = null;
  });

  const req1 = new Request('http://localhost:3000/api/reminders', { method: 'GET' });
  const res1 = await remindersGet(req1);
  assert.equal(res1.status, 200);

  let state = await readDemo();
  assert.equal(state.organization.twilio_phone_number, dedicatedNumber, 'Phone should not be released yet');
  assert.ok(state.organization.number_warning_sent_at, 'Warning sent timestamp should be recorded');

  // Verify warning email logged
  const warningLog = state.notifications_log.find(
    (n) => n.template === 'phone_inactivity_warning',
  );
  assert.ok(warningLog, 'Warning email notification should be logged');

  // Case 2: 46 days old -> releases dedicated phone line
  const date46DaysAgo = new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString();
  await mutateDemo((d) => {
    d.organization.last_booking_at = date46DaysAgo;
  });

  const req2 = new Request('http://localhost:3000/api/reminders', { method: 'GET' });
  const res2 = await remindersGet(req2);
  assert.equal(res2.status, 200);

  state = await readDemo();
  assert.equal(state.organization.twilio_phone_number, null, 'Phone should be released after 45 days');
});

test('recordBookingOccurred updates last_booking_at and ensures twilio phone number', async () => {
  // Start with no twilio phone number
  await mutateDemo((d) => {
    d.organization.twilio_phone_number = null;
    d.organization.twilio_phone_sid = null;
    d.organization.last_booking_at = null;
    d.organization.number_warning_sent_at = '2026-09-01T00:00:00.000Z';
  });

  await recordBookingOccurred(demoOrg);

  const state = await readDemo();
  assert.ok(state.organization.last_booking_at, 'last_booking_at should be updated to now');
  assert.equal(state.organization.number_warning_sent_at, null, 'number_warning_sent_at should be reset');
  assert.ok(state.organization.twilio_phone_number, 'Twilio phone number should be provisioned');
});

