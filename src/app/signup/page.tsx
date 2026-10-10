export const metadata = { robots: { index: false, follow: false } };
import { AuthForm } from '@/components/auth-form';
export default function Signup() {
  return <AuthForm signup />;
}
