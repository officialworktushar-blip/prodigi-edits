import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, FolderOpen, Lock, Users } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { USE_CASES, getUseCasePage } from '@/lib/data/use-cases';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { FadeIn } from '@/components/shared/fade-in';
import { MediaPlaceholder } from '@/components/shared/media-placeholder';
import { PageHeader } from '@/components/shared/page-header';

type UseCaseSlug = (typeof USE_CASES)[number]['slug'];

interface UseCaseContent {
  introTitle: string;
  intro: string;
  projects: { title: string; description: string }[];
  outcomes: string[];
  previewIcon: string;
  previewTitle: string;
}

const USE_CASE_CONTENT: Record<UseCaseSlug, UseCaseContent> = {
  youtubers: {
    introTitle: 'Keep the upload schedule without living in the timeline',
    intro:
      'A channel grows on consistency, not heroics. We build a repeatable edit rhythm for flagship videos, shorts, and the packaging around them so publishing stops depending on an empty weekend.',
    projects: [
      {
        title: 'Weekly flagship uploads',
        description:
          'Long-form episodes with a clear structure, polished sound, and a finish that matches the channel.',
      },
      {
        title: 'Shorts from long interviews',
        description:
          'Complete thoughts pulled from the source, captioned and framed for vertical feeds.',
      },
      {
        title: 'Channel packaging',
        description:
          'Thumbnail concepts, titles, and upload details prepared alongside the edit.',
      },
    ],
    outcomes: [
      'A format your audience recognizes quickly',
      'Batch production without last-minute scrambles',
      'More publishing days from the same footage',
    ],
    previewIcon: 'play',
    previewTitle: 'A channel built for a weekly rhythm',
  },
  businesses: {
    introTitle: 'Product stories that look as considered as the product',
    intro:
      'A product demo, launch film, or hiring update carries the brand before anyone reads a line of copy. We turn internal footage into a clear story with the pacing and finish of a considered campaign.',
    projects: [
      {
        title: 'Product demos',
        description:
          'Feature walkthroughs that show the value in the first few seconds and stay easy to follow.',
      },
      {
        title: 'Launch and brand films',
        description:
          'A tight narrative around the announcement, built from interviews, product shots, and motion.',
      },
      {
        title: 'Internal and investor updates',
        description:
          'Polished updates that respect the audience and make the important numbers easy to see.',
      },
    ],
    outcomes: [
      'A consistent visual standard across teams',
      'Shorter review cycles with one clear owner',
      'A library of clips ready for sales and social',
    ],
    previewIcon: 'film',
    previewTitle: 'A product story with a clear point of view',
  },
  podcasters: {
    introTitle: 'Keep the conversation. Lose the dead air.',
    intro:
      'The best podcast moments are already in the room. We remove the false starts, tighten the transitions, and shape the episode so the guest and the idea stay in focus.',
    projects: [
      {
        title: 'Video podcast episodes',
        description:
          'Multi-camera sessions cut into a clean, watchable episode without losing the natural conversation.',
      },
      {
        title: 'Guest highlight clips',
        description:
          'Short, self-contained moments that make sense outside the full episode.',
      },
      {
        title: 'Audio-first cleanup',
        description:
          'Dialogue balancing, filler removal, and a consistent listening level across every episode.',
      },
    ],
    outcomes: [
      'Episodes that feel shorter than their runtime',
      'A reliable mix across guests and rooms',
      'A steady supply of clips after each recording',
    ],
    previewIcon: 'film',
    previewTitle: 'A conversation that keeps moving',
  },
  realtors: {
    introTitle: 'Listings that feel ready before the first showing',
    intro:
      'Property content has a short window to earn attention. We cut tours and agent stories with enough polish to feel premium and enough clarity to help a buyer decide.',
    projects: [
      {
        title: 'Property tours',
        description:
          'Walkthroughs with a logical room order, clean transitions, and a clear sense of space.',
      },
      {
        title: 'Agent introduction films',
        description:
          'A short profile that shows how you work, not just what you sell.',
      },
      {
        title: 'Neighborhood highlights',
        description:
          'Local context and lifestyle moments edited into a shareable listing companion.',
      },
    ],
    outcomes: [
      'Listing pages that look professionally produced',
      'Shorter tours with fewer wasted views',
      'A reusable library of agent and property clips',
    ],
    previewIcon: 'play',
    previewTitle: 'A listing tour with a clear path',
  },
  'course-creators': {
    introTitle: 'Lessons that stay clear, even at lesson twelve',
    intro:
      'A course lives or dies on clarity. We protect the teaching point, remove the repetition, and keep the visual language consistent from the first module to the last.',
    projects: [
      {
        title: 'Module intros',
        description:
          'Short openings that set expectations and make the next lesson feel easy to start.',
      },
      {
        title: 'Tutorial episodes',
        description:
          'Screen recordings, talking head, and demonstrations cut into a pace learners can follow.',
      },
      {
        title: 'Course launch trailers',
        description:
          'A focused preview of the transformation, built to sit at the top of a sales page.',
      },
    ],
    outcomes: [
      'A consistent look across every module',
      'Fewer rewinds from unclear demonstrations',
      'Promo clips that reuse the course footage',
    ],
    previewIcon: 'play',
    previewTitle: 'A lesson built for follow-through',
  },
  doctors: {
    introTitle: 'Plain-language health content with a warmer finish',
    intro:
      'Patient education needs to be accurate, calm, and easy to absorb. We keep the language clear, the pacing considerate, and the visual tone welcoming without feeling clinical.',
    projects: [
      {
        title: 'Patient explainer videos',
        description:
          'Procedure and condition explanations edited for clarity, not drama.',
      },
      {
        title: 'Procedure walkthroughs',
        description:
          'Step-by-step content that sets expectations and reduces uncertainty before an appointment.',
      },
      {
        title: 'Clinic introduction clips',
        description:
          'A friendly first look at the people, space, and approach behind the practice.',
      },
    ],
    outcomes: [
      'Health content that feels approachable',
      'Consistent captions and on-screen clarity',
      'A library that supports the front desk and website',
    ],
    previewIcon: 'play',
    previewTitle: 'A patient story told with care',
  },
  lawyers: {
    introTitle: 'Firm updates and client stories without the stiff delivery',
    intro:
      'Legal expertise is serious work, but the video does not have to feel like a deposition. We shape clear, credible stories that make the firm feel human without overselling.',
    projects: [
      {
        title: 'Client testimonials',
        description:
          'Measured, believable stories with the strongest details brought forward.',
      },
      {
        title: 'Practice-area explainers',
        description:
          'Plain-language overviews that help a potential client understand the next step.',
      },
      {
        title: 'Firm announcement videos',
        description:
          'New hires, milestones, and community work presented with a consistent firm voice.',
      },
    ],
    outcomes: [
      'Video that sounds like the firm, not a template',
      'Clear edits that respect sensitive subjects',
      'A reusable set of clips for the website and social',
    ],
    previewIcon: 'film',
    previewTitle: 'A firm story with a steady voice',
  },
};

const quickFacts = [
  { icon: Users, label: 'Dedicated editor' },
  { icon: Check, label: 'Revisions included' },
  { icon: Lock, label: 'Private file storage' },
];

export function generateStaticParams() {
  return USE_CASES.map((useCase) => ({
    slug: useCase.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getUseCasePage(params.slug);

  if (!page) {
    return {
      title: `Use case not found — ${BRAND_NAME}`,
    };
  }

  return {
    title: `Video editing for ${page.label} — ${BRAND_NAME}`,
    description: page.description,
  };
}

export default function UseCasePage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getUseCasePage(params.slug);

  if (!page) {
    notFound();
  }

  const content = USE_CASE_CONTENT[page.slug];
  const Icon = page.icon;

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
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-600 shadow-soft">
                <Icon aria-hidden="true" className="h-6 w-6" />
              </span>
              <PageHeader
                eyebrow="Use case"
                title={`Video editing for ${page.label}`}
                highlight={page.label}
                description={page.description}
              />

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  Start an order
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  View pricing
                </Link>
              </div>

              <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
                {quickFacts.map((fact) => {
                  const FactIcon = fact.icon;

                  return (
                    <li
                      key={fact.label}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
                    >
                      <FactIcon
                        aria-hidden="true"
                        className="h-3.5 w-3.5 text-indigo-500"
                      />
                      {fact.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            <MediaPlaceholder
              aspect="video"
              badge={page.label}
              title={content.previewTitle}
              icon={content.previewIcon}
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="max-w-xl">
              <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                Made for the work
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                {content.introTitle}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-500">
                {content.intro}
              </p>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-brand-surface p-6">
                <h3 className="text-sm font-semibold text-brand-ink">
                  What changes with a steady editing partner
                </h3>
                <ul className="mt-4 space-y-3">
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
              </div>
            </div>

            <div className="grid gap-4">
              {content.projects.map((project, index) => (
                <FadeIn key={project.title} delay={index * 0.05}>
                  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FolderOpen aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-base font-semibold tracking-tight text-brand-ink">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-500">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </article>
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
              A simple handoff
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              Send the footage. Review the cut. Publish.
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              The workflow stays the same whether you send one video or a full
              month of footage.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Send the footage',
                description:
                  'Share the files, the audience, and the outcome you need. We confirm the brief before editing starts.',
              },
              {
                title: 'Review the first cut',
                description:
                  'Leave timecoded notes in one place. We close the feedback and show you exactly what changed.',
              },
              {
                title: 'Publish with confidence',
                description:
                  'Receive the final files in the formats your channel needs, ready for the upload window.',
              },
            ].map((step, index) => (
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
              Not sure which format fits your footage?
            </p>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-indigo transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Ask the team
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
