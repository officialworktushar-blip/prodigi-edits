'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_ITEMS = [
  { label: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { label: 'Orders', href: '/app/orders', icon: ClipboardList },
  { label: 'Workspaces', href: '/app/workspaces', icon: Building2 },
  { label: 'Messages', href: '/app/messages', icon: MessageSquare },
  { label: 'Team', href: '/app/team', icon: Users },
  { label: 'Billing', href: '/app/billing', icon: CreditCard },
  { label: 'Settings', href: '/app/settings', icon: Settings },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Customer workspace"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
    >
      <div className="mx-auto grid max-w-screen-1200 grid-cols-7 px-1">
        {MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/app'
              ? pathname === '/app'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={cn(
                'flex min-w-0 flex-col items-center gap-1 px-1 py-2.5 text-[10px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-indigo',
                isActive ? 'text-brand-indigo' : 'text-slate-500'
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn('h-5 w-5', isActive ? 'text-indigo-600' : 'text-slate-400')}
              />
              <span className="w-full truncate text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
