import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isDemo, mutateDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
import { failure } from '@/lib/server/http';
import { sendSms } from '@/lib/server/notifications';

const signSchema = z.object({
  signature_name: z.string().trim().min(2).max(100),
  accepted_terms: z.literal(true),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = signSchema.parse(await request.json());
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'remote-client';

    const timestamp = new Date().toISOString();

    if (isDemo()) {
      const updated = await mutateDemo((d) => {
        const job = d.jobs.find((j) => j.id === id);
        if (!job) throw new Error('Job not found');
        job.signature = {
          name: body.signature_name,
          timestamp,
          ip,
        };
        job.signed_by_customer = true;
        return { job, org: d.organization };
      });

      // Send SMS confirmation that waiver was successfully signed
      const smsText = `Texas Haul Off: Your rental agreement & property waiver has been signed and recorded. Reference #${id.slice(0, 8).toUpperCase()}.`;
      await sendSms(updated.org.id, id, updated.job.customer_phone, 'waiver_signed', smsText);

      return NextResponse.json({ ok: true, job: updated.job });
    }

    const db = admin();
    const { data: job, error: jobErr } = await db
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (jobErr || !job) throw new Error('Job not found');

    const updatedSignature = {
      name: body.signature_name,
      timestamp,
      ip,
    };

    const { data: saved, error: updateErr } = await db
      .from('jobs')
      .update({
        signature: updatedSignature,
        signed_by_customer: true,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateErr) throw new Error(updateErr.message);

    const smsText = `Your rental agreement & property waiver has been signed and recorded. Reference #${id.slice(0, 8).toUpperCase()}.`;
    await sendSms(job.org_id, id, job.customer_phone, 'waiver_signed', smsText);

    return NextResponse.json({ ok: true, job: saved });
  } catch (e) {
    return failure(e);
  }
}
