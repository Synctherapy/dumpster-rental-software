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

import type * as AgreementModule from '../src/lib/server/agreement';
import type * as SignRouteModule from '../src/app/api/agreement/[id]/sign/route';
import type * as SendWaiverRouteModule from '../src/app/api/jobs/[id]/send-waiver/route';
import type * as StoreModule from '../src/lib/server/store';

const { getJobAgreement } = req('../src/lib/server/agreement') as typeof AgreementModule;
const { readDemo } = req('../src/lib/server/store') as typeof StoreModule;
const { POST: signHandler } = req('../src/app/api/agreement/[id]/sign/route') as typeof SignRouteModule;
const { POST: sendWaiverHandler } = req('../src/app/api/jobs/[id]/send-waiver/route') as typeof SendWaiverRouteModule;

test('getJobAgreement retrieves populated agreement data for an existing job in demo store', async () => {
  const demoData = await readDemo();
  const sampleJob = demoData.jobs[0];
  assert.ok(sampleJob, 'Sample job exists in demo store');

  const agreementData = await getJobAgreement(sampleJob.id);
  assert.ok(agreementData, 'Agreement data is returned');
  assert.equal(agreementData.job.id, sampleJob.id);
  assert.equal(agreementData.job.customer_name, sampleJob.customer_name);
  assert.equal(agreementData.organization.name, demoData.organization.name);
  assert.ok(agreementData.rentalDays >= 1, 'Rental days is computed correctly');
  assert.ok(agreementData.pricingRule.overage_per_ton_cents > 0, 'Pricing rule has overage rate');
  assert.ok(agreementData.job.signature.name, 'Customer signature name is present');
  assert.ok(agreementData.job.signature.timestamp, 'Signature timestamp is present');
  assert.ok(agreementData.job.signature.ip, 'Signature IP is present');

  // Verify privacy leak protection
  const org = agreementData.organization as unknown as Record<string, unknown>;
  assert.equal(org.stripe_connect_account_id, undefined, 'stripe_connect_account_id must not leak');
  assert.equal(org.stripe_subscription_id, undefined, 'stripe_subscription_id must not leak');
  assert.equal(org.twilio_phone_sid, undefined, 'twilio_phone_sid must not leak');
  assert.equal(org.calendar_token, undefined, 'calendar_token must not leak');
  assert.equal(
    (org.pricing_config as Record<string, unknown> | undefined)?.calendar_token,
    undefined,
    'pricing_config.calendar_token must not leak',
  );
});

test('getJobAgreement returns null for non-existent job id', async () => {
  const result = await getJobAgreement('non-existent-uuid-99999');
  assert.equal(result, null);
});

test('POST /api/agreement/[id]/sign records customer e-signature and marks job signed', async () => {
  const demoData = await readDemo();
  const sampleJob = demoData.jobs[0];

  const reqObj = new Request(`http://localhost:3000/api/agreement/${sampleJob.id}/sign`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '192.168.1.100',
    },
    body: JSON.stringify({
      signature_name: 'Jane Customer E-Sign',
      accepted_terms: true,
    }),
  });

  const res = await signHandler(reqObj, { params: Promise.resolve({ id: sampleJob.id }) });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.job.signature.name, 'Jane Customer E-Sign');
  assert.equal(data.job.signature.ip, '192.168.1.100');
  assert.equal(data.job.signed_by_customer, true);
});

test('POST /api/jobs/[id]/send-waiver generates sms notification with agreement link', async () => {
  const demoData = await readDemo();
  const sampleJob = demoData.jobs[0];

  const reqObj = new Request(`http://localhost:3000/api/jobs/${sampleJob.id}/send-waiver`, {
    method: 'POST',
    headers: {
      origin: 'http://localhost:3000',
      host: 'localhost:3000',
    },
  });

  const res = await sendWaiverHandler(reqObj, { params: Promise.resolve({ id: sampleJob.id }) });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.sent_to, sampleJob.customer_phone);
});
