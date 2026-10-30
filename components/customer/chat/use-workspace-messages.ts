'use client';

import { useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '@/app/(customer)/app/messages/actions';
import { createClient } from '@/lib/supabase/client';
import type { Message } from '@/types/db';
import type { ChatMessage } from './types';

const OPTIMISTIC_MATCH_WINDOW_MS = 2 * 60 * 1000;

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.workspace_id === 'string' &&
    typeof record.sender_id === 'string' &&
    typeof record.body === 'string' &&
    typeof record.created_at === 'string'
  );
}

function sortMessages(messages: ChatMessage[]): ChatMessage[] {
  return [...messages].sort(
    (left, right) =>
      new Date(left.created_at).getTime() -
      new Date(right.created_at).getTime()
  );
}

function createClientId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function canMatchOptimistic(message: ChatMessage, incoming: Message): boolean {
  if (!message.clientId) {
    return false;
  }

  if (
    message.sender_id !== incoming.sender_id ||
    message.body !== incoming.body ||
    (message.order_id ?? null) !== (incoming.order_id ?? null)
  ) {
    return false;
  }

  const optimisticTime = new Date(message.created_at).getTime();
  const serverTime = new Date(incoming.created_at).getTime();

  return (
    Number.isFinite(optimisticTime) &&
    Number.isFinite(serverTime) &&
    Math.abs(serverTime - optimisticTime) < OPTIMISTIC_MATCH_WINDOW_MS
  );
}

export function useWorkspaceMessages(input: {
  workspaceId: string;
  userId: string;
  initialMessages: Message[];
  onIncoming?: (message: Message) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    input.initialMessages
  );
  const messagesRef = useRef<ChatMessage[]>(input.initialMessages);
  const onIncomingRef = useRef(input.onIncoming);
  onIncomingRef.current = input.onIncoming;

  function commit(next: ChatMessage[]) {
    const sorted = sortMessages(next);
    messagesRef.current = sorted;
    setMessages(sorted);
  }

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`workspace-messages-${input.workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `workspace_id=eq.${input.workspaceId}`,
        },
        (payload) => {
          if (!isMessage(payload.new)) {
            return;
          }

          const incoming = payload.new;
          const current = messagesRef.current;

          if (current.some((item) => item.id === incoming.id)) {
            return;
          }

          let matchedOptimistic = false;
          const next = current.map((item) => {
            if (
              !matchedOptimistic &&
              canMatchOptimistic(item, incoming)
            ) {
              matchedOptimistic = true;
              return incoming;
            }

            return item;
          });

          if (!matchedOptimistic) {
            next.push(incoming);
          }

          commit(next);

          if (
            incoming.sender_id !== input.userId &&
            !matchedOptimistic
          ) {
            onIncomingRef.current?.(incoming);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [input.userId, input.workspaceId]);

  function markFailed(clientId: string) {
    commit(
      messagesRef.current.map((item) =>
        item.clientId === clientId
          ? { ...item, clientStatus: 'failed' }
          : item
      )
    );
  }

  async function deliver(
    optimistic: ChatMessage,
    body: string,
    orderId: string | null
  ) {
    let result: Awaited<ReturnType<typeof sendChatMessage>>;

    try {
      result = await sendChatMessage({
        workspaceId: input.workspaceId,
        orderId,
        body,
      });
    } catch {
      markFailed(optimistic.clientId ?? '');
      return;
    }

    if (result.ok) {
      const current = messagesRef.current;
      const alreadyDelivered = current.some(
        (item) => item.id === result.message.id
      );
      const next = alreadyDelivered
        ? current.filter((item) => item.clientId !== optimistic.clientId)
        : current.map((item) =>
            item.clientId === optimistic.clientId
              ? result.message
              : item
          );

      commit(next);
      return;
    }

    markFailed(optimistic.clientId ?? '');
  }

  function sendMessage(inputMessage: {
    body: string;
    orderId: string | null;
    retryClientId?: string;
  }) {
    const body = inputMessage.body.trim();

    if (!body) {
      return;
    }

    if (inputMessage.retryClientId) {
      const current = messagesRef.current;
      const target = current.find(
        (item) => item.clientId === inputMessage.retryClientId
      );

      if (!target) {
        return;
      }

      const retried: ChatMessage = {
        ...target,
        clientStatus: 'sending',
      };

      commit(
        current.map((item) =>
          item.clientId === retried.clientId ? retried : item
        )
      );
      void deliver(retried, retried.body, retried.order_id);
      return;
    }

    const clientId = createClientId();
    const optimistic: ChatMessage = {
      id: `optimistic-${clientId}`,
      order_id: inputMessage.orderId,
      workspace_id: input.workspaceId,
      sender_id: input.userId,
      body,
      attachment_path: null,
      created_at: new Date().toISOString(),
      clientId,
      clientStatus: 'sending',
    };

    commit([...messagesRef.current, optimistic]);
    void deliver(optimistic, body, inputMessage.orderId);
  }

  return {
    messages,
    sendMessage,
  };
}
