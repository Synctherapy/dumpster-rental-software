import { permanentRedirect } from 'next/navigation';

export default function UsesBookingRedirect() {
  permanentRedirect('/features/online-booking');
}
