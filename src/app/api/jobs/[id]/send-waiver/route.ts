import { NextResponse } from 'next/server';
import { isDemo, readDemo } from '@/lib/server/store';
import { identity } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { sendSms } from '@/lib/server/notifications';
import { sendEmail } from '@/lib/server/email';

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

      const org = demoData.organization;
      const smsText = `${org.name}: Please tap here to review and sign your dumpster rental agreement & property damage waiver: ${agreementUrl}`;
      await sendSms(org.id, job.id, job.customer_phone, 'waiver_link', smsText);

      if (job.customer_email && !job.customer_email.endsWith('@phone.rollos')) {
        await sendEmail(
          org.id,
          job.id,
          job.customer_email,
          'waiver_link',
          `Action Required: Sign Your Dumpster Rental Agreement · ${org.name}`,
          `Hi ${job.customer_name},\n\nPlease review and electronically sign your dumpster rental agreement and property damage waiver before container placement:\n\n${agreementUrl}\n\nThank you,\n${org.name}`,
        );
      }

      return NextResponse.json({ ok: true, sent_to: job.customer_phone });
    }

    const { member, db } = await identity();
    if (!['owner', 'dispatcher'].includes(member.role)) throw new Error('FORBIDDEN');

    const { data: job, error: jobErr } = await db
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('org_id', member.org_id)
      .single();

    if (jobErr || !job) throw new Error('Job not found');

    const { data: org } = await db
      .from('organizations')
      .select('name')
      .eq('id', member.org_id)
      .single();

    const orgName = org?.name || 'Dumpster Dispatch';
    const smsText = `${orgName}: Please tap here to review and sign your dumpster rental agreement & property damage waiver: ${agreementUrl}`;
    await sendSms(member.org_id, job.id, job.customer_phone, 'waiver_link', smsText);

    if (job.customer_email && !job.customer_email.endsWith('@phone.rollos')) {
      await sendEmail(
        member.org_id,
        job.id,
        job.customer_email,
        'waiver_link',
        `Action Required: Sign Your Dumpster Rental Agreement · ${orgName}`,
        `Hi ${job.customer_name},\n\nPlease review and electronically sign your dumpster rental agreement and property damage waiver before container placement:\n\n${agreementUrl}\n\nThank you,\n${orgName}`,
      );
    }

    return NextResponse.json({ ok: true, sent_to: job.customer_phone });
  } catch (e) {
    return failure(e);
  }
}
