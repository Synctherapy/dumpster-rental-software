import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/server/stripe';
import { admin } from '@/lib/server/supabase';
import { sendSms } from '@/lib/server/notifications';
import { sendEmail } from '@/lib/server/email';
export async function POST(request: Request) {
  let event: Stripe.Event;
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('Webhook is not configured');
    event = stripe().webhooks.constructEvent(
      await request.text(),
      request.headers.get('stripe-signature') ?? '',
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid webhook signature or configuration' },
      { status: 400 },
    );
  }
  if (event.livemode)
    return NextResponse.json({ error: 'Live events are disabled' }, { status: 400 });
  try {
    const db = admin();
    const { data, error } = await db.rpc('apply_stripe_event', {
      p_event_id: event.id,
      p_type: event.type,
      p_object: event.data.object,
    });
    if (error) throw error;
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { mode?: string; metadata?: { org_id?: string }; subscription?: string };
      if (session.mode === 'subscription' && session.metadata?.org_id && session.subscription) {
        await db.from('organizations').update({
          stripe_subscription_id: session.subscription,
          subscription_status: 'active',
        }).eq('id', session.metadata.org_id);
      }
    }
    if (data?.notify && data.job) {
      const text = `Your dumpster rental ${data.template === 'booking_confirmation' ? 'booking is confirmed' : 'payment has been received'}. Reference ${data.job.id.slice(0, 8)}.`;
      await sendSms(data.job.org_id, data.job.id, data.job.customer_phone, data.template, text);
      await sendEmail(
        data.job.org_id,
        data.job.id,
        data.job.customer_email,
        data.template,
        'Your dumpster rental update',
        text,
      );
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: 'Webhook processing failed; retry is safe.' },
      { status: 500 },
    );
  }
}
