import { readDemoPhoto } from '@/lib/server/store';
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[0-9a-f-]+\.(png|jpg)$/.test(file)) return new Response(null, { status: 404 });
  const record = await readDemoPhoto(file);
  if (!record) return new Response(null, { status: 404 });
  return new Response(new Uint8Array(record.bytes), {
    headers: {
      'Content-Type': file.endsWith('.png') ? 'image/png' : 'image/jpeg',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
