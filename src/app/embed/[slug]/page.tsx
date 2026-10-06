import { Booking } from '@/components/booking';
export default async function Embed({ params }: { params: Promise<{ slug: string }> }) {
  return <Booking slug={(await params).slug} embed />;
}
