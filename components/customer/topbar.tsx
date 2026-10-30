'use client';

import { useRouter } from 'next/navigation';
import {
  Bell,
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import {
  setActiveWorkspace,
  signOutAction,
} from '@/app/(customer)/app/actions';
import { useNotificationsRealtime } from '@/components/customer/use-notifications-realtime';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import type { Notification } from '@/types/db';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface WorkspaceOption {
  id: string;
  name: string;
}

export interface TopbarProps {
  userId: string;
  userName: string;
  userEmail: string | null;
  userAvatarUrl: string | null;
  workspaces: WorkspaceOption[];
  activeWorkspaceId: string | null;
  notifications: Notification[];
  unreadCount: number;
}

function getInitials(name: string, email: string | null) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length > 0) {
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  return (email?.[0] ?? '?').toUpperCase();
}

export function Topbar({
  userId,
  userName,
  userEmail,
  userAvatarUrl,
  workspaces,
  activeWorkspaceId,
  notifications,
  unreadCount,
}: TopbarProps) {
  const router = useRouter();
  const {
    notifications: liveNotifications,
    unreadCount: liveUnreadCount,
    markRead,
    markAllRead,
  } = useNotificationsRealtime({
    userId,
    initialNotifications: notifications,
    initialUnreadCount: unreadCount,
  });
  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === activeWorkspaceId) ??
    workspaces[0] ??
    null;
  const initials = getInitials(userName, userEmail);
  const safeUnreadCount = Math.max(0, liveUnreadCount);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Switch workspace"
            className="min-w-0 max-w-[210px] justify-start gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-left shadow-soft transition-colors hover:border-slate-300 sm:max-w-xs sm:px-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Building2 aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Workspace
              </span>
              <span className="block truncate text-sm font-semibold text-brand-ink">
                {activeWorkspace?.name ?? 'No workspace'}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="max-h-[70vh] w-72 overflow-y-auto"
          >
            <DropdownMenuLabel>Your workspaces</DropdownMenuLabel>
            {workspaces.length === 0 ? (
              <DropdownMenuItem disabled>
                No workspaces available yet
              </DropdownMenuItem>
            ) : (
              workspaces.map((workspace) => (
                <form key={workspace.id} action={setActiveWorkspace}>
                  <input
                    type="hidden"
                    name="workspaceId"
                    value={workspace.id}
                  />
                  <DropdownMenuItem
                    type="submit"
                    className="justify-between"
                    onClick={(event) => {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <Building2
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-slate-400"
                      />
                      <span className="truncate">{workspace.name}</span>
                    </span>
                    {workspace.id === activeWorkspace?.id ? (
                      <Check
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-indigo-600"
                      />
                    ) : null}
                  </DropdownMenuItem>
                </form>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push('/app/workspaces')}>
              Manage workspaces
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Notifications${
                safeUnreadCount > 0
                  ? `, ${safeUnreadCount} unread`
                  : ''
              }`}
              className="relative h-10 w-10 border border-slate-200 bg-white text-slate-600 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink"
            >
              <Bell aria-hidden="true" className="h-5 w-5" />
              {safeUnreadCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-indigo px-1 text-[10px] font-bold text-white">
                  {safeUnreadCount > 9 ? '9+' : safeUnreadCount}
                </span>
              ) : null}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="max-h-[75vh] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Notifications
                </p>
                {safeUnreadCount > 0 ? (
                  <button
                    type="button"
                    onClick={markAllRead}
                    className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
                  >
                    Mark all read
                  </button>
                ) : null}
              </div>

              {liveNotifications.length === 0 ? (
                <DropdownMenuItem disabled>No notifications yet</DropdownMenuItem>
              ) : (
                liveNotifications.map((notification) => {
                  const isUnread = !notification.read_at;

                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className="items-start py-2.5"
                      onSelect={() => {
                        markRead(notification.id);

                        if (notification.href) {
                          router.push(notification.href);
                        }
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          isUnread ? 'bg-brand-indigo' : 'bg-slate-300'
                        )}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-brand-ink">
                          {notification.title}
                        </span>
                        {notification.body ? (
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-slate-500">
                            {notification.body}
                          </span>
                        ) : null}
                      </span>
                    </DropdownMenuItem>
                  );
                })
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push('/app')}>
                View dashboard activity
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Open user menu"
              className="gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 shadow-soft transition-colors hover:border-slate-300 sm:pr-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatarUrl ?? undefined} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-brand-indigo to-brand-blue text-xs font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[120px] truncate text-sm font-semibold text-brand-ink sm:block">
                {userName}
              </span>
              <ChevronDown
                aria-hidden="true"
                className="hidden h-3.5 w-3.5 text-slate-400 sm:block"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <span className="block truncate text-sm font-semibold normal-case tracking-normal text-brand-ink">
                  {userName}
                </span>
                {userEmail ? (
                  <span className="mt-0.5 block truncate text-xs font-normal normal-case tracking-normal text-slate-500">
                    {userEmail}
                  </span>
                ) : null}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push('/app/settings')}>
                <Settings aria-hidden="true" className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/app/billing')}>
                <CreditCard aria-hidden="true" className="h-4 w-4" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/app/team')}>
                <Users aria-hidden="true" className="h-4 w-4" />
                Team
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push('/app/workspaces')}>
                <Building2 aria-hidden="true" className="h-4 w-4" />
                Workspaces
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={signOutAction}>
                <DropdownMenuItem
                  type="submit"
                  destructive
                  onClick={(event) => {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }}
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
