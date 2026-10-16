import { NextResponse } from 'next/server';
export function failure(error: unknown) {
  const message = error instanceof Error ? error.message : 'Something went wrong';
  return NextResponse.json(
    { error: message },
    { status: message === 'UNAUTHORIZED' ? 401 : message === 'FORBIDDEN' ? 403 : 400 },
  );
}
export function assertSameOrigin(request: Request, options?: { allowCrossSiteEmbed?: boolean }) {
  if (options?.allowCrossSiteEmbed) {
    return;
  }
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && secFetchSite === 'cross-site') {
    throw new Error('FORBIDDEN');
  }
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host') || new URL(request.url).host;
  const forwardedProto =
    request.headers.get('x-forwarded-proto') || new URL(request.url).protocol.replace(':', '');
  const requestOrigin = `${forwardedProto}://${host}`;

  const allowedOrigins = new Set([requestOrigin, `http://${host}`, `https://${host}`]);
  if (process.env.APP_URL) {
    try {
      allowedOrigins.add(new URL(process.env.APP_URL).origin);
    } catch {}
  }

  if (origin) {
    if (!allowedOrigins.has(origin)) throw new Error('FORBIDDEN');
  } else if (referer) {
    try {
      if (!allowedOrigins.has(new URL(referer).origin)) throw new Error('FORBIDDEN');
    } catch {
      throw new Error('FORBIDDEN');
    }
  }
}
