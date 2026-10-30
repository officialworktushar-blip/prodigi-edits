'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Clock3,
  RotateCcw,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from 'lucide-react';
import {
  approveOrder,
  requestRevision,
} from '@/app/(customer)/app/orders/[id]/review-actions';
import { Button } from '@/components/ui/button';
import { ORDER_STATUS_LABELS } from '@/components/customer/orders/order-utils';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/db';

interface StatusCopy {
  icon: LucideIcon;
  title: string;
  body: string;
  tone: string;
}

function getStatusCopy(status: OrderStatus): StatusCopy {
  if (status === 'REVISION_REQUESTED') {
    return {
      icon: RotateCcw,
      title: 'Revision requested',
      body: 'Your notes are with the editor. The next cut will return here for another look.',
      tone: 'bg-amber-50 text-amber-700',
    };
  }

  if (status === 'APPROVED' || status === 'DELIVERED') {
    return {
      icon: CheckCircle2,
      title: status === 'DELIVERED' ? 'Delivered' : 'Cut approved',
      body:
        status === 'DELIVERED'
          ? 'Final files are ready in the deliverables tab.'
          : 'The final delivery is being prepared for this order.',
      tone: 'bg-emerald-50 text-emerald-700',
    };
  }

  if (status === 'CANCELLED') {
    return {
      icon: XCircle,
      title: 'Order cancelled',
      body: 'This order is no longer in production, so review actions are closed.',
      tone: 'bg-slate-100 text-slate-500',
    };
  }

  return {
    icon: Clock3,
    title: ORDER_STATUS_LABELS[status],
    body: 'Review actions unlock when a cut is ready for your decision.',
    tone: 'bg-indigo-50 text-indigo-700',
  };
}

export interface ReviewActionsProps {
  orderId: string;
  orderStatus: OrderStatus;
}

export function ReviewActions({
  orderId,
  orderStatus,
}: ReviewActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(orderStatus);
  const [pending, setPending] = useState<'revision' | 'approve' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus(orderStatus);
  }, [orderStatus]);

  const canReview = status === 'IN_REVIEW';
  const copy = getStatusCopy(status);
  const Icon = copy.icon;

  async function handleDecision(kind: 'revision' | 'approve') {
    if (pending) {
      return;
    }

    setPending(kind);
    setMessage(null);
    setError(null);

    try {
      const result =
        kind === 'approve'
          ? await approveOrder({ orderId })
          : await requestRevision({ orderId });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      if (result.orderStatus) {
        setStatus(result.orderStatus);
      }

      setMessage(result.message);
      router.refresh();
    } catch {
      setError(
        'We could not update this order. Check your connection and try again.'
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            canReview ? 'bg-indigo-50 text-indigo-600' : copy.tone
          )}
        >
          {canReview ? (
            <ShieldCheck aria-hidden="true" className="h-5 w-5" />
          ) : (
            <Icon aria-hidden="true" className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-brand-ink">
            {canReview ? 'Ready for your decision' : copy.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {canReview
              ? 'Approve this cut when it is ready, or request a revision and leave timestamped notes for the editor.'
              : copy.body}
          </p>
        </div>
      </div>

      {canReview ? (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => handleDecision('revision')}
            isLoading={pending === 'revision'}
            disabled={pending !== null}
          >
            {pending !== 'revision' ? (
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            ) : null}
            Request revision
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => handleDecision('approve')}
            isLoading={pending === 'approve'}
            disabled={pending !== null}
          >
            {pending !== 'approve' ? (
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            ) : null}
            Approve cut
          </Button>
        </div>
      ) : null}

      {message ? (
        <p
          role="status"
          className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-700"
        >
          {message}
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700"
        >
          {error}
        </p>
      ) : null}

      {canReview ? (
        <p className="mt-4 text-xs leading-5 text-slate-400">
          Approving locks this cut for delivery. Requesting a revision moves the
          order back into production.
        </p>
      ) : null}
    </section>
  );
}
