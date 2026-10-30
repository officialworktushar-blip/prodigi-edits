'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ReviewComment } from '@/types/db';

interface UseReviewCommentsRealtimeOptions {
  draftId: string | null;
  onInsert: (comment: ReviewComment) => void;
}

export function useReviewCommentsRealtime({
  draftId,
  onInsert,
}: UseReviewCommentsRealtimeOptions): boolean {
  const [isLive, setIsLive] = useState(false);
  const onInsertRef = useRef(onInsert);

  useEffect(() => {
    onInsertRef.current = onInsert;
  }, [onInsert]);

  useEffect(() => {
    setIsLive(false);

    if (!draftId) {
      return;
    }

    let active = true;
    let client: ReturnType<typeof createClient> | null = null;

    try {
      client = createClient();
    } catch {
      return;
    }

    if (!client) {
      return;
    }

    const activeClient = client;
    const channel = activeClient
      .channel(
        `review-comments-${draftId}-${Math.random().toString(36).slice(2)}`
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'review_comments',
          filter: `draft_id=eq.${draftId}`,
        },
        (payload) => {
          if (!active) {
            return;
          }

          const row = payload.new as Partial<ReviewComment> | null;

          if (!row) {
            return;
          }

          const id = row.id;
          const rowDraftId = row.draft_id;
          const authorId = row.author_id;
          const body = row.body;
          const createdAt = row.created_at;
          const status =
            row.status === 'OPEN' || row.status === 'RESOLVED'
              ? row.status
              : null;

          if (
            typeof id !== 'string' ||
            typeof rowDraftId !== 'string' ||
            typeof authorId !== 'string' ||
            typeof body !== 'string' ||
            typeof createdAt !== 'string' ||
            status === null
          ) {
            return;
          }

          const rawTimestamp = row.timestamp_sec;
          const timestamp =
            rawTimestamp === null || rawTimestamp === undefined
              ? null
              : Number(rawTimestamp);
          const parentId =
            typeof row.parent_id === 'string' ? row.parent_id : null;

          onInsertRef.current({
            id,
            draft_id: rowDraftId,
            author_id: authorId,
            timestamp_sec:
              timestamp !== null && Number.isFinite(timestamp)
                ? timestamp
                : null,
            body,
            status,
            parent_id: parentId,
            created_at: createdAt,
          });
        }
      )
      .subscribe((status) => {
        if (!active) {
          return;
        }

        if (status === 'SUBSCRIBED') {
          setIsLive(true);
          return;
        }

        if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED'
        ) {
          setIsLive(false);
        }
      });

    return () => {
      active = false;
      void activeClient.removeChannel(channel);
    };
  }, [draftId]);

  return isLive;
}
