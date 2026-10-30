'use client';

import * as React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  variant?: ToastVariant;
  action?: React.ReactNode;
}

export type ToastInput = string | Omit<ToastOptions, 'variant'>;

export interface ToastItem extends Omit<ToastOptions, 'variant'> {
  id: string;
  variant: ToastVariant;
  duration: number;
}

export interface ToastApi {
  toast: (input: ToastInput) => string;
  success: (input: ToastInput) => string;
  error: (input: ToastInput) => string;
  warning: (input: ToastInput) => string;
  info: (input: ToastInput) => string;
  dismiss: (id?: string) => void;
}

const ToastContext = React.createContext<ToastApi | null>(null);

const variantStyles: Record<
  ToastVariant,
  { container: string; icon: string; Icon: typeof Info }
> = {
  default: {
    container: 'border-slate-200',
    icon: 'text-brand-indigo',
    Icon: Info,
  },
  success: {
    container: 'border-emerald-200',
    icon: 'text-emerald-600',
    Icon: CheckCircle2,
  },
  error: {
    container: 'border-red-200',
    icon: 'text-red-600',
    Icon: AlertCircle,
  },
  warning: {
    container: 'border-amber-200',
    icon: 'text-amber-600',
    Icon: AlertTriangle,
  },
  info: {
    container: 'border-blue-200',
    icon: 'text-blue-600',
    Icon: Info,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const timers = React.useRef<Map<string, number>>(new Map());
  const counter = React.useRef(0);

  const remove = React.useCallback((id: string) => {
    const timer = timers.current.get(id);

    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const scheduleRemoval = React.useCallback(
    (id: string, duration: number) => {
      if (duration <= 0) {
        return;
      }

      const timer = window.setTimeout(() => {
        remove(id);
      }, duration);
      timers.current.set(id, timer);
    },
    [remove]
  );

  const pushToast = React.useCallback(
    (input: ToastInput, variant: ToastVariant = 'default') => {
      const options: Omit<ToastOptions, 'variant'> =
        typeof input === 'string' ? { title: input } : input;
      const duration = options.duration ?? 5000;
      const id = `toast-${Date.now()}-${counter.current}`;

      counter.current += 1;

      const item: ToastItem = {
        id,
        title: options.title,
        description: options.description,
        duration,
        action: options.action,
        variant,
      };

      setToasts((current) => [...current.slice(-3), item]);
      scheduleRemoval(id, duration);

      return id;
    },
    [scheduleRemoval]
  );

  const dismiss = React.useCallback(
    (id?: string) => {
      if (id) {
        remove(id);
        return;
      }

      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current.clear();
      setToasts([]);
    },
    [remove]
  );

  React.useEffect(() => {
    const activeTimers = timers.current;

    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  const api = React.useMemo<ToastApi>(
    () => ({
      toast: (input) => pushToast(input, 'default'),
      success: (input) => pushToast(input, 'success'),
      error: (input) => pushToast(input, 'error'),
      warning: (input) => pushToast(input, 'warning'),
      info: (input) => pushToast(input, 'info'),
      dismiss,
    }),
    [dismiss, pushToast]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-3 p-4 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((toast) => {
          const styles = variantStyles[toast.variant];
          const Icon = styles.Icon;

          return (
            <div
              key={toast.id}
              role={
                toast.variant === 'error' || toast.variant === 'warning'
                  ? 'alert'
                  : 'status'
              }
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white p-4 shadow-soft-lg',
                styles.container
              )}
            >
              <Icon
                className={cn('mt-0.5 h-5 w-5 shrink-0', styles.icon)}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                {toast.title ? (
                  <p className="text-sm font-semibold text-brand-ink">
                    {toast.title}
                  </p>
                ) : null}
                {toast.description ? (
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {toast.description}
                  </p>
                ) : null}
                {toast.action ? <div className="mt-3">{toast.action}</div> : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => remove(toast.id)}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>.');
  }

  return context;
}
