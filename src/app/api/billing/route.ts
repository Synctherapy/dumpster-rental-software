import { NextResponse } from 'next/server';
import { stripe } from '@/lib/server/stripe';
import { identity } from '@/lib/server/supabase';
import { failure } from '@/lib/server/http';
import { STARTER_SUBSCRIPTION_CENTS, GROWTH_SUBSCRIPTION_CENTS } from '@/lib/pricing';
import { isDemo, mutateDemo } from '@/lib/server/store';

export async function POST(request: Request) {
  try {
    let plan: 'starter' | 'growth' = 'starter';
    let body: { plan?: string; status?: string } | null = null;
    try {
      body = await request.json();
      if (body?.plan === 'growth') {
        plan = 'growth';
      }
    } catch {
      // Empty or non-JSON body defaults to starter
    }

    const unitAmount = plan === 'growth' ? GROWTH_SUBSCRIPTION_CENTS : STARTER_SUBSCRIPTION_CENTS;
    const productName = plan === 'growth' ? 'RollOS Growth Fleet' : 'RollOS Starter';
    const origin = new URL(request.url).origin;

    if (isDemo()) {
      await mutateDemo((d) => {
        if (body?.status === 'inactive') {
          d.organization.subscription_status = 'inactive';
        } else {
          d.organization.subscription_status = 'active';
        }
      });
      return NextResponse.json({ url: `${origin}/settings?billing=success` });
    }

    const { member, db } = await identity();
    if (member.role !== 'owner') throw new Error('FORBIDDEN');
    const { data: org } = await db
      .from('organizations')
      .select('pricing_config')
      .eq('id', member.org_id)
      .single();
    const pricingConfig = org?.pricing_config as { currency?: string } | undefined;
    const currency = (pricingConfig?.currency || 'usd').toLowerCase();
    const session = await stripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: unitAmount,
            recurring: { interval: 'month' },
            product_data: { name: productName },
          },
        },
      ],
      subscription_data: { metadata: { plan, org_id: member.org_id } },
      metadata: { plan, org_id: member.org_id, kind: 'subscription' },
      success_url: `${origin}/settings?billing=success`,
      cancel_url: `${origin}/settings?billing=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return failure(e);
  }
}
