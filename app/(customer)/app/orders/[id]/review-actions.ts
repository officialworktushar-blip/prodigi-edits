'use server';

import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { ReviewActionResult } from '@/components/customer/review/types';
import { requireUser, requireWorkspaceAccess } from '@/lib/guards';
import { createClient } from '@/lib/supabase/server';
import type {
  CommentStatus,
  OrderStatus,
  ReviewComment,
} from '@/types/db';

const orderSchema = z.object({
  orderId: z.string().uuid('Choose a valid order.'),
});

const addCommentSchema = orderSchema.extend({
  draftId: z.string().uuid('Choose a valid draft.'),
  body: z
    .string()
    .trim()
    .min(1, 'Write a comment before sending.')
    .max(2000, 'Keep comments under 2,000 characters.'),
  timestampSec: z
    .number()
    .finite()
    .min(0, 'Choose a position inside the video.')
    .max(1000000, 'That timestamp is outside the supported range.')
    .nullable(),
  parentId: z.string().uuid('Choose a valid comment thread.').nullish(),
});

const commentStatusSchema = z.object({
  commentId: z.string().uuid('Choose a valid comment.'),
  status: z.enum(['OPEN', 'RESOLVED']),
});

interface OrderAccessRow {
  id: string;
  workspace_id: string;
  status: OrderStatus;
}

interface CommentAccessRow {
  id: string;
  draft_id: string;
  author_id: string;
  status: CommentStatus;
}

function failure(
  message: string,
  fieldErrors?: Record<string, string[]>
): ReviewActionResult {
  return { ok: false, message, fieldErrors };
}

function zodFields(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path ?? [];
    const key = path.length > 0 ? String(path[0]) : 'form';

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(issue.message);
  }

  return result;
}

async function loadOrder(
  supabase: SupabaseClient,
  orderId: string
): Promise<OrderAccessRow | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('id, workspace_id, status')
    .eq('id', orderId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as OrderAccessRow;
}

function revalidateOrder(orderId: string): void {
  revalidatePath('/app');
  revalidatePath('/app/orders');
  revalidatePath(`/app/orders/${orderId}`);
}

export async function addReviewComment(
  input: unknown
): Promise<ReviewActionResult> {
  const { user } = await requireUser();
  const parsed = addCommentSchema.safeParse(input);

  if (!parsed.success) {
    return failure(
      'Check your comment and try again.',
      zodFields(parsed.error)
    );
  }

  const data = parsed.data;
  const supabase = createClient();
  const order = await loadOrder(supabase, data.orderId);

  if (!order) {
    return failure('This order is not available.');
  }

  await requireWorkspaceAccess(order.workspace_id);

  if (order.status === 'CANCELLED') {
    return failure('This order is cancelled and no longer accepts comments.');
  }

  const { data: draft, error: draftError } = await supabase
    .from('drafts')
    .select('id, order_id')
    .eq('id', data.draftId)
    .eq('order_id', order.id)
    .maybeSingle();

  if (draftError || !draft) {
    return failure('This draft is no longer available. Refresh and try again.');
  }

  if (data.parentId) {
    const { data: parent, error: parentError } = await supabase
      .from('review_comments')
      .select('id')
      .eq('id', data.parentId)
      .eq('draft_id', data.draftId)
      .maybeSingle();

    if (parentError || !parent) {
      return failure('That comment thread is no longer available.');
    }
  }

  const timestampSec =
    data.timestampSec === null
      ? null
      : Math.round(data.timestampSec * 100) / 100;

  const { data: created, error: insertError } = await supabase
    .from('review_comments')
    .insert({
      draft_id: data.draftId,
      author_id: user.id,
      timestamp_sec: timestampSec,
      body: data.body,
      status: 'OPEN',
      parent_id: data.parentId ?? null,
    })
    .select('*')
    .single();

  if (insertError || !created) {
    return failure('Your comment could not be saved. Try again.');
  }

  revalidateOrder(order.id);

  return {
    ok: true,
    message: 'Comment added.',
    comment: created as ReviewComment,
  };
}

export async function setReviewCommentStatus(
  input: unknown
): Promise<ReviewActionResult> {
  const { user } = await requireUser();
  const parsed = commentStatusSchema.safeParse(input);

  if (!parsed.success) {
    return failure('Choose a valid comment status.');
  }

  const data = parsed.data;
  const supabase = createClient();
  const { data: comment, error: commentError } = await supabase
    .from('review_comments')
    .select('id, draft_id, author_id, status')
    .eq('id', data.commentId)
    .maybeSingle();

  if (commentError || !comment) {
    return failure('This comment is no longer available.');
  }

  const row = comment as CommentAccessRow;

  if (row.author_id !== user.id) {
    return failure('Only the comment author can change its status.');
  }

  const { data: draft, error: draftError } = await supabase
    .from('drafts')
    .select('order_id')
    .eq('id', row.draft_id)
    .maybeSingle();

  if (draftError || !draft) {
    return failure('This draft is no longer available.');
  }

  const order = await loadOrder(
    supabase,
    (draft as { order_id: string }).order_id
  );

  if (!order) {
    return failure('This order is not available.');
  }

  await requireWorkspaceAccess(order.workspace_id);

  if (row.status === data.status) {
    return {
      ok: true,
      message:
        data.status === 'RESOLVED'
          ? 'This comment is already resolved.'
          : 'This comment is already open.',
      commentStatus: data.status,
    };
  }

  const { data: updated, error: updateError } = await supabase
    .from('review_comments')
    .update({ status: data.status })
    .eq('id', row.id)
    .eq('author_id', user.id)
    .select('id, status')
    .maybeSingle();

  if (updateError || !updated) {
    return failure('The comment status could not be updated. Try again.');
  }

  revalidateOrder(order.id);

  return {
    ok: true,
    message:
      data.status === 'RESOLVED'
        ? 'Comment resolved.'
        : 'Comment reopened.',
    commentStatus: data.status,
  };
}

async function changeOrderStatus(
  input: unknown,
  nextStatus: 'REVISION_REQUESTED' | 'APPROVED',
  successMessage: string
): Promise<ReviewActionResult> {
  const parsed = orderSchema.safeParse(input);

  if (!parsed.success) {
    return failure('Choose a valid order.');
  }

  const supabase = createClient();
  const order = await loadOrder(supabase, parsed.data.orderId);

  if (!order) {
    return failure('This order is not available.');
  }

  await requireWorkspaceAccess(order.workspace_id);

  if (order.status !== 'IN_REVIEW') {
    return failure('This order is not currently waiting for your review.');
  }

  const { data: updated, error: updateError } = await supabase
    .from('orders')
    .update({ status: nextStatus })
    .eq('id', order.id)
    .eq('status', 'IN_REVIEW')
    .select('id, status')
    .maybeSingle();

  if (updateError || !updated) {
    return failure('We could not update this order. Refresh and try again.');
  }

  revalidateOrder(order.id);

  return {
    ok: true,
    message: successMessage,
    orderStatus: nextStatus,
  };
}

export async function requestRevision(
  input: unknown
): Promise<ReviewActionResult> {
  await requireUser();

  return changeOrderStatus(
    input,
    'REVISION_REQUESTED',
    'Revision requested. This order is back in production for the next cut.'
  );
}

export async function approveOrder(
  input: unknown
): Promise<ReviewActionResult> {
  await requireUser();

  return changeOrderStatus(
    input,
    'APPROVED',
    'Cut approved. Your final delivery is being prepared.'
  );
}
