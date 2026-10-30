'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import {
  CheckCheck,
  Clock3,
  CornerDownRight,
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
} from 'lucide-react';
import {
  addReviewComment,
  setReviewCommentStatus,
} from '@/app/(customer)/app/orders/[id]/review-actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  formatRelativeTime,
  getInitials,
} from '@/components/customer/orders/order-utils';
import { cn } from '@/lib/utils';
import type {
  CommentStatus,
  ReviewComment,
} from '@/types/db';
import { formatTimestamp } from './format';
import type { ReviewAuthor } from './types';

function compareComments(a: ReviewComment, b: ReviewComment): number {
  const aTime =
    a.timestamp_sec === null
      ? Number.POSITIVE_INFINITY
      : Number(a.timestamp_sec);
  const bTime =
    b.timestamp_sec === null
      ? Number.POSITIVE_INFINITY
      : Number(b.timestamp_sec);

  if (aTime !== bTime) {
    return aTime - bTime;
  }

  return (
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export interface CommentPanelProps {
  orderId: string;
  draftId: string;
  comments: ReviewComment[];
  currentTime: number;
  currentUserId: string;
  authors: ReviewAuthor[];
  isLive: boolean;
  onSeek: (seconds: number) => void;
  onCommentCreated: (comment: ReviewComment) => void;
  onCommentStatusChange: (
    commentId: string,
    status: CommentStatus
  ) => void;
}

export function CommentPanel({
  orderId,
  draftId,
  comments,
  currentTime,
  currentUserId,
  authors,
  isLive,
  onSeek,
  onCommentCreated,
  onCommentStatusChange,
}: CommentPanelProps) {
  const [body, setBody] = useState('');
  const [replyTo, setReplyTo] = useState<ReviewComment | null>(null);
  const [pending, setPending] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setBody('');
    setReplyTo(null);
    setPending(false);
    setTogglingId(null);
    setError(null);
    setNotice(null);
  }, [draftId]);

  const authorMap = useMemo(
    () => new Map(authors.map((author) => [author.id, author])),
    [authors]
  );

  const groupedComments = useMemo(() => {
    const byId = new Map(comments.map((comment) => [comment.id, comment]));
    const roots: ReviewComment[] = [];
    const childrenByRoot = new Map<string, ReviewComment[]>();

    for (const comment of comments) {
      let root = comment;
      let guard = 0;

      while (root.parent_id && guard < 50) {
        const parent = byId.get(root.parent_id);

        if (!parent || parent.id === root.id) {
          break;
        }

        root = parent;
        guard += 1;
      }

      if (root.id === comment.id) {
        roots.push(comment);
        continue;
      }

      const children = childrenByRoot.get(root.id);

      if (children) {
        children.push(comment);
      } else {
        childrenByRoot.set(root.id, [comment]);
      }
    }

    roots.sort(compareComments);
    childrenByRoot.forEach((children) => {
      children.sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
      );
    });

    return { roots, childrenByRoot };
  }, [comments]);

  const unresolvedCount = comments.filter(
    (comment) => comment.status === 'OPEN'
  ).length;

  function getAuthorName(comment: ReviewComment): string {
    if (comment.author_id === currentUserId) {
      return 'You';
    }

    return (
      authorMap.get(comment.author_id)?.name?.trim() || 'Reviewer'
    );
  }

  const replyTimestamp = replyTo
    ? replyTo.timestamp_sec === null
      ? currentTime
      : Number(replyTo.timestamp_sec)
    : currentTime;
  const safeTimestamp = Number.isFinite(replyTimestamp)
    ? Math.max(0, replyTimestamp)
    : 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = body.trim();

    if (!text || pending) {
      return;
    }

    setPending(true);
    setError(null);
    setNotice(null);

    try {
      const result = await addReviewComment({
        orderId,
        draftId,
        body: text,
        timestampSec: Math.round(safeTimestamp * 100) / 100,
        parentId: replyTo?.id ?? null,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      if (result.comment) {
        onCommentCreated(result.comment);
      }

      setBody('');
      setReplyTo(null);
      setNotice(result.message);
    } catch {
      setError(
        'Your comment could not be sent. Check your connection and try again.'
      );
    } finally {
      setPending(false);
    }
  }

  function handleReply(comment: ReviewComment) {
    setReplyTo(comment);
    setError(null);
    setNotice(null);
    textareaRef.current?.focus();
  }

  async function handleToggle(comment: ReviewComment) {
    if (togglingId || comment.author_id !== currentUserId) {
      return;
    }

    const nextStatus: CommentStatus =
      comment.status === 'OPEN' ? 'RESOLVED' : 'OPEN';

    setTogglingId(comment.id);
    setError(null);
    setNotice(null);

    try {
      const result = await setReviewCommentStatus({
        commentId: comment.id,
        status: nextStatus,
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      if (result.commentStatus) {
        onCommentStatusChange(comment.id, result.commentStatus);
      }

      setNotice(result.message);
    } catch {
      setError(
        'The comment status could not be updated. Check your connection and try again.'
      );
    } finally {
      setTogglingId(null);
    }
  }

  function renderComment(comment: ReviewComment) {
    const author = authorMap.get(comment.author_id);
    const isOwn = comment.author_id === currentUserId;
    const authorName = isOwn
      ? 'You'
      : author?.name?.trim() || 'Reviewer';
    const initials = isOwn
      ? 'ME'
      : getInitials(author?.name ?? null);
    const resolved = comment.status === 'RESOLVED';
    const timestamp =
      comment.timestamp_sec === null
        ? null
        : Number(comment.timestamp_sec);
    const safeCommentTimestamp =
      timestamp !== null && Number.isFinite(timestamp) ? timestamp : null;
    const isToggling = togglingId === comment.id;

    return (
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-semibold text-indigo-700">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-brand-ink">
              {authorName}
            </p>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <time
              dateTime={comment.created_at}
              title={comment.created_at}
              className="text-xs text-slate-400"
            >
              {formatRelativeTime(comment.created_at)}
            </time>
          </div>

          <p className="mt-1.5 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
            {comment.body}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {safeCommentTimestamp !== null ? (
              <button
                type="button"
                onClick={() => onSeek(safeCommentTimestamp)}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                <Clock3 aria-hidden="true" className="h-3 w-3" />
                {formatTimestamp(safeCommentTimestamp)}
              </button>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                General note
              </span>
            )}

            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                resolved
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              )}
            >
              {resolved ? 'Resolved' : 'Open'}
            </span>

            {isOwn ? (
              <button
                type="button"
                onClick={() => handleToggle(comment)}
                disabled={isToggling}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                  resolved
                    ? 'text-emerald-700 hover:bg-emerald-50'
                    : 'text-amber-700 hover:bg-amber-50'
                )}
              >
                {isToggling ? (
                  <Loader2
                    aria-hidden="true"
                    className="h-3 w-3 animate-spin"
                  />
                ) : resolved ? (
                  <RotateCcw aria-hidden="true" className="h-3 w-3" />
                ) : (
                  <CheckCheck aria-hidden="true" className="h-3 w-3" />
                )}
                {resolved ? 'Reopen' : 'Resolve'}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => handleReply(comment)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              <CornerDownRight aria-hidden="true" className="h-3 w-3" />
              Reply
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircle
              aria-hidden="true"
              className="h-4 w-4 text-indigo-600"
            />
            <h2 className="text-base font-semibold tracking-tight text-brand-ink">
              Comments
            </h2>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {comments.length > 0
              ? `${comments.length} ${
                  comments.length === 1 ? 'note' : 'notes'
                } · ${unresolvedCount} open`
              : 'No notes on this version yet.'}
          </p>
        </div>

        {isLive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>
        ) : null}
      </div>

      <div className="border-b border-slate-100 bg-brand-surface p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            {replyTo ? (
              <span className="inline-flex flex-wrap items-center gap-1 text-slate-500">
                <CornerDownRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-indigo-500"
                />
                Replying to
                <span className="font-semibold text-slate-700">
                  {getAuthorName(replyTo)}
                </span>
                at {formatTimestamp(safeTimestamp)}
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="ml-1 font-semibold text-indigo-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  Cancel
                </button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-semibold text-indigo-600">
                <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                Comment at {formatTimestamp(safeTimestamp)}
              </span>
            )}
            <span className="text-slate-400">{body.length}/2000</span>
          </div>

          <Textarea
            ref={textareaRef}
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError(null);
              setNotice(null);
            }}
            placeholder={
              replyTo
                ? 'Write a reply to this note...'
                : 'What should change at this moment?'
            }
            maxLength={2000}
            disabled={pending}
            aria-label={replyTo ? 'Reply to comment' : 'New comment'}
            className="min-h-[88px] bg-white"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs leading-5 text-slate-400">
              Notes stay attached to this draft version.
            </p>
            <Button
              type="submit"
              size="sm"
              disabled={!body.trim() || pending}
              isLoading={pending}
            >
              {pending ? null : (
                <Send aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {replyTo ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </form>

        {error ? (
          <p
            role="alert"
            className="mt-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm leading-6 text-red-700"
          >
            {error}
          </p>
        ) : null}

        {notice ? (
          <p
            role="status"
            className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-700"
          >
            {notice}
          </p>
        ) : null}
      </div>

      {comments.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-brand-ink">
            Start the conversation
          </p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            Pause the draft where something needs attention, then leave the
            first timestamped note.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {groupedComments.roots.map((root) => {
            const children =
              groupedComments.childrenByRoot.get(root.id) ?? [];

            return (
              <li key={root.id} className="px-4 py-4 sm:px-5">
                {renderComment(root)}

                {children.length > 0 ? (
                  <div className="mt-4 space-y-4 border-l-2 border-indigo-100 pl-4">
                    {children.map((child) => (
                      <div key={child.id}>{renderComment(child)}</div>
                    ))}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
