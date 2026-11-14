import Link from 'next/link';
import { ArrowRight, Check, X, DollarSign, Smartphone } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { SavingsCalculator } from '@/components/savings-calculator';
import { VsVisualComparison } from '@/components/vs-visual-comparison';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'iCans Dumpster Software: 2026 Pricing, Demo & Top Alternative',
  description:
    'Compare iCans dumpster software ($99-$159/mo) vs RollOS ($0/mo Free Plan). See how small haulers get unlimited orders, SMS routing, and card processing.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/vs/icans',
  },
};

export default function ICansComparisonPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://rolloffdumpstersoftware.com/vs/icans#webpage',
        url: 'https://rolloffdumpstersoftware.com/vs/icans',
        name: 'iCans Dumpster Software: Pricing, Features, and Best Alternatives',
        description:
          'Compare iCans dumpster software ($99-$159/mo) vs RollOS ($0/mo Free Plan). See how small haulers get unlimited orders, SMS routing, and card processing.',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://rolloffdumpstersoftware.com/vs/icans#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much does iCans cost compared to RollOS?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'iCans charges $99/month for Base (email customer notifications) and $159/month for Plus (customer SMS alerts up to 1,000/month; driver app included on both plans). RollOS offers a permanent $0/month Free Plan with unlimited orders, SMS routing, and zero setup fee.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need to schedule a sales demo to test RollOS?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Unlike enterprise systems that gate access behind sales calls, you can test the interactive live demo right on the RollOS homepage and launch your dispatch board in 3 minutes.',
            },
          },
          {
            '@type': 'Question',
            name: 'What payment processor does iCans require?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'iCans integrates with Tiger and Deluxe payment gateways for card processing, whereas RollOS uses direct Stripe Connect and Apple Pay alongside $0-fee offline cash/check logging.',
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/vs" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <SemanticBreadcrumb
          items={[
            { name: 'Home', item: '/' },
            { name: 'Comparisons', item: '/vs' },
            { name: 'RollOS vs iCans', item: '/vs/icans' },
          ]}
        />

        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          IN-DEPTH SOFTWARE REVIEW & COMPARISON · 2026 EDITION
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-6">
          iCans Dumpster Software: Pricing, Features, and Best Alternatives
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          <strong>iCans dumpster software</strong> offers flat-rate roll-off dispatching founded by Ricardo Rivera (owner of Junk It Plus Dumpsters in Florida), but gating customer SMS notifications behind their $159/month Plus plan leads operators to compare modern{' '}
          <Link
            href="/"
            className="text-[#1f2d26] font-semibold underline decoration-[#ea580c] underline-offset-2 hover:text-[#ea580c]"
          >
            dumpster rental software
          </Link>{' '}
          alternatives like RollOS. While iCans provides single-screen dispatching, an AI operational assistant (&quot;The New Guy&quot;), and separate AI routing, growing roll-off haulers managing 1 to 25+ trucks often prefer RollOS for instant driver SMS magic links and automated landfill scale ticket billing.
        </p>

        {/* Executive Overview: RollOS vs. iCans */}
        <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
          Executive Overview: RollOS vs. iCans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white border-2 border-[#ea580c] rounded-2xl shadow-sm relative">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
              ALL-IN-ONE PLATFORM
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">RollOS</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Built for 1 to 25+ truck roll-off hauler fleets. Transparent <strong>dumpster rental software cost</strong> with a <strong>$0/month Free Plan</strong> ($12 customer checkout fee, 0% hauler commission, unlimited orders, zero setup fee), Starter at $29/mo, or Growth at $99/mo. Includes instant 1-tap SMS driver links (zero App Store friction), a self-serve customer portal, direct Stripe card processing, and automated landfill tipping fee and scale ticket overage invoicing.
            </p>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Free Plan ($0/mo) · Starter ($29/mo) · Growth ($99/mo)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Unlimited orders & zero setup fee
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Instant 1-tap SMS driver links (zero App Store install)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Automated landfill tipping fee & scale ticket invoicing
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-3">
              TIERED DISPATCH SOFTWARE
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">iCans</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Founded by Ricardo Rivera based on his experience running Junk It Plus Dumpsters in Florida. Features single-screen dispatch, an AI operational assistant (&quot;The New Guy&quot;), and separate AI routing. Base plan ($99/mo) uses email notifications; customer SMS notifications (up to 1,000/mo) require upgrading to the $159/mo Plus plan. Drivers use an iOS/Android app on both plans.
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> $99/mo (Base) to $159/mo (Plus)
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Customer SMS notifications gated to $159/mo tier (up to 1,000/mo)
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Drivers must download mobile app from Apple App Store / Google Play
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Payment processing via Tiger or Deluxe gateways
              </li>
            </ul>
          </div>
        </div>

        {/* Visual Interface & Workflow Comparison */}
        <VsVisualComparison
          competitorName="iCans"
          competitorTagline="Founded by Ricardo Rivera (Junk It Plus Dumpsters) to provide single-screen dispatching and an AI operational assistant, but customer SMS notifications require their $159/mo Plus tier and drivers must use native mobile apps."
          competitorScreenshot="/images/competitors/icans-preview.png"
          competitorScreenshotAlt="iCans dumpster software website homepage and dispatch software preview"
          competitorBulletPoints={[
            "$99/mo (Base) to $159/mo (Plus) tiered software cost",
            "Customer SMS notifications gated to $159/mo tier (Base is email-only)",
            "Drivers must download native app on Apple App Store & Google Play",
            "Card processing via Tiger and Deluxe payment gateways",
          ]}
          rollosTagline="Modern web-based dumpster dispatch and 24/7 online booking engine built specifically for independent haulers operating 1 to 25+ trucks. Free forever tier with zero setup fee."
          rollosScreenshot="/images/screenshots/roll-off-dumpster-dispatch-board-software.png"
          rollosScreenshotAlt="RollOS roll-off dumpster dispatch board software showing visual status columns and driver assignment"
          rollosBulletPoints={[
            "Permanent $0/mo Free Plan ($12 checkout fee paid by customer, 0% commission)",
            "Instant 1-tap SMS driver links — zero App Store installs",
            "Direct Stripe Connect integration with instant payouts & Apple Pay",
            "Automated landfill scale ticket overage billing",
          ]}
          infographicSrc="/images/infographics/rollos-vs-icans-sms-dispatch-workflow.jpg"
          infographicAlt="Roll-off dumpster software dispatch workflow comparison: app store downloads vs RollOS 1-tap SMS magic link"
          infographicBadge="SMS DISPATCH & FIELD WORKFLOW BREAKDOWN"
          infographicTitle="Zero-Friction 1-Tap Driver SMS Dispatch vs. Native Driver App Downloads"
          infographicDescription="See why modern roll-off dumpster haulers eliminate native driver app downloads and avoid $159/mo customer messaging paywalls by dispatching drivers via instant mobile web links."
          infographicCaption="Figure 1: Comparison of roll-off dumpster dispatch workflows. iCans requires driver app downloads on both plans and gates customer SMS alerts behind its $159/mo Plus plan, while RollOS includes instant 1-tap SMS driver magic links on all tiers including the $0/mo Free Plan."
          infographicCtaHeadline="Ready to eliminate driver app friction and save on customer SMS dispatch?"
        />

        {/* Interactive Savings Calculator */}
        <div className="my-12">
          <SavingsCalculator showTitle={true} />
        </div>

        {/* Section 1: Features */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            iCans Dumpster Software Overview & Features
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            When examining <strong>iCans dumpster software</strong>, roll-off operators find a focused set of systems built to replace dry-erase boards and generic field service apps like Jobber or Housecall Pro. The core platform centers around an interactive dispatch calendar, box tracker, and inventory tracking for 10-yard, 20-yard, 30-yard, and 40-yard dumpsters:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">Single-Screen Dispatch & Service Area Control</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Visual scheduling grid for drop-offs, pickup jobs, and swaps across your service area.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">AI Operational Assistant (&quot;The New Guy&quot;) &amp; Routing</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                iCans features &quot;The New Guy,&quot; a proprietary AI operational assistant to help run software tasks, alongside separate AI route optimization for daily stops.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">Asset Tracking & Container Tracking</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Built-in asset tracking, container tracking, and inventory tools monitor every container in your yard and on job sites.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">QuickBooks Online Accounting Sync</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Synchronizes customer accounts, invoices, and completed work orders directly with QuickBooks Online so every office user saves bookkeeping time.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing Table */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            iCans Pricing, Tier Upgrades, and Hidden Fees
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            Evaluating the true <strong>dumpster rental software cost</strong> requires looking past the baseline $99/month subscription:
          </p>
          <div className="overflow-x-auto rounded-xl border border-[#dde4d4]">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Feature / Operational Capability</th>
                  <th className="highlight-col text-[#1d2527]" style={{ width: '35%' }}>
                    RollOS
                  </th>
                  <th style={{ width: '30%' }}>iCans</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Monthly Software Cost</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $0 (Free) · $29 (Starter) · $99 (Growth)
                  </td>
                  <td className="text-[#b54848] font-semibold">$99/mo (Base) · $159/mo (Plus)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Setup Fee & Onboarding</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">$0 (Self-serve live demo & setup in 3 min)</td>
                  <td className="text-[#2e7d32] font-bold">$0 setup fee</td>
                </tr>
                <tr>
                  <td className="font-semibold">Order Volume Limits</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">Unlimited orders on all plans</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td className="font-semibold">Customer SMS Text Alerts</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">Driver SMS on all plans; customer notifications</td>
                  <td className="text-[#b54848] font-semibold">Gated to $159/mo Plus plan (up to 1,000/mo)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Mobile Experience</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">1-Tap SMS Magic Links (0 App Store install)</td>
                  <td>iOS / Android driver app (included on both plans)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Card Processing Gateway</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">Direct Stripe Connect & Apple Pay</td>
                  <td>Tiger and Deluxe payment gateways</td>
                </tr>
                <tr>
                  <td className="font-semibold">Landfill Tipping Fee & Scale Capture</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">1-Tap driver photo & auto tonnage overage bill</td>
                  <td>Manual weight ticket entry</td>
                </tr>
                <tr>
                  <td className="font-semibold">Online Ordering & Customer Portal</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">Included (60s live checkout widget)</td>
                  <td>Website integration included</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Limitations */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-[#ea580c]" size={24} />
            <h2 className="text-xl font-bold text-[#1f2d26]">
              Common iCans Considerations for Roll-Off Haulers
            </h2>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            While iCans is an upgrade over pen and paper or general contractor tools like Jobber and Housecall Pro, small haulers running 1 to 25+ trucks note a few trade-offs:
          </p>
          <ul className="space-y-3 text-sm text-[#475569] mb-4">
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>The $159/Mo Customer SMS Gate:</strong> Customer text notifications are vital for ETA updates and delivery gate codes. With iCans, the $99/mo Base plan only sends customer email notifications; unlocking customer SMS alerts requires upgrading to the $159/mo Plus plan (capped at 1,000 texts/mo).</span>
            </li>
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>Payment Gateway Compatibility:</strong> iCans connects to Tiger and Deluxe payment gateways for merchant card processing, whereas RollOS connects directly with Stripe Connect with Apple Pay and instant payouts.</span>
            </li>
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>Native Driver App Downloads:</strong> iCans requires drivers on both plans to download its app from the App Store or Google Play, whereas RollOS uses instant SMS browser links with zero downloads or logins.</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Alternatives */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="text-[#ea580c]" size={24} />
            <h2 className="text-xl font-bold text-[#1f2d26]">
              Leading iCans Alternatives for Growing Roll-Off Haulers
            </h2>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            When comparing iCans against <Link href="/vs/bin-boss" className="text-[#ea580c] font-semibold hover:underline">Bin Boss software</Link>, <Link href="/vs/docket" className="text-[#ea580c] font-semibold hover:underline">Docket software</Link>, or <Link href="/vs/dumpster-rental-systems" className="text-[#ea580c] font-semibold hover:underline">Dumpster Rental Systems (DRS)</Link>, operators prioritize low overhead and zero driver friction:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#f8faf6] rounded-xl text-xs mb-4">
            <div className="p-4 bg-white border border-[#e2ebd8] rounded-lg">
              <strong className="text-[#1f2d26] text-sm block mb-1">With iCans, Bin Boss, or Docket:</strong>
              <p className="text-[#64748b] leading-relaxed">
                Pay recurring monthly subscriptions ($99 to $159/mo on iCans), deal with native App Store driver setups, and manually invoice landfill scale ticket overages.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#cbe1b8] rounded-lg">
              <strong className="text-[#2e7d32] text-sm block mb-1">With RollOS ($0 Free / $29 Starter):</strong>
              <p className="text-[#47603c] leading-relaxed">
                Zero software overhead on the Free tier ($12 checkout fee paid by the customer). Drivers use instant 1-tap SMS web links. Landfill scale tickets calculate tipping fee and tonnage overages automatically to the credit card on file.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Verdict */}
        <div className="p-8 bg-[#1f2621] text-white rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4">The Verdict: When to Choose RollOS vs. iCans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#cbd5cc] leading-relaxed">
            <div>
              <strong className="text-white text-base block mb-2">Choose iCans if:</strong>
              <ul className="space-y-2 list-disc pl-4">
                <li>You prefer their &quot;The New Guy&quot; AI operational assistant alongside separate AI routing.</li>
                <li>You use or prefer Tiger or Deluxe payment gateways for credit card processing.</li>
                <li>You don&apos;t mind paying $159/month for the Plus plan to send automated customer SMS notifications.</li>
              </ul>
            </div>
            <div>
              <strong className="text-[#ea580c] text-base block mb-2">Choose RollOS if:</strong>
              <ul className="space-y-2 list-disc pl-4 text-white">
                <li>You manage a 1 to 25+ truck fleet.</li>
                <li>You want an all in one platform where driver dispatch works instantly via SMS web links without App Store installs.</li>
                <li>You need automated landfill scale ticket photo capture with instant overage billing.</li>
                <li>You want 24/7 online ordering starting at zero monthly software cost.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 6: FAQs */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-6">
            Frequently Asked Questions: iCans Dumpster Software
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                How much does iCans cost compared to RollOS?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                iCans charges $99/month for Base (email customer notifications) and $159/month for Plus (customer SMS alerts up to 1,000/mo; driver mobile app is included on both plans). RollOS offers a permanent $0/month Free Plan with unlimited orders, SMS routing, and zero setup fee.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                Do I need to schedule a sales demo to test RollOS?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                No. Unlike enterprise systems that gate access behind sales calls, you can test the interactive live demo right on the RollOS homepage and launch your dispatch board in 3 minutes.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                What payment processor does iCans require?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                iCans integrates with Tiger and Deluxe payment gateways for card processing, whereas RollOS uses direct Stripe Connect and Apple Pay alongside $0-fee offline cash/check logging.
              </p>
            </div>
          </div>
        </div>

        {/* Spoke-to-Spoke Comparison Silo */}
        <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl mb-8 shadow-sm">
          <h2 className="text-base font-bold text-[#1f2d26] mb-3">
            Compare Other Roll-Off Dumpster Rental Software Alternatives
          </h2>
          <p className="text-xs text-[#556658] mb-4 leading-relaxed">
            Evaluating multiple platforms? Explore our side-by-side operational reviews against other major waste and dumpster software providers:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <Link
              href="/vs/docket"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. Docket</span>
              <ArrowRight size={13} className="text-[#ea580c] shrink-0" />
            </Link>
            <Link
              href="/vs/bin-boss"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. Bin Boss</span>
              <ArrowRight size={13} className="text-[#ea580c] shrink-0" />
            </Link>
            <Link
              href="/vs/curbwaste"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. CurbWaste</span>
              <ArrowRight size={13} className="text-[#ea580c] shrink-0" />
            </Link>
            <Link
              href="/vs/trash-flow"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. Trash Flow</span>
              <ArrowRight size={13} className="text-[#ea580c] shrink-0" />
            </Link>
          </div>
        </div>

        {/* Reverse Silo Link to Home */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-8">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            EXPERIENCE THE ROLLOS DIFFERENCE
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Ready to test RollOS alongside your current dispatch system?
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Test the live dispatch board, driver SMS links, and 24/7 online booking engine today. No credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn btn-orange">
              Explore Roll Off Dumpster Software <ArrowRight size={14} />
            </Link>
            <Link href="/signup" className="btn btn-secondary">
              Start Free Demo
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
