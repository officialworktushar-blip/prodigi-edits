'use client';

import { useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Film,
  MessageSquare,
  Play,
  Send,
  Upload,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { MediaPlaceholder } from '../../shared/media-placeholder';
import { SectionHeading } from '../../shared/section-heading';

interface Step {
  title: string;
  description: string;
  panel: string;
  status: string;
  statusClassName: string;
}

const STEPS: Step[] = [
  {
    title: 'Tell us your idea',
    description:
      'Share the goal, audience, and the feeling you want. We turn it into a clear edit brief.',
    panel: 'Brief workspace',
    status: 'Submitted',
    statusClassName: 'bg-blue-50 text-blue-700',
  },
  {
    title: 'Upload footage',
    description:
      'Drop recordings, music, and brand assets into one secure place. We handle the sorting.',
    panel: 'Footage intake',
    status: 'Uploading',
    statusClassName: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Review and revise',
    description:
      'Watch the first cut, leave timecoded notes, and request changes in a few clicks.',
    panel: 'Review room',
    status: 'In review',
    statusClassName: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Download or publish',
    description:
      'Approve the final cut, download every format, or hand off publishing to us.',
    panel: 'Delivery',
    status: 'Delivered',
    statusClassName: 'bg-emerald-50 text-emerald-700',
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const reduceMotion = useReducedMotion();
  const step = STEPS[activeStep];

  function handleStepKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (index + 1) % STEPS.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + STEPS.length) % STEPS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = STEPS.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    setActiveStep(nextIndex);
    document.getElementById(`how-step-${nextIndex}`)?.focus();
  }

  return (
    <section className="bg-brand-surface">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          headline="From idea to upload in four clear moves"
          highlight="four"
          subcopy="A simple handoff, a visible review loop, and a final delivery you can publish without another edit."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-12">
          <div>
            <div
              role="tablist"
              aria-label="How it works"
              aria-orientation="vertical"
              className="space-y-2"
            >
              {STEPS.map((item, index) => {
                const isActive = index === activeStep;

                return (
                  <button
                    key={item.title}
                    id={`how-step-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="how-it-works-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActiveStep(index)}
                    onKeyDown={(event) => handleStepKeyDown(event, index)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-2xl border px-4 py-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                      isActive
                        ? 'border-brand-indigo/25 bg-white shadow-soft'
                        : 'border-transparent bg-transparent hover:border-slate-200 hover:bg-white/60'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-gradient-to-br from-brand-indigo to-brand-blue text-white'
                          : 'bg-slate-200/80 text-slate-500'
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          'block text-sm font-semibold',
                          isActive ? 'text-brand-ink' : 'text-slate-700'
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-slate-500">
                        {item.description}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className={cn(
                        'mt-1 h-4 w-4 shrink-0 transition-all',
                        isActive
                          ? 'translate-x-0 text-brand-indigo opacity-100'
                          : '-translate-x-1 text-slate-400 opacity-0'
                      )}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Step {activeStep + 1} of {STEPS.length}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {step.panel}
                </p>
              </div>
              <div
                aria-hidden="true"
                className="h-2 w-28 overflow-hidden rounded-full bg-slate-100"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue transition-all duration-300"
                  style={{
                    width: `${((activeStep + 1) / STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeStep}
                id="how-it-works-panel"
                role="tabpanel"
                aria-labelledby={`how-step-${activeStep}`}
                tabIndex={0}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                <StepPreview step={activeStep} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepPreview({ step }: { step: number }) {
  const meta = STEPS[step];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft-lg">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <p className="truncate text-xs font-semibold text-slate-500">
          {meta.panel}
        </p>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
            meta.statusClassName
          )}
        >
          {meta.status}
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {step === 0 ? <BriefPreview /> : null}
        {step === 1 ? <UploadPreview /> : null}
        {step === 2 ? <ReviewPreview /> : null}
        {step === 3 ? <DeliverPreview /> : null}
      </div>
    </div>
  );
}

function BriefPreview() {
  const fields = [
    { label: 'Audience', value: 'Founders and operators' },
    { label: 'Due date', value: 'Friday · 6:00 pm' },
    { label: 'Tone', value: 'Calm, direct, human' },
    { label: 'Footage', value: '3 interviews · 42 min' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold tracking-tight text-brand-ink">
            Launch film — Series A
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Long-form edit · 8 minute target
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
          Brief locked
        </span>
      </div>

      <dl className="grid gap-2 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.label}
            className="rounded-xl border border-slate-200 bg-white p-3"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {field.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-700">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
          Creative direction
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Open on the founder&apos;s answer about why the team started. Keep
          lower thirds minimal and let the product shots breathe.
        </p>
      </div>

      <p className="flex items-center gap-2 text-xs font-medium text-emerald-700">
        <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
        Brief accepted · editor assigned
      </p>
    </div>
  );
}

function UploadPreview() {
  const files = [
    {
      name: 'interview_01.mp4',
      meta: '1.8 GB · scanned',
      progress: 100,
      status: 'Ready',
    },
    {
      name: 'b_roll_launch.zip',
      meta: '6.4 GB · 72% uploaded',
      progress: 72,
      status: 'Uploading',
    },
    {
      name: 'brand_assets.zip',
      meta: '820 MB · scanned',
      progress: 100,
      status: 'Ready',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-base font-semibold tracking-tight text-brand-ink">
            Footage intake
          </p>
          <p className="mt-1 text-sm text-slate-500">
            3 files · 9.0 GB total
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
          Secure upload
        </span>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-soft">
          <Upload aria-hidden="true" className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm font-semibold text-brand-ink">
          Drop footage here
        </p>
        <p className="mt-1 text-xs text-slate-500">
          MP4, MOV, WAV · up to 20 GB
        </p>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.name}
            className="rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Film
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-indigo-500"
                />
                <span className="truncate text-sm font-medium text-slate-700">
                  {file.name}
                </span>
              </div>
              <span
                className={cn(
                  'shrink-0 text-[11px] font-semibold',
                  file.progress === 100
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                )}
              >
                {file.status}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  'h-full rounded-full',
                  file.progress === 100
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-brand-indigo to-brand-blue'
                )}
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">{file.meta}</p>
          </div>
        ))}
      </div>

      <p className="flex items-center gap-2 text-xs font-medium text-emerald-700">
        <Check aria-hidden="true" className="h-4 w-4" />
        Files are scanned and sorted automatically
      </p>
    </div>
  );
}

function ReviewPreview() {
  const segments = [
    { width: '18%', className: 'bg-indigo-400' },
    { width: '26%', className: 'bg-sky-400' },
    { width: '14%', className: 'bg-violet-400' },
    { width: '30%', className: 'bg-indigo-300' },
    { width: '12%', className: 'bg-pink-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold tracking-tight text-brand-ink">
            Brand film — rough cut v2
          </p>
          <p className="mt-1 text-sm text-slate-500">
            7:42 · color pass pending
          </p>
        </div>
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
          Awaiting notes
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <MediaPlaceholder
          aspect="video"
          title="Rough cut v2"
          description="Captions loaded · sound mix in progress"
          icon="play"
          className="rounded-none border-0 shadow-none"
        />
        <div className="flex items-center gap-2 border-t border-slate-200 bg-slate-900 px-3 py-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white">
            <Play aria-hidden="true" className="h-3 w-3 fill-current" />
          </span>
          <div className="flex flex-1 items-center gap-1">
            {segments.map((segment, index) => (
              <span
                key={index}
                className={cn('h-1.5 rounded-full', segment.className)}
                style={{ width: segment.width }}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-slate-300">7:42</span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex gap-2">
          <MessageSquare
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500"
          />
          <div>
            <p className="text-xs font-semibold text-slate-500">Editor note</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              &ldquo;Tighten the opening by four seconds, then hold the logo a
              beat longer.&rdquo;
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2 text-xs font-medium text-emerald-700">
          <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
          2 comments resolved
        </div>
      </div>
    </div>
  );
}

function DeliverPreview() {
  const files = [
    { name: 'brand_film_4k.mp4', meta: '2.1 GB · 16:9' },
    { name: 'brand_film_vertical.mp4', meta: '840 MB · 9:16' },
    { name: 'captions_en.srt', meta: '24 KB · English' },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-600 shadow-soft">
          <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
        </span>
        <p className="mt-3 text-base font-semibold text-emerald-900">
          Approved and delivered
        </p>
        <p className="mt-1 text-sm text-emerald-700">
          Final files are ready in every format you need.
        </p>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <FileText
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-indigo-500"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-700">
                  {file.name}
                </p>
                <p className="text-[11px] text-slate-400">{file.meta}</p>
              </div>
            </div>
            <Download
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-slate-400"
            />
          </div>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <span className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-4 py-2.5 text-sm font-semibold text-white shadow-soft">
          <Download aria-hidden="true" className="h-4 w-4" />
          Download all
        </span>
        <span className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
          <Send aria-hidden="true" className="h-4 w-4" />
          Publish to channel
        </span>
      </div>
    </div>
  );
}
