-- Migration: 202610140002_twilio_phone_provisioning.sql
-- Add twilio phone number, sid, last_booking_at, and inactivity warning tracking to organizations

alter table public.organizations add column if not exists twilio_phone_number text unique;
alter table public.organizations add column if not exists twilio_phone_sid text;
alter table public.organizations add column if not exists last_booking_at timestamptz;
alter table public.organizations add column if not exists number_warning_sent_at timestamptz;

create index if not exists orgs_twilio_phone on public.organizations(twilio_phone_number);
