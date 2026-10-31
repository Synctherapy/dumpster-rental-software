import 'server-only';
import { isDemo, mutateDemo, readDemo } from './store';
import { admin } from './supabase';

/** Carrier-recognised opt-out words. HELP is deliberately not one of these. */
export const OPT_OUT_KEYWORDS = new Set([
  'STOP',
  'STOPALL',
  'UNSUBSCRIBE',
  'CANCEL',
  'END',
  'QUIT',
]);

/** Words that put a number back on the list. */
export const OPT_IN_KEYWORDS = new Set(['START', 'YES', 'UNSTOP']);

/** Words we answer by staying quiet rather than auto-replying. */
export const NO_AUTO_REPLY_KEYWORDS = new Set([...OPT_OUT_KEYWORDS, 'HELP', 'INFO']);

export function messageKeyword(body: string) {
  return body
    .trim()
    .replace(/[!.,;:?]+$/, '')
    .toUpperCase();
}

export async function recordOptOut(org_id: string, phone: string, source = 'sms_keyword') {
  if (!phone) return;
  const entry = { phone, opted_out_at: new Date().toISOString(), source };
  if (isDemo()) {
    await mutateDemo((d) => {
      d.sms_opt_outs = (d.sms_opt_outs ?? []).filter((o) => o.phone !== phone);
      d.sms_opt_outs.push(entry);
    });
    return;
  }
  const { error } = await admin()
    .from('sms_opt_outs')
    .upsert({ org_id, ...entry }, { onConflict: 'org_id,phone' });
  if (error) console.error('[opt-out] failed to record opt-out:', error.message);
}

export async function clearOptOut(org_id: string, phone: string) {
  if (!phone) return;
  if (isDemo()) {
    await mutateDemo((d) => {
      d.sms_opt_outs = (d.sms_opt_outs ?? []).filter((o) => o.phone !== phone);
    });
    return;
  }
  const { error } = await admin()
    .from('sms_opt_outs')
    .delete()
    .eq('org_id', org_id)
    .eq('phone', phone);
  if (error) console.error('[opt-out] failed to clear opt-out:', error.message);
}

/**
 * Whether this number has opted out of marketing from this organization.
 * Fails closed: if the lookup errors we treat the number as opted out, because
 * sending a promotional text to someone who said STOP is the expensive mistake.
 */
export async function isOptedOut(org_id: string, phone: string): Promise<boolean> {
  if (!phone) return true;
  if (isDemo()) {
    const d = await readDemo();
    return (d.sms_opt_outs ?? []).some((o) => o.phone === phone);
  }
  const { data, error } = await admin()
    .from('sms_opt_outs')
    .select('phone')
    .eq('org_id', org_id)
    .eq('phone', phone)
    .maybeSingle();
  if (error) {
    console.error('[opt-out] lookup failed, suppressing marketing message:', error.message);
    return true;
  }
  return Boolean(data);
}
