import Link from 'next/link';
import { ArrowRight, Check, X, DollarSign, Smartphone } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { SavingsCalculator } from '@/components/savings-calculator';
import { VsVisualComparison } from '@/components/vs-visual-comparison';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'iCans Dumpster Software: 2026 Pricing, Demo & Top Alternatives | RollOS',
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
              text: 'iCans charges $99/month for Base (email-only alerts) and $159/month for Plus (SMS alerts). RollOS offers a permanent $0/month Free Plan with unlimited orders, SMS routing, and zero setup fee.',
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
              text: 'iCans integrates with Tiger Payment Solutions for card processing, whereas RollOS uses direct Stripe Connect and Apple Pay alongside $0-fee offline cash/check logging.',
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
          <strong>iCans dumpster software</strong> offers flat-rate roll-off dispatching built by the founders of American AF Dumpsters, but tier-gated SMS alerts and Tiger Payment Solutions gateway lock-in push operators toward modern{' '}
          <Link
            href="/"
            className="text-[#1f2d26] font-semibold underline decoration-[#ea580c] underline-offset-2 hover:text-[#ea580c]"
          >
            dumpster rental software
          </Link>{' '}
          alternatives like RollOS. While iCans provides single-screen dispatching and AI-assisted route optimization, a growing <strong>dumpster rental business</strong> or <strong>dumpster company</strong> managing 1 to 25+ trucks faces upgrade friction when scaling driver communication, card processing, and online ordering.
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
              Developed from the operational playbook of American AF Dumpsters (featured in Waste Dive) to replace expensive custom software. Features single-screen dispatch and AI routing (&quot;The New Guy&quot;), but gates automated SMS messaging behind their $159/month Plus plan and routes credit card processing through Tiger Payment Solutions.
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> $99/mo (Base) to $159/mo (Plus)
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Automated SMS alerts gated to $159/mo tier
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Native driver app App Store download required
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Tiger Payment Solutions processing lock-in
              </li>
            </ul>
          </div>
        </div>

        {/* Visual Interface & Workflow Comparison */}
        <VsVisualComparison
          competitorName="iCans"
          competitorTagline="Founded by American AF Dumpsters to provide single-screen dispatching and route optimization, but gates automated SMS texting behind their $159/mo Plus tier and routes payments through Tiger Payment Solutions."
          competitorScreenshot="/images/competitors/icans-preview.png"
          competitorScreenshotAlt="iCans dumpster software website homepage and dispatch software preview"
          competitorBulletPoints={[
            "$99/mo (Base) to $159/mo (Plus) tiered software cost",
            "Automated customer & driver SMS gated to $159/mo tier",
            "Requires driver app download from Apple / Google Play",
            "Tiger Payment Solutions gateway lock-in",
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
          infographicAlt="Roll-off dumpster software dispatch workflow comparison: legacy paywalled SMS vs RollOS 1-tap SMS magic link"
          infographicBadge="SMS DISPATCH & FIELD WORKFLOW BREAKDOWN"
          infographicTitle="Zero-Friction 1-Tap Driver SMS Dispatch vs. Paywalled Notifications"
          infographicDescription="See why modern roll-off dumpster haulers eliminate native driver app downloads and avoid $159/mo SMS paywalls by dispatching drivers via instant mobile web links."
          infographicCaption="Figure 1: Comparison of roll-off dumpster dispatch workflows. Legacy platforms gate automated SMS notifications behind $159/mo tiers and force drivers through app store logins, while RollOS includes instant 1-tap SMS magic links on all tiers including the $0/mo Free Plan."
          infographicCtaHeadline="Ready to stop paying $159/mo just to text your drivers?"
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
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">AI Route Optimization Assistant</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                iCans features &quot;The New Guy,&quot; an algorithmic routing helper designed to organize daily stops and landfill turns.
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
                  <td className="font-semibold">Automated SMS Text Alerts</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">Included on all plans ($0/mo+)</td>
                  <td className="text-[#b54848] font-semibold">Gated to $159/mo Plus plan</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Mobile Experience</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">1-Tap SMS Magic Links (0 App Store install)</td>
                  <td>iOS / Android driver app download required</td>
                </tr>
                <tr>
                  <td className="font-semibold">Card Processing Gateway</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">Direct Stripe Connect & Apple Pay</td>
                  <td>Tiger Payment Solutions</td>
                </tr>
                <tr>
                  <td className="font-semibold">Landfill Tipping Fee & Scale Capture</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">1-Tap driver photo & auto tonnage overage bill</td>
                  <td>Manual weight ticket entry</td>
                </tr>
                <tr>
                  <td className="font-semibold">Online Ordering & Customer Portal</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">Included (60s live checkout widget)</td>
                  <td>Embeddable widget / Paid website add-on</td>
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
              Common iCans Limitations and Hauler Complaints
            </h2>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            While iCans is an upgrade over pen and paper or general contractor tools like Jobber and Housecall Pro, small haulers running 1 to 25+ trucks cite three bottlenecks:
          </p>
          <ul className="space-y-3 text-sm text-[#475569] mb-4">
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>The $159/Mo SMS Feature Gate:</strong> Customer text notifications are vital for ETA updates and gate codes across your service area. Paying $159/month instead of $99/month just to send text messages inflates software overhead to $1,908/year.</span>
            </li>
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>Payment Gateway Dependency:</strong> Many haulers prefer standard Stripe accounts. iCans steers users toward Tiger Payment Solutions, creating friction for operators wanting portable card processing.</span>
            </li>
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>Native Driver App Headaches:</strong> Forcing drivers to download a driver app from the App Store creates support tickets when drivers get new phones or forget passwords.</span>
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
                Pay $99 to $299+/mo regardless of seasonal haul volume, deal with native App Store driver setups, and manually invoice landfill scale ticket overages.
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
                <li>You prefer their &quot;The New Guy&quot; AI routing assistant.</li>
                <li>You already use Tiger Payment Solutions for merchant processing.</li>
                <li>You do not mind paying $159/month to unlock automated SMS text communications.</li>
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
                iCans charges $99/month for Base (email-only alerts) and $159/month for Plus (SMS alerts). RollOS offers a permanent $0/month Free Plan with unlimited orders, SMS routing, and zero setup fee.
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
                iCans integrates with Tiger Payment Solutions for card processing, whereas RollOS uses direct Stripe Connect and Apple Pay alongside $0-fee offline cash/check logging.
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
