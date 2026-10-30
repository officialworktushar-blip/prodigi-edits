import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-brand-indigo text-white',
  secondary: 'border-transparent bg-indigo-50 text-indigo-700',
  outline: 'border-slate-200 bg-transparent text-slate-600',
  success: 'border-transparent bg-emerald-50 text-emerald-700',
  warning: 'border-transparent bg-amber-50 text-amber-700',
  danger: 'border-transparent bg-red-50 text-red-700',
  info: 'border-transparent bg-blue-50 text-blue-700',
};

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
