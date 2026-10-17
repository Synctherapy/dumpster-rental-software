import Link from 'next/link';
import {
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  Code2,
  HeartHandshake,
  Lock,
  MessageSquare,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';
import { SemanticBreadcrumb } from '@/components/semantic-breadcrumb';
import { WhatsAppButton, SupportEmailButton } from '@/components/founder-contact';

export const metadata = {
  title: 'About Us — Built for Independent Roll-Off Haulers',
  description:
    'Learn why RollOS was built: honest, modern, booking-first roll-off dumpster software for 1–5 truck independent haulers with zero bloated enterprise fees or lock-in contracts.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/about',
  },
};

export default function AboutPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About RollOS', item: '/about' },
  ];

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About RollOS',
    description:
      'The story, mission, and principles behind RollOS dumpster rental software for independent roll-off haulers.',
    url: 'https://rolloffdumpstersoftware.com/about',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://rolloffdumpstersoftware.com/#organization',
      name: 'RollOS',
      url: 'https://rolloffdumpstersoftware.com',
      sameAs: [
        'https://www.linkedin.com/company/rollos',
        'https://www.g2.com/products/rollos/reviews',
        'https://www.trustpilot.com/review/rolloffdumpstersoftware.com',
        'https://www.crunchbase.com/organization/rollos-e3d4',
        'https://alternativeto.net/software/rollos/',
        'https://www.saashub.com/rollos-alternatives',
        'https://www.facebook.com/rollosdumpsterrentalsoftware',
      ],
      founder: {
        '@type': 'Person',
        name: 'Daryl Stubbs',
        jobTitle: 'Founder & Software Engineer',
      },
    },
  };

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <MarketingNav currentPath="/about" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <SemanticBreadcrumb items={breadcrumbItems} />

        {/* Header Section */}
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          OUR STORY &amp; MISSION · YOUR TECHNICAL PARTNER IN ROLL-OFF OPERATIONS
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] mb-6 tracking-tight leading-tight">
          Software built hand-in-hand with independent roll-off haulers.
        </h1>

        <p className="text-lg md:text-xl text-[#556658] leading-relaxed mb-12">
          Independent roll-off haulers don’t need another $400/month corporate enterprise tool with bloated menus. You need fast, honest software that captures bookings while you sleep, and a dedicated software partner who will adapt the platform to fit your yard.
        </p>

        {/* Narrative Section */}
        <div className="space-y-8 text-base text-[#3d4f42] leading-relaxed">
          <div className="p-8 rounded-2xl bg-white border border-[#dde4d4] shadow-sm">
            <div className="flex items-center gap-3 text-sm font-bold text-[#ea580c] uppercase tracking-wider mb-3">
              <Code2 size={18} />
              <span>How RollOS Was Born</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1f2d26] mb-4">
              A software partner in your corner, not another corporate vendor.
            </h2>
            <p className="mb-4">
              RollOS wasn’t created in a Silicon Valley boardroom by venture capitalists looking to extract fees from blue-collar trades. It was built out of conversations with independent roll-off operators who were fed up with the status quo:
            </p>
            <ul className="space-y-3 pl-2 my-5 text-sm md:text-base text-[#4a5f4e]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#ea580c] font-black shrink-0">•</span>
                <span>
                  <strong>Expensive, rigid software:</strong> Legacy platforms charging $300 to $500 every single month, regardless of whether you hauled 5 dumpsters or 50, plus mandatory $1,000+ setup fees.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#ea580c] font-black shrink-0">•</span>
                <span>
                  <strong>Hostage annual contracts:</strong> Locking haulers into 12-month agreements that force you to keep paying through the slow winter freeze.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#ea580c] font-black shrink-0">•</span>
                <span>
                  <strong>Zero customization or listening:</strong> When you request a simple feature or a tweak to how dispatch works, corporate software tells you it’s “on the backlog for next year.”
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#ea580c] font-black shrink-0">•</span>
                <span>
                  <strong>Lost revenue from missed calls:</strong> Independent haulers driving trucks all day lose an estimated $1,350 to $2,250 every week because homeowners hire someone else when calls go to voicemail.
                </span>
              </li>
            </ul>
            <p className="mb-4">
              You know your trucks, local landfills, road limits, and customer placement challenges better than anyone. My role is to be your technical counterpart—building modern, reliable software that handles your booking, dispatch, and billing smoothly.
            </p>
            <div className="p-5 rounded-xl bg-[#f4f7f1] border border-[#d2dec3] mt-6">
              <h3 className="text-base font-bold text-[#1f2d26] mb-1.5">
                We work together to build the best software for your specific yard.
              </h3>
              <p className="text-sm text-[#556658] leading-relaxed">
                Every dumpster business runs slightly differently. If you need a custom pricing logic, a specific scale ticket workflow, or a tailored export for your accountant, I want to hear it. RollOS is agile, actively developed, and open to adding features directly based on your daily operations.
              </p>
            </div>
          </div>

          {/* Core Principles */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#1f2d26] mb-6">
              Our 4 Non-Negotiable Guarantees
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#dde4d4] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f4f7f1] border border-[#dde4d4] flex items-center justify-center text-[#2e7d32] mb-4">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#1f2d26] mb-2">1. You Keep 100% of Your Money</h3>
                <p className="text-sm text-[#556658] leading-relaxed">
                  RollOS connects directly to your own Stripe account. Online rental deposits and tonnage overages flow straight into your bank account. We never hold your funds, charge stealth transaction cuts, or hold your payouts hostage.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#dde4d4] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f4f7f1] border border-[#dde4d4] flex items-center justify-center text-[#2e7d32] mb-4">
                  <Lock size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#1f2d26] mb-2">2. Zero Contract Lock-In</h3>
                <p className="text-sm text-[#556658] leading-relaxed">
                  Start with a 100% free plan ($0/mo) to capture online bookings while you sleep. If you upgrade to Starter ($29/mo) or Growth ($149/mo), billing is month-to-month with 1-click cancellation. No annual handcuffs, no termination fees.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#dde4d4] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f4f7f1] border border-[#dde4d4] flex items-center justify-center text-[#2e7d32] mb-4">
                  <Smartphone size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#1f2d26] mb-2">3. Zero Driver App Installs</h3>
                <p className="text-sm text-[#556658] leading-relaxed">
                  Drivers shouldn’t have to battle App Store logins or passwords. RollOS dispatches daily stops via secure SMS magic links that open instantly in any phone browser with 1-tap Google Maps turn-by-turn navigation and camera drop photo proof.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#dde4d4] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f4f7f1] border border-[#dde4d4] flex items-center justify-center text-[#2e7d32] mb-4">
                  <HeartHandshake size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#1f2d26] mb-2">4. Direct Founder Access</h3>
                <p className="text-sm text-[#556658] leading-relaxed">
                  When you have a question or need a feature for your yard, you don’t get passed to an outsourced call center or an aggressive commission-based sales rep. You speak directly with the founder and engineer who writes the software.
                </p>
              </div>
            </div>
          </div>

          {/* Who RollOS Is For */}
          <div className="p-8 rounded-2xl bg-[#f4f7f1] border border-[#dde4d4]">
            <h2 className="text-xl font-bold text-[#1f2d26] mb-3">Who RollOS Is Built For</h2>
            <p className="text-sm text-[#556658] leading-relaxed mb-4">
              RollOS is laser-focused on <strong>independent roll-off dumpster rental companies operating 1 to 5 trucks</strong>. Whether you run mini 10-yard driveway-friendly trailers or full tandem-axle roll-off rigs hauling 20, 30, and 40-yard commercial bins, RollOS equips your fleet with a 24/7{' '}
              <Link href="/features/online-booking" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">
                dumpster rental online booking system
              </Link>
              , a visual{' '}
              <Link href="/features/dispatch-board" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">
                roll-off dispatch software
              </Link>{' '}
              board, zero-app{' '}
              <Link href="/features/driver-routes" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">
                dumpster driver routing software
              </Link>
              , and automated{' '}
              <Link href="/features/tonnage-billing" className="font-semibold text-[#1f2d26] underline hover:text-[#ea580c]">
                dumpster tonnage billing software
              </Link>{' '}
              out of the box.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-white border border-[#d2dec3] text-xs font-semibold text-[#405442]">
                1–5 Truck Operators
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#d2dec3] text-xs font-semibold text-[#405442]">
                Driveway Roll-Off Trailers
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#d2dec3] text-xs font-semibold text-[#405442]">
                Hooklift &amp; Cable Hoist Trucks
              </span>
              <span className="px-3 py-1 rounded-full bg-white border border-[#d2dec3] text-xs font-semibold text-[#405442]">
                Independent Waste Haulers
              </span>
            </div>
          </div>

          {/* Personal Walkthrough & Contact */}
          <div className="p-8 rounded-2xl bg-white border border-[#dde4d4] shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ea580c] uppercase tracking-wider mb-2">
              <MessageSquare size={16} />
              <span>Let’s Connect</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1f2d26] mb-3">
              Want a personal walkthrough or have yard questions?
            </h2>
            <p className="text-sm text-[#556658] leading-relaxed mb-6">
              I love talking with haulers about container turns, local landfill workflows, and fleet scheduling. Reach out directly through our{' '}
              <Link href="/contact" className="font-semibold text-[#ea580c] hover:underline">
                contact and direct founder line
              </Link>
              , or review our{' '}
              <Link href="/pricing" className="font-semibold text-[#ea580c] hover:underline">
                transparent software pricing
              </Link>{' '}
              and free{' '}
              <Link href="/tools" className="font-semibold text-[#ea580c] hover:underline">
                hauler calculation tools
              </Link>
              .
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <WhatsAppButton label="Message Founder on WhatsApp" sublabel="Direct engineer line · No sales reps" />
              <SupportEmailButton label="Email support@rolloffdumpstersoftware.com" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
