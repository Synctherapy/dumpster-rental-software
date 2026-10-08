import Link from 'next/link';
import { CheckCircle2, Clock3 } from 'lucide-react';
import { stripe } from '@/lib/server/stripe';
import { publicOrganization } from '@/lib/server/workspace';
export const dynamic = 'force-dynamic';
export default async function Success({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { slug } = await params;
  const { session_id } = await searchParams;
  let paid = false;
  let reference = '';
  try {
    if (session_id) {
      const orgData = await publicOrganization(slug).catch(() => null);
      const requestOptions = orgData?.organization?.stripe_connect_account_id
        ? { stripeAccount: orgData.organization.stripe_connect_account_id }
        : undefined;
      const session = await stripe().checkout.sessions.retrieve(
        session_id,
        {},
        requestOptions,
      );
      paid = session.payment_status === 'paid';
      reference = session.metadata?.job_id?.slice(0, 8) ?? '';
    }
  } catch {}
  return (
    <main className="booking-page">
      <div className="confirmation">
        <div className="check-icon">{paid ? <CheckCircle2 size={32} /> : <Clock3 size={32} />}</div>
        <h1>{paid ? 'Your deposit was received.' : 'Checking your payment.'}</h1>
        <p>
          {paid
            ? `Reference ${reference.toUpperCase()}. Your reservation will appear on the hauler’s board once payment confirmation is processed.`
            : 'If you completed checkout, refresh this page in a moment. Do not submit another payment.'}
        </p>
        <Link href={`/book/${slug}`} className="btn" style={{ marginTop: 24 }}>
          Back to booking
        </Link>
      </div>
    </main>
  );
}
