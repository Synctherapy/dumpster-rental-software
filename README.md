# RollOS

Booking-first dumpster rental software, built from the supplied [product spec](docs/build-spec.md). Next.js App Router, TypeScript, Tailwind, shadcn-style Radix UI primitives, Supabase Auth/Postgres, Stripe Connect Express, and Twilio. The official `create-next-app` starter is the scaffold; this project does **not** claim to use an audited third-party Connect boilerplate.

## Run the local demo

Requires Node 22 or newer. The cloud machine has Node 24.

```sh
cd /workspace/dumpster-rental-software
npm ci
npm run dev -- --hostname 0.0.0.0
```

Open the app using your hosting platform’s normal app access. Routes:

| Route                       | What it does                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------- |
| `/`                         | Marketing, transparent pricing, FAQ                                                    |
| `/dashboard`                | Dispatch board, job drawer, assignment, status changes                                 |
| `/bookings`, `/calendar`    | Searchable booking list and delivery/pickup calendar                                   |
| `/inventory`, `/drivers`    | Container availability, crew, secure route links and SMS invites                       |
| `/payments`                 | Recorded payment ledger and CSV export                                                 |
| `/settings`                 | Pricing, service ZIP codes, deposits, booking links, iframe snippet, Stripe onboarding |
| `/book/greenline`           | Five-step sample booking (use Austin ZIP `78704`)                                      |
| `/embed/greenline`          | Embeddable booking flow                                                                |
| `/driver/[token]`           | Mobile route, navigation, delivery photo, pickup, actual tonnage                       |
| `/login`, `/signup`         | Hosted Supabase authentication; demo does not create accounts                          |
| `/tools/tonnage-calculator` | Disposal overage calculator                                                            |

With no Supabase configuration, development uses an explicit sample workspace. Changes are persisted to ignored `.rollos/demo.json`, with delivery photos beside it. Demo payments have `status=demo` and **no fabricated Stripe object IDs**. No SMS/email is sent in demo mode. Driver demo links are valid for 24 hours, with a documented demo-only signing key.

Demo storage is for one local Node process and sample data. It is not multi-tenant authentication or durable Vercel storage. Production builds require `ROLLOS_DEMO=true` to deliberately run a demo, or complete Supabase configuration. Partial Supabase configuration fails closed rather than reverting to a public demo.

```sh
ROLLOS_DEMO=true npm run build
ROLLOS_DEMO=true npm start -- --hostname 0.0.0.0
```

The cloud task already provides an isolated checkout. Use it; do not create a worktree unless the user requests one.

## Connect hosted services

Copy `.env.example` to `.env.local` locally, or enter bindings securely in cloud/Vercel environment settings. Do not commit credentials. All service values are currently absent; no external project has been created or migrated on your behalf.

1. **Supabase:** create a project and apply `supabase/migrations/202610060001_foundation.sql` in the SQL editor or through your migration tooling. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. Keep the service-role key server-only. Set the project Site URL to the deployed origin, add `/auth/callback` as an allowed redirect, and use PKCE confirmation redirects. Confirm email delivery in your Supabase Auth settings. Signup creates an organization and owner automatically; add service ZIPs and containers in Settings before accepting bookings.
2. **App origin:** set `APP_URL` to the deployed HTTPS origin without a trailing slash. Generate your own random `DRIVER_TOKEN_SECRET` with at least 32 characters. These links permit access only to jobs assigned to the signed driver and expire in 24 hours.
3. **Stripe:** enable Connect and set a **test** `STRIPE_SECRET_KEY`. In Settings, create an Express account and finish its test onboarding. Register `/api/webhooks/stripe` for `payment_intent.succeeded`, `payment_intent.payment_failed`, and `charge.refunded`; set its `STRIPE_WEBHOOK_SECRET`. Checkout uses destination charges and `application_fee_amount=round(amount_cents * 0.01)`. Stripe PaymentIntents use an integer application fee amount, rather than the subscription-only percent parameter described in the original spec. Checkout creates/saves a customer and card for the final off-session balance. Live keys and live webhook events are rejected.
4. **SMS:** set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER`. Trial accounts require verified destination numbers. `/api/webhooks/twilio` validates provider signatures and records message delivery status. Successful queueing is not represented as confirmed delivery.
5. **Email (optional):** set `RESEND_API_KEY` and a verified sender in `EMAIL_FROM`. This sends confirmations, receipts, and delivery/pickup reminders. Unconfigured providers are logged as `not_configured`.
6. **Reminders:** set `CRON_SECRET`; `vercel.json` schedules authenticated `/api/reminders` once daily at 14:00 UTC. Each organization’s timezone determines tomorrow’s delivery/pickup date. Configure an appropriate schedule for your operation and hosting plan.

Server-side network destinations are your `<project>.supabase.co` host, `api.stripe.com`, `api.twilio.com`, and optionally `api.resend.com`. Keep the package-manager presets enabled. The local demo requires none of these external services.

In hosted mode, authenticated requests use Supabase cookies and verify membership. RLS restricts organizations, users, jobs, containers, pricing, payment records, logs, and delivery proof metadata. There are no client write policies for jobs or money. Service-only RPCs handle booking reservations, container locks, transitions, and financial writes. Private delivery photos are served to staff through short-lived signed storage URLs.

## Workflow

Create a booking → open the job → assign an available container of the correct size and a driver → dispatch. The container becomes on-site/reserved. Share the driver’s expiring route link (or send the SMS invite with configured Twilio). The driver can announce they are en route, upload a JPEG/PNG under 8 MB, mark delivered, then mark picked up. Pickup returns the container to the yard. Enter actual tonnage and close the invoice. Additional days and tons use the pricing snapshot agreed at booking, so later pricing edits do not alter earlier rentals.

Booking dates remain the rental dates used for invoicing. If pickup is delayed, update the pickup date to the actual rental end before invoicing. Tonnage is entered manually; dump-ticket OCR is intentionally outside this build.

## Money and retry behavior

- Clients send identifiers and customer details, never authoritative prices. The booking schema rejects added price fields. Postgres recomputes/checks hosted deposit amounts.
- Each booking key is unique; reservations use organization locks and enforce size/date capacity. Checkout expires after 30 minutes. Saved Checkout IDs prevent accidentally creating another payment for a paid or expired session.
- Final invoices freeze their amount in `invoice_attempts`. Each Stripe operation has a stable idempotency key, and the returned PaymentIntent ID is retained. Older attempts with an unknown Stripe result require reconciliation before another charge is allowed. Declined or authentication-required cards need customer action through Stripe; no automatic new payment is created.
- Webhook claims and ledger updates happen in one transaction. Event IDs, PaymentIntent IDs, and logical payment keys are unique. Replays cannot double-record. Out-of-order failures cannot downgrade a successful payment. Amount, currency, fee, and Connect destination are checked before posting.
- Fully paid jobs can close with zero remaining balance. Refunds update the existing Stripe-linked ledger entry; refund initiation is through Stripe, not an unverified local button.
- `/payments` displays collected volume, the 1% platform fee, and the amount after that fee. **Actual Stripe processing fees and bank payouts must be reconciled in Stripe.** No estimated fee is presented as an actual payout.
- Notification sends are claimed before sending and logged; reminder replays do not duplicate the same day’s message. A failed/uncertain send requires operator investigation rather than silently resending. Email supports provider idempotency. Actual provider receipt/delivery remains an integration acceptance check.

## Validate

```sh
npm run check        # lint, TypeScript, pricing + Postgres/RLS/webhook tests
npm run test:e2e     # actual Chromium browser, isolated demo storage
npm run build       # production compilation
```

Browser tests automatically use `/usr/bin/chromium` when available. Otherwise install Playwright’s Chromium with `npx playwright install chromium` (requires access to `cdn.playwright.dev`). Tests start an isolated dev server on port 3100 and temporary storage, leaving the normal demo workspace intact. Screenshots/traces are generated under ignored `artifacts/` and `test-results/`.

Database tests execute the migration and financial RPCs against embedded Postgres (PGlite), reproducing Supabase’s auth identity and role grants. Postgres’s built-in UUID generator is used in that harness instead of loading `pgcrypto`. This verifies SQL behavior, not hosted Supabase configuration or provider delivery. `supabase/tests/tenant_isolation.sql` can also be run against a disposable hosted database; it rolls back its fixtures.

## Before launch

The local MVP is usable, but the spec’s external acceptance gates remain open: hosted signup/login and RLS; Stripe test dashboard fee verification, interrupted-endpoint event replay, card decline/customer recovery and refunds against real Stripe test objects; phone/SMS and email receipt; and a stranger completing onboarding. Live payments are intentionally disabled until these gates are independently verified.

Production deployment, custom domain, Sentry error monitoring, and the larger SEO/template/comparison collection are not configured in this environment. The referenced competitor audit was not attached, so no competitor pricing claims have been invented. Rental terms are a starter document and must be adapted by the hauler before real bookings. Native apps, accounting sync, GPS, route optimization, and the other excluded roadmap features are not implemented.

Publication/deployment is a separate platform action. Saved environment instructions do not deploy the app, create provider resources, publish the snapshot, or verify restoration in a fresh task.
