import { cookies } from 'next/headers';
import { ChatWorkspace } from '@/components/customer/chat/chat-workspace';
import type { ChatOrder } from '@/components/customer/chat/types';
import { readParam } from '@/components/customer/orders/order-utils';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import {
  ACTIVE_WORKSPACE_COOKIE,
  resolveActiveWorkspace,
} from '@/lib/customer/workspace';
import {
  getCustomerOrders,
  getCustomerWorkspaces,
  getOrderTeamProfiles,
  getWorkspaceMessages,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';

export const dynamic = 'force-dynamic';

interface MessagesPageProps {
  searchParams: {
    thread?: string | string[];
  };
}

export default async function MessagesPage({
  searchParams,
}: MessagesPageProps) {
  const { user, profile } = await requireUser();
  const workspaces = await getCustomerWorkspaces();
  const requestedWorkspaceId =
    cookies().get(ACTIVE_WORKSPACE_COOKIE)?.value ?? null;
  const activeWorkspace = resolveActiveWorkspace(
    workspaces,
    requestedWorkspaceId
  );

  if (!activeWorkspace) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Messages"
          title="Every conversation, in context"
          description="Talk with your editor and your team without losing the thread."
        />
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
          <EmptyState
            icon="messages"
            title="No workspace yet"
            description="A workspace is created when you sign up. Once one is available, your conversations will appear here."
            actionLabel="Go to dashboard"
            actionHref="/app"
          />
        </div>
      </div>
    );
  }

  const [orders, messages] = await Promise.all([
    getCustomerOrders({
      workspaceId: activeWorkspace.id,
      customerId: user.id,
      limit: 100,
    }),
    getWorkspaceMessages(activeWorkspace.id),
  ]);

  const profiles = await getOrderTeamProfiles([
    user.id,
    ...messages.map((message) => message.sender_id),
  ]);

  const chatOrders: ChatOrder[] = orders.map((order) => ({
    id: order.id,
    order_no: order.order_no,
    title: order.title,
    kind: order.kind,
    status: order.status,
  }));

  const metadataName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : '';
  const userName =
    profile?.name?.trim() ||
    metadataName ||
    user.email?.split('@')[0] ||
    'Customer';
  const initialThreadKey = readParam(searchParams.thread).trim();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Messages"
        title="Every conversation, in context"
        highlight="context"
        description="Keep workspace-wide updates and order-specific feedback in one calm, searchable place."
      />

      <ChatWorkspace
        workspaceId={activeWorkspace.id}
        workspaceName={activeWorkspace.name}
        userId={user.id}
        orders={chatOrders}
        initialMessages={messages}
        profiles={[
          {
            id: user.id,
            name: userName,
            avatar_url: profile?.avatar_url ?? null,
          },
          ...profiles
            .filter((item) => item.id !== user.id)
            .map((item) => ({
              id: item.id,
              name: item.name,
              avatar_url: item.avatar_url,
            })),
        ]}
        initialThreadKey={initialThreadKey}
      />
    </div>
  );
}
