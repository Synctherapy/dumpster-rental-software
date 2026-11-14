import { Scale, ShieldCheck, CreditCard } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { InvoiceTemplateView } from '@/components/invoice-template-view';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Dumpster Rental Invoice Template — Free Overage & Disposal Bill',
  description:
    'Free commercial roll-off dumpster rental invoice template for haulers. Itemize base rental, extra days, certified scale slip weights, tare/gross math, and evidence-backed overages.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/templates/dumpster-invoice',
  },
};

export default function InvoiceTemplatePage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: 'Commercial Roll-Off Dumpster Rental Invoice & Overage Bill Template',
    description:
      'Standard commercial roll-off dumpster rental invoice template engineered for independent haulers to itemize base rentals, extended days, certified landfill scale slip tickets, tare/gross weights, and credit card overages.',
    url: 'https://rolloffdumpstersoftware.com/templates/dumpster-invoice',
    encodingFormat: 'text/plain',
    isAccessibleForFree: true,
    creator: {
      '@type': 'SoftwareApplication',
      name: 'RollOS Roll Off Dumpster Software',
      url: 'https://rolloffdumpstersoftware.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RollOS',
      url: 'https://rolloffdumpstersoftware.com',
    },
  };

  return (
    <main className="marketing">
      {/* Schema.org DigitalDocument JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="print-hide">
        <MarketingNav currentPath="/templates" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="print-hide">
          <SemanticBreadcrumb
            items={[
              { name: 'Home', item: '/' },
              { name: 'Templates', item: '/templates' },
              { name: 'Dumpster Rental Invoice Template', item: '/templates/dumpster-invoice' },
            ]}
          />

          <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
            FREE OPERATIONAL HAULER BILLING TEMPLATES · 2026 COMMERCIAL STANDARD
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#20302a] mb-4 leading-tight">
            Commercial Dumpster Rental Invoice Template for Disposal & Overage Billing
          </h1>

          <p className="text-lg text-[#556658] leading-relaxed mb-4">
            Clear, documented invoicing is the single most important defense against credit card chargebacks and delayed contractor payments. While merchants across industries win only about 20% of disputes on average without documentation, signed rental terms, timestamped photos, and certified landfill scale tickets give haulers strong, verifiable evidence to contest disputes. Use this free, copy-pasteable <strong>commercial roll-off dumpster invoice template</strong> designed specifically for independent waste haulers to itemize base rentals, extra calendar days, and certified scale tickets with complete mathematical transparency.
          </p>

          <div className="p-4 mb-6 bg-[#fffbeb] border border-[#fef3c7] rounded-xl text-xs text-[#92400e] leading-relaxed">
            <strong>Dispute Documentation Best Practice:</strong> Card issuers decide disputes based on objective evidence. Always attach certified transfer station scale slips, timestamped delivery/pickup photos, and electronically signed customer agreements to maximize your win rate on contested overages.
          </div>

          {/* Above-the-fold Trust & Verification Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl flex items-start gap-3 shadow-sm">
              <Scale size={20} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#1f2d26]">Certified Scale Breakdown</div>
                <p className="text-[11px] text-[#687864] mt-0.5">
                  Displays inbound gross, outbound tare, and net tonnage backed by official state scale slips.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl flex items-start gap-3 shadow-sm">
              <ShieldCheck size={20} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#1f2d26]">Documented Dispute Defense</div>
                <p className="text-[11px] text-[#687864] mt-0.5">
                  Embeds audit clauses, placement photos, and signed waiver cross-references to provide solid evidence for card dispute responses.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#dde4d4] rounded-xl flex items-start gap-3 shadow-sm">
              <CreditCard size={20} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-[#1f2d26]">Dual Settlement Workflow</div>
                <p className="text-[11px] text-[#687864] mt-0.5">
                  Supports residential card-on-file auto-settlement and commercial contractor Net-30 PO billing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Invoice Template Viewer & Guide */}
        <InvoiceTemplateView />
      </div>

      <div className="print-hide">
        <Footer />
      </div>
    </main>
  );
}
