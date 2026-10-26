import React from 'react';
import Link from 'next/link';
import {
  Globe,
  Truck,
  Smartphone,
  Scale,
  Calendar,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Star,
  Banknote,
  Sliders,
  DollarSign,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { FAQPageSchema } from '@/components/schema-org';

export const STANDOUT_12_FEATURES = [
  {
    icon: Globe,
    title: '24/7 Self-Service Booking Widget',
    desc: 'Homeowners and contractors book online from your website, select sizes, and pay upfront while you sleep.',
    badge: 'Core Feature',
    href: '/features/online-booking',
    linkText: 'Explore dumpster rental online booking system',
  },
  {
    icon: Truck,
    title: 'Visual Drag-and-Drop Dispatch',
    desc: 'Assign drop-offs, swaps, and pickups across drivers on a fast visual board that eliminates dry-erase clutter.',
    badge: 'Operations',
    href: '/features/dispatch-board',
    linkText: 'Explore roll-off dispatch software',
  },
  {
    icon: Smartphone,
    title: 'Zero-App Driver SMS Routing',
    desc: 'Drivers get daily manifest links via SMS. Opens instantly in browser with 1-tap GPS and photo proof capture.',
    badge: 'Driver Loved',
    href: '/features/driver-routes',
    linkText: 'Explore dumpster driver routing software',
  },
  {
    icon: Scale,
    title: 'Scale Ticket & Tonnage Billing',
    desc: 'Snap a landfill scale slip photo. RollOS calculates overweight tons and automatically bills card on file.',
    badge: 'Revenue Protection',
    href: '/features/tonnage-billing',
    linkText: 'Explore dumpster tonnage billing software',
  },
  {
    icon: Sliders,
    title: 'Real-Time Container Inventory',
    desc: 'Track every can: Delivered, In Yard, Swapped, or Overdue. Never accidentally double-book a 20-yarder.',
    badge: 'Inventory',
    href: '/features/dispatch-board',
    linkText: 'Track container fleet inventory',
  },
  {
    icon: ShieldCheck,
    title: 'Digital Damage Waiver Signing',
    desc: 'Collect legal liability e-signatures during checkout to protect against driveway damage claims & disputes.',
    badge: 'Legal Defense',
    href: '/templates/dumpster-rental-contract',
    linkText: 'Download dumpster rental contract template',
  },
  {
    icon: Calendar,
    title: 'Google & Apple Calendar Sync',
    desc: 'Deliveries and pickups push automatically to your phone calendar via real-time iCal feed.',
    badge: 'Starter Plan',
    href: '/pricing',
    linkText: 'View Starter Plan calendar sync',
  },
  {
    icon: MessageSquare,
    title: 'Automated Customer SMS Updates',
    desc: 'Keep customers in the loop with automated "Driver En Route" and "Dumpster Delivered" text alerts.',
    badge: 'Customer CX',
    href: '/features/driver-routes',
    linkText: 'Learn driver & customer SMS alerts',
  },
  {
    icon: Star,
    title: 'Automated 2-Way Google Reviews',
    desc: 'Automatically text happy customers review links right after pickup to dominate local Google Maps search.',
    badge: 'Growth Engine',
    href: '/pricing',
    linkText: 'Explore Growth tier review automation',
  },
  {
    icon: Banknote,
    title: 'Offline Cash & Check Logging',
    desc: 'Record in-person contractor payments, commercial trade balances, and offline settlements in one ledger.',
    badge: 'Flexible Billing',
    href: '/pricing',
    linkText: 'View offline payment logging',
  },
  {
    icon: CreditCard,
    title: 'Instant Stripe Connect Direct Payouts',
    desc: 'Funds deposit directly into your business bank account. No middleman withholding your cash flow.',
    badge: 'Fast Cash',
    href: '/features/online-booking',
    linkText: 'See Stripe Connect payouts',
  },
  {
    icon: DollarSign,
    title: 'Custom Landfill Surcharges & Board Fees',
    desc: 'Add optional driveway protection wood boards ($25) or county dump fuel surcharges with 1 click.',
    badge: 'Margin Boost',
    href: '/tools/tonnage-calculator',
    linkText: 'Use dumpster tonnage calculator',
  },
];

export function StandoutFeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {STANDOUT_12_FEATURES.map((feat) => {
        const Icon = feat.icon;
        return (
          <Link
            key={feat.title}
            href={feat.href}
            className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm hover:border-[#ea580c] hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-[#eef3e6] text-[#2d4034] group-hover:bg-[#ffedd5] group-hover:text-[#ea580c] transition-colors">
                  <Icon size={20} />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#687864] bg-[#f2f6ee] px-2.5 py-1 rounded-full border border-[#dde4d4]">
                  {feat.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1f2d26] mb-2 group-hover:text-[#ea580c] transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs text-[#556658] leading-relaxed">{feat.desc}</p>
            </div>
            <div className="pt-4 text-xs font-bold text-[#ea580c] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>{feat.linkText}</span>
              <ArrowRight size={13} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export function FeaturesComparisonMatrix() {
  const rows = [
    {
      feature: 'Monthly Base Software Fee',
      rollos: '$0/mo Free (or $29/mo Starter)',
      whiteboard: '$0 / free',
      legacy: '$299 – $700+ / mo',
    },
    {
      feature: 'Mandatory Setup / Onboarding Fee',
      rollos: '$0 (Self-serve in 3 min)',
      whiteboard: '$0',
      legacy: '$500 – $1,500 mandatory',
    },
    {
      feature: 'Driver Mobile Experience',
      rollos: 'Instant SMS link (0 App Downloads)',
      whiteboard: 'Paper printout / phone call',
      legacy: 'Bulky App Store app + logins',
    },
    {
      feature: '24/7 After-Hours Online Booking',
      rollos: 'Yes (collects upfront card pay)',
      whiteboard: 'No (missed calls while driving)',
      legacy: 'Add-on module or slow forms',
    },
    {
      feature: 'Landfill Scale Ticket Overage Billing',
      rollos: '1-tap auto-calc & charges card',
      whiteboard: 'Manual spreadsheet math',
      legacy: 'Manual back-office entry',
    },
    {
      feature: 'Rental Contracts & Driveway Waivers',
      rollos: 'Signed digitally during checkout',
      whiteboard: 'Paper clipboard on delivery',
      legacy: 'Separate DocuSign integration',
    },
    {
      feature: 'Lock-in Contract',
      rollos: 'None (Cancel anytime)',
      whiteboard: 'None',
      legacy: 'Annual contracts standard',
    },
  ];

  return (
    <div className="overflow-x-auto border border-[#dde4d4] rounded-2xl bg-white shadow-sm">
      <table className="w-full text-left border-collapse text-xs md:text-sm">
        <thead>
          <tr className="bg-[#f7f9f4] border-b border-[#dde4d4]">
            <th className="p-4 font-bold text-[#1f2d26]">Feature / Capability</th>
            <th className="p-4 font-extrabold text-[#ea580c] bg-[#fffaf5] border-x border-[#fed7aa]">
              RollOS
            </th>
            <th className="p-4 font-semibold text-[#556658]">Whiteboard / Paper</th>
            <th className="p-4 font-semibold text-[#556658]">Legacy Software (Docket / ServiceCore)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.feature}
              className={`border-b border-[#edf1e8] ${idx % 2 === 1 ? 'bg-[#fafbfa]' : 'bg-white'}`}
            >
              <td className="p-4 font-medium text-[#1f2d26]">{row.feature}</td>
              <td className="p-4 font-bold text-[#1f2d26] bg-[#fffdfa] border-x border-[#fed7aa]/50 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#22c55e] shrink-0" />
                <span>{row.rollos}</span>
              </td>
              <td className="p-4 text-[#667768]">{row.whiteboard}</td>
              <td className="p-4 text-[#667768]">{row.legacy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HaulerPersonas() {
  const personas = [
    {
      title: 'Solo Hauler (1 Truck)',
      highlight: 'Stop Losing Evening Calls While Driving',
      desc: 'You drive the truck, answer the phone, and manage billing. RollOS gives you a 24/7 online booking page so customers order and pay while you’re behind the wheel or with family.',
      bullets: [
        'Free plan available ($0/month)',
        'Capture credit card payments upfront',
        'Automatic damage waiver signature',
      ],
      cta: 'Start Solo Free',
      href: '/signup',
    },
    {
      title: 'Growing Fleet (2–5 Trucks)',
      highlight: 'Eliminate Whiteboard Chaos & Driver Phone Calls',
      desc: 'Dispatch multiple drivers without shouting across the yard. Send daily routes via text message links with zero apps to install, and track container inventory in real time.',
      bullets: [
        'Visual drag-and-drop dispatch calendar',
        'SMS manifests with GPS directions',
        'Photo proof of placement at drop-off',
      ],
      cta: 'Start Starter Plan ($29/mo)',
      href: '/signup',
    },
    {
      title: 'Established Fleet (6+ Trucks)',
      highlight: 'Automate Tonnage Billing & Dominate Local Search',
      desc: 'Protect profit margins by automatically billing transfer station scale slip overages to customer cards. Turn completed jobs into 5-star Google reviews on autopilot.',
      bullets: [
        'Scale ticket snapshot OCR & billing',
        'Automated 2-way Google review SMS',
        'White-label customer booking experience',
      ],
      cta: 'Explore Growth Plan ($99/mo)',
      href: '/pricing',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {personas.map((p) => (
        <div
          key={p.title}
          className="p-6 bg-white border border-[#dde4d4] rounded-2xl shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#ea580c] mb-1">
              {p.title}
            </div>
            <h3 className="text-base font-bold text-[#1f2d26] mb-3">{p.highlight}</h3>
            <p className="text-xs text-[#556658] leading-relaxed mb-4">{p.desc}</p>
            <div className="space-y-2 mb-6">
              {p.bullets.map((b) => (
                <div key={b} className="flex items-center gap-2 text-xs text-[#3b4e41]">
                  <CheckCircle2 size={14} className="text-[#22c55e] shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href={p.href} className="btn btn-secondary text-xs text-center font-bold">
            {p.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

export const FEATURES_FAQS = [
  {
    question: 'How does RollOS differ from Docket or ServiceCore?',
    answer:
      'Docket and ServiceCore cost $300 to $700+ per month, lock you into annual contracts, mandate $1,000+ onboarding fees, and require drivers to download bulky App Store apps. RollOS starts free ($0/mo), requires zero sales demos, and drivers access their routes instantly via simple mobile web SMS links with zero app downloads.',
  },
  {
    question: 'Do my drivers really not need to download an app?',
    answer:
      'Yes! Drivers hate downloading corporate apps, remembering passwords, and managing phone storage. With RollOS, your driver receives a secure text message link each morning. Tapping it opens their daily manifest with 1-tap Google/Apple Maps GPS navigation, gate codes, and photo upload buttons right in their mobile browser.',
  },
  {
    question: 'How do I get paid for dumpster rentals?',
    answer:
      'RollOS connects directly to your business bank account via Stripe Connect. When homeowners or contractors book online, funds deposit directly into your account on standard Stripe payout schedules. RollOS never holds your revenue.',
  },
  {
    question: 'How does automated tonnage and scale ticket overage billing work?',
    answer:
      'When your driver leaves the landfill or transfer station, they snap a photo of the certified scale slip on their phone. RollOS records tare/gross weight, calculates any excess tonnage above your included limit, and charges the customer credit card on file with the scale ticket photo attached to their itemized receipt.',
  },
  {
    question: 'Can I embed the booking widget on my WordPress, Wix, or Squarespace site?',
    answer:
      'Yes. RollOS provides a lightweight 1-line HTML embed code that works on any website builder (WordPress, Squarespace, Wix, Webflow, GoDaddy, etc.) or can be shared as a standalone hosted booking link on your Google Business Profile and social media.',
  },
  {
    question: 'Can I cancel or switch plans anytime?',
    answer:
      'Yes. There are no contracts, no cancellation fees, and no minimum commitments. You can start on our Free plan and upgrade or downgrade whenever your fleet needs change.',
  },
];

export function FeaturesFAQSection() {
  return (
    <div>
      <FAQPageSchema faqs={FEATURES_FAQS} />
      <div className="space-y-4">
        {FEATURES_FAQS.map((faq) => (
          <div key={faq.question} className="p-5 bg-white border border-[#dde4d4] rounded-2xl">
            <h3 className="text-sm md:text-base font-bold text-[#1f2d26] mb-2">{faq.question}</h3>
            <p className="text-xs md:text-sm text-[#556658] leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
