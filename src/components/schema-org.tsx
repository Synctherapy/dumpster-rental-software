import React from 'react';

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://rolloffdumpstersoftware.com/#organization',
        name: 'RollOS',
        url: 'https://rolloffdumpstersoftware.com',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://rolloffdumpstersoftware.com/#logo',
          url: 'https://rolloffdumpstersoftware.com/icon.svg',
          caption: 'RollOS Logo',
        },
        description:
          'RollOS provides all-in-one roll-off dumpster rental software, 24/7 online booking, visual multi-truck dispatching, and automated tonnage billing for small and mid-size waste haulers.',
        sameAs: [
          'https://www.linkedin.com/company/rollos',
          'https://www.g2.com/products/rollos/reviews',
          'https://www.crunchbase.com/organization/rollos-e3d4',
          'https://alternativeto.net/software/rollos/',
          'https://www.saashub.com/rollos-alternatives',
          'https://www.facebook.com/rollosdumpsterrentalsoftware',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://rolloffdumpstersoftware.com/#website',
        url: 'https://rolloffdumpstersoftware.com',
        name: 'RollOS Dumpster Rental Software',
        publisher: {
          '@id': 'https://rolloffdumpstersoftware.com/#organization',
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://rolloffdumpstersoftware.com/#software',
        name: 'RollOS',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Waste Management Logistics & Roll-Off Dispatch Software',
        operatingSystem: 'Web browser, iOS Safari, Android Chrome',
        description:
          'All-in-one roll off dumpster rental software for small and mid-size haulers. 24/7 online booking, visual multi-truck dispatching, driver SMS routing, and automated tonnage billing.',
        url: 'https://rolloffdumpstersoftware.com',
        sameAs: [
          'https://www.g2.com/products/rollos/reviews',
          'https://www.crunchbase.com/organization/rollos-e3d4',
          'https://alternativeto.net/software/rollos/',
          'https://www.saashub.com/rollos-alternatives',
          'https://www.linkedin.com/company/rollos',
          'https://www.facebook.com/rollosdumpsterrentalsoftware',
        ],
        image: 'https://rolloffdumpstersoftware.com/images/screenshots/roll-off-dumpster-dispatch-board-software.png',
        about: [
          {
            '@type': 'Thing',
            name: 'Roll-off dumpster',
            sameAs: [
              'https://en.wikipedia.org/wiki/Roll-off_(dumpster)',
              'https://www.wikidata.org/wiki/Q7360866',
            ],
          },
          {
            '@type': 'Thing',
            name: 'Waste management',
            sameAs: [
              'https://en.wikipedia.org/wiki/Waste_management',
              'https://www.wikidata.org/wiki/Q180388',
            ],
          },
          {
            '@type': 'Thing',
            name: 'Software as a service',
            sameAs: [
              'https://en.wikipedia.org/wiki/Software_as_a_service',
              'https://www.wikidata.org/wiki/Q1254596',
            ],
          },
        ],
        screenshot: [
          'https://rolloffdumpstersoftware.com/images/screenshots/roll-off-dumpster-dispatch-board-software.png',
          'https://rolloffdumpstersoftware.com/images/screenshots/dumpster-rental-online-booking-system.png',
          'https://rolloffdumpstersoftware.com/images/screenshots/mobile-driver-sms-delivery-proof-app.png',
          'https://rolloffdumpstersoftware.com/images/screenshots/dumpster-fleet-inventory-management-software.png',
          'https://rolloffdumpstersoftware.com/images/screenshots/dumpster-rental-tonnage-invoice-scale-ticket.png',
        ],
        author: {
          '@id': 'https://rolloffdumpstersoftware.com/#organization',
        },
        publisher: {
          '@id': 'https://rolloffdumpstersoftware.com/#organization',
        },
        offers: [
          {
            '@type': 'Offer',
            name: 'Free Plan',
            price: '0',
            priceCurrency: 'USD',
            description: 'Unlimited dumpsters, 24/7 online booking widget, and visual dispatch board.',
          },
          {
            '@type': 'Offer',
            name: 'Starter Plan',
            price: '29',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '29',
              priceCurrency: 'USD',
              unitText: 'MONTH',
            },
            description: 'Offline cash/check logging, Google Calendar & Apple iCal sync.',
          },
          {
            '@type': 'Offer',
            name: 'Growth Plan',
            price: '149',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '149',
              priceCurrency: 'USD',
              unitText: 'MONTH',
            },
            description: 'White-label booking, automated 2-way Google reviews, multiple driver dispatching.',
          },
        ],
        featureList: [
          '24/7 Online Dumpster Booking Widget',
          'Visual Drag-and-Drop Dispatch Board',
          '1-Tap Driver SMS Routes (No App Download)',
          'Automated Scale Ticket & Tonnage Invoicing',
          'Instant Stripe Connect Direct Payouts',
          'Customer Liability Damage Waiver Signatures',
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; item: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item.startsWith('http')
        ? crumb.item
        : `https://rolloffdumpstersoftware.com${crumb.item}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = 'Daryl Stubbs',
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url.startsWith('http') ? url : `https://rolloffdumpstersoftware.com${url}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url.startsWith('http') ? url : `https://rolloffdumpstersoftware.com${url}`,
    },
    author: {
      '@type': 'Person',
      name: authorName,
      jobTitle: 'Founder & Software Engineer',
      url: 'https://rolloffdumpstersoftware.com/about',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://rolloffdumpstersoftware.com/#organization',
      name: 'RollOS',
      url: 'https://rolloffdumpstersoftware.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rolloffdumpstersoftware.com/icon.svg',
      },
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

