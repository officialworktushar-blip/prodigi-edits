import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export type PageHeroTone = 'light' | 'dark';

export interface PageHeroAction {
  label: string;
  href: string;
}

export interface PageHeroMockupClip {
  label: string;
  from: string;
  to: string;
}

export interface PageHeroMockupSegment {
  label: string;
  width: string;
  color: string;
}

export interface PageHeroMockup {
  windowTitle?: string;
  toolbarLabel?: string;
  toolbarItems?: string[];
  status?: string;
  railLabel?: string;
  clips?: PageHeroMockupClip[];
  activeClipIndex?: number;
  canvasLabel?: string;
  canvasCaption?: string;
  popoverTitle?: string;
  swatches?: string[];
  timelineLabel?: string;
  timelineSegments?: PageHeroMockupSegment[];
}

export interface PageHeroPill {
  label: string;
  href?: string;
}

export interface PageHeroProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  primaryAction?: PageHeroAction;
  secondaryAction?: PageHeroAction;
  mockup?: PageHeroMockup;
  pill?: PageHeroPill | null;
  tone?: PageHeroTone;
  children?: ReactNode;
  className?: string;
}

const DEFAULT_CLIPS: PageHeroMockupClip[] = [
  { label: 'Hook', from: '#38bdf8', to: '#6366f1' },
  { label: 'Story', from: '#a78bfa', to: '#ec4899' },
  { label: 'Proof', from: '#fbbf24', to: '#fb7185' },
  { label: 'Close', from: '#2dd4bf', to: '#3b82f6' },
];

const DEFAULT_SEGMENTS: PageHeroMockupSegment[] = [
  { label: 'Intro', width: '22%', color: '#38bdf8' },
  { label: 'Main cut', width: '46%', color: '#a78bfa' },
  { label: 'B-roll', width: '20%', color: '#f472b6' },
  { label: 'Outro', width: '12%', color: '#fbbf24' },
];

const DEFAULT_SWATCHES = ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'];

const DEFAULT_PILL: PageHeroPill = {
  label: 'Explore features that match your needs',
  href: '/platform',
};

function renderTitle(title: string, highlight?: string, isDark = true) {
  const highlightClass = isDark
    ? 'text-gradient-hero animate-text-shimmer'
    : 'text-gradient';
  const target = highlight?.trim();

  if (target) {
    const index = title.indexOf(target);

    if (index >= 0) {
      return (
        <>
          {title.slice(0, index)}
          <span className={highlightClass}>{target}</span>
          {title.slice(index + target.length)}
        </>
      );
    }
  }

  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return <span className={highlightClass}>{title}</span>;
  }

  const accent = words.slice(-2).join(' ');
  const leading = words.slice(0, -2).join(' ');

  return (
    <>
      {leading}{' '}
      <span className={highlightClass}>{accent}</span>
    </>
  );
}

function HeroAvatarStack() {
  return (
    <svg viewBox="0 0 76 34" aria-hidden="true" className="h-7 w-[68px]">
      <circle cx="17" cy="17" r="14" fill="#e0f2fe" />
      <circle cx="17" cy="15" r="5" fill="#0ea5e9" />
      <path d="M8 27c1.8-5.8 5.2-8.5 9-8.5s7.2 2.7 9 8.5" fill="#0ea5e9" />
      <circle cx="38" cy="17" r="14" fill="#ede9fe" stroke="#fbfcff" strokeWidth="2" />
      <circle cx="38" cy="15" r="5" fill="#8b5cf6" />
      <path d="M29 27c1.8-5.8 5.2-8.5 9-8.5s7.2 2.7 9 8.5" fill="#8b5cf6" />
      <circle cx="59" cy="17" r="14" fill="#fce7f3" stroke="#fbfcff" strokeWidth="2" />
      <circle cx="59" cy="15" r="5" fill="#ec4899" />
      <path d="M50 27c1.8-5.8 5.2-8.5 9-8.5s7.2 2.7 9 8.5" fill="#ec4899" />
    </svg>
  );
}

function ProductMockup({ mockup }: { mockup: PageHeroMockup }) {
  const clips = (mockup.clips ?? DEFAULT_CLIPS).slice(0, 4);
  const activeClip = mockup.activeClipIndex ?? 1;
  const swatches = mockup.swatches ?? DEFAULT_SWATCHES;
  const segments = mockup.timelineSegments ?? DEFAULT_SEGMENTS;
  const toolbarItems = mockup.toolbarItems ?? ['File', 'Edit', 'View', 'Export'];

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-300/30 via-violet-300/25 to-pink-300/30 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.65)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="min-w-0 text-center">
            <p className="truncate text-[11px] font-semibold text-white/90">
              {mockup.windowTitle ?? 'Launch film — edit 04'}
            </p>
            <p className="truncate text-[10px] text-white/40">
              {mockup.toolbarLabel ?? 'Sequence 01 · 4K · 24 fps'}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-sky-200">
            {mockup.status ?? 'Live'}
          </span>
        </div>

        <div className="flex items-center gap-4 border-b border-white/10 px-4 py-2 text-[10px] font-medium text-white/45">
          {toolbarItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
          <span className="ml-auto rounded-md bg-white/10 px-2 py-1 text-white/70">
            Share
          </span>
        </div>

        <div className="grid grid-cols-[64px_1fr] gap-3 p-3 sm:grid-cols-[76px_1fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
            <p className="mb-2 truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
              {mockup.railLabel ?? 'Clips'}
            </p>
            <div className="space-y-2">
              {clips.map((clip, index) => {
                const active = index === activeClip;
                const gradientId = `pe-hero-clip-${index}`;

                return (
                  <div key={`${clip.label}-${index}`} className="space-y-1">
                    <div
                      className={cn(
                        'overflow-hidden rounded-md border-2 transition',
                        active ? 'border-sky-400' : 'border-transparent'
                      )}
                    >
                      <svg viewBox="0 0 64 38" aria-hidden="true" className="block h-auto w-full">
                        <defs>
                          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor={clip.from} />
                            <stop offset="100%" stopColor={clip.to} />
                          </linearGradient>
                        </defs>
                        <rect width="64" height="38" fill={`url(#${gradientId})`} />
                        <rect y="22" width="64" height="16" fill="#0f172a" fillOpacity="0.24" />
                        <circle cx="32" cy="19" r="7" fill="#ffffff" fillOpacity="0.85" />
                        <path d="M30 15.5v7l6-3.5z" fill="#0f172a" />
                      </svg>
                    </div>
                    <p
                      className={cn(
                        'truncate text-[9px]',
                        active ? 'font-semibold text-white/80' : 'text-white/35'
                      )}
                    >
                      {clip.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="min-w-0">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-3">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.18),transparent_45%)]" />

              <div className="relative flex aspect-[16/10] flex-col justify-end rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="absolute left-3 top-3 h-2 w-20 rounded-full bg-white/15" />
                <div className="absolute left-3 top-7 h-2 w-14 rounded-full bg-white/10" />
                <div className="absolute right-3 top-3 h-12 w-16 rounded-lg border border-white/10 bg-white/5" />

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200/80">
                  {mockup.canvasLabel ?? 'Main canvas'}
                </p>
                <p className="mt-1 max-w-[16rem] text-sm font-semibold leading-5 text-white">
                  {mockup.canvasCaption ?? 'Story-first cut with clean captions'}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-16 rounded-full bg-sky-400/80" />
                  <span className="h-1.5 w-9 rounded-full bg-violet-400/70" />
                  <span className="h-1.5 w-5 rounded-full bg-pink-400/60" />
                </div>
              </div>

              <div className="absolute right-2 top-9 w-28 rounded-xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-xl backdrop-blur sm:right-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  {mockup.popoverTitle ?? 'Brand colors'}
                </p>
                <div className="mt-2 grid grid-cols-5 gap-1">
                  {swatches.slice(0, 10).map((swatch, index) => (
                    <span
                      key={`${swatch}-${index}`}
                      className={cn(
                        'h-3.5 w-3.5 rounded-full ring-offset-1 ring-offset-slate-900',
                        index === 0 ? 'ring-2 ring-white' : ''
                      )}
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                </div>
              </div>

              <div
                aria-hidden="true"
                className="animate-cursor-move absolute bottom-[34%] left-[52%] z-10"
              >
                <svg viewBox="0 0 24 32" className="h-7 w-5 drop-shadow-lg">
                  <path
                    d="M2 2l18 13-8 1.5 4.5 9-4 2-4.5-9L2 24z"
                    fill="#ffffff"
                    stroke="#0f172a"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="absolute left-4 top-5 rounded-full bg-violet-600 px-1.5 py-0.5 text-[8px] font-semibold text-white">
                  You
                </span>
              </div>
            </div>

            <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">
              <div className="flex items-center justify-between text-[9px] text-white/40">
                <span>{mockup.timelineLabel ?? 'Timeline'}</span>
                <span>00:42 / 01:18</span>
              </div>
              <div className="mt-1.5 flex h-3 overflow-hidden rounded-full bg-white/10">
                {segments.map((segment, index) => (
                  <span
                    key={`${segment.label}-${index}`}
                    className="h-full border-r border-[#0b1220] last:border-r-0"
                    style={{ width: segment.width, backgroundColor: segment.color }}
                    title={segment.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  description,
  primaryAction,
  secondaryAction,
  mockup,
  pill = DEFAULT_PILL,
  tone = 'light',
  children,
  className,
}: PageHeroProps) {
  const isDark = tone === 'dark';

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden',
        isDark ? 'bg-hero-dark text-white' : 'bg-[#fbfcff] text-brand-ink',
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl',
          isDark ? 'bg-violet-600/25' : 'bg-sky-300/45'
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute left-1/3 top-10 h-80 w-80 rounded-full blur-3xl',
          isDark ? 'bg-sky-600/20' : 'bg-violet-300/40'
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full blur-3xl',
          isDark ? 'bg-pink-600/20' : 'bg-pink-300/40'
        )}
      />

      <div className="relative mx-auto max-w-screen-1200 px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p
                className={cn(
                  'animate-hero-fade-up text-xs font-semibold uppercase tracking-[0.2em]',
                  isDark ? 'text-sky-300' : 'text-violet-600'
                )}
                style={{ animationDelay: '0.04s' }}
              >
                {eyebrow}
              </p>
            ) : null}

            <h1
              className={cn(
                'animate-hero-fade-up mt-4 text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-5xl lg:text-[3.65rem]',
                eyebrow ? '' : 'mt-0',
                isDark ? 'text-white' : 'text-brand-ink'
              )}
              style={{ animationDelay: '0.1s' }}
            >
              {renderTitle(title, highlight, isDark)}
            </h1>

            {description ? (
              <p
                className={cn(
                  'animate-hero-fade-up mt-5 max-w-xl text-base leading-7 sm:text-lg',
                  isDark ? 'text-slate-200/85' : 'text-slate-600'
                )}
                style={{ animationDelay: '0.18s' }}
              >
                {description}
              </p>
            ) : null}

            {primaryAction || secondaryAction ? (
              <div
                className="animate-hero-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
                style={{ animationDelay: '0.26s' }}
              >
                {primaryAction ? (
                  <Link href={primaryAction.href} className="btn-cyan">
                    {primaryAction.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                ) : null}
                {secondaryAction ? (
                  <Link
                    href={secondaryAction.href}
                    className={cn(
                      'inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                      isDark
                        ? 'btn-outline-light'
                        : 'border border-slate-900/80 text-slate-900 hover:bg-slate-50 focus-visible:ring-brand-indigo'
                    )}
                  >
                    {secondaryAction.label}
                  </Link>
                ) : null}
              </div>
            ) : null}

            {children ? (
              <div
                className="animate-hero-fade-up mt-6"
                style={{ animationDelay: '0.32s' }}
              >
                {children}
              </div>
            ) : null}
          </div>

          <div
            className="animate-hero-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            <ProductMockup mockup={mockup ?? {}} />
          </div>
        </div>

        {pill ? (
          <div className="mt-12 flex justify-center sm:mt-14">
            <div
              className={cn(
                'inline-flex items-center gap-3 rounded-full border px-3 py-2 shadow-soft backdrop-blur',
                isDark
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-slate-200 bg-white/90 text-brand-ink'
              )}
            >
              <HeroAvatarStack />
              <span className="text-xs font-semibold sm:text-sm">
                {pill.label}
              </span>
              {pill.href ? (
                <Link
                  href={pill.href}
                  aria-label={pill.label}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
                >
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
