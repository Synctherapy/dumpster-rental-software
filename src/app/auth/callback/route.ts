import { NextResponse } from 'next/server';
import { sessionClient } from '@/lib/server/supabase';
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (code) {
    const db = await sessionClient();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL('/settings', url.origin));
  }
  return NextResponse.redirect(new URL('/login?error=confirmation', url.origin));
}
