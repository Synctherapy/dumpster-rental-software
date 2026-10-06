import { NextResponse } from 'next/server';
import { publicOrganization } from '@/lib/server/workspace';
import { failure } from '@/lib/server/http';
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const data = await publicOrganization((await params).slug);
    return NextResponse.json(
      { ...data, organization: { ...data.organization, stripe_connect_account_id: undefined } },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (e) {
    return failure(e);
  }
}
