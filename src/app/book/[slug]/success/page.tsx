import Link from 'next/link';
import { CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
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
  let jobId = '';
  try {
    if (session_id) {
      const orgData = await publicOrganization(slug).catch(() => null);
      let connectAccountId: string | undefined = undefined;
      if (orgData?.organization?.id) {
        const { admin } = await import('@/lib/server/supabase');
        const { data: dbOrg } = await admin()
          .from('organizations')
          .select('stripe_connect_account_id')
          .eq('id', orgData.organization.id)
          .single();
        connectAccountId = dbOrg?.stripe_connect_account_id ?? undefined;
      }
      const requestOptions = connectAccountId
        ? { stripeAccount: connectAccountId }
        : undefined;
      const session = await stripe().checkout.sessions.retrieve(
        session_id,
        {},
        requestOptions,
      );
      paid = session.payment_status === 'paid';
      jobId = session.metadata?.job_id ?? '';
      reference = jobId ? jobId.slice(0, 8) : '';
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
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          {paid && jobId && (
            <Link
              href={`/agreement/${jobId}`}
              target="_blank"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
            >
              <ShieldCheck size={16} className="text-[#ea580c]" /> View & Print Signed Agreement
            </Link>
          )}
          <Link href={`/book/${slug}`} className="btn">
            Back to booking
          </Link>
        </div>
      </div>
    </main>
  );
}
