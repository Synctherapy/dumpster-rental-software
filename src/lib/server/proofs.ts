import 'server-only';
import { isDemoOrg, readDemoPhoto } from './store';
import { admin } from './supabase';
export async function validateProof(url: string, job: string, org: string) {
  if (isDemoOrg(org)) {
    if (!/^\/api\/photos\/[0-9a-f-]+\.(png|jpg)$/.test(url))
      throw new Error('Upload a delivery photo for this job first.');
    const file = url.split('/').pop()!;
    const record = await readDemoPhoto(file);
    if (!record || record.metadata.job_id !== job || record.metadata.org_id !== org) {
      throw new Error('Delivery proof must be uploaded for this job.');
    }
  } else {
    if (!/^\/api\/proof\/[0-9a-f-]+$/.test(url))
      throw new Error('Upload a delivery photo for this job first.');
    const id = url.split('/').pop()!;
    const { data, error } = await admin()
      .from('delivery_proofs')
      .select('id')
      .eq('id', id)
      .eq('job_id', job)
      .eq('org_id', org)
      .single();
    if (error || !data) throw new Error('Delivery proof must be uploaded for this job.');
  }
}
