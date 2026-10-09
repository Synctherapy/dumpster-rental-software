import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Brand } from '@/components/brand';
import { ContractTemplateView } from '@/components/contract-template-view';

export const metadata = {
  title: 'Dumpster Rental Contract Template — Free Hauler Agreement & Property Waiver',
  description:
    'Free, copy-pasteable roll off dumpster rental contract agreement template. Complete with driveway damage waivers, prohibited hazardous waste clauses, and tonnage overage terms.',
};

export default function ContractTemplatePage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: 'Roll Off Dumpster Rental Agreement & Liability Waiver Template',
    description:
      'Standard roll off dumpster rental contract agreement template protecting haulers against driveway damage, hazardous waste penalties, and overweight disposal fees.',
    encodingFormat: 'text/plain',
    isAccessibleForFree: true,
    creator: {
      '@type': 'SoftwareApplication',
      name: 'RollOS Roll Off Dumpster Software',
      url: 'https://rolloffdumpstersoftware.com',
    },
  };

  return (
    <main className="marketing">
      {/* Schema.org */}
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
          <Link href="/vs/docket">RollOS vs Docket</Link>
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
          FREE OPERATIONAL HAULER TEMPLATES · LEGAL WAIVER
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#20302a] mb-6">
          Dumpster Rental Contract Template & Property Damage Waiver (2026 Free Agreement)
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-6">
          Protecting your hauling company from cracked concrete driveways, hidden toxic chemicals, and surprise landfill overweight fines starts with an ironclad legal agreement. Below is our complete, lawyer-reviewed <strong>dumpster rental contract template</strong>—free to copy, customize, and print for your roll-off business.
        </p>

        {/* Above-the-fold Quick Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-white border border-[#dde4d4] rounded-xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#1f2d26]">Driveway Protection</div>
              <p className="text-[11px] text-[#687864] mt-0.5">Explicit release from asphalt depressions, concrete stress cracks, and turf ruts.</p>
            </div>
          </div>
          <div className="p-4 bg-white border border-[#dde4d4] rounded-xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#1f2d26]">Hazardous Waste Penalties</div>
              <p className="text-[11px] text-[#687864] mt-0.5">Mandates $150–$500 hazmat surcharge for paint, tires, freon, and toxic liquids.</p>
            </div>
          </div>
          <div className="p-4 bg-white border border-[#dde4d4] rounded-xl flex items-start gap-3">
            <ShieldCheck size={20} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#1f2d26]">Automatic Overage Billing</div>
              <p className="text-[11px] text-[#687864] mt-0.5">Authorizes card-on-file auto charges for excess landfill weight scale tickets.</p>
            </div>
          </div>
        </div>

        {/* The Full Interactive Contract */}
        <ContractTemplateView />
      </div>
    </main>
  );
}
