import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ClipboardList,
  Download,
  Lock,
  MessageSquare,
} from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { HowItWorks } from '@/components/marketing/home/how-it-works';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { FadeIn } from '@/components/shared/fade-in';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: `Platform — ${BRAND_NAME}`,
  description:
    'A shared workspace for the brief, footage, timecoded review notes, approvals, and final delivery.',
};

const capabilities = [
  {
    icon: ClipboardList,
    title: 'One clear brief',
    description:
      'Audience, format, deadline, and creative direction live together before editing starts.',
  },
  {
    icon: Lock,
    title: 'Private footage intake',
    description:
      'Files are organized inside the order instead of scattered across email and chat.',
  },
  {
    icon: MessageSquare,
    title: 'Timecoded review',
    description:
      'Notes stay attached to the moment they refer to, so the next pass starts with context.',
  },
  {
    icon: Download,
    title: 'Delivery shelf',
    description:
      'Approved files, captions, and the formats you need stay available after the order closes.',
  },
];

const statuses = [
  'Brief submitted',
  'Editor assigned',
  'In progress',
  'In review',
  'Approved',
  'Delivered',
];

const visibility = [
  'See the current status without asking for an update',
  'Keep every review note attached to the right order',
  'Download the final files in the formats you requested',
];

export default function PlatformPage() {
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
                eyebrow="The workspace"
                title="One place from brief to delivery"
                highlight="delivery"
                description="The platform keeps the request, the footage, the feedback, and the final files in one visible order. No mystery versions. No lost notes."
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
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  View pricing
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft-lg">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-semibold text-brand-ink">
                    Launch film — order #184
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Long-form · due Friday
                  </p>
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                  In review
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  { label: 'Brief approved', done: true },
                  { label: 'Footage uploaded', done: true },
                  { label: 'First cut delivered', done: true },
                  { label: 'Review notes in progress', done: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5"
                  >
                    <span className="text-xs font-medium text-slate-600">
                      {item.label}
                    </span>
                    {item.done ? (
                      <Check
                        aria-hidden="true"
                        className="h-4 w-4 text-emerald-600"
                      />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-indigo-600">
                  Latest note · 02:14
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Hold the product shot one beat longer before the title card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <FadeIn
                  key={capability.title}
                  delay={index * 0.04}
                  className="h-full"
                >
                  <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <h2 className="mt-4 text-sm font-semibold text-brand-ink">
                      {capability.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {capability.description}
                    </p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorks />

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                Visible progress
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl">
                You always know where the work stands
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-500">
                Every order follows the same path. If a revision comes back, the
                status reflects it and returns to production instead of
                disappearing into a private inbox.
              </p>

              <ul className="mt-6 space-y-3">
                {visibility.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-brand-surface p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Order status flow
              </p>
              <ol className="mt-5 space-y-3">
                {statuses.map((status, index) => (
                  <li key={status} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-brand-indigo shadow-soft">
                      {index + 1}
                    </span>
                    <div className="flex min-h-7 items-center">
                      <span className="text-sm font-medium text-slate-700">
                        {status}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 rounded-xl border border-indigo-100 bg-white p-3 text-xs leading-5 text-slate-500">
                Revision requested? The order moves back to in progress with
                your notes attached, then returns to review when the next cut is
                ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
