import React from 'react';

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'RollOS',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web browser',
    description:
      'All-in-one roll off dumpster rental software for independent haulers. 24/7 online booking, visual dispatching, driver SMS routing, and automated tonnage billing.',
    url: 'https://rolloffdumpstersoftware.com',
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
