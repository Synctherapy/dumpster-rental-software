import { NextResponse } from 'next/server';
import { workspace } from '@/lib/server/workspace';
import { driverToken, driverLinkTtlForPickup, latestActivePickup } from '@/lib/server/tokens';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { getDemoSessionId, isDemo, mutateDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const data = await workspace();
    const { driver_id, revoke } = await request.json();
    if (!data.users.some((u) => u.id === driver_id && u.role === 'driver'))
      throw new Error('Driver not found');

    // Cancelling draws a line at this moment: every link already issued to this
    // driver stops working, and the next one they are sent works again.
    if (revoke === true) {
      const revokedAt = new Date().toISOString();
      if (isDemo()) {
        await mutateDemo((d) => {
          const driver = d.users.find((u) => u.id === driver_id);
          if (driver) driver.links_revoked_at = revokedAt;
        });
      } else {
        const { error } = await admin()
          .from('users')
          .update({ links_revoked_at: revokedAt })
          .eq('id', driver_id)
          .eq('org_id', data.organization.id);
        if (error) throw new Error(error.message);
      }
      return NextResponse.json({ revoked: true, revoked_at: revokedAt });
    }
    // Issued outside any one job, so cover the driver's latest scheduled pickup.
    const ttl = driverLinkTtlForPickup(latestActivePickup(data.jobs, driver_id));
    const sandbox = isDemo() ? await getDemoSessionId() : null;
    return NextResponse.json({
      url: `/driver/${driverToken(data.organization.id, driver_id, ttl, sandbox)}`,
    });
  } catch (e) {
    return failure(e);
  }
}
