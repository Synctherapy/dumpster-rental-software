import { NextResponse } from 'next/server';
import { z } from 'zod';
import { publicOrganization } from '@/lib/server/workspace';
import { admin } from '@/lib/server/supabase';
import { isDemo, readDemo } from '@/lib/server/store';
import { contractorToken } from '@/lib/server/tokens';
import { sendSms } from '@/lib/server/notifications';
import { failure, assertSameOrigin } from '@/lib/server/http';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { normalizePhone, type Job } from '@/lib/types';

const lookupSchema = z.object({
  slug: z.string().min(1),
  phone: z.string().min(7).max(30),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit(request, 'contractor');
    const { slug, phone } = lookupSchema.parse(await request.json());
    const normalized = normalizePhone(phone);

    const pub = await publicOrganization(slug);
    const org = pub.organization as { id: string; name: string; phone?: string; slug: string };
    const orgId = org.id;

    if (isDemo() || pub.demo) {
      const d = await readDemo();
      // In demo mode, accept any 10-digit number and link to demo account
      const demoAccount = 'Apex Roofing & Construction';
      const token = contractorToken(d.organization.id, demoAccount);
      return NextResponse.json({
        ok: true,
        account_name: demoAccount,
        url: `/contractor/${slug}?t=${token}`,
      });
    }

    const db = admin();
    // Query jobs for this organization to match commercial customer by phone
    const { data: jobs, error } = await db
      .from('jobs')
      .select('id, customer_name, customer_phone, is_commercial, notes')
      .eq('org_id', orgId);

    if (error) throw new Error(error.message);

    const jobsList = (jobs || []) as Pick<Job, 'id' | 'customer_name' | 'customer_phone' | 'is_commercial' | 'notes'>[];

    // Match phone number (either exact or normalized)
    const matchedJob = jobsList.find((j) => {
      const jp = normalizePhone(j.customer_phone || '');
      return jp === normalized || (j.customer_phone && j.customer_phone.includes(phone.slice(-7)));
    });

    if (!matchedJob) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'No active commercial trade account found for this mobile number. Please call or text us to set up your Net-30 contractor account.',
        },
        { status: 404 },
      );
    }

    // Determine the account name: check notes for [VIP CONTRACTOR: ...] tag or customer_name
    let accountName = matchedJob.customer_name || 'Trade Partner';
    const notesMatch = /\[VIP CONTRACTOR:\s*([^\]]+)\]/i.exec(matchedJob.notes || '');
    if (notesMatch && notesMatch[1]?.trim()) {
      accountName = notesMatch[1].trim();
    }

    const token = contractorToken(orgId, accountName);
    const portalUrl = `/contractor/${slug}?t=${token}`;
    const appUrl = process.env.APP_URL || '';
    const fullPortalUrl = appUrl ? `${appUrl}${portalUrl}` : portalUrl;

    // Send SMS with access link directly to the contractor
    await sendSms(
      orgId,
      matchedJob.id,
      normalized,
      'contractor_portal_link',
      `Hey ${accountName}! Here is your private 1-tap dumpster portal link for ${org.name || 'your hauler'}: ${fullPortalUrl} . Tap to schedule container swaps (empty & return) or site drops with Net-30 billing.`,
    ).catch((err) => console.error('[Contractor Lookup SMS Error]:', err));

    return NextResponse.json({
      ok: true,
      account_name: accountName,
      url: portalUrl,
    });
  } catch (e) {
    return failure(e);
  }
}
