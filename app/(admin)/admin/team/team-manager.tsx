'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { changeRole, promoteByEmail } from './actions';

export interface TeamMember {
  id: string;
  name: string | null;
  email: string | null;
  role: 'ADMIN' | 'EDITOR';
  activeOrders: number;
}

export interface TeamManagerProps {
  members: TeamMember[];
  currentUserId: string;
  capacity: number;
}

type RoleValue = 'CUSTOMER' | 'EDITOR' | 'ADMIN';

export function TeamManager({ members, currentUserId, capacity }: TeamManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState<'EDITOR' | 'ADMIN'>('EDITOR');
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  function handleRoleChange(member: TeamMember, role: RoleValue) {
    if (role === member.role) {
      return;
    }

    const label = member.name || member.email || 'this person';
    const message =
      role === 'CUSTOMER'
        ? `Remove ${label} from the team? They will become a regular customer.`
        : `Change ${label} to ${role.toLowerCase()}?`;

    if (!window.confirm(message)) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      const result = await changeRole({ userId: member.id, role });

      if (result.success) {
        setFeedback({ ok: true, text: 'Role updated.' });
        router.refresh();
      } else {
        setFeedback({ ok: false, text: result.error ?? 'Could not change the role.' });
      }
    });
  }

  function handlePromote() {
    setFeedback(null);
    startTransition(async () => {
      const result = await promoteByEmail({ email, role: newRole });

      if (result.success) {
        setFeedback({ ok: true, text: 'Team member added.' });
        setEmail('');
        router.refresh();
      } else {
        setFeedback({ ok: false, text: result.error ?? 'Could not add this person.' });
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a team member</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end">
            <div>
              <label htmlFor="team-email" className="text-sm font-medium text-slate-700">
                Email of an existing account
              </label>
              <Input
                id="team-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="editor@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="team-role" className="text-sm font-medium text-slate-700">
                Role
              </label>
              <Select
                id="team-role"
                value={newRole}
                onChange={(event) => setNewRole(event.target.value as 'EDITOR' | 'ADMIN')}
                className="mt-1"
              >
                <option value="EDITOR">Editor</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>
            <Button onClick={handlePromote} isLoading={isPending} disabled={!email.trim()}>
              Add
            </Button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            The person must sign up first. Then add them here to give access.
          </p>
        </CardContent>
      </Card>

      {feedback ? (
        <p
          role="status"
          className={feedback.ok ? 'text-sm text-emerald-600' : 'text-sm text-red-600'}
        >
          {feedback.text}
        </p>
      ) : null}

      <Card className="overflow-hidden">
        {members.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No staff members yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Member</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Workload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => {
                  const isSelf = member.id === currentUserId;
                  const percent = Math.min(100, Math.round((member.activeOrders / capacity) * 100));
                  const barColor =
                    percent >= 100 ? 'bg-red-500' : percent >= 70 ? 'bg-amber-500' : 'bg-emerald-500';

                  return (
                    <tr key={member.id}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-brand-ink">
                          {member.name || 'Unnamed'}
                          {isSelf ? (
                            <span className="ml-2 text-xs font-medium text-slate-400">(you)</span>
                          ) : null}
                        </div>
                        <div className="text-xs text-slate-500">{member.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          aria-label={`Role for ${member.name || member.email || 'member'}`}
                          value={member.role}
                          disabled={isSelf || isPending}
                          onChange={(event) =>
                            handleRoleChange(member, event.target.value as RoleValue)
                          }
                          className="h-9 w-40"
                        >
                          <option value="EDITOR">Editor</option>
                          <option value="ADMIN">Admin</option>
                          <option value="CUSTOMER">Remove from team</option>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-2 w-40 overflow-hidden rounded-full bg-slate-100"
                            role="progressbar"
                            aria-valuenow={member.activeOrders}
                            aria-valuemin={0}
                            aria-valuemax={capacity}
                            aria-label="Active orders"
                          >
                            <div className={`h-full ${barColor}`} style={{ width: `${percent}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">
                            {member.activeOrders} of {capacity} active
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
