import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { ContractTemplateView } from '@/components/contract-template-view';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Dumpster Rental Contract Template — Free Hauler Agreement & Property Waiver',
  description:
    'Free, copy-pasteable roll off dumpster rental contract agreement template. Complete with driveway damage waivers, prohibited hazardous waste clauses, and tonnage overage terms.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/templates/dumpster-rental-contract',
  },
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

      <MarketingNav currentPath="/templates" />

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
          This is a starter dumpster rental contract template you can copy, customize, and print. It is not legal advice and has not been reviewed for your state or province. Have a lawyer adapt it before you use it on a real booking.
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
      <Footer />
    </main>
  );
}
