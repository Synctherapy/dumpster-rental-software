import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { ClickableImage } from '@/components/ui/clickable-image';

export interface BlogCroInfographicProps {
  badge: string;
  title: string;
  description: string;
  src: string;
  alt: string;
  caption: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaHref?: string;
}

export function BlogCroInfographic({
  badge,
  title,
  description,
  src,
  alt,
  caption,
  ctaTitle = 'Run Your Dumpster Rental Fleet on Autopilot',
  ctaSubtitle = 'Get 24/7 online booking, 1-tap driver SMS routing, and automated scale ticket overage billing on RollOS.',
  ctaButtonText = 'Start Free on RollOS ($0/mo)',
  ctaHref = '/signup',
}: BlogCroInfographicProps) {
  return (
    <section className="my-12 rounded-3xl border border-[#dde4d4] bg-gradient-to-b from-[#fbfdf9] to-[#ffffff] p-6 sm:p-8 shadow-sm">
      <div className="max-w-3xl mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mb-3">
          <Sparkles size={14} className="text-[#ea580c]" />
          {badge}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1f2d26] tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-[#556658] mt-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Visual Image Container */}
      <figure className="relative w-full rounded-2xl overflow-hidden border border-[#dde4d4] bg-slate-950 shadow-md">
        <div className="relative aspect-[16/9] w-full">
          <ClickableImage
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-contain"
            loading="lazy"
            badge={badge}
            caption={caption}
            containerClassName="w-full h-full"
          />
        </div>
        <figcaption className="p-4 bg-[#f8faf6] border-t border-[#dde4d4] text-xs text-[#556658] leading-relaxed">
          {caption}
        </figcaption>
      </figure>

      {/* High-Converting In-Article CTA Banner */}
      <div className="mt-8 p-6 bg-[#1f2d26] rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#86efac]">
            <ShieldCheck size={16} />
            <span>NO CREDIT CARD REQUIRED · CANCEL ANYTIME</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {ctaTitle}
          </h3>
          <p className="text-xs text-[#cbd5e1] leading-relaxed max-w-xl">
            {ctaSubtitle}
          </p>
        </div>
        <Link
          href={ctaHref}
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg"
        >
          {ctaButtonText}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
