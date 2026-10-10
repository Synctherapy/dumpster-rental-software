export const metadata = { robots: { index: false, follow: false } };
import { WorkspaceApp } from '@/components/workspace-app';
export default function Page() {
  return <WorkspaceApp page="dashboard" />;
}
