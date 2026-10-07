import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { isDemo, mutateDemo, readDemo } from '@/lib/server/store';
import { admin, identity } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { quote, platformFee } from '@/lib/pricing';
import { today, type Job } from '@/lib/types';
import { sendSms } from '@/lib/server/notifications';

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (raw.startsWith('+') && digits.length >= 8) return `+${digits}`;
  return raw;
}

const quickOrderSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  customer_phone: z.string().trim().min(7).max(25),
  customer_email: z.string().trim().email().or(z.literal('')).optional(),
  delivery_address: z.string().trim().min(5).max(300),
  zip: z.string().regex(/^\d{5}$/),
  size_yards: z.union([z.literal(10), z.literal(20), z.literal(30), z.literal(40)]),
  delivery_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pickup_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(1000).default(''),
  driver_id: z.string().nullable().optional(),
  container_id: z.string().nullable().optional(),
  protective_boards: z.boolean().default(false).optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = quickOrderSchema.parse(await request.json());
    const formattedPhone = normalizePhone(body.customer_phone);

    if (body.delivery_date < today()) {
      throw new Error('Delivery date cannot be in the past.');
    }
    if (body.pickup_date <= body.delivery_date) {
      throw new Error('Pickup date must be after delivery date.');
    }

    const email =
      body.customer_email ||
      `${body.customer_name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'customer'}@phone.rollos`;

    let createdJob: Job;

    if (isDemo()) {
      const demoData = await readDemo();
      const org = demoData.organization;
      const rule = demoData.pricing_rules.find((r) => r.size_yards === body.size_yards);
      if (!rule) throw new Error('Selected dumpster size pricing rule not found.');

      const customerFee = org.pricing_config?.customer_fee_enabled !== false;
      const price = quote(rule, body.delivery_date, body.pickup_date, 100, {
        customerFee,
        boards: body.protective_boards,
      });

      const hasAssignment = Boolean(body.driver_id && body.container_id);
      const initialStatus = hasAssignment ? 'dispatched' : 'booked';

      createdJob = await mutateDemo((d) => {
        let assignedContainer = null;
        if (body.container_id) {
          assignedContainer = d.containers.find((c) => c.id === body.container_id);
          if (!assignedContainer) throw new Error('Assigned container not found.');
          if (assignedContainer.status !== 'yard') {
            throw new Error('Assigned container is not available in yard.');
          }
          if (assignedContainer.size_yards !== body.size_yards) {
            throw new Error('Container size does not match order size.');
          }
        }

        const job: Job = {
          id: randomUUID(),
          org_id: org.id,
          customer_name: body.customer_name,
          customer_phone: formattedPhone,
          customer_email: email,
          delivery_address: body.delivery_address,
          zip: body.zip,
          size_yards: body.size_yards,
          delivery_date: body.delivery_date,
          pickup_date: body.pickup_date,
          status: initialStatus,
          price_cents: price.total,
          deposit_cents: price.total,
          tons_included: rule.included_tons,
          tons_actual: null,
          extra_day_cents: rule.extra_day_cents,
          driver_id: body.driver_id ?? null,
          container_id: body.container_id ?? null,
          notes: body.notes ? `[Phone Order] ${body.notes}` : '[Phone Order]',
          signature: {
            name: `${body.customer_name} (Phone Order by Dispatch)`,
            timestamp: new Date().toISOString(),
            ip: 'dispatch-phone',
          },
          created_at: new Date().toISOString(),
          delivered_at: null,
          picked_up_at: null,
          proof_url: null,
          protective_boards: body.protective_boards ?? false,
          stripe_customer_id: null,
          stripe_payment_method_id: null,
          booking_key: randomUUID(),
          pricing_snapshot: rule,
        };

        if (assignedContainer) {
          assignedContainer.status = 'on_site';
          assignedContainer.current_job_id = job.id;
        }

        d.jobs.unshift(job);
        d.payments.unshift({
          id: randomUUID(),
          org_id: org.id,
          job_id: job.id,
          stripe_payment_intent_id: null,
          amount_cents: price.total,
          application_fee_cents: platformFee(price.deposit),
          status: 'demo',
          idempotency_key: `phone-order-${job.id}`,
          created_at: new Date().toISOString(),
          refunded_cents: 0,
        });

        return job;
      });

      // Send SMS booking confirmation
      const smsText = `Your ${body.size_yards} yd dumpster is booked for ${body.delivery_date}. Ref: ${createdJob.id.slice(0, 8)}. Thanks for choosing ${org.name}!`;
      await sendSms(org.id, createdJob.id, formattedPhone, 'booking_confirmation', smsText);
    } else {
      const { db, member } = await identity();
      if (!['owner', 'dispatcher'].includes(member.role)) throw new Error('FORBIDDEN');

      const { data: org, error: orgErr } = await db
        .from('organizations')
        .select('*')
        .eq('id', member.org_id)
        .single();
      if (orgErr || !org) throw new Error('Organization not found');

      const { data: rules } = await db
        .from('pricing_rules')
        .select('*')
        .eq('org_id', member.org_id);
      const rule = rules?.find((r) => r.size_yards === body.size_yards);
      if (!rule) throw new Error('Selected dumpster size pricing rule not found.');

      const customerFee = org.pricing_config?.customer_fee_enabled !== false;
      const price = quote(rule, body.delivery_date, body.pickup_date, 100, {
        customerFee,
        boards: body.protective_boards,
      });

      const hasAssignment = Boolean(body.driver_id && body.container_id);
      const initialStatus = hasAssignment ? 'dispatched' : 'booked';

      const jobRow = {
        id: randomUUID(),
        org_id: member.org_id,
        customer_name: body.customer_name,
        customer_phone: formattedPhone,
        customer_email: email,
        delivery_address: body.delivery_address,
        zip: body.zip,
        size_yards: body.size_yards,
        delivery_date: body.delivery_date,
        pickup_date: body.pickup_date,
        status: initialStatus,
        price_cents: price.total,
        deposit_cents: price.total,
        tons_included: rule.included_tons,
        tons_actual: null,
        extra_day_cents: rule.extra_day_cents,
        driver_id: body.driver_id ?? null,
        container_id: body.container_id ?? null,
        notes: body.notes ? `[Phone Order] ${body.notes}` : '[Phone Order]',
        signature: {
          name: `${body.customer_name} (Phone Order)`,
          timestamp: new Date().toISOString(),
          ip: 'dispatch-phone',
        },
        pricing_snapshot: rule,
        booking_key: randomUUID(),
        created_at: new Date().toISOString(),
      };

      const { data: inserted, error: insertErr } = await admin()
        .from('jobs')
        .insert(jobRow)
        .select('*')
        .single();
      if (insertErr || !inserted) throw new Error(insertErr?.message || 'Failed to create job');
      createdJob = inserted;

      if (body.container_id) {
        await admin()
          .from('containers')
          .update({ status: 'on_site', current_job_id: createdJob.id })
          .eq('id', body.container_id);
      }

      await sendSms(
        member.org_id,
        createdJob.id,
        formattedPhone,
        'booking_confirmation',
        `Your ${body.size_yards} yd dumpster is booked for ${body.delivery_date}. Ref: ${createdJob.id.slice(0, 8)}. Thanks for choosing ${org.name}!`,
      );
    }

    return NextResponse.json({ ok: true, job: createdJob });
  } catch (e) {
    return failure(e);
  }
}
