import { NextResponse } from 'next/server';
import { chargeInvoice } from '@/lib/server/jobs';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    return NextResponse.json(await chargeInvoice((await params).id));
  } catch (e) {
    return failure(e);
  }
}
