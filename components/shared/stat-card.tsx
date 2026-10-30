import {
  CheckCircle2,
  ClipboardList,
  Clock,
  CreditCard,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const icons: Record<string, LucideIcon> = {
  orders: ClipboardList,
  clock: Clock,
  check: CheckCircle2,
  video: Video,
  users: Users,
  payment: CreditCard,
  sparkles: Sparkles,
  trend: TrendingUp,
};

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  hint?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  className,
}: StatCardProps) {
  const Icon = icon ? icons[icon] : undefined;

  return (
    <div
      className={cn(
        'flex flex-col items-start gap-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft',
        className
      )}
    >
      {Icon ? (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
      ) : null}
      <span className="text-3xl font-bold tracking-tight text-brand-ink">
        {value}
      </span>
      <span className="text-sm font-medium text-slate-500">{label}</span>
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
    </div>
  );
}
