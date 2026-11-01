import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspace } from '@/lib/server/workspace';
import { contractorToken } from '@/lib/server/tokens';
import { sendSms } from '@/lib/server/notifications';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { normalizePhone } from '@/lib/types';

const schema = z.object({
  account_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { account_name, phone } = schema.parse(await request.json());
    const data = await workspace();
    const token = contractorToken(data.organization.id, account_name);
    const url = `/contractor/${data.organization.slug}?t=${token}`;
    const appUrl = process.env.APP_URL || '';
    const fullUrl = appUrl ? `${appUrl}${url}` : url;

    let smsSent = false;
    if (phone && phone.trim()) {
      const normalized = normalizePhone(phone);
      if (normalized) {
        await sendSms(
          data.organization.id,
          null,
          normalized,
          'contractor_vip_invite',
          `Hey ${account_name}! Here is your private 1-tap jobsite dumpster link for ${data.organization.name}: ${fullUrl} . Tap to schedule container swaps (empty & return) or site drops with Net-30 billing.`,
        ).catch((err) => console.error('[Contractor Link SMS Error]:', err));
        smsSent = true;
      }
    }

    return NextResponse.json({
      url,
      account_name,
      sms_sent: smsSent,
    });
  } catch (e) {
    return failure(e);
  }
}
