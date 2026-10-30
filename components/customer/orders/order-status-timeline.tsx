import {
  Check,
  Circle,
  Clock,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/db';
import { ORDER_STATUS_LABELS } from './order-utils';

interface TimelineStep {
  status: OrderStatus;
  description: string;
}

const BASE_STEPS: TimelineStep[] = [
  {
    status: 'DRAFT',
    description: 'Your brief is being prepared.',
  },
  {
    status: 'SUBMITTED',
    description: 'Your brief is in the production queue.',
  },
  {
    status: 'ASSIGNED',
    description: 'An editor has been matched to this order.',
  },
  {
    status: 'IN_PROGRESS',
    description: 'The edit is underway.',
  },
  {
    status: 'IN_REVIEW',
    description: 'A draft is ready for your feedback.',
  },
  {
    status: 'APPROVED',
    description: 'The final cut has your approval.',
  },
  {
    status: 'DELIVERED',
    description: 'Final files are available to download.',
  },
];

const REVISION_STEP: TimelineStep = {
  status: 'REVISION_REQUESTED',
  description: 'Your notes are back with the editing team.',
};

function getSteps(status: OrderStatus): TimelineStep[] {
  if (status !== 'REVISION_REQUESTED') {
    return BASE_STEPS;
  }

  const reviewIndex = BASE_STEPS.findIndex(
    (step) => step.status === 'IN_REVIEW'
  );
  const nextSteps = [...BASE_STEPS];
  nextSteps.splice(reviewIndex + 1, 0, REVISION_STEP);

  return nextSteps;
}

export interface OrderStatusTimelineProps {
  status: OrderStatus;
}

export function OrderStatusTimeline({
  status,
}: OrderStatusTimelineProps) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600 shadow-soft">
          <XCircle aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-red-950">
            This order was cancelled
          </p>
          <p className="mt-1 text-xs leading-5 text-red-700">
            It is no longer moving through production. Contact your workspace
            manager if you need to restart it.
          </p>
        </div>
      </div>
    );
  }

  const steps = getSteps(status);
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.status === status)
  );

  return (
    <ol className="space-y-0">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isRevision = step.status === 'REVISION_REQUESTED';
        const isLast = index === steps.length - 1;
        const Icon = isComplete
          ? Check
          : isCurrent
            ? isRevision
              ? RotateCcw
              : Circle
            : Clock;

        return (
          <li
            key={step.status}
            aria-current={isCurrent ? 'step' : undefined}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {!isLast ? (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-0 left-[15px] top-8 w-px',
                  isComplete ? 'bg-indigo-300' : 'bg-slate-200'
                )}
              />
            ) : null}
            <span
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                isComplete
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : isCurrent
                    ? isRevision
                      ? 'border-orange-200 bg-orange-50 text-orange-600 ring-4 ring-orange-50'
                      : 'border-indigo-200 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50'
                    : 'border-slate-200 bg-white text-slate-300'
              )}
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    isComplete || isCurrent
                      ? 'text-brand-ink'
                      : 'text-slate-400'
                  )}
                >
                  {ORDER_STATUS_LABELS[step.status]}
                </p>
                {isCurrent ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    Current
                  </span>
                ) : null}
              </div>
              <p
                className={cn(
                  'mt-1 text-xs leading-5',
                  isComplete || isCurrent
                    ? 'text-slate-500'
                    : 'text-slate-400'
                )}
              >
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
