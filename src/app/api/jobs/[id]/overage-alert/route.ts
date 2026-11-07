import { NextResponse } from 'next/server';
import { isDemo, readDemo } from '@/lib/server/store';
import { identity } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { sendSms } from '@/lib/server/notifications';
import { sendEmail } from '@/lib/server/email';
import { invoice } from '@/lib/pricing';
import { money, type Job } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const { id } = await params;
    const origin = process.env.APP_URL || new URL(request.url).origin;
    const agreementUrl = `${origin}/agreement/${id}`;

    if (isDemo()) {
      const demoData = await readDemo();
      const job = demoData.jobs.find((j) => j.id === id);
      if (!job) throw new Error('Job not found');
      if (job.tons_actual === null || job.tons_actual <= job.tons_included) {
        throw new Error('Job must have an actual landfill weight exceeding included tonnage.');
      }

      const breakdown = invoice(job);
      const overageCents = breakdown.overage;
      const extraTons = job.tons_actual - job.tons_included;
      const org = demoData.organization;
      const orgName = org?.name || 'Dumpster Dispatch';
      const smsText = `${orgName}: Certified landfill weight for your ${job.size_yards}yd dumpster at ${job.delivery_address} was ${job.tons_actual} tons (${extraTons.toFixed(2)} tons over the ${job.tons_included}-ton allowance = ${money(overageCents)}). View your weight slip & receipt: ${agreementUrl} — Your card on file will be billed for the balance.`;
      const uniqueness = String(Date.now());

      await sendSms(
        org.id,
        job.id,
        job.customer_phone,
        'overage_courtesy_alert',
        smsText,
        uniqueness,
      );

      if (job.customer_email && !job.customer_email.endsWith('@phone.rollos')) {
        await sendEmail(
          org.id,
          job.id,
          job.customer_email,
          'overage_courtesy_alert',
          `Certified Landfill Weight Slip & Overage Notice · ${orgName}`,
          `Hi ${job.customer_name},\n\nCertified landfill weight for your ${job.size_yards}yd dumpster at ${job.delivery_address} was ${job.tons_actual} tons (${extraTons.toFixed(2)} tons over the ${job.tons_included}-ton allowance = ${money(overageCents)}).\n\nView your weight slip & receipt:\n${agreementUrl}\n\nYour card on file will be billed for the balance.\n\nThank you,\n${orgName}`,
          uniqueness,
        );
      }

      return NextResponse.json({ ok: true, sent_to: job.customer_phone });
    }

    const { member, db } = await identity();
    if (!['owner', 'dispatcher'].includes(member.role)) throw new Error('FORBIDDEN');

    const { data: jobRow, error: jobErr } = await db
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('org_id', member.org_id)
      .single();

    if (jobErr || !jobRow) throw new Error('Job not found');
    const job = jobRow as Job;

    if (job.tons_actual === null || job.tons_actual <= job.tons_included) {
      throw new Error('Job must have an actual landfill weight exceeding included tonnage.');
    }

    const { data: org } = await db
      .from('organizations')
      .select('name')
      .eq('id', member.org_id)
      .single();

    const breakdown = invoice(job);
    const overageCents = breakdown.overage;
    const extraTons = job.tons_actual - job.tons_included;
    const orgName = org?.name || 'Dumpster Dispatch';
    const smsText = `${orgName}: Certified landfill weight for your ${job.size_yards}yd dumpster at ${job.delivery_address} was ${job.tons_actual} tons (${extraTons.toFixed(2)} tons over the ${job.tons_included}-ton allowance = ${money(overageCents)}). View your weight slip & receipt: ${agreementUrl} — Your card on file will be billed for the balance.`;
    const uniqueness = String(Date.now());

    await sendSms(
      member.org_id,
      job.id,
      job.customer_phone,
      'overage_courtesy_alert',
      smsText,
      uniqueness,
    );

    if (job.customer_email && !job.customer_email.endsWith('@phone.rollos')) {
      await sendEmail(
        member.org_id,
        job.id,
        job.customer_email,
        'overage_courtesy_alert',
        `Certified Landfill Weight Slip & Overage Notice · ${orgName}`,
        `Hi ${job.customer_name},\n\nCertified landfill weight for your ${job.size_yards}yd dumpster at ${job.delivery_address} was ${job.tons_actual} tons (${extraTons.toFixed(2)} tons over the ${job.tons_included}-ton allowance = ${money(overageCents)}).\n\nView your weight slip & receipt:\n${agreementUrl}\n\nYour card on file will be billed for the balance.\n\nThank you,\n${orgName}`,
        uniqueness,
      );
    }

    return NextResponse.json({ ok: true, sent_to: job.customer_phone });
  } catch (e) {
    return failure(e);
  }
}
