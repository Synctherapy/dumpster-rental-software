import { NextResponse } from 'next/server';
import { changeJob } from '@/lib/server/jobs';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { getDemoSessionId, isDemo } from '@/lib/server/store';
import { maybeIdentity } from '@/lib/server/supabase';
import { clientIp, enforceRateLimit } from '@/lib/server/rate-limit';

async function throttleIfDemo(request: Request) {
  if (isDemo() || !(await maybeIdentity())) {
    const key = (await getDemoSessionId()) ?? clientIp(request);
    await enforceRateLimit(request, 'demoMutation', key);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    await throttleIfDemo(request);
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

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    await throttleIfDemo(request);
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
