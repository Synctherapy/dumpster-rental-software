import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  TrendingUp,
  Truck,
  DollarSign,
  Calculator,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';
import { BreadcrumbSchema } from '@/components/schema-org';

export const metadata = {
  title: 'Dumpster Rental Business Guides & Industry Blueprints | RollOS Blog',
  description:
    'Practical, operator-tested guides for independent roll-off dumpster haulers. Learn startup costs, pricing formulas, truck vs trailer equipment, and profit margins.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/blog',
  },
};

const articles = [
  {
    title: 'How to Start a Dumpster Rental Business: Costs, Equipment & Startup Guide',
    slug: '/blog/how-to-start-a-dumpster-rental-business',
    excerpt:
      'The complete step-by-step startup blueprint for launching an independent roll-off company: startup costs ($60k–$150k), DOT licensing, container sizes, and online booking setup.',
    readTime: '12 min read',
    date: 'Oct 2026',
    category: 'Startup Guide',
    icon: Truck,
  },
  {
    title: 'How to Price Dumpster Rentals: The Complete Formula for Roll-Off Haulers',
    slug: '/blog/how-to-price-dumpster-rentals',
    excerpt:
      'Master the base rental + included tonnage + overage fee formula. Prevent landfill fee profit leaks and establish profitable contractor volume pricing.',
    readTime: '10 min read',
    date: 'Oct 2026',
    category: 'Pricing & Margins',
    icon: DollarSign,
  },
  {
    title: 'Roll-Off Truck vs. Dump Trailer: Which Equipment Should You Buy First?',
    slug: '/blog/roll-off-truck-vs-dump-trailer',
    excerpt:
      'Compare initial capital ($25k vs $95k), CDL requirements, driveway safety, and daily container turns to decide between a dump trailer and a dedicated truck.',
    readTime: '9 min read',
    date: 'Oct 2026',
    category: 'Equipment & Fleet',
    icon: ShieldCheck,
  },
  {
    title: 'Dumpster Rental Profit Margins: Real Financial Benchmarks for Haulers',
    slug: '/blog/dumpster-rental-profit-margins',
    excerpt:
      'Real financial benchmarks for 1–5 truck operators: 45–60% gross margins, 15–25% net profit, monthly container turnover, and a realistic Year 1 P&L model.',
    readTime: '11 min read',
    date: 'Oct 2026',
    category: 'Financial Benchmarks',
    icon: TrendingUp,
  },
];

export default function BlogHubPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Blog', item: '/blog' },
  ];

  return (
    <main className="marketing">
      <BreadcrumbSchema items={breadcrumbItems} />
      <MarketingNav currentPath="/blog" />

      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c] transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to Roll Off Dumpster Software
        </Link>

        {/* Header */}
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          HAULER KNOWLEDGE HUB · OPERATOR BLUEPRINTS
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] mb-4 tracking-tight">
          Dumpster Rental Business Guides, Pricing &amp; Equipment
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-12 max-w-3xl">
          Practical, numbers-driven blueprints built specifically for independent roll-off operators running 1 to 5 trucks. No corporate fluff—just real benchmarks, startup roadmaps, and pricing strategies.
        </p>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {articles.map((article) => {
            const Icon = article.icon;
            return (
              <Link
                key={article.slug}
                href={article.slug}
                className="group p-7 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#628f34] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#f4f7f1] text-[#476326] text-xs font-bold uppercase tracking-wider border border-[#dde4d4]">
                      {article.category}
                    </span>
                    <span className="text-xs text-[#7d9382] flex items-center gap-1 font-medium">
                      <Clock size={12} /> {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#1f2d26] mb-3 group-hover:text-[#ea580c] transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-xs md:text-sm text-[#556658] leading-relaxed mb-6">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#edf1ea] flex items-center justify-between text-xs font-bold text-[#ea580c]">
                  <span>Read Full Operator Guide</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Free Hauler Tools Banner */}
        <div className="p-8 rounded-2xl bg-[#f4f7f1] border-2 border-[#d2dec3] my-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ea580c] uppercase tracking-wider mb-2">
            <Calculator size={16} />
            <span>FREE INTERACTIVE HAULER TOOLS</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-2">
            Put the Formulas to Work with Our Free Hauler Calculators
          </h2>
          <p className="text-xs md:text-sm text-[#556658] leading-relaxed mb-5 max-w-2xl">
            Test your landfill overage rates, calculate monthly software savings vs Docket and ServiceCore, or copy our free lawyer-reviewed customer contract template.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/tools/tonnage-calculator" className="btn btn-orange text-xs">
              Tonnage &amp; Overage Calculator
            </Link>
            <Link href="/tools/savings-calculator" className="btn btn-secondary text-xs">
              Software Savings Calculator
            </Link>
            <Link href="/templates/dumpster-rental-contract" className="btn btn-secondary text-xs">
              Dumpster Rental Contract Template
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
