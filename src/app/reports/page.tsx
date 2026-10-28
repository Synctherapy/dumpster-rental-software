import { WorkspaceApp } from '@/components/workspace-app';

export const metadata = {
  robots: { index: false, follow: false },
  title: 'Reports & ROI',
  description: 'Business revenue, competitor software savings, and fleet utilization reports.',
};

export default function ReportsPage() {
  return <WorkspaceApp page="reports" />;
}
