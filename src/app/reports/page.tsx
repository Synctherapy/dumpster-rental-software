import { WorkspaceApp } from '@/components/workspace-app';

export const metadata = {
  title: 'Reports & ROI | RollOS',
  description: 'Business revenue, competitor software savings, and fleet utilization reports.',
};

export default function ReportsPage() {
  return <WorkspaceApp page="reports" />;
}
