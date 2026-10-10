import Link from 'next/link';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Privacy Policy',
  description: 'What RollOS collects from haulers and from their customers, and why.',
};

export default function PrivacyPage() {
  return (
    <main className="terms-page">
      <div style={{ background: '#23392b', padding: '20px 0', borderRadius: 10 }}>
        <Brand />
      </div>
      <h1>Privacy policy</h1>
      <p>
        This policy covers the RollOS software. It is not the rental terms between a hauler and
        their customer. Those live on the booking flow.
      </p>
      <h2>What we collect</h2>
      <p>
        From a hauler: account email, company name, pricing, service ZIP codes, and billing details
        if you subscribe. From a customer booking: name, phone, email, delivery address, selected
        container, dates, signature, and the IP address recorded with that signature. Drivers upload
        delivery photos. Staff enter the scale weight.
      </p>
      <h2>Why</h2>
      <p>
        To run the booking, dispatch the job, send the driver link, and produce the invoice. Payment
        card data is handled by Stripe. SMS is sent through Twilio when that integration is
        configured. Email, when configured, is sent through Resend.
      </p>
      <h2>Who else sees it</h2>
      <p>
        The hauler’s own staff see their workspace. RollOS processors are Supabase for the database
        and auth, Stripe for payments, Twilio for SMS, and Resend for email. We do not sell booking
        data.
      </p>
      <h2>Contact</h2>
      <p>
        Privacy requests go to the operator of rolloffdumpstersoftware.com. This policy should be
        reviewed by counsel before the site takes live payments.
      </p>
      <Link href="/" className="btn">
        Back to RollOS
      </Link>
    </main>
  );
}
