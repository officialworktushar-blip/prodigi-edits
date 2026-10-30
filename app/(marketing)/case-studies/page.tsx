import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { getPublishedCaseStudies } from '@/lib/data/marketing';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn } from '@/components/shared/fade-in';
import { MediaPlaceholder } from '@/components/shared/media-placeholder';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: `Case studies — ${BRAND_NAME}`,
  description:
    'Published project stories about clearer briefs, focused review loops, and video work that shipped on schedule.',
};

export const dynamic = 'force-dynamic';

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently published';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default async function CaseStudiesPage() {
  const caseStudies = (await getPublishedCaseStudies()) ?? [];

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-transparent"
        />
        <div className="relative mx-auto max-w-screen-1200 px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <PageHeader
            eyebrow="Case studies"
            title="Project stories with the working details"
            highlight="details"
            description="What the brief asked for, what changed during the edit, and how the final delivery came together. No vague before-and-after claims."
            actions={
              <Link
                href="/examples"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                Browse examples
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            }
          />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 pb-20 sm:px-6 lg:px-8">
          {caseStudies.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-brand-surface">
              <EmptyState
                icon="folder"
                title="The first case studies are in production"
                description="We are preparing the first published stories. Browse the examples gallery in the meantime, or start an order and build your own."
                actionLabel="See examples"
                actionHref="/examples"
              />
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((caseStudy, index) => (
                <FadeIn
                  key={caseStudy.id}
                  delay={index * 0.04}
                  className="h-full"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg">
                    <MediaPlaceholder
                      aspect="wide"
                      badge="Case study"
                      title={caseStudy.title}
                      icon="film"
                      className="rounded-none border-0 shadow-none"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                        {formatDate(caseStudy.created_at)}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold tracking-tight text-brand-ink">
                        {caseStudy.title}
                      </h2>
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
          )}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
