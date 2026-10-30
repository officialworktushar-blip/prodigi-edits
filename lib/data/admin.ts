import { createClient } from '../supabase/server';
import type { Order, OrderStatus } from '../../types/db';

export type AdminOrderSummary = Pick<
  Order,
  | 'id'
  | 'order_no'
  | 'title'
  | 'status'
  | 'due_at'
  | 'created_at'
  | 'kind'
  | 'customer_id'
  | 'workspace_id'
>;

export async function getAdminOrders(
  limit = 2000
): Promise<AdminOrderSummary[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select(
        'id, order_no, title, status, due_at, created_at, kind, customer_id, workspace_id'
      )
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return (data as AdminOrderSummary[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getActiveSubscriptionCount(): Promise<number> {
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'ACTIVE');

    if (error) {
      return 0;
    }

    return count ?? 0;
  } catch {
    return 0;
  }
}

export const ADMIN_STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In progress',
  IN_REVIEW: 'In review',
  REVISION_REQUESTED: 'Revision',
  APPROVED: 'Approved',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ADMIN_STATUS_FLOW: OrderStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'IN_REVIEW',
  'REVISION_REQUESTED',
  'APPROVED',
  'DELIVERED',
  'CANCELLED',
];
