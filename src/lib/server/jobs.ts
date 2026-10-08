import 'server-only';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { isDemo, mutateDemo } from './store';
import { admin, identity } from './supabase';
import { quote, invoice, platformFee } from '../pricing';
import { today, normalizePhone, normalizePostalCode, isValidPostalCode, type Job } from '../types';
import { publicOrganization } from './workspace';
import { stripe } from './stripe';
import { sendSms } from './notifications';
import { sendEmail } from './email';
import { driverToken } from './tokens';
import { validateProof } from './proofs';
export const bookingSchema = z
  .object({
    slug: z.string().min(1).max(80),
    size_yards: z.union([z.literal(10), z.literal(20), z.literal(30), z.literal(40)]),
    delivery_date: z.iso.date(),
    pickup_date: z.iso.date(),
    zip: z.string().refine(isValidPostalCode, { message: 'Enter a valid ZIP or postal code.' }),
    customer_name: z.string().trim().min(2).max(100),
    customer_phone: z.string().trim().min(7).max(25),
    customer_email: z.email(),
    delivery_address: z.string().trim().min(8).max(300),
    notes: z.string().max(1000).default(''),
    protective_boards: z.boolean().default(false).optional(),
    signature_name: z.string().trim().min(2).max(100),
    accepted_terms: z.literal(true),
    booking_key: z.uuid(),
  })
  .strict();
export async function book(input: unknown, ip: string, origin: string) {
  const parsed = bookingSchema.parse(input);
  const normalizedZip = normalizePostalCode(parsed.zip);
  const body = {
    ...parsed,
    zip: normalizedZip,
    customer_phone: normalizePhone(parsed.customer_phone),
  };
  if (body.delivery_date < today()) throw new Error('Delivery cannot be in the past.');
  const { organization: org, pricing_rules, demo } = await publicOrganization(body.slug);

  // Validate operating days
  const pricingConfig = org.pricing_config as {
    operating_days?: number[];
    min_notice_hours?: number;
    customer_fee_enabled?: boolean;
    currency?: string;
    tax_rate_percent?: number;
  } | undefined;
  const allowedDays = pricingConfig?.operating_days ?? [0, 1, 2, 3, 4, 5, 6];
  const dayOfWeek = new Date(body.delivery_date + 'T12:00:00Z').getUTCDay();
  if (!allowedDays.includes(dayOfWeek)) {
    throw new Error('Deliveries are not available on the selected day of the week.');
  }

  // Validate advance notice buffer
  const noticeHours = pricingConfig?.min_notice_hours ?? 24;
  const minLeadDays = Math.max(1, Math.ceil(noticeHours / 24));
  const earliestAllowed = new Date();
  earliestAllowed.setUTCDate(earliestAllowed.getUTCDate() + minLeadDays);
  const earliestStr = earliestAllowed.toISOString().slice(0, 10);
  if (body.delivery_date < earliestStr) {
    throw new Error(`Deliveries require at least ${noticeHours} hours advance notice.`);
  }

  const rule = pricing_rules.find((r) => r.size_yards === body.size_yards);
  if (!rule) throw new Error('That size is unavailable.');
  const servesZip = rule.service_zips.some(
    (z: string) => normalizePostalCode(z) === normalizedZip,
  );
  if (!servesZip)
    throw new Error('This ZIP or postal code is outside our service area.');
  const customerFee = pricingConfig?.customer_fee_enabled !== false;
  const taxPercent = pricingConfig?.tax_rate_percent ?? 0;
  const price = quote(rule, body.delivery_date, body.pickup_date, 100, {
    customerFee,
    boards: body.protective_boards,
    taxPercent,
  });
  const job: Job = {
    id: randomUUID(),
    org_id: org.id,
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    customer_email: body.customer_email,
    delivery_address: body.delivery_address,
    zip: body.zip,
    size_yards: body.size_yards,
    delivery_date: body.delivery_date,
    pickup_date: body.pickup_date,
    status: demo ? 'booked' : 'quoted',
    price_cents: price.total,
    deposit_cents: price.total,
    tons_included: rule.included_tons,
    tons_actual: null,
    extra_day_cents: rule.extra_day_cents,
    driver_id: null,
    container_id: null,
    notes: body.notes,
    signature: { name: body.signature_name, timestamp: new Date().toISOString(), ip },
    created_at: new Date().toISOString(),
    delivered_at: null,
    picked_up_at: null,
    proof_url: null,
    protective_boards: body.protective_boards ?? false,
    stripe_customer_id: null,
    stripe_payment_method_id: null,
    booking_key: body.booking_key,
    pricing_snapshot: rule,
  };
  if (demo) {
    const result = await mutateDemo((d) => {
      const existing = d.jobs.find((j) => j.booking_key === body.booking_key);
      if (existing) return { job: existing, reused: true };
      d.jobs.unshift(job);
      d.payments.unshift({
        id: randomUUID(),
        org_id: org.id,
        job_id: job.id,
        stripe_payment_intent_id: null,
        amount_cents: price.total,
        application_fee_cents: price.fee,
        status: 'demo',
        idempotency_key: `deposit-${job.id}`,
        created_at: new Date().toISOString(),
        refunded_cents: 0,
      });
      return { job, reused: false };
    });
    if (!result.reused) {
      const text = `Your ${body.size_yards} yd dumpster is booked for ${body.delivery_date}. Reference ${result.job.id.slice(0, 8)}.`;
      await sendSms(org.id, result.job.id, body.customer_phone, 'booking_confirmation', text);
      await sendEmail(
        org.id,
        result.job.id,
        body.customer_email,
        'booking_confirmation',
        `Booking confirmed · ${org.name}`,
        text,
      );
    }
    return { job: result.job, demo: true };
  }
  if (!org.stripe_connect_account_id) throw new Error('This hauler has not connected Stripe yet.');
  const client = stripe();
  const account = await client.accounts.retrieve(org.stripe_connect_account_id);
  if (!account.charges_enabled) throw new Error('This hauler must finish Stripe onboarding first.');
  const db = admin();
  const reservation = await db.rpc('reserve_booking', { p_job: job });
  if (reservation.error) throw new Error(reservation.error.message);
  const saved = reservation.data as Job;
  if (saved.status !== 'quoted')
    throw new Error('This reservation is already booked. Do not pay again.');
  if (saved.stripe_checkout_session_id) {
    const previous = await client.checkout.sessions.retrieve(
      saved.stripe_checkout_session_id,
      {},
      { stripeAccount: org.stripe_connect_account_id },
    );
    if (previous.status === 'open' && previous.payment_status !== 'paid')
      return { url: previous.url, demo: false };
    throw new Error(
      previous.payment_status === 'paid'
        ? 'Your payment was received. Confirmation is processing; do not pay again.'
        : 'This checkout expired. Start a new booking.',
    );
  }
  const currencyCode = (pricingConfig?.currency || 'usd').toLowerCase();
  const checkout = await client.checkout.sessions.create(
    {
      mode: 'payment',
      customer_creation: 'always',
      expires_at: Math.floor(Date.now() / 1000) + 1800,
      customer_email: body.customer_email,
      line_items: [
        {
          price_data: {
            currency: currencyCode,
            unit_amount: price.baseRental,
            product_data: { name: `${saved.size_yards} yd dumpster rental` },
          },
          quantity: 1,
        },
        ...(price.reservationFee > 0
          ? [
              {
                price_data: {
                  currency: currencyCode,
                  unit_amount: price.reservationFee,
                  product_data: { name: 'Priority Dispatch & Online Reservation' },
                },
                quantity: 1,
              },
            ]
          : []),
        ...(price.boardsFee > 0
          ? [
              {
                price_data: {
                  currency: currencyCode,
                  unit_amount: price.boardsFee,
                  product_data: { name: 'Protective wood boards under rails' },
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      payment_intent_data: {
        application_fee_amount: price.fee,
        setup_future_usage: 'off_session',
        metadata: { job_id: saved.id, org_id: org.id, kind: 'deposit' },
      },
      metadata: { job_id: saved.id, org_id: org.id },
      success_url: `${origin}/book/${org.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book/${org.slug}?cancelled=true`,
    },
    {
      stripeAccount: org.stripe_connect_account_id,
      idempotencyKey: `checkout-${saved.id}`,
    },
  );
  const { error: sessionError } = await db
    .from('jobs')
    .update({ stripe_checkout_session_id: checkout.id })
    .eq('id', saved.id);
  if (sessionError) throw new Error('Unable to save checkout. Retry this same booking safely.');
  return { url: checkout.url, demo: false };
}
export const changeSchema = z
  .object({
    status: z.enum(['dispatched', 'delivered', 'picked_up', 'completed', 'cancelled']).optional(),
    driver_id: z.string().nullable().optional(),
    container_id: z.string().nullable().optional(),
    delivery_date: z.iso.date().optional(),
    pickup_date: z.iso.date().optional(),
    notes: z.string().max(2000).optional(),
    tons_actual: z.number().min(0).max(100).optional(),
    proof_url: z.string().max(500).optional(),
    scale_ticket_url: z.string().max(500).optional(),
    driver_notes: z.string().max(1000).nullable().optional(),
  })
  .strict();
export async function changeJob(
  id: string,
  input: unknown,
  origin: string,
  driverIdentity?: { org: string; driver: string },
) {
  const patch = changeSchema.parse(input);
  const demo = isDemo();
  let job: Job;
  if (
    driverIdentity &&
    (Object.keys(patch).some((k) => !['status', 'tons_actual', 'proof_url', 'scale_ticket_url', 'driver_notes'].includes(k)) ||
      (patch.status && !['delivered', 'picked_up'].includes(patch.status)))
  )
    throw new Error('FORBIDDEN');
  if (!demo && patch.status === 'completed')
    throw new Error('Use the invoice payment action to close this job.');
  if (demo) {
    job = await mutateDemo(async (d) => {
      const j = d.jobs.find((j) => j.id === id);
      if (!j) throw new Error('Job not found');
      if (['completed', 'cancelled'].includes(j.status)) throw new Error('This job is closed.');
      if (patch.proof_url) await validateProof(patch.proof_url, j.id, j.org_id);
      if (
        driverIdentity &&
        (j.org_id !== driverIdentity.org || j.driver_id !== driverIdentity.driver)
      )
        throw new Error('FORBIDDEN');
      const transitions: Record<string, string[]> = {
        booked: ['dispatched', 'cancelled'],
        dispatched: ['delivered', 'cancelled'],
        delivered: ['picked_up'],
        picked_up: ['completed'],
        completed: [],
        cancelled: [],
        quoted: ['cancelled'],
      };
      if (
        patch.status &&
        patch.status !== j.status &&
        !transitions[j.status].includes(patch.status)
      )
        throw new Error('Move this job through its stages in order.');
      if (patch.delivery_date || patch.pickup_date)
        quote(
          j.pricing_snapshot,
          patch.delivery_date ?? j.delivery_date,
          patch.pickup_date ?? j.pickup_date,
          25,
        );
      const driver = d.users.find(
        (u) => u.id === (patch.driver_id ?? j.driver_id) && u.role === 'driver',
      );
      const container = d.containers.find((c) => c.id === (patch.container_id ?? j.container_id));
      if (patch.status === 'dispatched') {
        if (!driver || !container)
          throw new Error('Assign a driver and a container before dispatching.');
        if (container.size_yards !== j.size_yards)
          throw new Error('Container size must match the booking.');
        if (container.status !== 'yard' && container.current_job_id !== j.id)
          throw new Error(
            'This container is already on site or in maintenance. Choose an available container.',
          );
        if (container.current_job_id && container.current_job_id !== j.id)
          throw new Error('Container is already assigned.');
        container.status = 'on_site';
        container.current_job_id = j.id;
      }
      if (
        ['dispatched', 'delivered'].includes(j.status) &&
        patch.container_id &&
        patch.container_id !== j.container_id
      ) {
        // Fix for competitor complaint #4: "Wrong can, and no way to fix it"
        // Allow operator to correct or swap the container number on active rental
        const oldContainer = d.containers.find((c) => c.id === j.container_id);
        if (oldContainer) {
          oldContainer.status = 'yard';
          oldContainer.current_job_id = null;
        }
        if (container) {
          if (container.status !== 'yard' && container.current_job_id !== j.id) {
            throw new Error('New container is already on site or in maintenance.');
          }
          container.status = 'on_site';
          container.current_job_id = j.id;
        }
        j.notes = (j.notes ? j.notes + ' ' : '') + `[Container corrected from ${oldContainer?.label ?? 'unassigned'} to ${container?.label ?? patch.container_id}]`;
      }
      if (patch.status === 'delivered' && !(patch.proof_url || j.proof_url))
        throw new Error('Upload a delivery photo first.');
      if (patch.status === 'delivered') j.delivered_at = new Date().toISOString();
      if (patch.status === 'picked_up') j.picked_up_at = new Date().toISOString();
      if (patch.status === 'picked_up' || patch.status === 'cancelled') {
        const c = d.containers.find((c) => c.current_job_id === j.id);
        if (c) {
          c.status = 'yard';
          c.current_job_id = null;
        }
      }
      Object.assign(j, patch);
      j.price_cents = quote(j.pricing_snapshot, j.delivery_date, j.pickup_date, 100).total;
      return j;
    });
  } else {
    const db = admin();
    let org: string;
    if (driverIdentity) {
      org = driverIdentity.org;
    } else {
      const { member } = await identity();
      if (!['owner', 'dispatcher'].includes(member.role)) throw new Error('FORBIDDEN');
      org = member.org_id;
    }
    if (patch.proof_url) await validateProof(patch.proof_url, id, org);
    const result = await db.rpc('transition_job', {
      p_id: id,
      p_org: org,
      p_patch: patch,
      p_driver: driverIdentity?.driver ?? null,
    });
    if (result.error) throw new Error(result.error.message);
    job = result.data;
    if (patch.scale_ticket_url) {
      const attached = await db.rpc('attach_scale_ticket', {
        p_id: id,
        p_org: org,
        p_url: patch.scale_ticket_url,
      });
      if (attached.error) throw new Error(attached.error.message);
      job.scale_ticket_url = patch.scale_ticket_url;
    }
  }
  if (patch.status === 'dispatched') {
    const d = demo ? await import('./store').then((m) => m.readDemo()) : null;
    const driver = demo
      ? d!.users.find((u) => u.id === job.driver_id)
      : (await admin().from('users').select('*').eq('id', job.driver_id!).single()).data;
    if (driver)
      await sendSms(
        job.org_id,
        job.id,
        driver.phone,
        'driver_dispatch',
        `Your next delivery: ${job.delivery_address}. Open your route: ${origin}/driver/${driverToken(job.org_id, driver.id)}`,
      );
  }
  if (patch.status === 'delivered' || patch.status === 'picked_up') {
    await sendSms(
      job.org_id,
      job.id,
      job.customer_phone,
      patch.status,
      `Your dumpster has been ${patch.status === 'delivered' ? 'delivered' : 'picked up'}. Thank you!`,
    );
    if (patch.status === 'picked_up') {
      const org = demo
        ? (await import('./store').then((m) => m.readDemo())).organization
        : (await admin().from('organizations').select('*').eq('id', job.org_id).single()).data;
      const reviewUrl = org?.google_review_url || org?.pricing_config?.google_review_url;
      if (reviewUrl) {
        const reviewText = `Thank you for choosing ${org?.name || 'us'}! If you had a great experience, could you take 30 seconds to leave us a quick Google review? ${reviewUrl}`;
        await sendSms(job.org_id, job.id, job.customer_phone, 'review_request', reviewText);
      }
    }
  }
  return job;
}
export async function chargeInvoice(id: string) {
  const demo = isDemo();
  if (demo)
    return mutateDemo((d) => {
      const job = d.jobs.find((j) => j.id === id);
      if (!job) throw new Error('Job not found');
      if (!['picked_up', 'completed'].includes(job.status))
        throw new Error('Pick up the container before invoicing.');
      if (job.tons_actual === null)
        throw new Error('Record actual tonnage before closing the job.');
      if (invoice(job).overage > 0 && !job.scale_ticket_url)
        throw new Error('Attach the landfill scale ticket before charging an overage.');
      const key = `invoice-${job.id}`;
      const existing = d.payments.find((p) => p.idempotency_key === key);
      if (existing) return existing;
      const paid = d.payments
        .filter((p) => p.job_id === id && ['demo', 'succeeded'].includes(p.status))
        .reduce((s, p) => s + p.amount_cents - p.refunded_cents, 0);
      const amount = Math.max(0, invoice(job).total - paid);
      const payment = {
        id: randomUUID(),
        org_id: job.org_id,
        job_id: id,
        stripe_payment_intent_id: null,
        amount_cents: amount,
        application_fee_cents: platformFee(amount),
        status: 'demo' as const,
        idempotency_key: key,
        created_at: new Date().toISOString(),
        refunded_cents: 0,
      };
      d.payments.push(payment);
      job.status = 'completed';
      return payment;
    });
  const { db, member } = await identity();
  if (member.role !== 'owner') throw new Error('FORBIDDEN');
  const client = stripe();
  const preview = await admin().from('jobs').select('scale_ticket_url,tons_actual,tons_included,pricing_snapshot').eq('id', id).single();
  if (preview.error) throw new Error(preview.error.message);
  const previewJob = preview.data as Job;
  if (invoice(previewJob).overage > 0 && !previewJob.scale_ticket_url)
    throw new Error('Attach the landfill scale ticket before charging an overage.');
  const locked = await admin().rpc('prepare_invoice', { p_job_id: id, p_org: member.org_id });
  if (locked.error) throw new Error(locked.error.message);
  const { job, amount_cents, account_id, attempt } = locked.data;
  if (amount_cents === 0) return { status: 'succeeded', zero_balance: true };
  if (!job.stripe_customer_id || !job.stripe_payment_method_id)
    throw new Error('No saved payment method. Customer action is required.');
  if (amount_cents <= 0) throw new Error('No balance to charge.');
  if (attempt.stripe_payment_intent_id) {
    const existing = await client.paymentIntents.retrieve(
      attempt.stripe_payment_intent_id,
      {},
      { stripeAccount: account_id },
    );
    if (['requires_payment_method', 'requires_action'].includes(existing.status))
      throw new Error(
        'This payment needs customer action. Resolve it in Stripe before retrying; no new charge was created.',
      );
    return { stripe_payment_intent_id: existing.id, status: existing.status };
  }
  if (Date.now() - Date.parse(attempt.created_at) > 23 * 3600000)
    throw new Error('Reconcile this invoice in Stripe before retrying an older attempt.');
  const orgCurrency =
    (job.pricing_snapshot?.currency || (member as { currency?: string }).currency || 'usd').toLowerCase();
  let pi;
  try {
    pi = await client.paymentIntents.create(
      {
        amount: amount_cents,
        currency: orgCurrency,
        customer: job.stripe_customer_id,
        payment_method: job.stripe_payment_method_id,
        off_session: true,
        confirm: true,
        application_fee_amount: 0,
        metadata: { job_id: id, org_id: member.org_id, kind: 'invoice' },
      },
      {
        stripeAccount: account_id,
        idempotencyKey: `invoice-${id}`,
      },
    );
  } catch (error) {
    const failed = (error as { payment_intent?: { id: string } }).payment_intent;
    if (failed?.id)
      await admin()
        .from('invoice_attempts')
        .update({ stripe_payment_intent_id: failed.id })
        .eq('job_id', id);
    throw error;
  }
  const savedAttempt = await admin()
    .from('invoice_attempts')
    .update({ stripe_payment_intent_id: pi.id })
    .eq('job_id', id);
  if (savedAttempt.error)
    throw new Error(
      'Payment submitted; confirmation is pending. Retry safely without creating a new invoice.',
    );
  const { error } = await db.from('payments').select('id').eq('job_id', id);
  if (error) throw error;
  return { stripe_payment_intent_id: pi.id, status: pi.status };
}
