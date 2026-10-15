import React from 'react';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/schema-org';

export interface BreadcrumbStep {
  name: string;
  item: string;
}

export function SemanticBreadcrumb({ items }: { items: BreadcrumbStep[] }) {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-xs text-[#687864] flex-wrap">
          {items.map((step, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={step.item} className="flex items-center gap-2">
                {idx > 0 && <span className="text-[#a4b39c]">/</span>}
                {isLast ? (
                  <span className="font-semibold text-[#1f2d26] truncate max-w-[280px] sm:max-w-none">
                    {step.name}
                  </span>
                ) : (
                  <Link
                    href={step.item}
                    className="hover:text-[#ea580c] transition-colors font-medium"
                  >
                    {step.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
