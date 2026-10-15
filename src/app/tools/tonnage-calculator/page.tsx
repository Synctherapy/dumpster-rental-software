import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { OverageCalculator } from '@/components/overage-calculator';

export const metadata = {
  title: 'Dumpster Tonnage & Disposal Overage Calculator — Free Hauler Tool',
  description:
    'Calculate dumpster rental disposal overages from included tonnage allowance, actual certified scale weight, and your per-ton rate.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/tools/tonnage-calculator',
  },
};

export default function Calculator() {
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Dumpster Tonnage & Disposal Overage Calculator',
    description:
      'Free operational utility for roll-off dumpster haulers to calculate landfill scale ticket overages and automated disposal billing charges.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: 'https://rolloffdumpstersoftware.com/tools/tonnage-calculator',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <MarketingNav currentPath="/tools" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <SemanticBreadcrumb
          items={[
            { name: 'Home', item: '/' },
            { name: 'Free Tools', item: '/tools' },
            { name: 'Dumpster Tonnage Calculator', item: '/tools/tonnage-calculator' },
          ]}
        />
        <OverageCalculator />
      </div>
      <Footer />
    </main>
  );
}
