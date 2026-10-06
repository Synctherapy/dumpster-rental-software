# Start the cloud workspace

Each cloud task already runs in an isolated environment. Use the existing checkout at `/workspace/dumpster-rental-software`; do not create a Git worktree unless the user explicitly asks for one. Read its `AGENTS.md` and relevant installed Next.js guides before changing code.

Node 22+ is required (the prepared machine uses Node 24). Installed `node_modules`, source files, and build output can survive an environment snapshot. Running servers and authentication must be re-established. Never assume a saved configuration has been applied or published.

If dependencies are missing or the lockfile changed, execute `bash scripts/cloud-install.sh` in the checkout. The script installs with the frozen npm lockfile, runs lint/type/SQL checks, and builds. It uses `/workspace/.npm-cache` to avoid the unavailable home-directory cache. It deliberately defaults to sample demo data when no Supabase configuration exists. Do not edit lockfiles, disable TLS/checksums, reset Git, or overwrite user configuration to make installation pass.

Check service-variable presence by name only. All three Supabase variables activate hosted mode; incomplete configuration raises an error and does not fall back to the public demo. Real authentication, Stripe test payments, and Twilio/Resend delivery require the secure values documented in `.env.example` and `README.md`. Do not ask for credential values in chat. Live Stripe charges are intentionally disabled.

For development, first check whether the app is already serving on port 3000. If not, start it from the checkout:

```sh
export npm_config_cache=/workspace/.npm-cache
export NEXT_TELEMETRY_DISABLED=1
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Keep the server in a managed command session or background it with logs in `/tmp/rollos-dev.log`. Inspect startup errors and retry only after a meaningful correction. Do not stop other processes or delete `.rollos` data. To run the retained production build instead, use `ROLLOS_DEMO=true npm start -- --hostname 0.0.0.0 --port 3000` for the sample workspace, or the configured hosted environment without a demo override. Choose one server per port.

Validate with local requests, not a PID alone. In demo mode `/api/workspace` must return Greenline Hauling’s organization, jobs, pricing rules, and `demo:true`; `/api/public/greenline` must return the four configured dumpster sizes; `/book/greenline` must render the booking page. A hosted workspace intentionally returns 401 without a valid session; log in normally rather than bypassing auth. Use the configured organization’s slug for public booking checks. Do not create user-facing localhost/loopback preview links during cloud onboarding.

After changes, run checks relevant to the affected workflow. `npm run check` covers lint, types, pricing, embedded Postgres RLS, and webhook retry/refund logic. `npm run test:e2e` runs the complete demo booking-to-invoice flow in Chromium, plus mobile layouts and API rejection checks; it creates its own temporary data and server on port 3100. The cloud machine already provides `/usr/bin/chromium`, so no browser download is needed. Hosted service acceptance is separate and is not proven by demo tests.
