import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, Shield, DollarSign, Smartphone, Zap, Truck, Star } from 'lucide-react';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'RollOS vs Docket Dumpster Software (2026 Comparison) — Pricing & Features',
  description:
    'Detailed, honest comparison of RollOS vs Docket dumpster rental software. Compare pricing ($29–$149/mo vs $250+/mo), driver SMS links vs mobile apps, and booking checkout.',
};

export default function DocketComparisonPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'RollOS vs Docket Dumpster Rental Software Comparison',
    description:
      'In-depth operational and pricing comparison between RollOS and Docket for roll off dumpster rental haulers.',
    url: 'https://rolloffdumpstersoftware.com/vs/docket',
  };

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/uses/dumpster-booking-system">Online Booking</Link>
          <Link href="/uses/roll-off-dispatch-software">Dispatch Board</Link>
          <Link href="/templates/dumpster-rental-contract">Free Contract</Link>
          <Link href="/signup" className="btn btn-orange">
            Start Free Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Roll Off Dumpster Software
          </Link>
        </div>

        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          VENDOR COMPARISON · PUBLISHED BY ROLLOS
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-6">
          RollOS vs. Docket: Which roll off dumpster software is right for your hauling business?
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8">
          Choosing between <strong>RollOS</strong> and <strong>Docket</strong> comes down to your operating philosophy: do you want an expensive, heavyweight enterprise platform that requires driver app downloads and mandatory sales demos, or a smaller tool with a free plan, a $29 Starter plan, and a $149 Growth plan. Drivers open an SMS link. They do not install an app.
        </p>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-white border-2 border-[#ea580c] rounded-2xl shadow-sm relative">
            <div className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
              MODERN HAULER STACK
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">RollOS</h3>
            <p className="text-xs text-[#556658] mb-4 leading-relaxed">
              Built specifically for independent and expanding roll-off haulers (1–15 trucks). Free at $0/month, Starter at $29/month, Growth at $149/month. The free plan adds an $11.95 customer reservation fee. Paid plans can turn that fee off.
            </p>
            <ul className="space-y-2 text-xs text-[#334155]">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#ea580c]" /> Starter $29/mo · Growth Fleet $149/mo
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#ea580c]" /> Free plan, then $29 or $149
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#ea580c]" /> Driver SMS magic links (zero app downloads)
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-[#ea580c]" /> 3-minute self-serve onboarding, no sales calls
              </li>
            </ul>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
            <div className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-3">
              LEGACY ENTERPRISE
            </div>
            <h3 className="text-xl font-bold text-[#1f2d26] mb-2">Docket</h3>
            <p className="text-xs text-[#556658] mb-4 leading-relaxed">
              An established, comprehensive waste management tool designed primarily for larger operations. Features deep dispatching but requires high recurring monthly overhead, per-user pricing, mandatory sales calls, and native app store downloads for drivers.
            </p>
            <ul className="space-y-2 text-xs text-[#64748b]">
              <li className="flex items-center gap-2">
                <X size={14} className="text-[#dc2626]" /> $150 – $350+ monthly base fee
              </li>
              <li className="flex items-center gap-2">
                <X size={14} className="text-[#dc2626]" /> Hauler pays 100% of software costs out of margin
              </li>
              <li className="flex items-center gap-2">
                <X size={14} className="text-[#dc2626]" /> Mandatory App Store / Play Store driver install
              </li>
              <li className="flex items-center gap-2">
                <X size={14} className="text-[#dc2626]" /> Annual commitments and guided sales demos
              </li>
            </ul>
          </div>
        </div>

        {/* Comprehensive Head-to-Head Feature Matrix */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
            Feature & Pricing Breakdown: RollOS vs. Docket
          </h2>
          <div className="overflow-x-auto">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Feature / Capability</th>
                  <th className="highlight-col text-[#1d2527]" style={{ width: '35%' }}>
                    RollOS
                  </th>
                  <th style={{ width: '30%' }}>Docket Software</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly Software Cost</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    $29/mo (Starter) or $149/mo (Growth)
                  </td>
                  <td className="text-[#b54848] font-semibold">$150 – $350+ / month</td>
                </tr>
                <tr>
                  <td>Hauler Rental Commission</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    Free, or $29 / $149 a month
                  </td>
                  <td>0% hauler fee (fixed overhead)</td>
                </tr>
                <tr>
                  <td>Platform Funding Model</td>
                  <td className="highlight-col font-semibold">
                    $11.95 fee on the free plan only
                  </td>
                  <td>Hauler absorbs 100% software overhead</td>
                </tr>
                <tr>
                  <td>Driver Mobile Workflow</td>
                  <td className="highlight-col font-semibold">
                    SMS magic link (0 app store downloads)
                  </td>
                  <td>Mandatory native app install & logins</td>
                </tr>
                <tr>
                  <td>Online Customer Checkout</td>
                  <td className="highlight-col font-semibold">
                    60-second self-checkout widget + Stripe
                  </td>
                  <td>Quote requests or add-on modules</td>
                </tr>
                <tr>
                  <td>Driveway Photo Proof</td>
                  <td className="highlight-col font-semibold">
                    Instant photo capture attached to job
                  </td>
                  <td>Available inside mobile app</td>
                </tr>
                <tr>
                  <td>Scale weight on the invoice</td>
                  <td className="highlight-col font-semibold">
                    1-click photo upload & auto overage billing
                  </td>
                  <td>Manual entry / disposal logs</td>
                </tr>
                <tr>
                  <td>Contractor 1-Click Swaps</td>
                  <td className="highlight-col font-semibold">
                    Not available yet
                  </td>
                  <td>Supported across higher tiers</td>
                </tr>
                <tr>
                  <td>Missed-call text-back</td>
                  <td className="highlight-col font-semibold">
                    Not available yet
                  </td>
                  <td>Not natively integrated</td>
                </tr>
                <tr>
                  <td>White-Label Custom Domain</td>
                  <td className="highlight-col font-semibold">
                    Custom booking domain
                  </td>
                  <td>Custom portal available</td>
                </tr>
                <tr>
                  <td>Review request SMS</td>
                  <td className="highlight-col font-semibold">
                    Automated post-pickup SMS review invite
                  </td>
                  <td>Requires third-party integrations</td>
                </tr>
                <tr>
                  <td>Contract Lock-In / Commitment</td>
                  <td className="highlight-col text-[#2e7d32] font-bold">
                    Zero lock-in. Cancel anytime.
                  </td>
                  <td>Often annual contracts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Deep Dive 1: Cost Math Comparison */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="text-[#ea580c]" size={24} />
            <h3 className="text-xl font-bold text-[#1f2d26]">
              How the free plan is paid for
            </h3>
          </div>
          <p className="text-sm text-[#556658] leading-relaxed mb-4">
            Consider an independent hauler running 2 roll-off trucks who rents out 30 dumpsters per month at an average rate of $450 per rental:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#f8faf6] rounded-xl text-xs mb-4">
            <div className="p-3 bg-white border border-[#e2ebd8] rounded-lg">
              <strong className="text-[#b54848] text-sm block mb-1">With Docket:</strong>
              <p className="text-[#64748b]">
                Monthly subscription: $250/mo<br />
                Annual software bill: <strong>$3,000 to $4,200/yr</strong><br />
                Money taken directly out of hauler profit.
              </p>
            </div>
            <div className="p-3 bg-white border border-[#cbe1b8] rounded-lg">
              <strong className="text-[#2e7d32] text-sm block mb-1">With RollOS Starter:</strong>
              <p className="text-[#47603c]">
                Monthly subscription: $29/mo ($348/yr)<br />
                Homeowner pays: $11.95 reservation fee on the free plan<br />
                Software cost on Free: <strong>$0/month</strong><br />
                Annual software savings: <strong>$2,652+ back in your pocket</strong>.
              </p>
            </div>
          </div>
          <p className="text-xs text-[#556658] leading-relaxed">
            Worried homeowners won’t pay a $12 reservation fee? Think about how consumers book anything online: flights, hotels, movie tickets, or car rentals. On a $450 dumpster rental, a customer won’t blink at $12 to guarantee delivery on their chosen Saturday morning. They are relieved to lock it in online rather than waiting for an operator to call back.
          </p>
        </div>

        {/* Deep Dive 2: Driver App Friction vs SMS Magic Links */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="text-[#ea580c]" size={24} />
            <h3 className="text-xl font-bold text-[#1f2d26]">
              Driver Experience: Why SMS Magic Links Beat Native App Installs
            </h3>
          </div>
          <p className="text-sm text-[#556658] leading-relaxed mb-4">
            Every roll-off business owner knows the pain of getting drivers to install and use mobile apps:
          </p>
          <ul className="space-y-3 text-xs text-[#556658] mb-4">
            <li className="flex items-start gap-2">
              <X size={16} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>App Store Friction:</strong> Drivers have personal phones with forgotten Apple/Google passwords, full storage, or outdated operating systems that crash native apps.</span>
            </li>
            <li className="flex items-start gap-2">
              <X size={16} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
              <span><strong>Turnover Headaches:</strong> When you hire a relief driver or subcontractor for a busy weekend, onboarding them to Docket takes 30 minutes of app installation, user creation, and permissions setup.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={16} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>The RollOS Advantage:</strong> RollOS sends a simple encrypted SMS web link. Drivers tap the text message. It opens in Safari or Chrome instantly. One tap launches GPS directions, snaps delivery photos, and records scale weights. Zero installation, zero logins, zero excuses.</span>
            </li>
          </ul>
        </div>

        {/* Deep Dive 3: Fleet Growth & Contractor Swaps */}
        <div className="p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="text-[#ea580c]" size={24} />
            <h3 className="text-xl font-bold text-[#1f2d26]">
              Scaling to Fleets: RollOS Growth Fleet ($149/mo) vs Enterprise Tiers
            </h3>
          </div>
          <p className="text-sm text-[#556658] leading-relaxed mb-4">
            If you run multiple trucks and manage roofing or construction contractor accounts, you need advanced workflows without corporate complexity:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#334155]">
            <div className="p-4 bg-[#f8faf6] border border-[#dce6d3] rounded-xl">
              <div className="font-bold text-[#1f2d26] mb-1">Contractor VIP 1-Click Swaps</div>
              <p className="text-[#64748b]">
                Roofers don’t want to wait 4 hours for an empty bin. RollOS schedules simultaneous drop-and-haul swaps in a single dispatch click.
              </p>
            </div>
            <div className="p-4 bg-[#f8faf6] border border-[#dce6d3] rounded-xl">
              <div className="font-bold text-[#1f2d26] mb-1">Missed-Call Auto Text-Back</div>
              <p className="text-[#64748b]">
                When you’re dumping a can or strapping down a tarp and miss a homeowner call, RollOS automatically texts them your online booking link within 5 seconds.
              </p>
            </div>
          </div>
        </div>

        {/* When to Choose Docket vs RollOS */}
        <div className="p-8 bg-[#1f2621] text-white rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4">The Verdict: When to Choose RollOS vs Docket</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#cbd5cc] leading-relaxed">
            <div>
              <strong className="text-white text-sm block mb-2">Choose Docket if:</strong>
              <ul className="space-y-2 list-disc pl-4">
                <li>You are an enterprise municipal hauler running 30+ municipal trucks with dedicated IT staff.</li>
                <li>You have complex corporate waste audits, multi-facility franchise routing, or industrial compactor maintenance schedules.</li>
                <li>You don’t mind paying $250–$350+/month and undergoing scheduled onboarding calls.</li>
              </ul>
            </div>
            <div>
              <strong className="text-[#ea580c] text-sm block mb-2">Choose RollOS if:</strong>
              <ul className="space-y-2 list-disc pl-4 text-white">
                <li>You are an independent or growth-focused roll-off hauler running 1–15 trucks.</li>
                <li>You want to start at $0/month and upgrade to $29 or $149 only if you need the customer fee off.</li>
                <li>You want your customers to book and pay online in 60 seconds.</li>
                <li>You want drivers to use fast SMS links with zero app downloads or login headaches.</li>
                <li>You want to be up and running today in 3 minutes without a sales demo.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Kyle Roof Reverse Silo Link to Home */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-8">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            EXPERIENCE THE ROLLOS DIFFERENCE
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Ready to test RollOS alongside your current dispatch system?
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Test the live dispatch board, driver SMS links, and 24/7 online booking engine today. No credit card required to demo.
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
    </main>
  );
}
