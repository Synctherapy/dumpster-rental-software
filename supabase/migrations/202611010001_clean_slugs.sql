-- 202611010001_clean_slugs.sql
-- Updates create_hauler() trigger to generate clean company slugs without random hex codes,
-- and renames existing test/production organizations to clean human-readable slugs.

create or replace function public.create_hauler() returns trigger language plpgsql security definer set search_path=public as $$
declare
  org uuid;
  company text;
  slug_base text;
  candidate text;
  counter int := 1;
begin
  company := coalesce(nullif(new.raw_user_meta_data->>'company',''),'My hauling company');
  slug_base := trim(both '-' from regexp_replace(lower(company),'[^a-z0-9]+','-','g'));
  if slug_base = '' then slug_base := 'hauler'; end if;

  candidate := slug_base;
  while exists (select 1 from public.organizations where slug = candidate) loop
    counter := counter + 1;
    candidate := slug_base || '-' || counter;
  end loop;

  insert into public.organizations(name, slug) values(company, candidate) returning id into org;
  insert into public.users(id, org_id, name, role, email) values(new.id, org, coalesce(new.raw_user_meta_data->>'name','Owner'), 'owner', new.email);
  insert into public.pricing_rules(org_id, size_yards, base_price_cents, included_days, extra_day_cents, included_tons, overage_per_ton_cents, service_zips)
  select org, s, p, 7, 2000, t, 8500, '{}'::text[] from (values(10,32500,1),(20,42500,2),(30,52500,3),(40,62500,4)) x(s,p,t);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.create_hauler();

-- Rename existing test and live organizations with random hex to clean slug
update public.organizations
set slug = 'sync-dumpster-rental'
where slug = 'sync-dumpster-rental-6cf675ed';
