import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, X, Sparkles, Monitor, ShieldCheck } from 'lucide-react';
import { ClickableImage } from '@/components/ui/clickable-image';

export interface VsVisualComparisonProps {
  competitorName: string;
  competitorTagline: string;
  competitorScreenshot: string;
  competitorScreenshotAlt: string;
  competitorBulletPoints: string[];

  rollosTagline: string;
  rollosScreenshot: string;
  rollosScreenshotAlt: string;
  rollosBulletPoints: string[];

  infographicSrc: string;
  infographicAlt: string;
  infographicBadge: string;
  infographicTitle: string;
  infographicDescription: string;
  infographicCaption: string;
  infographicCtaHeadline?: string;
}

export function VsVisualComparison({
  competitorName,
  competitorTagline,
  competitorScreenshot,
  competitorScreenshotAlt,
  competitorBulletPoints,
  rollosTagline,
  rollosScreenshot,
  rollosScreenshotAlt,
  rollosBulletPoints,
  infographicSrc,
  infographicAlt,
  infographicBadge,
  infographicTitle,
  infographicDescription,
  infographicCaption,
  infographicCtaHeadline,
}: VsVisualComparisonProps) {
  return (
    <div className="my-14 space-y-12">
      {/* 1. Live Head-to-Head Visual Interface Comparison */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold mb-2">
            <Monitor size={14} className="text-[#ea580c]" />
            LIVE INTERFACE & WORKFLOW COMPARISON
          </div>
          <h2 className="text-2xl font-bold text-[#1f2d26]">
            Visual Head-to-Head: RollOS vs. {competitorName}
          </h2>
          <p className="text-sm text-[#556658] mt-1 leading-relaxed">
            See how modern dispatch, transparent pricing, and zero-friction driver workflows compare to {competitorName}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* RollOS Side */}
          <div className="flex flex-col rounded-2xl border-2 border-[#ea580c] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold">
                RollOS · Modern Web Platform ($0/mo Free Plan)
              </span>
              <span className="text-xs font-bold text-[#2e7d32] flex items-center gap-1">
                <ShieldCheck size={14} /> Self-Serve 24/7
              </span>
            </div>
            <p className="text-xs text-[#556658] mb-3 leading-relaxed">
              {rollosTagline}
            </p>
            
            {/* Browser Frame Mockup */}
            <div className="rounded-xl overflow-hidden border border-[#dde4d4] bg-[#f8faf6] shadow-inner mb-4">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#f1f5ec] border-b border-[#dde4d4]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="text-[11px] text-[#64748b] font-mono ml-2 truncate">
                  rolloffdumpstersoftware.com/dispatch
                </span>
              </div>
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <ClickableImage
                  src={rollosScreenshot}
                  alt={rollosScreenshotAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                  loading="lazy"
                  badge="RollOS Live Interface"
                  caption={rollosScreenshotAlt}
                  containerClassName="w-full h-full"
                />
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[#334155] mt-auto pt-2">
              {rollosBulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check size={14} className="text-[#ea580c] flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitor Side */}
          <div className="flex flex-col rounded-2xl border border-[#dde4d4] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="inline-block px-3 py-1 rounded-full bg-[#f1f5f9] text-[#475569] text-xs font-bold">
                {competitorName} Interface & Tier Structure
              </span>
              <span className="text-xs font-semibold text-[#dc2626]">
                Alternative Model
              </span>
            </div>
            <p className="text-xs text-[#556658] mb-3 leading-relaxed">
              {competitorTagline}
            </p>

            {/* Browser Frame Mockup */}
            <div className="rounded-xl overflow-hidden border border-[#dde4d4] bg-[#f8faf6] shadow-inner mb-4">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-[#f8fafc] border-b border-[#dde4d4]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1]" />
                <span className="text-[11px] text-[#94a3b8] font-mono ml-2 truncate">
                  {competitorName.toLowerCase().replace(/\s+/g, '')}.com
                </span>
              </div>
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <ClickableImage
                  src={competitorScreenshot}
                  alt={competitorScreenshotAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                  loading="lazy"
                  badge={`${competitorName} Preview`}
                  caption={competitorScreenshotAlt}
                  containerClassName="w-full h-full"
                />
              </div>
            </div>

            <ul className="space-y-2 text-xs text-[#64748b] mt-auto pt-2">
              {competitorBulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <X size={14} className="text-[#dc2626] flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Deep-Dive High-Impact CRO Infographic */}
      <section className="rounded-3xl border border-[#dde4d4] bg-gradient-to-b from-[#fbfdf9] to-[#ffffff] p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
            <Sparkles size={14} className="text-[#ea580c]" />
            {infographicBadge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f2d26] tracking-tight">
            {infographicTitle}
          </h2>
          <p className="text-sm text-[#556658] mt-2 leading-relaxed">
            {infographicDescription}
          </p>
        </div>

        {/* Infographic Graphic Container */}
        <figure className="relative w-full rounded-2xl overflow-hidden border border-[#dde4d4] bg-white shadow-md">
          <div className="relative aspect-[16/9] w-full">
            <ClickableImage
              src={infographicSrc}
              alt={infographicAlt}
              fill
              sizes="(max-width: 1200px) 100vw, 1100px"
              className="object-contain bg-slate-900"
              loading="lazy"
              badge={infographicBadge}
              caption={infographicCaption}
              containerClassName="w-full h-full"
            />
          </div>
          <figcaption className="p-4 bg-[#f8faf6] border-t border-[#dde4d4] text-xs text-[#556658] leading-relaxed">
            {infographicCaption}
          </figcaption>
        </figure>

        {/* High-Intent In-Article CRO Callout */}
        <div className="mt-8 p-5 bg-[#1f2d26] rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              {infographicCtaHeadline || `Ready to Eliminate ${competitorName} Friction?`}
            </h3>
            <p className="text-xs text-[#cbd5e1] leading-relaxed">
              Launch RollOS in under 5 minutes with our <strong>$0/month Free Plan</strong> ($12 customer checkout fee, 0% hauler commission).
            </p>
          </div>
          <Link
            href="/signup"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg"
          >
            Start Free on RollOS
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
