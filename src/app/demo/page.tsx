import Link from 'next/link';
import {
  ArrowRight,
  Box,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck,
  LayoutDashboard,
  Lock,
  Rocket,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';
import { DemoSwitcherBar } from '@/components/demo-switcher-bar';

export const metadata = {
  title: 'Interactive Live Demo — Test All 5 Modules Free | RollOS',
  description:
    'Test the entire RollOS dumpster rental software suite live in an isolated private sandbox: visual dispatch board, 24/7 customer checkout, SMS driver routes, VIP contractor portal, and digital waivers.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/demo',
  },
};

export default function DemoHubPage() {
  const modules = [
    {
      step: 'MODULE 1 · HAULER BACK-OFFICE (10 SCREENS)',
      title: 'Visual Dispatch Board, Fleet, CRM & Growth Hub',
      desc: 'Drag-and-drop jobs onto drivers and cans, enter phone orders, manage your 18-container sample fleet, bill landfill scale-ticket overages, print QR bin decals, and view ROI reports.',
      href: '/dashboard?demo=1',
      cta: 'Open Hauler Dispatch Board',
      primary: true,
      icon: LayoutDashboard,
      highlights: [
        'Drag-and-drop dispatch & live can tracking',
        'Customers & Commercial Trade CRM directory',
        '1-click scale ticket overage calculator & billing',
        'Weatherproof QR bin decal generator & missed-call SMS setup',
      ],
      sublinks: [
        { label: 'Dispatch Board', href: '/dashboard?demo=1', icon: LayoutDashboard },
        { label: 'Customers CRM', href: '/customers?demo=1', icon: Users },
        { label: 'Containers', href: '/inventory?demo=1', icon: Box },
        { label: 'Payments & Overages', href: '/payments?demo=1', icon: CreditCard },
        { label: 'Reports & ROI', href: '/reports?demo=1', icon: TrendingUp },
        { label: 'QR Kit & Growth', href: '/growth?demo=1', icon: Rocket },
        { label: 'Pricing & Settings', href: '/settings?demo=1', icon: Settings2 },
      ],
    },
    {
      step: 'MODULE 2 · CUSTOMER STOREFRONT',
      title: '24/7 Online Dumpster Booking Widget',
      desc: 'Test what homeowners and contractors see on your website or Google Business Profile. Try Austin ZIP code 78704, pick a 10–40 yd container, add driveway boards, and place a test order.',
      href: '/book/greenline',
      cta: 'Test Customer Checkout',
      primary: false,
      icon: ShoppingBag,
      highlights: [
        'Instant 10, 20, 30 & 40-yard pricing + ZIP validation (try 78704)',
        'Driveway protective boards upsell & sales tax math',
        'Orders placed here appear immediately on your Demo Dispatch Board',
      ],
    },
    {
      step: 'MODULE 3 · DRIVER MOBILE WEB (ZERO APP)',
      title: '1-Tap SMS Driver Route & Scale Slip Capture',
      desc: 'Open the exact encrypted browser link your driver gets by text—no App Store download or password required. Test turn-by-turn stops, the lbs-to-tons scale calculator, and photo proof.',
      href: '/demo/driver',
      useAnchor: true,
      cta: 'Open Live Driver Route',
      primary: false,
      icon: Truck,
      highlights: [
        'Works in any iPhone/Android browser via SMS magic link',
        'Built-in landfill lbs-to-tons converter & scale ticket upload',
        'Driveway drop photo verification & 1-tap customer status texts',
      ],
    },
    {
      step: 'MODULE 4 · COMMERCIAL ACCOUNTS',
      title: 'VIP Contractor Net-30 Self-Serve Portal',
      desc: 'See how your top roofers, builders, and remodelers schedule 1-tap "Empty & Return" container swaps, request new site drops, and review itemized Net-30 monthly statements.',
      href: '/contractor/greenline?account=Liam+Anderson',
      cta: 'Open VIP Contractor Portal',
      primary: false,
      icon: Building2,
      highlights: [
        '1-tap "Empty & Return" swap requests on active jobsite cans',
        'New jobsite container drops without playing phone tag',
        'Printable monthly Net-30 statement with tonnage breakdowns',
      ],
    },
    {
      step: 'MODULE 5 · CHARGEBACK & PROPERTY PROTECTION',
      title: 'Digital Rental Agreement, Waiver & Early Pickup',
      desc: 'Inspect the mobile customer contract & property damage waiver sent with every order—complete with prohibited debris surcharges, timestamped e-signature, and 1-tap Early Pickup requests.',
      href: '/agreement/job-6',
      cta: 'View Signed Agreement & Waiver',
      primary: false,
      icon: FileCheck,
      highlights: [
        'Write-once ESIGN waiver with timestamp & IP evidence',
        'Customizable mattress, tire, freon & dry-run surcharge schedule',
        '"Done Loading? Request Early Pickup" button to turn cans faster',
      ],
    },
  ];

  return (
    <main className="marketing" style={{ background: '#f6f8f3', minHeight: '100vh' }}>
      <DemoSwitcherBar active="hub" />
      <MarketingNav currentPath="/demo" />

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '44px 20px 68px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 32px' }}>
          <div
            className="eyebrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span className="dot" /> Full-Suite Interactive Sandbox · No Login Required
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4.2vw, 44px)', lineHeight: 1.12, marginBottom: 14 }}>
            Test every part of RollOS <em>live right now.</em>
          </h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#4a5d4e', margin: '0 auto' }}>
            Don’t sit through a 45-minute sales call just to see how the software works. Click into
            any of the <strong>5 connected views below</strong>—book a dumpster as a customer,
            dispatch it on the board, run the route as a driver, or request a swap as a VIP roofer.
          </p>

          {/* Private Sandbox Safety Banner */}
          <div
            style={{
              marginTop: 20,
              padding: '11px 16px',
              background: '#eef4e8',
              border: '1px solid #cfe0c3',
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: '#1f3124',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} color="#628f34" />
              Isolated Private Browser Sandbox
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={15} color="#628f34" />
              $0 Real Card Charges · Simulated SMS & Email
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={15} color="#628f34" />
              1-Click Reset Anytime
            </span>
          </div>
        </div>

        {/* Hero Card: Module 1 (Full Back-Office) */}
        {(() => {
          const hero = modules[0];
          const HeroIcon = hero.icon;
          return (
            <div
              style={{
                background: '#ffffff',
                border: '2px solid #20332a',
                borderRadius: 18,
                padding: '28px 26px',
                marginBottom: 22,
                boxShadow: '0 14px 34px rgba(26, 41, 32, 0.08)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                  gap: 24,
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      fontSize: 11.5,
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      color: '#628f34',
                      marginBottom: 8,
                    }}
                  >
                    <HeroIcon size={15} />
                    <span>{hero.step}</span>
                  </div>
                  <h2 style={{ fontSize: 26, lineHeight: 1.2, marginBottom: 10, color: '#18261e' }}>
                    {hero.title}
                  </h2>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4c5f50', marginBottom: 16 }}>
                    {hero.desc}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <Link href={hero.href} className="btn btn-orange">
                      {hero.cta} <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>

                <div
                  style={{
                    background: '#f6f9f3',
                    border: '1px solid #dce5d5',
                    borderRadius: 14,
                    padding: '18px 18px',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#20332a',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: 10,
                    }}
                  >
                    Jump Directly to Any Back-Office Screen:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                    {hero.sublinks?.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '7px 11px',
                            borderRadius: 9,
                            background: '#ffffff',
                            border: '1px solid #cfdaca',
                            color: '#1f2d26',
                            fontSize: 12.5,
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          <SubIcon size={13} color="#628f34" />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'grid',
                      gap: 6,
                      fontSize: 13,
                      color: '#3f5243',
                    }}
                  >
                    {hero.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <CheckCircle2 size={14} color="#628f34" style={{ flexShrink: 0 }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Remaining 4 Connected Modules Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 18,
          }}
        >
          {modules.slice(1).map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.title}
                style={{
                  background: '#ffffff',
                  border: '1px solid #dce4d5',
                  borderRadius: 16,
                  padding: '22px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 6px 18px rgba(26, 41, 32, 0.04)',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      color: '#628f34',
                      marginBottom: 8,
                    }}
                  >
                    <Icon size={14} />
                    <span>{mod.step}</span>
                  </div>
                  <h3 style={{ fontSize: 19, lineHeight: 1.25, marginBottom: 8, color: '#18261e' }}>
                    {mod.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: '#4f6253', marginBottom: 14 }}>
                    {mod.desc}
                  </p>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '0 0 18px',
                      display: 'grid',
                      gap: 6,
                      fontSize: 12.5,
                      color: '#3f5243',
                    }}
                  >
                    {mod.highlights.map((h) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                        <CheckCircle2
                          size={13}
                          color="#628f34"
                          style={{ flexShrink: 0, marginTop: 2 }}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {mod.useAnchor ? (
                  <a
                    href={mod.href}
                    className="btn btn-dark"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {mod.cta} <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link
                    href={mod.href}
                    className="btn btn-dark"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {mod.cta} <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            marginTop: 36,
            padding: '28px 24px',
            borderRadius: 18,
            background: '#1a2920',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h3 style={{ fontSize: 22, color: '#ffffff', marginBottom: 4 }}>
              Ready to launch your own dumpster booking & dispatch board?
            </h3>
            <p style={{ fontSize: 14.5, color: '#c4d4c5', margin: 0 }}>
              Start on the $0/mo Free Plan in under 3 minutes. Keep 100% of your rental revenue.
            </p>
          </div>
          <Link href="/signup" className="btn btn-orange">
            Create My Free Account <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
