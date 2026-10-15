import { permanentRedirect } from 'next/navigation';

export default function CalculatorRedirectPage() {
  permanentRedirect('/tools/savings-calculator');
}
