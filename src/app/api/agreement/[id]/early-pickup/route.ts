import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDemoSessionId, isDemo, mutateDemo, readDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { sendSms } from '@/lib/server/notifications';

const earlyPickupSchema = z.object({
  customer_note: z.string().trim().max(300).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit(request, 'sign');
    const { id } = await params;
    const rawBody = await request.json().catch(() => ({}));
    const body = earlyPickupSchema.parse(rawBody);

    const tag = body.customer_note
      ? `[EARLY PICKUP REQUESTED: ${body.customer_note}]`
      : '[EARLY PICKUP REQUESTED]';

    const requestDemoEarlyPickup = async (sessionId?: string) => {
      const updated = await mutateDemo((d) => {
        const job = d.jobs.find((j) => j.id === id);
        if (!job) throw new Error('Job not found');
        job.early_pickup_requested = true;
        if (!job.notes.includes('[EARLY PICKUP')) {
          job.notes = job.notes ? `${tag} ${job.notes}` : tag;
        }
        return { job, org: d.organization };
      }, sessionId);

      if (updated.org.phone) {
        await sendSms(
          updated.org.id,
          updated.job.id,
          updated.org.phone,
          'early_pickup_request',
          `RollOS Early Pickup Alert: ${updated.job.customer_name} (${updated.job.delivery_address}) is done loading and requested early pickup!`,
        );
      }

      return NextResponse.json({ ok: true, job: updated.job });
    };

    if (isDemo()) {
      return await requestDemoEarlyPickup();
    }

    const db = admin();
    const { data: job, error: jobErr } = await db
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (jobErr || !job) {
      const demoSession = await getDemoSessionId();
      if (demoSession && (await readDemo(demoSession)).jobs.some((j) => j.id === id)) {
        return await requestDemoEarlyPickup(demoSession);
      }
      throw new Error('Job not found');
    }

    const currentNotes: string = job.notes || '';
    const updatedNotes = currentNotes.includes('[EARLY PICKUP')
      ? currentNotes
      : currentNotes
        ? `${tag} ${currentNotes}`
        : tag;

    const { data: saved, error: updateErr } = await db
      .from('jobs')
      .update({ notes: updatedNotes })
      .eq('id', id)
      .select('*')
      .single();

    if (updateErr || !saved) throw new Error(updateErr?.message || 'Failed to update job');

    const { data: org } = await db
      .from('organizations')
      .select('id,name,phone')
      .eq('id', job.org_id)
      .single();

    if (org?.phone) {
      await sendSms(
        job.org_id,
        id,
        org.phone,
        'early_pickup_request',
        `RollOS Early Pickup Alert: ${job.customer_name} (${job.delivery_address}) is done loading and requested early pickup!`,
      );
    }

    return NextResponse.json({ ok: true, job: saved });
  } catch (e) {
    return failure(e);
  }
}
