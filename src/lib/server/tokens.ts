import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { isDemo, readDemo } from './store';
import { admin } from './supabase';
function secret() {
  const s = process.env.DRIVER_TOKEN_SECRET;
  if (s && s.length >= 32) return s;
  if (isDemo()) return 'local-demo-only-never-use-with-real-customer-data';
  throw new Error('DRIVER_TOKEN_SECRET must contain at least 32 characters.');
}
/**
 * Driver links are bearer URLs sent over SMS that expose the customer names,
 * addresses and phone numbers for that driver's own assigned jobs, so they
 * expire. Seven days is the default because it matches the rental cycle: a
 * driver delivers on day one and returns for the pickup about a week later, and
 * the route screen is what they use for both. A 24-hour link dies before the
 * pickup, which would make a driver's access depend on the daily reminder cron
 * firing without fail every morning. With a week, dispatch and the daily
 * reminder both refresh the link as a convenience rather than a requirement.
 *
 * This is only the fallback for when no job date is known. Prefer
 * driverLinkTtlForPickup, which ends the link the day after the pickup it was
 * sent for, so a 7-day rental gets an 8-day link and a 14-day rental gets 15.
 *
 * Set DRIVER_LINK_TTL_HOURS (1 to 720) to change the fallback.
 *
 * Note that this is a time limit, not revocation. Removing a driver does not
 * invalidate a link already issued to them; it expires on its own.
 */
export const DEFAULT_DRIVER_LINK_TTL_HOURS = 168;

export function driverLinkTtlMs() {
  const hours = Number(process.env.DRIVER_LINK_TTL_HOURS);
  if (Number.isFinite(hours) && hours >= 1 && hours <= 720) return hours * 3600000;
  return DEFAULT_DRIVER_LINK_TTL_HOURS * 3600000;
}

export const MIN_DRIVER_LINK_MS = 24 * 3600000;
/**
 * 120 days. Settings allow a pricing rule with up to 90 included days, and
 * pickup_date itself has no upper bound, so a long construction rental is
 * legitimate and must not strand the driver. This only exists to stop a
 * mistyped year from minting a link that effectively never expires.
 */
export const MAX_DRIVER_LINK_MS = 120 * 86400000;

/**
 * How long a link sent for a particular job should live: through the day after
 * its scheduled pickup, so the driver is covered for both the drop and the
 * collection without needing a resend mid-rental.
 *
 * Floored at one day, so a same-day dispatch is not handed a link that expires
 * within the hour, and capped at 120 so a mistyped pickup year cannot mint a
 * link that never expires. Dates are whole days with no time zone, so the end
 * of the pickup day is taken as UTC midnight and rounded up a day, which errs
 * on the side of the driver keeping access.
 */
export function driverLinkTtlForPickup(pickupDate?: string | null) {
  if (!pickupDate || !/^\d{4}-\d{2}-\d{2}$/.test(pickupDate)) return driverLinkTtlMs();
  const endOfPickupDay = Date.parse(`${pickupDate}T00:00:00Z`) + 2 * 86400000;
  if (!Number.isFinite(endOfPickupDay)) return driverLinkTtlMs();
  const remaining = endOfPickupDay - Date.now();
  return Math.min(Math.max(remaining, MIN_DRIVER_LINK_MS), MAX_DRIVER_LINK_MS);
}

/** The latest pickup still ahead of a driver, for a link sent outside any one job. */
export function latestActivePickup(
  jobs: { driver_id?: string | null; status?: string; pickup_date?: string }[],
  driverId: string,
) {
  const active = jobs
    .filter(
      (j) =>
        j.driver_id === driverId &&
        ['dispatched', 'delivered', 'picked_up'].includes(j.status ?? '') &&
        typeof j.pickup_date === 'string',
    )
    .map((j) => j.pickup_date!)
    .sort();
  return active.length ? active[active.length - 1] : null;
}

export function driverToken(
  org: string,
  driver: string,
  ttlMs: number = driverLinkTtlMs(),
  /**
   * The demo sandbox this link belongs to. A driver opens the link on their own
   * phone, which carries no sandbox cookie, so without this the link would read
   * different sample data than the dashboard that issued it — and a
   * cancellation made in the dashboard would appear to do nothing.
   */
  sandbox?: string | null,
) {
  const now = Date.now();
  const payload = Buffer.from(
    JSON.stringify({
      org,
      driver,
      iat: now,
      exp: now + ttlMs,
      ...(sandbox ? { sid: sandbox } : {}),
    }),
  ).toString('base64url');
  return payload + '.' + createHmac('sha256', secret()).update(payload).digest('base64url');
}
export function verifyDriverToken(token: string): {
  org: string;
  driver: string;
  exp: number;
  iat?: number;
  /** The demo sandbox this link was issued from, if any. */
  sid?: string;
} {
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

const REVOKED_MESSAGE = 'This route link was cancelled. Ask your dispatcher for a new one.';

/**
 * Whether the hauler has cancelled this driver's links since the token was
 * issued. A token minted before links carried an issue time has none, so once a
 * driver has been revoked those older links are refused as well: the safe
 * reading of "we do not know when this was issued" is "assume it is old".
 */
export async function assertDriverLinkActive(claim: {
  org: string;
  driver: string;
  iat?: number;
  sid?: string;
}) {
  let revokedAt: string | null | undefined;
  if (isDemo()) {
    const d = await readDemo(claim.sid);
    revokedAt = d.users.find((u) => u.id === claim.driver)?.links_revoked_at ?? null;
  } else {
    const { data, error } = await admin()
      .from('users')
      .select('links_revoked_at')
      .eq('id', claim.driver)
      .eq('org_id', claim.org)
      .maybeSingle();
    // A driver who is no longer on this organization's crew has no route.
    if (error || !data) throw new Error(REVOKED_MESSAGE);
    revokedAt = data.links_revoked_at;
  }
  if (!revokedAt) return;
  const revoked = Date.parse(revokedAt);
  if (!Number.isFinite(revoked)) return;
  if (claim.iat === undefined || claim.iat <= revoked) throw new Error(REVOKED_MESSAGE);
}

/** Signature, expiry and revocation in one step, for every route-link caller. */
export async function verifyActiveDriverToken(token: string) {
  const claim = verifyDriverToken(token);
  await assertDriverLinkActive(claim);
  return claim;
}

export function contractorToken(org: string, account: string, ttlMs: number = 90 * 86400000) {
  const payload = Buffer.from(JSON.stringify({ org, account, exp: Date.now() + ttlMs })).toString(
    'base64url',
  );
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
