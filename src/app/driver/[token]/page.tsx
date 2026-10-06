import { DriverRoute } from '@/components/driver-route';
export const metadata = { title: 'Your driver route', robots: { index: false, follow: false } };
export default async function DriverPage({ params }: { params: Promise<{ token: string }> }) {
  return <DriverRoute token={(await params).token} />;
}
