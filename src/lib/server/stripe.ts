import 'server-only';
import Stripe from 'stripe';
export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key?.startsWith('sk_test_'))
    throw new Error(
      'Stripe test-mode key required. Live payments are disabled until launch acceptance tests pass.',
    );
  return new Stripe(key);
}
