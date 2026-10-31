'use server';

import { createDownloadUrl } from '@/lib/storage';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { requireRole } from '@/lib/guards';
import type {
  Order,
  Draft,
  Deliverable,
  ReviewComment,
  AuditLog,
  Profile,
  OrderStatus,
  OrderKind,
} from '@/types/db';

const { user, profile } = await requireRole(['ADMIN', 'EDITOR']);
const isAdmin = profile?.role === 'ADMIN';
const userId = user.id;

const admin = createAdminClient();

export async function getOrders(filters: {
  search?: string;
  status?: OrderStatus;
  kind?: OrderKind;
  editorId?: string;
}) {
  const client = createClient();

  let query = client
    .from('orders')
    .select(`
      *,
      customer:customer_id(id, name, email),
      manager:manager_id(id, name, email),
      editor:editor_id(id, name, email),
      thumbnail_artist:thumbnail_artist_id(id, name, email),
      workspace:workspace_id(id, name)
    `)
    .order('created_at', { ascending: false });

  if (!isAdmin) {
    query = query.or(`editor_id.eq.${userId},manager_id.eq.${userId},thumbnail_artist_id.eq.${userId}`);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.kind) {
    query = query.eq('kind', filters.kind);
  }

  if (filters.editorId) {
    query = query.eq('editor_id', filters.editorId);
  }

  if (filters.search) {
    const searchTerm = filters.search;
    query = query.or(`title.ilike.%${searchTerm}%,order_no.ilike.%${searchTerm}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data as (Order & {
    customer: Profile | null;
    manager: Profile | null;
    editor: Profile | null;
    thumbnail_artist: Profile | null;
    workspace: { id: string; name: string } | null;
  })[];
}

export async function getOrderById(orderId: string) {
  const client = createClient();

  const { data: order, error: orderError } = await client
    .from('orders')
    .select(`
      *,
      customer:customer_id(id, name, email),
      manager:manager_id(id, name, email),
      editor:editor_id(id, name, email),
      thumbnail_artist:thumbnail_artist_id(id, name, email),
      workspace:workspace_id(id, name)
    `)
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return null;
  }

  if (!isAdmin) {
    const isAssigned =
      order.editor_id === userId ||
      order.manager_id === userId ||
      order.thumbnail_artist_id === userId;

    if (!isAssigned) {
      return null;
    }
  }

  const { data: drafts, error: draftsError } = await client
    .from('drafts')
    .select('*')
    .eq('order_id', orderId)
    .order('version', { ascending: false });

  const { data: deliverables, error: deliverablesError } = await client
    .from('deliverables')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  const { data: comments, error: commentsError } = await client
    .from('review_comments')
    .select(`
      *,
      author:author_id(id, name, email)
    `)
    .in('draft_id', (drafts || []).map((d) => d.id))
    .order('created_at', { ascending: true });

  const { data: auditLogs, error: auditError } = await client
    .from('audit_logs')
    .select(`
      *,
      actor:actor_id(id, name, email)
    `)
    .eq('entity', 'order')
    .eq('entity_id', orderId)
    .order('created_at', { ascending: false });

  return {
    order: order as Order & {
      customer: Profile | null;
      manager: Profile | null;
      editor: Profile | null;
      thumbnail_artist: Profile | null;
      workspace: { id: string; name: string } | null;
    },
    drafts: (drafts || []) as Draft[],
    deliverables: (deliverables || []) as Deliverable[],
    comments: (comments || []) as (ReviewComment & {
      author: Profile | null;
    })[],
    auditLogs: (auditLogs || []) as (AuditLog & {
      actor: Profile | null;
    })[],
  };
}

export async function getStaffProfiles() {
  const { data, error } = await admin
    .from('profiles')
    .select('id, name, email, role')
    .in('role', ['ADMIN', 'EDITOR'])
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching staff profiles:', error);
    return [];
  }

  return data as Profile[];
}

const assignStaffSchema = z.object({
  orderId: z.string().uuid(),
  managerId: z.string().uuid().nullable(),
  editorId: z.string().uuid().nullable(),
  thumbnailArtistId: z.string().uuid().nullable(),
});

export async function assignStaff(input: z.infer<typeof assignStaffSchema>) {
  const validated = assignStaffSchema.parse(input);

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id')
    .eq('id', validated.orderId)
    .single();

  if (orderError || !order) {
    return { success: false, error: 'Order not found' };
  }

  const { error: updateError } = await admin
    .from('orders')
    .update({
      manager_id: validated.managerId,
      editor_id: validated.editorId,
      thumbnail_artist_id: validated.thumbnailArtistId,
    })
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await admin.from('audit_logs').insert({
    actor_id: userId,
    action: 'assign_staff',
    entity: 'order',
    entity_id: validated.orderId,
    meta: {
      manager_id: validated.managerId,
      editor_id: validated.editorId,
      thumbnail_artist_id: validated.thumbnailArtistId,
    },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${validated.orderId}`);

  return { success: true };
}

const setDueDateSchema = z.object({
  orderId: z.string().uuid(),
  dueAt: z.string().datetime().nullable(),
});

export async function setDueDate(input: z.infer<typeof setDueDateSchema>) {
  const validated = setDueDateSchema.parse(input);

  const { error: updateError } = await admin
    .from('orders')
    .update({ due_at: validated.dueAt ? validated.dueAt : null })
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await admin.from('audit_logs').insert({
    actor_id: userId,
    action: 'set_due_date',
    entity: 'order',
    entity_id: validated.orderId,
    meta: { due_at: validated.dueAt },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${validated.orderId}`);

  return { success: true };
}

const updateInternalNotesSchema = z.object({
  orderId: z.string().uuid(),
  notes: z.string().nullable(),
});

export async function updateInternalNotes(input: z.infer<typeof updateInternalNotesSchema>) {
  const validated = updateInternalNotesSchema.parse(input);

  const { error: updateError } = await admin
    .from('orders')
    .update({ brief: validated.notes })
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  await admin.from('audit_logs').insert({
    actor_id: userId,
    action: 'update_internal_notes',
    entity: 'order',
    entity_id: validated.orderId,
    meta: { notes: validated.notes },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${validated.orderId}`);

  return { success: true };
}

const uploadDraftSchema = z.object({
  orderId: z.string().uuid(),
  path: z.string(),
  thumbnailPath: z.string().nullable(),
  note: z.string().nullable(),
});

export async function uploadDraft(input: z.infer<typeof uploadDraftSchema>) {
  const validated = uploadDraftSchema.parse(input);

  const { data: maxVersion, error: versionError } = await admin
    .from('drafts')
    .select('version')
    .eq('order_id', validated.orderId)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  const nextVersion = maxVersion ? maxVersion.version + 1 : 1;

  const { error: draftError } = await admin.from('drafts').insert({
    order_id: validated.orderId,
    version: nextVersion,
    path: validated.path,
    thumbnail_path: validated.thumbnailPath,
    note: validated.note,
    created_by: userId,
  });

  if (draftError) {
    return { success: false, error: draftError.message };
  }

  const { error: orderError } = await admin
    .from('orders')
    .update({ status: 'IN_REVIEW' })
    .eq('id', validated.orderId);

  if (orderError) {
    return { success: false, error: orderError.message };
  }

  const { data: order } = await admin
    .from('orders')
    .select('customer_id')
    .eq('id', validated.orderId)
    .single();

  if (order?.customer_id) {
    await admin.from('notifications').insert({
      user_id: order.customer_id,
      title: 'New draft ready for review',
      body: `Draft version ${nextVersion} is ready for your review.`,
      href: `/app/orders/${validated.orderId}`,
    });
  }

  await admin.from('audit_logs').insert({
    actor_id: userId,
    action: 'upload_draft',
    entity: 'order',
    entity_id: validated.orderId,
    meta: {
      version: nextVersion,
      path: validated.path,
      note: validated.note,
    },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${validated.orderId}`);

  return { success: true, version: nextVersion };
}

const uploadDeliverableSchema = z.object({
  orderId: z.string().uuid(),
  name: z.string(),
  path: z.string(),
  type: z.string().nullable(),
});

export async function uploadDeliverable(input: z.infer<typeof uploadDeliverableSchema>) {
  const validated = uploadDeliverableSchema.parse(input);

  const { error: deliverableError } = await admin.from('deliverables').insert({
    order_id: validated.orderId,
    name: validated.name,
    path: validated.path,
    type: validated.type,
  });

  if (deliverableError) {
    return { success: false, error: deliverableError.message };
  }

  await admin.from('audit_logs').insert({
    actor_id: userId,
    action: 'upload_deliverable',
    entity: 'order',
    entity_id: validated.orderId,
    meta: {
      name: validated.name,
      path: validated.path,
      type: validated.type,
    },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${validated.orderId}`);

  return { success: true };
}

const updateStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum([
    'DRAFT',
    'SUBMITTED',
    'ASSIGNED',
    'IN_PROGRESS',
    'IN_REVIEW',
    'REVISION_REQUESTED',
    'APPROVED',
    'DELIVERED',
    'CANCELLED',
  ]),
});

export async function updateStatus(input: z.infer<typeof updateStatusSchema>) {
  const validated = updateStatusSchema.parse(input);

  const { error: updateError } = await admin
    .from('orders')
    .update({ status: validated.status })
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  const { data: order } = await admin
    .from('orders')
    .select('customer_id')
    .eq('id', validated.orderId)
    .single();

  if (order?.customer_id) {
    let title = 'Order status updated';
    let body = `Your order status is now ${validated.status.replace(/_/g, ' ')}`;

    if (validated.status === 'DELIVERED') {
      title = 'Your order has been delivered';
      body = 'Your video is ready for download.';
    } else if (validated.status === 'APPROVED') {
      title = 'Draft approved';
      body = 'Your draft has been approved and is being prepared for delivery.';
    } else if (validated.status === 'REVISION_REQUESTED') {
      title = 'Revision requested';
      body = 'A revision has been requested for your order.';
    }

    await admin.from('notifications').insert({
      user_id: order.customer_id,
      title,
      body,
      href: `/app/orders/${validated.orderId}`,
    });
  }

  await admin.from('audit_logs').insert({
    actor_id: userId,
    action: 'update_status',
    entity: 'order',
    entity_id: validated.orderId,
    meta: { status: validated.status },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${validated.orderId}`);

  return { success: true };
}

const cancelOrderSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().optional(),
});

export async function cancelOrder(input: z.infer<typeof cancelOrderSchema>) {
  const validated = cancelOrderSchema.parse(input);

  const { error: updateError } = await admin
    .from('orders')
    .update({ status: 'CANCELLED' })
    .eq('id', validated.orderId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  const { data: order } = await admin
    .from('orders')
    .select('customer_id')
    .eq('id', validated.orderId)
    .single();

  if (order?.customer_id) {
    await admin.from('notifications').insert({
      user_id: order.customer_id,
      title: 'Order cancelled',
      body: validated.reason || 'Your order has been cancelled.',
      href: `/app/orders/${validated.orderId}`,
    });
  }

  await admin.from('audit_logs').insert({
    actor_id: userId,
    action: 'cancel_order',
    entity: 'order',
    entity_id: validated.orderId,
    meta: { reason: validated.reason },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${validated.orderId}`);

  return { success: true };
}

export async function getDownloadUrl(bucket: 'drafts' | 'deliverables', path: string) {
  await requireRole(['ADMIN', 'EDITOR']);
  return await createDownloadUrl(path, 3600, bucket);
}
