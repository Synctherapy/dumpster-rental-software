import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isDemo, mutateDemo } from '@/lib/server/store';
import { identity, admin } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { isValidPostalCode, normalizePostalCode } from '@/lib/types';
const rule = z.object({
  size_yards: z.number().int().min(1).max(100),
  base_price_cents: z.number().int().min(100).max(10000000),
  included_days: z.number().int().min(1).max(90),
  extra_day_cents: z.number().int().min(0).max(100000),
  included_tons: z.number().min(0).max(50),
  overage_per_ton_cents: z.number().int().min(0).max(100000),
  service_zips: z
    .array(
      z.string().refine(isValidPostalCode, {
        message: 'Must be a valid 5-digit US ZIP code or 6-character Canadian postal code.',
      }),
    )
    .min(1)
    .max(500),
});
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = z
      .object({
        name: z.string().trim().min(2).max(80),
        phone: z.string().max(20),
        slug: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
          .max(60),
        currency: z.enum(['usd', 'cad']).default('usd').optional(),
        deposit_percent: z.number().int().min(1).max(100),
        customer_fee_enabled: z.boolean().default(true).optional(),
        google_review_url: z.string().trim().max(500).default('').optional(),
        min_notice_hours: z.number().int().min(0).max(168).default(24).optional(),
        prohibited_items: z.array(z.string().trim().min(1).max(100)).max(30).optional(),
        operating_days: z.array(z.number().int().min(0).max(6)).max(7).optional(),
        tax_rate_percent: z.number().min(0).max(30).default(0).optional(),
        pricing_rules: z.array(rule).min(1).max(12),
      })
      .strict()
      .parse(await request.json());
    if (new Set(input.pricing_rules.map((r) => r.size_yards)).size !== input.pricing_rules.length)
      throw new Error('Each size needs exactly one pricing rule.');

    // Auto-normalize all postal codes (uppercase, standard spacing)
    const normalizedRules = input.pricing_rules.map((r) => ({
      ...r,
      service_zips: r.service_zips.map(normalizePostalCode),
    }));

    if (isDemo()) {
      await mutateDemo((d) => {
        const isPaidPlan = d.organization.subscription_status === 'active';
        if (input.customer_fee_enabled === false && !isPaidPlan) {
          throw new Error('Disabling the $11.95 reservation fee requires an active Starter ($29/mo) or Growth ($149/mo) plan.');
        }
        const feeEnabled = input.customer_fee_enabled ?? true;
        Object.assign(d.organization, {
          name: input.name,
          phone: input.phone,
          slug: input.slug,
          currency: input.currency ?? d.organization.currency ?? 'usd',
          google_review_url: input.google_review_url || '',
          min_notice_hours: input.min_notice_hours ?? 24,
          prohibited_items: input.prohibited_items,
          operating_days: input.operating_days,
          tax_rate_percent: input.tax_rate_percent ?? 0,
          pricing_config: {
            deposit_percent: input.deposit_percent,
            currency: input.currency ?? d.organization.currency ?? 'usd',
            customer_fee_enabled: feeEnabled,
            google_review_url: input.google_review_url || '',
            min_notice_hours: input.min_notice_hours ?? 24,
            prohibited_items: input.prohibited_items,
            operating_days: input.operating_days,
            tax_rate_percent: input.tax_rate_percent ?? 0,
          },
        });
        d.pricing_rules = normalizedRules.map((r) => ({
          ...r,
          id: `rule-${r.size_yards}`,
          org_id: d.organization.id,
        }));
      });
    } else {
      const { member, db } = await identity();
      if (member.role !== 'owner') throw new Error('FORBIDDEN');

      // Check if organization has an active paid subscription to remove the $11.95 fee
      const { data: orgData } = await db
        .from('organizations')
        .select('subscription_status')
        .eq('id', member.org_id)
        .single();
      const isPaid = orgData?.subscription_status === 'active';
      if (input.customer_fee_enabled === false && !isPaid) {
        throw new Error('Disabling the $11.95 reservation fee requires an active Starter ($29/mo) or Growth ($149/mo) plan.');
      }
      const sanitizedInput = {
        ...input,
        customer_fee_enabled: input.customer_fee_enabled ?? true,
      };

      const { error } = await admin().rpc('save_settings', {
        p_org: member.org_id,
        p_input: sanitizedInput,
      });
      if (error) throw new Error(error.message);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
