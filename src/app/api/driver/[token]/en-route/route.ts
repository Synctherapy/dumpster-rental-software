import { NextResponse } from 'next/server';
import { verifyDriverToken } from '@/lib/server/tokens';
import { isDemo, readDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
import { sendSms } from '@/lib/server/notifications';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    assertSameOrigin(request);
    const t = verifyDriverToken((await params).token);
    const { job_id } = await request.json();
    const job = isDemo()
      ? (await readDemo()).jobs.find((j) => j.id === job_id)
      : (
          await admin()
            .from('jobs')
            .select('*')
            .eq('id', job_id)
            .eq('org_id', t.org)
            .eq('driver_id', t.driver)
            .single()
        ).data;
    if (!job || job.org_id !== t.org || job.driver_id !== t.driver) throw new Error('FORBIDDEN');
    if (job.status !== 'dispatched') throw new Error('This delivery is not awaiting a driver.');
    const status = await sendSms(
      job.org_id,
      job.id,
      job.customer_phone,
      'driver_en_route',
      'Your dumpster delivery driver is on the way. Please keep the placement area clear.',
    );
    return NextResponse.json({ status });
  } catch (e) {
    return failure(e);
  }
}
