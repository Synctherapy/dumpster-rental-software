import { NextResponse } from 'next/server';
import { workspace } from '@/lib/server/workspace';
import { driverToken } from '@/lib/server/tokens';
import { sendSms } from '@/lib/server/notifications';
import { assertSameOrigin, failure } from '@/lib/server/http';
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const data = await workspace();
    const { driver_id } = await request.json();
    const driver = data.users.find((u) => u.id === driver_id && u.role === 'driver');
    if (!driver?.phone) throw new Error('Add a real driver phone number first.');
    const link = `${process.env.APP_URL || request.headers.get('origin') || new URL(request.url).origin}/driver/${driverToken(data.organization.id, driver.id)}`;
    const status = await sendSms(
      data.organization.id,
      null,
      driver.phone,
      'driver_invite',
      `${data.organization.name} dispatched route link: ${link}`,
    );
    return NextResponse.json({ status, demo: data.demo });
  } catch (e) {
    return failure(e);
  }
}
