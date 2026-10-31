import { requireRole } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  AdminInbox,
  type InboxMessage,
  type InboxOrder,
  type InboxPerson,
} from './inbox';

export const dynamic = 'force-dynamic';

const MESSAGE_LIMIT = 400;

export default async function AdminMessagesPage() {
  const { user } = await requireRole(['ADMIN']);
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('messages')
    .select('id, order_id, workspace_id, sender_id, body, created_at')
    .order('created_at', { ascending: false })
    .limit(MESSAGE_LIMIT);

  const messages = ((data ?? []) as InboxMessage[]).reverse();

  const workspaceIds = Array.from(new Set(messages.map((message) => message.workspace_id)));
  const orderIds = Array.from(
    new Set(messages.map((message) => message.order_id).filter((id): id is string => Boolean(id)))
  );
  const senderIds = Array.from(new Set(messages.map((message) => message.sender_id)));

  const [workspaceResult, orderResult, peopleResult] = await Promise.all([
    workspaceIds.length
      ? admin.from('workspaces').select('id, name').in('id', workspaceIds)
      : Promise.resolve({ data: [] }),
    orderIds.length
      ? admin.from('orders').select('id, order_no, title, workspace_id').in('id', orderIds)
      : Promise.resolve({ data: [] }),
    senderIds.length
      ? admin.from('profiles').select('id, name, email, role').in('id', senderIds)
      : Promise.resolve({ data: [] }),
  ]);

  const workspaces: Record<string, string> = {};
  for (const row of (workspaceResult.data ?? []) as { id: string; name: string }[]) {
    workspaces[row.id] = row.name;
  }

  const orders: Record<string, InboxOrder> = {};
  for (const row of (orderResult.data ?? []) as {
    id: string;
    order_no: number;
    title: string;
    workspace_id: string;
  }[]) {
    orders[row.id] = { order_no: row.order_no, title: row.title, workspace_id: row.workspace_id };
  }

  const people: Record<string, InboxPerson> = {};
  for (const row of (peopleResult.data ?? []) as {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  }[]) {
    people[row.id] = { name: row.name, email: row.email, role: row.role };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-ink">Messages</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every customer conversation in one inbox. New messages appear live.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          Could not load messages: {error.message}
        </p>
      ) : null}

      <AdminInbox
        messages={messages}
        workspaces={workspaces}
        orders={orders}
        people={people}
        adminId={user.id}
      />
    </div>
  );
}
