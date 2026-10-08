import 'server-only';
import { randomUUID } from 'node:crypto';
import { isDemo, readDemo } from './store';
import { admin, identity } from './supabase';
import type { Workspace } from '../types';
export async function workspace(): Promise<Workspace> {
  if (isDemo()) return readDemo();
  const { db, member } = await identity();
  if (member.role === 'driver') throw new Error('FORBIDDEN');
  const tables = [
    'organizations',
    'users',
    'containers',
    'jobs',
    'payments',
    'pricing_rules',
    'notifications_log',
  ];
  const results = await Promise.all(
    tables.map((t) =>
      db
        .from(t)
        .select('*')
        .eq(t === 'organizations' ? 'id' : 'org_id', member.org_id),
    ),
  );
  for (const r of results) if (r.error) throw new Error(r.error.message);
  const organization = results[0].data![0];
  const config = (organization.pricing_config || {}) as Record<string, unknown>;
  if (!organization.calendar_token && !config.calendar_token) {
    const generatedToken = randomUUID().replace(/-/g, '');
    config.calendar_token = generatedToken;
    organization.calendar_token = generatedToken;
    await admin()
      .from('organizations')
      .update({ pricing_config: config })
      .eq('id', organization.id);
  } else if (!organization.calendar_token && config.calendar_token) {
    organization.calendar_token = config.calendar_token;
  }
  return {
    organization,
    users: results[1].data,
    containers: results[2].data,
    jobs: results[3].data,
    payments: results[4].data,
    pricing_rules: results[5].data,
    notifications_log: results[6].data,
    demo: false,
  } as Workspace;
}
export async function publicOrganization(slug: string) {
  if (isDemo()) {
    const d = await readDemo();
    if (d.organization.slug !== slug) throw new Error('Organization not found');
    return { organization: d.organization, pricing_rules: d.pricing_rules, demo: true };
  }
  const db = admin();
  const { data: organization, error } = await db
    .from('organizations')
    .select('id,name,slug,phone,timezone,pricing_config,stripe_connect_account_id')
    .eq('slug', slug)
    .single();
  if (error || !organization) throw new Error('Organization not found');
  const { data: pricing_rules, error: ruleError } = await db
    .from('pricing_rules')
    .select('*')
    .eq('org_id', organization.id);
  if (ruleError) throw ruleError;
  return { organization, pricing_rules: pricing_rules!, demo: false };
}
