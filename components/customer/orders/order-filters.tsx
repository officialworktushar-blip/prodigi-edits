import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/db';
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
} from './order-utils';

function buildHref(query: string, status: OrderStatus | null): string {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set('q', query.trim());
  }

  if (status) {
    params.set('status', status);
  }

  const value = params.toString();

  return value ? `/app/orders?${value}` : '/app/orders';
}

export interface OrderFiltersProps {
  query: string;
  status: OrderStatus | null;
}

export function OrderFilters({ query, status }: OrderFiltersProps) {
  const hasFilters = Boolean(query.trim() || status);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <form
          action="/app/orders"
          method="get"
          role="search"
          className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl"
        >
          {status ? (
            <input type="hidden" name="status" value={status} />
          ) : null}
          <div className="relative min-w-0 flex-1">
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="order-search"
              name="q"
              type="search"
              defaultValue={query}
              maxLength={100}
              placeholder="Search by title or order number"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
          >
            Search
          </button>
        </form>

        {hasFilters ? (
          <Link
            href="/app/orders"
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Clear filters
          </Link>
        ) : null}
      </div>

      <div className="-mx-1 mt-4 overflow-x-auto pb-1">
        <nav
          aria-label="Filter orders by status"
          className="flex min-w-max items-center gap-1 rounded-full bg-slate-100 p-1"
        >
          <Link
            href={buildHref(query, null)}
            aria-current={!status ? 'page' : undefined}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
              !status
                ? 'bg-white text-brand-ink shadow-soft'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            All
          </Link>
          {ORDER_STATUSES.map((item) => {
            const active = status === item;

            return (
              <Link
                key={item}
                href={buildHref(query, item)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                  active
                    ? 'bg-white text-brand-ink shadow-soft'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                {ORDER_STATUS_LABELS[item]}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
