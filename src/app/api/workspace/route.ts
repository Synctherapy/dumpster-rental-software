import { NextResponse } from 'next/server';
import { workspace } from '@/lib/server/workspace';
import { failure } from '@/lib/server/http';
import { ensureDemoSessionId, getDemoSessionId, isDemo } from '@/lib/server/store';
import { enforceRateLimit } from '@/lib/server/rate-limit';
export async function GET(request: Request) {
  try {
    // Give an unsigned visitor their own private sandbox before reading it, so
    // two prospects clicking around at the same time cannot see each other's
    // changes. The cookie is HttpOnly and server-issued.
    if (isDemo() && !(await getDemoSessionId())) {
      await enforceRateLimit(request, 'demoSandbox');
      await ensureDemoSessionId();
    }
    return NextResponse.json(await workspace(), { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return failure(e);
  }
}
