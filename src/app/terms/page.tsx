import Link from 'next/link';
import { Brand } from '@/components/brand';
export default function Terms() {
  return (
    <main className="terms-page">
      <div style={{ background: '#23392b', padding: '20px 0', borderRadius: 10 }}>
        <Brand />
      </div>
      <h1>Rental terms</h1>
      <p>
        This test application provides the following standard booking terms. Your hauler must review
        these terms and adapt them to local requirements before accepting real rentals.
      </p>
      <h2>Your rental</h2>
      <p>
        Your booking specifies the dumpster size, delivery and pickup dates, included tonnage, and
        rental price. Provide an accessible, level placement area and obtain any necessary permits.
        Do not place hazardous waste, liquids, batteries, tires, or prohibited materials in the
        dumpster. Your hauler can confirm permitted debris.
      </p>
      <h2>Deposits and final charges</h2>
      <p>
        Your deposit is applied to the final invoice. Extra rental days are charged at the rate
        displayed during booking. Disposal over the included tonnage is charged at the displayed
        per-ton rate using measured actual tonnage. By signing, you authorize the deposit and
        remaining balance after pickup. Rates agreed at booking are retained for your invoice.
      </p>
      <h2>Changes and cancellations</h2>
      <p>
        Contact your hauler directly to change dates, cancel a booking, discuss placement, or
        resolve a charge. Any additional cancellation policy must be supplied by your hauler before
        a production launch.
      </p>
      <h2>Service messages and signature</h2>
      <p>
        Your contact information is used for rental updates. Your typed signature, acceptance time,
        and originating IP address are retained with your booking. Driver access links expire and
        should not be shared.
      </p>
      <Link href="/" className="btn">
        Back to RollOS
      </Link>
    </main>
  );
}
