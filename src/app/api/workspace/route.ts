import { NextResponse } from 'next/server';
import { workspace } from '@/lib/server/workspace';
import { failure } from '@/lib/server/http';
import { ensureDemoSessionId, isDemo } from '@/lib/server/store';
export async function GET() {
  try {
    // Give an unsigned visitor their own private sandbox before reading it, so
    // two prospects clicking around at the same time cannot see each other's
    // changes. The cookie is HttpOnly and server-issued.
    if (isDemo()) await ensureDemoSessionId();
    return NextResponse.json(await workspace(), { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return failure(e);
  }
}
