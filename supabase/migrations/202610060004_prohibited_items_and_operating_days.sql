-- Migration 202610060004_prohibited_items_and_operating_days.sql
-- Store prohibited items, operating days, complete pricing config on organizations, and driver notes on jobs.

alter table public.jobs add column if not exists driver_notes text;

create or replace function public.save_settings(p_org uuid, p_input jsonb) returns void language plpgsql security definer set search_path=public as $$
declare r jsonb;
begin
 update public.organizations 
 set name=p_input->>'name',
     phone=p_input->>'phone',
     slug=p_input->>'slug',
     pricing_config=jsonb_build_object(
       'deposit_percent', (p_input->>'deposit_percent')::int,
       'currency', coalesce(p_input->>'currency', 'usd'),
       'customer_fee_enabled', coalesce((p_input->>'customer_fee_enabled')::boolean, true),
       'google_review_url', coalesce(p_input->>'google_review_url', ''),
       'min_notice_hours', coalesce((p_input->>'min_notice_hours')::int, 24),
       'prohibited_items', p_input->'prohibited_items',
       'operating_days', p_input->'operating_days',
       'tax_rate_percent', coalesce((p_input->>'tax_rate_percent')::numeric, 0)
     ) 
 where id=p_org;

 for r in select * from jsonb_array_elements(p_input->'pricing_rules') loop
  insert into public.pricing_rules(org_id,size_yards,base_price_cents,included_days,extra_day_cents,included_tons,overage_per_ton_cents,service_zips)
  values(p_org,(r->>'size_yards')::int,(r->>'base_price_cents')::int,(r->>'included_days')::int,(r->>'extra_day_cents')::int,(r->>'included_tons')::numeric,(r->>'overage_per_ton_cents')::int,array(select jsonb_array_elements_text(r->'service_zips')))
  on conflict(org_id,size_yards) do update set base_price_cents=excluded.base_price_cents,included_days=excluded.included_days,extra_day_cents=excluded.extra_day_cents,included_tons=excluded.included_tons,overage_per_ton_cents=excluded.overage_per_ton_cents,service_zips=excluded.service_zips;
 end loop;
 delete from public.pricing_rules where org_id=p_org and size_yards not in (select (x->>'size_yards')::int from jsonb_array_elements(p_input->'pricing_rules') x);
end $$;

revoke all on function public.save_settings(uuid,jsonb) from public, anon, authenticated;
grant execute on function public.save_settings(uuid,jsonb) to service_role;
