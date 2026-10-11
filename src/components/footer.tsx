import Link from 'next/link';
import { Dumpster } from '@/components/brand';
import { ShieldCheck, Smartphone, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0c1410] text-[#cbd5cc] border-t border-[#1a2920] mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight mb-4 hover:opacity-90 transition-opacity">
              <span className="p-1.5 rounded-lg bg-[#18281d] text-[#22c55e] border border-[#2b4232]">
                <Dumpster size={22} />
              </span>
              <span>RollOS</span>
            </Link>

            <p className="text-sm text-[#9bb0a0] leading-relaxed mb-5">
              The booking-first roll off dumpster software for independent haulers. Eliminate phone tag, dispatch drivers via SMS with zero app downloads, and keep 100% of your rental money.
            </p>

            <div className="space-y-2.5 text-xs text-[#829987]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#22c55e] shrink-0" />
                <span>100% Direct Payouts via Stripe Connect</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={15} className="text-[#22c55e] shrink-0" />
                <span>Zero Driver App Installs Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={15} className="text-[#22c55e] shrink-0" />
                <span>rolloffdumpstersoftware.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Software & Core Features */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#22c55e] pl-2.5">
              Software
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/uses/dumpster-booking-system" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Dumpster Booking System
                </Link>
              </li>
              <li>
                <Link href="/uses/roll-off-dispatch-software" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Roll Off Dispatch Software
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Dumpster Software Pricing
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Software Savings Calculator
                </Link>
              </li>
              <li>
                <Link href="/book/greenline" className="text-[#cbd5cc] hover:text-[#ea580c] transition-colors inline-flex items-center gap-1.5 font-medium">
                  Live Checkout Demo <ArrowRight size={13} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Compare Platforms (SEO Silos) */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#22c55e] pl-2.5">
              Compare Platforms
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/vs" className="text-[#cbd5cc] hover:text-white transition-colors">
                  All Software Comparisons
                </Link>
              </li>
              <li>
                <Link href="/vs/docket" className="text-[#cbd5cc] hover:text-white transition-colors">
                  RollOS vs Docket
                </Link>
              </li>
              <li>
                <Link href="/vs/dumpster-rental-systems" className="text-[#cbd5cc] hover:text-white transition-colors">
                  RollOS vs DRS
                </Link>
              </li>
              <li>
                <Link href="/vs/servicecore" className="text-[#cbd5cc] hover:text-white transition-colors">
                  RollOS vs ServiceCore
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Free Hauler Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#22c55e] pl-2.5">
              Hauler Free Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/templates/dumpster-rental-contract" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Dumpster Rental Contract Template
                </Link>
              </li>
              <li>
                <Link href="/templates/dumpster-invoice" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Dumpster Rental Invoice Template
                </Link>
              </li>
              <li>
                <Link href="/tools/tonnage-calculator" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Tonnage & Overage Calculator
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Competitor Cost Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Portals & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#22c55e] pl-2.5">
              Account & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/login" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Hauler / Driver Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-[#22c55e] font-semibold hover:text-white transition-colors inline-flex items-center gap-1.5">
                  Start Free Demo <ArrowRight size={13} />
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#cbd5cc] hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-[#1a2920] bg-[#080e0a]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7b9180]">
          <div>
            © {currentYear} RollOS (rolloffdumpstersoftware.com). Built specifically for independent roll-off dumpster operators.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#22c55e]" />
              No long-term contracts
            </span>
            <span className="text-[#334639]">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#22c55e]" />
              Keep 100% of rental money
            </span>
            <span className="text-[#334639]">•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="text-[#334639]">•</span>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
