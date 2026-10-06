import { NextResponse } from 'next/server';
import { book } from '@/lib/server/jobs';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    return NextResponse.json(
      await book(
        await request.json(),
        request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown',
        process.env.APP_URL || new URL(request.url).origin,
      ),
    );
  } catch (e) {
    return failure(e);
  }
}
