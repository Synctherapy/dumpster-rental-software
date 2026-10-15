import { permanentRedirect } from 'next/navigation';

export default function UsesDispatchRedirect() {
  permanentRedirect('/features/dispatch-board');
}
