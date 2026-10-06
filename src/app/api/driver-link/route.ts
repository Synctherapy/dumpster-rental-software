import { NextResponse } from 'next/server';
import { workspace } from '@/lib/server/workspace';
import { driverToken } from '@/lib/server/tokens';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const data = await workspace();
    const { driver_id } = await request.json();
    if (!data.users.some((u) => u.id === driver_id && u.role === 'driver'))
      throw new Error('Driver not found');
    return NextResponse.json({ url: `/driver/${driverToken(data.organization.id, driver_id)}` });
  } catch (e) {
    return failure(e);
  }
}
