import { NextResponse } from 'next/server';
import { workspace } from '@/lib/server/workspace';
import { driverToken, driverLinkTtlForPickup, latestActivePickup } from '@/lib/server/tokens';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const data = await workspace();
    const { driver_id } = await request.json();
    if (!data.users.some((u) => u.id === driver_id && u.role === 'driver'))
      throw new Error('Driver not found');
    // Issued outside any one job, so cover the driver's latest scheduled pickup.
    const ttl = driverLinkTtlForPickup(latestActivePickup(data.jobs, driver_id));
    return NextResponse.json({
      url: `/driver/${driverToken(data.organization.id, driver_id, ttl)}`,
    });
  } catch (e) {
    return failure(e);
  }
}
