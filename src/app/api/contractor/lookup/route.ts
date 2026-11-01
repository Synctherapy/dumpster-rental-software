import { NextResponse } from 'next/server';
import { z } from 'zod';
import { publicOrganization } from '@/lib/server/workspace';
import { admin } from '@/lib/server/supabase';
import { isDemo, readDemo } from '@/lib/server/store';
import {
  contractorToken,
  createContractorChallenge,
  verifyContractorChallenge,
} from '@/lib/server/tokens';
import { sendSms } from '@/lib/server/notifications';
import { failure, assertSameOrigin } from '@/lib/server/http';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { normalizePhone, phoneMatch, maskPhone, type Job } from '@/lib/types';

const lookupSchema = z.object({
  action: z.enum(['request_code', 'verify_code']).optional().default('request_code'),
  slug: z.string().min(1),
  phone: z.string().min(7).max(30).optional(),
  challenge: z.string().optional(),
  code: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await enforceRateLimit(request, 'contractor');
    const body = lookupSchema.parse(await request.json());
    const { action, slug } = body;

    const pub = await publicOrganization(slug);
    const org = pub.organization as { id: string; name: string; phone?: string; slug: string };
    const orgId = org.id;

    // STEP 2: Verify Code
    if (action === 'verify_code') {
      if (!body.challenge || !body.code) {
        return NextResponse.json(
          { ok: false, error: 'Verification code and challenge token are required.' },
          { status: 400 },
        );
      }

      const verified = verifyContractorChallenge(body.challenge, body.code);
      if (verified.org !== orgId) {
        return NextResponse.json(
          { ok: false, error: 'Invalid verification session for this organization.' },
          { status: 403 },
        );
      }

      const token = contractorToken(orgId, verified.account);
      return NextResponse.json({
        ok: true,
        account_name: verified.account,
        url: `/contractor/${slug}?t=${token}`,
      });
    }

    // STEP 1: Request Code
    if (!body.phone) {
      return NextResponse.json(
        { ok: false, error: 'Mobile phone number is required.' },
        { status: 400 },
      );
    }

    const rawPhone = body.phone.trim();
    const normalized = normalizePhone(rawPhone);

    // Demo Mode Handling
    if (isDemo() || pub.demo) {
      const d = await readDemo();
      const demoAccount =
        d.jobs.find((j) => j.is_commercial)?.customer_name || 'Commercial Partner';
      const code = '123456';
      const challenge = createContractorChallenge(d.organization.id, demoAccount, normalized, code);
      return NextResponse.json({
        ok: true,
        requires_code: true,
        challenge,
        masked_phone: maskPhone(rawPhone),
        demo_code: code,
        message: `[Demo Mode] Enter code ${code} or tap verify to test contractor portal access.`,
      });
    }

    const db = admin();
    // Query jobs for this organization to match commercial customer by phone
    const { data: jobs, error } = await db
      .from('jobs')
      .select('id, customer_name, customer_phone, is_commercial, notes')
      .eq('org_id', orgId);

    if (error) throw new Error(error.message);

    const jobsList = (jobs || []) as Pick<
      Job,
      'id' | 'customer_name' | 'customer_phone' | 'is_commercial' | 'notes'
    >[];

    // Forgiving, robust phone match against jobs or organization phone (for owner testing)
    const isOwnerTestPhone = org.phone && phoneMatch(org.phone, rawPhone);
    const matchedJob = jobsList.find((j) => phoneMatch(j.customer_phone, rawPhone));

    if (!matchedJob && !isOwnerTestPhone) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'No active commercial trade account found for this mobile number. Please call or text us to set up your Net-30 contractor account.',
        },
        { status: 404 },
      );
    }

    // Determine account name
    let accountName = 'Trade Partner';
    let matchedJobId: string | null = null;

    if (matchedJob) {
      accountName = matchedJob.customer_name || 'Trade Partner';
      const notesMatch = /\[VIP CONTRACTOR:\s*([^\]]+)\]/i.exec(matchedJob.notes || '');
      if (notesMatch && notesMatch[1]?.trim()) {
        accountName = notesMatch[1].trim();
      }
      matchedJobId = matchedJob.id;
    } else if (isOwnerTestPhone) {
      accountName = 'Commercial Partner (Owner Test)';
    }

    // Generate random 6-digit verification code and challenge token (expires in 10 minutes)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const challenge = createContractorChallenge(orgId, accountName, normalized, code);

    // Also mint a 1-tap direct magic link to include in the SMS
    const token = contractorToken(orgId, accountName);
    const portalUrl = `/contractor/${slug}?t=${token}`;
    const appUrl = process.env.APP_URL || '';
    const fullPortalUrl = appUrl ? `${appUrl}${portalUrl}` : portalUrl;

    // Send SMS with access code AND 1-tap link directly to the contractor's physical mobile phone
    await sendSms(
      orgId,
      matchedJobId,
      normalized,
      'contractor_auth_code',
      `Your ${org.name || 'RollOS'} contractor access code is: ${code} (expires in 10m).\n\nOr tap to open your jobsite portal directly: ${fullPortalUrl}`,
    ).catch((err) => console.error('[Contractor SMS Auth Error]:', err));

    // Return masked phone and challenge token. DO NOT return portal URL to prevent competitor access.
    return NextResponse.json({
      ok: true,
      requires_code: true,
      challenge,
      masked_phone: maskPhone(rawPhone),
      message: `We just texted a 6-digit access code and 1-tap link to ${maskPhone(rawPhone)}.`,
    });
  } catch (e) {
    return failure(e);
  }
}
