-- ============================================================================
-- FINAL 3 FIXES: Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/easpvxasqeperzqkekdo/sql
-- ============================================================================

-- 1. Driver Link Revocation
alter table public.users add column if not exists links_revoked_at timestamptz;

-- 2. Lock Organization Writes From Client
revoke update on public.organizations from authenticated, anon;
drop policy if exists org_owner_update on public.organizations;

-- 3. Atomic Serverless Rate Limiter
create table if not exists public.rate_limits (
  bucket text primary key,
  window_start timestamptz not null default now(),
  hits int not null default 0
);

alter table public.rate_limits enable row level security;
create index if not exists rate_limits_window on public.rate_limits(window_start);

create or replace function public.rate_limit_hit(
  p_bucket text,
  p_limit int,
  p_window_seconds int
) returns boolean language plpgsql security definer set search_path=public as $$
declare
  v_hits int;
  v_now timestamptz := now();
begin
  insert into public.rate_limits as rl (bucket, window_start, hits)
  values (p_bucket, v_now, 1)
  on conflict (bucket) do update
    set hits = case
                 when rl.window_start < v_now - (p_window_seconds || ' seconds')::interval
                 then 1
                 else rl.hits + 1
               end,
        window_start = case
                 when rl.window_start < v_now - (p_window_seconds || ' seconds')::interval
                 then v_now
                 else rl.window_start
               end
  returning rl.hits into v_hits;

  return v_hits <= p_limit;
end $$;

revoke all on function public.rate_limit_hit(text, int, int) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, int, int) to service_role;

create or replace function public.prune_rate_limits() returns void
language sql security definer set search_path=public as $$
  delete from public.rate_limits where window_start < now() - interval '1 day';
$$;

revoke all on function public.prune_rate_limits() from public, anon, authenticated;
grant execute on function public.prune_rate_limits() to service_role;

-- Reload Supabase API schema cache immediately
notify pgrst, 'reload schema';
