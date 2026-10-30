import type {
  Message,
  OrderKind,
  OrderStatus,
} from '@/types/db';

export const WORKSPACE_THREAD_KEY = 'workspace';

export interface ChatOrder {
  id: string;
  order_no: number;
  title: string;
  kind: OrderKind;
  status: OrderStatus;
}

export interface ChatThread {
  key: string;
  kind: 'workspace' | 'order';
  orderId: string | null;
  title: string;
  subtitle: string;
  status: OrderStatus | null;
}

export interface ChatProfile {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export interface ChatMessage extends Message {
  clientId?: string;
  clientStatus?: 'sending' | 'failed';
}

export interface ChatActionSuccess {
  ok: true;
  message: Message;
}

export interface ChatActionFailure {
  ok: false;
  message: string;
}

export type ChatActionResult = ChatActionSuccess | ChatActionFailure;

export function orderThreadKey(orderId: string): string {
  return `order:${orderId}`;
}

export function threadKeyForMessage(message: Message): string {
  return message.order_id
    ? orderThreadKey(message.order_id)
    : WORKSPACE_THREAD_KEY;
}
