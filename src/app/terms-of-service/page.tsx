import Link from 'next/link';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Terms of Service',
  description: 'The software subscription terms between RollOS and a hauler.',
};

export default function SaasTerms() {
  return (
    <main className="terms-page">
      <div style={{ background: '#23392b', padding: '20px 0', borderRadius: 10 }}>
        <Brand />
      </div>
      <h1>Terms of service</h1>
      <p>
        These terms cover use of the RollOS software. They are not the dumpster rental contract
        between a hauler and their customer. That document is separate.
      </p>
      <h2>Plans</h2>
      <p>
        Free is $0 a month and includes an $11.95 customer reservation fee on online bookings.
        Starter is $29 a month. Growth is $149 a month. Paid plans can turn the customer fee off.
        Stripe processing fees are charged by Stripe, not included in these prices. There is no
        annual contract.
      </p>
      <h2>What the software does</h2>
      <p>
        RollOS provides a booking link, a dispatch board, driver links, photo proof, and an invoice
        calculated from the rate locked at booking. It does not provide scale-ticket OCR, live GPS,
        or route optimization. Test mode does not move live money.
      </p>
      <h2>Your data</h2>
      <p>
        You own your customer and job records. You are responsible for the rental terms you present
        to your customers and for configuring lawful prices, taxes, and service areas.
      </p>
      <p>
        These terms are a starter. Have them reviewed before you accept a paying subscriber.
      </p>
      <Link href="/" className="btn">
        Back to RollOS
      </Link>
    </main>
  );
}
