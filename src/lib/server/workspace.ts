import 'server-only';
import { randomUUID } from 'node:crypto';
import { isDemo, readDemo } from './store';
import { admin, identity } from './supabase';
import type { Workspace } from '../types';
export async function workspace(): Promise<Workspace> {
  if (isDemo()) return readDemo();
  try {
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
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg === 'UNAUTHORIZED' || msg.includes('UNAUTHORIZED') || msg.includes('membership')) {
      // Unauthenticated visitors get the interactive live demo sandbox
      return readDemo();
    }
    throw err;
  }
}
export async function publicOrganization(slug: string) {
  if (isDemo()) {
    const d = await readDemo();
    return {
      organization: { ...d.organization, slug },
      pricing_rules: d.pricing_rules,
      demo: true,
    };
  }
  const db = admin();
  const { data: organization, error } = await db
    .from('organizations')
    .select('id,name,slug,phone,timezone,pricing_config,stripe_connect_account_id')
    .eq('slug', slug)
    .single();
  if (error || !organization) {
    try {
      const d = await readDemo();
      return {
        organization: {
          ...d.organization,
          slug,
          name: d.organization.slug === slug ? d.organization.name : (d.organization.name || 'Demo Hauler'),
        },
        pricing_rules: d.pricing_rules,
        demo: true,
      };
    } catch {
      throw new Error('Organization not found');
    }
  }
  const { data: pricing_rules, error: ruleError } = await db
    .from('pricing_rules')
    .select('*')
    .eq('org_id', organization.id);
  if (ruleError) throw ruleError;
  return { organization, pricing_rules: pricing_rules!, demo: false };
}
