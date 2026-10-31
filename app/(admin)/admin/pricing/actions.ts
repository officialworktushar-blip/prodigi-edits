'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { firstIssue, logAudit, type ActionResult } from '@/lib/admin/audit';

function refreshPricing() {
  revalidatePath('/admin/pricing');
  revalidatePath('/pricing');
  revalidatePath('/');
}

const money = z
  .number()
  .finite('Enter a valid number.')
  .min(0, 'Price cannot be negative.')
  .max(1_000_000, 'Price is too large.');

const packageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Name is required.').max(100),
  kind: z.enum(['HORIZONTAL', 'VERTICAL', 'THUMBNAIL']),
  videoCount: z.number().int('Use a whole number.').min(1, 'At least 1 video.').max(1000),
  pricePerVideo: money,
  discountPercent: z.number().finite().min(0, 'Minimum is 0.').max(100, 'Maximum is 100.'),
  isActive: z.boolean(),
});

export async function savePackage(
  input: z.infer<typeof packageSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = packageSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const value = parsed.data;
  const row = {
    name: value.name,
    kind: value.kind,
    video_count: value.videoCount,
    price_per_video: Math.round(value.pricePerVideo * 100) / 100,
    discount_percent: Math.round(value.discountPercent * 100) / 100,
    is_active: value.isActive,
  };

  const admin = createAdminClient();
  const { error } = value.id
    ? await admin.from('packages').update(row).eq('id', value.id)
    : await admin.from('packages').insert(row);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: value.id ? 'update_package' : 'create_package',
    entity: 'package',
    entityId: value.id ?? null,
    meta: row,
  });

  refreshPricing();

  return { success: true };
}

const idSchema = z.object({ id: z.string().uuid('Invalid id.') });
const activeSchema = idSchema.extend({ isActive: z.boolean() });

export async function setPackageActive(
  input: z.infer<typeof activeSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = activeSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('packages')
    .update({ is_active: parsed.data.isActive })
    .eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'toggle_package',
    entity: 'package',
    entityId: parsed.data.id,
    meta: { is_active: parsed.data.isActive },
  });

  refreshPricing();

  return { success: true };
}

export async function deletePackage(
  input: z.infer<typeof idSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = idSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('packages').delete().eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'delete_package',
    entity: 'package',
    entityId: parsed.data.id,
  });

  refreshPricing();

  return { success: true };
}

const addOnSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Name is required.').max(100),
  price: money,
  isActive: z.boolean(),
});

export async function saveAddOn(
  input: z.infer<typeof addOnSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = addOnSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const value = parsed.data;
  const row = {
    name: value.name,
    price: Math.round(value.price * 100) / 100,
    is_active: value.isActive,
  };

  const admin = createAdminClient();
  const { error } = value.id
    ? await admin.from('add_ons').update(row).eq('id', value.id)
    : await admin.from('add_ons').insert(row);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: value.id ? 'update_add_on' : 'create_add_on',
    entity: 'add_on',
    entityId: value.id ?? null,
    meta: row,
  });

  refreshPricing();

  return { success: true };
}

export async function setAddOnActive(
  input: z.infer<typeof activeSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = activeSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('add_ons')
    .update({ is_active: parsed.data.isActive })
    .eq('id', parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAudit({
    actorId: user.id,
    action: 'toggle_add_on',
    entity: 'add_on',
    entityId: parsed.data.id,
    meta: { is_active: parsed.data.isActive },
  });

  refreshPricing();

  return { success: true };
}

export async function deleteAddOn(
  input: z.infer<typeof idSchema>
): Promise<ActionResult> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = idSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const admin = createAdminClient();
  const { error } = await admin.from('add_ons').delete().eq('id', parsed.data.id);

  if (error) {
    return {
      success: false,
      error:
        error.code === '23503'
          ? 'This add-on is used by existing orders. Deactivate it instead of deleting.'
          : error.message,
    };
  }

  await logAudit({
    actorId: user.id,
    action: 'delete_add_on',
    entity: 'add_on',
    entityId: parsed.data.id,
  });

  refreshPricing();

  return { success: true };
}
