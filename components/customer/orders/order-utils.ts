import type { Order, OrderKind, OrderStatus } from '@/types/db';

export const ORDER_STATUSES: OrderStatus[] = [
  'DRAFT',
  'SUBMITTED',
  'ASSIGNED',
  'IN_PROGRESS',
  'IN_REVIEW',
  'REVISION_REQUESTED',
  'APPROVED',
  'DELIVERED',
  'CANCELLED',
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In progress',
  IN_REVIEW: 'In review',
  REVISION_REQUESTED: 'Revision requested',
  APPROVED: 'Approved',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_KIND_LABELS: Record<OrderKind, string> = {
  HORIZONTAL: 'Horizontal video',
  VERTICAL: 'Vertical video',
  THUMBNAIL: 'Thumbnail',
};

export function readParam(
  value: string | string[] | undefined
): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export function parseOrderStatus(
  value: string | null | undefined
): OrderStatus | null {
  const normalized = value?.trim().toUpperCase() ?? '';

  if (!normalized) {
    return null;
  }

  return ORDER_STATUSES.includes(normalized as OrderStatus)
    ? (normalized as OrderStatus)
    : null;
}

export function formatDate(value: string | null): string {
  if (!value) {
    return 'No date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year:
      date.getFullYear() === new Date().getFullYear()
        ? undefined
        : 'numeric',
  }).format(date);
}

export function formatDateTime(value: string | null): string {
  if (!value) {
    return 'No date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year:
      date.getFullYear() === new Date().getFullYear()
        ? undefined
        : 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const diffMs = Date.now() - date.getTime();

  if (diffMs < 0) {
    return formatDate(value);
  }

  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(value);
}

export function isOverdue(
  order: Pick<Order, 'due_at' | 'status'>
): boolean {
  if (
    !order.due_at ||
    order.status === 'DELIVERED' ||
    order.status === 'CANCELLED'
  ) {
    return false;
  }

  const dueDate = new Date(order.due_at);

  return (
    !Number.isNaN(dueDate.getTime()) && dueDate.getTime() < Date.now()
  );
}

export function formatBytes(size: number | null): string {
  if (size === null || !Number.isFinite(size)) {
    return 'Size unknown';
  }

  if (size < 1024) {
    return `${Math.max(0, Math.round(size))} B`;
  }

  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export function safeHttpUrl(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function getInitials(value: string | null): string {
  const parts = (value ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'CC';
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export type CountdownTone = 'neutral' | 'success' | 'warning' | 'danger';

export interface CountdownMeta {
  label: string;
  detail: string;
  tone: CountdownTone;
}

function formatDuration(milliseconds: number): string {
  const minutes = Math.max(1, Math.floor(milliseconds / 60000));

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  return remainingHours > 0
    ? `${days}d ${remainingHours}h`
    : `${days}d`;
}

export function describeDueDate(
  value: string | null,
  status: OrderStatus,
  now = Date.now()
): CountdownMeta {
  if (status === 'DELIVERED') {
    return {
      label: 'Delivery complete',
      detail: 'Final files are ready in the deliverables tab.',
      tone: 'success',
    };
  }

  if (status === 'CANCELLED') {
    return {
      label: 'Order cancelled',
      detail: 'This order is no longer in production.',
      tone: 'neutral',
    };
  }

  if (!value) {
    return {
      label: 'No due date yet',
      detail: 'A deadline appears once production is scheduled.',
      tone: 'neutral',
    };
  }

  const dueDate = new Date(value);

  if (Number.isNaN(dueDate.getTime())) {
    return {
      label: 'Due date pending',
      detail: 'We will confirm the deadline with your editor.',
      tone: 'neutral',
    };
  }

  const difference = dueDate.getTime() - now;

  if (difference <= 0) {
    return {
      label: `Overdue by ${formatDuration(Math.abs(difference))}`,
      detail: `Was due ${formatDate(value)}.`,
      tone: 'danger',
    };
  }

  if (difference < 60 * 60 * 1000) {
    return {
      label: `Due in ${formatDuration(difference)}`,
      detail: `Due ${formatDate(value)}.`,
      tone: 'danger',
    };
  }

  if (difference < 24 * 60 * 60 * 1000) {
    return {
      label: `Due in ${formatDuration(difference)}`,
      detail: `Due ${formatDate(value)}.`,
      tone: 'warning',
    };
  }

  return {
    label: `Due in ${formatDuration(difference)}`,
    detail: `Due ${formatDate(value)}.`,
    tone: 'neutral',
  };
}
