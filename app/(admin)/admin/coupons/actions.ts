'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { firstIssue, logAudit, type ActionResult } from '@/lib/admin/audit';

const couponSchema = z
  .object({
    id: z.string().uuid().optional(),
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9_-]{3,32}$/, 'Code must be 3-32 letters, numbers, - or _.'),
    type: z.enum(['PERCENT', 'FIXED']),
    value: z.number().finite('Enter a valid amount.').positive('Amount must be above zero.').max(100000),
    expiresAt: z.string().datetime('Invalid expiry date.').nullable(),
    usageLimit: z.number().int('Use a whole number.').min(1, 'Limit must be at least 1.').max(1_000_000).nullable(),
  })
  .refine((value) => value.type !== 'PERCENT' || value.value <= 100, {
    message: 'A percent coupon cannot exceed 100.',
    path: ['value'],
  });

export async function saveCoupon(
  input: z.input<typeof couponSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = couponSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const value = parsed.data;
  const row = {
    code: value.code,
    type: value.type,
    value: Math.round(value.value * 100) / 100,
    expires_at: value.expiresAt,
    usage_limit: value.usageLimit,
  };

  const admin = createAdminClient();
  const { error } = value.id
    ? await admin.from('coupons').update(row).eq('id', value.id)
    : await admin.from('coupons').insert(row);

  if (error) {
    return {
      success: false,
      error: error.code === '23505' ? 'A coupon with this code already exists.' : error.message,
    };
  }

  await logAudit({
    actorId: user.id,
    action: value.id ? 'update_coupon' : 'create_coupon',
    entity: 'coupon',
    entityId: value.id ?? null,
    meta: row,
  });

  revalidatePath('/admin/coupons');

  return { success: true };
}

const deleteSchema = z.object({ id: z.string().uuid('Invalid id.') });

export async function deleteCoupon(
  input: z.infer<typeof deleteSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = deleteSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('coupons').delete().eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'delete_coupon',
    entity: 'coupon',
    entityId: parsed.data.id,
  });

  revalidatePath('/admin/coupons');

  return { success: true };
}
