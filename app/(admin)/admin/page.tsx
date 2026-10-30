import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  MessageSquare,
} from 'lucide-react';
import {
  OrdersByStatusChart,
  type OrdersByStatusDatum,
} from '@/components/admin/orders-by-status-chart';
import {
  OrdersPerWeekChart,
  type OrdersPerWeekDatum,
} from '@/components/admin/orders-per-week-chart';
import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ADMIN_STATUS_FLOW,
  ADMIN_STATUS_LABELS,
  getActiveSubscriptionCount,
  getAdminOrders,
  type AdminOrderSummary,
} from '@/lib/data/admin';
import { requireRole } from '@/lib/guards';
import type { OrderStatus } from '@/types/db';

export const metadata: Metadata = {
  title: 'Admin overview',
  description: 'Monitor order flow, overdue work, and subscription health.',
};

export const dynamic = 'force-dynamic';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_COUNT = 8;

function getTime(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function startOfWeek(value: Date): Date {
  const date = new Date(value);
  const day = date.getDay();
  const diff = (day + 6) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(value: string | null) {
  const time = getTime(value);

  if (time === null) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(time));
}

function getOverdueLabel(value: string | null, now: number) {
  const due = getTime(value);

  if (due === null) {
    return 'Past due';
  }

  const days = Math.max(0, Math.floor((now - due) / DAY_MS));

  if (days === 0) {
    return 'Due earlier today';
  }

  return days === 1 ? '1 day overdue' : `${days} days overdue`;
}

function isOverdue(order: AdminOrderSummary, now: number) {
  if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
    return false;
  }

  const due = getTime(order.due_at);
  return due !== null && due < now;
}

function buildWeeklyData(
  orders: AdminOrderSummary[],
  now: Date
): OrdersPerWeekDatum[] {
  const currentWeekStart = startOfWeek(now);
  const buckets = Array.from({ length: WEEK_COUNT }, (_, index) => {
    const weeksAgo = WEEK_COUNT - 1 - index;
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - weeksAgo * 7);

    return {
      start: start.getTime(),
      week: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(start),
      orders: 0,
    };
  });

  for (const order of orders) {
    const created = getTime(order.created_at);

    if (created === null) {
      continue;
    }

    const weekStart = startOfWeek(new Date(created)).getTime();
    const bucket = buckets.find((item) => item.start === weekStart);

    if (bucket) {
      bucket.orders += 1;
    }
  }

  return buckets.map((bucket) => ({
    week: bucket.week,
    orders: bucket.orders,
  }));
}

export default async function AdminDashboardPage() {
  const { profile } = await requireRole(['ADMIN', 'EDITOR']);

  if (profile?.role === 'EDITOR') {
    redirect('/admin/orders');
  }

  if (profile?.role !== 'ADMIN') {
    redirect('/app');
  }

  const [orders, activeSubscriptions] = await Promise.all([
    getAdminOrders(),
    getActiveSubscriptionCount(),
  ]);

  const now = new Date();
  const nowTime = now.getTime();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const newToday = orders.filter((order) => {
    const created = getTime(order.created_at);
    return created !== null && created >= startOfToday;
  }).length;

  const inProgress = orders.filter(
    (order) => order.status === 'IN_PROGRESS'
  ).length;
  const inReview = orders.filter(
    (order) => order.status === 'IN_REVIEW'
  ).length;

  const overdueOrders = orders
    .filter((order) => isOverdue(order, nowTime))
    .sort(
      (a, b) => (getTime(a.due_at) ?? 0) - (getTime(b.due_at) ?? 0)
    );
  const visibleOverdueOrders = overdueOrders.slice(0, 8);

  const statusCounts = ADMIN_STATUS_FLOW.reduce<Record<OrderStatus, number>>(
    (counts, status) => {
      counts[status] = 0;
      return counts;
    },
    {} as Record<OrderStatus, number>
  );

  for (const order of orders) {
    if (statusCounts[order.status] !== undefined) {
      statusCounts[order.status] += 1;
    }
  }

  const statusData: OrdersByStatusDatum[] = ADMIN_STATUS_FLOW.map((status) => ({
    status: ADMIN_STATUS_LABELS[status],
    count: statusCounts[status],
  }));

  const weeklyData = buildWeeklyData(orders, now);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Operations overview"
        highlight="overview"
        description="See what needs attention today, where every order stands, and how demand is tracking week over week."
        actions={
          <Link
            href="/admin/orders"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
          >
            <ClipboardList aria-hidden="true" className="h-4 w-4" />
            Open order queue
          </Link>
        }
      />

      <section aria-label="Key performance indicators">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="New today"
            value={newToday}
            icon="sparkles"
            hint="Created since midnight"
          />
          <StatCard
            label="In progress"
            value={inProgress}
            icon="clock"
            hint="Currently with editors"
          />
          <StatCard
            label="Overdue"
            value={overdueOrders.length}
            icon="trend"
            hint="Past due and still open"
          />
          <StatCard
            label="In review"
            value={inReview}
            icon="video"
            hint="Awaiting customer feedback"
          />
          <StatCard
            label="Active subscriptions"
            value={activeSubscriptions}
            icon="payment"
            hint="Recurring plans in good standing"
          />
        </div>
      </section>

      <section
        aria-label="Order analytics"
        className="grid gap-6 xl:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Orders by status</CardTitle>
            <CardDescription>
              Current order volume across every stage of the production flow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersByStatusChart data={statusData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders per week</CardTitle>
            <CardDescription>
              New orders created over the last {WEEK_COUNT} weeks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrdersPerWeekChart data={weeklyData} />
          </CardContent>
        </Card>
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 space-y-0 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <CalendarClock
                aria-hidden="true"
                className="h-5 w-5 text-rose-500"
              />
              Overdue orders
            </CardTitle>
            <CardDescription>
              Past due and not yet delivered or cancelled. Oldest deadlines
              appear first.
            </CardDescription>
          </div>
          <Badge variant={overdueOrders.length > 0 ? 'danger' : 'success'}>
            {overdueOrders.length} overdue
          </Badge>
        </CardHeader>

        {overdueOrders.length === 0 ? (
          <EmptyState
            icon="sparkles"
            title="Nothing overdue"
            description="Every active order is still inside its promised turnaround window."
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Order
                    </th>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Due date
                    </th>
                    <th scope="col" className="px-6 py-3 font-semibold">
                      Overdue by
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <span className="sr-only">Open order</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleOverdueOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="group block focus-visible:outline-none"
                        >
                          <span className="block font-semibold text-brand-ink transition-colors group-hover:text-indigo-600">
                            {order.title || 'Untitled order'}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-400">
                            #{order.order_no}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(order.due_at)}
                      </td>
                      <td className="px-6 py-4 font-medium text-rose-600">
                        {getOverdueLabel(order.due_at, nowTime)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          aria-label={`Open ${order.title || 'untitled order'}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
                        >
                          <ArrowUpRight
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {visibleOverdueOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block px-5 py-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-indigo"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-brand-ink">
                        {order.title || 'Untitled order'}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        #{order.order_no} · Due {formatDate(order.due_at)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-rose-600">
                    {getOverdueLabel(order.due_at, nowTime)}
                  </p>
                </Link>
              ))}
            </div>

            {overdueOrders.length > visibleOverdueOrders.length ? (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
                <span>
                  Showing {visibleOverdueOrders.length} of{' '}
                  {overdueOrders.length} overdue orders.
                </span>
                <Link
                  href="/admin/orders"
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  View all orders
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : null}
          </>
        )}
      </Card>

      <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-soft">
          <MessageSquare aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-brand-ink">
            Need to unblock a deadline?
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Open the order to reassign an editor, adjust the due date, or leave
            a note for the production team.
          </p>
        </div>
      </div>
    </div>
  );
}
