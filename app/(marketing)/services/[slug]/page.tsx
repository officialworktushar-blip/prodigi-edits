import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, Film, Megaphone, Smartphone } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import {
  SERVICE_PAGE_DATA,
  getServicePage,
} from '@/lib/data/services';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { FadeIn } from '@/components/shared/fade-in';
import { MediaPlaceholder } from '@/components/shared/media-placeholder';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';

type ServiceSlug = keyof typeof SERVICE_PAGE_DATA;

interface ServiceContent {
  introTitle: string;
  intro: string;
  outcomes: string[];
  deliverables: { title: string; description: string }[];
  process: { title: string; description: string }[];
  bestFor: string[];
  previewIcon: string;
  previewTitle: string;
}

const SERVICE_CONTENT: Record<ServiceSlug, ServiceContent> = {
  'long-form': {
    introTitle: 'The first minute has to earn the next ten',
    intro:
      'Long-form editing is not a trim pass. We find the argument inside the footage, remove the detours, and build a pace that holds attention without cutting the substance.',
    outcomes: [
      'A clear story spine from opening to close',
      'Pacing that respects context and retention',
      'Captions, color, and sound finished together',
    ],
    deliverables: [
      {
        title: 'Story map and paper edit',
        description:
          'We read the transcript, mark the strongest turns, and agree on the spine before the timeline gets complicated.',
      },
      {
        title: 'Assembly and rough cut',
        description:
          'The first cut tests structure, not polish. You see the argument early enough to change it without wasting a week.',
      },
      {
        title: 'Picture lock and finish',
        description:
          'Once the story holds, we layer in color, dialogue cleanup, music, captions, and the export versions you need.',
      },
    ],
    process: [
      {
        title: 'Send the brief',
        description:
          'Share the footage, the audience, and the one idea the video has to leave behind.',
      },
      {
        title: 'We build the story map',
        description:
          'A paper edit and rough structure arrive before the full cut, so changes stay cheap.',
      },
      {
        title: 'Review the first cut',
        description:
          'Leave timecoded notes on structure, pacing, and anything that feels unclear.',
      },
      {
        title: 'Finish and deliver',
        description:
          'We close notes, finish the mix and grade, and hand over the master plus platform exports.',
      },
    ],
    bestFor: [
      'Documentary-style creators',
      'Founder stories and interviews',
      'Podcasters publishing video',
    ],
    previewIcon: 'film',
    previewTitle: 'Story-led long-form',
  },
  'short-form': {
    introTitle: 'A short clip still needs a reason to exist',
    intro:
      'A vertical edit is not a long video with the sides cropped off. We isolate a complete thought, build a hook around it, and make the first three seconds do real work.',
    outcomes: [
      'Clips that make sense without the full episode',
      'A repeatable caption and crop style',
      'Batches delivered ready for each platform',
    ],
    deliverables: [
      {
        title: 'Moment selection',
        description:
          'We pull the moments with a clear beginning, a useful point, and a reason to keep watching.',
      },
      {
        title: 'Hook and pacing',
        description:
          'The opening frame, first line, and cut rhythm are built together instead of patched on at the end.',
      },
      {
        title: 'Caption and crop system',
        description:
          'Readable captions, safe-zone framing, and consistent type make every clip feel like the same channel.',
      },
    ],
    process: [
      {
        title: 'Drop the source',
        description:
          'Send the long recording, the target platforms, and any brand or caption notes.',
      },
      {
        title: 'We choose the moments',
        description:
          'You get a short list of clips with a hook direction before the full edit begins.',
      },
      {
        title: 'Review and refine',
        description:
          'Comment on hooks, pace, captions, and framing in one pass instead of scattered messages.',
      },
      {
        title: 'Export in batches',
        description:
          'Receive each clip in the ratios and formats your publishing schedule requires.',
      },
    ],
    bestFor: [
      'YouTubers repurposing long uploads',
      'Course creators making teasers',
      'Brands running paid social',
    ],
    previewIcon: 'play',
    previewTitle: 'Hook-first short-form',
  },
  'channel-management': {
    introTitle: 'Consistency is a system, not a sprint',
    intro:
      'Channel management connects planning, editing, packaging, and publishing into one weekly rhythm. You stop coordinating handoffs and start reviewing a channel that already knows what comes next.',
    outcomes: [
      'A publishing calendar the team can trust',
      'Less time spent chasing files and approvals',
      'A weekly read on what deserves more attention',
    ],
    deliverables: [
      {
        title: 'Publishing calendar',
        description:
          'A forward-looking plan for flagship videos, shorts, and the supporting posts around them.',
      },
      {
        title: 'Packaging and metadata',
        description:
          'Titles, descriptions, thumbnails, and chapter details are prepared before the upload window.',
      },
      {
        title: 'Weekly performance read',
        description:
          'A plain-language recap of what worked, what stalled, and what we should adjust next.',
      },
    ],
    process: [
      {
        title: 'Fit call and access',
        description:
          'We confirm volume, turnaround, channel access, and the decisions you want to keep.',
      },
      {
        title: 'Build the monthly plan',
        description:
          'The calendar starts with the stories worth telling, then maps the formats around them.',
      },
      {
        title: 'Run weekly production',
        description:
          'Editing, thumbnails, and publishing move through one schedule with clear status at every step.',
      },
      {
        title: 'Review and adjust',
        description:
          'A short weekly review turns performance into the next set of creative decisions.',
      },
    ],
    bestFor: [
      'Weekly creators',
      'Lean marketing teams',
      'Multi-platform publishers',
    ],
    previewIcon: 'sparkles',
    previewTitle: 'One calm publishing system',
  },
};

const SERVICE_ICONS = {
  'long-form': Film,
  'short-form': Smartphone,
  'channel-management': Megaphone,
} as const;

const STAT_ICONS: Record<ServiceSlug, string[]> = {
  'long-form': ['clock', 'users', 'sparkles'],
  'short-form': ['clock', 'sparkles', 'users'],
  'channel-management': ['users', 'sparkles', 'orders'],
};

function getHighlight(headline: string) {
  const words = headline.trim().split(/\s+/);
  return words[words.length - 1] ?? headline;
}

export function generateStaticParams() {
  return (Object.keys(SERVICE_PAGE_DATA) as ServiceSlug[]).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getServicePage(params.slug);

  if (!page) {
    return {
      title: `Service not found — ${BRAND_NAME}`,
    };
  }

  return {
    title: `${page.headline} — ${BRAND_NAME}`,
    description: page.description,
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getServicePage(params.slug);

  if (!page) {
    notFound();
  }

  const content = SERVICE_CONTENT[page.slug];
  const Icon = SERVICE_ICONS[page.slug];

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-transparent"
        />

        <div className="relative mx-auto max-w-screen-1200 px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <PageHeader
                eyebrow={page.pill}
                title={page.headline}
                highlight={getHighlight(page.headline)}
                description={page.description}
              />

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={page.cta}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  Start an order
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link
                  href="/examples"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  See examples
                </Link>
              </div>

              <p className="mt-6 flex items-center gap-2 text-sm font-medium text-indigo-700">
                <Icon aria-hidden="true" className="h-4 w-4" />
                Built around {page.highlight}
              </p>
            </div>

            <MediaPlaceholder
              aspect="video"
              badge={page.pill}
              title={content.previewTitle}
              description={page.highlight}
              icon={content.previewIcon}
            />
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {page.stats.map((stat, index) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={STAT_ICONS[page.slug][index]}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="max-w-xl">
              <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                What we focus on
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                {content.introTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-500">
                {content.intro}
              </p>

              <ul className="mt-7 space-y-3">
                {content.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    />
                    {outcome}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  A strong fit for
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {content.bestFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-200 bg-brand-surface px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {content.deliverables.map((deliverable, index) => (
                <FadeIn key={deliverable.title} delay={index * 0.05}>
                  <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-brand-ink">
                        {deliverable.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-500">
                        {deliverable.description}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-surface">
        <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              How it works
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              Four steps, one visible handoff
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              You always know where the edit is, what happens next, and who owns
              the decision.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {content.process.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.05} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-ink text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-brand-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-5 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600">
              Want to compare packages before choosing a format?
            </p>
            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-indigo transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              View pricing
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
