import { NextResponse } from 'next/server';
import { stripe } from '@/lib/server/stripe';
import { identity } from '@/lib/server/supabase';
import { failure } from '@/lib/server/http';
import { SUBSCRIPTION_CENTS } from '@/lib/pricing';
export async function POST(request: Request) {
  try {
    const { member, db } = await identity();
    if (member.role !== 'owner') throw new Error('FORBIDDEN');
    const { data: org } = await db
      .from('organizations')
      .select('pricing_config')
      .eq('id', member.org_id)
      .single();
    const pricingConfig = org?.pricing_config as { currency?: string } | undefined;
    const currency = (pricingConfig?.currency || 'usd').toLowerCase();
    const origin = new URL(request.url).origin;
    const session = await stripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: SUBSCRIPTION_CENTS,
            recurring: { interval: 'month' },
            product_data: { name: 'RollOS hauler plan' },
          },
        },
      ],
      subscription_data: { metadata: { org_id: member.org_id } },
      metadata: { org_id: member.org_id, kind: 'subscription' },
      success_url: `${origin}/settings?billing=success`,
      cancel_url: `${origin}/settings?billing=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    return failure(e);
  }
}
