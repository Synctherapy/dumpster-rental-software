# Dumpster Rental SaaS — Vibe-Coded Build Spec

Product: booking-first dumpster rental platform. Wedge: "the booking page that never sleeps."
Monetization: 2 plans — Starter ($29/mo) and Growth Fleet ($149/mo). Customer pays $12 reservation fee at checkout. Hauler keeps 100% of dumpster rental revenue with 0% platform commission. The customer pays the base rental up front.
Builder: solo, medium-level vibe coder. Pro on Antigravity, Claude Code, Codex.

## Locked decisions

- **Stack:** Next.js (App Router) + Supabase (Postgres + Auth) + Stripe Billing ($29/mo Starter, $149/mo Growth) + optional Stripe Connect (Express accounts, $12 customer reservation fee, 0% hauler commission) + Twilio SMS + Tailwind + shadcn/ui. Deploy on Vercel.
- **Start from a boilerplate**, not zero: a Next.js SaaS starter with Supabase auth + Stripe Connect already wired. This saves ~2 weeks and most of the dangerous code is pre-written.
- **One repo, git from prompt one.** Phase boundary rule: commit + working build before switching tools. Never switch tools on a broken build.
- **Stripe test mode** until Phase 4 acceptance criteria pass. Real money touches nothing before then.

## Data model (build in Phase 0, extend as needed)

- `organizations` — id, name, slug (for /book/[slug]), phone, timezone, stripe_connect_account_id, pricing config (JSONB)
- `users` — id, org_id, role (owner | dispatcher | driver), name, phone
- `containers` — id, org_id, label/number, size_yards, status (yard | on_site | maintenance), current_job_id
- `jobs` — id, org_id, customer_name, customer_phone, customer_email, delivery_address, zip, size_yards, delivery_date, pickup_date, status (quoted | booked | dispatched | delivered | picked_up | completed | cancelled), price_cents, deposit_cents, tons_included, tons_actual, extra_day_cents, driver_id, container_id, notes, signature (JSONB: name + timestamp + IP)
- `payments` — id, job_id, stripe_payment_intent_id, amount_cents, application_fee_cents, status, idempotency_key
- `pricing_rules` — org_id, size_yards, base_price_cents, included_days, extra_day_cents, included_tons, overage_per_ton_cents, service_zips (text[])
- `notifications_log` — job_id, channel (sms | email), template, to, status, sent_at

## Phase 0 — Foundation (Antigravity)

**Paste-ready prompt:**
> Scaffold this project from [chosen boilerplate]. Set up: Supabase project + env vars, Stripe Connect test mode keys, Twilio test credentials. Create the database schema for a dumpster rental SaaS with these tables: organizations, users (roles owner/dispatcher/driver), containers (yard/on_site/maintenance status), jobs (quoted→booked→dispatched→delivered→picked_up→completed/cancelled), payments (with stripe_payment_intent_id + idempotency_key), pricing_rules per org (size, base price, included days/tons, overage rates, service zips), notifications_log. Row-level security: users only see their org's data. Get `pnpm dev` running clean with auth working.

**Acceptance:** dev server runs, sign-up/login works, schema migrated, RLS verified (can't see another org's rows). **Commit.**

## Phase 1 — Booking flow (Antigravity, browser-agent tested)

**Prompt:**
> Build the public booking page at /book/[orgSlug]: step 1 — dumpster size selector (10/20/30/40 yd cards with "best for" debris guidance); step 2 — zip code checker against the org's service_zips (reject politely outside area); step 3 — delivery + pickup date pickers (pickup defaults to delivery + included days); instant price calculation from pricing_rules, shown live; step 4 — customer details (name, phone, email, address); step 5 — Stripe Checkout for the deposit amount (test mode), e-signature checkbox (typed name + timestamp stored on the job). On success: job created with status=booked, confirmation page with order summary, SMS confirmation via Twilio. Also build an embeddable iframe widget version of this flow for haulers' existing websites.

**Acceptance:** complete a full test booking in the browser (use the browser agent to click through): correct price math for 2 sizes, out-of-area zip rejected, deposit appears in Stripe test dashboard WITH the customer booking fee attached, SMS received. **Commit.**

## Phase 2 — Dispatch board (Antigravity)

**Prompt:**
> Build the admin dispatch dashboard: kanban board of jobs grouped by status columns (booked → dispatched → delivered → picked_up → completed), drag-and-drop to move jobs between statuses and assign driver + delivery date. Container assignment: pick from containers with status=yard, warn if assigning a container that's on_site (overbooking warning). Calendar week view of deliveries/pickups. Job detail drawer: customer info, address (map link), price breakdown, payment status, notes, signature record.

**Acceptance:** take a booked job → assign driver + container → status flows to dispatched → container flips to on_site. Overbooking warning fires when double-assigning. **Commit.**

## Phase 3 — Driver flow via SMS (Antigravity)

**Prompt:**
> Driver experience with zero app install: when a job is dispatched, SMS the driver a magic link (signed, expiring token, no login). Mobile-first web page showing today's jobs with customer name, address, big Navigate button (Google Maps link), and action buttons per job: "Mark delivered" (requires photo upload as proof), "Mark picked up", "Report overweight" (enter tons). Each action timestamps the job and updates container status. Keep it to 3 taps max per action — drivers wear gloves.

**Acceptance:** full driver loop on a real phone: SMS received → open link → navigate → photo proof → delivered → picked up. **Commit.**

## Phase 4 — Invoicing + take-rate money code (Claude Code — the careful slice)

**Prompt:**
> Build the money engine, server-side only. On job close (picked_up): auto-generate invoice = base price + extra days beyond included (extra_day_cents × days) + tonnage overage (max(0, tons_actual − tons_included) × overage_per_ton_cents). Charge the customer's card on file via Stripe. Every charge creates a payments row with stripe_payment_intent_id, amount_cents, application_fee_cents, and a unique idempotency_key. Webhook handlers for payment_intent.succeeded / payment_intent.failed / charge.refunded — all must be retry-safe (a retried webhook must never double-charge or double-record; check idempotency_key before writing). Build a hauler payout dashboard: gross volume, Stripe fees, customer booking fee, hauler net payout (100% of rental revenue), per-job breakdown. NEVER accept amounts from the client — recompute from pricing_rules + job data on every charge.

**The 5 money-code rules (non-negotiable):**
1. Amounts computed server-side only. Client sends job_id, never a price.
2. Idempotency keys on every PaymentIntent and every webhook write.
3. Webhook handlers assume retries — check-then-write, never blind insert.
4. Test clock: simulate a failed payment and a retried webhook before going live.
5. Reconciliation: every dollar in `payments` must reference a real Stripe object id. Build the dashboard query to prove it.

**Acceptance:** kill the webhook endpoint mid-test, replay the event — no double charge, no double row. Refund flow records correctly. **Commit. Do not go live until this passes.**

## Phase 5 — Notifications + polish (Antigravity or Codex)

**Prompt:**
> Twilio SMS + email sequences per job: booking confirmation (with order summary), day-before delivery reminder, "driver en route" (triggered from driver flow), pickup reminder day-before, invoice receipt with link. All sends logged to notifications_log with delivery status. Add e-signature capture already stored — surface it in the job drawer as a signed agreement view.

**Acceptance:** full SMS sequence received on a real phone for one test job. **Commit.**

## Phase 6 — Hauler onboarding + launch (Antigravity)

**Prompt:**
> Self-serve onboarding a non-technical hauler completes in under 30 minutes: sign up → Stripe Connect Express onboarding → set pricing rules (guided form: sizes offered, base prices, included days/tons, overage rates, service zips) → add containers (count by size) → invite drivers (SMS invite) → get booking link + embed snippet with copy button. Build the marketing landing page (the money page): headline targeting "dumpster rental software", live demo booking widget embedded, pricing section (Starter $29/mo or Growth $149/mo + $12 customer booking fee — weaponize 100% rental retention vs competitors' hidden fees), FAQ. Deploy to production on Vercel with custom domain. Pre-launch checklist: Stripe live keys, webhook endpoints registered, Twilio live number, env vars, error tracking (Sentry).

**Acceptance:** a stranger can sign up, configure, and take a real booking without talking to you. **Launch.**

## Parallel track — SEO colony (Codex Cloud, anytime after Phase 1)

PAA FAQ hub (10 questions from spec), template pages (contract, agreement, invoice, startup checklist), tonnage calculator tool, /vs/ comparison pages (vs iCANS, vs Docket, vs Roll-Off Amigo), geo pages (TX, FL, OH). One page per prompt, internal links pointing at the money page.

## Explicitly NOT building (Phase 2/3 roadmap — see competitor audit)

Native driver apps, QuickBooks/Xero sync, GPS/telematics integrations, route optimization, AI voice answering (start with instant SMS auto-reply to missed calls — 80% of the value), customer portal, multi-location management, dump-ticket OCR.

## Build-order cheat sheet

| Order | Phase | Tool | Why this tool |
|---|---|---|---|
| 1 | Foundation | Antigravity | Scaffold + visual iteration |
| 2 | Booking flow | Antigravity | Browser agent tests the flow |
| 3 | Dispatch board | Antigravity | UI-heavy |
| 4 | Driver SMS flow | Antigravity | Mobile web iteration |
| 5 | Money engine | Claude Code | Precision on payments |
| 6 | Notifications | Antigravity/Codex | Straightforward |
| 7 | Onboarding + launch | Antigravity | Landing page polish |
| ∥ | SEO colony | Codex Cloud | Async, parallel |

## Reference

Full competitor audit (feature matrix, pricing, gaps, per-competitor exploit cards): `dumpster-competitor-audit.md` in this folder. Read the iCANS section (the bar) and Docket section (the bodies) before Phase 1.
