import { NextResponse } from 'next/server';
import {
  DEMO_ORG_ID,
  ensureDemoSessionId,
  getDemoSessionId,
  readDemo,
  setDemoViewCookie,
} from '@/lib/server/store';
import { driverLinkTtlForPickup, driverToken, latestActivePickup } from '@/lib/server/tokens';
import { enforceRateLimit } from '@/lib/server/rate-limit';

export async function GET(request: Request) {
  try {
    let sessionId = await getDemoSessionId();
    if (!sessionId) {
      await enforceRateLimit(request, 'demoSandbox');
      sessionId = await ensureDemoSessionId();
    }
    await setDemoViewCookie(true);

    const demoData = await readDemo(sessionId ?? undefined);
    const activeDriver =
      demoData.users.find(
        (u) =>
          u.role === 'driver' &&
          demoData.jobs.some(
            (j) => j.driver_id === u.id && ['dispatched', 'delivered', 'picked_up'].includes(j.status),
          ),
      ) ||
      demoData.users.find((u) => u.role === 'driver') || { id: 'driver-1' };

    const ttl = driverLinkTtlForPickup(latestActivePickup(demoData.jobs, activeDriver.id));
    const token = driverToken(
      demoData.organization.id || DEMO_ORG_ID,
      activeDriver.id,
      ttl,
      sessionId,
    );

    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/driver/${token}`);
  } catch {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/dashboard?demo=1`);
  }
}
