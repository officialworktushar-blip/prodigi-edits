'use client';

import { Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReviewComment } from '@/types/db';
import { formatTimestamp } from './format';

interface TimelineMarker {
  id: string;
  time: number;
  status: ReviewComment['status'];
}

export interface TimelineMarkersProps {
  comments: ReviewComment[];
  duration: number;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

export function TimelineMarkers({
  comments,
  duration,
  currentTime,
  onSeek,
}: TimelineMarkersProps) {
  const safeDuration =
    Number.isFinite(duration) && duration > 0 ? duration : 0;
  const markerMap = new Map<number, TimelineMarker>();

  for (const comment of comments) {
    if (comment.timestamp_sec === null) {
      continue;
    }

    const timestamp = Number(comment.timestamp_sec);

    if (!Number.isFinite(timestamp) || timestamp < 0) {
      continue;
    }

    const rounded = Math.round(timestamp * 10) / 10;

    if (!markerMap.has(rounded)) {
      markerMap.set(rounded, {
        id: comment.id,
        time: timestamp,
        status: comment.status,
      });
    }
  }

  const markers = Array.from(markerMap.values()).sort(
    (a, b) => a.time - b.time
  );
  const playheadPosition =
    safeDuration > 0
      ? Math.min(100, Math.max(0, (currentTime / safeDuration) * 100))
      : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock3 aria-hidden="true" className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-semibold tracking-tight text-brand-ink">
            Timeline notes
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          {markers.length > 0
            ? `${markers.length} timestamped ${
                markers.length === 1 ? 'note' : 'notes'
              }`
            : 'No timestamped notes yet'}
        </p>
      </div>

      {safeDuration > 0 ? (
        <div className="mt-5">
          <div className="relative h-8">
            <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-100"
                style={{ width: `${playheadPosition}%` }}
              />
            </div>

            <div
              aria-hidden="true"
              className="absolute top-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-ink"
              style={{ left: `${playheadPosition}%` }}
            />

            {markers.map((marker) => {
              const position = Math.min(
                100,
                Math.max(0, (marker.time / safeDuration) * 100)
              );

              return (
                <button
                  key={marker.id}
                  type="button"
                  onClick={() => onSeek(marker.time)}
                  title={`Jump to ${formatTimestamp(marker.time)} · ${
                    marker.status === 'RESOLVED' ? 'Resolved' : 'Open'
                  } note`}
                  aria-label={`Jump to ${
                    marker.status === 'RESOLVED' ? 'resolved' : 'open'
                  } note at ${formatTimestamp(marker.time)}`}
                  className="group absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                  style={{ left: `${position}%` }}
                >
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full ring-2 ring-white transition-transform group-hover:scale-125',
                      marker.status === 'RESOLVED'
                        ? 'bg-emerald-500'
                        : 'bg-indigo-600'
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>0:00</span>
            <span>{formatTimestamp(safeDuration)}</span>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Timeline markers appear once the selected draft finishes loading.
        </div>
      )}
    </section>
  );
}
