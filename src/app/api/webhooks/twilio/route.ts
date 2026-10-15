import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import twilio from 'twilio';
import { isDemo, readDemo, mutateDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
import { sendSms, finishNotification } from '@/lib/server/notifications';
import type { Notification, Organization } from '@/lib/types';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '\'':
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

export async function POST(request: Request) {
  const demo = isDemo();
  if (!demo && (!process.env.TWILIO_AUTH_TOKEN || !process.env.APP_URL))
    return NextResponse.json({ error: 'Not configured' }, { status: 400 });

  const url = new URL(request.url);
  const data = Object.fromEntries(new URLSearchParams(await request.text()));
  const expected = `${process.env.APP_URL || url.origin}/api/webhooks/twilio${url.search}`;

  if (process.env.TWILIO_AUTH_TOKEN && process.env.APP_URL) {
    if (
      !twilio.validateRequest(
        process.env.TWILIO_AUTH_TOKEN,
        request.headers.get('x-twilio-signature') ?? '',
        expected,
        data,
      )
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
  }

  const { MessageStatus, From, To, Body, CallSid } = data;

  // 1. Inbound SMS from customer dialing / texting the number
  if (From && To && Body) {
    let org: Organization | null = null;
    if (demo) {
      const d = await readDemo();
      org = d.organization.twilio_phone_number === To ? d.organization : null;
    } else {
      const { data: foundOrg } = await admin()
        .from('organizations')
        .select('*')
        .eq('twilio_phone_number', To)
        .single();
      org = foundOrg;
    }

    if (org) {
      const inboundLog: Notification = {
        id: randomUUID(),
        org_id: org.id,
        job_id: null,
        channel: 'sms',
        template: 'inbound_reply',
        to: org.phone,
        status: 'received',
        sent_at: new Date().toISOString(),
        dedupe_key: `${org.id}:inbound:${From}:${Date.now()}`,
      };

      if (demo) {
        await mutateDemo((d) => {
          d.notifications_log.unshift(inboundLog);
        });
      } else {
        await admin().from('notifications_log').insert(inboundLog);
      }

      const text = `RollOS Alert: Inbound message from ${From}: "${Body}"`;
      await sendSms(org.id, null, org.phone, 'inbound_forward', text);

      const xml = `<Response><Message>Thank you! We have forwarded your message to ${escapeXml(org.name)}.</Message></Response>`;
      return new Response(xml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    return new Response('<Response/>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  // 2. Inbound voice call from customer dialing the number
  if (CallSid) {
    let org: Organization | null = null;
    if (demo) {
      const d = await readDemo();
      org = d.organization.twilio_phone_number === To ? d.organization : null;
    } else {
      const { data: foundOrg } = await admin()
        .from('organizations')
        .select('*')
        .eq('twilio_phone_number', To)
        .single();
      org = foundOrg;
    }

    if (org && org.phone) {
      const xml = `<Response><Dial timeout="20">${escapeXml(org.phone)}</Dial></Response>`;
      return new Response(xml, {
        status: 200,
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    return new Response('<Response/>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  // 3. Outbound SMS delivery status callback
  const id = url.searchParams.get('log');
  if (
    id &&
    ['queued', 'sending', 'sent', 'delivered', 'undelivered', 'failed'].includes(MessageStatus)
  ) {
    if (demo) {
      await finishNotification(id, MessageStatus);
    } else {
      const { error } = await admin()
        .from('notifications_log')
        .update({ status: MessageStatus })
        .eq('id', id);
      if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
  }

  return new Response(null, { status: 204 });
}
