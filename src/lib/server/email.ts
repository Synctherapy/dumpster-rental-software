import 'server-only';
import { claimNotification, finishNotification } from './notifications';
import { isDemo } from './store';
export async function sendEmail(
  org_id: string,
  job_id: string,
  to: string,
  template: string,
  subject: string,
  text: string,
) {
  const log = await claimNotification(org_id, job_id, to, template, 'email');
  if (!log) return 'already_logged';
  let status = isDemo() ? 'demo' : 'not_configured';
  if (!isDemo() && process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': log.dedupe_key!,
        },
        body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, text }),
      });
      status = response.ok ? 'sent' : 'failed';
    } catch {
      status = 'failed';
    }
  }
  await finishNotification(log.id, status);
  return status;
}
