'use server';

import { z } from 'zod';
import { requireUser, requireWorkspaceAccess } from '@/lib/guards';
import { createClient } from '@/lib/supabase/server';
import type { Message } from '@/types/db';
import type { ChatActionResult } from '@/components/customer/chat/types';

const chatMessageSchema = z.object({
  workspaceId: z.string().uuid('Choose a valid workspace.'),
  orderId: z.string().uuid('Choose a valid order.').nullable().optional(),
  body: z
    .string()
    .trim()
    .min(1, 'Write a message first.')
    .max(2000, 'Keep messages under 2,000 characters.'),
});

export async function sendChatMessage(input: {
  workspaceId: string;
  orderId?: string | null;
  body: string;
}): Promise<ChatActionResult> {
  const { user } = await requireUser();
  const parsed = chatMessageSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ?? 'Check your message and try again.',
    };
  }

  const data = parsed.data;
  await requireWorkspaceAccess(data.workspaceId);

  const supabase = createClient();
  const orderId = data.orderId ?? null;

  if (orderId) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .eq('workspace_id', data.workspaceId)
      .maybeSingle();

    if (orderError || !order) {
      return {
        ok: false,
        message: 'That order is not available in this workspace.',
      };
    }
  }

  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      workspace_id: data.workspaceId,
      order_id: orderId,
      sender_id: user.id,
      body: data.body,
    })
    .select('*')
    .single();

  if (error || !message) {
    return {
      ok: false,
      message: 'Your message did not send. Try again.',
    };
  }

  return {
    ok: true,
    message: message as Message,
  };
}
