import 'server-only';
import twilio from 'twilio';
import { randomUUID } from 'node:crypto';
import { isDemo, readDemo, mutateDemo } from './store';
import { admin } from './supabase';

const TOLL_FREE_PREFIXES = new Set(['800', '888', '877', '866', '855', '844', '833']);

// Map common ZIP prefixes to representative local area codes
const ZIP_PREFIX_TO_AREA_CODE: Record<string, string> = {
  // Texas
  '787': '512',
  '786': '512',
  '750': '214',
  '751': '214',
  '752': '214',
  '753': '214',
  '754': '214',
  '760': '817',
  '761': '817',
  '762': '817',
  '770': '713',
  '771': '713',
  '772': '713',
  '773': '713',
  '774': '713',
  '775': '713',
  '780': '210',
  '781': '210',
  '782': '210',
  '799': '915',
  // New York
  '100': '212',
  '101': '212',
  '102': '212',
  '103': '212',
  '104': '212',
  '112': '718',
  '113': '718',
  // California
  '900': '310',
  '901': '310',
  '902': '310',
  '940': '415',
  '941': '415',
  '921': '619',
  '958': '916',
  // Washington / Pacific NW
  '980': '206',
  '981': '206',
  '972': '503',
  // Illinois
  '606': '312',
  '607': '312',
  '608': '312',
  // Florida
  '331': '305',
  '332': '305',
  '328': '407',
  '336': '813',
  // Georgia
  '303': '404',
  '304': '404',
  // Massachusetts
  '021': '617',
  '022': '617',
  // Colorado
  '800': '303',
  '801': '303',
  '802': '303',
  // Arizona
  '850': '602',
  '852': '602',
  // Nevada
  '891': '702',
  // Tennessee
  '372': '615',
  // North Carolina
  '282': '704',
  // Pennsylvania
  '191': '215',
  // DC / Maryland / Virginia
  '200': '202',
  // Michigan
  '482': '313',
  // Minnesota
  '554': '612',
  // 2-digit fallbacks
  '78': '512',
  '75': '214',
  '77': '713',
  '10': '212',
  '11': '718',
  '90': '310',
  '94': '415',
  '98': '206',
  '60': '312',
  '30': '404',
  '33': '305',
  '02': '617',
  '80': '303',
  '85': '602',
  '89': '702',
};

export function extractAreaCode(phone?: string, zip?: string): string {
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    let candidate = '';
    if (digits.length === 11 && digits.startsWith('1')) {
      candidate = digits.slice(1, 4);
    } else if (digits.length === 10) {
      candidate = digits.slice(0, 3);
    }
    if (candidate.length === 3 && !TOLL_FREE_PREFIXES.has(candidate)) {
      return candidate;
    }
  }

  if (zip) {
    const cleanZip = zip.trim().replace(/\D/g, '');
    if (cleanZip.length >= 3) {
      const p3 = cleanZip.slice(0, 3);
      if (ZIP_PREFIX_TO_AREA_CODE[p3]) return ZIP_PREFIX_TO_AREA_CODE[p3];
    }
    if (cleanZip.length >= 2) {
      const p2 = cleanZip.slice(0, 2);
      if (ZIP_PREFIX_TO_AREA_CODE[p2]) return ZIP_PREFIX_TO_AREA_CODE[p2];
    }
  }

  return '512';
}

export async function ensureOrganizationPhone(orgId: string): Promise<string | null> {
  if (isDemo()) {
    const current = await readDemo();
    if (current.organization.twilio_phone_number) {
      return current.organization.twilio_phone_number;
    }
    const areaCode = extractAreaCode(
      current.organization.phone,
      current.pricing_rules?.[0]?.service_zips?.[0],
    );
    const simulatedLocal = `+1${areaCode}8429102`;
    const sid = `PN_demo_${randomUUID().replace(/-/g, '').slice(0, 32)}`;
    await mutateDemo((d) => {
      d.organization.twilio_phone_number = simulatedLocal;
      d.organization.twilio_phone_sid = sid;
    });
    return simulatedLocal;
  }

  const { data: org, error } = await admin()
    .from('organizations')
    .select('id, phone, twilio_phone_number, twilio_phone_sid')
    .eq('id', orgId)
    .single();

  if (error || !org) {
    return null;
  }

  if (org.twilio_phone_number) {
    return org.twilio_phone_number;
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    return null;
  }

  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const areaCode = parseInt(extractAreaCode(org.phone), 10);

    let numbers = await client.availablePhoneNumbers('US').local.list({
      areaCode,
      limit: 1,
    });

    if (!numbers || numbers.length === 0) {
      numbers = await client.availablePhoneNumbers('US').local.list({
        limit: 1,
      });
    }

    if (!numbers || numbers.length === 0) {
      return null;
    }

    const phoneNumber = numbers[0].phoneNumber;
    const appUrl = (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');

    const incoming = await client.incomingPhoneNumbers.create({
      phoneNumber,
      smsUrl: `${appUrl}/api/webhooks/twilio`,
      voiceUrl: `${appUrl}/api/webhooks/twilio`,
    });

    await admin()
      .from('organizations')
      .update({
        twilio_phone_number: incoming.phoneNumber,
        twilio_phone_sid: incoming.sid,
      })
      .eq('id', orgId);

    return incoming.phoneNumber;
  } catch (err) {
    console.error('Failed to provision Twilio phone number:', err);
    return null;
  }
}

export async function releaseOrganizationPhone(orgId: string): Promise<boolean> {
  if (isDemo()) {
    await mutateDemo((d) => {
      d.organization.twilio_phone_number = null;
      d.organization.twilio_phone_sid = null;
    });
    return true;
  }

  const { data: org, error } = await admin()
    .from('organizations')
    .select('id, twilio_phone_sid')
    .eq('id', orgId)
    .single();

  if (error || !org) {
    return false;
  }

  if (org.twilio_phone_sid && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.incomingPhoneNumbers(org.twilio_phone_sid).remove();
    } catch (err) {
      console.warn('Failed to remove incoming phone number from Twilio:', err);
    }
  }

  const { error: updateError } = await admin()
    .from('organizations')
    .update({
      twilio_phone_number: null,
      twilio_phone_sid: null,
    })
    .eq('id', orgId);

  if (updateError) {
    console.error('Failed to clear twilio columns in database:', updateError);
    return false;
  }

  return true;
}
