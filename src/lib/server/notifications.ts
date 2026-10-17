import 'server-only';
import twilio from 'twilio';
import { randomUUID } from 'node:crypto';
import { isDemo, mutateDemo } from './store';
import { admin } from './supabase';
import type { Notification } from '../types';
export async function claimNotification(
  org_id: string,
  job_id: string | null,
  to: string,
  template: string,
  channel: 'sms' | 'email',
) {
  const log: Notification = {
    id: randomUUID(),
    org_id,
    job_id,
    channel,
    template,
    to,
    status: 'processing',
    sent_at: new Date().toISOString(),
    dedupe_key: `${org_id}:${job_id ?? to}:${channel}:${template}${
      template.includes('reminder') || template === 'driver_invite'
        ? ':' + new Date().toISOString().slice(0, 10)
        : template.includes('inbound') || template.includes('missed_call') || template.includes('autoreply')
          ? ':' + randomUUID()
          : ''
    }`,
  };
  if (isDemo())
    return mutateDemo((d) => {
      if (d.notifications_log.some((n) => n.dedupe_key === log.dedupe_key)) return null;
      d.notifications_log.unshift(log);
      return log;
    });
  const { data, error } = await admin()
    .from('notifications_log')
    .upsert(log, { onConflict: 'dedupe_key', ignoreDuplicates: true })
    .select('*');
  if (error) throw new Error(error.message);
  return data?.[0] as Notification | null;
}
export async function finishNotification(id: string, status: string) {
  if (isDemo())
    await mutateDemo((d) => {
      const log = d.notifications_log.find((n) => n.id === id);
      if (log) log.status = status;
    });
  else {
    const { error } = await admin().from('notifications_log').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
  }
}
export async function sendSms(
  org_id: string,
  job_id: string | null,
  to: string,
  template: string,
  body: string,
) {
  const log = await claimNotification(org_id, job_id, to, template, 'sms');
  if (!log) return 'already_logged';
  const demo = isDemo();
  let status = demo ? 'demo' : 'not_configured';
  let fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!demo && org_id) {
    try {
      const { data: org } = await admin()
        .from('organizations')
        .select('twilio_phone_number')
        .eq('id', org_id)
        .single();
      if (org?.twilio_phone_number) {
        fromNumber = org.twilio_phone_number;
      }
    } catch {}
  }
  if (
    !demo &&
    to &&
    fromNumber &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  ) {
    try {
      const msg = await twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      ).messages.create({
        to,
        from: fromNumber,
        body,
        ...(process.env.APP_URL
          ? { statusCallback: `${process.env.APP_URL}/api/webhooks/twilio?log=${log.id}` }
          : {}),
      });
      status = msg.status;
    } catch {
      status = 'failed';
    }
  }
  await finishNotification(log.id, status);
  return status;
}

export async function notifyAdminSignup(details: {
  name?: string;
  company?: string;
  city?: string;
  email?: string;
  plan?: string;
}) {
  const ntfyTopic = process.env.NTFY_TOPIC;
  const adminPhone = process.env.ADMIN_ALERT_PHONE;
  if (!ntfyTopic && !adminPhone) return;

  const name = details.name?.trim() || 'New hauler';
  const company = details.company?.trim() || 'Unspecified Company';
  const location = details.city?.trim() ? ` (${details.city.trim()})` : '';
  const email = details.email ? `\nEmail: ${details.email}` : '';
  const plan = details.plan ? `\nPlan: ${details.plan.toUpperCase()}` : '';

  const body = `🎉 New RollOS Signup!\n${name} from ${company}${location}${plan}${email}`;

  // 1. Free instant push notification via ntfy.sh
  if (ntfyTopic) {
    try {
      await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: 'POST',
        headers: {
          Title: 'New RollOS Signup!',
          Priority: 'high',
          Tags: 'tada,truck,moneybag',
          ...(process.env.APP_URL ? { Click: `${process.env.APP_URL}/dashboard` } : {}),
        },
        body: `${name} from ${company}${location}${plan}${email}`,
      });
    } catch (err) {
      console.error('[Admin Alert] Failed to send ntfy push notification:', err);
    }
  }

  // 2. Optional SMS via Twilio if configured
  if (
    adminPhone &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  ) {
    try {
      await twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      ).messages.create({
        to: adminPhone,
        from: process.env.TWILIO_FROM_NUMBER,
        body,
      });
    } catch (err) {
      console.error('[Admin Alert] Failed to send signup SMS to admin:', err);
    }
  } else if (adminPhone && !ntfyTopic) {
    console.log(`[Admin Signup Alert to ${adminPhone}]: ${body}`);
  }
}
