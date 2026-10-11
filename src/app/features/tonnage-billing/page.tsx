import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Dumpster Tonnage Billing Software — Scale Ticket Invoicing | RollOS',
  description:
    'Automate disposal overage calculations and scale ticket invoicing. Attach landfill scale slips to customer invoices and charge credit cards on file with 1 click.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/features/tonnage-billing',
  },
};

export default function TonnageBillingFeaturePage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RollOS Dumpster Tonnage Billing & Scale Ticket Invoicing Software',
    description:
      'Automated disposal weight reconciliation, scale ticket photo attachment, and credit card overage billing software for roll-off dumpster haulers.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    url: 'https://rolloffdumpstersoftware.com/features/tonnage-billing',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const steps = [
    {
      num: '01',
      title: 'Driver Snaps Scale Ticket',
      desc: 'At the transfer station or landfill, the driver snaps a phone photo of the certified weight slip through their SMS route link.',
    },
    {
      num: '02',
      title: 'Automatic Net Weight Math',
      desc: 'Gross weight minus tare weight gives exact net tons. RollOS subtracts the customer included tonnage allowance automatically.',
    },
    {
      num: '03',
      title: 'Itemized Digital Invoice',
      desc: 'The system generates a clean invoice attaching the photo of the landfill ticket so the customer has undeniable visual proof.',
    },
    {
      num: '04',
      title: '1-Click Stripe Card Charge',
      desc: 'Charge the customer card authorized at booking with 1 click. Zero awkward phone calls, zero unpaid check chasing.',
    },
  ];

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/features" />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-4">
        <Link
          href="/features"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c] transition-colors"
        >
          <ArrowLeft size={14} /> Back to All Features
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          PILLAR 04 · SCALE TICKETS & AUTOMATED TONNAGE BILLING
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          Dumpster tonnage billing software that stops you from eating landfill fees.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          When customers overload a 20-yard dumpster with tile, dirt, or wet roofing shingles, the transfer station charges you heavy disposal fees. If you forget to bill that overage—or the customer refuses to pay—it comes straight out of your pocket. RollOS automates scale ticket capture and charges the customer card on file instantly.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <Link href="/signup" className="btn btn-orange text-sm py-3 px-6 font-bold">
            Start Free Demo <ArrowRight size={15} />
          </Link>
          <Link href="/tools/tonnage-calculator" className="btn btn-secondary text-sm py-3 px-6 font-semibold">
            Test Free Tonnage Calculator
          </Link>
        </div>

        {/* Main Screenshot / Visual */}
        <div className="bg-white p-3 md:p-5 rounded-3xl border border-[#dde4d4] shadow-md mb-12">
          <div className="rounded-2xl overflow-hidden border border-[#e5ebd9]">
            <Image
              src="/images/screenshots/dumpster-fleet-inventory-management-software.png"
              alt="RollOS automated dumpster tonnage billing and scale ticket reconciliation software"
              width={1440}
              height={900}
              priority
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="p-3 text-center text-xs text-[#6e8071]">
            Automated overage calculations: certified scale ticket attachment, net ton deduction, and instant card on file charging.
          </div>
        </div>
      </section>

      {/* The Overage Math Breakdown */}
      <section className="max-w-5xl mx-auto px-6 py-10 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider">
              HOW THE MATH WORKS
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
              Zero guesswork. Zero manual calculator mistakes.
            </h2>
            <p className="text-xs md:text-sm text-[#556658] leading-relaxed">
              When a rental agreement includes 2.0 tons and the scale ticket comes in at 3.42 tons, you are owed 1.42 tons at your overage rate (e.g. $85/ton = $120.70). RollOS computes this automatically, formats the invoice line item, and applies the charge.
            </p>

            <div className="space-y-2.5 text-xs text-[#415346] pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                <span>Fractional tonnage precision down to two decimal points</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                <span>Customize separate per-ton rates by container size and landfill</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22c55e]" />
                <span>Includes customer agreement terms agreed to during online checkout</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/tools/tonnage-calculator"
                className="text-xs font-bold text-[#ea580c] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Try our free web-based Tonnage Calculator tool →</span>
              </Link>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#1f2d26] pb-2 border-b border-[#dde4d4]">
              Sample Automated Scale Invoice Line Items
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#f0f4ea]">
                <span className="text-[#556658]">20-Yard Roll-Off Base Rental (7 Days)</span>
                <span className="font-bold text-[#1f2d26]">$425.00 (Paid at booking)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f0f4ea]">
                <span className="text-[#556658]">Included Weight Allowance</span>
                <span className="font-semibold text-[#1f2d26]">2.00 Tons (4,000 lbs)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f0f4ea]">
                <span className="text-[#556658]">Landfill Ticket #84912 Net Weight</span>
                <span className="font-semibold text-[#1f2d26]">3.42 Tons (6,840 lbs)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f0f4ea]">
                <span className="text-[#556658]">Overweight Overage (1.42 tons @ $85/ton)</span>
                <span className="font-bold text-[#ea580c]">+$120.70</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f0f4ea]">
                <span className="text-[#556658]">Extra Rental Days (2 days @ $20/day)</span>
                <span className="font-bold text-[#ea580c]">+$40.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-sm">
                <span className="font-bold text-[#1f2d26]">Balance Due (Auto-charged):</span>
                <span className="font-extrabold text-[#166534]">$160.70</span>
              </div>
            </div>

            <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl text-[11px] text-[#166534] flex items-center gap-2">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>Scale slip photo automatically linked and sent to customer email</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Operational Process */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="mb-8">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            HOW IT WORKS
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
            From Transfer Station Scale to Paid Invoice in 4 Steps
          </h2>
          <p className="text-xs md:text-sm text-[#556658]">
            Built to work smoothly from the truck cab without requiring hours of evening paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-[#82956d] mb-2 block">{st.num}</span>
                <h3 className="text-base font-bold text-[#1f2d26] mb-1">{st.title}</h3>
                <p className="text-xs text-[#556658] leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chargeback Elimination & Prohibited Items */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#fee2e2] text-[#dc2626] inline-block">
              <ShieldCheck size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Chargeback Protection</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              When a customer sees an extra $150 overage charge, they often call their credit card company claiming fraud. With RollOS, the digital signature and certified scale slip photo are attached, giving you ironclad evidence that wins 100% of disputes.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#fef3c7] text-[#d97706] inline-block">
              <AlertCircle size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Prohibited Item Penalties</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Did the customer hide 4 car tires or an old mattress under construction debris? Add designated environmental surcharge line items with 1 click so you pass landfill fines directly to the customer.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm space-y-3">
            <span className="p-2.5 rounded-xl bg-[#e0e7ff] text-[#4f46e5] inline-block">
              <CreditCard size={22} />
            </span>
            <h3 className="text-lg font-bold text-[#1f2d26]">Direct Stripe Billing</h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Because credit cards are securely tokenized through Stripe Connect at initial online booking, you can charge balances without asking the customer for their card numbers over an awkward phone call.
            </p>
          </div>
        </div>
      </section>

      {/* Free Resources Cross-Links */}
      <section className="max-w-5xl mx-auto px-6 py-8 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#f7f9f4] border border-[#dce3d4] rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1f2d26]">Dumpster Rental Invoice Template</h4>
              <p className="text-xs text-[#556658]">Download our free commercial invoice outline with tonnage line items.</p>
            </div>
            <Link
              href="/templates/dumpster-invoice"
              className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 shrink-0 ml-4"
            >
              <span>View Template →</span>
            </Link>
          </div>

          <div className="p-6 bg-[#f7f9f4] border border-[#dce3d4] rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#1f2d26]">Tonnage & Overage Calculator</h4>
              <p className="text-xs text-[#556658]">Calculate disposal fees right on your smartphone web browser.</p>
            </div>
            <Link
              href="/tools/tonnage-calculator"
              className="text-xs font-bold text-[#ea580c] hover:underline flex items-center gap-1 shrink-0 ml-4"
            >
              <span>Use Calculator →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            STOP EATING LANDFILL OVERAGES
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Get paid for every pound your customers throw into your dumpsters
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Automate scale ticket invoicing and credit card charges with RollOS. Free to start, setup takes 3 minutes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo <ArrowRight size={14} />
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              View Pricing ($0, $29, $149/mo)
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
