import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isDemo, mutateDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { sendSms } from '@/lib/server/notifications';

const signSchema = z.object({
  signature_name: z.string().trim().min(2).max(100),
  accepted_terms: z.literal(true),
});

const ALREADY_SIGNED =
  'This agreement has already been signed. Contact your hauler if the signature needs to be corrected.';

/**
 * The signer's address, for a document that may be produced in a dispute.
 * `x-vercel-forwarded-for` is set by the platform and overwrites anything the
 * client sends; the others are fallbacks for other hosting, where a determined
 * client can influence the value.
 */
function clientIp(request: Request) {
  return (
    request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'remote-client'
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const { id } = await params;
    const body = signSchema.parse(await request.json());
    const ip = clientIp(request);

    const timestamp = new Date().toISOString();

    if (isDemo()) {
      const updated = await mutateDemo((d) => {
        const job = d.jobs.find((j) => j.id === id);
        if (!job) throw new Error('Job not found');
        if (job.signed_by_customer) throw new Error(ALREADY_SIGNED);
        job.signature = {
          name: body.signature_name,
          timestamp,
          ip,
        };
        job.signed_by_customer = true;
        return { job, org: d.organization };
      });

      // Send SMS confirmation that waiver was successfully signed
      const smsText = `${updated.org?.name || 'Your dumpster rental'}: Your rental agreement & property waiver has been signed and recorded. Reference #${id.slice(0, 8).toUpperCase()}.`;
      await sendSms(updated.org.id, id, updated.job.customer_phone, 'waiver_signed', smsText);

      return NextResponse.json({ ok: true, job: updated.job });
    }

    const db = admin();
    const { data: job, error: jobErr } = await db
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    // A job that is not in this database is not found. It must never fall back
    // to writing a signature into the demo workspace.
    if (jobErr || !job) throw new Error('Job not found');
    if (job.signed_by_customer) throw new Error(ALREADY_SIGNED);

    const updatedSignature = {
      name: body.signature_name,
      timestamp,
      ip,
    };

    // `is('signed_by_customer', false)` makes this write-once even if two
    // requests arrive at the same time: the second matches no row.
    const { data: saved, error: updateErr } = await db
      .from('jobs')
      .update({
        signature: updatedSignature,
        signed_by_customer: true,
      })
      .eq('id', id)
      .is('signed_by_customer', false)
      .select('*')
      .single();

    if (updateErr || !saved) throw new Error(ALREADY_SIGNED);

    const { data: org } = await db
      .from('organizations')
      .select('name')
      .eq('id', job.org_id)
      .single();

    const orgName = org?.name || 'Your dumpster rental';
    const smsText = `${orgName}: Your rental agreement & property waiver has been signed and recorded. Reference #${id.slice(0, 8).toUpperCase()}.`;
    await sendSms(job.org_id, id, job.customer_phone, 'waiver_signed', smsText);

    return NextResponse.json({ ok: true, job: saved });
  } catch (e) {
    return failure(e);
  }
}
