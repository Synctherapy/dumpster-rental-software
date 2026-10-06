import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { isDemo } from './store';
import { admin } from './supabase';
export async function validateProof(url: string, job: string, org: string) {
  if (isDemo()) {
    if (!/^\/api\/photos\/[0-9a-f-]+\.(png|jpg)$/.test(url))
      throw new Error('Upload a delivery photo for this job first.');
    const file = url.split('/').pop()!;
    const directory = path.join(
      process.env.ROLLOS_DATA_DIR || path.join(process.cwd(), '.rollos'),
      'photos',
    );
    try {
      const metadata = JSON.parse(await readFile(path.join(directory, file + '.json'), 'utf8'));
      if (metadata.job_id !== job || metadata.org_id !== org) throw new Error('Wrong job');
      await readFile(path.join(directory, file));
    } catch {
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
