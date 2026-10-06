-- Run against a disposable Supabase DB after migration. Rolls back all fixtures.
begin;
insert into public.organizations(id,name,slug) values('10000000-0000-4000-8000-000000000001','Tenant A','rls-test-a'),('20000000-0000-4000-8000-000000000001','Tenant B','rls-test-b');
insert into public.users(id,org_id,name,role) values('10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','Owner A','owner'),('20000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001','Owner B','owner');
insert into public.containers(org_id,label,size_yards) values('10000000-0000-4000-8000-000000000001','A-1',20),('20000000-0000-4000-8000-000000000001','B-1',20);
insert into public.pricing_rules(org_id,size_yards,base_price_cents,included_days,extra_day_cents,included_tons,overage_per_ton_cents,service_zips)
select id,20,42500,7,2000,2,8500,array['78704'] from public.organizations where slug in ('rls-test-a','rls-test-b');
insert into public.jobs(org_id,customer_name,customer_phone,customer_email,delivery_address,zip,size_yards,delivery_date,pickup_date,price_cents,deposit_cents,tons_included,extra_day_cents,signature,pricing_snapshot,booking_key)
select org_id,'Test customer','+15125550123','test@example.com','123 Main Street','78704',20,current_date+1,current_date+8,42500,10625,2,2000,'{}'::jsonb,to_jsonb(r),gen_random_uuid() from public.pricing_rules r;
insert into public.payments(org_id,job_id,stripe_payment_intent_id,amount_cents,application_fee_cents,status,idempotency_key)
select org_id,id,'pi_rls_'||id::text,10625,106,'succeeded','rls-'||id::text from public.jobs;
insert into public.notifications_log(org_id,job_id,channel,template,"to",status)
select org_id,id,'sms','test',customer_phone,'sent' from public.jobs;
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-4000-8000-000000000002',true);
do $$ begin
 if (select count(*) from public.organizations)<>1 then raise exception 'Organization isolation failed'; end if;
 if (select count(*) from public.containers)<>1 then raise exception 'Container isolation failed'; end if;
 if (select count(*) from public.jobs)<>1 then raise exception 'Job isolation failed'; end if;
 if (select count(*) from public.pricing_rules)<>1 then raise exception 'Pricing isolation failed'; end if;
 if (select count(*) from public.payments)<>1 then raise exception 'Payment isolation failed'; end if;
 if (select count(*) from public.notifications_log)<>1 then raise exception 'Notification isolation failed'; end if;
 update public.jobs set price_cents=1;
 if found then raise exception 'Clients can change financial job data'; end if;
 update public.payments set amount_cents=1;
 if found then raise exception 'Clients can change payments'; end if;
 if exists(select 1 from public.users where org_id='20000000-0000-4000-8000-000000000001') then raise exception 'User isolation failed'; end if;
 if has_function_privilege('authenticated','public.apply_stripe_event(text,text,jsonb)','EXECUTE') then raise exception 'Webhook RPC is exposed'; end if;
 if has_function_privilege('authenticated','public.transition_job(uuid,uuid,jsonb,uuid)','EXECUTE') then raise exception 'Transition RPC is exposed'; end if;
 begin
  insert into public.users(org_id,name,role) values('20000000-0000-4000-8000-000000000001','Injected driver','driver');
  raise exception 'Cross-tenant insert was allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.users(org_id,name,role) values('10000000-0000-4000-8000-000000000001','Injected owner','owner');
  raise exception 'Role escalation was allowed';
 exception when insufficient_privilege then null; end;
end $$;
rollback;
