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
          'RollOS provides all-in-one dumpster rental software, online booking, and visual dispatching for independent roll-off haulers.',
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
        operatingSystem: 'Web browser',
        description:
          'All-in-one roll off dumpster rental software for independent haulers. 24/7 online booking, visual dispatching, driver SMS routing, and automated tonnage billing.',
        url: 'https://rolloffdumpstersoftware.com',
        image: 'https://rolloffdumpstersoftware.com/images/screenshots/roll-off-dumpster-dispatch-board-software.png',
        screenshot: [
          'https://rolloffdumpstersoftware.com/images/screenshots/roll-off-dumpster-dispatch-board-software.png',
          'https://rolloffdumpstersoftware.com/images/screenshots/dumpster-rental-online-booking-system.png',
          'https://rolloffdumpstersoftware.com/images/screenshots/mobile-driver-sms-delivery-proof-app.png',
          'https://rolloffdumpstersoftware.com/images/screenshots/dumpster-fleet-inventory-management-software.png',
          'https://rolloffdumpstersoftware.com/images/screenshots/roll-off-container-delivery-pickup-calendar.png',
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
