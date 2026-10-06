import { NextResponse } from 'next/server';
import { identity, admin } from '@/lib/server/supabase';
import { failure } from '@/lib/server/http';
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { member } = await identity();
    if (!['owner', 'dispatcher'].includes(member.role)) throw new Error('FORBIDDEN');
    const db = admin();
    const { data, error } = await db
      .from('delivery_proofs')
      .select('storage_key')
      .eq('id', (await params).id)
      .eq('org_id', member.org_id)
      .single();
    if (error || !data) throw new Error('Proof not found');
    const signed = await db.storage.from('delivery-proofs').createSignedUrl(data.storage_key, 300);
    if (signed.error) throw signed.error;
    return NextResponse.redirect(signed.data.signedUrl);
  } catch (e) {
    return failure(e);
  }
}
