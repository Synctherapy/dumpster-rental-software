import { NextResponse } from 'next/server';
import { maybeIdentity, admin } from '@/lib/server/supabase';
import { failure } from '@/lib/server/http';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const proofId = (await params).id;
    const auth = await maybeIdentity();

    if (auth && ['owner', 'dispatcher'].includes(auth.member.role)) {
      const db = admin();
      const { data, error } = await db
        .from('delivery_proofs')
        .select('storage_key')
        .eq('id', proofId)
        .eq('org_id', auth.member.org_id)
        .single();
      if (error || !data) throw new Error('Proof not found');
      const signed = await db.storage.from('delivery-proofs').createSignedUrl(data.storage_key, 300);
      if (signed.error) throw signed.error;
      return NextResponse.redirect(signed.data.signedUrl);
    }

    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    if (!key) throw new Error('FORBIDDEN');

    const db = admin();
    const { data: proof, error: proofError } = await db
      .from('delivery_proofs')
      .select('storage_key, job_id')
      .eq('id', proofId)
      .single();
    if (proofError || !proof) throw new Error('FORBIDDEN');

    let jobMatches = proof.job_id === key;
    if (!jobMatches) {
      const { data: jobData } = await db
        .from('jobs')
        .select('id')
        .eq('id', proof.job_id)
        .eq('booking_key', key)
        .maybeSingle();
      if (jobData) jobMatches = true;
    }

    if (!jobMatches) throw new Error('FORBIDDEN');

    const signed = await db.storage.from('delivery-proofs').createSignedUrl(proof.storage_key, 300);
    if (signed.error) throw signed.error;
    return NextResponse.redirect(signed.data.signedUrl);
  } catch (e) {
    return failure(e);
  }
}
