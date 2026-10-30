'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { SUPPORT_EMAIL } from '@/lib/config';
import { cn } from '@/lib/utils';
import { getAdminNavItems, type AdminRole } from './nav-items';

const NAV_ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  orders: ClipboardList,
  customers: Users,
  team: Users,
  messages: MessageSquare,
  pricing: CreditCard,
  coupons: Sparkles,
  subscriptions: CreditCard,
  finance: TrendingUp,
  content: FileText,
  settings: Settings,
  audit: Clock,
};

export interface AdminSidebarProps {
  role: AdminRole;
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const items = getAdminNavItems(role);
  const homeHref = role === 'EDITOR' ? '/admin/orders' : '/admin';

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-20 shrink-0 items-center border-b border-slate-100 px-6">
        <Logo href={homeHref} size="sm" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-500">
            {role === 'EDITOR' ? 'Editor desk' : 'Operations console'}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-brand-ink">
            {role === 'EDITOR' ? 'Production access' : 'Full admin access'}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {role === 'EDITOR'
              ? 'Your workspace is focused on the order queue.'
              : 'Manage orders, customers, revenue, and platform content.'}
          </p>
        </div>

        <nav aria-label="Admin navigation" className="mt-6">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Navigation
          </p>
          <ul className="mt-3 space-y-1">
            {items.map((item) => {
              const Icon = NAV_ICONS[item.icon] ?? LayoutDashboard;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
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
      </div>

      <div className="shrink-0 border-t border-slate-100 p-4">
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <MessageSquare aria-hidden="true" className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-brand-ink">
              Support desk
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
