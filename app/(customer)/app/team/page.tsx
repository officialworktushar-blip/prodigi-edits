import { cookies } from 'next/headers';
import { TeamManager } from '@/components/customer/team/team-manager';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import {
  ACTIVE_WORKSPACE_COOKIE,
  resolveActiveWorkspace,
} from '@/lib/customer/workspace';
import {
  getCustomerWorkspaces,
  getOrderTeamProfiles,
  getWorkspaceInvites,
  getWorkspaceMembers,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
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
          eyebrow="Team"
          title="Bring the right people into the process"
          highlight="people"
          description="Invite teammates, assign a clear role, and keep access under control."
        />
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
          <EmptyState
            icon="users"
            title="No workspace yet"
            description="Team access is managed per workspace. Once a workspace is available, you can invite teammates here."
            actionLabel="Go to dashboard"
            actionHref="/app"
          />
        </div>
      </div>
    );
  }

  const [members, invites] = await Promise.all([
    getWorkspaceMembers(activeWorkspace.id),
    getWorkspaceInvites(activeWorkspace.id),
  ]);
  const memberProfiles = await getOrderTeamProfiles(
    members.map((member) => member.user_id)
  );
  const profileById = new Map(
    memberProfiles.map((memberProfile) => [
      memberProfile.id,
      memberProfile,
    ])
  );
  const currentMembership = members.find(
    (member) => member.user_id === user.id
  );
  const canManage =
    profile?.role === 'ADMIN' ||
    currentMembership?.role === 'OWNER' ||
    currentMembership?.role === 'MANAGER';
  const visibleInvites = canManage ? invites : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Team"
        title="Bring the right people into the process"
        highlight="people"
        description={`Manage access to ${activeWorkspace.name}. Viewers can follow along, while managers can keep work moving.`}
      />

      <TeamManager
        workspaceId={activeWorkspace.id}
        currentUserId={user.id}
        canManage={canManage}
        members={members.map((member) => {
          const memberProfile = profileById.get(member.user_id);

          return {
            membershipId: member.id,
            userId: member.user_id,
            name:
              memberProfile?.name?.trim() ||
              memberProfile?.email?.split('@')[0] ||
              'Teammate',
            email: memberProfile?.email ?? null,
            avatarUrl: memberProfile?.avatar_url ?? null,
            role: member.role,
            joinedAt: member.created_at,
          };
        })}
        invites={visibleInvites.map((invite) => ({
          id: invite.id,
          email: invite.email,
          role: invite.role,
          token: invite.token,
          createdAt: invite.created_at,
        }))}
      />
    </div>
  );
}
