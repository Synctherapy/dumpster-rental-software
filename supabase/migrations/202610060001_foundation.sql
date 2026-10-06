-- Apply once in a new Supabase project. All money is integer cents.
create extension if not exists pgcrypto;
create table public.organizations (
 id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
 phone text not null default '', timezone text not null default 'America/Chicago', stripe_connect_account_id text,
 pricing_config jsonb not null default '{"deposit_percent":25}',
 check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 check ((pricing_config->>'deposit_percent')::int between 1 and 100)
);
create table public.users (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id),
 role text not null check(role in ('owner','dispatcher','driver')), name text not null, phone text not null default ''
);
create index users_org on public.users(org_id);
create table public.pricing_rules (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id),
 size_yards int not null check(size_yards in (10,20,30,40)), base_price_cents int not null check(base_price_cents>0),
 included_days int not null check(included_days between 1 and 90), extra_day_cents int not null check(extra_day_cents>=0),
 included_tons numeric not null check(included_tons>=0), overage_per_ton_cents int not null check(overage_per_ton_cents>=0),
 service_zips text[] not null, unique(org_id,size_yards)
);
create table public.jobs (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id),
 customer_name text not null, customer_phone text not null, customer_email text not null,
 delivery_address text not null, zip text not null, size_yards int not null,
 delivery_date date not null, pickup_date date not null, status text not null default 'quoted'
 check(status in ('quoted','booked','dispatched','delivered','picked_up','completed','cancelled')),
 price_cents int not null check(price_cents>=0), deposit_cents int not null check(deposit_cents>=0),
 tons_included numeric not null, tons_actual numeric check(tons_actual between 0 and 100), extra_day_cents int not null,
 driver_id uuid references public.users(id), container_id uuid,
 notes text not null default '', signature jsonb not null, pricing_snapshot jsonb not null,
 booking_key uuid not null unique, created_at timestamptz not null default now(),
 delivered_at timestamptz, picked_up_at timestamptz, proof_url text,
 stripe_customer_id text, stripe_payment_method_id text, stripe_checkout_session_id text unique,
 check(pickup_date>delivery_date and pickup_date<=delivery_date+365)
);
create index jobs_org_status on public.jobs(org_id,status);
create index jobs_driver on public.jobs(driver_id,delivery_date);
create table public.delivery_proofs (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id),
 job_id uuid not null references public.jobs(id), storage_key text not null unique, created_at timestamptz not null default now()
);
alter table public.delivery_proofs enable row level security;
create table public.containers (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id),
 label text not null, size_yards int not null check(size_yards in (10,20,30,40)),
 status text not null default 'yard' check(status in ('yard','on_site','maintenance')),
 current_job_id uuid references public.jobs(id), unique(org_id,label), unique(current_job_id),
 check(status <> 'yard' or current_job_id is null)
);
alter table public.jobs add constraint jobs_container_fkey foreign key(container_id) references public.containers(id);
create table public.payments (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id),
 job_id uuid not null references public.jobs(id), stripe_payment_intent_id text not null unique check(stripe_payment_intent_id like 'pi_%'),
 amount_cents int not null check(amount_cents>=0), application_fee_cents int not null check(application_fee_cents>=0),
 status text not null check(status in ('succeeded','pending','failed','refunded')),
 idempotency_key text not null unique, created_at timestamptz not null default now(), refunded_cents int not null default 0
 check(refunded_cents>=0 and refunded_cents<=amount_cents)
);
create table public.notifications_log (
 id uuid primary key default gen_random_uuid(), org_id uuid not null references public.organizations(id),
 job_id uuid references public.jobs(id), channel text not null check(channel in ('sms','email')),
 template text not null, "to" text not null, status text not null, sent_at timestamptz not null default now(), dedupe_key text unique
);
-- These tables are only accessible to the backend service role.
create table public.stripe_events(id text primary key, type text not null, processed_at timestamptz not null default now());
create table public.invoice_attempts(job_id uuid primary key references public.jobs(id), amount_cents int not null, stripe_payment_intent_id text unique, created_at timestamptz not null default now());

create function public.current_org() returns uuid language sql stable security definer set search_path=public as $$
 select org_id from public.users where id=auth.uid()
$$;
create function public.current_role() returns text language sql stable security definer set search_path=public as $$
 select role from public.users where id=auth.uid()
$$;
revoke all on function public.current_org(), public.current_role() from public;
grant execute on function public.current_org(), public.current_role() to authenticated;

alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.containers enable row level security;
alter table public.pricing_rules enable row level security;
alter table public.payments enable row level security;
alter table public.notifications_log enable row level security;
alter table public.stripe_events enable row level security;
alter table public.invoice_attempts enable row level security;
create policy proof_read on public.delivery_proofs for select to authenticated using(org_id=public.current_org());
create policy org_read on public.organizations for select to authenticated using(id=public.current_org());
create policy org_owner_update on public.organizations for update to authenticated using(id=public.current_org() and public.current_role()='owner') with check(id=public.current_org());
create policy user_read on public.users for select to authenticated using(org_id=public.current_org() and (public.current_role() in ('owner','dispatcher') or id=auth.uid()));
-- Public signup creates owners via the trigger below. The app can add drivers only.
create policy driver_insert on public.users for insert to authenticated with check(org_id=public.current_org() and public.current_role()='owner' and role='driver' and id<>auth.uid());
create policy job_read on public.jobs for select to authenticated using(org_id=public.current_org() and (public.current_role() in ('owner','dispatcher') or driver_id=auth.uid()));
create policy container_read on public.containers for select to authenticated using(org_id=public.current_org() and public.current_role() in ('owner','dispatcher'));
create policy container_insert on public.containers for insert to authenticated with check(org_id=public.current_org() and public.current_role()='owner' and status='yard' and current_job_id is null);
create policy container_owner_update on public.containers for update to authenticated using(org_id=public.current_org() and public.current_role()='owner' and current_job_id is null) with check(org_id=public.current_org() and current_job_id is null and status in ('yard','maintenance'));
create policy rules_read on public.pricing_rules for select to authenticated using(org_id=public.current_org() and public.current_role() in ('owner','dispatcher'));
create policy payments_read on public.payments for select to authenticated using(org_id=public.current_org() and public.current_role() in ('owner','dispatcher'));
create policy notifications_read on public.notifications_log for select to authenticated using(org_id=public.current_org() and public.current_role() in ('owner','dispatcher'));
-- No client policies allow writing jobs, payments, invoice attempts, or webhook events.

create function public.create_hauler() returns trigger language plpgsql security definer set search_path=public as $$
declare org uuid; company text; slug_base text;
begin
 company := coalesce(nullif(new.raw_user_meta_data->>'company',''),'My hauling company');
 slug_base := trim(both '-' from regexp_replace(lower(company),'[^a-z0-9]+','-','g'));
 if slug_base='' then slug_base:='hauler'; end if;
 insert into public.organizations(name,slug) values(company,slug_base||'-'||substr(new.id::text,1,8)) returning id into org;
 insert into public.users(id,org_id,name,role) values(new.id,org,coalesce(new.raw_user_meta_data->>'name','Owner'),'owner');
 insert into public.pricing_rules(org_id,size_yards,base_price_cents,included_days,extra_day_cents,included_tons,overage_per_ton_cents,service_zips)
 select org,s,p,7,2000,t,8500,'{}'::text[] from (values(10,32500,1),(20,42500,2),(30,52500,3),(40,62500,4)) x(s,p,t);
 return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_hauler();

-- Serializes reservations within an organization. Input is produced by the trusted booking server,
-- but prices are checked again against the current rule inside the transaction.
create function public.reserve_booking(p_job jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
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
 total:=r.base_price_cents+greatest(0,(p_job->>'pickup_date')::date-(p_job->>'delivery_date')::date-r.included_days)*r.extra_day_cents;
 deposit:=round(total*(o.pricing_config->>'deposit_percent')::numeric/100);
 select count(*) into capacity from public.containers where org_id=o.id and size_yards=r.size_yards and status<>'maintenance';
 select count(*) into reserved from public.jobs where org_id=o.id and size_yards=r.size_yards
 and (status in ('booked','dispatched','delivered') or (status='quoted' and created_at>now()-interval '30 minutes'))
 and delivery_date<=(p_job->>'pickup_date')::date and pickup_date>=(p_job->>'delivery_date')::date;
 if reserved>=capacity then raise exception 'That size is fully booked for these dates. Please choose another size or call the hauler.'; end if;
 insert into public.jobs(id,org_id,customer_name,customer_phone,customer_email,delivery_address,zip,size_yards,delivery_date,pickup_date,status,price_cents,deposit_cents,tons_included,extra_day_cents,notes,signature,booking_key,pricing_snapshot)
 values((p_job->>'id')::uuid,o.id,p_job->>'customer_name',p_job->>'customer_phone',p_job->>'customer_email',p_job->>'delivery_address',p_job->>'zip',r.size_yards,(p_job->>'delivery_date')::date,(p_job->>'pickup_date')::date,'quoted',total,deposit,r.included_tons,r.extra_day_cents,p_job->>'notes',p_job->'signature',(p_job->>'booking_key')::uuid,to_jsonb(r)) returning * into j;
 return to_jsonb(j);
end $$;

create function public.transition_job(p_id uuid,p_org uuid,p_patch jsonb,p_driver uuid default null) returns jsonb language plpgsql security definer set search_path=public as $$
declare j public.jobs; c public.containers; next_status text; assigned_driver uuid; assigned_container uuid; next_pickup date; next_delivery date;
begin
 select * into j from public.jobs where id=p_id and org_id=p_org for update;
 if not found then raise exception 'Job not found'; end if;
 if p_driver is not null and j.driver_id is distinct from p_driver then raise exception 'Forbidden'; end if;
 if exists(select 1 from public.invoice_attempts where job_id=j.id) or j.status in ('completed','cancelled') then raise exception 'This job is closed or its invoice is locked'; end if;
 next_status:=coalesce(p_patch->>'status',j.status);
 if next_status<>j.status and not ((j.status='booked' and next_status in ('dispatched','cancelled')) or (j.status='quoted' and next_status='cancelled') or (j.status='dispatched' and next_status in ('delivered','cancelled')) or (j.status='delivered' and next_status='picked_up')) then raise exception 'Move this job through its stages in order'; end if;
 if p_driver is not null and (next_status not in ('delivered','picked_up') or p_patch ?| array['driver_id','container_id','notes','delivery_date','pickup_date']) then raise exception 'Forbidden'; end if;
 assigned_driver:=case when p_patch?'driver_id' then (p_patch->>'driver_id')::uuid else j.driver_id end;
 assigned_container:=case when p_patch?'container_id' then (p_patch->>'container_id')::uuid else j.container_id end;
 if assigned_driver is not null and not exists(select 1 from public.users where id=assigned_driver and org_id=p_org and role='driver') then raise exception 'Invalid driver'; end if;
 if j.status in ('dispatched','delivered','picked_up') and assigned_container is distinct from j.container_id then raise exception 'An active container cannot be reassigned'; end if;
 if next_status='dispatched' then
  if assigned_driver is null or assigned_container is null then raise exception 'Assign a driver and container first'; end if;
  select * into c from public.containers where id=assigned_container and org_id=p_org for update;
  if not found or c.size_yards<>j.size_yards or c.status='maintenance' or (c.current_job_id is not null and c.current_job_id<>j.id) or (c.status='on_site' and c.current_job_id is distinct from j.id) then raise exception 'This container is already on site or unavailable'; end if;
  update public.containers set status='on_site',current_job_id=j.id where id=c.id;
 end if;
 if next_status='delivered' and coalesce(p_patch->>'proof_url',j.proof_url,'')='' then raise exception 'Upload delivery proof first'; end if;
 next_pickup:=coalesce((p_patch->>'pickup_date')::date,j.pickup_date);next_delivery:=coalesce((p_patch->>'delivery_date')::date,j.delivery_date);
 if next_delivery<>j.delivery_date and j.status<>'booked' then raise exception 'Delivery date is locked after dispatch'; end if;
 if next_status in ('picked_up','cancelled') then update public.containers set status='yard',current_job_id=null where current_job_id=j.id; end if;
 update public.jobs set status=next_status,driver_id=assigned_driver,container_id=assigned_container,
 delivery_date=next_delivery,pickup_date=next_pickup,
 price_cents=(pricing_snapshot->>'base_price_cents')::int+greatest(0,next_pickup-next_delivery-(pricing_snapshot->>'included_days')::int)*extra_day_cents,
 notes=coalesce(p_patch->>'notes',notes),tons_actual=coalesce((p_patch->>'tons_actual')::numeric,tons_actual),proof_url=coalesce(p_patch->>'proof_url',proof_url),
 delivered_at=case when next_status='delivered' then coalesce(delivered_at,now()) else delivered_at end,
 picked_up_at=case when next_status='picked_up' then coalesce(picked_up_at,now()) else picked_up_at end
 where id=j.id returning * into j;
 return to_jsonb(j);
end $$;

create function public.prepare_invoice(p_job_id uuid,p_org uuid) returns jsonb language plpgsql security definer set search_path=public as $$
declare j public.jobs; o public.organizations; total int; paid int; amount int;
begin
 select * into j from public.jobs where id=p_job_id and org_id=p_org for update;
 if not found or j.status not in ('picked_up','completed') then raise exception 'Pick up the container before invoicing'; end if;
 if j.tons_actual is null then raise exception 'Record actual tonnage before closing this job'; end if;
 select * into o from public.organizations where id=p_org;
 total:=(j.pricing_snapshot->>'base_price_cents')::int+greatest(0,j.pickup_date-j.delivery_date-(j.pricing_snapshot->>'included_days')::int)*j.extra_day_cents+round(greatest(0,j.tons_actual-j.tons_included)*(j.pricing_snapshot->>'overage_per_ton_cents')::numeric);
 select coalesce(sum(amount_cents-refunded_cents),0) into paid from public.payments where job_id=j.id and status='succeeded';
 insert into public.invoice_attempts(job_id,amount_cents) values(j.id,greatest(0,total-paid)) on conflict do nothing;
 select amount_cents into amount from public.invoice_attempts where job_id=j.id;
 if amount=0 then update public.jobs set status='completed' where id=j.id; end if;
 return jsonb_build_object('job',to_jsonb(j),'amount_cents',amount,'account_id',o.stripe_connect_account_id,'attempt',(select to_jsonb(a) from public.invoice_attempts a where a.job_id=j.id));
end $$;

create function public.apply_stripe_event(p_event_id text,p_type text,p_object jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare j public.jobs; kind text; expected int; received_status text; intent_id text; notify boolean:=false; key text;
begin
 insert into public.stripe_events(id,type) values(p_event_id,p_type) on conflict do nothing;
 if not found then return jsonb_build_object('duplicate',true); end if;
 if p_type='charge.refunded' then
  update public.payments set refunded_cents=greatest(refunded_cents,(p_object->>'amount_refunded')::int),status=case when (p_object->>'amount_refunded')::int>=amount_cents then 'refunded' else status end where stripe_payment_intent_id=p_object->>'payment_intent';
  if not found then raise exception 'Original payment is not recorded yet'; end if;
  return jsonb_build_object('refunded',true);
 end if;
 if p_type not in ('payment_intent.succeeded','payment_intent.payment_failed') then return '{}'::jsonb; end if;
 select * into j from public.jobs where id=(p_object->'metadata'->>'job_id')::uuid and org_id=(p_object->'metadata'->>'org_id')::uuid for update;
 if not found then raise exception 'Unknown rental payment'; end if;
 kind:=p_object->'metadata'->>'kind';
 if kind='deposit' then expected:=j.deposit_cents;
 elsif kind='invoice' then select amount_cents into expected from public.invoice_attempts where job_id=j.id;
 else raise exception 'Unknown payment kind'; end if;
 if expected is null or (p_object->>'amount')::int is distinct from expected or (p_object->>'application_fee_amount')::int is distinct from round(expected::numeric/100) or (p_object->>'currency') is distinct from 'usd' then raise exception 'Payment amount or fee does not match invoice'; end if;
 if (p_object->'transfer_data'->>'destination') is distinct from (select stripe_connect_account_id from public.organizations where id=j.org_id) then raise exception 'Payment destination does not match hauler'; end if;
 received_status:=case when p_type='payment_intent.succeeded' then 'succeeded' else 'failed' end;
 intent_id:=p_object->>'id';key:=kind||'-'||j.id;
 select not exists(select 1 from public.payments where stripe_payment_intent_id=intent_id and status in ('succeeded','refunded')) into notify;
 insert into public.payments(org_id,job_id,stripe_payment_intent_id,amount_cents,application_fee_cents,status,idempotency_key)
 values(j.org_id,j.id,intent_id,expected,round(expected::numeric/100),received_status,key)
 on conflict(stripe_payment_intent_id) do update set status=case when public.payments.status in ('succeeded','refunded') then public.payments.status else excluded.status end;
 if received_status='succeeded' then
  if kind='deposit' then update public.jobs set status=case when status='quoted' then 'booked' else status end,stripe_customer_id=p_object->>'customer',stripe_payment_method_id=p_object->>'payment_method' where id=j.id;
  else update public.jobs set status='completed' where id=j.id; end if;
 else notify:=false; end if;
 return jsonb_build_object('notify',notify,'job',to_jsonb(j),'template',case when kind='deposit' then 'booking_confirmation' else 'invoice_receipt' end);
end $$;

create function public.save_settings(p_org uuid,p_input jsonb) returns void language plpgsql security definer set search_path=public as $$
declare r jsonb;
begin
 update public.organizations set name=p_input->>'name',phone=p_input->>'phone',slug=p_input->>'slug',pricing_config=jsonb_build_object('deposit_percent',(p_input->>'deposit_percent')::int) where id=p_org;
 for r in select * from jsonb_array_elements(p_input->'pricing_rules') loop
  insert into public.pricing_rules(org_id,size_yards,base_price_cents,included_days,extra_day_cents,included_tons,overage_per_ton_cents,service_zips)
  values(p_org,(r->>'size_yards')::int,(r->>'base_price_cents')::int,(r->>'included_days')::int,(r->>'extra_day_cents')::int,(r->>'included_tons')::numeric,(r->>'overage_per_ton_cents')::int,array(select jsonb_array_elements_text(r->'service_zips')))
  on conflict(org_id,size_yards) do update set base_price_cents=excluded.base_price_cents,included_days=excluded.included_days,extra_day_cents=excluded.extra_day_cents,included_tons=excluded.included_tons,overage_per_ton_cents=excluded.overage_per_ton_cents,service_zips=excluded.service_zips;
 end loop;
 delete from public.pricing_rules where org_id=p_org and size_yards not in (select (x->>'size_yards')::int from jsonb_array_elements(p_input->'pricing_rules') x);
end $$;

-- Revoke default PUBLIC execute: only authenticated API server code with the service key
-- may perform these operations after explicitly verifying actor membership.
revoke all on function public.create_hauler(), public.reserve_booking(jsonb),public.transition_job(uuid,uuid,jsonb,uuid),public.prepare_invoice(uuid,uuid),public.apply_stripe_event(text,text,jsonb),public.save_settings(uuid,jsonb) from public,anon,authenticated;
grant execute on function public.reserve_booking(jsonb),public.transition_job(uuid,uuid,jsonb,uuid),public.prepare_invoice(uuid,uuid),public.apply_stripe_event(text,text,jsonb),public.save_settings(uuid,jsonb) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('delivery-proofs','delivery-proofs',false,8388608,array['image/jpeg','image/png']) on conflict(id) do nothing;
