import Link from 'next/link';
import { ArrowRight, FileText, Receipt, ShieldCheck, CheckCircle2, ArrowUpRight, PenTool, AlertTriangle } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Free Dumpster Rental Legal & Business Templates | RollOS',
  description:
    'Free contract agreements, liability waivers, and commercial invoice templates built for roll-off dumpster haulers. Protect your fleet and automate digital signatures.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/templates',
  },
};

export default function TemplatesHubPage() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Dumpster Rental Legal & Business Templates',
    description:
      'Authority hub of free contract agreements, liability waivers, and invoice templates designed specifically for independent roll-off dumpster operators.',
    url: 'https://rolloffdumpstersoftware.com/templates',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Dumpster Rental Contract Template & Property Waiver',
          url: 'https://rolloffdumpstersoftware.com/templates/dumpster-rental-contract',
          description:
            'Standard roll-off dumpster rental contract template with driveway damage waivers, hazardous waste exclusions, and overweight disposal terms.',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Dumpster Rental Invoice Template & Disposal Overage Bill',
          url: 'https://rolloffdumpstersoftware.com/templates/dumpster-invoice',
          description:
            'Professional commercial roll-off invoice outline detailing base container rental, extra day extensions, scale ticket tons, and overage fees.',
        },
      ],
    },
  };

  const templates = [
    {
      title: 'Dumpster Rental Contract & Waiver Template',
      slug: '/templates/dumpster-rental-contract',
      icon: FileText,
      badge: 'Legal & Risk Mitigation',
      headline: 'Protect your roll-off business from cracked driveways, hazardous materials, and disputed fees',
      description:
        'A comprehensive, attorney-reviewed template customized for roll-off operations. Includes driveway damage waivers, concrete/asphalt disclaimer, strict EPA prohibited hazardous waste exclusions, level-fill requirements, and overage fee authorization.',
      clauses: [
        'Driveway & lawn damage waiver (relieving hauler of underground utility / asphalt cracking liability)',
        'Prohibited hazardous waste clause (tires, paint, asbestos, freon, batteries with steep penalty fees)',
        'Water level-fill & tarping safety guidelines under DOT regulations',
        'Pre-authorized credit card billing for landfill tonnage overages and extended day charges',
      ],
      ctaText: 'View & Copy Contract Template',
    },
    {
      title: 'Dumpster Rental Invoice Template',
      slug: '/templates/dumpster-invoice',
      icon: Receipt,
      badge: 'Billing & Cash Flow',
      headline: 'Get paid faster with transparent, dispute-free itemized commercial invoices',
      description:
        'A professional invoice blueprint engineered for container haulers. Clearly separates base delivery & rental fees, extra rental days, included tonnage allowance, gross landfill scale slip weight, and calculated overages.',
      clauses: [
        'Itemized line items for base container size (10, 15, 20, 30, 40 yard) and rental duration',
        'Transparent tonnage math showing included allowance vs. certified scale ticket net weight',
        'Direct scale ticket slip attachment section to eliminate credit card chargebacks',
        'Clear payment terms and instant digital payment link integration',
      ],
      ctaText: 'View & Copy Invoice Template',
    },
  ];

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <MarketingNav currentPath="/templates" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          FREE LEGAL & BUSINESS TEMPLATES · ROLL-OFF OPERATIONAL HUBS
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] leading-tight mb-4">
          Free contracts, waivers, and invoice templates for dumpster haulers.
        </h1>
        <p className="text-lg text-[#556658] leading-relaxed mb-8 max-w-3xl">
          Running a roll-off company without solid legal terms is a ticking time bomb. A single cracked stamped-concrete driveway or a load of hidden asbestos can wipe out months of profit. Use these free, copy-pasteable templates to protect your equipment and streamline your billing.
        </p>

        {/* Above The Fold CTA Box */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-[#17251e] to-[#243d2e] text-white rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#4ade80] uppercase">
              <PenTool size={14} /> Digital Signatures Built-In
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Tired of paper agreements? Capture digital signatures automatically with RollOS
            </h2>
            <p className="text-xs md:text-sm text-[#cbd5cc] max-w-xl">
              Paper waivers get lost on the truck floor, soaked in the rain, or signed by someone without authority. RollOS presents terms directly on your online booking widget and driver SMS links, capturing tamper-proof digital signatures with IP and timestamps before the container ever hits the ground.
            </p>
          </div>
          <Link
            href="/signup"
            className="btn btn-orange shrink-0 whitespace-nowrap text-sm py-3 px-6 font-bold"
          >
            Start Free Demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Template Cards */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1f2d26]">Browse Free Hauler Templates</h2>
            <p className="text-sm text-[#556658]">Ready to copy, modify, and customize for your local municipal jurisdiction.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.slug}
                className="bg-white border border-[#dde4d4] rounded-2xl p-7 flex flex-col justify-between shadow-sm hover:border-[#ea580c] transition-all hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] group-hover:bg-[#ea580c] group-hover:text-white transition-colors">
                      <Icon size={24} />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ea580c] bg-[#fff7ed] px-3 py-1 rounded-full border border-[#fed7aa]">
                      {tpl.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1f2d26] mb-2">
                    <Link href={tpl.slug} className="hover:text-[#ea580c] transition-colors">
                      {tpl.title}
                    </Link>
                  </h3>
                  <div className="text-sm font-semibold text-[#3b4e41] mb-3">{tpl.headline}</div>
                  <p className="text-xs text-[#556658] leading-relaxed mb-6">{tpl.description}</p>

                  <div className="mb-6 border-t border-[#f0f4ea] pt-4">
                    <div className="text-xs font-bold text-[#1f2d26] uppercase tracking-wider mb-3">Key Clauses Included:</div>
                    <ul className="space-y-2.5">
                      {tpl.clauses.map((clause) => (
                        <li key={clause} className="flex items-start gap-2 text-xs text-[#415346]">
                          <CheckCircle2 size={14} className="text-[#22c55e] shrink-0 mt-0.5" />
                          <span>{clause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href={tpl.slug}
                  className="btn btn-dark w-full text-xs py-3 justify-center font-bold group-hover:bg-[#ea580c] group-hover:border-[#ea580c] transition-colors inline-flex items-center gap-2"
                >
                  {tpl.ctaText} <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Silo Deep-Dive: Legal Risks That Kill Dumpster Businesses */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-[#e2e8da]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26]">
              The 3 Major Liability Traps Every Roll-Off Hauler Must Guard Against
            </h2>
            <div className="text-sm text-[#4d5e53] space-y-4 leading-relaxed">
              <p>
                When you drop an 8,000-lb steel container onto someone’s driveway—which will soon hold another 6,000 to 10,000 lbs of heavy debris—the legal exposure is substantial. Many new haulers rely on handshake agreements or vague verbal promises, only to face expensive repair bills or toxic landfill rejection fines.
              </p>
              
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-white border border-[#dde4d4] rounded-xl">
                  <h4 className="font-bold text-[#1f2d26] text-sm mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#ea580c]" /> 1. Concrete & Subsurface Property Damage
                  </h4>
                  <p className="text-xs text-[#556658] leading-relaxed">
                    Roll-off trucks and loaded steel bins exert massive point-pressure. Pavers can shift, decorative concrete can crack, and hidden septic tanks or sprinkler lines can collapse. Your contract must explicitly state that placement is directed by the customer at their sole risk, and boards must be requested if protection is desired.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#dde4d4] rounded-xl">
                  <h4 className="font-bold text-[#1f2d26] text-sm mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#ea580c]" /> 2. Prohibited Environmental Hazards & Contamination
                  </h4>
                  <p className="text-xs text-[#556658] leading-relaxed">
                    Landfills and transfer stations charge severe penalties (often $150 to $500 per item) if a load contains tires, lead batteries, freon appliances, or biomedical items. Your agreement must clearly enumerate prohibited items and authorize automatic penalty charges to the customer’s card on file.
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#dde4d4] rounded-xl">
                  <h4 className="font-bold text-[#1f2d26] text-sm mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#ea580c]" /> 3. Chargebacks on Tonnage Overages
                  </h4>
                  <p className="text-xs text-[#556658] leading-relaxed">
                    Customers who load wet dirt, drywall, or roofing shingles often experience sticker shock when the landfill ticket comes in over their 2-ton allowance. Without signed overage authorizations and scale ticket proof, credit card banks will side with the customer during disputes every single time.
                  </p>
                </div>
              </div>
            </div>

            {/* RollOS Automation Advantage */}
            <div className="p-6 bg-[#f7f9f4] border border-[#dce3d4] rounded-xl">
              <h3 className="text-base font-bold text-[#1f2d26] mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#22c55e]" /> How RollOS Automates Legal Compliance
              </h3>
              <p className="text-xs text-[#556658] leading-relaxed mb-4">
                Instead of managing paper waivers in greasy clipboards, RollOS embeds your liability terms directly into checkout and delivery:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#415346]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e]" />
                  <span>Mandatory checkbox agreement before customer pays</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e]" />
                  <span>Digital driver delivery signature on phone</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e]" />
                  <span>Photo proof of placement stored permanently</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[#22c55e]" />
                  <span>Automatic scale ticket upload & overage charge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Silo Sidebar */}
          <div className="space-y-6">
            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-[#1f2d26] mb-3">Free Calculators</h3>
              <p className="text-xs text-[#556658] mb-4">
                Need to quickly calculate overages or software cost savings?
              </p>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <Link
                    href="/tools/tonnage-calculator"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>Tonnage & Overage Calculator</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools/savings-calculator"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>Software Savings Calculator</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tools"
                    className="text-[#ea580c] hover:underline flex items-center gap-1 mt-2"
                  >
                    <span>View all free tools →</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm">
              <h3 className="text-base font-bold text-[#1f2d26] mb-3">Software Features</h3>
              <p className="text-xs text-[#556658] mb-4">
                See how RollOS replaces manual paperwork with automated digital workflows.
              </p>
              <ul className="space-y-2.5 text-xs font-semibold">
                <li>
                  <Link
                    href="/features/tonnage-billing"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>Scale Tickets & Tonnage Billing</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features/driver-routes"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>1-Tap Driver SMS Routes</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features/online-booking"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>24/7 Online Booking Widget</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features/dispatch-board"
                    className="text-[#2d4034] hover:text-[#ea580c] flex items-center justify-between transition-colors"
                  >
                    <span>Drag & Drop Dispatch Board</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="p-8 bg-[#eef3e6] border border-[#d2dec3] rounded-2xl text-center">
          <div className="eyebrow text-xs font-bold text-[#577242] uppercase tracking-wider mb-2">
            GO PAPERLESS IN 3 MINUTES
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#1f2d26] mb-3">
            Tired of paper agreements? Capture digital signatures automatically with RollOS
          </h3>
          <p className="text-sm text-[#556658] max-w-xl mx-auto mb-6 leading-relaxed">
            Eliminate lost clipboards, illegible signatures, and disputed invoices. RollOS puts your terms in front of every customer automatically.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-orange">
              Start Free Demo <ArrowRight size={14} />
            </Link>
            <Link href="/features" className="btn btn-secondary">
              Explore All Features
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
