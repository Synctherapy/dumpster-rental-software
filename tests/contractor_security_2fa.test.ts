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

import type * as TokensModule from '../src/lib/server/tokens';
import { phoneMatch, maskPhone, normalizePhone } from '../src/lib/types';

const {
  contractorToken,
  verifyContractorToken,
  createContractorChallenge,
  verifyContractorChallenge,
} = req('../src/lib/server/tokens') as typeof TokensModule;

test('phoneMatch handles all common phone formatting forgivingly', () => {
  assert.equal(phoneMatch('2508128698', '(250) 812-8698'), true);
  assert.equal(phoneMatch('+12508128698', '250-812-8698'), true);
  assert.equal(phoneMatch('12508128698', '+1 (250) 812-8698'), true);
  assert.equal(phoneMatch('250.812.8698', '2508128698'), true);
  assert.equal(phoneMatch('812-8698', '250-812-8698'), true); // 7-digit local match
  assert.equal(phoneMatch('2508128698', '5128128698'), false); // different area code
  assert.equal(phoneMatch('2508128698', '2505551234'), false);
  assert.equal(phoneMatch('', '2508128698'), false);
  assert.equal(phoneMatch(null, '2508128698'), false);
});

test('maskPhone conceals sensitive digits and exposes last 4', () => {
  assert.equal(maskPhone('+12508128698'), '(***) ***-8698');
  assert.equal(maskPhone('2508128698'), '(***) ***-8698');
  assert.equal(maskPhone('(250) 812-8698'), '(***) ***-8698');
  assert.equal(maskPhone(''), '(***) ***-****');
});

test('contractor 2FA challenge round-trips with correct 6-digit code', () => {
  const challenge = createContractorChallenge('org-abc', 'Ironclad Roofing', '+12508128698', '749201');
  const verified = verifyContractorChallenge(challenge, '749201');
  assert.equal(verified.org, 'org-abc');
  assert.equal(verified.account, 'Ironclad Roofing');
  assert.equal(verified.phone, '+12508128698');
});

test('contractor 2FA challenge rejects an incorrect 6-digit code', () => {
  const challenge = createContractorChallenge('org-abc', 'Ironclad Roofing', '+12508128698', '749201');
  assert.throws(
    () => verifyContractorChallenge(challenge, '123456'),
    /Invalid 6-digit verification code/,
  );
});

test('contractor 2FA challenge rejects an expired challenge', () => {
  // Negative TTL to simulate expiry
  const expiredChallenge = createContractorChallenge(
    'org-abc',
    'Ironclad Roofing',
    '+12508128698',
    '749201',
    -1000,
  );
  assert.throws(
    () => verifyContractorChallenge(expiredChallenge, '749201'),
    /Verification code has expired/,
  );
});

test('contractor 2FA challenge rejects a tampered challenge token', () => {
  const challenge = createContractorChallenge('org-abc', 'Ironclad Roofing', '+12508128698', '749201');
  const [payload] = challenge.split('.');
  const tampered = payload + '.forged-signature';
  assert.throws(() => verifyContractorChallenge(tampered, '749201'), /Invalid verification session/);
});
