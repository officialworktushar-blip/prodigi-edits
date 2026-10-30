'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Mail,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  inviteTeamMember,
  removeTeamMember,
  revokeWorkspaceInvite,
} from '@/app/(customer)/app/team/actions';
import { formatDate, getInitials } from '@/components/customer/orders/order-utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { MemberRole } from '@/types/db';

const ROLE_LABELS: Record<MemberRole, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  VIEWER: 'Viewer',
};

export interface TeamMemberView {
  membershipId: string;
  userId: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  role: MemberRole;
  joinedAt: string;
}

export interface PendingInviteView {
  id: string;
  email: string;
  role: MemberRole;
  token: string;
  createdAt: string;
}

export interface TeamManagerProps {
  workspaceId: string;
  currentUserId: string;
  canManage: boolean;
  members: TeamMemberView[];
  invites: PendingInviteView[];
}

export function TeamManager({
  workspaceId,
  currentUserId,
  canManage,
  members: initialMembers,
  invites: initialInvites,
}: TeamManagerProps) {
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'MANAGER' | 'VIEWER'>('VIEWER');
  const [isInviting, setIsInviting] = useState(false);
  const [confirmingMemberId, setConfirmingMemberId] = useState<string | null>(
    null
  );
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(
    null
  );
  const [revokingInviteId, setRevokingInviteId] = useState<string | null>(
    null
  );
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function inviteUrl(token: string): string {
    if (typeof window === 'undefined') {
      return `/accept-invite/${token}`;
    }

    return `${window.location.origin}/accept-invite/${token}`;
  }

  async function submitInvite() {
    setIsInviting(true);
    setError(null);
    setNotice(null);

    try {
      const result = await inviteTeamMember({
        workspaceId,
        email,
        role,
      });

      if (!result.ok || !result.invite) {
        setError(result.message);
        return;
      }

      const created = result.invite;
      setInvites((current) => [
        {
          id: created.id,
          email: created.email,
          role: created.role,
          token: created.token,
          createdAt: created.created_at,
        },
        ...current.filter((invite) => invite.id !== created.id),
      ]);
      setEmail('');
      setRole('VIEWER');
      setNotice(
        result.message ||
          'Invitation created. Copy the secure link below and share it directly.'
      );
    } catch {
      setError('Could not create the invitation. Try again.');
    } finally {
      setIsInviting(false);
    }
  }

  async function removeMember(member: TeamMemberView) {
    setRemovingMemberId(member.membershipId);
    setError(null);
    setNotice(null);

    try {
      const result = await removeTeamMember(member.membershipId);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setMembers((current) =>
        current.filter((item) => item.membershipId !== member.membershipId)
      );
      setConfirmingMemberId(null);
      setNotice('Team member removed.');
    } catch {
      setError('Could not remove this team member. Try again.');
    } finally {
      setRemovingMemberId(null);
    }
  }

  async function revokeInvite(invite: PendingInviteView) {
    setRevokingInviteId(invite.id);
    setError(null);
    setNotice(null);

    try {
      const result = await revokeWorkspaceInvite(invite.id);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setInvites((current) =>
        current.filter((item) => item.id !== invite.id)
      );
      setNotice('Invitation revoked.');
    } catch {
      setError('Could not revoke this invitation. Try again.');
    } finally {
      setRevokingInviteId(null);
    }
  }

  async function copyInvite(invite: PendingInviteView) {
    setError(null);

    try {
      await navigator.clipboard.writeText(inviteUrl(invite.token));
      setCopiedInviteId(invite.id);
      window.setTimeout(() => {
        setCopiedInviteId((current) =>
          current === invite.id ? null : current
        );
      }, 2000);
    } catch {
      setError(
        'Could not copy the invite link. Check your browser clipboard permissions and try again.'
      );
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="space-y-4">
        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <Check
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            {notice}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Users
                aria-hidden="true"
                className="h-4 w-4 text-indigo-500"
              />
              <h2 className="text-sm font-semibold text-brand-ink">
                Team members
              </h2>
            </div>
            <Badge variant="outline">{members.length}</Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {members.map((member) => {
              const isCurrentUser = member.userId === currentUserId;
              const canRemove =
                canManage &&
                !isCurrentUser &&
                member.role !== 'OWNER';
              const isConfirming =
                confirmingMemberId === member.membershipId;
              const isRemoving =
                removingMemberId === member.membershipId;

              return (
                <div
                  key={member.membershipId}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={member.avatarUrl ?? undefined}
                        alt={member.name}
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-brand-ink">
                          {member.name}
                        </p>
                        {isCurrentUser ? (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            You
                          </span>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {member.email ?? 'Email unavailable'}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Joined {formatDate(member.joinedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                    <Badge
                      variant={
                        member.role === 'OWNER'
                          ? 'secondary'
                          : member.role === 'MANAGER'
                            ? 'info'
                            : 'outline'
                      }
                    >
                      {member.role === 'OWNER' ? (
                        <Shield aria-hidden="true" className="h-3 w-3" />
                      ) : null}
                      {ROLE_LABELS[member.role]}
                    </Badge>

                    {canRemove ? (
                      isConfirming ? (
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            isLoading={isRemoving}
                            onClick={() => void removeMember(member)}
                          >
                            Confirm
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isRemoving}
                            onClick={() => setConfirmingMemberId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setConfirmingMemberId(member.membershipId)
                          }
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                          Remove
                        </Button>
                      )
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <Mail
                aria-hidden="true"
                className="h-4 w-4 text-indigo-500"
              />
              <h2 className="text-sm font-semibold text-brand-ink">
                Pending invitations
              </h2>
            </div>
            <Badge variant="outline">{invites.length}</Badge>
          </div>

          {!canManage ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              Only workspace owners and managers can view pending invitations.
            </p>
          ) : invites.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-500">
              No pending invitations.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-ink">
                      {invite.email}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{ROLE_LABELS[invite.role]}</span>
                      <span aria-hidden="true">·</span>
                      <span>Sent {formatDate(invite.createdAt)}</span>
                    </div>
                  </div>

                  {canManage ? (
                    <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void copyInvite(invite)}
                      >
                        {copiedInviteId === invite.id ? (
                          <Check
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                        ) : (
                          <Copy
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                        )}
                        {copiedInviteId === invite.id
                          ? 'Copied'
                          : 'Copy link'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        isLoading={revokingInviteId === invite.id}
                        onClick={() => void revokeInvite(invite)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        Revoke
                      </Button>
                    </div>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <UserPlus
            aria-hidden="true"
            className="h-4 w-4 text-indigo-500"
          />
          <h2 className="text-sm font-semibold text-brand-ink">
            Invite a teammate
          </h2>
        </div>

        {canManage ? (
          <>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Invitations create a secure link. No email delivery is connected
              yet, so copy the link and share it directly.
            </p>

            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <label
                  htmlFor="invite-email"
                  className="text-xs font-semibold text-slate-600"
                >
                  Email address
                </label>
                <Input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="teammate@company.com"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="invite-role"
                  className="text-xs font-semibold text-slate-600"
                >
                  Role
                </label>
                <Select
                  id="invite-role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as 'MANAGER' | 'VIEWER')
                  }
                >
                  <option value="VIEWER">
                    Viewer — can browse and comment
                  </option>
                  <option value="MANAGER">
                    Manager — can manage orders and team
                  </option>
                </Select>
              </div>

              <Button
                type="button"
                className="w-full"
                isLoading={isInviting}
                disabled={!email.trim()}
                onClick={() => void submitInvite()}
              >
                <UserPlus aria-hidden="true" className="h-4 w-4" />
                Create invitation
              </Button>
            </div>
          </>
        ) : (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Only workspace owners and managers can invite teammates or change
            access.
          </p>
        )}
      </div>
    </div>
  );
}
