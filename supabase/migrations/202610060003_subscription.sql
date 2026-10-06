alter table public.organizations add column if not exists stripe_subscription_id text;
alter table public.organizations add column if not exists subscription_status text not null default 'inactive';
