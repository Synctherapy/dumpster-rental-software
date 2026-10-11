import Link from 'next/link';
import { getJobAgreement } from '@/lib/server/agreement';
import { AgreementView } from '@/components/agreement-view';

export const metadata = {
  title: 'Dumpster Rental Agreement & Property Damage Waiver',
  robots: { index: false, follow: false },
};

export default async function AgreementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getJobAgreement(id);

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#f7f9f6]">
        <div className="max-w-md w-full bg-white border border-[#dde4d4] rounded-xl p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#1f2d26] mb-2">Agreement Not Found</h1>
          <p className="text-sm text-[#556658] mb-6">
            The requested dumpster rental contract reference could not be located. It may have expired or was created in another workspace.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#ea580c] text-white text-xs font-bold hover:bg-[#c2410c] transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </main>
    );
  }

  return <AgreementView data={data} />;
}
