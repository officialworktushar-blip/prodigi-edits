import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, Users, Clock, Shield, MessageSquare } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { USE_CASES } from '@/lib/data/use-cases';
import { getMarketingPageContent } from '@/lib/data/marketing-pages';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';
import { FadeIn } from '@/components/shared/fade-in';
import { FeatureSplit } from '@/components/sections';
import { AboutTeamMockup } from '@/components/marketing/inner-page-hero-mockups';

export const metadata: Metadata = {
  title: `About — ${BRAND_NAME}`,
  description:
    'A small senior editing crew built around clear briefs, focused feedback, and a finish that is ready to publish.',
};

function ValuesSection() {
  const values = [
    {
      icon: <Users aria-hidden="true" className="h-4 w-4" />,
      title: 'Dedicated team',
      description: 'A small accountable crew with a named contact who owns the handoff.',
    },
    {
      icon: <Shield aria-hidden="true" className="h-4 w-4" />,
      title: 'Multiple specialists',
      description: 'Editing, motion, color, and sound in one workflow.',
    },
    {
      icon: <Clock aria-hidden="true" className="h-4 w-4" />,
      title: 'Live progress',
      description: 'Drafts, comments, and approvals in one place.',
    },
    {
      icon: <MessageSquare aria-hidden="true" className="h-4 w-4" />,
      title: 'Useful revisions',
      description: 'Timecoded notes and honest trade-offs before pushing back.',
    },
  ];

  return (
    <FeatureSplit
      eyebrow="What we value"
      title="The standards we do not trade away"
      highlight="do not trade away"
      description="We built the service around four principles that keep the work calm and the finish reliable."
      bullets={values}
      reverse={false}
    />
  );
}

function StatsSection() {
  const stats = [
    { value: '24-48h', label: 'First cut' },
    { value: '4.9/5', label: 'Average review' },
    { value: '1,200+', label: 'Videos shipped' },
    { value: '87%', label: 'Reorder in first month' },
  ];

  return (
    <section className="bg-brand-surface">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.06} className="text-center">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <p className="text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-center text-sm leading-6 text-indigo-900">
          You own the final video; working files stay private to your workspace.
        </div>
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="bg-brand-surface">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Who we help
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
            Different rooms, same need for a clean finish
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-500">
            The format changes with the audience. The standard for clarity and
            delivery does not.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;

            return (
              <Link
                key={useCase.slug}
                href={`/use-cases/${useCase.slug}`}
                className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-brand-ink">
                    {useCase.label}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors group-hover:text-brand-indigo">
                    See the use case
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 flex items-start gap-2 text-sm leading-6 text-slate-500">
          <Check
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
          />
          Not sure where you fit? Start with a single order and we will help
          you choose the right format before the work begins.
        </p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const content = getMarketingPageContent('about');

  return (
    <MarketingPageShell
      content={content}
      heroVisual={<AboutTeamMockup />}
      afterPain={
        <>
          <ValuesSection />
          <StatsSection />
        </>
      }
      beforeCta={<UseCasesSection />}
    />
  );
}
