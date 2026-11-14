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
      <p style={{ fontSize: '13px', color: '#687864', marginBottom: '16px' }}>
        <strong>Effective Date:</strong> November 14, 2026 · Operated by Daryl Stubbs, British Columbia, Canada
      </p>
      <p>
        This Privacy Policy explains how <strong>RollOS</strong> (&ldquo;Company&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;, operated by Daryl Stubbs, British Columbia, Canada)
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

      <h2>4. Third-Party Sub-Processors</h2>
      <p>
        We do not sell, rent, or trade your personal information. Data is shared strictly with trusted third-party sub-processors necessary
        to provide our cloud infrastructure and core platform functionality:
      </p>
      <ul style={{ margin: '10px 0 16px 24px', lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746' }}>
        <li><strong>Stripe:</strong> Payment processing, merchant identity verification, tokenized credit card authorization, and automated hauler payouts via Stripe Connect.</li>
        <li><strong>Twilio:</strong> Telecommunications carrier infrastructure for transactional SMS dispatch, driver route updates, delivery receipts, and missed-call support textbacks.</li>
        <li><strong>Supabase:</strong> Cloud-hosted encrypted relational database (AES-256 at rest) and secure user authentication services.</li>
        <li><strong>Resend:</strong> Transactional email delivery service for booking confirmations, rental agreements, e-signature receipts, and invoices.</li>
      </ul>

      <h2>5. Consent Management & Data Rights</h2>
      <p>
        RollOS respects customer privacy choices and enforces strict consent management protocols:
      </p>
      <ul style={{ margin: '10px 0 16px 24px', lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746' }}>
        <li><strong>Collection of Consent:</strong> Consent for operational communications and agreement terms is recorded at checkout with timestamp, IP address, and electronic signature data.</li>
        <li><strong>Separation of Purpose:</strong> Mobile phone numbers provided for delivery coordination and dispatch are never co-mingled with or used for third-party marketing lists.</li>
        <li><strong>Revocation of Consent:</strong> Users may withdraw messaging consent at any time by replying STOP to any SMS, or by contacting our privacy team to request deletion or export of personal records.</li>
        <li><strong>Data Retention:</strong> Order and scale ticket documentation is retained only as long as necessary for tax compliance, accounting audits, and chargeback dispute resolution.</li>
      </ul>

      <h2>6. Business Contact & Inquiries</h2>
      <p>
        For questions or requests regarding this Privacy Policy or your personal data, please contact:
      </p>
      <div style={{ lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746', margin: '12px 0 24px' }}>
        <strong>RollOS Privacy & Compliance</strong><br />
        Operated by Daryl Stubbs<br />
        British Columbia, Canada<br />
        Email: <a href="mailto:support@rolloffdumpstersoftware.com" style={{ color: '#22c55e', textDecoration: 'underline' }}>support@rolloffdumpstersoftware.com</a>
      </div>

      <Link href="/" className="btn">
        Return to RollOS Dumpster Rental Software
      </Link>
    </main>
  );
}
