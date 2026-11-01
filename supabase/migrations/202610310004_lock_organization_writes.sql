-- Migration 202610310004_lock_organization_writes.sql
-- Close a self-service upgrade.
--
-- The org_owner_update policy let an authenticated owner UPDATE their own
-- organizations row with no restriction on which columns. Row-level security
-- cannot limit columns, so an owner using the browser's own Supabase
-- credentials could set subscription_status = 'active' and unlock the paid
-- tiers for free, or overwrite stripe_connect_account_id and twilio_phone_sid.
--
-- Every write to this table in the application already goes through the service
-- role: settings use save_settings(), and Connect onboarding, phone
-- provisioning, Stripe webhooks and the reminder cron all use the service
-- client explicitly. The browser session only ever reads. So the privilege is
-- not needed by anything.
revoke update on public.organizations from authenticated, anon;

-- With no privilege the policy can never apply; drop it so the schema stops
-- implying a client-side write path that does not exist. If UPDATE is ever
-- granted back, row-level security denies by default until a policy is written.
drop policy if exists org_owner_update on public.organizations;

-- org_read is untouched: reading stays scoped to the caller's own organization.
--
-- jobs, payments, notifications_log and delivery_proofs are deliberately left
-- alone. They have no write policy at all, so row-level security already denies
-- client writes, and the tenant isolation test asserts exactly that. Revoking
-- the privilege as well would turn those silent denials into hard errors and
-- change behaviour the test depends on, for no additional protection.
--
-- containers and users keep the write access the dashboard really uses, adding
-- a container or a driver and moving a container in and out of maintenance.
-- Their policies constrain the permitted values.
