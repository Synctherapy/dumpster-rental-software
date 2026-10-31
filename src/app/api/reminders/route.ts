import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { isDemo, readDemo, mutateDemo } from '@/lib/server/store';
import { admin } from '@/lib/server/supabase';
import { sendSms } from '@/lib/server/notifications';
import { sendEmail } from '@/lib/server/email';
import { releaseOrganizationPhone } from '@/lib/server/phone';
import { addDays, type Job, type Organization, type User } from '@/lib/types';
import { driverToken, driverLinkTtlForPickup } from '@/lib/server/tokens';

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
        db.from('users').select('*'),
      ]);
      if (j.error || o.error || u.error) throw new Error('Unable to load reminder queue');
      jobs = j.data;
      orgs = o.data;
      users = u.data;
    }
    let processed = 0;
    for (const org of orgs) {
      // 1. Dedicated phone number 45-day inactivity warning & release (exempt during Winter Yard Hold)
      if (
        org.twilio_phone_number &&
        org.last_booking_at &&
        org.subscription_status !== 'winter_hold'
      ) {
        const lastBookingTime = new Date(org.last_booking_at).getTime();
        const daysSinceBooking = (Date.now() - lastBookingTime) / (1000 * 60 * 60 * 24);

        if (daysSinceBooking >= 45) {
          await releaseOrganizationPhone(org.id);
        } else if (daysSinceBooking >= 40 && !org.number_warning_sent_at) {
          let recipientEmail = org.email;
          if (!recipientEmail) {
            if (demo) {
              recipientEmail = 'hauler@example.com';
            } else {
              const ownerUser = users.find((u) => u.org_id === org.id && u.role === 'owner');
              if (ownerUser) {
                try {
                  const { data: authUser } = await admin().auth.admin.getUserById(ownerUser.id);
                  recipientEmail = authUser.user?.email;
                } catch {}
              }
            }
          }

          if (recipientEmail) {
            const warningText =
              'Your dedicated RollOS dispatch phone line will be paused in 5 days due to inactivity. Log in or take a booking to keep your line active.';
            await sendEmail(
              org.id,
              null,
              recipientEmail,
              'phone_inactivity_warning',
              `RollOS Action Required: Dedicated phone line inactivity warning · ${org.name}`,
              warningText,
            );
          }

          const nowIso = new Date().toISOString();
          if (demo) {
            await mutateDemo((d) => {
              if (d.organization.id === org.id) {
                d.organization.number_warning_sent_at = nowIso;
              }
            });
          } else {
            await admin()
              .from('organizations')
              .update({ number_warning_sent_at: nowIso })
              .eq('id', org.id);
          }
        }
      }

      // 2. Scheduled delivery and pickup reminders
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
          const driver = users.find((u) => u.id === job.driver_id && u.role === 'driver');
          if (driver?.phone) {
            const origin = new URL(request.url).origin;
            await sendSms(
              org.id,
              job.id,
              driver.phone,
              'driver_pickup',
              `Pickup tomorrow: ${job.delivery_address}. Open a fresh route link: ${origin}/driver/${driverToken(
                org.id,
                driver.id,
                driverLinkTtlForPickup(job.pickup_date),
              )}`,
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
