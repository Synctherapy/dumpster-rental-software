import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { isDemo, readDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
import { sendSms } from '@/lib/server/notifications';
import { sendEmail } from '@/lib/server/email';
import { addDays, type Job, type Organization, type User } from '@/lib/types';
import { driverToken } from '@/lib/server/tokens';

function verifyCronAuth(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  const authBuf = Buffer.from(auth);
  const expBuf = Buffer.from(expected);
  if (authBuf.length !== expBuf.length) return false;
  return timingSafeEqual(authBuf, expBuf);
}

export async function GET(request: Request) {
  const demo = isDemo();
  if (!demo && !verifyCronAuth(request))
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  try {
    let jobs: Job[];
    let orgs: Organization[];
    let users: User[];
    if (demo) {
      const d = await readDemo();
      jobs = d.jobs;
      orgs = [d.organization];
      users = d.users;
    } else {
      const db = admin();
      const [j, o, u] = await Promise.all([
        db.from('jobs').select('*').in('status', ['booked', 'dispatched', 'delivered']),
        db.from('organizations').select('*'),
        db.from('users').select('*').eq('role', 'driver'),
      ]);
      if (j.error || o.error || u.error) throw new Error('Unable to load reminder queue');
      jobs = j.data;
      orgs = o.data;
      users = u.data;
    }
    let processed = 0;
    for (const org of orgs) {
      const localToday = new Intl.DateTimeFormat('en-CA', {
        timeZone: org.timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
      const tomorrow = addDays(localToday, 1);
      for (const job of jobs.filter((j) => j.org_id === org.id)) {
        const template =
          ['booked', 'dispatched'].includes(job.status) && job.delivery_date === tomorrow
            ? 'delivery_reminder'
            : job.status === 'delivered' && job.pickup_date === tomorrow
              ? 'pickup_reminder'
              : null;
        if (!template) continue;
        const text =
          template === 'delivery_reminder'
            ? `Your ${job.size_yards} yd dumpster from ${org.name} arrives tomorrow. Please keep the placement area clear.`
            : `Your dumpster from ${org.name} is scheduled for pickup tomorrow. Please keep access clear.`;
        await sendSms(org.id, job.id, job.customer_phone, template, text);
        await sendEmail(
          org.id,
          job.id,
          job.customer_email,
          template,
          `Tomorrow’s ${template === 'delivery_reminder' ? 'delivery' : 'pickup'} · ${org.name}`,
          text,
        );
        if (template === 'pickup_reminder' && job.driver_id) {
          const driver = users.find((u) => u.id === job.driver_id);
          if (driver?.phone) {
            const origin = new URL(request.url).origin;
            await sendSms(
              org.id,
              job.id,
              driver.phone,
              'driver_pickup',
              `Pickup tomorrow: ${job.delivery_address}. Open a fresh route link: ${origin}/driver/${driverToken(org.id, driver.id)}`,
            );
          }
        }
        processed++;
      }
    }
    return NextResponse.json({ processed, demo });
  } catch {
    return NextResponse.json({ error: 'Reminder processing failed' }, { status: 500 });
  }
}
