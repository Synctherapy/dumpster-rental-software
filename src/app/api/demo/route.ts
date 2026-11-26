import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  ensureDemoSessionId,
  getDemoSessionId,
  resetDemoSession,
  setDemoViewCookie,
} from '@/lib/server/store';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { clientIp, enforceRateLimit } from '@/lib/server/rate-limit';

const demoActionSchema = z.object({
  action: z.enum(['enter', 'exit', 'reset']),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { action } = demoActionSchema.parse(await request.json());

    if (action === 'exit') {
      await setDemoViewCookie(false);
      return NextResponse.json({ ok: true, demo: false });
    }

    let sessionId = await getDemoSessionId();
    if (!sessionId) {
      await enforceRateLimit(request, 'demoSandbox');
      sessionId = await ensureDemoSessionId();
    }

    await enforceRateLimit(request, 'demoMutation', sessionId ?? clientIp(request));
    await setDemoViewCookie(true);

    if (action === 'reset') {
      await resetDemoSession(sessionId ?? undefined);
    }

    return NextResponse.json({ ok: true, demo: true });
  } catch (e) {
    return failure(e);
  }
}
