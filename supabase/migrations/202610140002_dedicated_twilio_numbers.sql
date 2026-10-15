-- Migration 202610140002_dedicated_twilio_numbers.sql
-- Add dedicated Twilio phone number management fields to organizations table
alter table public.organizations add column if not exists twilio_phone_number text;
alter table public.organizations add column if not exists twilio_phone_sid text;
alter table public.organizations add column if not exists last_booking_at timestamptz default now();
alter table public.organizations add column if not exists number_warning_sent_at timestamptz;
create index if not exists org_twilio_phone on public.organizations(twilio_phone_number);
