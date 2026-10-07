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
    phone: z.string().trim().min(7).max(25),
  }),
]);
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = schema.parse(await request.json());
    const make = (org_id: string) => {
      if (input.kind === 'container') {
        return {
          id: randomUUID(),
          org_id,
          label: input.label,
          size_yards: input.size_yards,
          status: 'yard' as const,
          current_job_id: null,
        };
      }
      const formattedPhone = normalizePhone(input.phone);
      if (!/^\+[1-9]\d{7,14}$/.test(formattedPhone)) {
        throw new Error('Please enter a valid phone number, e.g. +15125551234 or (512) 555-1234.');
      }
      return {
        id: randomUUID(),
        org_id,
        name: input.name,
        phone: formattedPhone,
        role: 'driver' as const,
      };
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
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  if (raw.startsWith('+') && digits.length >= 8) return `+${digits}`;
  return raw;
}

const patchSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('container').default('container'),
    id: z.string(),
    status: z.enum(['yard', 'maintenance']),
  }),
  z.object({
    kind: z.literal('driver'),
    id: z.string(),
    name: z.string().trim().min(2).max(80).optional(),
    phone: z.string().trim().min(7).max(25),
  }),
]);

export async function PATCH(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json();
    // Default kind to container for backward compatibility if omitted
    const withKind = body.kind ? body : { kind: 'container', ...body };
    const input = patchSchema.parse(withKind);

    if (input.kind === 'container') {
      if (isDemo())
        await mutateDemo((d) => {
          const c = d.containers.find((c) => c.id === input.id);
          if (!c) throw new Error('Container not found');
          if (c.current_job_id)
            throw new Error('Pick up this container before changing its availability.');
          c.status = input.status;
        });
      else {
        const { db, member } = await identity();
        if (member.role !== 'owner') throw new Error('FORBIDDEN');
        const { data, error } = await db
          .from('containers')
          .update({ status: input.status })
          .eq('id', input.id)
          .eq('org_id', member.org_id)
          .is('current_job_id', null)
          .select('id');
        if (error || !data?.length) throw new Error('Container is assigned or unavailable.');
      }
    } else {
      const formattedPhone = normalizePhone(input.phone);
      if (!/^\+[1-9]\d{7,14}$/.test(formattedPhone)) {
        throw new Error('Please enter a valid phone number, e.g. +15125551234 or (512) 555-1234.');
      }

      if (isDemo())
        await mutateDemo((d) => {
          const u = d.users.find((u) => u.id === input.id && u.role === 'driver');
          if (!u) throw new Error('Driver not found');
          if (input.name) u.name = input.name;
          u.phone = formattedPhone;
        });
      else {
        const { db, member } = await identity();
        if (member.role !== 'owner') throw new Error('FORBIDDEN');
        const updateFields: Record<string, unknown> = { phone: formattedPhone };
        if (input.name) updateFields.name = input.name;
        const { error } = await db
          .from('users')
          .update(updateFields)
          .eq('id', input.id)
          .eq('org_id', member.org_id)
          .eq('role', 'driver');
        if (error) throw new Error(error.message);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
