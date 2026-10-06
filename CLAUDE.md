@AGENTS.md

# Local demo setup

The user's immediate goal is to run the existing RollOS demo on their computer. Read `README.md` and work in this repository's root, wherever it was cloned. Do not run `scripts/cloud-install.sh` on a laptop; its paths are specific to the Codex cloud machine.

1. Check `node --version`; use Node 22 or newer.
2. Run `npm ci` to install the committed lockfile without changing dependency versions.
3. Run `npm run dev` and inspect startup output. If port 3000 is occupied, choose an available port and report it.
4. Open the app on the local port. Verify `/dashboard` loads Greenline Hauling and `/book/greenline` offers the four dumpster sizes. ZIP `78704` is served.
5. Optional verification: `npm run check`. Browser tests need Chromium; run `npx playwright install chromium` if it is not already installed, then `npm run test:e2e`.

No Supabase, Stripe, Twilio, or Resend credentials are required for the demo. Leave their variables unset. Do not invent secrets, create external resources, or enable live payments for local setup. A partially configured Supabase environment deliberately fails instead of falling back to demo mode; inspect variable names/presence without printing values, and preserve the user's existing configuration.

The demo uses one sample business, simulated payments, and logged-but-unsent notifications. Signup/login needs a real Supabase project. Changes persist under ignored `.rollos/`; do not delete that folder or user data to fix startup. Production compilation checks require `ROLLOS_DEMO=true` when external services are not configured.
