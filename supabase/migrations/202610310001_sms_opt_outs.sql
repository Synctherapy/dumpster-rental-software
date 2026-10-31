-- Migration 202610310001_sms_opt_outs.sql
-- Record SMS opt-outs per organization so promotional messages can honour them.
-- The missed-call auto-reply is marketing, so sending it to a number that has
-- texted STOP is a TCPA problem, not just a courtesy failure.
create table if not exists public.sms_opt_outs (
  org_id uuid not null references public.organizations(id) on delete cascade,
  phone text not null,
  opted_out_at timestamptz not null default now(),
  source text not null default 'sms_keyword',
  primary key (org_id, phone)
);

alter table public.sms_opt_outs enable row level security;

-- Written only by the webhook through the service role; owners and dispatchers
-- may read their own organization's list.
drop policy if exists opt_out_read on public.sms_opt_outs;
create policy opt_out_read on public.sms_opt_outs
  for select to authenticated
  using(org_id=public.current_org() and public.current_role() in ('owner','dispatcher'));

create index if not exists sms_opt_outs_phone on public.sms_opt_outs(phone);
