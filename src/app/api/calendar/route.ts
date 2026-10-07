import { NextResponse } from 'next/server';
import { isDemo, readDemo } from '@/lib/server/store';
import { admin, identity } from '@/lib/server/supabase';
import { generateIcsCalendar } from '@/lib/calendar';
import type { Organization, Job } from '@/lib/types';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    let org: Organization;
    let jobs: Job[];

    if (isDemo()) {
      const demoData = await readDemo();
      org = demoData.organization;
      jobs = demoData.jobs;
    } else {
      if (token) {
        // Unauthenticated external calendar subscription via secure token
        const db = admin();
        const { data: orgData, error: orgError } = await db
          .from('organizations')
          .select('*')
          .or(`id.eq.${token},pricing_config->>calendar_token.eq.${token}`)
          .single();

        if (orgError || !orgData) {
          return new NextResponse('Calendar not found or invalid token', { status: 404 });
        }
        org = orgData;

        const { data: jobsData, error: jobsError } = await db
          .from('jobs')
          .select('*')
          .eq('org_id', org.id)
          .neq('status', 'cancelled');

        if (jobsError) {
          return new NextResponse('Error loading calendar jobs', { status: 500 });
        }
        jobs = jobsData || [];
      } else {
        // Authenticated user session
        const { db, member } = await identity();
        const { data: orgData } = await db
          .from('organizations')
          .select('*')
          .eq('id', member.org_id)
          .single();
        if (!orgData) return new NextResponse('Organization not found', { status: 404 });
        org = orgData;

        const { data: jobsData } = await db
          .from('jobs')
          .select('*')
          .eq('org_id', member.org_id)
          .neq('status', 'cancelled');
        jobs = jobsData || [];
      }
    }

    const icsContent = generateIcsCalendar(org, jobs);

    return new Response(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `inline; filename="rollos-${org.slug || 'dumpsters'}.ics"`,
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
