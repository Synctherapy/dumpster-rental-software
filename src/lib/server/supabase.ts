import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
export function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export async function sessionClient() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(values) {
          values.forEach(({ name, value, options }) => store.set(name, value, options));
        },
      },
    },
  );
}
export async function identity() {
  const db = await sessionClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) throw new Error('UNAUTHORIZED');
  const { data, error } = await db.from('users').select('*').eq('id', user.id).single();
  if (error || !data) throw new Error('No organization membership found.');
  return { db, user, member: data };
}
