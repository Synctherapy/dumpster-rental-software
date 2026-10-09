-- Migration 202610080001_swap_and_offline_payments.sql
-- Add is_swap and payment_type columns to jobs table
alter table public.jobs add column if not exists is_swap boolean not null default false;
alter table public.jobs add column if not exists payment_type text;
