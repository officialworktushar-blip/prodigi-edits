import {
  Download,
  FileText,
  Lock,
} from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import type { Deliverable } from '@/types/db';
import { formatDateTime } from './order-utils';

export interface DeliverableWithUrl extends Deliverable {
  downloadUrl: string | null;
}

export interface OrderDeliverablesProps {
  deliverables: DeliverableWithUrl[];
}

export function OrderDeliverables({
  deliverables,
}: OrderDeliverablesProps) {
  if (deliverables.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-soft">
        <EmptyState
          icon="file"
          title="No deliverables yet"
          description="Final files will appear here when your order is approved and delivered."
        />
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold tracking-tight text-brand-ink">
          Deliverables
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Download the final files prepared for this order.
        </p>
      </div>

      <ul className="divide-y divide-slate-100">
        {deliverables.map((deliverable) => (
          <li
            key={deliverable.id}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-brand-ink">
                  {deliverable.name}
                </p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                  <span>{deliverable.type || 'Final file'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDateTime(deliverable.created_at)}</span>
                </p>
              </div>
            </div>

            {deliverable.downloadUrl ? (
              <a
                href={deliverable.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-4 py-2 text-xs font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                <Download aria-hidden="true" className="h-3.5 w-3.5" />
                Download
              </a>
            ) : (
              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                Link unavailable
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-100 bg-brand-surface px-5 py-3 sm:px-6">
        <p className="flex items-start gap-2 text-xs leading-5 text-slate-400">
          <Lock aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Download links are private and expire after one hour. Reopen this page
          for a fresh link.
        </p>
      </div>
    </section>
  );
}
