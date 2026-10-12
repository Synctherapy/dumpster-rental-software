import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isDemo, mutateDemo } from '@/lib/server/store';
import { sessionClient } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';

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
          if (body.company) d.organization.name = String(body.company).trim();
        }).catch(() => {});
      }
      return NextResponse.json({
        ok: true,
        demo: true,
        message: 'Welcome to your pre-launch sandbox!',
      });
    }

    const input = z
      .object({
        action: z.enum(['login', 'signup', 'logout']),
        email: z.email().optional(),
        password: z.string().min(8).optional(),
        name: z.string().trim().min(2).max(80).optional(),
        company: z.string().trim().min(2).max(80).optional(),
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
      const { data, error } = await db.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: { name: input.name, company: input.company },
          emailRedirectTo: `${process.env.APP_URL || new URL(request.url).origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return NextResponse.json({ confirmation: !data.session });
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
