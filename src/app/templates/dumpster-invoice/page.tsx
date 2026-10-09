import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Brand } from '@/components/brand';

export const metadata = {
  title: 'Dumpster Rental Invoice Template — Free Overage & Disposal Bill Format',
  description:
    'Free dumpster rental invoice template for haulers. Automatically calculate base bin rental, extra rental days, and tonnage overages from landfill tickets.',
};

export default function InvoiceTemplatePage() {
  return (
    <main className="marketing">
      <nav className="marketing-nav">
        <Brand />
        <div className="marketing-links">
          <Link href="/">Home</Link>
          <Link href="/uses/dumpster-booking-system">Online Booking</Link>
          <Link href="/uses/roll-off-dispatch-software">Dispatch Board</Link>
          <Link href="/signup" className="btn btn-orange">
            Start Free Demo <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c]">
            <ArrowLeft size={14} /> Back to Roll Off Dumpster Software
          </Link>
        </div>

        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          FREE HAULER BILLING TEMPLATES
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#20302a] mb-6">
          Dumpster rental invoice template for overage & disposal billing
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-8">
          Clear, professional invoicing is the fastest way to get paid for disposal overages and extra rental days. Use this free <strong>dumpster rental invoice template</strong> designed specifically for roll off container haulers.
        </p>

        <div className="panel p-6 bg-white border border-[#dde4d4] rounded-xl mb-8">
          <h2 className="text-lg font-bold text-[#1f2d26] mb-4">Essential Invoice Line Items</h2>
          <ul className="space-y-3 text-sm text-[#556658]">
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>Base Container Rental:</strong> Specify container size (10, 20, 30 yard), included rental duration, and delivery drop address.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>Extended Day Rental Fees:</strong> Breakdown of daily extension rates (e.g., $15–$25/day beyond initial 7-day period).</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={18} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <span><strong>Landfill Tonnage Overages:</strong> Attached scale slip weight, included tonnage allowance (e.g. 2 tons), and per-ton overage rate (e.g. $85/ton).</span>
            </li>
          </ul>
        </div>

        {/* Reverse Silo Callout */}
        <div className="p-6 bg-[#f3f6ee] border border-[#d8e2cf] rounded-xl text-center my-10">
          <h3 className="text-lg font-bold text-[#1f2d26] mb-2">
            Why calculate invoices by hand?
          </h3>
          <p className="text-xs text-[#556658] max-w-xl mx-auto mb-4">
            RollOS automatically generates server-calculated invoices the moment your driver logs the scale slip tonnage, charging customer cards via Stripe with zero hauler fees.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-sm text-[#ea580c] hover:underline">
            Upgrade to automated billing with free roll off dumpster software <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
