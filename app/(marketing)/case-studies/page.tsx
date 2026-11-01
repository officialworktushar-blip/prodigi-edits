import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { getPublishedCaseStudies } from '@/lib/data/marketing';
import { getMarketingPageContent } from '@/lib/data/marketing-pages';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';
import { EmptyState } from '@/components/shared/empty-state';
import { FadeIn } from '@/components/shared/fade-in';

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

function CaseStudiesGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 pb-20 sm:px-6 lg:px-8">
        <CaseStudiesGridContent />
      </div>
    </section>
  );
}

async function CaseStudiesGridContent() {
  const caseStudies = (await getPublishedCaseStudies()) ?? [];

  if (caseStudies.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-brand-surface">
        <EmptyState
          icon="folder"
          title="The first case studies are in production"
          description="We are preparing the first published stories. Browse the examples gallery in the meantime, or start an order and build your own."
          actionLabel="See examples"
          actionHref="/examples"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {caseStudies.map((caseStudy, index) => (
        <FadeIn
          key={caseStudy.id}
          delay={index * 0.04}
          className="h-full"
        >
          <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg">
            <div className="relative overflow-hidden rounded-t-2xl border-b border-slate-100 bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 p-5">
              <div
                aria-hidden="true"
                className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-sky-200/50 blur-2xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-pink-200/50 blur-2xl"
              />
              <div className="relative rounded-xl border border-white/80 bg-white/50 p-4">
                <svg viewBox="0 0 64 48" aria-hidden="true" className="h-16 w-full">
                  <rect width="64" height="48" rx="8" fill="#e2e8f0" />
                  <rect x="8" y="8" width="32" height="24" rx="4" fill="#c4b5fd" />
                  <path d="M24 16v8l6-4z" fill="#ffffff" />
                  <rect x="8" y="36" width="28" height="4" rx="2" fill="#cbd5e1" />
                  <rect x="44" y="8" width="12" height="8" rx="4" fill="#a78bfa" />
                  <rect x="44" y="20" width="12" height="8" rx="4" fill="#f472b6" />
                  <rect x="44" y="32" width="12" height="8" rx="4" fill="#38bdf8" />
                </svg>
              </div>
            </div>
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
  );
}

export default async function CaseStudiesPage() {
  const content = getMarketingPageContent('case-studies');

  return (
    <MarketingPageShell
      content={content}
      afterWay={<CaseStudiesGrid />}
    />
  );
}
