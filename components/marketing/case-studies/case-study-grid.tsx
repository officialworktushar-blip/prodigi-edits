import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import type { CaseStudy } from '@/types/db';
import { FadeIn } from '@/components/shared/fade-in';

const FALLBACK_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'fallback-daily-uploads',
    slug: 'daily-uploads-without-a-team',
    title: 'Daily uploads without a team',
    summary:
      'How a solo creator tripled output while keeping every cut on brand.',
    body: null,
    is_published: true,
    created_at: '',
  },
  {
    id: 'fallback-launch-week',
    slug: 'launch-week-without-the-scramble',
    title: 'Launch week without the scramble',
    summary:
      'A product team shipped nine launch assets in four days with one shared workspace.',
    body: null,
    is_published: true,
    created_at: '',
  },
  {
    id: 'fallback-podcast-show',
    slug: 'a-podcast-that-sounds-like-a-show',
    title: 'A podcast that sounds like a show',
    summary:
      'Long recordings became polished episodes with a consistent sonic identity.',
    body: null,
    is_published: true,
    created_at: '',
  },
];

const COVER_COLORS = [
  {
    from: '#7dd3fc',
    via: '#6366f1',
    to: '#312e81',
    accent: '#f9a8d4',
  },
  {
    from: '#f9a8d4',
    via: '#a855f7',
    to: '#4c1d95',
    accent: '#fde68a',
  },
  {
    from: '#99f6e4',
    via: '#0ea5e9',
    to: '#1e3a8a',
    accent: '#c4b5fd',
  },
] as const;

function formatDate(value: string) {
  if (!value) {
    return 'Published story';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Published story';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function CaseStudyCover({
  title,
  index,
}: {
  title: string;
  index: number;
}) {
  const colors = COVER_COLORS[index % COVER_COLORS.length];
  const gradientId = `case-cover-gradient-${index}`;

  return (
    <div
      role="img"
      aria-label={`Abstract cover for ${title}`}
      className="relative aspect-[21/9] overflow-hidden"
    >
      <svg
        viewBox="0 0 420 180"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.from} />
            <stop offset="52%" stopColor={colors.via} />
            <stop offset="100%" stopColor={colors.to} />
          </linearGradient>
        </defs>
        <rect width="420" height="180" fill={`url(#${gradientId})`} />
        <circle
          cx={index === 1 ? 330 : 80}
          cy="42"
          r="76"
          fill="#ffffff"
          fillOpacity="0.12"
        />
        <circle
          cx={index === 2 ? 350 : 300}
          cy="158"
          r="94"
          fill="#0f172a"
          fillOpacity="0.16"
        />
        <rect
          x="36"
          y="30"
          width="170"
          height="10"
          rx="5"
          fill="#ffffff"
          fillOpacity="0.74"
        />
        <rect
          x="36"
          y="52"
          width="116"
          height="7"
          rx="3.5"
          fill="#ffffff"
          fillOpacity="0.4"
        />
        <rect
          x="36"
          y="114"
          width="92"
          height="7"
          rx="3.5"
          fill="#ffffff"
          fillOpacity="0.48"
        />
        <rect
          x="36"
          y="128"
          width="142"
          height="7"
          rx="3.5"
          fill="#ffffff"
          fillOpacity="0.28"
        />
        <circle cx="350" cy="118" r="18" fill={colors.accent} fillOpacity="0.9" />
        <path
          d="M346 109l14 9-14 9z"
          fill="#ffffff"
          fillOpacity="0.92"
        />
      </svg>

      <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
          <BookOpen aria-hidden="true" className="h-3 w-3" />
          Case study
        </span>
        <span className="rounded-full bg-slate-950/25 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
          Project story
        </span>
      </div>
    </div>
  );
}

export interface CaseStudyGridProps {
  caseStudies?: CaseStudy[];
}

export function CaseStudyGrid({ caseStudies = [] }: CaseStudyGridProps) {
  const safeCaseStudies =
    caseStudies.length > 0
      ? caseStudies.slice(0, 3)
      : FALLBACK_CASE_STUDIES;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Published stories
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
              Three projects, three clear handoffs
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Each story starts with a real constraint and ends with a package
              that was ready to publish.
            </p>
          </div>
          <Link
            href="/examples"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
          >
            Browse format examples
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {safeCaseStudies.map((caseStudy, index) => (
            <FadeIn
              key={caseStudy.id}
              delay={index * 0.04}
              className="h-full"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg">
                <CaseStudyCover title={caseStudy.title} index={index} />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                    {formatDate(caseStudy.created_at)}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-brand-ink">
                    {caseStudy.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                    {caseStudy.summary ??
                      'A recent project built around a clear brief, a focused review loop, and a publish-ready finish.'}
                  </p>
                  <Link
                    href={`/case-studies/${caseStudy.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                  >
                    Read the story
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
