import 'server-only';

/**
 * Server-side error logging.
 *
 * The codebase swallows failures in a lot of places, which is reasonable where
 * the operation is genuinely optional, but several of those places decide
 * whether money is recorded or a notification is sent. When one of them starts
 * failing in production there has to be something to read.
 *
 * Logs the message and stack only. Never log the value of a header, a key, a
 * token or a request body: these lines end up in hosting logs.
 */
export function logError(context: string, error: unknown) {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error(`[${context}] ${err.message}`, err.stack ?? '');
}

/**
 * A catch handler that records the failure and lets the caller continue.
 * Use in place of `.catch(() => {})` wherever the work is best-effort but a
 * failure is worth knowing about.
 */
export function swallow(context: string) {
  return (error: unknown) => {
    logError(context, error);
  };
}
