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

const BOT_OR_OPT_OUT_KEYWORDS = new Set(['STOP', 'UNSUBSCRIBE', 'CANCEL', 'QUIT', 'HELP']);
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_AUTO_REPLIES_PER_HOUR = 3;

// In-memory rate limiting for inbound SMS auto-replies
const globalForTwilio = globalThis as unknown as {
  rollosTwilioAutoReplyHistory?: Map<string, number[]>;
};
const autoReplyHistory = (globalForTwilio.rollosTwilioAutoReplyHistory ??= new Map<string, number[]>());

function checkAndRecordAutoReplyRateLimit(senderPhone: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const history = (autoReplyHistory.get(senderPhone) || []).filter((ts) => ts > windowStart);

  if (history.length >= MAX_AUTO_REPLIES_PER_HOUR) {
    autoReplyHistory.set(senderPhone, history);
    return false;
  }

  history.push(now);
  autoReplyHistory.set(senderPhone, history);
  return true;
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

      // Check for carrier/bot opt-out keywords (case-insensitive)
      const cleanBody = Body.trim().replace(/[!.,;:?]+$/, '').toUpperCase();
      const isBotOrOptOut = BOT_OR_OPT_OUT_KEYWORDS.has(cleanBody);
      const allowAutoReply = !isBotOrOptOut && checkAndRecordAutoReplyRateLimit(From);

      if (allowAutoReply) {
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

    return new Response('<Response/>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  // 2. Voice action callback from <Dial action="..."> when call finishes or is missed
  const type = url.searchParams.get('type');
  const DialCallStatus = data.DialCallStatus;
  if (type === 'voice_action' || DialCallStatus) {
    const missedStatuses = ['no-answer', 'busy', 'failed', 'canceled'];
    if (DialCallStatus && missedStatuses.includes(DialCallStatus.toLowerCase())) {
      let org: Organization | null = null;
      if (demo) {
        const d = await readDemo();
        org = d.organization.twilio_phone_number === To ? d.organization : d.organization;
      } else if (To) {
        const { data: foundOrg } = await admin()
          .from('organizations')
          .select('*')
          .eq('twilio_phone_number', To)
          .single();
        org = foundOrg;
      }

      if (org && From) {
        const cleanFrom = From.trim().replace(/[!.,;:?]+$/, '').toUpperCase();
        const isBotOrOptOut = BOT_OR_OPT_OUT_KEYWORDS.has(cleanFrom);
        const allowAutoReply = !isBotOrOptOut && checkAndRecordAutoReplyRateLimit(From);

        if (allowAutoReply) {
          const bookingUrl = `${process.env.APP_URL || url.origin}/book/${org.slug}`;
          const text = `Hey! Sorry we missed your call—we are behind the wheel or delivering a container right now. Looking to rent a dumpster? Check live pricing & reserve your delivery date in 60 seconds: ${bookingUrl}`;
          await sendSms(org.id, null, From, 'missed_call_autoreply', text);
        }
      }
    }

    return new Response('<Response/>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  // 3. Inbound voice call from customer dialing the number
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
      const xml = `<Response><Dial timeout="20" action="/api/webhooks/twilio?type=voice_action">${escapeXml(org.phone)}</Dial></Response>`;
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

  // 4. Outbound SMS delivery status callback
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
