'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Film,
  MessageSquare,
  SendHorizontal,
} from 'lucide-react';
import { ORDER_STATUS_LABELS } from '@/components/customer/orders/order-utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/db';
import {
  formatDayLabel,
  formatMessageTime,
  getInitials,
} from './format';
import type {
  ChatMessage,
  ChatProfile,
  ChatThread,
} from './types';

function statusVariant(status: OrderStatus | null): BadgeVariant {
  if (status === 'DELIVERED' || status === 'APPROVED') {
    return 'success';
  }

  if (status === 'CANCELLED') {
    return 'danger';
  }

  if (status === 'IN_REVIEW' || status === 'REVISION_REQUESTED') {
    return 'warning';
  }

  return 'secondary';
}

export interface ChatPanelProps {
  thread: ChatThread;
  messages: ChatMessage[];
  profiles: Record<string, ChatProfile>;
  userId: string;
  onSend: (body: string) => void;
  onRetry: (message: ChatMessage) => void;
}

export function ChatPanel({
  thread,
  messages,
  profiles,
  userId,
  onSend,
  onRetry,
}: ChatPanelProps) {
  const [body, setBody] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBody('');
  }, [thread.key]);

  useEffect(() => {
    const container = scrollRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages.length, thread.key]);

  function submitMessage() {
    const trimmed = body.trim();

    if (!trimmed) {
      return;
    }

    onSend(trimmed);
    setBody('');
  }

  return (
    <div className="flex h-[min(680px,calc(100vh-13rem))] min-h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            {thread.kind === 'workspace' ? (
              <MessageSquare aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Film aria-hidden="true" className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold text-brand-ink">
                {thread.title}
              </h2>
              {thread.status ? (
                <Badge variant={statusVariant(thread.status)}>
                  {ORDER_STATUS_LABELS[thread.status]}
                </Badge>
              ) : (
                <Badge variant="outline">Shared workspace</Badge>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              />
              {thread.subtitle}
            </p>
          </div>
        </div>

        {thread.orderId ? (
          <Link
            href={`/app/orders/${thread.orderId}`}
            className="hidden shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo sm:inline-flex"
          >
            View order
          </Link>
        ) : null}
      </div>

      <div
        ref={scrollRef}
        aria-live="polite"
        className="flex-1 overflow-y-auto bg-brand-surface/60 px-4 py-5 sm:px-6"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
              <MessageSquare aria-hidden="true" className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-brand-ink">
              Start the conversation
            </h3>
            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Share context, questions, or feedback here. Everyone with access
              to this thread can reply.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((message, index) => {
              const previous = messages[index - 1];
              const showDay =
                !previous ||
                formatDayLabel(previous.created_at) !==
                  formatDayLabel(message.created_at);
              const isMine = message.sender_id === userId;
              const profile = profiles[message.sender_id];
              const displayName = isMine
                ? 'You'
                : profile?.name?.trim() || 'Teammate';

              return (
                <div key={message.clientId ?? message.id}>
                  {showDay ? (
                    <div className="mb-5 flex justify-center">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {formatDayLabel(message.created_at)}
                      </span>
                    </div>
                  ) : null}

                  <div
                    className={cn(
                      'flex items-end gap-2.5',
                      isMine ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url ?? undefined}
                        alt={displayName}
                      />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(profile?.name ?? displayName)}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={cn(
                        'max-w-[80%] sm:max-w-[72%]',
                        isMine ? 'items-end text-right' : 'items-start'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-2 text-[10px] text-slate-400',
                          isMine ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <span className="font-semibold text-slate-500">
                          {displayName}
                        </span>
                        <span>{formatMessageTime(message.created_at)}</span>
                      </div>

                      <div
                        className={cn(
                          'mt-1 whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-left text-sm leading-6 shadow-soft',
                          isMine
                            ? 'bg-gradient-to-br from-brand-indigo to-brand-blue text-white'
                            : 'border border-slate-200 bg-white text-slate-700',
                          message.clientStatus === 'failed'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : ''
                        )}
                      >
                        {message.body}
                      </div>

                      {message.clientStatus ? (
                        <div
                          className={cn(
                            'mt-1 flex items-center gap-2 text-[10px]',
                            isMine ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {message.clientStatus === 'sending' ? (
                            <span className="text-slate-400">Sending...</span>
                          ) : (
                            <>
                              <span className="flex items-center gap-1 text-red-600">
                                <AlertCircle
                                  aria-hidden="true"
                                  className="h-3 w-3"
                                />
                                Not sent
                              </span>
                              <button
                                type="button"
                                onClick={() => onRetry(message)}
                                className="font-semibold text-indigo-600 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
                              >
                                Retry
                              </button>
                            </>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitMessage();
        }}
        className="shrink-0 border-t border-slate-100 bg-white p-3 sm:p-4"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="chat-message" className="sr-only">
            Message
          </label>
          <Textarea
            id="chat-message"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submitMessage();
              }
            }}
            maxLength={2000}
            rows={2}
            placeholder={`Message ${thread.title}...`}
            className="min-h-[52px] max-h-36 resize-none py-3"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!body.trim()}
            className="h-[52px] shrink-0 px-4"
          >
            <SendHorizontal aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
        <p className="mt-2 px-1 text-[10px] text-slate-400">
          Enter to send. Shift + Enter for a new line.
        </p>
      </form>
    </div>
  );
}
