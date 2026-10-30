import Link from 'next/link';
import { cookies } from 'next/headers';
import { ArrowRight, Check } from 'lucide-react';
import { setActiveWorkspace } from '@/app/(customer)/app/actions';
import { getInitials } from '@/components/customer/orders/order-utils';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ACTIVE_WORKSPACE_COOKIE,
  resolveActiveWorkspace,
} from '@/lib/customer/workspace';
import {
  getCustomerWorkspaceMemberships,
  getCustomerWorkspaces,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';
import type { MemberRole } from '@/types/db';

export const dynamic = 'force-dynamic';

const ROLE_LABELS: Record<MemberRole, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  VIEWER: 'Viewer',
};

export default async function WorkspacesPage() {
  const { user, profile } = await requireUser();
  const [workspaces, memberships] = await Promise.all([
    getCustomerWorkspaces(),
    getCustomerWorkspaceMemberships(user.id),
  ]);
  const requestedWorkspaceId =
    cookies().get(ACTIVE_WORKSPACE_COOKIE)?.value ?? null;
  const activeWorkspace = resolveActiveWorkspace(
    workspaces,
    requestedWorkspaceId
  );
  const roleByWorkspace = new Map(
    memberships.map((membership) => [
      membership.workspace_id,
      membership.role,
    ])
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspaces"
        title="One home for every brand you manage"
        highlight="brand"
        description="Keep orders, conversations, and team access organized by client, channel, or brand."
      />

      {workspaces.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-soft">
          <EmptyState
            icon="folder"
            title="No workspaces yet"
            description="A personal workspace is created when you sign up. If it is missing, contact support and we will restore access."
            actionLabel="Go to dashboard"
            actionHref="/app"
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {workspaces.map((workspace) => {
            const isActive = workspace.id === activeWorkspace?.id;
            const role =
              roleByWorkspace.get(workspace.id) ??
              (profile?.role === 'ADMIN' ? 'OWNER' : null);

            return (
              <div
                key={workspace.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-shadow hover:shadow-soft-lg sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 rounded-2xl">
                    <AvatarImage
                      src={workspace.logo_url ?? undefined}
                      alt={workspace.name}
                    />
                    <AvatarFallback className="rounded-2xl bg-indigo-50 text-sm font-bold text-indigo-700">
                      {getInitials(workspace.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-semibold text-brand-ink">
                        {workspace.name}
                      </h2>
                      {isActive ? (
                        <Badge variant="secondary">
                          <Check
                            aria-hidden="true"
                            className="h-3 w-3"
                          />
                          Active
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{workspace.type || 'Personal'}</span>
                      {role ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{ROLE_LABELS[role]}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 min-h-[3.75rem] text-sm leading-6 text-slate-500">
                  {workspace.notes?.trim() ||
                    'Add brand notes, recurring series details, and tone guidance so every edit starts with context.'}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <Link
                    href={`/app/workspaces/${workspace.id}`}
                    className="inline-flex h-9 items-center gap-2 rounded-full bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                  >
                    Open workspace
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>

                  {!isActive ? (
                    <form action={setActiveWorkspace}>
                      <input
                        type="hidden"
                        name="workspaceId"
                        value={workspace.id}
                      />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                      >
                        Set active
                      </Button>
                    </form>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">
                      Current workspace
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
