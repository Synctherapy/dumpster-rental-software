import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { isDemo } from './store';
function secret() {
  const s = process.env.DRIVER_TOKEN_SECRET;
  if (s && s.length >= 32) return s;
  if (isDemo()) return 'local-demo-only-never-use-with-real-customer-data';
  throw new Error('DRIVER_TOKEN_SECRET must contain at least 32 characters.');
}
export function driverToken(org: string, driver: string, ttlMs: number = 30 * 86400000) {
  const payload = Buffer.from(JSON.stringify({ org, driver, exp: Date.now() + ttlMs })).toString(
    'base64url',
  );
  return payload + '.' + createHmac('sha256', secret()).update(payload).digest('base64url');
}
export function verifyDriverToken(token: string): { org: string; driver: string; exp: number } {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) throw new Error('Invalid driver link');
  const actual = Buffer.from(signature, 'base64url');
  const expected = createHmac('sha256', secret()).update(payload).digest();
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new Error('Invalid driver link');
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (data.exp < Date.now())
    throw new Error('Driver link expired. Ask your dispatcher for a new link.');
  return data;
}
