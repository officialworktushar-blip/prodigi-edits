import Link from 'next/link';
import { cookies } from 'next/headers';
import { ClipboardList, Plus } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import { OrderFilters } from '@/components/customer/orders/order-filters';
import { OrdersTable } from '@/components/customer/orders/orders-table';
import {
  parseOrderStatus,
  readParam,
} from '@/components/customer/orders/order-utils';
import {
  ACTIVE_WORKSPACE_COOKIE,
  resolveActiveWorkspace,
} from '@/lib/customer/workspace';
import {
  getCustomerOrders,
  getCustomerWorkspaces,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Orders',
  description: 'Track every video order from brief to delivery.',
};

interface OrdersPageProps {
  searchParams: {
    q?: string | string[];
    status?: string | string[];
  };
}

export default async function OrdersPage({
  searchParams,
}: OrdersPageProps) {
  const { user } = await requireUser();
  const workspaces = await getCustomerWorkspaces();
  const requestedWorkspaceId =
    cookies().get(ACTIVE_WORKSPACE_COOKIE)?.value ?? null;
  const activeWorkspace = resolveActiveWorkspace(
    workspaces,
    requestedWorkspaceId
  );

  const query = readParam(searchParams.q).trim().slice(0, 100);
  const status = parseOrderStatus(readParam(searchParams.status));
  const orders = await getCustomerOrders({
    workspaceId: activeWorkspace?.id ?? null,
    customerId: user.id,
    status,
    search: query,
  });
  const hasFilters = Boolean(query || status);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Orders
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
            Your video projects
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            {activeWorkspace
              ? `Every brief, draft, and delivery across ${activeWorkspace.name}.`
              : 'Every brief, draft, and delivery in one place.'}
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

      <OrderFilters query={query} status={status} />

      <div className="flex items-center gap-2 px-1 text-xs font-medium text-slate-400">
        <ClipboardList aria-hidden="true" className="h-3.5 w-3.5" />
        {orders.length === 1
          ? '1 order'
          : `${orders.length} orders`}
      </div>

      {orders.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-soft">
          {hasFilters ? (
            <EmptyState
              icon="search"
              title="No orders match these filters"
              description="Try a different search term or clear the status filter to see more orders."
              actionLabel="Clear filters"
              actionHref="/app/orders"
            />
          ) : (
            <EmptyState
              icon="video"
              title="No orders yet"
              description="Start your first video project and it will appear here with its latest production status."
              actionLabel="Create an order"
              actionHref="/app/orders/new"
            />
          )}
        </section>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </div>
  );
}
