'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Minus,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type { BillingType } from '../../../types/db';
import {
  BILLING_OPTIONS,
  CHANNEL_COMPARISON_ROWS,
  CHANNEL_PLANS,
} from '../../../lib/data/channel-plans';
import { cn } from '../../../lib/utils';
import { FadeIn } from '../../shared/fade-in';

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function ComparisonValue({
  value,
  highlight = false,
}: {
  value: string | boolean;
  highlight?: boolean;
}) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex items-center justify-center text-emerald-600">
        <Check aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">Included</span>
      </span>
    ) : (
      <span className="inline-flex items-center justify-center text-slate-300">
        <Minus aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">Not included</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'text-sm text-slate-600',
        highlight ? 'font-semibold text-brand-ink' : ''
      )}
    >
      {value}
    </span>
  );
}

export interface ChannelManagementPlansProps {
  className?: string;
}

export function ChannelManagementPlans({
  className,
}: ChannelManagementPlansProps) {
  const [billing, setBilling] = useState<BillingType>('QUARTERLY');
  const plans = CHANNEL_PLANS[billing] ?? CHANNEL_PLANS.QUARTERLY;
  const activeOption =
    BILLING_OPTIONS.find((option) => option.value === billing) ??
    BILLING_OPTIONS[0];

  return (
    <div className={cn('space-y-14', className)}>
      <div className="flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          Full channel partnership
        </span>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
          Hand over the publishing rhythm
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          Planning, editing, thumbnails, uploads, and a clear read on what is
          working. Choose the level of support your channel needs.
        </p>

        <div
          role="group"
          aria-label="Channel management billing period"
          className="mt-7 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-soft"
        >
          {BILLING_OPTIONS.map((option) => {
            const isActive = option.value === billing;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setBilling(option.value)}
                className={cn(
                  'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2 sm:px-5',
                  isActive
                    ? 'bg-brand-ink text-white shadow-soft'
                    : 'text-slate-500 hover:text-brand-ink'
                )}
              >
                {option.label}
                {option.value === 'ANNUAL' ? (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'bg-emerald-100 text-emerald-700'
                    )}
                  >
                    20% off
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <p
          aria-live="polite"
          className="mt-3 text-xs font-medium text-slate-500"
        >
          {activeOption.note} ·{' '}
          {billing === 'ANNUAL'
            ? 'Minimum annual commitment'
            : 'Minimum quarterly commitment'}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {plans.map((plan, index) => (
          <FadeIn
            key={`${billing}-${plan.id}`}
            delay={index * 0.05}
            once={false}
            className="h-full"
          >
            <article
              className={cn(
                'relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-7 shadow-soft sm:p-8',
                plan.featured
                  ? 'border-brand-indigo/30 ring-1 ring-brand-indigo/10'
                  : 'border-slate-200'
              )}
            >
              {plan.featured ? (
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-indigo to-brand-blue"
                />
              ) : null}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                    {plan.tagline}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-brand-ink">
                    {plan.name}
                  </h3>
                </div>
                {plan.featured ? (
                  <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-brand-indigo">
                    Most popular
                  </span>
                ) : null}
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                {plan.description}
              </p>

              <div className="mt-6 border-y border-slate-100 py-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold tracking-tight text-brand-ink">
                    {formatMoney(plan.monthlyPrice)}
                  </span>
                  <span className="text-sm text-slate-500">/ month</span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-slate-500">
                  {plan.billedLabel}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {plan.billingNote}
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Link
                  href={`/signup?plan=${plan.id.toLowerCase()}&billing=${billing.toLowerCase()}`}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                    plan.featured
                      ? 'bg-gradient-to-r from-brand-indigo to-brand-blue text-white shadow-soft hover:shadow-soft-lg'
                      : 'border border-slate-200 bg-white text-slate-700 shadow-soft hover:border-slate-300 hover:text-brand-ink'
                  )}
                >
                  {plan.ctaLabel}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 px-5 py-4 text-sm leading-6 text-indigo-900">
        <div className="flex items-start gap-3">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600"
          />
          <p>
            Every channel plan starts with a short fit call so we can confirm
            volume, turnaround, and access before billing begins. Need a custom
            mix?{' '}
            <Link
              href="/contact"
              className="font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Talk to the team
            </Link>
            .
          </p>
        </div>
      </div>

      <div>
        <div className="max-w-2xl">
          <h3 className="text-xl font-semibold tracking-tight text-brand-ink sm:text-2xl">
            Compare every detail
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            The same production standards in both plans. The difference is
            volume, speed, and how closely we work with you each week.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <caption className="sr-only">
                Channel management plan feature comparison
              </caption>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th
                    scope="col"
                    className="sticky left-0 z-10 w-[42%] bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-4 text-sm font-semibold text-brand-ink"
                  >
                    Starter
                  </th>
                  <th
                    scope="col"
                    className="bg-indigo-50/60 px-5 py-4 text-sm font-semibold text-brand-indigo"
                  >
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {CHANNEL_COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-5 py-4 align-top font-medium"
                    >
                      <span className="block text-sm text-brand-ink">
                        {row.label}
                      </span>
                      {row.hint ? (
                        <span className="mt-0.5 block text-xs font-normal leading-5 text-slate-400">
                          {row.hint}
                        </span>
                      ) : null}
                    </th>
                    <td className="px-5 py-4 align-top">
                      <ComparisonValue value={row.starter} />
                    </td>
                    <td className="bg-indigo-50/30 px-5 py-4 align-top">
                      <ComparisonValue value={row.pro} highlight />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Prices are in USD. Monthly equivalents are shown for comparison; the
          billed total is charged at the start of each billing period.
        </p>
      </div>
    </div>
  );
}
