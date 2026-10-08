import { NextResponse } from 'next/server';
import { verifyDriverToken } from '@/lib/server/tokens';
import { isDemo, readDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
import { changeJob } from '@/lib/server/jobs';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const t = verifyDriverToken((await params).token);
    if (isDemo()) {
      const d = await readDemo();
      return NextResponse.json({
        driver: d.users.find((u) => u.id === t.driver),
        jobs: d.jobs.filter(
          (j) =>
            j.org_id === t.org &&
            j.driver_id === t.driver &&
            ['dispatched', 'delivered', 'picked_up'].includes(j.status),
        ),
        organization: {
          name: d.organization.name,
          subscription_status: d.organization.subscription_status ?? 'paid',
          is_paid_plan: (d.organization.subscription_status ?? 'paid') === 'paid',
        },
        demo: true,
      });
    }
    const db = admin();
    const { data: jobs, error } = await db
      .from('jobs')
      .select('*')
      .eq('org_id', t.org)
      .eq('driver_id', t.driver)
      .in('status', ['dispatched', 'delivered', 'picked_up']);
    if (error) throw error;
    const { data: driver } = await db
      .from('users')
      .select('name')
      .eq('id', t.driver)
      .eq('org_id', t.org)
      .single();
    const { data: org } = await db
      .from('organizations')
      .select('name,subscription_status')
      .eq('id', t.org)
      .single();
    return NextResponse.json({
      jobs,
      driver,
      organization: {
        name: org?.name ?? 'RollOS',
        subscription_status: org?.subscription_status ?? 'free',
        is_paid_plan: org?.subscription_status === 'paid',
      },
      demo: false,
    });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    assertSameOrigin(request);
    const t = verifyDriverToken((await params).token);
    const { job_id, ...patch } = await request.json();
    return NextResponse.json(
      await changeJob(job_id, patch, process.env.APP_URL || new URL(request.url).origin, t),
    );
  } catch (e) {
    return failure(e);
  }
}
