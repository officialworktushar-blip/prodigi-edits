'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireRole } from '@/lib/guards';
import { createDownloadUrl } from '@/lib/storage';
import {
  EXTRAS_SQL_HINT,
  firstIssue,
  isMissingTable,
  isUuid,
  logAudit,
  sanitizeSearch,
  type ActionResult,
} from '@/lib/admin/audit';
import type {
  AuditLog,
  Deliverable,
  Draft,
  Order,
  OrderKind,
  OrderStatus,
  Profile,
  ReviewComment,
} from '@/types/db';

/* -------------------------------------------------------------------------- */
/* Helpers (auth is checked on EVERY call, never once per server instance)     */
/* -------------------------------------------------------------------------- */

interface Actor {
  userId: string;
  isAdmin: boolean;
}

interface OrderAccessRow {
  id: string;
  workspace_id: string;
  customer_id: string;
  status: OrderStatus;
  manager_id: string | null;
  editor_id: string | null;
  thumbnail_artist_id: string | null;
  order_no: number;
}

async function getActor(): Promise<Actor> {
  const { user, profile } = await requireRole(['ADMIN', 'EDITOR']);

  return { userId: user.id, isAdmin: profile?.role === 'ADMIN' };
}

async function loadAccessibleOrder(
  actor: Actor,
  orderId: string
): Promise<OrderAccessRow | null> {
  if (!isUuid(orderId)) {
    return null;
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from('orders')
    .select(
      'id, workspace_id, customer_id, status, order_no, manager_id, editor_id, thumbnail_artist_id'
    )
    .eq('id', orderId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const order = data as OrderAccessRow;

  if (actor.isAdmin) {
    return order;
  }

  const isAssigned =
    order.manager_id === actor.userId ||
    order.editor_id === actor.userId ||
    order.thumbnail_artist_id === actor.userId;

  return isAssigned ? order : null;
}

function refreshOrderPaths(orderId: string) {
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
}

const uuid = z.string().uuid('Invalid id.');

const ORDER_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'IN_REVIEW',
  'REVISION_REQUESTED',
  'APPROVED',
  'DELIVERED',
  'CANCELLED',
] as const;

const ORDER_KINDS = ['HORIZONTAL', 'VERTICAL', 'THUMBNAIL'] as const;

const SELECT_WITH_PEOPLE = `
  *,
  customer:customer_id(id, name, email),
  manager:manager_id(id, name, email),
  editor:editor_id(id, name, email),
  thumbnail_artist:thumbnail_artist_id(id, name, email),
  workspace:workspace_id(id, name)
`;

type OrderWithPeople = Order & {
  customer: Profile | null;
  manager: Profile | null;
  editor: Profile | null;
  thumbnail_artist: Profile | null;
  workspace: { id: string; name: string } | null;
};

/* -------------------------------------------------------------------------- */
/* Reads                                                                       */
/* -------------------------------------------------------------------------- */

export async function getOrders(filters: {
  search?: string;
  status?: OrderStatus;
  kind?: OrderKind;
  editorId?: string;
}): Promise<OrderWithPeople[]> {
  const actor = await getActor();
  const admin = createAdminClient();

  let query = admin
    .from('orders')
    .select(SELECT_WITH_PEOPLE)
    .order('created_at', { ascending: false })
    .limit(500);

  if (!actor.isAdmin) {
    query = query.or(
      `editor_id.eq.${actor.userId},manager_id.eq.${actor.userId},thumbnail_artist_id.eq.${actor.userId}`
    );
  }

  if (filters.status && ORDER_STATUSES.includes(filters.status)) {
    query = query.eq('status', filters.status);
  }

  if (filters.kind && ORDER_KINDS.includes(filters.kind)) {
    query = query.eq('kind', filters.kind);
  }

  if (filters.editorId && isUuid(filters.editorId)) {
    query = query.eq('editor_id', filters.editorId);
  }

  const term = sanitizeSearch(filters.search ?? '');

  if (term) {
    const clauses = [`title.ilike.%${term}%`];
    const numeric = term.replace(/^#/, '');

    if (/^\d{1,12}$/.test(numeric)) {
      clauses.push(`order_no.eq.${numeric}`);
    }

    query = query.or(clauses.join(','));
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error.message);
    return [];
  }

  return (data ?? []) as OrderWithPeople[];
}

export async function getOrderById(orderId: string) {
  const actor = await getActor();

  const order = await loadAccessibleOrder(actor, orderId);

  if (!order) {
    return null;
  }

  const admin = createAdminClient();

  const { data: fullOrder } = await admin
    .from('orders')
    .select(SELECT_WITH_PEOPLE)
    .eq('id', orderId)
    .maybeSingle();

  if (!fullOrder) {
    return null;
  }

  const { data: drafts } = await admin
    .from('drafts')
    .select('*')
    .eq('order_id', orderId)
    .order('version', { ascending: false });

  const { data: deliverables } = await admin
    .from('deliverables')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  const draftIds = ((drafts ?? []) as Draft[]).map((draft) => draft.id);
  let comments: (ReviewComment & { author: Profile | null })[] = [];

  if (draftIds.length > 0) {
    const { data: commentRows } = await admin
      .from('review_comments')
      .select('*, author:author_id(id, name, email)')
      .in('draft_id', draftIds)
      .order('created_at', { ascending: true });

    comments = (commentRows ?? []) as (ReviewComment & {
      author: Profile | null;
    })[];
  }

  const { data: auditLogs } = await admin
    .from('audit_logs')
    .select('*, actor:actor_id(id, name, email)')
    .eq('entity', 'order')
    .eq('entity_id', orderId)
    .order('created_at', { ascending: false })
    .limit(100);

  let notes = '';
  const { data: noteRow, error: noteError } = await admin
    .from('order_notes')
    .select('body')
    .eq('order_id', orderId)
    .maybeSingle();

  if (!noteError && noteRow) {
    notes = (noteRow as { body: string | null }).body ?? '';
  }

  return {
    order: fullOrder as OrderWithPeople,
    drafts: (drafts ?? []) as Draft[],
    deliverables: (deliverables ?? []) as Deliverable[],
    comments,
    auditLogs: (auditLogs ?? []) as (AuditLog & { actor: Profile | null })[],
    notes,
  };
}

export async function getStaffProfiles(): Promise<
  Pick<Profile, 'id' | 'name' | 'email' | 'role'>[]
> {
  await getActor();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('profiles')
    .select('id, name, email, role')
    .in('role', ['ADMIN', 'EDITOR'])
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching staff profiles:', error.message);
    return [];
  }

  return (data ?? []) as Pick<Profile, 'id' | 'name' | 'email' | 'role'>[];
}

export async function getDownloadUrl(
  bucket: 'drafts' | 'deliverables',
  path: string
): Promise<string> {
  const actor = await getActor();

  if (bucket !== 'drafts' && bucket !== 'deliverables') {
    throw new Error('Invalid bucket.');
  }

  const admin = createAdminClient();
  let orderId: string | null = null;

  if (bucket === 'drafts') {
    const { data: byVideo } = await admin
      .from('drafts')
      .select('order_id')
      .eq('path', path)
      .limit(1)
      .maybeSingle();

    orderId = (byVideo as { order_id: string } | null)?.order_id ?? null;

    if (!orderId) {
      const { data: byThumb } = await admin
        .from('drafts')
        .select('order_id')
        .eq('thumbnail_path', path)
        .limit(1)
        .maybeSingle();

      orderId = (byThumb as { order_id: string } | null)?.order_id ?? null;
    }
  } else {
    const { data } = await admin
      .from('deliverables')
      .select('order_id')
      .eq('path', path)
      .limit(1)
      .maybeSingle();

    orderId = (data as { order_id: string } | null)?.order_id ?? null;
  }

  if (!orderId) {
    throw new Error('File not found.');
  }

  const order = await loadAccessibleOrder(actor, orderId);

  if (!order) {
    throw new Error('Not allowed.');
  }

  return createDownloadUrl(path, 3600, bucket);
}

/* -------------------------------------------------------------------------- */
/* Mutations                                                                   */
/* -------------------------------------------------------------------------- */

const assignStaffSchema = z.object({
  orderId: uuid,
  managerId: uuid.nullable(),
  editorId: uuid.nullable(),
  thumbnailArtistId: uuid.nullable(),
});

export async function assignStaff(
  input: z.infer<typeof assignStaffSchema>
): Promise<ActionResult> {
  const actor = await getActor();

  if (!actor.isAdmin) {
    return { success: false, error: 'Only admins can assign staff.' };
  }

  const parsed = assignStaffSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const validated = parsed.data;
  const order = await loadAccessibleOrder(actor, validated.orderId);

  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  const admin = createAdminClient();
  const chosen = Array.from(
    new Set(
      [validated.managerId, validated.editorId, validated.thumbnailArtistId].filter(
        (id): id is string => Boolean(id)
      )
    )
  );

  if (chosen.length > 0) {
    const { data: staffRows } = await admin
      .from('profiles')
      .select('id')
      .in('id', chosen)
      .in('role', ['ADMIN', 'EDITOR']);

    if ((staffRows ?? []).length !== chosen.length) {
      return {
        success: false,
        error: 'Only staff members (editor or admin) can be assigned.',
      };
    }
  }

  const update: Record<string, string | null> = {
    manager_id: validated.managerId,
    editor_id: validated.editorId,
    thumbnail_artist_id: validated.thumbnailArtistId,
  };

  if (order.status === 'SUBMITTED' && validated.editorId) {
    update.status = 'ASSIGNED';
  }

  const { error: updateError } = await admin
    .from('orders')
    .update(update)
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  const previous = new Set(
    [order.manager_id, order.editor_id, order.thumbnail_artist_id].filter(
      (id): id is string => Boolean(id)
    )
  );
  const newlyAssigned = chosen.filter((id) => !previous.has(id));

  if (newlyAssigned.length > 0) {
    await admin.from('notifications').insert(
      newlyAssigned.map((userId) => ({
        user_id: userId,
        title: `You were assigned order #${order.order_no}`,
        body: 'Open the order to see the brief and due date.',
        href: `/admin/orders/${validated.orderId}`,
      }))
    );
  }

  await logAudit({
    actorId: actor.userId,
    action: 'assign_staff',
    entity: 'order',
    entityId: validated.orderId,
    meta: {
      manager_id: validated.managerId,
      editor_id: validated.editorId,
      thumbnail_artist_id: validated.thumbnailArtistId,
    },
  });

  refreshOrderPaths(validated.orderId);

  return { success: true };
}

const setDueDateSchema = z.object({
  orderId: uuid,
  dueAt: z.string().datetime('Invalid date.').nullable(),
});

export async function setDueDate(
  input: z.infer<typeof setDueDateSchema>
): Promise<ActionResult> {
  const actor = await getActor();
  const parsed = setDueDateSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const validated = parsed.data;
  const order = await loadAccessibleOrder(actor, validated.orderId);

  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  const admin = createAdminClient();
  const { error: updateError } = await admin
    .from('orders')
    .update({ due_at: validated.dueAt })
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await logAudit({
    actorId: actor.userId,
    action: 'set_due_date',
    entity: 'order',
    entityId: validated.orderId,
    meta: { due_at: validated.dueAt },
  });

  refreshOrderPaths(validated.orderId);

  return { success: true };
}

const updateInternalNotesSchema = z.object({
  orderId: uuid,
  notes: z.string().max(5000, 'Notes are too long.').nullable(),
});

export async function updateInternalNotes(
  input: z.infer<typeof updateInternalNotesSchema>
): Promise<ActionResult> {
  const actor = await getActor();
  const parsed = updateInternalNotesSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const validated = parsed.data;
  const order = await loadAccessibleOrder(actor, validated.orderId);

  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  const admin = createAdminClient();
  const { error: upsertError } = await admin.from('order_notes').upsert(
    {
      order_id: validated.orderId,
      body: validated.notes,
      updated_by: actor.userId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'order_id' }
  );

  if (upsertError) {
    return {
      success: false,
      error: isMissingTable(upsertError.message)
        ? EXTRAS_SQL_HINT
        : upsertError.message,
    };
  }

  await logAudit({
    actorId: actor.userId,
    action: 'update_internal_notes',
    entity: 'order',
    entityId: validated.orderId,
    meta: { length: validated.notes?.length ?? 0 },
  });

  refreshOrderPaths(validated.orderId);

  return { success: true };
}

const uploadDraftSchema = z.object({
  orderId: uuid,
  path: z.string().min(1).max(500),
  thumbnailPath: z.string().max(500).nullable(),
  note: z.string().max(1000).nullable(),
});

export async function uploadDraft(
  input: z.infer<typeof uploadDraftSchema>
): Promise<ActionResult & { version?: number }> {
  const actor = await getActor();
  const parsed = uploadDraftSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const validated = parsed.data;
  const order = await loadAccessibleOrder(actor, validated.orderId);

  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  const prefix = `${order.workspace_id}/${order.id}/`;

  if (
    !validated.path.startsWith(prefix) ||
    (validated.thumbnailPath && !validated.thumbnailPath.startsWith(prefix))
  ) {
    return { success: false, error: 'The uploaded file does not belong to this order.' };
  }

  const admin = createAdminClient();
  let version = 0;
  let insertFailure: string | null = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data: last } = await admin
      .from('drafts')
      .select('version')
      .eq('order_id', validated.orderId)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    const next = ((last as { version: number } | null)?.version ?? 0) + 1;
    const { error: draftError } = await admin.from('drafts').insert({
      order_id: validated.orderId,
      version: next,
      path: validated.path,
      thumbnail_path: validated.thumbnailPath,
      note: validated.note,
      created_by: actor.userId,
    });

    if (!draftError) {
      version = next;
      insertFailure = null;
      break;
    }

    insertFailure = draftError.message;

    if (draftError.code !== '23505') {
      break;
    }
  }

  if (!version) {
    return { success: false, error: insertFailure ?? 'Could not save the draft.' };
  }

  const { error: statusError } = await admin
    .from('orders')
    .update({ status: 'IN_REVIEW' })
    .eq('id', validated.orderId);

  if (statusError) {
    return { success: false, error: statusError.message };
  }

  await admin.from('notifications').insert({
    user_id: order.customer_id,
    title: 'New draft ready for review',
    body: `Draft version ${version} is ready for your review.`,
    href: `/app/orders/${validated.orderId}`,
  });

  await logAudit({
    actorId: actor.userId,
    action: 'upload_draft',
    entity: 'order',
    entityId: validated.orderId,
    meta: { version, path: validated.path, note: validated.note },
  });

  refreshOrderPaths(validated.orderId);

  return { success: true, version };
}

const uploadDeliverableSchema = z.object({
  orderId: uuid,
  name: z.string().trim().min(1, 'Name is required.').max(200),
  path: z.string().min(1).max(500),
  type: z.string().max(60).nullable(),
});

export async function uploadDeliverable(
  input: z.infer<typeof uploadDeliverableSchema>
): Promise<ActionResult> {
  const actor = await getActor();
  const parsed = uploadDeliverableSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const validated = parsed.data;
  const order = await loadAccessibleOrder(actor, validated.orderId);

  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  if (!validated.path.startsWith(`${order.workspace_id}/${order.id}/`)) {
    return { success: false, error: 'The uploaded file does not belong to this order.' };
  }

  const admin = createAdminClient();
  const { error: insertError } = await admin.from('deliverables').insert({
    order_id: validated.orderId,
    name: validated.name,
    path: validated.path,
    type: validated.type,
  });

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  await logAudit({
    actorId: actor.userId,
    action: 'upload_deliverable',
    entity: 'order',
    entityId: validated.orderId,
    meta: { name: validated.name, path: validated.path, type: validated.type },
  });

  refreshOrderPaths(validated.orderId);

  return { success: true };
}

const updateStatusSchema = z.object({
  orderId: uuid,
  status: z.enum(ORDER_STATUSES),
});

const STATUS_NOTIFICATIONS: Partial<
  Record<OrderStatus, { title: string; body: string }>
> = {
  IN_PROGRESS: {
    title: 'We started working on your order',
    body: 'Your editor is now working on your video.',
  },
  IN_REVIEW: {
    title: 'Your order is ready for review',
    body: 'Open the order to watch the draft and leave comments.',
  },
  REVISION_REQUESTED: {
    title: 'Revision requested',
    body: 'A revision has been requested for your order.',
  },
  APPROVED: {
    title: 'Draft approved',
    body: 'Your draft has been approved and is being prepared for delivery.',
  },
  DELIVERED: {
    title: 'Your order has been delivered',
    body: 'Your files are ready for download.',
  },
  CANCELLED: {
    title: 'Order cancelled',
    body: 'Your order has been cancelled.',
  },
};

export async function updateStatus(
  input: z.infer<typeof updateStatusSchema>
): Promise<ActionResult> {
  const actor = await getActor();
  const parsed = updateStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const validated = parsed.data;

  if (validated.status === 'CANCELLED' && !actor.isAdmin) {
    return { success: false, error: 'Only admins can cancel an order.' };
  }

  const order = await loadAccessibleOrder(actor, validated.orderId);

  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  if (order.status === validated.status) {
    return { success: true };
  }

  const admin = createAdminClient();
  const { error: updateError } = await admin
    .from('orders')
    .update({ status: validated.status })
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  const message = STATUS_NOTIFICATIONS[validated.status];

  if (message) {
    await admin.from('notifications').insert({
      user_id: order.customer_id,
      title: message.title,
      body: message.body,
      href: `/app/orders/${validated.orderId}`,
    });
  }

  await logAudit({
    actorId: actor.userId,
    action: 'update_status',
    entity: 'order',
    entityId: validated.orderId,
    meta: { from: order.status, to: validated.status },
  });

  refreshOrderPaths(validated.orderId);

  return { success: true };
}

const cancelOrderSchema = z.object({
  orderId: uuid,
  reason: z.string().max(500).optional(),
});

export async function cancelOrder(
  input: z.infer<typeof cancelOrderSchema>
): Promise<ActionResult> {
  const actor = await getActor();

  if (!actor.isAdmin) {
    return { success: false, error: 'Only admins can cancel an order.' };
  }

  const parsed = cancelOrderSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: firstIssue(parsed.error) };
  }

  const validated = parsed.data;
  const order = await loadAccessibleOrder(actor, validated.orderId);

  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  const admin = createAdminClient();
  const { error: updateError } = await admin
    .from('orders')
    .update({ status: 'CANCELLED' })
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await admin.from('notifications').insert({
    user_id: order.customer_id,
    title: 'Order cancelled',
    body: validated.reason?.trim() || 'Your order has been cancelled.',
    href: `/app/orders/${validated.orderId}`,
  });

  await logAudit({
    actorId: actor.userId,
    action: 'cancel_order',
    entity: 'order',
    entityId: validated.orderId,
    meta: { reason: validated.reason ?? null, from: order.status },
  });

  refreshOrderPaths(validated.orderId);

  return { success: true };
}
