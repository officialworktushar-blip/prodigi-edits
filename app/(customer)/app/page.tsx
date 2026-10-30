import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Eye,
  MessageSquare,
  Plus,
  Sparkles,
} from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  ACTIVE_WORKSPACE_COOKIE,
  resolveActiveWorkspace,
} from '@/lib/customer/workspace';
import {
  getCustomerCredits,
  getCustomerNotifications,
  getCustomerOrders,
  getCustomerWorkspaces,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';
import { cn } from '@/lib/utils';
import type { Order, OrderKind, OrderStatus } from '@/types/db';

export const dynamic = 'force-dynamic';

const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  'SUBMITTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'IN_REVIEW',
  'REVISION_REQUESTED',
  'APPROVED',
];

const KIND_LABELS: Record<OrderKind, string> = {
  HORIZONTAL: 'Horizontal video',
  VERTICAL: 'Vertical reformat',
  THUMBNAIL: 'Thumbnail',
};

function formatDate(value: string | null): string {
  if (!value) {
    return 'No due date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date);
}

function formatRelativeTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function isOverdue(order: Order): boolean {
  if (!order.due_at || order.status === 'DELIVERED' || order.status === 'CANCELLED') {
    return false;
  }

  const dueDate = new Date(order.due_at);
  return !Number.isNaN(dueDate.getTime()) && dueDate.getTime() < Date.now();
}

export default async function CustomerDashboardPage() {
  const { user, profile } = await requireUser();

  const [workspaces, credits, notifications] = await Promise.all([
    getCustomerWorkspaces(),
    getCustomerCredits(user.id),
    getCustomerNotifications(user.id, 6),
  ]);

  const requestedWorkspaceId =
    cookies().get(ACTIVE_WORKSPACE_COOKIE)?.value ?? null;
  const activeWorkspace = resolveActiveWorkspace(
    workspaces,
    requestedWorkspaceId
  );

  const orders = await getCustomerOrders({
    workspaceId: activeWorkspace?.id ?? null,
    customerId: user.id,
  });

  const activeOrders = orders.filter((order) =>
    ACTIVE_ORDER_STATUSES.includes(order.status)
  );
  const reviewOrders = orders.filter((order) => order.status === 'IN_REVIEW');
  const recentOrders = orders.slice(0, 5);
  const creditBalance = credits.reduce(
    (total, credit) => total + (Number(credit.balance) || 0),
    0
  );

  const metadataName =
    typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : '';
  const displayName =
    profile?.name?.trim() ||
    metadataName ||
    user.email?.split('@')[0] ||
    'there';
  const firstName = displayName.split(/\s+/)[0];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            {activeWorkspace
              ? `Here is what is happening across ${activeWorkspace.name}.`
              : 'Here is what is happening with your video projects.'}
          </p>
        </div>

        <Link
          href="/app/orders/new"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New order
        </Link>
      </section>

      {reviewOrders.length > 0 ? (
        <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-soft">
                <Eye aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-sky-950">
                  {reviewOrders.length === 1
                    ? 'A draft is ready for your review'
                    : `${reviewOrders.length} drafts are ready for your review`}
                </p>
                <p className="mt-1 text-sm leading-6 text-sky-800">
                  Leave feedback while the edit is fresh so your editor can keep
                  moving.
                </p>
              </div>
            </div>
            <Link
              href={`/app/orders/${reviewOrders[0].id}`}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-sky-800 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-50"
            >
              Review now
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : null}

      <section
        aria-label="Order summary"
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCard
          label="Active orders"
          value={activeOrders.length}
          icon="orders"
          hint="In production or awaiting approval"
        />
        <StatCard
          label="In review"
          value={reviewOrders.length}
          icon="clock"
          hint="Waiting on your feedback"
        />
        <StatCard
          label="Credit balance"
          value={creditBalance.toLocaleString('en-US')}
          icon="payment"
          hint="Available across packages"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-brand-ink">
                Recent orders
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Your latest projects and delivery status.
              </p>
            </div>
            <Link
              href="/app/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              View all
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <EmptyState
              icon="video"
              title="No orders yet"
              description="Start your first video project and your latest status updates will appear here."
              actionLabel="Create an order"
              actionHref="/app/orders/new"
            />
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-brand-surface text-xs uppercase tracking-[0.12em] text-slate-400">
                      <th scope="col" className="px-6 py-3 font-semibold">
                        Order
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-right font-semibold">
                        Due
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition-colors hover:bg-brand-surface"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/app/orders/${order.id}`}
                            className="group block max-w-[260px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                          >
                            <span className="block truncate font-semibold text-brand-ink group-hover:text-indigo-600">
                              {order.title}
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-400">
                              #{order.order_no}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-4 text-slate-500">
                          {KIND_LABELS[order.kind]}
                        </td>
                        <td
                          className={cn(
                            'px-6 py-4 text-right text-xs font-medium',
                            isOverdue(order)
                              ? 'text-red-600'
                              : 'text-slate-500'
                          )}
                        >
                          {formatDate(order.due_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-slate-100 md:hidden">
                {recentOrders.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/app/orders/${order.id}`}
                      className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-indigo"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <ClipboardList aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-brand-ink">
                          {order.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">
                          #{order.order_no} · {formatDate(order.due_at)}
                        </span>
                        <span className="mt-2 block">
                          <StatusBadge status={order.status} />
                        </span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="mt-2 h-4 w-4 shrink-0 text-slate-300"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-blue p-6 text-white shadow-soft">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"
            />
            <div className="relative">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Sparkles aria-hidden="true" className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">
                Start a new edit
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-white/80">
                Share your footage, pick a style, and we will match you with the
                right editor.
              </p>
              <Link
                href="/app/orders/new"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
              >
                Create order
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="text-base font-semibold tracking-tight text-brand-ink">
                Activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Messages, reviews, and delivery updates.
              </p>
            </div>

            {notifications.length === 0 ? (
              <EmptyState
                icon="message"
                title="Nothing new"
                description="Updates about your orders will show up here."
                className="py-10"
              />
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const content = (
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className={cn(
                            'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                            notification.read_at
                              ? 'bg-slate-300'
                              : 'bg-brand-indigo'
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
                          <span className="mt-1 block text-[11px] font-medium text-slate-400">
                            {formatRelativeTime(notification.created_at)}
                          </span>
                        </span>
                      </span>
                    </span>
                  );

                  return (
                    <li key={notification.id}>
                      {notification.href ? (
                        <Link
                          href={notification.href}
                          className="flex px-5 py-4 transition-colors hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-indigo"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div className="flex px-5 py-4">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="border-t border-slate-100 px-5 py-3">
              <Link
                href="/app/messages"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                <MessageSquare aria-hidden="true" className="h-4 w-4" />
                Open messages
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-2 text-slate-500">
              <CalendarClock aria-hidden="true" className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em]">
                Workspace
              </p>
            </div>
            <p className="mt-2 text-sm font-semibold text-brand-ink">
              {activeWorkspace?.name ?? 'No workspace selected'}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {activeWorkspace
                ? 'Switch workspaces from the top bar to see another project space.'
                : 'Create a workspace to group orders, files, and teammates.'}
            </p>
            <Link
              href="/app/workspaces"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Manage workspaces
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
