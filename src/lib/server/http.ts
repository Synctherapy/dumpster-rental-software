import { NextResponse } from 'next/server';
export function failure(error: unknown) {
  const message = error instanceof Error ? error.message : 'Something went wrong';
  return NextResponse.json(
    { error: message },
    { status: message === 'UNAUTHORIZED' ? 401 : message === 'FORBIDDEN' ? 403 : 400 },
  );
}
export function assertSameOrigin(request: Request) {
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite === 'cross-site') {
    throw new Error('FORBIDDEN');
  }
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  // Next may normalize request.url to localhost; Host retains the browser's destination.
  const host = request.headers.get('host') || new URL(request.url).host;
  const protocol = new URL(request.url).protocol;
  const expected = process.env.APP_URL
    ? new URL(process.env.APP_URL).origin
    : `${protocol}//${host}`;

  if (origin) {
    if (origin !== expected) throw new Error('FORBIDDEN');
  } else if (referer) {
    try {
      if (new URL(referer).origin !== expected) throw new Error('FORBIDDEN');
    } catch {
      throw new Error('FORBIDDEN');
    }
  }
}
