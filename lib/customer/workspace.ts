import type { Workspace } from '@/types/db';

export const ACTIVE_WORKSPACE_COOKIE = 'active_workspace_id';

export function resolveActiveWorkspace(
  workspaces: Workspace[],
  requestedId?: string | null
): Workspace | null {
  if (requestedId) {
    const requested = workspaces.find((workspace) => workspace.id === requestedId);

    if (requested) {
      return requested;
    }
  }

  return workspaces[0] ?? null;
}
