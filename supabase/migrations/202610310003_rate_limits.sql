-- Migration 202610310003_rate_limits.sql
-- A rate limiter that works on serverless. The only throttle in the codebase
-- was an in-memory Map on globalThis, and each function instance has its own,
-- so a "3 per hour" cap was really "3 per hour per instance". Public endpoints
-- that send SMS and email, or that accept credentials, had none at all.
create table if not exists public.rate_limits (
  bucket text primary key,
  window_start timestamptz not null default now(),
  hits int not null default 0
);

alter table public.rate_limits enable row level security;
-- No policies: only the service role, which bypasses RLS, touches this.

create index if not exists rate_limits_window on public.rate_limits(window_start);

-- Counts one hit against a bucket and says whether it is still within the
-- limit. One statement, so concurrent callers cannot both read a stale count.
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
                 when rl.window_start < v_now - make_interval(secs => p_window_seconds)
                 then 1
                 else rl.hits + 1
               end,
        window_start = case
                 when rl.window_start < v_now - make_interval(secs => p_window_seconds)
                 then v_now
                 else rl.window_start
               end
  returning rl.hits into v_hits;

  return v_hits <= p_limit;
end $$;

revoke all on function public.rate_limit_hit(text, int, int) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, int, int) to service_role;

-- Housekeeping: drop buckets nothing has touched for a day. Safe to call from
-- the existing daily cron, or to ignore; stale rows are harmless but pointless.
create or replace function public.prune_rate_limits() returns void
language sql security definer set search_path=public as $$
  delete from public.rate_limits where window_start < now() - interval '1 day';
$$;

revoke all on function public.prune_rate_limits() from public, anon, authenticated;
grant execute on function public.prune_rate_limits() to service_role;
