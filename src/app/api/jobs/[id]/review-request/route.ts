import { NextResponse } from 'next/server';
import { isDemo, readDemo } from '@/lib/server/store';
import { admin, identity } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { sendSms } from '@/lib/server/notifications';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const { id } = await params;

    let customerPhone: string;
    let customerName: string;
    let orgId: string;
    let orgName: string;
    let reviewUrl: string;

    if (isDemo()) {
      const demo = await readDemo();
      const job = demo.jobs.find((j) => j.id === id);
      if (!job) throw new Error('Job not found');
      const org = demo.organization;
      reviewUrl = org.google_review_url || org.pricing_config?.google_review_url || '';
      if (!reviewUrl) {
        throw new Error('Please enter your Google Review link in Settings first.');
      }
      customerPhone = job.customer_phone;
      customerName = job.customer_name;
      orgId = org.id;
      orgName = org.name;
    } else {
      const { member } = await identity();
      if (!['owner', 'dispatcher'].includes(member.role)) throw new Error('FORBIDDEN');

      const db = admin();
      const { data: job, error: jobErr } = await db
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('org_id', member.org_id)
        .single();
      if (jobErr || !job) throw new Error('Job not found');

      const { data: org, error: orgErr } = await db
        .from('organizations')
        .select('*')
        .eq('id', member.org_id)
        .single();
      if (orgErr || !org) throw new Error('Organization not found');

      reviewUrl = org.google_review_url || org.pricing_config?.google_review_url || '';
      if (!reviewUrl) {
        throw new Error('Please enter your Google Review link in Settings first.');
      }

      customerPhone = job.customer_phone;
      customerName = job.customer_name;
      orgId = org.id;
      orgName = org.name;
    }

    const text = `Hi ${customerName}, thank you for choosing ${orgName || 'us'}! If you had a great experience, could you leave us a quick Google review? ${reviewUrl}`;
    await sendSms(orgId, id, customerPhone, 'review_request', text);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
