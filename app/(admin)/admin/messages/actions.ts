'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { firstIssue } from '@/lib/admin/audit';

const sendSchema = z.object({
  orderId: z.string().uuid().nullable(),
  workspaceId: z.string().uuid('Invalid workspace.'),
  body: z.string().trim().min(1, 'Write a message first.').max(4000, 'Message is too long.'),
});

export interface SentMessage {
  id: string;
  order_id: string | null;
  workspace_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export async function sendAdminMessage(
  input: z.infer<typeof sendSchema>
): Promise<{ success: boolean; error?: string; message?: SentMessage }> {
  const { user } = await requireRole(['ADMIN']);
  const parsed = sendSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const { orderId, workspaceId, body } = parsed.data;
  const admin = createAdminClient();
  let recipientId: string | null = null;

  if (orderId) {
    const { data: order } = await admin
      .from('orders')
      .select('id, workspace_id, customer_id')
      .eq('id', orderId)
      .maybeSingle();

    if (!order || (order as { workspace_id: string }).workspace_id !== workspaceId) {
      return { success: false, error: 'Order not found in this workspace.' };
    }

    recipientId = (order as { customer_id: string }).customer_id;
  } else {
    const { data: workspace } = await admin
      .from('workspaces')
      .select('id, owner_id')
      .eq('id', workspaceId)
      .maybeSingle();

    if (!workspace) {
      return { success: false, error: 'Workspace not found.' };
    }

    recipientId = (workspace as { owner_id: string }).owner_id;
  }

  const { data: inserted, error } = await admin
    .from('messages')
    .insert({
      order_id: orderId,
      workspace_id: workspaceId,
      sender_id: user.id,
      body,
    })
    .select('id, order_id, workspace_id, sender_id, body, created_at')
    .single();

  if (error || !inserted) {
    return { success: false, error: error?.message ?? 'Could not send the message.' };
  }

  if (recipientId && recipientId !== user.id) {
    await admin.from('notifications').insert({
      user_id: recipientId,
      title: 'New message from support',
      body: body.length > 120 ? `${body.slice(0, 117)}...` : body,
      href: '/app/messages',
    });
  }

  revalidatePath('/admin/messages');

  return { success: true, message: inserted as SentMessage };
}
