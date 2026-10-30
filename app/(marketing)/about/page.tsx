import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  HeartHandshake,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { USE_CASES } from '@/lib/data/use-cases';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { FadeIn } from '@/components/shared/fade-in';
import { MediaPlaceholder } from '@/components/shared/media-placeholder';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: `About — ${BRAND_NAME}`,
  description:
    'A small senior editing crew built around clear briefs, focused feedback, and a finish that is ready to publish.',
};

const values = [
  {
    icon: MessageSquare,
    title: 'Clarity before cuts',
    description:
      'A good edit starts with a shared understanding of the audience, the point, and the deadline. We confirm the brief before the timeline opens.',
  },
  {
    icon: HeartHandshake,
    title: 'One accountable crew',
    description:
      'You should not have to chase five people to find out where a draft is. One workspace, one thread, and a clear owner for the next step.',
  },
  {
    icon: Sparkles,
    title: 'Finish matters',
    description:
      'Sound, captions, color, and exports are part of the work, not an afterthought. The final file should feel ready the moment it lands.',
  },
];

const principles = [
  {
    title: 'We ask before we assume',
    description:
      'If the footage does not support the brief, we say so early. A short question now is cheaper than a polished wrong turn later.',
  },
  {
    title: 'We protect the story',
    description:
      'Transitions and effects are useful when they serve the point. We would rather remove a clever cut than distract from the reason someone is watching.',
  },
  {
    title: 'We keep the handoff calm',
    description:
      'Every order has a visible status, a place for notes, and a delivery package that matches the format you actually need.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-transparent"
        />
        <div className="relative mx-auto max-w-screen-1200 px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <PageHeader
                eyebrow="About"
                title="A small crew for the work that matters"
                highlight="matters"
                description="We built a video editing service for people who care about the finished piece but do not want to manage a production team to get it."
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
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  Talk to the team
                </Link>
              </div>
            </div>

            <MediaPlaceholder
              aspect="video"
              badge="The crew"
              title="A calm room for the work"
              description="Briefs, footage, notes, and deliveries in one place."
              icon="film"
            />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                Why we exist
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                Editing should feel like a clear partnership
              </h2>
            </div>
            <div className="space-y-4 text-base leading-8 text-slate-600">
              <p>
                Most video work does not fail because the footage is bad. It
                fails because the brief is vague, the feedback is scattered, or
                the deadline was never realistic. We built the service around
                those three points.
              </p>
              <p>
                Instead of a marketplace of strangers, you get a dedicated crew
                with a repeatable process. Instead of a folder full of versions,
                you get one visible order, one review thread, and a delivery
                that is ready to publish.
              </p>
              <p>
                We are deliberately small. That keeps the communication direct
                and the standard consistent, whether you send one video or a
                full month of footage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-surface">
        <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              What we believe
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
              Three standards we do not trade away
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500">
              The tools change. The standard for a clear, finished handoff does
              not.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <FadeIn key={value.title} delay={index * 0.05} className="h-full">
                  <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-base font-semibold tracking-tight text-brand-ink">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {value.description}
                    </p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                How we work
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                A process built to remove surprises
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-500">
                The goal is not to make editing mysterious. It is to make the
                next step obvious.
              </p>

              <Link
                href="/platform"
                className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                See the workspace
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-soft">
              {principles.map((principle, index) => (
                <div key={principle.title} className="flex gap-4 p-6">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-ink text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-brand-ink">
                      {principle.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      <FinalCta />
    </>
  );
}
