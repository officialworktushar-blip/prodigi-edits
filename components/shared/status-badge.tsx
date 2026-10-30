import type { OrderStatus } from '../../types/db';
import { cn } from '../../lib/utils';

interface StatusStyle {
  label: string;
  className: string;
  dotClassName: string;
}

const statusStyles: Record<OrderStatus, StatusStyle> = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-slate-100 text-slate-600',
    dotClassName: 'bg-slate-400',
  },
  SUBMITTED: {
    label: 'Submitted',
    className: 'bg-blue-50 text-blue-700',
    dotClassName: 'bg-blue-500',
  },
  ASSIGNED: {
    label: 'Assigned',
    className: 'bg-violet-50 text-violet-700',
    dotClassName: 'bg-violet-500',
  },
  IN_PROGRESS: {
    label: 'In progress',
    className: 'bg-amber-50 text-amber-700',
    dotClassName: 'bg-amber-500',
  },
  IN_REVIEW: {
    label: 'In review',
    className: 'bg-sky-50 text-sky-700',
    dotClassName: 'bg-sky-500',
  },
  REVISION_REQUESTED: {
    label: 'Revision requested',
    className: 'bg-orange-50 text-orange-700',
    dotClassName: 'bg-orange-500',
  },
  APPROVED: {
    label: 'Approved',
    className: 'bg-emerald-50 text-emerald-700',
    dotClassName: 'bg-emerald-500',
  },
  DELIVERED: {
    label: 'Delivered',
    className: 'bg-indigo-50 text-indigo-700',
    dotClassName: 'bg-indigo-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-700',
    dotClassName: 'bg-red-500',
  },
};

export interface StatusBadgeProps {
  status: OrderStatus;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const style = statusStyles[status] ?? statusStyles.DRAFT;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        style.className,
        className
      )}
    >
      {showDot ? (
        <span
          aria-hidden="true"
          className={cn('h-1.5 w-1.5 rounded-full', style.dotClassName)}
        />
      ) : null}
      {style.label}
    </span>
  );
}
