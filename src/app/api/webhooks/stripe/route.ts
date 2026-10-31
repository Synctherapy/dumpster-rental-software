import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/server/stripe';
import { admin } from '@/lib/server/supabase';
import { sendSms, notifyAdminPurchase } from '@/lib/server/notifications';
import { sendEmail } from '@/lib/server/email';
import { recordBookingOccurred } from '@/lib/server/jobs';
import { checkAndTriggerPhoneProvisioning } from '@/lib/server/phone';
import { isDemo, mutateDemo } from '@/lib/server/store';
export async function POST(request: Request) {
  let event: Stripe.Event;
  try {
    if (isDemo() && (!process.env.STRIPE_WEBHOOK_SECRET || !request.headers.get('stripe-signature'))) {
      event = (await request.json()) as Stripe.Event;
    } else {
      if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('Webhook is not configured');
      event = stripe().webhooks.constructEvent(
        await request.text(),
        request.headers.get('stripe-signature') ?? '',
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid webhook signature or configuration' },
      { status: 400 },
    );
  }
  try {
    const db = !isDemo() ? admin() : null;
    let data: {
      notify?: boolean;
      template?: string;
      job?: {
        id: string;
        org_id: string;
        customer_phone: string;
        customer_email: string;
      };
    } | null = null;
    if (db) {
      const { data: rpcData, error } = await db.rpc('apply_stripe_event', {
        p_event_id: event.id,
        p_type: event.type,
        p_object: event.data.object,
      });
      if (error) throw error;
      data = rpcData;
    }
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as {
        id?: string;
        mode?: string;
        amount_total?: number;
        metadata?: {
          org_id?: string;
          plan?: string;
          website?: string;
          gbp?: string;
          company?: string;
          customer_email?: string;
          customer_phone?: string;
        };
        customer_details?: { email?: string; phone?: string; name?: string };
        subscription?: string;
      };
      const meta = session.metadata || {};
      const orgId = meta.org_id;

      if (session.mode === 'subscription' && orgId && session.subscription) {
        const targetStatus = meta.plan === 'winter_hold' ? 'winter_hold' : 'active';
        if (isDemo()) {
          await mutateDemo((d) => {
            if (d.organization.id === orgId || !d.organization.stripe_subscription_id) {
              d.organization.stripe_subscription_id = session.subscription;
              d.organization.subscription_status = targetStatus;
              if (meta.website === 'true') d.organization.website_addon = true;
              if (meta.gbp === 'true') d.organization.gbp_addon = true;
            }
          });
        }
        if (db) {
          await db.from('organizations').update({
            stripe_subscription_id: session.subscription,
            subscription_status: targetStatus,
            ...(meta.website === 'true' ? { website_addon: true } : {}),
            ...(meta.gbp === 'true' ? { gbp_addon: true } : {}),
          }).eq('id', orgId);
        }
        if (targetStatus === 'active') {
          await checkAndTriggerPhoneProvisioning(orgId).catch(() => {});
        }
      } else if (orgId && (meta.website === 'true' || meta.gbp === 'true')) {
        if (isDemo()) {
          await mutateDemo((d) => {
            if (d.organization.id === orgId) {
              if (meta.website === 'true') d.organization.website_addon = true;
              if (meta.gbp === 'true') d.organization.gbp_addon = true;
            }
          });
        }
        if (db) {
          await db.from('organizations').update({
            ...(meta.website === 'true' ? { website_addon: true } : {}),
            ...(meta.gbp === 'true' ? { gbp_addon: true } : {}),
          }).eq('id', orgId);
        }
      }

      // Instant Owner Alert for Purchases (Website, GBP 3-Pack, or Subscriptions)
      const itemsPurchased: string[] = [];
      if (meta.website === 'true') itemsPurchased.push('Done-For-You 24/7 Booking Website ($299)');
      if (meta.gbp === 'true') itemsPurchased.push('Google Maps 3-Pack Domination Kit ($79)');
      if (meta.plan === 'starter' && session.mode === 'subscription') itemsPurchased.push('Starter Plan (14-Day Free Trial)');
      if (meta.plan === 'growth' && session.mode === 'subscription') itemsPurchased.push('Growth Fleet Plan ($99/mo)');
      if (meta.plan === 'winter_hold' && session.mode === 'subscription') itemsPurchased.push('Winter Yard Hold ($10/mo)');

      if (itemsPurchased.length > 0 && orgId) {
        const customerName = meta.company || session.customer_details?.name || 'New Customer';
        const contactInfo = meta.customer_phone || session.customer_details?.phone || meta.customer_email || session.customer_details?.email || 'N/A';
        const totalPaid = `$${((session.amount_total ?? 0) / 100).toFixed(2)}`;

        const alertSubject = `🚨 NEW ORDER: ${customerName} purchased ${itemsPurchased.join(' + ')}`;
        const alertBody = `New order received on RollOS!\n\nCustomer: ${customerName}\nContact: ${contactInfo}\nItems:\n- ${itemsPurchased.join('\n- ')}\nTotal Paid Today: ${totalPaid}\nStripe Session: ${session.id || 'N/A'}`;

        const adminEmail = process.env.ADMIN_ALERT_EMAIL || process.env.EMAIL_FROM;
        if (adminEmail) {
          await sendEmail(
            orgId,
            null,
            adminEmail,
            'admin_addon_purchase',
            alertSubject,
            alertBody,
            event.id,
          ).catch(() => {});
        }

        const adminPhone = process.env.ADMIN_ALERT_PHONE;
        if (adminPhone) {
          await sendSms(
            orgId,
            null,
            adminPhone,
            'admin_addon_purchase',
            `🚨 RollOS Alert: ${customerName} purchased ${itemsPurchased.join(' + ')} (${totalPaid}). Contact: ${contactInfo}`,
            event.id,
          ).catch(() => {});
        }

        await notifyAdminPurchase({
          customerName,
          items: itemsPurchased,
          totalPaid,
          contactInfo,
        }).catch(() => {});
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as {
        id?: string;
        subscription?: string;
        metadata?: { org_id?: string };
      };
      const subId = subscription.id || subscription.subscription;
      if (subId) {
        if (isDemo()) {
          await mutateDemo((d) => {
            if (
              d.organization.stripe_subscription_id === subId ||
              (subscription.metadata?.org_id && d.organization.id === subscription.metadata.org_id)
            ) {
              d.organization.subscription_status = 'canceled';
            }
          });
        }
        if (db) {
          await db
            .from('organizations')
            .update({ subscription_status: 'canceled' })
            .eq('stripe_subscription_id', subId);
        }
      }
    }

    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as {
        id?: string;
        status?: string;
        metadata?: { org_id?: string };
      };
      const subId = subscription.id;
      const status = subscription.status;
      if (subId && status) {
        if (isDemo()) {
          await mutateDemo((d) => {
            if (
              d.organization.stripe_subscription_id === subId ||
              (subscription.metadata?.org_id && d.organization.id === subscription.metadata.org_id)
            ) {
              d.organization.subscription_status = status;
            }
          });
        }
        if (db) {
          await db
            .from('organizations')
            .update({ subscription_status: status })
            .eq('stripe_subscription_id', subId);
        }
      }
    }

    if (event.type === 'invoice.payment_failed') {
      // Stripe moved the subscription off the invoice root in API 2025-03-31
      // (basil); this SDK pins 2026-09-30 (endive), where it lives under
      // parent.subscription_details. Reading the old location meant subId was
      // always undefined, so no organization was ever marked past_due. The
      // older shapes are kept for any event replayed from an older API version.
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string | { id?: string } | null;
      };
      const parentSub = invoice.parent?.subscription_details?.subscription;
      const subId =
        (typeof parentSub === 'string' ? parentSub : parentSub?.id) ??
        (typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id);
      if (subId) {
        if (isDemo()) {
          await mutateDemo((d) => {
            if (d.organization.stripe_subscription_id === subId) {
              d.organization.subscription_status = 'past_due';
            }
          });
        }
        if (db) {
          await db
            .from('organizations')
            .update({ subscription_status: 'past_due' })
            .eq('stripe_subscription_id', subId);
        }
      }
    }

    if (data?.notify && data.job) {
      if (data.template === 'booking_confirmation') {
        await recordBookingOccurred(data.job.org_id).catch(() => {});
      }
      const text = `Your dumpster rental ${data.template === 'booking_confirmation' ? 'booking is confirmed' : 'payment has been received'}. Reference ${data.job.id.slice(0, 8)}.`;
      const template = data.template || 'booking_confirmation';
      await sendSms(data.job.org_id, data.job.id, data.job.customer_phone, template, text);
      await sendEmail(
        data.job.org_id,
        data.job.id,
        data.job.customer_email,
        template,
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
