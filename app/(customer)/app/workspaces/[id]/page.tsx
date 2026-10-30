import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { ArrowLeft } from 'lucide-react';
import { setActiveWorkspace } from '@/app/(customer)/app/actions';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WorkspaceBrandingEditor } from '@/components/customer/workspaces/workspace-branding-editor';
import {
  ACTIVE_WORKSPACE_COOKIE,
  resolveActiveWorkspace,
} from '@/lib/customer/workspace';
import {
  getCustomerWorkspaces,
  getWorkspace,
  getWorkspaceMembers,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';
import type { MemberRole } from '@/types/db';

export const dynamic = 'force-dynamic';

const ROLE_LABELS: Record<MemberRole, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  VIEWER: 'Viewer',
};

interface WorkspaceDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WorkspaceDetailPage({
  params,
}: WorkspaceDetailPageProps) {
  const { user, profile } = await requireUser();
  const [workspace, members, workspaces] = await Promise.all([
    getWorkspace(params.id),
    getWorkspaceMembers(params.id),
    getCustomerWorkspaces(),
  ]);

  if (!workspace) {
    notFound();
  }

  const membership = members.find((member) => member.user_id === user.id);
  const role =
    membership?.role ??
    (profile?.role === 'ADMIN' ? ('OWNER' as MemberRole) : null);
  const canEdit =
    profile?.role === 'ADMIN' ||
    role === 'OWNER' ||
    role === 'MANAGER';
  const requestedWorkspaceId =
    cookies().get(ACTIVE_WORKSPACE_COOKIE)?.value ?? null;
  const activeWorkspace = resolveActiveWorkspace(
    workspaces,
    requestedWorkspaceId
  );
  const isActive = activeWorkspace?.id === workspace.id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title={workspace.name}
        description="Set the visual cues and working notes your editor sees before starting a cut."
        actions={
          <>
            <Link
              href="/app/workspaces"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              All workspaces
            </Link>
            {!isActive ? (
              <form action={setActiveWorkspace}>
                <input
                  type="hidden"
                  name="workspaceId"
                  value={workspace.id}
                />
                <Button type="submit" size="sm">
                  Set as active
                </Button>
              </form>
            ) : (
              <Badge variant="secondary">Active workspace</Badge>
            )}
            {role ? <Badge variant="outline">{ROLE_LABELS[role]}</Badge> : null}
          </>
        }
      />

      <WorkspaceBrandingEditor workspace={workspace} canEdit={canEdit} />
    </div>
  );
}
