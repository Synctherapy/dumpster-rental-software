import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { isDemo } from './store';
function secret() {
  const s = process.env.DRIVER_TOKEN_SECRET;
  if (s && s.length >= 32) return s;
  if (isDemo()) return 'local-demo-only-never-use-with-real-customer-data';
  throw new Error('DRIVER_TOKEN_SECRET must contain at least 32 characters.');
}
/**
 * Driver links are bearer URLs sent over SMS that expose customer names,
 * addresses and phone numbers, so they are short-lived. The README promises 24
 * hours; the default was 30 days and every caller used the default. Dispatch
 * sends a fresh link when a job is dispatched, and the daily reminder sends one
 * for tomorrow's work, so a driver normally always has a current link. Raise
 * DRIVER_LINK_TTL_HOURS if your crews need longer.
 */
export function driverLinkTtlMs() {
  const hours = Number(process.env.DRIVER_LINK_TTL_HOURS);
  if (Number.isFinite(hours) && hours >= 1 && hours <= 720) return hours * 3600000;
  return 24 * 3600000;
}

export function driverToken(org: string, driver: string, ttlMs: number = driverLinkTtlMs()) {
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
  if (typeof data?.org !== 'string' || typeof data?.driver !== 'string')
    throw new Error('Invalid driver link');
  if (data.exp < Date.now())
    throw new Error('Driver link expired. Ask your dispatcher for a new link.');
  return data;
}

export function contractorToken(
  org: string,
  account: string,
  ttlMs: number = 90 * 86400000,
) {
  const payload = Buffer.from(
    JSON.stringify({ org, account, exp: Date.now() + ttlMs }),
  ).toString('base64url');
  return payload + '.' + createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function verifyContractorToken(token: string): {
  org: string;
  account: string;
  exp: number;
} {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) throw new Error('Invalid contractor portal link');
  const actual = Buffer.from(signature, 'base64url');
  const expected = createHmac('sha256', secret()).update(payload).digest();
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new Error('Invalid contractor portal link');
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (typeof data?.org !== 'string' || typeof data?.account !== 'string')
    throw new Error('Invalid contractor portal link');
  if (data.exp < Date.now())
    throw new Error('This contractor portal link has expired. Ask your hauler for a new one.');
  return data;
}
