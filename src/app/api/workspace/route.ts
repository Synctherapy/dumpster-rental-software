import { NextResponse } from 'next/server';
import { workspace } from '@/lib/server/workspace';
import { failure } from '@/lib/server/http';
import {
  ensureDemoSessionId,
  getDemoSessionId,
  isDemo,
  setDemoViewCookie,
} from '@/lib/server/store';
import { maybeIdentity } from '@/lib/server/supabase';
import { enforceRateLimit } from '@/lib/server/rate-limit';
export async function GET(request: Request) {
  try {
    const modeParam = new URL(request.url).searchParams.get('demo');
    if (modeParam === '1' || modeParam === 'true') {
      await setDemoViewCookie(true);
    } else if (modeParam === '0' || modeParam === 'false') {
      await setDemoViewCookie(false);
    }
    // Give an unsigned or demo-mode visitor their own private sandbox before
    // reading it, so two prospects clicking around at the same time cannot see
    // each other's changes. The cookie is HttpOnly and server-issued.
    if (!(await getDemoSessionId()) && (isDemo() || !(await maybeIdentity()))) {
      await enforceRateLimit(request, 'demoSandbox');
      await ensureDemoSessionId();
    }
    return NextResponse.json(await workspace(), { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return failure(e);
  }
}
