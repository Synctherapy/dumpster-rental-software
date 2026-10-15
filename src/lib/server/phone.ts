import 'server-only';
import { randomUUID } from 'node:crypto';
import twilio from 'twilio';
import { isDemo, mutateDemo, readDemo } from './store';
import { admin } from './supabase';

export async function ensureOrganizationPhone(orgId: string): Promise<string | null> {
  if (isDemo()) {
    const d = await readDemo();
    if (d.organization.twilio_phone_number) {
      return d.organization.twilio_phone_number;
    }
    const demoNumber = '+1512555' + Math.floor(1000 + Math.random() * 9000).toString();
    const demoSid = 'demo_sid_' + randomUUID();
    await mutateDemo((state) => {
      if (state.organization.id === orgId || !state.organization.twilio_phone_number) {
        state.organization.twilio_phone_number = demoNumber;
        state.organization.twilio_phone_sid = demoSid;
        if (!state.organization.last_booking_at) {
          state.organization.last_booking_at = new Date().toISOString();
        }
      }
    });
    return demoNumber;
  }

  const db = admin();
  const { data: org, error } = await db
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (error || !org) return null;
  if (org.twilio_phone_number) return org.twilio_phone_number;

  let phoneNumber: string | null = null;
  let phoneSid: string | null = null;

  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.APP_URL
  ) {
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const digits = (org.phone || '').replace(/\D/g, '');
      const areaCode = digits.length >= 10 ? parseInt(digits.slice(-10, -7), 10) : undefined;

      let available = null;
      if (areaCode && !isNaN(areaCode)) {
        try {
          const list = await client.availablePhoneNumbers('US').local.list({
            areaCode,
            limit: 1,
          });
          if (list && list.length > 0) available = list;
        } catch {}
      }
      if (!available || available.length === 0) {
        available = await client.availablePhoneNumbers('US').local.list({ limit: 1 });
      }

      if (available && available.length > 0) {
        const webhookUrl = `${process.env.APP_URL}/api/webhooks/twilio`;
        const incoming = await client.incomingPhoneNumbers.create({
          phoneNumber: available[0].phoneNumber,
          smsUrl: webhookUrl,
          smsMethod: 'POST',
          voiceUrl: webhookUrl,
          voiceMethod: 'POST',
          friendlyName: `RollOS - ${org.name || 'Hauler'}`,
        });
        phoneNumber = incoming.phoneNumber;
        phoneSid = incoming.sid;
      }
    } catch (err) {
      console.error('Failed to purchase Twilio phone number:', err);
    }
  }

  if (!phoneNumber) {
    phoneNumber = '+1512555' + Math.floor(1000 + Math.random() * 9000).toString();
    phoneSid = 'mock_sid_' + randomUUID();
  }

  await db
    .from('organizations')
    .update({
      twilio_phone_number: phoneNumber,
      twilio_phone_sid: phoneSid,
      ...(org.last_booking_at ? {} : { last_booking_at: new Date().toISOString() }),
    })
    .eq('id', orgId);

  return phoneNumber;
}

export async function releaseOrganizationPhone(orgId: string): Promise<boolean> {
  if (isDemo()) {
    await mutateDemo((d) => {
      if (d.organization.id === orgId) {
        d.organization.twilio_phone_number = null;
        d.organization.twilio_phone_sid = null;
        d.organization.number_warning_sent_at = null;
      }
    });
    return true;
  }

  const db = admin();
  const { data: org } = await db
    .from('organizations')
    .select('twilio_phone_sid')
    .eq('id', orgId)
    .single();

  if (
    org?.twilio_phone_sid &&
    !org.twilio_phone_sid.startsWith('mock_') &&
    !org.twilio_phone_sid.startsWith('demo_') &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  ) {
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.incomingPhoneNumbers(org.twilio_phone_sid).remove();
    } catch (err) {
      console.error('Failed to remove Twilio number:', err);
    }
  }

  await db
    .from('organizations')
    .update({
      twilio_phone_number: null,
      twilio_phone_sid: null,
      number_warning_sent_at: null,
    })
    .eq('id', orgId);

  return true;
}

export async function checkAndTriggerPhoneProvisioning(orgId: string): Promise<string | null> {
  if (isDemo()) {
    const d = await readDemo();
    if (d.organization.id !== orgId) return null;
    if (d.organization.twilio_phone_number) return d.organization.twilio_phone_number;

    const hasStripe = Boolean(d.organization.stripe_connect_account_id);
    const hasContainer = d.containers.some((c) => c.org_id === orgId);
    const hasPhone = Boolean(d.organization.phone && d.organization.phone.trim().length >= 7);

    if (hasStripe && hasContainer && hasPhone) {
      return await ensureOrganizationPhone(orgId);
    }
    return null;
  }

  const db = admin();
  const { data: org } = await db
    .from('organizations')
    .select('id, twilio_phone_number, stripe_connect_account_id, phone')
    .eq('id', orgId)
    .single();

  if (!org || org.twilio_phone_number) return org?.twilio_phone_number ?? null;

  const hasStripe = Boolean(org.stripe_connect_account_id);
  const hasPhone = Boolean(org.phone && org.phone.trim().length >= 7);

  const { count } = await db
    .from('containers')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', orgId);

  const hasContainer = (count ?? 0) > 0;

  if (hasStripe && hasContainer && hasPhone) {
    return await ensureOrganizationPhone(orgId);
  }
  return null;
}
