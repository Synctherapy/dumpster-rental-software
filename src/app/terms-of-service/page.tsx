import Link from 'next/link';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Terms of Service | RollOS Dumpster Rental Software',
  description: 'SaaS Subscription Terms of Service between RollOS and roll-off dumpster hauling operators.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/terms-of-service',
  },
};

export default function SaasTerms() {
  return (
    <main className="terms-page">
      <div style={{ background: '#23392b', padding: '20px 0', borderRadius: 10 }}>
        <Brand />
      </div>

      <h1>Software Subscription Terms of Service</h1>
      <p>
        These Software Subscription Terms of Service (&ldquo;Agreement&rdquo;) constitute a legally binding agreement
        between <strong>Daryl Stubbs</strong> (&ldquo;Company&rdquo;, &ldquo;Provider&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;,
        or &ldquo;our&rdquo;), doing business as <strong>Sync Therapy</strong> and <strong>RollOS</strong> (&ldquo;RollOS&rdquo;, &ldquo;rolloffdumpstersoftware.com&rdquo;),
        and the independent roll-off dumpster hauling business, contractor, or operator (&ldquo;Subscriber&rdquo;, &ldquo;Hauler&rdquo;,
        or &ldquo;you&rdquo;) subscribing to or accessing the RollOS cloud platform, booking widget, and dispatch software.
      </p>

      <h2>1. The RollOS Platform & Services</h2>
      <p>
        RollOS provides specialized cloud infrastructure designed for independent dumpster rental operators, including
        embeddable self-service customer booking widgets, real-time service ZIP validation, digital rental agreements with
        e-signatures, visual drag-and-drop dispatch boards, mobile driver route links with photo proof of delivery/pickup,
        and automated invoice calculation.
      </p>

      <h2>2. Subscription Tiers, Billing & Renewals</h2>
      <p>
        RollOS is offered on flexible month-to-month subscription plans designed to grow with your fleet:
      </p>
      <ul style={{ margin: '10px 0 16px 24px', lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746' }}>
        <li>
          <strong>Free Tier ($0/month):</strong> Provides online customer self-service booking, shareable Google/social links,
          and core dispatch features. A nominal $12 reservation technology fee is paid directly by the end-customer during online checkout.
        </li>
        <li>
          <strong>Starter Tier ($29/month):</strong> Unlocks unlimited manual dispatch for offline phone and contractor orders,
          ability to disable the customer reservation fee ($0 platform fee), two-way Google Calendar sync, and contractor custom rate sheets.
        </li>
        <li>
          <strong>Growth Tier ($99/month):</strong> Unlocks automated customer delivery/pickup SMS notifications, Google 5-Star
          review booster, custom branding, multi-yard management, and priority phone support.
        </li>
      </ul>
      <p>
        Paid subscriptions are billed in advance on a recurring monthly basis to your payment method on file via Stripe.
        There are no long-term contracts, annual commitments, or early termination penalties.
      </p>

      <h2>3. Stripe Connect & Customer Payouts</h2>
      <p>
        To accept online card deposits and rental payments, Subscriber links an authorized Stripe Connect account.
        All customer rental proceeds (less standard Stripe merchant processing fees) deposit directly into Subscriber&rsquo;s
        verified business bank account on rolling payout schedules managed by Stripe.
      </p>
      <p>
        RollOS does not hold customer funds or escrow rental payments. Subscriber is solely responsible for setting customer
        pricing, taxes, delivery fees, overage rates, and handling any customer chargebacks, refunds, or payment disputes.
      </p>

      <h2>4. Platform Uptime & Service Availability</h2>
      <p>
        RollOS utilizes enterprise-grade cloud architecture, serverless APIs, and global CDN caching with a target of
        99.9% application uptime. We continuously monitor platform health, booking widget availability, and dispatch sync.
      </p>
      <p>
        Planned maintenance and platform improvements are conducted during off-peak overnight hours with advance notice
        posted on the operator dashboard. RollOS is not liable for disruptions caused by third-party upstream infrastructure,
        including telecommunications carriers, SMS networks, or Stripe gateway outages.
      </p>

      <h2>5. Data Ownership, Security & Privacy</h2>
      <p>
        <strong>You own your data.</strong> Subscriber retains complete, exclusive ownership of all customer records,
        booking histories, dispatch routes, pricing rules, container serial records, and driver logs entered into RollOS (&ldquo;Subscriber Data&rdquo;).
      </p>
      <p>
        RollOS will never sell, lease, disclose, or market Subscriber Data to third parties, brokers, lead-generation aggregators,
        or competing waste haulers. We maintain strict industry-standard AES-256 encryption at rest, TLS 1.3 in transit, and role-based
        access controls to safeguard your company&rsquo;s operational data.
      </p>

      <h2>6. Subscriber Responsibilities & Compliance</h2>
      <p>
        Subscriber warrants that it holds all required state, provincial, and local business licenses, commercial vehicle permits,
        environmental waste transport registrations, and liability insurance policies necessary to operate a dumpster hauling business.
        Subscriber agrees not to use the platform for unlawful, fraudulent, or deceptive practices, or to transmit unsolicited
        promotional SMS messages in violation of TCPA or CTIA messaging guidelines.
      </p>

      <h2>7. SMS Messaging Terms & Carrier Compliance</h2>
      <p>
        RollOS includes automated SMS functionality allowing Subscribers to send real-time operational notifications to their customers
        and drivers. By enabling or using the SMS features, Subscriber and end users agree to the following terms:
      </p>
      <ul style={{ margin: '10px 0 16px 24px', lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746' }}>
        <li><strong>Program Description:</strong> Operational and transactional alerts including booking confirmations, dispatch updates, driver tracking links, delivery/pickup receipts, invoice reminders, and customer service textbacks.</li>
        <li><strong>Opt-In Consent:</strong> End users consent to receive SMS notifications by submitting their phone number through online booking widgets, quote requests, or phone orders.</li>
        <li><strong>Opt-Out:</strong> Users may opt out at any time by replying <strong>STOP</strong> to any message. A single confirmation text will be sent verifying the opt-out.</li>
        <li><strong>Help & Support:</strong> For assistance, users may reply <strong>HELP</strong> to any message or contact support at <a href="mailto:support@rolloffdumpstersoftware.com" style={{ color: '#22c55e', textDecoration: 'underline' }}>support@rolloffdumpstersoftware.com</a> or +1 (250) 812-8698.</li>
        <li><strong>Rates & Frequency:</strong> Message frequency varies based on transaction and rental activity. Message and data rates may apply. Carriers are not liable for delayed or undelivered messages.</li>
      </ul>

      <h2>8. Cancellation, Downgrades & Account Closure</h2>
      <p>
        Subscriber may cancel or downgrade their subscription at any time directly through the RollOS Settings portal.
        Upon cancellation, paid subscription features remain fully active through the conclusion of the current billing cycle.
        Subscriber may request a full export of their customer lists and job archives prior to account termination.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, RollOS provides the software on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
        basis. In no event shall Sync Therapy, RollOS, its founders, directors, or employees be liable for indirect, punitive, incidental,
        or consequential damages, including loss of business profits, vehicle downtime, or customer claims. Provider&rsquo;s
        maximum aggregate liability under this Agreement is strictly limited to the subscription fees paid by Subscriber in the
        three (3) months preceding the incident.
      </p>

      <h2>10. Questions & Support</h2>
      <p>
        If you have questions regarding these Subscription Terms or need assistance with your RollOS account, contact:
      </p>
      <div style={{ lineHeight: 1.8, fontSize: '13.5px', color: '#4d5746', margin: '12px 0 24px' }}>
        <strong>Daryl Stubbs (DBA Sync Therapy / RollOS)</strong><br />
        132, 328 Wale Rd, Colwood, BC V9B 1J2, Canada<br />
        Email: <a href="mailto:darylstubbs11@gmail.com" style={{ color: '#22c55e', textDecoration: 'underline' }}>darylstubbs11@gmail.com</a> / <a href="mailto:support@rolloffdumpstersoftware.com" style={{ color: '#22c55e', textDecoration: 'underline' }}>support@rolloffdumpstersoftware.com</a><br />
        Phone: +1 (250) 812-8698
      </div>

      <Link href="/" className="btn">
        Return to RollOS Dumpster Rental Software
      </Link>
    </main>
  );
}
