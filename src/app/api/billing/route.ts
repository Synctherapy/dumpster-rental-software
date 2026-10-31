import { NextResponse } from 'next/server';
import { stripe } from '@/lib/server/stripe';
import { maybeIdentity, admin } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { logError } from '@/lib/server/log';
import {
  STARTER_SUBSCRIPTION_CENTS,
  GROWTH_SUBSCRIPTION_CENTS,
  WINTER_HOLD_SUBSCRIPTION_CENTS,
  WEBSITE_SETUP_CENTS,
  GBP_3PACK_SETUP_CENTS,
  STARTER_TRIAL_DAYS,
} from '@/lib/pricing';
import { isDemo, mutateDemo } from '@/lib/server/store';

function sanitizeRedirectUrl(
  candidate: string | undefined,
  defaultPath: string,
  requestOrigin: string,
): string {
  const allowedOrigins = new Set<string>([requestOrigin]);
  if (process.env.APP_URL) {
    try {
      allowedOrigins.add(new URL(process.env.APP_URL).origin);
    } catch {}
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      allowedOrigins.add(new URL(process.env.NEXT_PUBLIC_APP_URL).origin);
    } catch {}
  }

  const defaultUrl = `${requestOrigin}${defaultPath.startsWith('/') ? defaultPath : `/${defaultPath}`}`;

  if (!candidate || typeof candidate !== 'string') {
    return defaultUrl;
  }

  const trimmed = candidate.trim();
  if (!trimmed) {
    return defaultUrl;
  }

  // 1. Safe relative path: starts with single '/', not protocol-relative ('//') and not backslash ('/\')
  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
    try {
      const resolved = new URL(trimmed, requestOrigin);
      if (allowedOrigins.has(resolved.origin)) {
        return resolved.toString();
      }
    } catch {}
    return defaultUrl;
  }

  // 2. Absolute URL: origin must match requestOrigin or configured APP_URL
  try {
    const parsed = new URL(trimmed);
    if (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      allowedOrigins.has(parsed.origin)
    ) {
      return parsed.toString();
    }
  } catch {}

  // External or untrusted URL -> fall back to safe default relative URL
  return defaultUrl;
}

export async function POST(request: Request) {
  try {
    // This route mints Stripe Checkout sessions and had no origin check at all.
    assertSameOrigin(request);
    let body: {
      plan?: 'free' | 'starter' | 'growth' | 'winter_hold';
      status?: string;
      addon?: 'website' | 'gbp';
      addons?: ('website' | 'gbp')[];
      website?: boolean;
      gbp?: boolean;
      org_id?: string;
      email?: string;
      company?: string;
      phone?: string;
      success_url?: string;
      cancel_url?: string;
    } | null = null;

    try {
      body = await request.json();
    } catch {
      // Empty or non-JSON body
    }

    const plan = body?.plan;
    const hasWebsite =
      Boolean(body?.website) ||
      body?.addon === 'website' ||
      (Array.isArray(body?.addons) && body.addons.includes('website'));
    const hasGbp =
      Boolean(body?.gbp) ||
      body?.addon === 'gbp' ||
      (Array.isArray(body?.addons) && body.addons.includes('gbp'));

    const origin = new URL(request.url).origin;
    const defaultSuccessPath = plan
      ? '/dashboard?onboarding=true&billing=success'
      : '/settings?billing=success';
    const defaultCancelPath = plan
      ? '/dashboard?onboarding=true&billing=cancelled'
      : '/settings?billing=cancelled';

    const successUrl = sanitizeRedirectUrl(body?.success_url, defaultSuccessPath, origin);
    const cancelUrl = sanitizeRedirectUrl(body?.cancel_url, defaultCancelPath, origin);

    if (isDemo()) {
      await mutateDemo((d) => {
        if (body?.status === 'inactive') {
          d.organization.subscription_status = 'inactive';
        } else if (plan === 'winter_hold') {
          d.organization.subscription_status = body?.status || 'winter_hold';
        } else if (plan === 'starter' || plan === 'growth' || (!plan && !hasWebsite && !hasGbp)) {
          d.organization.subscription_status = 'active';
        }
        if (hasWebsite) d.organization.website_addon = true;
        if (hasGbp) d.organization.gbp_addon = true;
      });
      return NextResponse.json({ url: successUrl });
    }

    const ident = await maybeIdentity();
    let orgId = ident?.member.org_id || body?.org_id;
    let customerEmail = ident?.user?.email || body?.email;
    let customerPhone = body?.phone;
    let currency = 'usd';

    if (!orgId && ident?.user?.id) {
      try {
        const { data: userRecord } = await admin()
          .from('users')
          .select('org_id')
          .eq('id', ident.user.id)
          .maybeSingle();
        if (userRecord?.org_id) {
          orgId = userRecord.org_id;
        }
      } catch (err) {
        logError('billing.resolveOrgBySession', err);
      }
    }

    if (!orgId && customerEmail) {
      // create_hauler() records the owner's address on public.users, so this
      // one lookup resolves the account. The previous code first tried
      // auth.admin.getUserByEmail, which does not exist in this SDK version,
      // then listUsers({ perPage: 100 }), which only ever saw the first
      // hundred accounts and pulled every one of their addresses into memory
      // on an endpoint that needs no session. Both are gone.
      try {
        const { data: userRecord, error } = await admin()
          .from('users')
          .select('org_id')
          .eq('email', customerEmail)
          .maybeSingle();
        if (error) logError('billing.resolveOrgByEmail', error);
        if (userRecord?.org_id) orgId = userRecord.org_id;
      } catch (err) {
        logError('billing.resolveOrgByEmail', err);
      }
    }

    // Never start a payment that cannot be applied to an account. Without this,
    // an unresolved account produced a Stripe session carrying org_id:
    // undefined — the customer paid and the webhook had nothing to upgrade.
    if (!orgId) {
      throw new Error(
        'We could not match this checkout to an account. Sign in and try again, or contact support.',
      );
    }

    if (orgId) {
      try {
        const { data: org } = await admin()
          .from('organizations')
          .select('pricing_config, phone, email')
          .eq('id', orgId)
          .single();
        if (org) {
          const config = org.pricing_config as { currency?: string } | undefined;
          if (config?.currency) currency = config.currency.toLowerCase();
          if (!customerPhone && org.phone) customerPhone = org.phone;
          if (!customerEmail && org.email) customerEmail = org.email;
        }
      } catch {}
    }

    if (!orgId) {
      throw new Error('Organization ID is required for checkout.');
    }

    const lineItems: Array<{
      quantity: number;
      price_data: {
        currency: string;
        unit_amount: number;
        recurring?: { interval: 'month' };
        product_data: { name: string; description?: string };
      };
    }> = [];

    const isSubscription =
      plan === 'starter' ||
      plan === 'growth' ||
      plan === 'winter_hold' ||
      (!plan && !hasWebsite && !hasGbp);

    if (plan === 'growth') {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: GROWTH_SUBSCRIPTION_CENTS,
          recurring: { interval: 'month' },
          product_data: {
            name: 'RollOS Growth Fleet',
            description: '$99/month high-growth dumpster fleet automation. Cancel anytime.',
          },
        },
      });
    } else if (plan === 'winter_hold') {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: WINTER_HOLD_SUBSCRIPTION_CENTS,
          recurring: { interval: 'month' },
          product_data: {
            name: 'RollOS Winter Yard Hold',
            description:
              '$10/month seasonal hold. Preserves your custom booking URL, customer data, and phone routing during winter months. Reactivate anytime.',
          },
        },
      });
    } else if (isSubscription) {
      // Starter plan with 14-day free trial
      lineItems.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: STARTER_SUBSCRIPTION_CENTS,
          recurring: { interval: 'month' },
          product_data: {
            name: 'RollOS Starter (14-Day Free Trial)',
            description: '14 days free trial. Renews at $29/month. Cancel anytime in 1 click.',
          },
        },
      });
    }

    if (hasWebsite) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: WEBSITE_SETUP_CENTS,
          product_data: {
            name: 'Done-For-You 24/7 Booking Website',
            description:
              'One-time setup fee. Includes copy, local service area configuration & booking widget.',
          },
        },
      });
    }

    if (hasGbp) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: GBP_3PACK_SETUP_CENTS,
          product_data: {
            name: 'Google Maps 3-Pack Domination Kit',
            description:
              'One-time optimization fee. Local category audit and automated review texts.',
          },
        },
      });
    }

    if (lineItems.length === 0) {
      throw new Error('No billable plan or add-on items specified.');
    }

    const sessionMetadata: Record<string, string> = {
      org_id: orgId,
      plan: plan || (isSubscription ? 'starter' : 'free'),
      website: hasWebsite ? 'true' : 'false',
      gbp: hasGbp ? 'true' : 'false',
      kind: isSubscription ? 'subscription' : 'addon_payment',
      customer_email: customerEmail || '',
      customer_phone: customerPhone || '',
      company: body?.company || '',
    };

    const sessionParams: Parameters<
      ReturnType<typeof stripe>['checkout']['sessions']['create']
    >[0] = {
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: lineItems,
      metadata: sessionMetadata,
      success_url: successUrl,
      cancel_url: cancelUrl,
    };

    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    if (isSubscription) {
      sessionParams.subscription_data = {
        metadata: sessionMetadata,
        ...(plan === 'starter' || (!plan && !hasWebsite && !hasGbp)
          ? {
              trial_period_days: STARTER_TRIAL_DAYS,
              trial_settings: {
                end_behavior: { missing_payment_method: 'cancel' },
              },
            }
          : {}),
      };
    }

    const session = await stripe().checkout.sessions.create(sessionParams);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return failure(e);
  }
}
