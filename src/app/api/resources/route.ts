import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { isDemo, mutateDemo } from '@/lib/server/store';
import { identity } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
const schema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('container'),
    label: z.string().trim().min(1).max(30),
    size_yards: z.union([z.literal(10), z.literal(20), z.literal(30), z.literal(40)]),
  }),
  z.object({
    kind: z.literal('driver'),
    name: z.string().trim().min(2).max(80),
    phone: z.string().regex(/^\+[1-9]\d{7,14}$/),
  }),
]);
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = schema.parse(await request.json());
    const make = (org_id: string) =>
      input.kind === 'container'
        ? {
            id: randomUUID(),
            org_id,
            label: input.label,
            size_yards: input.size_yards,
            status: 'yard' as const,
            current_job_id: null,
          }
        : {
            id: randomUUID(),
            org_id,
            name: input.name,
            phone: input.phone,
            role: 'driver' as const,
          };
    if (isDemo())
      await mutateDemo((d) => {
        if (input.kind === 'container') {
          if (d.containers.some((c) => c.label === input.label))
            throw new Error('Container number already exists.');
          d.containers.push(make(d.organization.id) as (typeof d.containers)[number]);
        } else d.users.push(make(d.organization.id) as (typeof d.users)[number]);
      });
    else {
      const { db, member } = await identity();
      if (member.role !== 'owner') throw new Error('FORBIDDEN');
      const row: Record<string, unknown> = make(member.org_id);
      const { error } = await db
        .from(input.kind === 'container' ? 'containers' : 'users')
        .insert(row);
      if (error) throw new Error(error.message);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const { id, status } = z
      .object({ id: z.string(), status: z.enum(['yard', 'maintenance']) })
      .parse(await request.json());
    if (isDemo())
      await mutateDemo((d) => {
        const c = d.containers.find((c) => c.id === id);
        if (!c) throw new Error('Container not found');
        if (c.current_job_id)
          throw new Error('Pick up this container before changing its availability.');
        c.status = status;
      });
    else {
      const { db, member } = await identity();
      if (member.role !== 'owner') throw new Error('FORBIDDEN');
      const { data, error } = await db
        .from('containers')
        .update({ status })
        .eq('id', id)
        .eq('org_id', member.org_id)
        .is('current_job_id', null)
        .select('id');
      if (error || !data?.length) throw new Error('Container is assigned or unavailable.');
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
