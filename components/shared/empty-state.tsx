import Link from 'next/link';
import {
  AlertCircle,
  CreditCard,
  FileText,
  FolderOpen,
  Inbox,
  MessageSquare,
  Search,
  Sparkles,
  Users,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const icons: Record<string, LucideIcon> = {
  inbox: Inbox,
  message: MessageSquare,
  messages: MessageSquare,
  search: Search,
  file: FileText,
  video: Video,
  users: Users,
  folder: FolderOpen,
  payment: CreditCard,
  alert: AlertCircle,
  error: X,
  sparkles: Sparkles,
};

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  const Icon = icons[icon] ?? Inbox;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-brand-ink">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
