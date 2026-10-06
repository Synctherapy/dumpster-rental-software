import { NextResponse } from 'next/server';
import { changeJob } from '@/lib/server/jobs';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    return NextResponse.json(
      await changeJob(
        (await params).id,
        await request.json(),
        process.env.APP_URL || new URL(request.url).origin,
      ),
    );
  } catch (e) {
    return failure(e);
  }
}
