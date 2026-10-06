import { Booking } from '@/components/booking';
export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Booking slug={(await params).slug} />;
}
