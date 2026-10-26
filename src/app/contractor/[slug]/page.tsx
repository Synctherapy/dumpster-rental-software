import type { Metadata } from 'next';
import { ContractorPortal } from '@/components/contractor-portal';

export const metadata: Metadata = {
  title: 'VIP Commercial Contractor Portal · 1-Tap Swaps & Net-30 Billing',
  description:
    'Request 1-tap jobsite dumpster swaps, dispatch new commercial drops without a credit card, and download consolidated monthly Net-30 statements.',
  robots: { index: false, follow: false },
};

export default async function ContractorPortalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ContractorPortal slug={slug} />;
}
