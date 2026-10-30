'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { EmptyState } from '@/components/shared/empty-state';
import type {
  CommentStatus,
  OrderStatus,
  ReviewComment,
} from '@/types/db';
import { CommentPanel } from './comment-panel';
import { ReviewActions } from './review-actions';
import { ReviewPlayer } from './review-player';
import { TimelineMarkers } from './timeline-markers';
import { useReviewCommentsRealtime } from './use-review-comments';
import type { ReviewAuthor, ReviewDraft } from './types';

function pickInitialDraftId(drafts: ReviewDraft[]): string {
  const ordered = [...drafts].sort((a, b) => a.version - b.version);

  for (let index = ordered.length - 1; index >= 0; index -= 1) {
    if (ordered[index].videoUrl) {
      return ordered[index].id;
    }
  }

  return ordered[ordered.length - 1]?.id ?? '';
}

export interface ReviewWorkspaceProps {
  orderId: string;
  orderStatus: OrderStatus;
  drafts: ReviewDraft[];
  comments: ReviewComment[];
  authors: ReviewAuthor[];
  currentUserId: string;
}

export function ReviewWorkspace({
  orderId,
  orderStatus,
  drafts,
  comments: initialComments,
  authors,
  currentUserId,
}: ReviewWorkspaceProps) {
  const sortedDrafts = useMemo(
    () => [...drafts].sort((a, b) => a.version - b.version),
    [drafts]
  );
  const [selectedDraftId, setSelectedDraftId] = useState(() =>
    pickInitialDraftId(drafts)
  );
  const [comments, setComments] = useState<ReviewComment[]>(
    initialComments
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sortedDrafts.length === 0) {
      if (selectedDraftId) {
        setSelectedDraftId('');
      }

      return;
    }

    if (!sortedDrafts.some((draft) => draft.id === selectedDraftId)) {
      setSelectedDraftId(pickInitialDraftId(sortedDrafts));
    }
  }, [selectedDraftId, sortedDrafts]);

  useEffect(() => {
    setComments((previous) => {
      const byId = new Map(
        previous.map((comment) => [comment.id, comment])
      );
      let changed = false;

      for (const comment of initialComments) {
        if (!byId.has(comment.id)) {
          byId.set(comment.id, comment);
          changed = true;
        }
      }

      return changed ? Array.from(byId.values()) : previous;
    });
  }, [initialComments]);

  const mergeComment = useCallback((comment: ReviewComment) => {
    setComments((previous) =>
      previous.some((item) => item.id === comment.id)
        ? previous
        : [...previous, comment]
    );
  }, []);

  const updateCommentStatus = useCallback(
    (commentId: string, status: CommentStatus) => {
      setComments((previous) =>
        previous.map((comment) =>
          comment.id === commentId ? { ...comment, status } : comment
        )
      );
    },
    []
  );

  const activeDraft =
    sortedDrafts.find((draft) => draft.id === selectedDraftId) ??
    sortedDrafts[sortedDrafts.length - 1] ??
    null;
  const activeDraftId = activeDraft?.id ?? null;
  const isLive = useReviewCommentsRealtime({
    draftId: activeDraftId,
    onInsert: mergeComment,
  });

  const draftComments = useMemo(
    () =>
      comments.filter((comment) => comment.draft_id === activeDraftId),
    [activeDraftId, comments]
  );

  const handleTimeChange = useCallback((seconds: number) => {
    if (Number.isFinite(seconds)) {
      setCurrentTime(Math.max(0, seconds));
    }
  }, []);

  const handleDurationChange = useCallback((seconds: number) => {
    setDuration(Number.isFinite(seconds) && seconds > 0 ? seconds : 0);
  }, []);

  const handleSeek = useCallback((seconds: number) => {
    const safeSeconds = Number.isFinite(seconds)
      ? Math.max(0, seconds)
      : 0;

    setCurrentTime(safeSeconds);

    if (videoRef.current) {
      try {
        videoRef.current.currentTime = safeSeconds;
      } catch {
        return;
      }
    }
  }, []);

  const handleSelectDraft = useCallback((draftId: string) => {
    setSelectedDraftId(draftId);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  if (!activeDraft) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-soft">
        <EmptyState
          icon="video"
          title="No draft to review yet"
          description="Draft versions will appear here when the first cut is ready for your feedback."
        />
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <ReviewPlayer
        drafts={sortedDrafts}
        activeDraftId={activeDraft.id}
        currentTime={currentTime}
        duration={duration}
        onSelectDraft={handleSelectDraft}
        onTimeChange={handleTimeChange}
        onDurationChange={handleDurationChange}
        videoRef={videoRef}
      />

      <TimelineMarkers
        comments={draftComments}
        duration={duration}
        currentTime={currentTime}
        onSeek={handleSeek}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <CommentPanel
          orderId={orderId}
          draftId={activeDraft.id}
          comments={draftComments}
          currentTime={currentTime}
          currentUserId={currentUserId}
          authors={authors}
          isLive={isLive}
          onSeek={handleSeek}
          onCommentCreated={mergeComment}
          onCommentStatusChange={updateCommentStatus}
        />

        <div className="lg:sticky lg:top-6 lg:self-start">
          <ReviewActions orderId={orderId} orderStatus={orderStatus} />
        </div>
      </div>
    </div>
  );
}
