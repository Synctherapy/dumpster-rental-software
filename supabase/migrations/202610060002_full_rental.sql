-- Full base rental up front, zero platform fee on rentals, scale ticket required for overage.
alter table public.organizations alter column pricing_config set default '{"deposit_percent":100}';
update public.organizations set pricing_config = jsonb_set(pricing_config, '{deposit_percent}', '100');
alter table public.jobs add column if not exists scale_ticket_url text;

create or replace function public.platform_fee(amount int) returns int language sql immutable as $$
  select 0
$$;

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
 total:=r.base_price_cents+greatest(0,(p_job->>'pickup_date')::date-(p_job->>'delivery_date')::date-r.included_days)*r.extra_day_cents;
 deposit:=total;
 select count(*) into capacity from public.containers where org_id=o.id and size_yards=r.size_yards and status<>'maintenance';
 select count(*) into reserved from public.jobs where org_id=o.id and size_yards=r.size_yards
 and (status in ('booked','dispatched','delivered') or (status='quoted' and created_at>now()-interval '30 minutes'))
 and delivery_date<=(p_job->>'pickup_date')::date and pickup_date>=(p_job->>'delivery_date')::date;
 if reserved>=capacity then raise exception 'That size is fully booked for these dates. Please choose another size or call the hauler.'; end if;
 insert into public.jobs(id,org_id,customer_name,customer_phone,customer_email,delivery_address,zip,size_yards,delivery_date,pickup_date,status,price_cents,deposit_cents,tons_included,extra_day_cents,notes,signature,booking_key,pricing_snapshot)
 values((p_job->>'id')::uuid,o.id,p_job->>'customer_name',p_job->>'customer_phone',p_job->>'customer_email',p_job->>'delivery_address',p_job->>'zip',r.size_yards,(p_job->>'delivery_date')::date,(p_job->>'pickup_date')::date,'quoted',total,deposit,r.included_tons,r.extra_day_cents,p_job->>'notes',p_job->'signature',(p_job->>'booking_key')::uuid,to_jsonb(r)) returning * into j;
 return to_jsonb(j);
end $$;

create or replace function public.prepare_invoice(p_job_id uuid,p_org uuid) returns jsonb language plpgsql security definer set search_path=public as $$
declare j public.jobs; o public.organizations; total int; paid int; amount int; overage int;
begin
 select * into j from public.jobs where id=p_job_id and org_id=p_org for update;
 if not found or j.status not in ('picked_up','completed') then raise exception 'Pick up the container before invoicing'; end if;
 if j.tons_actual is null then raise exception 'Record actual tonnage before closing this job'; end if;
 overage:=round(greatest(0,j.tons_actual-j.tons_included)*(j.pricing_snapshot->>'overage_per_ton_cents')::numeric);
 if overage>0 and coalesce(j.scale_ticket_url,'')='' then raise exception 'Attach the landfill scale ticket before charging an overage'; end if;
 select * into o from public.organizations where id=p_org;
 total:=(j.pricing_snapshot->>'base_price_cents')::int+greatest(0,j.pickup_date-j.delivery_date-(j.pricing_snapshot->>'included_days')::int)*j.extra_day_cents+overage;
 select coalesce(sum(amount_cents-refunded_cents),0) into paid from public.payments where job_id=j.id and status='succeeded';
 insert into public.invoice_attempts(job_id,amount_cents) values(j.id,greatest(0,total-paid)) on conflict do nothing;
 select amount_cents into amount from public.invoice_attempts where job_id=j.id;
 if amount=0 then update public.jobs set status='completed' where id=j.id; end if;
 return jsonb_build_object('job',to_jsonb(j),'amount_cents',amount,'account_id',o.stripe_connect_account_id,'attempt',(select to_jsonb(a) from public.invoice_attempts a where a.job_id=j.id));
end $$;

create or replace function public.apply_stripe_event(p_event_id text,p_type text,p_object jsonb) returns jsonb language plpgsql security definer set search_path=public as $$
declare j public.jobs; kind text; expected int; received_status text; intent_id text; notify boolean:=false; key text; fee int;
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
 fee:=case when kind='deposit' then public.platform_fee(expected) else 0 end;
 if expected is null or (p_object->>'amount')::int is distinct from expected or (p_object->>'application_fee_amount')::int is distinct from fee or lower(coalesce(p_object->>'currency','')) not in ('usd','cad') then raise exception 'Payment amount or fee does not match invoice'; end if;
 if (p_object->'transfer_data'->>'destination') is not null and (p_object->'transfer_data'->>'destination') is distinct from (select stripe_connect_account_id from public.organizations where id=j.org_id) then raise exception 'Payment destination does not match hauler'; end if;
 received_status:=case when p_type='payment_intent.succeeded' then 'succeeded' else 'failed' end;
 intent_id:=p_object->>'id';key:=kind||'-'||j.id;
 select not exists(select 1 from public.payments where stripe_payment_intent_id=intent_id and status in ('succeeded','refunded')) into notify;
 insert into public.payments(org_id,job_id,stripe_payment_intent_id,amount_cents,application_fee_cents,status,idempotency_key)
 values(j.org_id,j.id,intent_id,expected,fee,received_status,key)
 on conflict(stripe_payment_intent_id) do update set status=case when public.payments.status in ('succeeded','refunded') then public.payments.status else excluded.status end;
 if received_status='succeeded' then
  if kind='deposit' then update public.jobs set status=case when status='quoted' then 'booked' else status end,stripe_customer_id=p_object->>'customer',stripe_payment_method_id=p_object->>'payment_method' where id=j.id;
  else update public.jobs set status='completed' where id=j.id; end if;
 else notify:=false; end if;
 return jsonb_build_object('notify',notify,'job',to_jsonb(j),'template',case when kind='deposit' then 'booking_confirmation' else 'invoice_receipt' end);
end $$;

revoke all on function public.platform_fee(int), public.reserve_booking(jsonb), public.prepare_invoice(uuid,uuid), public.apply_stripe_event(text,text,jsonb) from public, anon, authenticated;
grant execute on function public.reserve_booking(jsonb), public.prepare_invoice(uuid,uuid), public.apply_stripe_event(text,text,jsonb) to service_role;

create or replace function public.attach_scale_ticket(p_id uuid, p_org uuid, p_url text) returns void language plpgsql security definer set search_path=public as $$
begin
  if p_url is null or p_url !~ '^/api/(photos|proof)/[0-9a-f-]+' then raise exception 'Upload the scale ticket first'; end if;
  update public.jobs set scale_ticket_url=p_url where id=p_id and org_id=p_org;
  if not found then raise exception 'Job not found'; end if;
end $$;
revoke all on function public.attach_scale_ticket(uuid,uuid,text) from public, anon, authenticated;
grant execute on function public.attach_scale_ticket(uuid,uuid,text) to service_role;
