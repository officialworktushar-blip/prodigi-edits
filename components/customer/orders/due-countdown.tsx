'use client';

import { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/db';
import {
  describeDueDate,
  formatDate,
  type CountdownTone,
} from './order-utils';

const toneClasses: Record<
  CountdownTone,
  { icon: string; label: string; detail: string }
> = {
  neutral: {
    icon: 'bg-indigo-50 text-indigo-600',
    label: 'text-brand-ink',
    detail: 'text-slate-500',
  },
  success: {
    icon: 'bg-emerald-50 text-emerald-600',
    label: 'text-emerald-900',
    detail: 'text-emerald-700',
  },
  warning: {
    icon: 'bg-amber-50 text-amber-600',
    label: 'text-amber-950',
    detail: 'text-amber-700',
  },
  danger: {
    icon: 'bg-red-50 text-red-600',
    label: 'text-red-950',
    detail: 'text-red-700',
  },
};

export interface DueCountdownProps {
  dueAt: string | null;
  status: OrderStatus;
}

export function DueCountdown({ dueAt, status }: DueCountdownProps) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 60000);

    return () => window.clearInterval(interval);
  }, [dueAt, status]);

  const isSettled =
    status === 'DELIVERED' || status === 'CANCELLED' || !dueAt;
  const meta =
    now === null
      ? isSettled
        ? describeDueDate(dueAt, status, 0)
        : {
            label: formatDate(dueAt),
            detail: 'Scheduled deadline.',
            tone: 'neutral' as CountdownTone,
          }
      : describeDueDate(dueAt, status, now);
  const styles = toneClasses[meta.tone];

  return (
    <div className="flex items-start gap-3" aria-live="polite">
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          styles.icon
        )}
      >
        <CalendarClock aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className={cn('text-sm font-semibold', styles.label)}>
          {meta.label}
        </p>
        <p className={cn('mt-1 text-xs leading-5', styles.detail)}>
          {meta.detail}
        </p>
      </div>
    </div>
  );
}
