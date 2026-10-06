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
    dedupe_key: `${org_id}:${job_id ?? to}:${channel}:${template}${template.includes('reminder') || template === 'driver_invite' ? ':' + new Date().toISOString().slice(0, 10) : ''}`,
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
  if (
    !demo &&
    to &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  ) {
    try {
      const msg = await twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      ).messages.create({
        to,
        from: process.env.TWILIO_FROM_NUMBER,
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
