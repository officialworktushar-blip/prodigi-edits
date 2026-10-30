'use server';

import { z } from 'zod';
import { requireUser, requireWorkspaceAccess } from '@/lib/guards';
import { removeObject } from '@/lib/storage';
import { createClient } from '@/lib/supabase/server';
import type {
  RemoveUploadResult,
  UploadFootageResult,
  UploadedFootage,
} from '@/components/customer/wizard/types';
import type { FootageFile } from '@/types/db';

const uploadSchema = z.object({
  workspaceId: z.string().uuid('Choose a workspace.'),
  orderId: z.string().uuid('Save the idea step first.'),
  path: z.string().trim().min(1).max(1024),
  name: z.string().trim().min(1).max(255),
  size: z.number().int().positive('The uploaded file is empty.'),
});

const removeSchema = z.object({
  workspaceId: z.string().uuid('Choose a workspace.'),
  orderId: z.string().uuid('Choose a valid order.'),
  path: z.string().trim().min(1).max(1024),
});

function belongsToOrder(
  path: string,
  workspaceId: string,
  orderId: string
): boolean {
  const prefix = `${workspaceId}/${orderId}/`;

  if (!path.startsWith(prefix)) {
    return false;
  }

  const remainder = path.slice(prefix.length);

  return (
    remainder.length > 0 &&
    remainder.length <= 255 &&
    !remainder.includes('/') &&
    !remainder.includes('\\') &&
    !remainder.includes('..') &&
    !remainder.includes('\0')
  );
}

function mapFile(file: FootageFile): UploadedFootage {
  return {
    id: file.id,
    name: file.name,
    size: file.size,
    path: file.path,
    createdAt: file.created_at,
  };
}

export async function saveUploadedFootage(
  input: unknown
): Promise<UploadFootageResult> {
  await requireUser();

  const parsed = uploadSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ??
        'Check the uploaded file details and try again.',
    };
  }

  const data = parsed.data;
  await requireWorkspaceAccess(data.workspaceId);

  if (!belongsToOrder(data.path, data.workspaceId, data.orderId)) {
    return {
      ok: false,
      message: 'That upload does not belong to this order.',
    };
  }

  const supabase = createClient();
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .eq('id', data.orderId)
    .eq('workspace_id', data.workspaceId)
    .eq('status', 'DRAFT')
    .maybeSingle();

  if (orderError || !order) {
    return {
      ok: false,
      message: 'This draft is no longer accepting uploads.',
    };
  }

  const { data: existing } = await supabase
    .from('footage_files')
    .select('*')
    .eq('order_id', data.orderId)
    .eq('path', data.path)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return { ok: true, file: mapFile(existing as FootageFile) };
  }

  const { data: inserted, error: insertError } = await supabase
    .from('footage_files')
    .insert({
      order_id: data.orderId,
      name: data.name,
      size: data.size,
      path: data.path,
      url: null,
      source: 'UPLOAD',
    })
    .select('*')
    .single();

  if (insertError || !inserted) {
    return {
      ok: false,
      message: 'The file uploaded, but we could not attach it to the order.',
    };
  }

  return { ok: true, file: mapFile(inserted as FootageFile) };
}

export async function removeUploadedFootage(
  input: unknown
): Promise<RemoveUploadResult> {
  await requireUser();

  const parsed = removeSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ??
        'Check the upload details and try again.',
    };
  }

  const data = parsed.data;
  await requireWorkspaceAccess(data.workspaceId);

  if (!belongsToOrder(data.path, data.workspaceId, data.orderId)) {
    return {
      ok: false,
      message: 'That upload does not belong to this order.',
    };
  }

  try {
    await removeObject(data.path);
  } catch {
    return {
      ok: false,
      message: 'The upload was cancelled, but cleanup is still pending.',
    };
  }

  const supabase = createClient();
  await supabase
    .from('footage_files')
    .delete()
    .eq('order_id', data.orderId)
    .eq('path', data.path);

  return { ok: true };
}
