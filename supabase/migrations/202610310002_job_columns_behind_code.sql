-- Migration 202610310002_job_columns_behind_code.sql
-- The application writes five job fields that no migration ever created.
-- Routes compensated by catching "column" errors and retrying without them,
-- so in production these values were silently dropped:
--   protective_boards            a paid add-on the driver needs to know about
--   signed_by_customer           the waiver gate, which must be enforceable
--   is_commercial                marks Net-30 contractor work
--   swap_parent_job_id           links a replacement bin to the one it replaced
--   swapped_from_container_label the label shown on a swap statement line
alter table public.jobs add column if not exists protective_boards boolean not null default false;
alter table public.jobs add column if not exists is_commercial boolean not null default false;
alter table public.jobs add column if not exists swap_parent_job_id uuid references public.jobs(id);
alter table public.jobs add column if not exists swapped_from_container_label text;
alter table public.jobs add column if not exists signed_by_customer boolean;

-- Backfill using the rule the agreement UI already applied: a job signed at
-- booking carries the signer's address, while a job taken over the phone by
-- dispatch is marked 'dispatch-phone' and still awaits the customer.
update public.jobs
   set signed_by_customer = (signature->>'ip' is distinct from 'dispatch-phone')
 where signed_by_customer is null;

-- No nulls from here on, so a write-once filter on this column is reliable.
alter table public.jobs alter column signed_by_customer set default false;
alter table public.jobs alter column signed_by_customer set not null;

create index if not exists jobs_is_commercial on public.jobs(org_id, is_commercial);
create index if not exists jobs_swap_parent on public.jobs(swap_parent_job_id);

-- reserve_booking() listed its insert columns explicitly, so it has to name the
-- two new ones that apply to an online booking. An online booking is signed at
-- the time it is placed; a phone order is not, and does not come through here.
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
