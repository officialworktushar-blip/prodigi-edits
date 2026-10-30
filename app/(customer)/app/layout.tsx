import { cookies } from 'next/headers';
import { MobileNav } from '@/components/customer/mobile-nav';
import { Sidebar } from '@/components/customer/sidebar';
import { Topbar } from '@/components/customer/topbar';
import {
  ACTIVE_WORKSPACE_COOKIE,
  resolveActiveWorkspace,
} from '@/lib/customer/workspace';
import {
  getCustomerNotifications,
  getCustomerWorkspaces,
  getUnreadNotificationCount,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';

export const dynamic = 'force-dynamic';

interface CustomerLayoutProps {
  children: React.ReactNode;
}

export default async function CustomerLayout({
  children,
}: CustomerLayoutProps) {
  const { user, profile } = await requireUser();

  const [workspaces, notifications, unreadCount] = await Promise.all([
    getCustomerWorkspaces(),
    getCustomerNotifications(user.id),
    getUnreadNotificationCount(user.id),
  ]);

  const requestedWorkspaceId =
    cookies().get(ACTIVE_WORKSPACE_COOKIE)?.value ?? null;
  const activeWorkspace = resolveActiveWorkspace(
    workspaces,
    requestedWorkspaceId
  );

  const metadataName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : '';
  const userName =
    profile?.name?.trim() ||
    metadataName ||
    user.email?.split('@')[0] ||
    'Customer';

  return (
    <div className="min-h-screen bg-brand-surface">
      <Sidebar workspaceName={activeWorkspace?.name ?? null} />

      <div className="lg:pl-72">
        <Topbar
          userId={user.id}
          userName={userName}
          userEmail={profile?.email ?? user.email ?? null}
          userAvatarUrl={profile?.avatar_url ?? null}
          workspaces={workspaces.map((workspace) => ({
            id: workspace.id,
            name: workspace.name,
          }))}
          activeWorkspaceId={activeWorkspace?.id ?? null}
          notifications={notifications}
          unreadCount={unreadCount}
        />

        <main className="mx-auto w-full max-w-screen-1200 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
