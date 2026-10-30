import Link from 'next/link';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';
import { cn } from '@/lib/utils';
import type { Order } from '@/types/db';
import {
  ORDER_KIND_LABELS,
  formatDate,
  isOverdue,
} from './order-utils';

export interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
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
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-brand-surface"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/app/orders/${order.id}`}
                    className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <ClipboardList
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block max-w-[320px] truncate font-semibold text-brand-ink group-hover:text-indigo-600">
                        {order.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-400">
                        Order #{order.order_no}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-4 text-slate-500">
                  {ORDER_KIND_LABELS[order.kind]}
                </td>
                <td
                  className={cn(
                    'px-6 py-4 text-right text-xs font-medium',
                    isOverdue(order) ? 'text-red-600' : 'text-slate-500'
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
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/app/orders/${order.id}`}
              className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-indigo"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ClipboardList aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-brand-ink">
                  {order.title}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  Order #{order.order_no} · {ORDER_KIND_LABELS[order.kind]}
                </span>
                <span className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={order.status} />
                  <span
                    className={cn(
                      'text-xs font-medium',
                      isOverdue(order)
                        ? 'text-red-600'
                        : 'text-slate-400'
                    )}
                  >
                    Due {formatDate(order.due_at)}
                  </span>
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
    </section>
  );
}
