import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  CreditCard,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Building2,
  Sparkles,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { PricingMatrix } from '@/components/pricing-matrix';
import { Footer } from '@/components/footer';
import { BreadcrumbSchema } from '@/components/schema-org';

export const metadata = {
  title: 'Dumpster Rental Software Pricing — Free, $29/mo & $149/mo Plans',
  description:
    'Transparent dumpster rental software pricing. Start free at $0/month to get bookings while you sleep, $29/mo Starter for contractor rates, or $149/mo Growth Fleet for Missed-Call SMS Auto-Textback and VIP Contractor Net-30 Portal.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="marketing">
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Pricing', item: '/pricing' },
        ]}
      />
      <MarketingNav currentPath="/pricing" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Roll Off Dumpster Software
        </Link>

        <div className="eyebrow" style={{ color: '#82956d', marginTop: 16, marginBottom: 8 }}>
          SIMPLE, TRANSPARENT HAULER PRICING
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] mb-4">
          Dumpster rental software pricing that puts money in your pocket.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-6 max-w-3xl">
          Get client bookings while you sleep with our free online booking software. No more phone tag,
          no lost jobs while driving, and zero bloated software bills. Start 100% free with no credit card required.
        </p>

        {/* Feature & Plan Comparison Table */}
        <PricingMatrix />

        {/* Real Hard Cost Comparison Table */}
        <div className="mt-12 p-6 md:p-8 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-[#ea580c]" size={24} />
            <h2 className="text-xl md:text-2xl font-bold text-[#1f2d26]">
              Real Software Overhead: RollOS vs Legacy Competitors
            </h2>
          </div>
          <p className="text-sm text-[#556658] leading-relaxed mb-6">
            Legacy software providers charge independent haulers hundreds of dollars every month before you haul your first bin. Here is how the annual math breaks down:
          </p>

          <div className="overflow-hidden">
            <table className="compare-table" style={{ margin: '0' }}>
              <thead>
                <tr>
                  <th>Software Platform</th>
                  <th>Monthly Cost</th>
                  <th>Setup & Onboarding</th>
                  <th>Annual Software Bill</th>
                  <th>Who Pays Software Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold text-[#dc2626]">Docket / ServiceCore</td>
                  <td className="text-[#dc2626] font-mono">$350+ / mo</td>
                  <td className="text-[#dc2626] font-mono">$1,200 – $1,500</td>
                  <td className="text-[#dc2626] font-bold font-mono">$5,400 – $5,700 / yr</td>
                  <td>Hauler absorbs 100% out of profit</td>
                </tr>
                <tr className="bg-[#f0fdf4]">
                  <td className="font-bold text-[#166534] highlight-col">RollOS Free Plan</td>
                  <td className="text-[#166534] font-bold font-mono highlight-col">$0 / mo</td>
                  <td className="text-[#166534] font-bold highlight-col">$0 (Instant self-serve)</td>
                  <td className="text-[#166534] font-black font-mono highlight-col">$0 / yr ($5,400+ saved)</td>
                  <td className="highlight-col font-semibold">$0 software cost to hauler</td>
                </tr>
                <tr>
                  <td className="font-bold text-[#1f2d26]">RollOS Starter (14-Day Free Trial)</td>
                  <td className="font-mono font-bold">$29 / mo</td>
                  <td className="font-bold">$0 (Instant self-serve)</td>
                  <td className="font-bold font-mono text-[#166534]">$348 / yr ($5,000+ saved)</td>
                  <td>Contractor accounts add-on & $0 fees on offline orders</td>
                </tr>
                <tr className="bg-[#f8faf6]">
                  <td className="font-bold text-[#065f46]">RollOS Growth Fleet ($149 / mo)</td>
                  <td className="font-mono font-bold text-[#065f46]">$149 / mo</td>
                  <td className="font-bold text-[#065f46]">$0 (Instant self-serve)</td>
                  <td className="font-bold font-mono text-[#065f46]">$1,788 / yr ($3,600+ saved)</td>
                  <td>Missed-call SMS textback, VIP Contractor Net-30 portal & multi-truck routing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Growth Fleet ($149/mo) High-ROI Feature Showcase */}
        <div className="mt-10 p-6 md:p-8 bg-gradient-to-br from-[#192720] to-[#121c17] text-white rounded-2xl border border-[#2a3c31] shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 bg-[#23382c] text-[#86efac] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#345341]">
              <Sparkles size={14} />
              Growth Fleet Plan ($149/mo) · High-ROI Automation
            </div>
            <div className="text-xs text-[#a3b899] font-medium">
              Saves 2–3 lost rentals/mo ($900–$1,500 extra revenue)
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Two features that make the $149/mo plan pay for itself in week one.
          </h3>
          <p className="text-sm md:text-base text-[#b8c9b9] leading-relaxed max-w-3xl mb-8">
            Independent haulers lose thousands each month while behind the wheel or juggling commercial roofers. Growth Fleet automates your front-office phone and contractor accounts so you capture every single dollar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1: Missed-Call SMS Auto-Textback */}
            <div className="p-6 bg-[#203027] border border-[#2e4738] rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#ea580c]/20 text-[#fb923c] flex items-center justify-center font-bold">
                    <PhoneCall size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Missed-Call SMS Auto-Textback
                    </h4>
                    <span className="text-[11px] text-[#fb923c] font-semibold uppercase tracking-wider">
                      Powered by Twilio · Instant Recovery
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed mb-4">
                  When a homeowner calls your Google Voice or cell while you&apos;re driving or dropping a can, <strong>75% hang up and call the next dumpster company on Google</strong>.
                </p>

                <div className="bg-[#15201a] p-3.5 rounded-lg border border-[#273a2e] mb-4 text-xs font-mono text-[#e2e8f0] space-y-2">
                  <div className="text-[11px] text-[#94a3b8] font-sans flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-[#38bdf8]" /> Auto-Text sent in 5 seconds:
                  </div>
                  <div className="bg-[#1f2d26] p-2.5 rounded border border-[#2c3e34] text-[#d6ef7c] text-[12px] leading-relaxed">
                    &ldquo;Hey, driving right now! Check prices and reserve a bin here in 60s: [your booking link]&rdquo;
                  </div>
                </div>

                <div className="text-xs text-[#a7f3d0] bg-[#064e3b]/50 p-3 rounded-lg border border-[#059669]/40 mb-4">
                  <strong>🔥 The ROI Math:</strong> Recovering just <strong>2–3 missed calls a month</strong> preserves <strong>$900–$1,500</strong> in rental profit that would have gone to your competitor.
                </div>
              </div>

              <div className="text-[11px] font-semibold text-[#86efac] flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Included in Growth Fleet ($149/mo)
              </div>
            </div>

            {/* Feature 2: VIP Contractor Net-30 Portal */}
            <div className="p-6 bg-[#203027] border border-[#2e4738] rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#3b82f6]/20 text-[#60a5fa] flex items-center justify-center font-bold">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      VIP Contractor Net-30 Portal
                    </h4>
                    <span className="text-[11px] text-[#60a5fa] font-semibold uppercase tracking-wider">
                      High-Volume Account Lock-In
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-[#cbd5e1] leading-relaxed mb-4">
                  Roofers and remodelers order <strong>5–15 dumpsters every single month</strong>. Gating 1-click dumpster swap requests and Net-30 monthly invoicing to paid tiers creates permanent lock-in.
                </p>

                <div className="bg-[#15201a] p-3.5 rounded-lg border border-[#273a2e] mb-4 text-xs text-[#e2e8f0] space-y-2">
                  <div className="flex items-center gap-2 text-[#86efac]">
                    <CheckCircle2 size={14} /> <strong>1-Click Swap Requests:</strong> No 6:00 AM phone calls.
                  </div>
                  <div className="flex items-center gap-2 text-[#86efac]">
                    <CheckCircle2 size={14} /> <strong>Net-30 Invoicing:</strong> Automated monthly PDF statements.
                  </div>
                  <div className="flex items-center gap-2 text-[#86efac]">
                    <CheckCircle2 size={14} /> <strong>Tonnage Overage Tracking:</strong> Landfill scale slips itemized.
                  </div>
                </div>

                <div className="text-xs text-[#a7f3d0] bg-[#064e3b]/50 p-3 rounded-lg border border-[#059669]/40 mb-4">
                  <strong>🔒 Commercial Lock-In:</strong> Once a roofer has a seamless 1-click swap portal and Net-30 billing with you, they will never switch haulers.
                </div>
              </div>

              <div className="text-[11px] font-semibold text-[#86efac] flex items-center gap-1.5">
                <CheckCircle2 size={14} /> Included in Growth Fleet ($149/mo)
              </div>
            </div>
          </div>
        </div>

        {/* Manual Phone Orders, Stripe Connect & Scale Ticket Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm text-left flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <h4 className="text-sm font-bold text-[#1f2d26] flex items-center gap-1.5">
                  <CheckCircle2 size={18} className="text-[#ea580c] shrink-0" />
                  Manual &amp; Phone Orders: $0 Fees
                </h4>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#eef3e6] text-[#4a6331] px-2 py-0.5 rounded-full border border-[#d2dec3]">
                  Starter $29/mo
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed mb-3">
                When repeat contractors call or text you, enter them onto your visual dispatch board with <strong>$0 platform fees forever</strong> on Starter. Just 1 contractor pull pays for the software for the entire month while saving you $3,600+/yr vs legacy tools.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#166534]">
              ✓ Includes 14-day free trial · Cancel anytime
            </div>
          </div>

          <div className="p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm text-left flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-1.5">
                <CreditCard size={18} className="text-[#ea580c] shrink-0" />
                Stripe Direct Payouts: $0 Monthly Fees
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed mb-3">
                Connect your business checking account in under 3 minutes with <strong>zero credit checks</strong>. Standard card processing (2.9% + 30¢) is deducted automatically at payment time, with free automatic 2-day bank deposits and optional 30-min instant payouts. RollOS never holds your cash.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#166534]">
              ✓ $0 monthly merchant fees · No surprise monthly bills
            </div>
          </div>

          <div className="p-5 bg-white border border-[#dde4d4] rounded-xl shadow-sm text-left flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-1.5">
                <ShieldCheck size={18} className="text-[#ea580c] shrink-0" />
                Card on File for Scale Tickets
              </h4>
              <p className="text-xs text-[#475569] leading-relaxed mb-3">
                Customer payment cards are tokenized and saved on file at checkout via Stripe Connect. When landfill scale tickets show overages, charge the exact amount in 1 click without chasing checks or awkward calls.
              </p>
            </div>
            <div className="text-[11px] font-semibold text-[#166534]">
              ✓ Automatic overage math at your custom rate
            </div>
          </div>
        </div>

        {/* Clear Truth & Transparency Box */}
        <div className="mt-8 p-6 bg-[#f3f6ee] border border-[#d8e2cf] rounded-2xl text-xs text-[#334155] leading-relaxed">
          <h3 className="text-sm font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#ea580c]" />
            Honest Product Commitments
          </h3>
          <p>
            RollOS is designed for clean, high-speed operations. We do not require long-term contracts, setup fees, or proprietary hardware.
            Drivers never have to download an app from the App Store—they use secure, 1-tap SMS web links. Landfill scale ticket weights are entered
            directly against the job, and navigation opens in the driver’s preferred map app. Stripe credit card processing fees are standard and separate.
            You own 100% of your data and can export all records to CSV at any time.
          </p>
        </div>

        {/* Reverse Silo CTA */}
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center my-10">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            READY TO ELIMINATE PHONE TAG?
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-3">
            Start taking dumpster rentals online in under 3 minutes.
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Test the live dispatch board and customer booking widget free. No sales calls, no contracts, and no credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo <ArrowRight size={14} />
            </Link>
            <Link href="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
