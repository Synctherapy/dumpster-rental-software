import { NextResponse } from 'next/server';
import { workspace } from '@/lib/server/workspace';
import { failure } from '@/lib/server/http';
export async function GET() {
  try {
    return NextResponse.json(await workspace(), { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return failure(e);
  }
}
