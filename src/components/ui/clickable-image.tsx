'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { ZoomIn, X, Maximize2 } from 'lucide-react';

export interface ClickableImageProps extends Omit<ImageProps, 'onClick'> {
  caption?: string;
  badge?: string;
  zoomText?: string;
  containerClassName?: string;
  showHoverBadge?: boolean;
}

export function ClickableImage({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  loading,
  sizes,
  className = '',
  containerClassName = '',
  caption,
  badge,
  zoomText = 'Click to enlarge',
  showHoverBadge = true,
  ...rest
}: ClickableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Lock background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const imgSrc =
    typeof src === 'string'
      ? src
      : typeof src === 'object' && src !== null && 'src' in src
      ? (src as { src: string }).src
      : '';

  return (
    <>
      {/* Clickable Image Trigger Container */}
      <div
        onClick={() => setIsOpen(true)}
        className={`relative group cursor-pointer overflow-hidden ${containerClassName}`}
        role="button"
        tabIndex={0}
        aria-label={`Enlarge image: ${alt || 'Screenshot'}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          loading={loading}
          sizes={sizes}
          className={`transition-transform duration-300 group-hover:scale-[1.015] ${className}`}
          {...rest}
        />

        {/* Hover Zoom Overlay Badge */}
        {showHoverBadge && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold shadow-xl border border-white/10">
              <ZoomIn size={14} className="text-[#ea580c]" />
              <span>{zoomText}</span>
            </span>
          </div>
        )}
      </div>

      {/* Lightbox Modal Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || 'Image Preview'}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          {/* Top Bar Actions */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-20">
            <span className="hidden sm:inline-block text-xs text-[#9bb0a0] font-mono bg-white/10 px-2.5 py-1 rounded-md">
              ESC to close
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-full bg-white/15 hover:bg-[#ea580c] text-white transition-all shadow-xl hover:scale-105"
              aria-label="Close full resolution preview"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content Box */}
          <div
            className="relative max-w-7xl max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Badge/Title if available */}
            {badge && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#ea580c] text-white text-xs font-bold shadow-md">
                  {badge}
                </span>
              </div>
            )}

            {/* High-Res Image View */}
            <div className="relative max-h-[78vh] max-w-[94vw] overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc}
                alt={alt}
                className="max-h-[78vh] w-auto max-w-full object-contain rounded-xl select-none"
              />
            </div>

            {/* Caption / Alt info footer */}
            {(caption || alt) && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-center max-w-3xl">
                <p className="text-xs sm:text-sm text-[#cbd5cc] leading-relaxed">
                  {caption || alt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
