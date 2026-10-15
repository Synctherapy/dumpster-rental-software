import Link from 'next/link';
import { ArrowRight, Home, Wrench, ShieldCheck } from 'lucide-react';
import { MarketingNav } from '@/components/marketing-nav';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <main className="marketing min-h-screen flex flex-col justify-between">
      <MarketingNav />

      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f7f1] text-[#476326] text-xs font-bold uppercase tracking-wider mb-6 border border-[#dde4d4]">
          <ShieldCheck size={14} className="text-[#628f34]" />
          404 — Container Not Found
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1f2d26] mb-4 tracking-tight">
          Looks like this bin was already hauled away.
        </h1>

        <p className="text-base text-[#556658] leading-relaxed mb-8 max-w-lg mx-auto">
          The page you’re looking for has moved, expired, or doesn’t exist. Head back to the dispatch yard or check out one of our free hauler resources.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link href="/" className="btn btn-orange inline-flex items-center gap-2">
            <Home size={16} /> Return to Homepage
          </Link>
          <Link href="/features" className="btn btn-dark inline-flex items-center gap-2">
            View Software Features <ArrowRight size={14} />
          </Link>
          <Link href="/tools" className="btn btn-secondary inline-flex items-center gap-2">
            <Wrench size={16} /> Free Hauler Tools
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#dde4d4] text-left max-w-md mx-auto shadow-sm">
          <h2 className="text-sm font-bold text-[#1f2d26] mb-2">Need direct help finding something?</h2>
          <p className="text-xs text-[#556658] leading-relaxed mb-3">
            If you were looking for your driver route link or customer rental agreement, reach out directly.
          </p>
          <Link href="/contact" className="text-xs font-bold text-[#ea580c] hover:underline inline-flex items-center gap-1">
            Contact Support &amp; Founder Line <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
