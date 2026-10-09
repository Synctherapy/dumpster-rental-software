import { NextResponse } from 'next/server';
import { swapContainer } from '@/lib/server/jobs';
import { assertSameOrigin, failure } from '@/lib/server/http';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const body = await request.json().catch(() => ({}));
    return NextResponse.json(
      await swapContainer(
        (await params).id,
        body,
        process.env.APP_URL || new URL(request.url).origin,
      ),
    );
  } catch (e) {
    return failure(e);
  }
}
