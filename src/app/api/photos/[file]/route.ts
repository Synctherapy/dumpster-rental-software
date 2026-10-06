import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { isDemo } from '@/lib/server/store';
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!isDemo() || !/^[0-9a-f-]+\.(png|jpg)$/.test(file))
    return new Response(null, { status: 404 });
  try {
    const bytes = await readFile(
      path.join(process.env.ROLLOS_DATA_DIR || path.join(process.cwd(), '.rollos'), 'photos', file),
    );
    return new Response(bytes, {
      headers: {
        'Content-Type': file.endsWith('.png') ? 'image/png' : 'image/jpeg',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
