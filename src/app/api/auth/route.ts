import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isDemo, mutateDemo } from '@/lib/server/store';
import { sessionClient } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import { generateCleanSlug } from '@/lib/city-zips';
import { notifyAdminSignup } from '@/lib/server/notifications';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json().catch(() => ({}));
    if (isDemo()) {
      if (body?.action === 'logout') {
        return NextResponse.json({ ok: true });
      }
      if (body?.action === 'signup' && (body?.name || body?.company)) {
        await mutateDemo((d) => {
          if (body.name) d.users[0].name = String(body.name).trim();
          if (body.company) {
            d.organization.name = String(body.company).trim();
            d.organization.slug = generateCleanSlug(String(body.company), body.city ? String(body.city) : undefined);
          }
          if (body.plan === 'starter' || body.plan === 'growth') {
            d.organization.subscription_status = 'active';
          }
          if (body.website_upsell) d.organization.website_addon = true;
          if (body.gbp_upsell) d.organization.gbp_addon = true;
        }).catch(() => {});

        await notifyAdminSignup({
          name: body.name ? String(body.name) : undefined,
          company: body.company ? String(body.company) : undefined,
          city: body.city ? String(body.city) : undefined,
          email: body.email ? String(body.email) : undefined,
          plan: body.plan ? String(body.plan) : undefined,
          website_addon: Boolean(body.website_upsell),
          gbp_addon: Boolean(body.gbp_upsell),
        }).catch(() => {});
      }
      return NextResponse.json({
        ok: true,
        demo: true,
        message: 'Welcome to your workspace!',
      });
    }

    const input = z
      .object({
        action: z.enum(['login', 'signup', 'logout']),
        email: z.email().optional(),
        password: z.string().min(8).optional(),
        name: z.string().trim().min(2).max(80).optional(),
        company: z.string().trim().min(2).max(80).optional(),
        city: z.string().trim().max(80).optional(),
        plan: z.string().optional(),
      })
      .parse(body);

    const db = await sessionClient();
    if (input.action === 'logout') {
      await db.auth.signOut();
      return NextResponse.json({ ok: true });
    }
    if (!input.email || !input.password) throw new Error('Email and password are required.');
    if (input.action === 'signup') {
      if (!input.company || !input.name) throw new Error('Your name and company are required.');
      const appOrigin =
        process.env.APP_URL ||
        request.headers.get('origin') ||
        (request.headers.get('x-forwarded-host')
          ? `${request.headers.get('x-forwarded-proto') || 'https'}://${request.headers.get('x-forwarded-host')}`
          : null) ||
        new URL(request.url).origin;

      const { data, error } = await db.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { name: input.name, company: input.company, city: input.city },
          emailRedirectTo: `${appOrigin}/auth/callback`,
        },
      });
      if (error) return failure(error);

      await notifyAdminSignup({
        name: input.name,
        company: input.company,
        city: input.city,
        email: input.email,
        plan: input.plan || (body?.plan ? String(body.plan) : undefined),
        website_addon: Boolean(body?.website_upsell),
        gbp_addon: Boolean(body?.gbp_upsell),
      }).catch((err) => console.error('Admin signup notification error:', err));

      return NextResponse.json({ confirmation: !data?.session, ok: true });
    }
    const { error } = await db.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
