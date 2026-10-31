import 'server-only';
import { isDemo } from './store';
import { admin } from './supabase';

/**
 * Request throttling that survives serverless.
 *
 * The only previous limiter was an in-memory Map on globalThis. Each function
 * instance keeps its own copy, so a "3 per hour" cap was really "3 per hour,
 * per instance, until the instance is recycled". Counting in Postgres gives one
 * shared count across every instance.
 *
 * Fails open: if the limiter itself is unavailable, requests are allowed. A
 * throttle that takes down booking when the database hiccups is worse than no
 * throttle.
 */
const globalForLimits = globalThis as unknown as {
  rollosRateLimits?: Map<string, number[]>;
};
const memory = (globalForLimits.rollosRateLimits ??= new Map<string, number[]>());

async function allowInMemory(bucket: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const since = now - windowSeconds * 1000;
  const hits = (memory.get(bucket) ?? []).filter((t) => t > since);
  hits.push(now);
  memory.set(bucket, hits);
  if (memory.size > 5000) {
    const oldest = memory.keys().next().value;
    if (oldest) memory.delete(oldest);
  }
  return hits.length <= limit;
}

export async function allowRequest(bucket: string, limit: number, windowSeconds: number) {
  if (isDemo()) return allowInMemory(bucket, limit, windowSeconds);
  try {
    const { data, error } = await admin().rpc('rate_limit_hit', {
      p_bucket: bucket,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      console.error('[rate-limit] counter unavailable, allowing request:', error.message);
      return true;
    }
    return data !== false;
  } catch (err) {
    console.error('[rate-limit] counter threw, allowing request:', err);
    return true;
  }
}

/**
 * The caller's address. x-vercel-forwarded-for is set by the platform and
 * overwrites anything the client sends; the rest are fallbacks for other hosts,
 * where a determined client can influence the value. A spoofed address can only
 * move a caller into a different bucket, never raise a bucket's limit.
 */
export function clientIp(request: Request) {
  return (
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown-client'
  );
}

/** Budgets per caller. Generous enough for real use, tight enough to matter. */
export const LIMITS = {
  // Each booking sends a text and an email on the hauler's account.
  book: { limit: 10, windowSeconds: 3600 },
  // Credential guessing.
  auth: { limit: 10, windowSeconds: 900 },
  // Drivers legitimately upload several photos per route.
  upload: { limit: 40, windowSeconds: 3600 },
  sign: { limit: 10, windowSeconds: 3600 },
  // A dispatcher taking phone orders all morning.
  quickOrder: { limit: 60, windowSeconds: 3600 },
  contractor: { limit: 30, windowSeconds: 3600 },
  // Minting a brand-new demo sandbox, not reading an existing one.
  demoSandbox: { limit: 20, windowSeconds: 3600 },
} as const;

export async function enforceRateLimit(
  request: Request,
  name: keyof typeof LIMITS,
  identifier = clientIp(request),
) {
  const { limit, windowSeconds } = LIMITS[name];
  const allowed = await allowRequest(`${name}:${identifier}`, limit, windowSeconds);
  if (!allowed) throw new Error('RATE_LIMITED');
}
