import Link from 'next/link';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Privacy Policy',
  description: 'What RollOS collects from haulers and from their customers, and why.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="terms-page">
      <div style={{ background: '#23392b', padding: '20px 0', borderRadius: 10 }}>
        <Brand />
      </div>
      <h1>Privacy Policy</h1>
      <p>
        This Privacy Policy explains how <strong>Daryl Stubbs</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;), doing business as <strong>Sync Therapy</strong> and <strong>RollOS</strong> (&ldquo;RollOS&rdquo;),
        collects, uses, and safeguards information when you visit or use <strong>rolloffdumpstersoftware.com</strong>
        (and <strong>dumpster-rental-software.vercel.app</strong>), our dumpster rental management platform, booking widgets,
        and customer communication services.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        <strong>From Dumpster Haulers & Subscribers:</strong> Account name, business email, business legal and operating names,
        business telephone number, service area ZIP/postal codes, equipment fleet details, pricing rate sheets, and billing information
        processed securely via Stripe.
      </p>
      <p>
        <strong>From Customers & Renters:</strong> Full name, delivery street address, email address, mobile phone number,
        rental dates, container size requested, electronic signatures on rental agreements, timestamp, IP address, and photos
        uploaded by drivers confirming drop-off or pickup placement.
      </p>

      <h2>2. How We Use Information</h2>
      <p>
        We use the collected information solely to provide, operate, and maintain the RollOS software services, including
        processing customer reservations, generating digital rental contracts, calculating tonnage invoices, dispatching drivers,
        and facilitating real-time customer support.
      </p>

      <h2>3. Mobile Terms & SMS Messaging Privacy (Carrier Compliance)</h2>
      <p>
        RollOS provides automated and conversational SMS messaging capabilities for dumpster rental operators to communicate
        transactional and service updates to their customers (such as delivery notifications, driver tracking links, dispatch updates,
        invoice reminders, and missed-call customer support follow-ups).
      </p>
      <div style={{ background: '#f4fbf5', borderLeft: '4px solid #22c55e', padding: '16px 20px', margin: '20px 0', borderRadius: '4px', color: '#1a3826' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. All the above
          categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.
        </p>
      </div>
      <p>
        <strong>Opt-In:</strong> Customers opt in to receive transactional SMS messages by providing their mobile phone number
        during the online booking process, quote submission, or when placing a service call.
      </p>
      <p>
        <strong>Opt-Out & Assistance:</strong> You may cancel the SMS service at any time by replying <strong>STOP</strong> to any
        text message you receive. After sending &ldquo;STOP&rdquo;, you will receive a confirmation message that you have been unsubscribed.
        For assistance or inquiries regarding text messages, reply <strong>HELP</strong> or contact our support team.
      </p>
      <p>
        <strong>Rates & Frequency:</strong> Message frequency varies based on your active dumpster rental status and order transactions.
        Message and data rates may apply depending on your mobile carrier and service plan. Supported carriers are not liable for delayed or undelivered messages.
      </p>

      <h2>4. Third-Party Service Providers</h2>
      <p>
        We do not sell, rent, or trade your personal information. Data is shared strictly with trusted sub-processors necessary
        to provide the cloud infrastructure:
      </p>
      <ul style={{ margin: '10px 0 16px 24px', lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746' }}>
        <li><strong>Stripe:</strong> Payment processing and merchant identity verification.</li>
        <li><strong>Twilio:</strong> Telecom infrastructure for operational SMS notifications and voice dispatch.</li>
        <li><strong>Supabase:</strong> Encrypted relational database and authentication services.</li>
        <li><strong>Resend:</strong> Transactional order confirmation emails and receipts.</li>
      </ul>

      <h2>5. Business Contact & Inquiries</h2>
      <p>
        For questions or requests regarding this Privacy Policy or your personal data, please contact:
      </p>
      <div style={{ lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746', margin: '12px 0 24px' }}>
        <strong>Daryl Stubbs (DBA Sync Therapy / RollOS)</strong><br />
        Attention: Privacy & Compliance Officer<br />
        132, 328 Wale Rd, Colwood, BC V9B 1J2, Canada<br />
        Email: <a href="mailto:darylstubbs11@gmail.com" style={{ color: '#22c55e', textDecoration: 'underline' }}>darylstubbs11@gmail.com</a> / <a href="mailto:support@rolloffdumpstersoftware.com" style={{ color: '#22c55e', textDecoration: 'underline' }}>support@rolloffdumpstersoftware.com</a><br />
        Telephone: +1 (250) 812-8698
      </div>

      <Link href="/" className="btn">
        Return to RollOS Dumpster Rental Software
      </Link>
    </main>
  );
}
