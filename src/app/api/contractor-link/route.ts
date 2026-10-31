import { NextResponse } from 'next/server';
import { z } from 'zod';
import { workspace } from '@/lib/server/workspace';
import { contractorToken } from '@/lib/server/tokens';
import { assertSameOrigin, failure } from '@/lib/server/http';

const schema = z.object({ account_name: z.string().trim().min(2).max(120) });

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { account_name } = schema.parse(await request.json());
    const data = await workspace();
    const token = contractorToken(data.organization.id, account_name);
    return NextResponse.json({
      url: `/contractor/${data.organization.slug}?t=${token}`,
      account_name,
    });
  } catch (e) {
    return failure(e);
  }
}
