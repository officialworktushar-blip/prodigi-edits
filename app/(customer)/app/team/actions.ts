'use server';

import { randomBytes } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireUser, requireWorkspaceAccess } from '@/lib/guards';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import type { Invite, MemberRole, WorkspaceMember } from '@/types/db';

const inviteSchema = z.object({
  workspaceId: z.string().uuid('Choose a valid workspace.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Enter a valid email address.')
    .max(254, 'That email address is too long.'),
  role: z.enum(['MANAGER', 'VIEWER']),
});

export interface InviteMemberResult {
  ok: boolean;
  message: string;
  invite?: Invite;
}

export async function inviteTeamMember(input: {
  workspaceId: string;
  email: string;
  role: MemberRole;
}): Promise<InviteMemberResult> {
  const { user } = await requireUser();
  const parsed = inviteSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        parsed.error.issues[0]?.message ??
        'Check the invitation details and try again.',
    };
  }

  const data = parsed.data;
  await requireWorkspaceAccess(data.workspaceId, 'MANAGER');

  const supabase = createClient();
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select('id, name, owner_id')
    .eq('id', data.workspaceId)
    .maybeSingle();

  if (workspaceError || !workspace) {
    return {
      ok: false,
      message: 'This workspace is not available.',
    };
  }

  const workspaceRow = workspace as {
    id: string;
    name: string;
    owner_id: string;
  };
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('id, email')
    .ilike('email', data.email)
    .maybeSingle();

  if (profile) {
    const profileRow = profile as { id: string; email: string | null };

    if (profileRow.id === workspaceRow.owner_id) {
      return {
        ok: false,
        message: 'That person already owns this workspace.',
      };
    }

    const { data: membership } = await supabase
      .from('workspace_members')
      .select('id')
      .eq('workspace_id', data.workspaceId)
      .eq('user_id', profileRow.id)
      .maybeSingle();

    if (membership) {
      return {
        ok: false,
        message: 'That person is already a member of this workspace.',
      };
    }
  }

  const { data: pending } = await supabase
    .from('invites')
    .select('id')
    .eq('workspace_id', data.workspaceId)
    .eq('status', 'PENDING')
    .ilike('email', data.email)
    .maybeSingle();

  if (pending) {
    return {
      ok: false,
      message: 'An invitation is already pending for that email.',
    };
  }

  const token = randomBytes(24).toString('hex');
  const { data: invite, error: inviteError } = await supabase
    .from('invites')
    .insert({
      workspace_id: data.workspaceId,
      email: data.email,
      role: data.role,
      token,
      status: 'PENDING',
    })
    .select('*')
    .single();

  if (inviteError || !invite) {
    return {
      ok: false,
      message: 'Could not create the invitation. Try again.',
    };
  }

  if (profile) {
    const { error: notificationError } = await admin
      .from('notifications')
      .insert({
        user_id: (profile as { id: string }).id,
        title: `You are invited to ${workspaceRow.name}`,
        body: `${user.email ?? 'A workspace manager'} invited you to join as ${data.role.toLowerCase()}.`,
        href: `/accept-invite/${token}`,
      });

    if (notificationError) {
      return {
        ok: true,
        message:
          'Invitation created. Share the invite link because the in-app notification could not be sent.',
        invite: invite as Invite,
      };
    }
  }

  revalidatePath('/app/team');
  return {
    ok: true,
    message: 'Invitation created. Share the secure link with your teammate.',
    invite: invite as Invite,
  };
}

export interface TeamActionResult {
  ok: boolean;
  message: string;
}

export async function removeTeamMember(
  membershipId: string
): Promise<TeamActionResult> {
  const { user } = await requireUser();

  if (!membershipId) {
    return { ok: false, message: 'Choose a member to remove.' };
  }

  const supabase = createClient();
  const { data: membership, error } = await supabase
    .from('workspace_members')
    .select('*')
    .eq('id', membershipId)
    .maybeSingle();

  if (error || !membership) {
    return {
      ok: false,
      message: 'That team member could not be found.',
    };
  }

  const member = membership as WorkspaceMember;
  await requireWorkspaceAccess(member.workspace_id, 'MANAGER');

  if (member.user_id === user.id) {
    return {
      ok: false,
      message: 'You cannot remove yourself from the workspace.',
    };
  }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('owner_id')
    .eq('id', member.workspace_id)
    .maybeSingle();

  if (
    member.role === 'OWNER' ||
    (workspace as { owner_id: string } | null)?.owner_id === member.user_id
  ) {
    return {
      ok: false,
      message: 'The workspace owner cannot be removed.',
    };
  }

  const { error: deleteError } = await supabase
    .from('workspace_members')
    .delete()
    .eq('id', member.id);

  if (deleteError) {
    return {
      ok: false,
      message: 'Could not remove this team member. Try again.',
    };
  }

  revalidatePath('/app/team');
  return { ok: true, message: 'Team member removed.' };
}

export async function revokeWorkspaceInvite(
  inviteId: string
): Promise<TeamActionResult> {
  await requireUser();

  if (!inviteId) {
    return { ok: false, message: 'Choose an invitation to revoke.' };
  }

  const supabase = createClient();
  const { data: invite, error } = await supabase
    .from('invites')
    .select('*')
    .eq('id', inviteId)
    .maybeSingle();

  if (error || !invite) {
    return {
      ok: false,
      message: 'That invitation could not be found.',
    };
  }

  const inviteRow = invite as Invite;
  await requireWorkspaceAccess(inviteRow.workspace_id, 'MANAGER');

  const { error: updateError } = await supabase
    .from('invites')
    .update({ status: 'REVOKED' })
    .eq('id', inviteRow.id)
    .eq('status', 'PENDING');

  if (updateError) {
    return {
      ok: false,
      message: 'Could not revoke this invitation. Try again.',
    };
  }

  revalidatePath('/app/team');
  return { ok: true, message: 'Invitation revoked.' };
}
