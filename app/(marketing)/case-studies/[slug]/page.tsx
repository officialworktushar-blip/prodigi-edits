import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { getPublishedCaseStudyBySlug } from '@/lib/data/marketing';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { MediaPlaceholder } from '@/components/shared/media-placeholder';

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently published';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const caseStudy = await getPublishedCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    return {
      title: `Case study not found — ${BRAND_NAME}`,
    };
  }

  return {
    title: `${caseStudy.title} — ${BRAND_NAME}`,
    description:
      caseStudy.summary ??
      'A published project story about the brief, the review loop, and the final delivery.',
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const caseStudy = await getPublishedCaseStudyBySlug(params.slug);

  if (!caseStudy) {
    notFound();
  }

  const bodyParagraphs = (caseStudy.body ?? '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const fallbackBody =
    caseStudy.summary ??
    'This project story is being prepared. The published summary will appear here as soon as the full write-up is ready.';

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-transparent"
        />
        <div className="relative mx-auto max-w-screen-1200 px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            All case studies
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  Case study
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                  {formatDate(caseStudy.created_at)}
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-5xl">
                {caseStudy.title}
              </h1>
              {caseStudy.summary ? (
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                  {caseStudy.summary}
                </p>
              ) : null}
            </div>

            <MediaPlaceholder
              aspect="video"
              badge="Project story"
              title={caseStudy.title}
              icon="film"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <article className="max-w-none">
              <h2 className="text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
                How the project came together
              </h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-slate-600">
                {(bodyParagraphs.length > 0
                  ? bodyParagraphs
                  : [fallbackBody]
                ).map((paragraph, index) => (
                  <p key={`${caseStudy.id}-paragraph-${index}`}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-slate-200 bg-brand-surface p-6">
                <h3 className="text-sm font-semibold text-brand-ink">
                  What this story highlights
                </h3>
                <ul className="mt-4 space-y-3">
                  {[
                    'A clear brief before the first cut',
                    'Focused review notes in one thread',
                    'A delivery package ready for publishing',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-600"
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft lg:sticky lg:top-28">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Project snapshot
              </p>
              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                    Work type
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-brand-ink">
                    Editorial video project
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                    Published
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-brand-ink">
                    {formatDate(caseStudy.created_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                    Delivery
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-brand-ink">
                    Approved and delivered
                  </dd>
                </div>
              </dl>

              <Link
                href="/signup"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                Start a project
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
