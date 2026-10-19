import Link from 'next/link';
import { ArrowRight, Check, X, DollarSign, Smartphone } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { SavingsCalculator } from '@/components/savings-calculator';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'iCans Dumpster Software vs RollOS: 2026 Pricing & Alternatives',
  description:
    'iCans dumpster software review: compare iCans pricing ($99–$159/mo), SMS limits, payment lock-in, and top roll-off software alternatives.',
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
          'In-depth operational review comparing iCans dumpster software vs RollOS for roll-off waste haulers managing 1 to 25+ trucks.',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://rolloffdumpstersoftware.com/vs/icans#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much does iCans dumpster software cost per month?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'iCans pricing starts at $99 per month for their Base tier and rises to $159 per month for their Plus tier. A custom hosted website carries an additional recurring monthly fee.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does the iCans base tier include SMS messaging?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. iCans restricts automated SMS notifications on the $99/mo Base tier, requiring roll-off haulers to upgrade to the $159/mo Plus plan to send automated text alerts to customers and drivers.',
            },
          },
          {
            '@type': 'Question',
            name: 'What payment processor does iCans require?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'iCans typically routes credit card transactions through Tiger Payment Solutions, limiting processor portability. RollOS connects directly with industry-standard Stripe or allows cash/check recording with zero gateway lock-in.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does iCans track container demurrage and tonnage overages?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'iCans includes an automated rental day counter and demurrage calculator. However, scale ticket photo verification and automated weight-overage card billing require multi-step manual administrative review compared to RollOS 1-tap scale slip capture.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does iCans charge onboarding fees or lock you into contracts?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'iCans does not charge setup fees and operates on a month-to-month subscription with a 7 to 14 day free trial. Similarly, RollOS offers a $0/month Free tier, a 14-day free trial on the $29/mo Starter tier, and zero long-term contracts.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the best iCans alternative for roll-off businesses?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'RollOS is the top-rated iCans alternative for independent roll-off dumpster haulers managing 1 to 25+ trucks. RollOS features a $0/mo Free plan ($12 customer checkout fee, 0% hauler commission), 1-tap driver SMS magic links that require zero App Store downloads, and automated scale overage billing.',
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
          <strong>iCans dumpster software</strong> offers flat-rate roll-off dispatching, but tier-gated SMS alerts and gateway lock-in push operators toward modern{' '}
          <Link
            href="/"
            className="text-[#1f2d26] font-semibold underline decoration-[#ea580c] underline-offset-2 hover:text-[#ea580c]"
          >
            dumpster rental software
          </Link>{' '}
          alternatives like RollOS. While iCans provides single-screen dispatching and AI-assisted routing, growing haulers with 1 to 25+ trucks face upgrade friction when scaling driver communication and online booking.
        </p>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white border-2 border-[#ea580c] rounded-2xl shadow-sm relative">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
              ZERO-COMMISSION CLOUD STACK
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">RollOS</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Built specifically for 1 to 25+ truck roll-off haulers. Start completely free on the $0/month Free tier ($12 customer reservation fee at checkout, 0% hauler commission, 1-click absorb toggle) or choose Starter at $29/mo or Growth at $149/mo. Includes instant 1-tap SMS driver links and automated scale ticket overage invoicing.
            </p>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Free Plan ($0/mo) · Starter ($29/mo) · Growth ($149/mo)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Zero driver App Store friction (SMS magic links)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Keep 100% of rental revenue & disposal overages
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> 60-second online customer booking engine included
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-3">
              TIERED ROLL-OFF DISPATCH
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">iCans (icans.ai)</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              A solid web-based roll-off dispatch application founded by waste industry operators. Features a single-screen dispatch board, rental day demurrage tracking, and AI-assisted routing, but gates critical SMS notifications behind their higher-priced monthly plan.
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> $99/mo (Base) to $159/mo (Plus) monthly fee
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Base plan excludes automated SMS text notifications
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Native App Store downloads required for drivers
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Tiger Payment Solutions processing lock-in
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Savings Calculator */}
        <div className="my-12">
          <SavingsCalculator showTitle={true} />
        </div>

        {/* Kyle Roof Group B: H2 Section 1 */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            iCans Dumpster Software Overview & Features
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            When examining <strong>icans dumpster software</strong>, roll-off dumpster operators find a focused set of features built to replace dry-erase dispatch boards and messy spreadsheets. The core platform centers around an interactive dispatch calendar, container inventory tracker for 10-yard, 20-yard, 30-yard, and 40-yard roll-off bins, and customer contact management.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h4 className="font-bold text-[#1f2d26] text-sm mb-1">Single-Screen Dispatch</h4>
              <p className="text-xs text-[#556658] leading-relaxed">
                Visual scheduling grid for drop-offs, pickups, and dumpster swaps. Enables drag-and-drop job assignments across your roll-off trucks.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h4 className="font-bold text-[#1f2d26] text-sm mb-1">AI Routing Assistant</h4>
              <p className="text-xs text-[#556658] leading-relaxed">
                iCans features &quot;The New Guy,&quot; an algorithmic routing helper designed to organize daily stops and optimize turn times between transfer stations.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h4 className="font-bold text-[#1f2d26] text-sm mb-1">QuickBooks Accounting Sync</h4>
              <p className="text-xs text-[#556658] leading-relaxed">
                Synchronizes customer accounts, invoices, and completed work orders directly with QuickBooks Online for bookkeeping.
              </p>
            </div>
          </div>
        </div>

        {/* Feature & Pricing Breakdown Table */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            iCans Pricing, Tier Upgrades, and Hidden Fees
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            Evaluating the true total cost of ownership for <strong>icans pricing</strong> requires looking past the baseline subscription. While iCans advertises a $99/month starting rate, essential automation features require higher tiers:
          </p>
          <div className="overflow-x-auto rounded-xl border border-[#dde4d4]">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Feature / Operational Capability</th>
                  <th className="highlight-col text-[#1d2527]" style={{ width: '35%' }}>
                    RollOS
                  </th>
                  <th style={{ width: '30%' }}>iCans Dumpster Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Monthly Software Cost</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $0 (Free) · $29 (Starter) · $149 (Growth)
                  </td>
                  <td className="text-[#b54848] font-semibold">$99/mo (Base) · $159/mo (Plus)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Setup & Onboarding Fees</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">$0 (Self-serve in 3 min)</td>
                  <td className="text-[#2e7d32] font-bold">$0</td>
                </tr>
                <tr>
                  <td className="font-semibold">Hauler Rental Commission</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    0% (Keep 100% of rental revenue)
                  </td>
                  <td>0% (Flat monthly subscription)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Automated SMS Text Alerts</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">
                    Included on all plans
                  </td>
                  <td className="text-[#b54848] font-semibold">Gated to $159/mo Plus plan</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Mobile Experience</td>
                  <td className="highlight-col font-semibold">
                    1-Tap SMS Magic Links (0 app install)
                  </td>
                  <td>iOS / Android app download required</td>
                </tr>
                <tr>
                  <td className="font-semibold">Landfill Scale Ticket Capture</td>
                  <td className="highlight-col font-semibold">
                    1-Tap driver photo & auto tonnage overage bill
                  </td>
                  <td>Manual weight ticket entry</td>
                </tr>
                <tr>
                  <td className="font-semibold">Customer Online Booking Engine</td>
                  <td className="highlight-col font-semibold">
                    Included (60s live checkout widget)
                  </td>
                  <td>Embeddable widget / Paid website add-on</td>
                </tr>
                <tr>
                  <td className="font-semibold">Contract Lock-In</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    Month-to-month. Cancel anytime.
                  </td>
                  <td>Month-to-month (No contract)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Kyle Roof Group B: H2 Section 3 */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-[#ea580c]" size={24} />
            <h2 className="text-xl font-bold text-[#1f2d26]">
              Common iCans Limitations and Hauler Complaints
            </h2>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            While iCans is an upgrade over pen and paper, waste haulers running 1 to 25+ trucks cite several operational bottlenecks as fleet volume increases:
          </p>
          <ul className="space-y-3 text-sm text-[#475569] mb-4">
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>The SMS Feature Gate:</strong> Customer text notifications are vital for ETA updates, driveway delivery alerts, and gate code coordination. Having to pay $159/month instead of $99/month just to send text messages inflates software overhead by $720/year.</span>
            </li>
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>Payment Gateway Dependency:</strong> Many haulers prefer using standard Stripe accounts or maintaining existing merchant relationships. iCans steers users toward Tiger Payment Solutions, creating friction for operators wanting portable merchant processing.</span>
            </li>
            <li className="flex items-start gap-2">
              <X size={18} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>Native Driver App Headaches:</strong> Forcing drivers to download an app from Google Play or the Apple App Store creates support tickets when drivers get new phones, forget passwords, or run relief shifts.</span>
            </li>
          </ul>
        </div>

        {/* Kyle Roof Group B: H2 Section 4 */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="text-[#ea580c]" size={24} />
            <h2 className="text-xl font-bold text-[#1f2d26]">
              Leading iCans Alternatives for Growing Roll-Off Haulers
            </h2>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            When shopping for <strong>icans alternatives</strong>, operators prioritize automation, low software overhead, and zero driver onboarding friction:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#f8faf6] rounded-xl text-xs mb-4">
            <div className="p-4 bg-white border border-[#e2ebd8] rounded-lg">
              <strong className="text-[#1f2d26] text-sm block mb-1">With iCans:</strong>
              <p className="text-[#64748b] leading-relaxed">
                $159/mo for automated SMS alerts + app store driver setups. Hauler pays subscription regardless of rental volume. Manual scale ticket overage invoicing.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#cbe1b8] rounded-lg">
              <strong className="text-[#2e7d32] text-sm block mb-1">With RollOS ($0 Free / $29 Starter):</strong>
              <p className="text-[#47603c] leading-relaxed">
                Zero software overhead on Free tier ($12 checkout fee paid by customer). Drivers use instant 1-tap SMS web links. Landfill scale tickets calculate and bill ton overages automatically to credit card on file.
              </p>
            </div>
          </div>
        </div>

        {/* When to Choose Verdict */}
        <div className="p-8 bg-[#1f2621] text-white rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4">The Verdict: When to Choose RollOS vs iCans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#cbd5cc] leading-relaxed">
            <div>
              <strong className="text-white text-base block mb-2">Choose iCans if:</strong>
              <ul className="space-y-2 list-disc pl-4">
                <li>You prefer their proprietary AI routing assistant (&quot;The New Guy&quot;) for complex multi-stop sequences.</li>
                <li>You are already using Tiger Payment Solutions for your merchant account.</li>
                <li>You don’t mind paying $159/month to unlock automated SMS text communications.</li>
              </ul>
            </div>
            <div>
              <strong className="text-[#ea580c] text-base block mb-2">Choose RollOS if:</strong>
              <ul className="space-y-2 list-disc pl-4 text-white">
                <li>You manage a 1 to 25+ truck fleet and want maximum profit margins without tier-gated SMS.</li>
                <li>You want driver dispatch to work instantly via SMS web links without App Store installs.</li>
                <li>You want automated landfill scale ticket photo capture with instant tonnage overage billing.</li>
                <li>You want to capture 24/7 dumpster bookings with an embeddable 60-second customer checkout widget.</li>
                <li>You want the option to start at $0/mo Free or $29/mo Starter without sales demos.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Kyle Roof Group C: 6 H3 FAQs */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-6">
            Frequently Asked Questions: iCans Dumpster Software
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                How much does iCans dumpster software cost per month?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                iCans dumpster software charges $99 per month for their Base plan and $159 per month for their Plus plan. A custom hosted website can be added for an extra monthly fee.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                Does the iCans base tier include SMS messaging?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                No. iCans restricts automated SMS messaging on the $99/mo Base plan, requiring haulers to upgrade to the $159/mo Plus plan to send automated text updates to customers and drivers.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                What payment processor does iCans require?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                iCans is integrated with Tiger Payment Solutions for merchant processing. In contrast, RollOS supports direct Stripe integration and offline cash/check recording without proprietary merchant lock-in.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                How does iCans track container demurrage and tonnage overages?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                iCans tracks rental days and applies demurrage fees based on your rental terms. For scale weight overages, drivers or dispatchers manually record scale tickets, whereas RollOS automates scale ticket photo capture and charges the customer card on file instantly.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                Does iCans charge onboarding fees or lock you into contracts?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                iCans does not charge setup fees and offers month-to-month terms with a 7 to 14 day trial. RollOS similarly features month-to-month agility with a $0/mo Free tier and a 14-day free trial on the $29/mo Starter tier.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                What is the best iCans alternative for roll-off businesses?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                RollOS is the leading iCans alternative for 1 to 25+ truck roll-off haulers, delivering instant SMS driver links, 60-second online customer booking, automated scale overage billing, and zero-commission plans starting at $0/month.
              </p>
            </div>
          </div>
        </div>

        {/* Kyle Roof Spoke-to-Spoke Comparison Silo */}
        <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl mb-8 shadow-sm">
          <h3 className="text-base font-bold text-[#1f2d26] mb-3">
            Compare Other Roll-Off Dumpster Rental Software Alternatives
          </h3>
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
