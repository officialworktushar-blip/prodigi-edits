'use client';

import type { RefObject } from 'react';
import { Clock3, Film, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimestamp } from './format';
import type { ReviewDraft } from './types';

export interface ReviewPlayerProps {
  drafts: ReviewDraft[];
  activeDraftId: string;
  currentTime: number;
  duration: number;
  onSelectDraft: (draftId: string) => void;
  onTimeChange: (seconds: number) => void;
  onDurationChange: (seconds: number) => void;
  videoRef: RefObject<HTMLVideoElement>;
}

export function ReviewPlayer({
  drafts,
  activeDraftId,
  currentTime,
  duration,
  onSelectDraft,
  onTimeChange,
  onDurationChange,
  videoRef,
}: ReviewPlayerProps) {
  const activeDraft =
    drafts.find((draft) => draft.id === activeDraftId) ??
    drafts[drafts.length - 1] ??
    null;

  if (!activeDraft) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Film aria-hidden="true" className="h-4 w-4 text-indigo-600" />
            <h2 className="text-base font-semibold tracking-tight text-brand-ink">
              Draft review
            </h2>
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Watch the latest cut, leave notes at the exact moment, and approve
            when it feels right.
          </p>
          {activeDraft.note?.trim() ? (
            <p className="mt-2 break-words rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
              {activeDraft.note}
            </p>
          ) : null}
        </div>

        <div
          role="group"
          aria-label="Draft versions"
          className="flex max-w-full flex-wrap items-center gap-1 rounded-full bg-slate-100 p-1"
        >
          {drafts.map((draft) => {
            const active = draft.id === activeDraft.id;

            return (
              <button
                key={draft.id}
                type="button"
                onClick={() => onSelectDraft(draft.id)}
                aria-pressed={active}
                aria-label={`View version ${draft.version}`}
                className={cn(
                  'inline-flex h-8 min-w-10 items-center justify-center rounded-full px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                  active
                    ? 'bg-white text-brand-ink shadow-soft'
                    : 'text-slate-500 hover:text-slate-800'
                )}
              >
                v{draft.version}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative bg-slate-950">
        {activeDraft.videoUrl ? (
          <video
            key={activeDraft.id}
            ref={videoRef}
            src={activeDraft.videoUrl}
            poster={activeDraft.thumbnailUrl ?? undefined}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            className="aspect-video w-full bg-slate-950"
            onLoadedMetadata={(event) => {
              const nextDuration = event.currentTarget.duration;
              onDurationChange(
                Number.isFinite(nextDuration) ? nextDuration : 0
              );
            }}
            onDurationChange={(event) => {
              const nextDuration = event.currentTarget.duration;
              onDurationChange(
                Number.isFinite(nextDuration) ? nextDuration : 0
              );
            }}
            onTimeUpdate={(event) => {
              onTimeChange(event.currentTarget.currentTime);
            }}
            onSeeked={(event) => {
              onTimeChange(event.currentTarget.currentTime);
            }}
          />
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 px-6 text-center text-slate-300">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Film aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="text-sm font-semibold text-white">
              This version has no playable file yet.
            </p>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Choose another version above or check back after the upload
              finishes processing.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-100 bg-brand-surface px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
          <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
          {formatTimestamp(currentTime)}
          {duration > 0 ? ` / ${formatTimestamp(duration)}` : ''}
        </span>
        <span className="inline-flex items-start gap-1.5 leading-5 text-slate-400">
          <Lock
            aria-hidden="true"
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
          />
          Private review link. It expires after one hour, so reload for a fresh
          one.
        </span>
      </div>
    </section>
  );
}
