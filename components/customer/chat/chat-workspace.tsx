'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ORDER_KIND_LABELS, ORDER_STATUS_LABELS } from '@/components/customer/orders/order-utils';
import type { Message } from '@/types/db';
import { ChatPanel } from './chat-panel';
import { ChatThreadList } from './chat-thread-list';
import {
  WORKSPACE_THREAD_KEY,
  orderThreadKey,
  threadKeyForMessage,
  type ChatMessage,
  type ChatOrder,
  type ChatProfile,
  type ChatThread,
} from './types';
import { useWorkspaceMessages } from './use-workspace-messages';

function readSeenState(storageKey: string): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(storageKey);

    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    const result: Record<string, string> = {};

    Object.entries(parsed as Record<string, unknown>).forEach(
      ([key, value]) => {
        if (typeof value === 'string') {
          result[key] = value;
        }
      }
    );

    return result;
  } catch {
    return {};
  }
}

function writeSeenState(
  storageKey: string,
  value: Record<string, string>
) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    return;
  }
}

export interface ChatWorkspaceProps {
  workspaceId: string;
  workspaceName: string;
  userId: string;
  orders: ChatOrder[];
  initialMessages: Message[];
  profiles: ChatProfile[];
  initialThreadKey: string;
}

export function ChatWorkspace({
  workspaceId,
  workspaceName,
  userId,
  orders,
  initialMessages,
  profiles,
  initialThreadKey,
}: ChatWorkspaceProps) {
  const threads = useMemo<ChatThread[]>(() => {
    const workspaceThread: ChatThread = {
      key: WORKSPACE_THREAD_KEY,
      kind: 'workspace',
      orderId: null,
      title: workspaceName,
      subtitle: 'Team-wide conversation',
      status: null,
    };

    const orderThreads = orders.map((order) => ({
      key: orderThreadKey(order.id),
      kind: 'order' as const,
      orderId: order.id,
      title: `#${order.order_no} ${order.title}`,
      subtitle: `${ORDER_KIND_LABELS[order.kind]} · ${ORDER_STATUS_LABELS[order.status]}`,
      status: order.status,
    }));

    return [workspaceThread, ...orderThreads];
  }, [orders, workspaceName]);

  const [activeKey, setActiveKey] = useState(() =>
    threads.some((thread) => thread.key === initialThreadKey)
      ? initialThreadKey
      : WORKSPACE_THREAD_KEY
  );
  const [unreadByThread, setUnreadByThread] = useState<
    Record<string, number>
  >({});
  const activeKeyRef = useRef(activeKey);
  activeKeyRef.current = activeKey;
  const unreadLoadedRef = useRef(false);
  const storageKey = `prodigiedits:chat-read:${workspaceId}:${userId}`;

  const handleIncoming = useCallback(
    (message: Message) => {
      if (message.sender_id === userId) {
        return;
      }

      const key = threadKeyForMessage(message);

      if (key !== activeKeyRef.current) {
        setUnreadByThread((previous) => ({
          ...previous,
          [key]: (previous[key] ?? 0) + 1,
        }));
      }
    },
    [userId]
  );

  const { messages, sendMessage } = useWorkspaceMessages({
    workspaceId,
    userId,
    initialMessages,
    onIncoming: handleIncoming,
  });

  useEffect(() => {
    if (unreadLoadedRef.current) {
      return;
    }

    unreadLoadedRef.current = true;
    const seen = readSeenState(storageKey);
    const counts: Record<string, number> = {};

    threads.forEach((thread) => {
      if (thread.key === activeKeyRef.current) {
        return;
      }

      const lastSeen = seen[thread.key];

      if (!lastSeen) {
        return;
      }

      const threshold = new Date(lastSeen).getTime();

      if (!Number.isFinite(threshold)) {
        return;
      }

      const count = messages.filter((message) => {
        if (
          threadKeyForMessage(message) !== thread.key ||
          message.sender_id === userId
        ) {
          return false;
        }

        return new Date(message.created_at).getTime() > threshold;
      }).length;

      if (count > 0) {
        counts[thread.key] = count;
      }
    });

    setUnreadByThread(counts);
  }, [messages, storageKey, threads, userId]);

  useEffect(() => {
    const threadMessages = messages.filter(
      (message) => threadKeyForMessage(message) === activeKey
    );
    const latest = threadMessages[threadMessages.length - 1];
    const seen = readSeenState(storageKey);
    seen[activeKey] = latest?.created_at ?? new Date().toISOString();
    writeSeenState(storageKey, seen);
    setUnreadByThread((previous) => {
      if (!previous[activeKey]) {
        return previous;
      }

      const next = { ...previous };
      delete next[activeKey];
      return next;
    });
  }, [activeKey, messages, storageKey]);

  const lastByThread = useMemo(() => {
    const result: Record<string, ChatMessage | undefined> = {};

    messages.forEach((message) => {
      result[threadKeyForMessage(message)] = message;
    });

    return result;
  }, [messages]);

  const profileMap = useMemo(() => {
    const result: Record<string, ChatProfile> = {};

    profiles.forEach((profile) => {
      result[profile.id] = profile;
    });

    return result;
  }, [profiles]);

  const activeThread =
    threads.find((thread) => thread.key === activeKey) ?? threads[0];
  const activeMessages = useMemo(
    () =>
      messages.filter(
        (message) => threadKeyForMessage(message) === activeThread?.key
      ),
    [activeThread?.key, messages]
  );
  const totalUnread = Object.values(unreadByThread).reduce(
    (sum, count) => sum + count,
    0
  );

  function selectThread(key: string) {
    setActiveKey(key);
    setUnreadByThread((previous) => {
      if (!previous[key]) {
        return previous;
      }

      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      <ChatThreadList
        threads={threads}
        activeKey={activeThread?.key ?? activeKey}
        unreadByThread={unreadByThread}
        lastByThread={lastByThread}
        totalUnread={totalUnread}
        onSelect={selectThread}
      />

      {activeThread ? (
        <ChatPanel
          thread={activeThread}
          messages={activeMessages}
          profiles={profileMap}
          userId={userId}
          onSend={(body) =>
            sendMessage({
              body,
              orderId: activeThread.orderId,
            })
          }
          onRetry={(message) => {
            if (!message.clientId) {
              return;
            }

            sendMessage({
              body: message.body,
              orderId: message.order_id,
              retryClientId: message.clientId,
            });
          }}
        />
      ) : null}
    </div>
  );
}
