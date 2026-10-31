'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { sendAdminMessage } from './actions';

export interface InboxMessage {
  id: string;
  order_id: string | null;
  workspace_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface InboxOrder {
  order_no: number;
  title: string;
  workspace_id: string;
}

export interface InboxPerson {
  name: string | null;
  email: string | null;
  role: string;
}

export interface AdminInboxProps {
  messages: InboxMessage[];
  workspaces: Record<string, string>;
  orders: Record<string, InboxOrder>;
  people: Record<string, InboxPerson>;
  adminId: string;
}

const CANNED_REPLIES: { label: string; text: string }[] = [
  {
    label: 'Received your footage',
    text: 'Thanks for sending the footage. We have received it and your editor will start shortly.',
  },
  {
    label: 'First draft on the way',
    text: 'Your first draft is in progress. You will get a notification as soon as it is ready for review.',
  },
  {
    label: 'Need more details',
    text: 'Could you share a little more detail about the style you want (pace, music, references)? This helps us get the first draft right.',
  },
  {
    label: 'Revision in progress',
    text: 'Thanks for the feedback. We are working on your revision and will update you soon.',
  },
  {
    label: 'Delivered',
    text: 'Your final files are ready in the Deliverables tab of your order. Let us know if you need anything else.',
  },
];

const STAFF_ROLES = ['ADMIN', 'EDITOR'];

function isInboxMessage(value: unknown): value is InboxMessage {
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

function mergeMessages(current: InboxMessage[], incoming: InboxMessage[]): InboxMessage[] {
  const byId = new Map<string, InboxMessage>();

  for (const message of current) {
    byId.set(message.id, message);
  }

  for (const message of incoming) {
    byId.set(message.id, message);
  }

  return Array.from(byId.values()).sort(
    (left, right) =>
      new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
  );
}

function threadKeyOf(message: InboxMessage): string {
  return message.order_id ? `o:${message.order_id}` : `w:${message.workspace_id}`;
}

interface Thread {
  key: string;
  orderId: string | null;
  workspaceId: string;
  title: string;
  subtitle: string;
  messages: InboxMessage[];
  last: InboxMessage;
  awaitingReply: boolean;
}

export function AdminInbox({
  messages: initialMessages,
  workspaces,
  orders,
  people,
  adminId,
}: AdminInboxProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<InboxMessage[]>(initialMessages);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'awaiting'>('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages((current) => mergeMessages(current, initialMessages));
  }, [initialMessages]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('admin-inbox-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (!isInboxMessage(payload.new)) {
            return;
          }

          const incoming = payload.new;

          setMessages((current) => mergeMessages(current, [incoming]));

          const knownWorkspace = Boolean(workspaces[incoming.workspace_id]);
          const knownSender = Boolean(people[incoming.sender_id]);
          const knownOrder = !incoming.order_id || Boolean(orders[incoming.order_id]);

          if (!knownWorkspace || !knownSender || !knownOrder) {
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [orders, people, router, workspaces]);

  const threads = useMemo<Thread[]>(() => {
    const grouped = new Map<string, InboxMessage[]>();

    for (const message of messages) {
      const key = threadKeyOf(message);
      const list = grouped.get(key);

      if (list) {
        list.push(message);
      } else {
        grouped.set(key, [message]);
      }
    }

    const result: Thread[] = [];

    grouped.forEach((threadMessages, key) => {
      const last = threadMessages[threadMessages.length - 1];
      const order = last.order_id ? orders[last.order_id] : undefined;
      const lastSender = people[last.sender_id];
      const awaitingReply = !lastSender || !STAFF_ROLES.includes(lastSender.role);

      result.push({
        key,
        orderId: last.order_id,
        workspaceId: last.workspace_id,
        title: order ? `#${order.order_no} · ${order.title}` : 'Workspace chat',
        subtitle: workspaces[last.workspace_id] ?? 'Workspace',
        messages: threadMessages,
        last,
        awaitingReply,
      });
    });

    return result.sort(
      (left, right) =>
        new Date(right.last.created_at).getTime() - new Date(left.last.created_at).getTime()
    );
  }, [messages, orders, people, workspaces]);

  const visibleThreads = threads.filter((thread) => {
    if (filter === 'awaiting' && !thread.awaitingReply) {
      return false;
    }

    const needle = query.trim().toLowerCase();

    if (!needle) {
      return true;
    }

    return (
      thread.title.toLowerCase().includes(needle) ||
      thread.subtitle.toLowerCase().includes(needle) ||
      thread.messages.some((message) => message.body.toLowerCase().includes(needle))
    );
  });

  const selected =
    threads.find((thread) => thread.key === selectedKey) ?? visibleThreads[0] ?? null;
  const awaitingCount = threads.filter((thread) => thread.awaitingReply).length;
  const selectedMessageCount = selected?.messages.length ?? 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [selected?.key, selectedMessageCount]);

  function handleSend() {
    if (!selected) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await sendAdminMessage({
        orderId: selected.orderId,
        workspaceId: selected.workspaceId,
        body: draft,
      });

      if (result.success && result.message) {
        const sent = result.message;

        setMessages((current) => mergeMessages(current, [sent]));
        setDraft('');
      } else {
        setError(result.error ?? 'Could not send the message.');
      }
    });
  }

  function senderLabel(senderId: string): string {
    if (senderId === adminId) {
      return 'You';
    }

    const person = people[senderId];

    return person?.name || person?.email || 'Unknown';
  }

  return (
    <Card className="grid min-h-[560px] overflow-hidden md:grid-cols-[320px_1fr]">
      <div className="flex min-h-0 flex-col border-b border-slate-100 md:border-b-0 md:border-r">
        <div className="space-y-3 border-b border-slate-100 p-4">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search conversations"
              aria-label="Search conversations"
              className="h-10 pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'primary' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All ({threads.length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'awaiting' ? 'primary' : 'outline'}
              onClick={() => setFilter('awaiting')}
            >
              Awaiting reply ({awaitingCount})
            </Button>
          </div>
        </div>

        <ul className="max-h-[420px] min-h-0 flex-1 overflow-y-auto md:max-h-none">
          {visibleThreads.length === 0 ? (
            <li className="p-6 text-center text-sm text-slate-500">
              {threads.length === 0 ? 'No messages yet.' : 'No conversations match.'}
            </li>
          ) : (
            visibleThreads.map((thread) => (
              <li key={thread.key}>
                <button
                  type="button"
                  onClick={() => setSelectedKey(thread.key)}
                  aria-current={selected?.key === thread.key ? 'true' : undefined}
                  className={cn(
                    'block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50',
                    selected?.key === thread.key && 'bg-indigo-50/60'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-brand-ink">
                      {thread.title}
                    </span>
                    {thread.awaitingReply ? <Badge variant="warning">Reply</Badge> : null}
                  </div>
                  <p className="truncate text-xs text-slate-500">{thread.subtitle}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">{thread.last.body}</p>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="flex min-h-[420px] min-w-0 flex-col">
        {selected ? (
          <>
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="truncate text-base font-semibold text-brand-ink">
                {selected.title}
              </h2>
              <p className="truncate text-xs text-slate-500">{selected.subtitle}</p>
            </div>

            <div className="max-h-[420px] min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {selected.messages.map((message) => {
                const mine = message.sender_id === adminId;
                const sender = people[message.sender_id];
                const isStaff = sender ? STAFF_ROLES.includes(sender.role) : false;

                return (
                  <div
                    key={message.id}
                    className={cn('flex flex-col', isStaff || mine ? 'items-end' : 'items-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm',
                        isStaff || mine
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      )}
                    >
                      {message.body}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {senderLabel(message.sender_id)} ·{' '}
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="space-y-3 border-t border-slate-100 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="canned-reply" className="text-xs font-medium text-slate-500">
                  Quick reply
                </label>
                <Select
                  id="canned-reply"
                  value=""
                  onChange={(event) => {
                    const reply = CANNED_REPLIES.find((item) => item.label === event.target.value);

                    if (reply) {
                      setDraft(reply.text);
                    }
                  }}
                  className="h-9 w-56"
                >
                  <option value="">Choose a template</option>
                  {CANNED_REPLIES.map((reply) => (
                    <option key={reply.label} value={reply.label}>
                      {reply.label}
                    </option>
                  ))}
                </Select>
              </div>
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write a reply"
                aria-label="Reply"
                maxLength={4000}
                className="min-h-[88px]"
              />
              <div className="flex items-center justify-between gap-3">
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
                <Button onClick={handleSend} isLoading={isPending} disabled={!draft.trim()}>
                  Send reply
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500">
            Select a conversation to read and reply.
          </div>
        )}
      </div>
    </Card>
  );
}
