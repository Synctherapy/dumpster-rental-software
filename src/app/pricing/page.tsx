import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { Brand } from '@/components/brand';
import { PricingMatrix } from '@/components/pricing-matrix';

export const metadata = {
  title: 'Dumpster Rental Software Pricing — Free, $29/mo & $149/mo Plans',
  description:
    'Transparent dumpster rental software pricing. Start free at $0/month to get bookings while you sleep, $29/mo Starter for cash/check & calendar sync, or $149/mo Growth.',
};

export default function PricingPage() {
  return (
    <main className="marketing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/uses/dumpster-booking-system">Online Booking</Link>
          <Link href="/uses/roll-off-dispatch-software">Dispatch Board</Link>
          <Link href="/calculator">Savings Calculator</Link>
          <Link href="/vs">Compare</Link>
          <Link href="/signup" className="btn btn-orange">
            Try Free Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

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

          <div className="overflow-x-auto">
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
                  <td className="highlight-col font-semibold">Customer pays $12 booking fee</td>
                </tr>
                <tr>
                  <td className="font-bold text-[#1f2d26]">RollOS Starter Plan</td>
                  <td className="font-mono font-bold">$29 / mo</td>
                  <td className="font-bold">$0 (Instant self-serve)</td>
                  <td className="font-bold font-mono text-[#166534]">$348 / yr ($5,000+ saved)</td>
                  <td>Option to absorb or keep $12 fee</td>
                </tr>
              </tbody>
            </table>
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
    </main>
  );
}
