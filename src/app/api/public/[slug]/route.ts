import { NextResponse } from 'next/server';
import { publicOrganization } from '@/lib/server/workspace';
import { failure } from '@/lib/server/http';
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const data = await publicOrganization((await params).slug);
    const org = (data.organization || {}) as Record<string, unknown>;
    const rawConfig = org.pricing_config
      ? { ...(org.pricing_config as Record<string, unknown>) }
      : undefined;
    if (rawConfig) {
      delete rawConfig.calendar_token;
    }
    const {
      calendar_token: _c,
      stripe_connect_account_id: _s,
      twilio_phone_sid: _t,
      ...restOrg
    } = org;
    void _c;
    void _s;
    void _t;
    const cleanOrg = {
      ...restOrg,
      stripe_connected: Boolean(org.stripe_connect_account_id || org.stripe_connected),
      pricing_config: rawConfig,
    };

    return NextResponse.json(
      { ...data, organization: cleanOrg },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (e) {
    return failure(e);
  }
}
