import { NextResponse } from 'next/server';
export function failure(error: unknown) {
  const message = error instanceof Error ? error.message : 'Something went wrong';
  return NextResponse.json(
    { error: message },
    { status: message === 'UNAUTHORIZED' ? 401 : message === 'FORBIDDEN' ? 403 : 400 },
  );
}
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  // Next may normalize request.url to localhost; Host retains the browser's destination.
  const expected = process.env.APP_URL
    ? new URL(process.env.APP_URL).origin
    : `${new URL(request.url).protocol}//${request.headers.get('host') || new URL(request.url).host}`;
  if (origin && origin !== expected) throw new Error('FORBIDDEN');
}
