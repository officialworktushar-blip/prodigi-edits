'use client';

import {
  Clapperboard,
  Image as ImageIcon,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { fieldError } from './format';
import type { IdeaValues } from './types';
import type { OrderKind } from '@/types/db';

interface KindOption {
  kind: OrderKind;
  label: string;
  description: string;
  icon: LucideIcon;
}

const KIND_OPTIONS: KindOption[] = [
  {
    kind: 'HORIZONTAL',
    label: 'Horizontal video',
    description: 'Long-form or standard 16:9 edits for YouTube, courses, and web.',
    icon: Clapperboard,
  },
  {
    kind: 'VERTICAL',
    label: 'Vertical short',
    description: 'Fast-paced 9:16 cutdowns for Shorts, Reels, and TikTok.',
    icon: Smartphone,
  },
  {
    kind: 'THUMBNAIL',
    label: 'Thumbnail / cover',
    description: 'A scroll-stopping cover image built around one clear idea.',
    icon: ImageIcon,
  },
];

export interface StepIdeaProps {
  values: IdeaValues;
  errors?: Record<string, string[]>;
  onChange: (patch: Partial<IdeaValues>) => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
      {message}
    </p>
  );
}

export function StepIdea({ values, errors, onChange }: StepIdeaProps) {
  const titleError = fieldError(errors, 'title');
  const briefError = fieldError(errors, 'brief');
  const referenceError = fieldError(errors, 'referenceLinks');
  const kindError = fieldError(errors, 'kind');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
          Tell us what you need
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Start with the shape of the project and the outcome you want. You can
          refine the details with your editor later.
        </p>
      </div>

      <fieldset aria-describedby={kindError ? 'order-kind-error' : undefined}>
        <legend
          id="order-kind-label"
          className="text-sm font-semibold text-brand-ink"
        >
          Project type
        </legend>
        <div
          className="mt-3 grid gap-3 md:grid-cols-3"
          role="radiogroup"
          aria-labelledby="order-kind-label"
        >
          {KIND_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = values.kind === option.kind;

            return (
              <button
                key={option.kind}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onChange({ kind: option.kind })}
                className={cn(
                  'flex h-full flex-col items-start rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                  isSelected
                    ? 'border-brand-indigo bg-indigo-50/70 shadow-soft'
                    : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft'
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    isSelected
                      ? 'bg-white text-indigo-600 shadow-soft'
                      : 'bg-slate-50 text-slate-500'
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="mt-3 text-sm font-semibold text-brand-ink">
                  {option.label}
                </span>
                <span className="mt-1 text-xs leading-5 text-slate-500">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>
        {kindError ? (
          <p id="order-kind-error" className="mt-1.5 text-xs font-medium text-red-600" role="alert">
            {kindError}
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-5">
        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="order-title"
              className="text-sm font-semibold text-brand-ink"
            >
              Order title
            </label>
            <span className="text-[11px] text-slate-400">
              {values.title.length}/140
            </span>
          </div>
          <Input
            id="order-title"
            name="title"
            value={values.title}
            onChange={(event) => onChange({ title: event.target.value })}
            maxLength={140}
            placeholder="Summer launch film"
            aria-invalid={titleError ? true : undefined}
            aria-describedby={titleError ? 'order-title-error' : undefined}
            className="mt-2"
          />
          <FieldError message={titleError} />
          {titleError ? (
            <span id="order-title-error" className="sr-only">
              {titleError}
            </span>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="order-brief"
              className="text-sm font-semibold text-brand-ink"
            >
              Creative brief
            </label>
            <span className="text-[11px] text-slate-400">
              {values.brief.length}/5,000
            </span>
          </div>
          <Textarea
            id="order-brief"
            name="brief"
            value={values.brief}
            onChange={(event) => onChange({ brief: event.target.value })}
            maxLength={5000}
            rows={7}
            placeholder="What is the video for, who is it for, and what should the viewer feel or do? Mention pacing, tone, must-keep moments, and anything to avoid."
            aria-invalid={briefError ? true : undefined}
            aria-describedby={briefError ? 'order-brief-error' : undefined}
            className="mt-2"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            The clearer the brief, the fewer revision rounds you will need.
          </p>
          <FieldError message={briefError} />
          {briefError ? (
            <span id="order-brief-error" className="sr-only">
              {briefError}
            </span>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="order-references"
            className="text-sm font-semibold text-brand-ink"
          >
            Reference links <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <Textarea
            id="order-references"
            name="referenceLinks"
            value={values.referenceLinks}
            onChange={(event) =>
              onChange({ referenceLinks: event.target.value })
            }
            maxLength={2000}
            rows={4}
            placeholder={'One link per line\nhttps://example.com/reference'}
            aria-invalid={referenceError ? true : undefined}
            aria-describedby={referenceError ? 'order-references-error' : undefined}
            className="mt-2"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Add examples of the pacing, graphics, or tone you have in mind.
          </p>
          <FieldError message={referenceError} />
          {referenceError ? (
            <span id="order-references-error" className="sr-only">
              {referenceError}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
