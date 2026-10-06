import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isDemo, mutateDemo } from '@/lib/server/store';
import { identity, admin } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
const rule = z.object({
  size_yards: z.union([z.literal(10), z.literal(20), z.literal(30), z.literal(40)]),
  base_price_cents: z.number().int().min(100).max(10000000),
  included_days: z.number().int().min(1).max(90),
  extra_day_cents: z.number().int().min(0).max(100000),
  included_tons: z.number().min(0).max(50),
  overage_per_ton_cents: z.number().int().min(0).max(100000),
  service_zips: z
    .array(z.string().regex(/^\d{5}$/))
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
        deposit_percent: z.number().int().min(1).max(100),
        pricing_rules: z.array(rule).min(1).max(4),
      })
      .strict()
      .parse(await request.json());
    if (new Set(input.pricing_rules.map((r) => r.size_yards)).size !== input.pricing_rules.length)
      throw new Error('Each size needs exactly one pricing rule.');
    if (isDemo()) {
      await mutateDemo((d) => {
        Object.assign(d.organization, {
          name: input.name,
          phone: input.phone,
          slug: input.slug,
          pricing_config: { deposit_percent: input.deposit_percent },
        });
        d.pricing_rules = input.pricing_rules.map((r) => ({
          ...r,
          id: `rule-${r.size_yards}`,
          org_id: d.organization.id,
        }));
      });
    } else {
      const { member } = await identity();
      if (member.role !== 'owner') throw new Error('FORBIDDEN');
      const { error } = await admin().rpc('save_settings', {
        p_org: member.org_id,
        p_input: input,
      });
      if (error) throw new Error(error.message);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
