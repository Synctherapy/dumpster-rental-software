import { NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { isDemo, mutateDemo } from '@/lib/server/store';
import { identity } from '@/lib/server/supabase';
import { assertSameOrigin, failure } from '@/lib/server/http';
import type { Container } from '@/lib/types';

const bulkSchema = z.object({
  containers: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(30),
        size_yards: z.number().int().min(1).max(100),
      }),
    )
    .min(1)
    .max(500),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { containers: items } = bulkSchema.parse(await request.json());

    // Check for duplicate labels within the submitted batch
    const labels = items.map((i) => i.label);
    const uniqueLabels = new Set(labels);
    if (uniqueLabels.size !== labels.length) {
      const duplicates = labels.filter((item, index) => labels.indexOf(item) !== index);
      throw new Error(`Duplicate container labels in list: ${duplicates.slice(0, 3).join(', ')}`);
    }

    if (isDemo()) {
      await mutateDemo((d) => {
        const existingLabels = new Set(d.containers.map((c) => c.label.toLowerCase()));
        for (const item of items) {
          if (existingLabels.has(item.label.toLowerCase())) {
            throw new Error(`Container "${item.label}" already exists in your fleet.`);
          }
        }

        const newContainers: Container[] = items.map((item) => ({
          id: randomUUID(),
          org_id: d.organization.id,
          label: item.label,
          size_yards: item.size_yards,
          status: 'yard' as const,
          current_job_id: null,
        }));

        d.containers.push(...newContainers);
      });
    } else {
      const { db, member } = await identity();
      if (member.role !== 'owner') throw new Error('FORBIDDEN');

      const rows = items.map((item) => ({
        id: randomUUID(),
        org_id: member.org_id,
        label: item.label,
        size_yards: item.size_yards,
        status: 'yard',
        current_job_id: null,
      }));

      const { error } = await db.from('containers').insert(rows);
      if (error) {
        if (error.code === '23505') {
          throw new Error('One or more container labels already exist in your fleet.');
        }
        throw new Error(error.message);
      }
    }

    return NextResponse.json({ ok: true, count: items.length });
  } catch (e) {
    return failure(e);
  }
}
