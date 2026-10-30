import type { ReactNode } from 'react';
import { CommandPalette } from '@/components/admin/command-palette';
import { AdminSidebar } from '@/components/admin/sidebar';
import type { AdminRole } from '@/components/admin/nav-items';
import { Logo } from '@/components/shared/logo';
import { requireRole } from '@/lib/guards';

export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: ReactNode;
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

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile } = await requireRole(['ADMIN', 'EDITOR']);
  const role: AdminRole = profile?.role === 'EDITOR' ? 'EDITOR' : 'ADMIN';
  const metadataName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : '';
  const userName =
    profile?.name?.trim() ||
    metadataName ||
    user.email?.split('@')[0] ||
    (role === 'EDITOR' ? 'Editor' : 'Admin');
  const userEmail = profile?.email ?? user.email ?? null;
  const initials = getInitials(userName, userEmail);
  const homeHref = role === 'EDITOR' ? '/admin/orders' : '/admin';

  return (
    <div className="min-h-screen bg-brand-surface">
      <a
        href="#admin-main"
        className="sr-only rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-ink shadow-soft focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
      >
        Skip to content
      </a>

      <AdminSidebar role={role} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <div className="lg:hidden">
              <Logo href={homeHref} size="sm" />
            </div>

            <div className="hidden min-w-0 lg:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {role === 'EDITOR' ? 'Production desk' : 'Admin workspace'}
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-brand-ink">
                {role === 'EDITOR'
                  ? 'Your assigned order queue'
                  : 'Operations and business health'}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <CommandPalette role={role} />

              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-soft">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-indigo to-brand-blue text-xs font-bold text-white"
                >
                  {initials}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-[140px] truncate text-sm font-semibold leading-5 text-brand-ink">
                    {userName}
                  </span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {role === 'EDITOR' ? 'Editor' : 'Administrator'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main
          id="admin-main"
          className="mx-auto w-full max-w-screen-1200 px-4 pb-16 pt-6 sm:px-6 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
