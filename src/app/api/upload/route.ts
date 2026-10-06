import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { isDemo, readDemo } from '@/lib/server/store';
import { admin, identity } from '@/lib/server/supabase';
import { verifyDriverToken } from '@/lib/server/tokens';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const form = await request.formData();
    const file = form.get('photo');
    const job_id = String(form.get('job_id') ?? '');
    if (!(file instanceof File) || file.size > 8 * 1024 * 1024 || file.size < 4)
      throw new Error('Choose a JPEG or PNG photo under 8 MB.');
    const buffer = Buffer.from(await file.arrayBuffer());
    const png = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const jpg = buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
    if (!png && !jpg) throw new Error('Only JPEG and PNG photos are accepted.');
    const token = form.get('token');
    let org: string;
    let driver: string | null = null;
    if (token) {
      const t = verifyDriverToken(String(token));
      org = t.org;
      driver = t.driver;
    } else if (isDemo()) org = (await readDemo()).organization.id;
    else {
      const { member } = await identity();
      if (!['owner', 'dispatcher'].includes(member.role)) throw new Error('FORBIDDEN');
      org = member.org_id;
    }
    const demo = isDemo();
    const job = demo
      ? (await readDemo()).jobs.find((j) => j.id === job_id)
      : (
          await admin()
            .from('jobs')
            .select('id,org_id,driver_id')
            .eq('id', job_id)
            .eq('org_id', org)
            .single()
        ).data;
    if (!job || job.org_id !== org || (driver && job.driver_id !== driver))
      throw new Error('FORBIDDEN');
    const filename = `${randomUUID()}.${png ? 'png' : 'jpg'}`;
    if (demo) {
      const directory = path.join(
        process.env.ROLLOS_DATA_DIR || path.join(process.cwd(), '.rollos'),
        'photos',
      );
      await mkdir(directory, { recursive: true });
      await writeFile(path.join(directory, filename), buffer);
      await writeFile(
        path.join(directory, filename + '.json'),
        JSON.stringify({ job_id, org_id: org }),
      );
      return NextResponse.json({ url: `/api/photos/${filename}` });
    }
    const key = `${org}/${job_id}/${filename}`;
    const db = admin();
    const { error } = await db.storage
      .from('delivery-proofs')
      .upload(key, buffer, { contentType: png ? 'image/png' : 'image/jpeg' });
    if (error) throw error;
    const id = randomUUID();
    const { error: recordError } = await db
      .from('delivery_proofs')
      .insert({ id, org_id: org, job_id, storage_key: key });
    if (recordError) throw recordError;
    return NextResponse.json({ url: `/api/proof/${id}` });
  } catch (e) {
    return failure(e);
  }
}
