import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Clock,
  Building,
  HelpCircle,
} from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';
import { BreadcrumbSchema } from '@/components/schema-org';
import { WhatsAppButton, SupportEmailButton } from '@/components/founder-contact';

export const metadata = {
  title: 'Contact Support & Founder Walkthroughs',
  description:
    'Get in touch with the RollOS team. Direct founder access via WhatsApp, phone, or email for live 1-on-1 walkthroughs, fleet questions, or technical support.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/contact',
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Contact', item: '/contact' },
  ];

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact RollOS',
    description:
      'Contact information for RollOS dumpster rental software, including direct founder support and software walkthroughs.',
    url: 'https://rolloffdumpstersoftware.com/contact',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://rolloffdumpstersoftware.com/#organization',
      name: 'RollOS',
      url: 'https://rolloffdumpstersoftware.com',
      email: 'support@rolloffdumpstersoftware.com',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@rolloffdumpstersoftware.com',
          availableLanguage: ['English'],
        },
      ],
    },
  };

  return (
    <main className="marketing">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <MarketingNav currentPath="/contact" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#687864] hover:text-[#ea580c] transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to Roll Off Dumpster Software
        </Link>

        {/* Header */}
        <div className="eyebrow" style={{ color: '#82956d', marginBottom: 12 }}>
          DIRECT FOUNDER SUPPORT · NO SALES REPS
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#20302a] mb-4 tracking-tight">
          Talk directly with the person who built RollOS.
        </h1>

        <p className="text-lg text-[#556658] leading-relaxed mb-10 max-w-2xl">
          Have questions about your container sizes, driver SMS dispatches, or want a free personal walkthrough for your yard? Reach out directly—no sales runaround, no automated bots.
        </p>

        {/* Contact Methods Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: Fast WhatsApp / Text */}
          <div className="p-7 rounded-2xl bg-white border border-[#dde4d4] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#eaf8ed] text-[#22c55e] flex items-center justify-center mb-5 border border-[#cbe8cf]">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#1f2d26] mb-2">WhatsApp &amp; Direct Line</h2>
              <p className="text-sm text-[#556658] leading-relaxed mb-4">
                Fastest way to get a quick answer, verify container pricing setups, or ask about custom yard requirements.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3d5a42] mb-6">
                <Clock size={15} className="text-[#628f34]" />
                <span>Direct founder response — same day (usually 1–3 hrs)</span>
              </div>
            </div>

            <div>
              <WhatsAppButton
                className="w-full justify-center"
                label="Message on WhatsApp"
                sublabel="Direct founder chat · One-tap to message"
              />
            </div>
          </div>

          {/* Card 2: Email Support */}
          <div className="p-7 rounded-2xl bg-white border border-[#dde4d4] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#fff2eb] text-[#ea580c] flex items-center justify-center mb-5 border border-[#fddfcb]">
                <Mail size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#1f2d26] mb-2">Email Support</h2>
              <p className="text-sm text-[#556658] leading-relaxed mb-4">
                Send your container pricing sheet, dispatch questions, or embed requests. I answer every email personally.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#3d5a42] mb-6">
                <Clock size={15} className="text-[#628f34]" />
                <span>support@rolloffdumpstersoftware.com</span>
              </div>
            </div>

            <div>
              <SupportEmailButton
                className="w-full justify-center py-3.5"
                label="Email Founder Directly"
              />
            </div>
          </div>
        </div>

        {/* Feature Request & Collaboration Callout */}
        <div className="p-8 rounded-2xl bg-white border-2 border-[#d2dec3] shadow-sm mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f7f1] text-[#476326] text-xs font-bold uppercase tracking-wider mb-3 border border-[#dde4d4]">
            COLLABORATIVE DEVELOPMENT · BUILT AROUND YOUR YARD
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1f2d26] mb-2">
            Want to work together to customize or add features for your fleet?
          </h2>
          <p className="text-sm text-[#556658] leading-relaxed mb-4">
            Unlike big corporate software companies where feature requests get lost in a corporate backlog forever, RollOS is actively built around hauler feedback. If your operations require a specific dispatch flow, a custom pricing rule, or tailored invoice exports, talk to me. I’m always open to adapting the software and building what you need to run your business smoothly.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <WhatsAppButton label="Discuss a Feature on WhatsApp" sublabel="Let's build it together" />
          </div>
        </div>

        {/* Operating Hours & Trust Info */}
        <div className="p-8 rounded-2xl bg-[#f4f7f1] border border-[#dde4d4] mb-12">
          <h2 className="text-lg font-bold text-[#1f2d26] mb-4 flex items-center gap-2">
            <Building size={18} className="text-[#476326]" />
            Business Details &amp; Support Availability
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-bold text-[#1f2d26] mb-1">Direct Support Hours</div>
              <p className="text-[#556658] text-xs leading-relaxed">
                Monday – Saturday: 7:00 AM – 7:00 PM EST<br />
                Sunday: Emergency dispatch monitoring only
              </p>
            </div>

            <div>
              <div className="font-bold text-[#1f2d26] mb-1">Live Walkthroughs</div>
              <p className="text-[#556658] text-xs leading-relaxed">
                Available over Google Meet or screen share. We configure your actual pricing rules, dumpster sizes, and service ZIP codes together.
              </p>
            </div>

            <div>
              <div className="font-bold text-[#1f2d26] mb-1">Platform Inquiries</div>
              <p className="text-[#556658] text-xs leading-relaxed">
                RollOS Dumpster Rental Software<br />
                Operated by Daryl Stubbs<br />
                Domain: rolloffdumpstersoftware.com
              </p>
            </div>

            <div>
              <div className="font-bold text-[#1f2d26] mb-1">Data &amp; Security</div>
              <p className="text-[#556658] text-xs leading-relaxed">
                Direct payouts via Stripe Connect (PCI-DSS Level 1 compliant). All customer records can be exported to CSV anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Quick FAQ Strip */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#1f2d26] mb-4">Frequently Asked Support Questions</h2>

          <div className="p-5 rounded-xl bg-white border border-[#dde4d4]">
            <h3 className="text-sm font-bold text-[#1f2d26] mb-1.5 flex items-center gap-2">
              <HelpCircle size={15} className="text-[#ea580c]" />
              Do I have to talk to someone to use RollOS?
            </h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              No. RollOS is 100% self-serve. You can sign up, create an account, connect Stripe, and embed your booking widget in 3 minutes without ever speaking to us. Support is here whenever you want it.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#dde4d4]">
            <h3 className="text-sm font-bold text-[#1f2d26] mb-1.5 flex items-center gap-2">
              <HelpCircle size={15} className="text-[#ea580c]" />
              Can you help me set up my service area ZIP codes and dumpster sizes?
            </h3>
            <p className="text-xs text-[#556658] leading-relaxed">
              Yes, absolutely. Just send me your price list or website via email or WhatsApp and I will help you dial in your 10, 15, 20, 30, or 40-yard container rules and delivery radius at zero charge.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
