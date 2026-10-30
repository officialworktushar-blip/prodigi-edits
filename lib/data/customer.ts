import { createAdminClient } from '../supabase/admin';
import { createClient } from '../supabase/server';
import type {
  Credit,
  Deliverable,
  Draft,
  FootageFile,
  Invite,
  Message,
  Notification,
  Order,
  OrderStatus,
  ReviewComment,
  Subscription,
  Workspace,
  WorkspaceMember,
} from '../../types/db';

export interface OrderTeamProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export async function getCustomerWorkspaces(): Promise<Workspace[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      return [];
    }

    return (data as Workspace[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getWorkspace(
  workspaceId: string
): Promise<Workspace | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspaceId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as Workspace;
  } catch {
    return null;
  }
}

export async function getCustomerWorkspaceMemberships(
  userId: string
): Promise<WorkspaceMember[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspace_members')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      return [];
    }

    return (data as WorkspaceMember[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getWorkspaceMembers(
  workspaceId: string
): Promise<WorkspaceMember[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('workspace_members')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: true });

    if (error) {
      return [];
    }

    return (data as WorkspaceMember[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getWorkspaceInvites(
  workspaceId: string
): Promise<Invite[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data as Invite[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getWorkspaceMessages(
  workspaceId: string,
  limit = 600
): Promise<Message[]> {
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 1000);

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(safeLimit);

    if (error) {
      return [];
    }

    return ((data as Message[] | null) ?? []).reverse();
  } catch {
    return [];
  }
}

export async function getCustomerNotifications(
  userId: string,
  limit = 8
): Promise<Notification[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return [];
    }

    return (data as Notification[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  try {
    const supabase = createClient();
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('read_at', null);

    if (error) {
      return 0;
    }

    return count ?? 0;
  } catch {
    return 0;
  }
}

function normalizeOrderSearch(value: string | undefined): string {
  return (value ?? '')
    .trim()
    .replace(/[,()%]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 100);
}

export async function getCustomerOrders(input: {
  workspaceId?: string | null;
  customerId: string;
  limit?: number;
  status?: OrderStatus | null;
  search?: string;
}): Promise<Order[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('orders').select('*');

    query = input.workspaceId
      ? query.eq('workspace_id', input.workspaceId)
      : query.eq('customer_id', input.customerId);

    if (input.status) {
      query = query.eq('status', input.status);
    }

    const search = normalizeOrderSearch(input.search);

    if (search) {
      if (/^\d{1,10}$/.test(search)) {
        query = query.or(
          `title.ilike.%${search}%,order_no.eq.${search}`
        );
      } else {
        query = query.ilike('title', `%${search}%`);
      }
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(input.limit ?? 100);

    if (error) {
      return [];
    }

    return (data as Order[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getCustomerOrder(
  orderId: string
): Promise<Order | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as Order;
  } catch {
    return null;
  }
}

export async function getOrderFootage(
  orderId: string
): Promise<FootageFile[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('footage_files')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data as FootageFile[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getOrderDeliverables(
  orderId: string
): Promise<Deliverable[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('deliverables')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data as Deliverable[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getOrderMessages(
  orderId: string
): Promise<Message[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data as Message[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getOrderDrafts(orderId: string): Promise<Draft[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('order_id', orderId)
      .order('version', { ascending: true });

    if (error) {
      return [];
    }

    return (data as Draft[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getDraftReviewComments(
  draftIds: string[]
): Promise<ReviewComment[]> {
  const uniqueIds = Array.from(
    new Set(draftIds.filter((value) => typeof value === 'string' && value))
  );

  if (uniqueIds.length === 0) {
    return [];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('review_comments')
      .select('*')
      .in('draft_id', uniqueIds)
      .order('created_at', { ascending: true });

    if (error) {
      return [];
    }

    const comments = (data as ReviewComment[] | null) ?? [];

    return comments.sort((a, b) => {
      const aTime =
        a.timestamp_sec === null
          ? Number.POSITIVE_INFINITY
          : Number(a.timestamp_sec);
      const bTime =
        b.timestamp_sec === null
          ? Number.POSITIVE_INFINITY
          : Number(b.timestamp_sec);

      if (aTime !== bTime) {
        return aTime - bTime;
      }

      return (
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime()
      );
    });
  } catch {
    return [];
  }
}

export async function getOrderTeamProfiles(
  profileIds: Array<string | null>
): Promise<OrderTeamProfile[]> {
  const uniqueIds = Array.from(
    new Set(
      profileIds.filter(
        (value): value is string => typeof value === 'string' && value.length > 0
      )
    )
  );

  if (uniqueIds.length === 0) {
    return [];
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('profiles')
      .select('id, name, email, avatar_url')
      .in('id', uniqueIds);

    if (error) {
      return [];
    }

    return (data as OrderTeamProfile[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getCustomerCredits(userId: string): Promise<Credit[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data as Credit[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getCustomerSubscription(
  userId: string
): Promise<Subscription | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as Subscription;
  } catch {
    return null;
  }
}
