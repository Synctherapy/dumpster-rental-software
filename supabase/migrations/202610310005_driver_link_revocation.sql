-- Migration 202610310005_driver_link_revocation.sql
-- Let a hauler cancel a driver's route links immediately.
--
-- Driver links are signed bearer URLs sent by SMS. They expire with the job
-- they were sent for, but until now there was no way to end one early: removing
-- a driver from the crew left the link on their phone working until it lapsed.
-- For a fired driver that is a live view of customer names, addresses and phone
-- numbers, and the ability to mark jobs delivered.
--
-- Revoking sets a timestamp. Every driver token now carries the time it was
-- issued, and any token issued at or before this moment is refused. A token
-- minted before this column existed carries no issue time, so once a driver has
-- been revoked those older links are refused too.
alter table public.users add column if not exists links_revoked_at timestamptz;

comment on column public.users.links_revoked_at is
  'Driver route links issued at or before this time are refused. Set by the hauler; cleared by issuing a new link.';
