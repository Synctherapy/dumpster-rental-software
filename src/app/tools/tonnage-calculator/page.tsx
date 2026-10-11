import { OverageCalculator } from '@/components/overage-calculator';
export const metadata = {
  title: 'Dumpster Tonnage & Disposal Overage Calculator — Free Hauler Tool',
  description:
    'Calculate dumpster rental disposal overages from included tonnage allowance, actual certified scale weight, and your per-ton rate.',
  alternates: {
    canonical: 'https://rolloffdumpstersoftware.com/tools/tonnage-calculator',
  },
};
export default function Calculator() {
  return <OverageCalculator />;
}
