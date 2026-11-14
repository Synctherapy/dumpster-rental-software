import Link from 'next/link';
import { ArrowRight, Check, X, DollarSign } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { SavingsCalculator } from '@/components/savings-calculator';
import { VsVisualComparison } from '@/components/vs-visual-comparison';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Trash Flow Software: 2026 Pricing, Desktop vs Cloud & Alternatives',
  description:
    'Compare Trash Flow software (by Ivy Computer, offering licenses from $900-$3,050 and cloud options) vs RollOS ($0/mo Free Plan) for roll-off dumpster rental haulers.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/vs/trash-flow',
  },
};

export default function TrashFlowComparisonPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://rolloffdumpstersoftware.com/vs/trash-flow#webpage',
        url: 'https://rolloffdumpstersoftware.com/vs/trash-flow',
        name: 'Trash Flow Software: Pricing, Features & Modern Cloud Alternatives',
        description:
          'Compare Trash Flow software (by Ivy Computer, offering licenses from $900-$3,050 and cloud options) vs RollOS ($0/mo Free Plan) for roll-off dumpster rental haulers.',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://rolloffdumpstersoftware.com/vs/trash-flow#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much does Trash Flow software cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Trash Flow published license tiers include Trash Flow Lite from $900 (up to 600 accounts), Trash Flow at $2,350, and Trash Flow Plus at $3,050. The TeleRoute driver app is $35/truck/month, cloud-hosted licenses are $10–$40/license/month, and optional support is 12%/year after 90 days.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does Trash Flow offer a cloud-hosted version?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Built by Ivy Computer in Waterbury Center, VT (founded in 1985), Trash Flow offers both traditional on-premise Windows desktop licenses and modern cloud-hosted options ($10–$40/license/month). Customers can also view accounts and pay online via their Web Portal.',
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
            { name: 'RollOS vs Trash Flow', item: '/vs/trash-flow' },
          ]}
        />

        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          IN-DEPTH SOFTWARE REVIEW & COMPARISON · 2026 EDITION
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-6">
          Trash Flow Software: Pricing, Features & Modern Cloud Alternatives
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          Built by Ivy Computer in Waterbury Center, VT (founded in 1985), <strong>Trash Flow software</strong> offers waste and hauling billing solutions through both traditional on-premise Windows licenses and cloud-hosted deployments. Published license tiers include Trash Flow Lite (from $900 for up to 600 accounts), Trash Flow ($2,350), and Trash Flow Plus ($3,050), with the TeleRoute driver app available at $35/truck/month and cloud-hosted options at $10–$40/license/month. In contrast, modern 1 to 25+ truck roll-off haulers choose{' '}
          <Link
            href="/"
            className="text-[#1f2d26] font-semibold underline decoration-[#ea580c] underline-offset-2 hover:text-[#ea580c]"
          >
            RollOS dumpster rental software
          </Link>{' '}
          for a 100% self-serve web platform with 24/7 online ordering, 1-tap SMS driver routing, and a permanent $0/month Free Plan.
        </p>

        {/* Executive Overview: RollOS Cloud SaaS vs. Trash Flow Desktop */}
        <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
          Executive Overview: RollOS Cloud SaaS vs. Trash Flow
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white border-2 border-[#ea580c] rounded-2xl shadow-sm relative">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
              100% CLOUD-NATIVE ROLL-OFF PLATFORM
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">RollOS</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Built specifically for 1 to 25+ truck roll-off hauler fleets. Start for $0/month on the <strong>Free Plan</strong> ($12 customer reservation fee, 0% hauler commission, unlimited orders, unlimited users, $0 setup fee), Starter ($29/mo), or Growth ($99/mo) on our software <Link href="/pricing" className="text-[#ea580c] font-semibold hover:underline">pricing page</Link>. Runs in any web browser on Mac, PC, iPad, or phone with zero server hardware, 1-tap SMS driver links, and automated billing for landfill dump fees.
            </p>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Free Plan ($0/mo) · Starter ($29/mo) · Growth ($99/mo)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Unlimited orders, unlimited users & zero setup fee
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> Runs in browser on Mac, PC, iPad, or phone
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#ea580c] flex-shrink-0" /> 1-Tap SMS driver routing (no app store download)
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-3">
              TRADITIONAL & CLOUD-HOSTED
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">Trash Flow by Ivy Computer</h3>
            <p className="text-sm text-[#556658] mb-4 leading-relaxed">
              Developed by Ivy Computer in Waterbury Center, VT (founded in 1985). Offers both traditional Windows desktop software and cloud-hosted options. Pricing features upfront license tiers ($900 Lite, $2,350 Trash Flow, $3,050 Plus), TeleRoute mobile driver routing ($35/truck/mo), and cloud licensing ($10–$40/mo).
            </p>
            <ul className="space-y-2.5 text-sm text-[#64748b]">
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#2e7d32] flex-shrink-0" /> Desktop licenses ($900–$3,050) &amp; cloud options ($10–$40/mo)
              </li>
              <li className="flex items-center gap-2">
                <Check size={16} className="text-[#2e7d32] flex-shrink-0" /> Web Portal allows customers to view accounts and pay online
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> TeleRoute mobile driver app is $35/truck/month
              </li>
              <li className="flex items-center gap-2">
                <X size={16} className="text-[#dc2626] flex-shrink-0" /> Optional annual support is 12%/yr after 90 days
              </li>
            </ul>
          </div>
        </div>

        {/* Visual Interface & Workflow Comparison */}
        <VsVisualComparison
          competitorName="Trash Flow"
          competitorTagline="Built by Ivy Computer (founded in 1985 in Waterbury Center, VT), Trash Flow offers desktop licenses from $900 to $3,050 plus cloud-hosted options, a Web Portal for customer bill pay, and a $35/truck/mo TeleRoute driver app."
          competitorScreenshot="/images/competitors/trash-flow-preview.png"
          competitorScreenshotAlt="Trash Flow waste management software website homepage and system preview"
          competitorBulletPoints={[
            "Published licenses: Lite $900, Trash Flow $2,350, Plus $3,050",
            "Cloud-hosted options available from $10 to $40 per license per month",
            "TeleRoute driver mobile app priced at $35/truck/month",
            "Customer account management and online bill pay via Web Portal",
          ]}
          rollosTagline="100% modern cloud-native roll-off dumpster software. Accessible on any smartphone, iPad, Mac, or PC with zero hardware installations, automated cloud backups, and a permanent $0/mo Free Plan."
          rollosScreenshot="/images/screenshots/rollos-homepage-live.png"
          rollosScreenshotAlt="RollOS cloud dumpster rental software homepage showing modern multi-device dispatching"
          rollosBulletPoints={[
            "100% cloud-native web platform — access anywhere on any device",
            "Permanent $0/mo Free Plan ($12 checkout fee paid by customer, 0% commission)",
            "Automatic cloud backups and continuous real-time sync",
            "Instant 1-tap SMS driver links — zero App Store installs",
          ]}
          infographicSrc="/images/infographics/rollos-vs-trash-flow-cloud-vs-legacy.jpg"
          infographicAlt="Trash Flow modular licensing vs RollOS instant cloud dumpster rental software"
          infographicBadge="SOFTWARE ARCHITECTURE & LICENSING BREAKDOWN"
          infographicTitle="Modern Self-Serve Cloud SaaS vs. Traditional Modular Software Architecture"
          infographicDescription="Evaluate whether your roll-off hauling business benefits from traditional modular desktop licenses with per-truck driver fees or instant cloud dispatch with zero upfront software costs."
          infographicCaption="Figure 1: Comparison of Trash Flow vs RollOS architecture. Trash Flow provides time-tested modular waste billing with desktop and cloud hosting options, while RollOS delivers an instant-setup web platform with customer self-checkout and SMS driver dispatch."
          infographicCtaHeadline="Upgrade to modern self-serve cloud dispatch designed for roll-off."
        />

        {/* Interactive Savings Calculator */}
        <div className="my-12">
          <SavingsCalculator showTitle={true} />
        </div>

        {/* Section 1: Pricing Breakdown */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            Trash Flow Software Pricing, Modules, and Licensing
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            Reviewing <strong>Trash Flow pricing</strong> published by Ivy Computer reveals a tiered modular licensing model with both on-premise and cloud options:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">Published License Tiers ($900 to $3,050)</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Trash Flow Lite (up to 600 accounts) starts at $900. Standard Trash Flow is $2,350, and Trash Flow Plus is $3,050 for one-time licensing, with additional modules and extra seats by quote.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">TeleRoute Driver Mobile Routing ($35/truck/mo)</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Mobile routing and electronic dispatch for drivers is available through the TeleRoute mobile app at $35 per truck per month.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">Cloud-Hosted Deployment Options ($10–$40/mo)</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                In addition to traditional on-premise Windows software, Ivy Computer offers cloud-hosted licenses priced at $10, $20, or $40 per license per month.
              </p>
            </div>
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1f2d26] text-sm mb-1">Customer Web Portal &amp; Support</h3>
              <p className="text-xs text-[#556658] leading-relaxed">
                Customers can view accounts and pay bills online via Web Portal. Software support is included for the first 90 days, after which optional support is 12%/year (or 1%/month), which includes offsite cloud backups.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Comparison Table */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            Trash Flow vs. RollOS: Architecture & Feature Comparison
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed mb-6">
            Compare traditional modular software and cloud options against RollOS cloud infrastructure:
          </p>
          <div className="overflow-x-auto rounded-xl border border-[#dde4d4]">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Capability / Architecture</th>
                  <th className="highlight-col text-[#1d2527]" style={{ width: '35%' }}>
                    RollOS
                  </th>
                  <th style={{ width: '30%' }}>Trash Flow Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold">Software Architecture</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    100% Cloud SaaS (Mac, PC, iPad, Phone)
                  </td>
                  <td className="text-[#b54848] font-semibold">Windows Desktop &amp; Cloud-Hosted ($10–$40/mo)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Upfront License & Setup Fee</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">$0 (Self-serve in 3 min)</td>
                  <td className="text-[#b54848]">Lite $900 · Trash Flow $2,350 · Plus $3,050</td>
                </tr>
                <tr>
                  <td className="font-semibold">Monthly Software Cost</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $0 (Free) · $29 (Starter) · $99 (Growth)
                  </td>
                  <td>TeleRoute $35/truck/mo; optional 12%/yr support; cloud $10–$40/mo</td>
                </tr>
                <tr>
                  <td className="font-semibold">Multi-User / Seat Fees</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">Unlimited users, dispatchers & drivers</td>
                  <td className="text-[#b54848]">Extra seats by quote / Cloud license tiers</td>
                </tr>
                <tr>
                  <td className="font-semibold">Driver Dispatch Method</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">
                    1-Tap SMS Magic Links (0 App Store install)
                  </td>
                  <td>TeleRoute driver app ($35/truck/mo)</td>
                </tr>
                <tr>
                  <td className="font-semibold">24/7 Online Ordering & Customer Portal</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">
                    Included (60s checkout + contractor account portal)
                  </td>
                  <td>Web Portal (customers view accounts & pay online)</td>
                </tr>
                <tr>
                  <td className="font-semibold">Landfill Tipping Fee & Scale Overages</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">
                    1-Tap photo upload & automated billing
                  </td>
                  <td>Scale software module & billing reconciliation</td>
                </tr>
                <tr>
                  <td className="font-semibold">Accounting Integration</td>
                  <td className="highlight-col font-semibold text-[#2e7d32]">
                    QuickBooks & QuickBooks Online export
                  </td>
                  <td>Built-in billing system & ledgers</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Architecture Deep Dive */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-[#ea580c]" size={24} />
            <h2 className="text-xl font-bold text-[#1f2d26]">
              Modern Self-Serve Cloud SaaS vs. Traditional Waste Billing Systems
            </h2>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            For <strong>dumpster rental owners</strong> comparing Trash Flow against modern platforms like RollOS, <Link href="/vs/curbwaste" className="text-[#ea580c] font-semibold hover:underline">CurbWaste</Link>, <Link href="/vs/docket" className="text-[#ea580c] font-semibold hover:underline">Docket</Link>, <Link href="/vs/icans" className="text-[#ea580c] font-semibold hover:underline">iCans</Link>, or <Link href="/vs/bin-boss" className="text-[#ea580c] font-semibold hover:underline">Bin Boss</Link>, deployment speed and total cost of ownership are key:
          </p>
          <ul className="space-y-3 text-sm text-[#475569] mb-4">
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>Universal Device Access:</strong> While Trash Flow supports desktop and cloud-hosted setups, RollOS runs natively in any browser on Mac, iPad, iPhone, and PC with instant 3-minute self-serve onboarding.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>24/7 Online Booking & Checkout:</strong> Homeowners and contractors want to select a 10 to 40-yard dumpster, e-sign rental terms, and complete Stripe card checkout online at any hour of the day.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>Zero-App Driver Dispatch & Automated Dump Fees:</strong> RollOS texts drivers a 1-tap SMS browser link with GPS navigation, gate codes, drop photo capture, and scale weight photo uploads that automatically bill overweight tonnage fees directly to the card on file.</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Verdict */}
        <div className="p-8 bg-[#1f2621] text-white rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4">The Verdict: When to Choose RollOS vs. Trash Flow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#cbd5cc] leading-relaxed">
            <div>
              <strong className="text-white text-base block mb-2">Choose Trash Flow if:</strong>
              <ul className="space-y-2 list-disc pl-4">
                <li>You are a municipal or multi-route hauler managing residential trash routes and commercial accounts.</li>
                <li>You prefer purchasing traditional perpetual software licenses ($900–$3,050) from an established industry vendor (Ivy Computer, founded in 1985).</li>
                <li>You want on-premise Windows deployment or specialized scale-house ticketing integrations.</li>
              </ul>
            </div>
            <div>
              <strong className="text-[#ea580c] text-base block mb-2">Choose RollOS if:</strong>
              <ul className="space-y-2 list-disc pl-4 text-white">
                <li>You run a 1 to 25+ truck roll-off dumpster company.</li>
                <li>You want 100% cloud access on any device with unlimited users starting at $0/month.</li>
                <li>You want 1-tap SMS driver routing without recurring per-truck driver app fees ($35/truck/mo).</li>
                <li>You need 24/7 online ordering with automated billing for overweight dumpsters.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5: FAQs */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-6">
            Frequently Asked Questions: Trash Flow Software
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                How much does Trash Flow software cost?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                Trash Flow published license tiers include Trash Flow Lite from $900 (up to 600 accounts), Trash Flow at $2,350, and Trash Flow Plus at $3,050. The TeleRoute driver app is $35/truck/month, cloud-hosted licenses are $10–$40/license/month, and optional support is 12%/year after 90 days.
              </p>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2">
                Does Trash Flow offer a cloud-hosted version?
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                Yes. Built by Ivy Computer in Waterbury Center, VT (founded in 1985), Trash Flow offers both traditional on-premise Windows desktop licenses and modern cloud-hosted options ($10–$40/license/month). Customers can also view accounts and pay online via their Web Portal.
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
              href="/vs/icans"
              className="p-3 rounded-xl border border-[#dde4d4] hover:border-[#ea580c] hover:bg-[#fff7ed] transition-all font-semibold text-[#1f2d26] flex items-center justify-between"
            >
              <span>RollOS vs. iCans</span>
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
