'use client';

import { useEffect, useRef, useState } from 'react';
import {
  markAllNotificationsRead,
  markNotificationRead,
} from '@/app/(customer)/app/actions';
import { createClient } from '@/lib/supabase/client';
import type { Notification } from '@/types/db';

const MAX_VISIBLE_NOTIFICATIONS = 12;

function isNotification(value: unknown): value is Notification {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.user_id === 'string' &&
    typeof record.title === 'string' &&
    typeof record.created_at === 'string'
  );
}

export function useNotificationsRealtime(input: {
  userId: string;
  initialNotifications: Notification[];
  initialUnreadCount: number;
}) {
  const [notifications, setNotifications] = useState<Notification[]>(
    input.initialNotifications
  );
  const [unreadCount, setUnreadCount] = useState(
    Math.max(0, input.initialUnreadCount)
  );
  const notificationsRef = useRef(input.initialNotifications);

  function commit(next: Notification[]) {
    const trimmed = next.slice(0, MAX_VISIBLE_NOTIFICATIONS);
    notificationsRef.current = trimmed;
    setNotifications(trimmed);
  }

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`customer-notifications-${input.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${input.userId}`,
        },
        (payload) => {
          if (!isNotification(payload.new)) {
            return;
          }

          const nextNotification = payload.new;
          const current = notificationsRef.current;

          if (current.some((item) => item.id === nextNotification.id)) {
            return;
          }

          commit([nextNotification, ...current]);

          if (!nextNotification.read_at) {
            setUnreadCount((count) => count + 1);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [input.userId]);

  function markRead(id: string) {
    const current = notificationsRef.current;
    const target = current.find((item) => item.id === id);

    if (!target || target.read_at) {
      return;
    }

    const readAt = new Date().toISOString();
    commit(
      current.map((item) =>
        item.id === id ? { ...item, read_at: readAt } : item
      )
    );
    setUnreadCount((count) => Math.max(0, count - 1));
    void markNotificationRead(id).catch(() => undefined);
  }

  function markAllRead() {
    const current = notificationsRef.current;
    const readAt = new Date().toISOString();

    commit(
      current.map((item) =>
        item.read_at ? item : { ...item, read_at: readAt }
      )
    );
    setUnreadCount(0);
    void markAllNotificationsRead().catch(() => undefined);
  }

  return {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
  };
}
