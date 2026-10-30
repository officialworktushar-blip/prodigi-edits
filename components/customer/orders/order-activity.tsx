import { MessageSquare, Paperclip } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import type { OrderTeamProfile } from '@/lib/data/customer';
import type { Message } from '@/types/db';
import {
  formatDateTime,
  formatRelativeTime,
  getInitials,
} from './order-utils';

export interface OrderActivityProps {
  messages: Message[];
  currentUserId: string;
  team: OrderTeamProfile[];
}

export function OrderActivity({
  messages,
  currentUserId,
  team,
}: OrderActivityProps) {
  if (messages.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-soft">
        <EmptyState
          icon="message"
          title="No activity yet"
          description="Messages about this order will appear here."
        />
      </section>
    );
  }

  const profiles = new Map(team.map((profile) => [profile.id, profile]));
  const orderedMessages = [...messages].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold tracking-tight text-brand-ink">
          Activity
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Conversation history for this order.
        </p>
      </div>

      <ul className="divide-y divide-slate-100">
        {orderedMessages.map((message) => {
          const profile = profiles.get(message.sender_id);
          const isCurrentUser = message.sender_id === currentUserId;
          const senderName = isCurrentUser
            ? 'You'
            : profile?.name?.trim() || 'Workspace member';
          const initials = isCurrentUser
            ? 'ME'
            : getInitials(profile?.name ?? null);

          return (
            <li key={message.id} className="flex gap-3 px-5 py-4 sm:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-semibold text-brand-ink">
                    {senderName}
                  </p>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <time
                    dateTime={message.created_at}
                    title={formatDateTime(message.created_at)}
                    className="text-xs text-slate-400"
                  >
                    {formatRelativeTime(message.created_at)}
                  </time>
                </div>
                <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                  {message.body}
                </p>
                {message.attachment_path ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    <Paperclip aria-hidden="true" className="h-3.5 w-3.5" />
                    Attachment included
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-slate-100 bg-brand-surface px-5 py-3 sm:px-6">
        <p className="flex items-center gap-2 text-xs leading-5 text-slate-400">
          <MessageSquare aria-hidden="true" className="h-3.5 w-3.5" />
          New messages about this order will appear here.
        </p>
      </div>
    </section>
  );
}
