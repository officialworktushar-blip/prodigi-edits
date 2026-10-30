'use client';

import { Film, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  formatThreadTime,
  formatUnreadCount,
} from './format';
import type { ChatMessage, ChatThread } from './types';

export interface ChatThreadListProps {
  threads: ChatThread[];
  activeKey: string;
  unreadByThread: Record<string, number>;
  lastByThread: Record<string, ChatMessage | undefined>;
  totalUnread: number;
  onSelect: (key: string) => void;
}

export function ChatThreadList({
  threads,
  activeKey,
  unreadByThread,
  lastByThread,
  totalUnread,
  onSelect,
}: ChatThreadListProps) {
  return (
    <div className="flex max-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft lg:max-h-[680px]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-brand-ink">
            Conversations
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Workspace and order threads
          </p>
        </div>
        {totalUnread > 0 ? (
          <Badge variant="secondary">{formatUnreadCount(totalUnread)} new</Badge>
        ) : null}
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-2">
        {threads.map((thread) => {
          const isActive = thread.key === activeKey;
          const unread = unreadByThread[thread.key] ?? 0;
          const lastMessage = lastByThread[thread.key];
          const Icon =
            thread.kind === 'workspace' ? MessageSquare : Film;

          return (
            <button
              key={thread.key}
              type="button"
              onClick={() => onSelect(thread.key)}
              aria-current={isActive ? 'true' : undefined}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo',
                isActive
                  ? 'bg-indigo-50 text-indigo-800'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  isActive
                    ? 'bg-white text-indigo-600 shadow-soft'
                    : 'bg-slate-100 text-slate-500'
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="truncate text-sm font-semibold">
                    {thread.title}
                  </span>
                  {lastMessage ? (
                    <span className="shrink-0 text-[10px] font-medium text-slate-400">
                      {formatThreadTime(lastMessage.created_at)}
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block truncate text-xs text-slate-500">
                  {lastMessage?.body ?? thread.subtitle}
                </span>
              </span>

              {unread > 0 ? (
                <span className="mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-indigo px-1 text-[10px] font-bold text-white">
                  {formatUnreadCount(unread)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
