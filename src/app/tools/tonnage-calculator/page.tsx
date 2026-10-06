import { OverageCalculator } from '@/components/overage-calculator';
export const metadata = {
  title: 'Dumpster tonnage calculator',
  description:
    'Calculate dumpster rental disposal overages from included tonnage, actual tons, and your per-ton rate.',
};
export default function Calculator() {
  return <OverageCalculator />;
}
