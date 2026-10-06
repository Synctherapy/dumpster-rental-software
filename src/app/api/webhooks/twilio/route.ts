import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { admin } from '@/lib/server/supabase';
export async function POST(request: Request) {
  if (!process.env.TWILIO_AUTH_TOKEN || !process.env.APP_URL)
    return NextResponse.json({ error: 'Not configured' }, { status: 400 });
  const url = new URL(request.url);
  const data = Object.fromEntries(new URLSearchParams(await request.text()));
  const expected = `${process.env.APP_URL}/api/webhooks/twilio${url.search}`;
  if (
    !twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      request.headers.get('x-twilio-signature') ?? '',
      expected,
      data,
    )
  )
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  const id = url.searchParams.get('log');
  if (
    id &&
    ['queued', 'sending', 'sent', 'delivered', 'undelivered', 'failed'].includes(data.MessageStatus)
  ) {
    const { error } = await admin()
      .from('notifications_log')
      .update({ status: data.MessageStatus })
      .eq('id', id);
    if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
  return new Response(null, { status: 204 });
}
