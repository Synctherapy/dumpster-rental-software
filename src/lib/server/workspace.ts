import 'server-only';
import { randomUUID } from 'node:crypto';
import { isDemo, readDemo } from './store';
import { admin, maybeIdentity } from './supabase';
import { checkAndTriggerPhoneProvisioning } from './phone';
import type { Workspace } from '../types';
/** How much of the message log the dashboard receives per poll. */
export const NOTIFICATION_PAGE_SIZE = 250;

export async function workspace(): Promise<Workspace> {
  if (isDemo()) {
    const d = await readDemo();
    if (!d.organization.twilio_phone_number) {
      const provisioned = await checkAndTriggerPhoneProvisioning(d.organization.id).catch(() => null);
      if (provisioned) {
        d.organization.twilio_phone_number = provisioned;
      }
    }
    return d;
  }
  try {
    const auth = await maybeIdentity();
    if (!auth) return readDemo();
    const { db, member } = auth;
    if (member.role === 'driver') throw new Error('FORBIDDEN');
    const tables = [
      'organizations',
      'users',
      'containers',
      'jobs',
      'payments',
      'pricing_rules',
      'notifications_log',
    ];
    const results = await Promise.race([
      Promise.all(
        tables.map((t) => {
          const scoped = db
            .from(t)
            .select('*')
            .eq(t === 'organizations' ? 'id' : 'org_id', member.org_id);
          // The message log grows by one row per text and email, forever, and
          // the dashboard polls this every 30 seconds while only ever showing
          // the newest handful. Send the newest page, not the whole history.
          return t === 'notifications_log'
            ? scoped.order('sent_at', { ascending: false }).limit(NOTIFICATION_PAGE_SIZE)
            : scoped;
        }),
      ),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('DB_TIMEOUT')), 4000),
      ),
    ]);
    for (const r of results) if (r.error) throw new Error(r.error.message);
    const organization = results[0].data![0];
    const config = (organization.pricing_config || {}) as Record<string, unknown>;
    if (!organization.calendar_token && !config.calendar_token) {
      const generatedToken = randomUUID().replace(/-/g, '');
      config.calendar_token = generatedToken;
      organization.calendar_token = generatedToken;
      await admin()
        .from('organizations')
        .update({ pricing_config: config })
        .eq('id', organization.id);
    } else if (!organization.calendar_token && config.calendar_token) {
      organization.calendar_token = config.calendar_token;
    }
    if (!organization.twilio_phone_number) {
      const provisioned = await checkAndTriggerPhoneProvisioning(organization.id).catch(() => null);
      if (provisioned) {
        organization.twilio_phone_number = provisioned;
      }
    }
    // An exact count so the ledger link can still show the real total even
    // though only the newest page was transferred.
    const { count: notificationsTotal } = await db
      .from('notifications_log')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', member.org_id);

    return {
      organization,
      users: results[1].data,
      containers: results[2].data,
      jobs: results[3].data,
      payments: results[4].data,
      pricing_rules: results[5].data,
      notifications_log: results[6].data,
      notifications_total: notificationsTotal ?? results[6].data?.length ?? 0,
      demo: false,
    } as Workspace;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    // A timeout is an outage, not a signed-out visitor. Serving the sample
    // workspace here showed a real hauler someone else's business whenever the
    // database took more than a few seconds to answer.
    if (msg.includes('TIMEOUT')) throw err;
    if (msg === 'UNAUTHORIZED' || msg.includes('UNAUTHORIZED') || msg.includes('membership')) {
      // Unauthenticated visitors get the interactive live demo sandbox
      return readDemo();
    }
    throw err;
  }
}
function cleanPublicOrganization<T extends Record<string, unknown>>(rawOrg: T) {
  const rawConfig = (rawOrg.pricing_config || {}) as Record<string, unknown>;
  const cleanPricingConfig = { ...rawConfig };
  delete cleanPricingConfig.calendar_token;

  const hasStripeConnected = Boolean(rawOrg.stripe_connect_account_id);

  const {
    calendar_token: _calToken,
    stripe_connect_account_id: _stripeAccountId,
    twilio_phone_sid: _twilioPhoneSid,
    ...restOrg
  } = rawOrg;
  void _calToken;
  void _stripeAccountId;
  void _twilioPhoneSid;

  return {
    ...restOrg,
    stripe_connected: hasStripeConnected,
    pricing_config: cleanPricingConfig,
  };
}

export async function publicOrganization(slug: string) {
  if (isDemo()) {
    const d = await readDemo();
    return {
      organization: cleanPublicOrganization({ ...d.organization, slug }),
      pricing_rules: d.pricing_rules,
      demo: true,
    };
  }
  const db = admin();
  const { data: organization, error } = await db
    .from('organizations')
    .select('id,name,slug,phone,timezone,pricing_config,stripe_connect_account_id')
    .eq('slug', slug)
    .single();
  // An unknown slug is not found. It must not resolve to the demo business
  // renamed to match, which turned any mistyped booking link into a bookable
  // storefront for a company that does not exist. In demo mode the branch
  // above answers first, so the no-signup demo is unaffected.
  if (error || !organization) throw new Error('Organization not found');
  const { data: pricing_rules, error: ruleError } = await db
    .from('pricing_rules')
    .select('*')
    .eq('org_id', organization.id);
  if (ruleError) throw ruleError;
  return { organization: cleanPublicOrganization(organization), pricing_rules: pricing_rules!, demo: false };
}
