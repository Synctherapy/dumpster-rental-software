import { WorkspaceApp } from '@/components/workspace-app';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Get More Clients | RollOS',
  description: 'Reputation booster, website embed, local SEO, and client acquisition tools.',
};

export default function GrowthPage() {
  return <WorkspaceApp page="growth" />;
}
