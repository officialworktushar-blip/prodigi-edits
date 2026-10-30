import { FileText, Link2, Users } from 'lucide-react';
import type { Order } from '@/types/db';
import type { OrderTeamProfile } from '@/lib/data/customer';
import { DueCountdown } from './due-countdown';
import { OrderStatusTimeline } from './order-status-timeline';
import {
  ORDER_KIND_LABELS,
  formatDate,
  getInitials,
} from './order-utils';

export interface OrderOverviewProps {
  order: Order;
  team: OrderTeamProfile[];
}

interface TeamRole {
  id: string | null;
  label: string;
}

export function OrderOverview({ order, team }: OrderOverviewProps) {
  const profiles = new Map(team.map((profile) => [profile.id, profile]));
  const roles: TeamRole[] = [
    { id: order.manager_id, label: 'Production manager' },
    { id: order.editor_id, label: 'Video editor' },
    { id: order.thumbnail_artist_id, label: 'Thumbnail artist' },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-brand-ink">
                Progress
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Follow this order from brief to final delivery.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <OrderStatusTimeline status={order.status} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center gap-2">
            <FileText aria-hidden="true" className="h-4 w-4 text-indigo-600" />
            <h2 className="text-base font-semibold tracking-tight text-brand-ink">
              Project brief
            </h2>
          </div>
          {order.brief?.trim() ? (
            <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-slate-600">
              {order.brief}
            </p>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-500">
              No brief has been added to this order yet.
            </p>
          )}

          {order.reference_links?.trim() ? (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="flex items-center gap-2">
                <Link2 aria-hidden="true" className="h-4 w-4 text-slate-400" />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  References
                </p>
              </div>
              <p className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                {order.reference_links}
              </p>
            </div>
          ) : null}
        </section>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold tracking-tight text-brand-ink">
            Deadline
          </h2>
          <div className="mt-4">
            <DueCountdown dueAt={order.due_at} status={order.status} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2">
            <Users aria-hidden="true" className="h-4 w-4 text-indigo-600" />
            <h2 className="text-base font-semibold tracking-tight text-brand-ink">
              Assigned team
            </h2>
          </div>
          <ul className="mt-4 space-y-4">
            {roles.map((role) => {
              const profile = role.id ? profiles.get(role.id) : undefined;
              const name = profile?.name?.trim() || null;

              return (
                <li key={role.label} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                    {name ? getInitials(name) : '—'}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-ink">
                      {name ?? 'Not assigned yet'}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {role.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold tracking-tight text-brand-ink">
            Order details
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Format</dt>
              <dd className="text-right font-semibold text-brand-ink">
                {ORDER_KIND_LABELS[order.kind]}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Raw footage</dt>
              <dd className="text-right font-semibold text-brand-ink">
                {order.raw_footage_minutes === null
                  ? 'Not provided'
                  : `${order.raw_footage_minutes} min`}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Created</dt>
              <dd className="text-right font-semibold text-brand-ink">
                {formatDate(order.created_at)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
