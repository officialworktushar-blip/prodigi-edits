'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { SUPPORT_EMAIL } from '@/lib/config';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { label: 'Orders', href: '/app/orders', icon: ClipboardList },
  { label: 'Workspaces', href: '/app/workspaces', icon: Building2 },
  { label: 'Messages', href: '/app/messages', icon: MessageSquare },
  { label: 'Team', href: '/app/team', icon: Users },
  { label: 'Billing', href: '/app/billing', icon: CreditCard },
  { label: 'Settings', href: '/app/settings', icon: Settings },
] as const;

export interface SidebarProps {
  workspaceName?: string | null;
}

export function Sidebar({ workspaceName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-20 shrink-0 items-center border-b border-slate-100 px-6">
        <Logo href="/app" size="sm" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <Link
          href="/app/orders/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New order
        </Link>

        <nav aria-label="Customer workspace" className="mt-7">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
          <ul className="mt-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/app'
                  ? pathname === '/app'
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-brand-ink'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                        isActive
                          ? 'bg-white text-indigo-600 shadow-soft'
                          : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'
                      )}
                    >
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-brand-surface p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Current workspace
          </p>
          <p className="mt-2 truncate text-sm font-semibold text-brand-ink">
            {workspaceName ?? 'No workspace yet'}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {workspaceName
              ? 'Switch workspaces from the top bar.'
              : 'Create a workspace to start organizing orders.'}
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-100 p-4">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Mail aria-hidden="true" className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-brand-ink">
              Need a hand?
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              {SUPPORT_EMAIL}
            </span>
          </span>
        </a>
      </div>
    </aside>
  );
}
