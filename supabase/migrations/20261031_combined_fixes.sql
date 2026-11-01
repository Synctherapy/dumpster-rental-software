-- ============================================================================
-- RollOS Production Security & Schema Update (Migrations 1 to 5)
-- Paste into Supabase SQL Editor and click "RUN" (or Ctrl+Enter):
-- https://supabase.com/dashboard/project/easpvxasqeperzqkekdo/sql
-- ============================================================================

-- 1. SMS Opt-Outs (TCPA Compliance)
create table if not exists public.sms_opt_outs (
  org_id uuid not null references public.organizations(id) on delete cascade,
  phone text not null,
  opted_out_at timestamptz not null default now(),
  source text not null default 'sms_keyword',
  primary key (org_id, phone)
);

alter table public.sms_opt_outs enable row level security;

drop policy if exists opt_out_read on public.sms_opt_outs;
create policy opt_out_read on public.sms_opt_outs
  for select to authenticated
  using(org_id=public.current_org() and public.current_role() in ('owner','dispatcher'));

create index if not exists sms_opt_outs_phone on public.sms_opt_outs(phone);


-- 2. Job Columns, Indexes & reserve_booking Update
alter table public.jobs add column if not exists protective_boards boolean not null default false;
alter table public.jobs add column if not exists is_commercial boolean not null default false;
alter table public.jobs add column if not exists swap_parent_job_id uuid references public.jobs(id);
alter table public.jobs add column if not exists swapped_from_container_label text;
alter table public.jobs add column if not exists signed_by_customer boolean;

update public.jobs
   set signed_by_customer = (signature->>'ip' is distinct from 'dispatch-phone')
 where signed_by_customer is null;

alter table public.jobs alter column signed_by_customer set default false;
alter table public.jobs alter column signed_by_customer set not null;

create index if not exists jobs_is_commercial on public.jobs(org_id, is_commercial);
create index if not exists jobs_swap_parent on public.jobs(swap_parent_job_id);

create or replace function public.reserve_booking(p_job jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare j public.jobs; r public.pricing_rules; o public.organizations; total int; deposit int; capacity int; reserved int;
begin
 select * into o from public.organizations where id=(p_job->>'org_id')::uuid for update;
 if not found then raise exception 'Organization not found'; end if;
 select * into j from public.jobs where booking_key=(p_job->>'booking_key')::uuid;
 if found then
  if j.org_id<>o.id then raise exception 'Invalid booking key'; end if;
  return to_jsonb(j);
 end if;
 select * into r from public.pricing_rules where org_id=o.id and size_yards=(p_job->>'size_yards')::int;
 if not found or not (p_job->>'zip'=any(r.service_zips)) then raise exception 'Size or service area unavailable'; end if;
 if (p_job->>'delivery_date')::date<current_date then raise exception 'Delivery cannot be in the past'; end if;
 total:=coalesce((p_job->>'deposit_cents')::int, (p_job->>'price_cents')::int, r.base_price_cents+greatest(0,(p_job->>'pickup_date')::date-(p_job->>'delivery_date')::date-r.included_days)*r.extra_day_cents);
 deposit:=total;
 select count(*) into capacity from public.containers where org_id=o.id and size_yards=r.size_yards and status<>'maintenance';
 select count(*) into reserved from public.jobs where org_id=o.id and size_yards=r.size_yards
 and (status in ('booked','dispatched','delivered') or (status='quoted' and created_at>now()-interval '30 minutes'))
 and delivery_date<=(p_job->>'pickup_date')::date and pickup_date>=(p_job->>'delivery_date')::date;
 if reserved>=capacity then raise exception 'That size is fully booked for these dates. Please choose another size or call the hauler.'; end if;
 insert into public.jobs(id,org_id,customer_name,customer_phone,customer_email,delivery_address,zip,size_yards,delivery_date,pickup_date,status,price_cents,deposit_cents,tons_included,extra_day_cents,notes,signature,booking_key,pricing_snapshot,protective_boards,signed_by_customer)
 values((p_job->>'id')::uuid,o.id,p_job->>'customer_name',p_job->>'customer_phone',p_job->>'customer_email',p_job->>'delivery_address',p_job->>'zip',r.size_yards,(p_job->>'delivery_date')::date,(p_job->>'pickup_date')::date,'quoted',total,deposit,r.included_tons,r.extra_day_cents,p_job->>'notes',p_job->'signature',(p_job->>'booking_key')::uuid,to_jsonb(r),coalesce((p_job->>'protective_boards')::boolean,false),true) returning * into j;
 return to_jsonb(j);
end $$;

revoke all on function public.reserve_booking(jsonb) from public, anon, authenticated;
grant execute on function public.reserve_booking(jsonb) to service_role;


-- 3. Distributed Atomic Rate Limiter
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

create or replace function public.prune_rate_limits() returns void
language sql security definer set search_path=public as $$
  delete from public.rate_limits where window_start < now() - interval '1 day';
$$;

revoke all on function public.prune_rate_limits() from public, anon, authenticated;
grant execute on function public.prune_rate_limits() to service_role;


-- 4. Lock Client-Side Organization Writes
revoke update on public.organizations from authenticated, anon;
drop policy if exists org_owner_update on public.organizations;


-- 5. Driver Link Revocation
alter table public.users add column if not exists links_revoked_at timestamptz;

comment on column public.users.links_revoked_at is
  'Driver route links issued at or before this time are refused. Set by the hauler; cleared by issuing a new link.';

-- Reload PostgREST schema cache
notify pgrst, 'reload schema';
