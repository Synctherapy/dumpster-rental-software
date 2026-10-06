import { NextResponse } from 'next/server';
import { identity, admin } from '@/lib/server/supabase';
import { isDemo } from '@/lib/server/store';
import { stripe } from '@/lib/server/stripe';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    if (isDemo())
      throw new Error(
        'Connect Supabase and a Stripe test key in environment settings to start onboarding.',
      );
    const { member } = await identity();
    if (member.role !== 'owner') throw new Error('FORBIDDEN');
    const db = admin();
    const { data: org, error } = await db
      .from('organizations')
      .select('*')
      .eq('id', member.org_id)
      .single();
    if (error) throw error;
    let account = org.stripe_connect_account_id;
    const s = stripe();
    if (!account) {
      const created = await s.accounts.create(
        {
          type: 'express',
          capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
          metadata: { org_id: org.id },
        },
        { idempotencyKey: `connect-${org.id}` },
      );
      account = created.id;
      const { error: saveError } = await db
        .from('organizations')
        .update({ stripe_connect_account_id: account })
        .eq('id', org.id);
      if (saveError) throw saveError;
    }
    const origin = process.env.APP_URL || new URL(request.url).origin;
    const link = await s.accountLinks.create({
      account,
      refresh_url: `${origin}/settings?connect=retry`,
      return_url: `${origin}/settings?connect=returned`,
      type: 'account_onboarding',
    });
    return NextResponse.json({ url: link.url });
  } catch (e) {
    return failure(e);
  }
}
