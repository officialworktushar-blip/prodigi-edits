import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import type { Package } from '../../../types/db';
import { EmptyState } from '../../shared/empty-state';
import { FadeIn } from '../../shared/fade-in';
import { SectionHeading } from '../../shared/section-heading';

export interface PricingTeaserProps {
  packages?: Package[];
}

const kindLabels: Record<Package['kind'], string> = {
  HORIZONTAL: 'Long-form',
  VERTICAL: 'Short-form',
  THUMBNAIL: 'Thumbnails',
};

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function PricingTeaser({ packages = [] }: PricingTeaserProps) {
  const items = (packages ?? []).slice(0, 3);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Simple pricing"
          headline="Prices that match the way you publish"
          highlight="publish"
          subcopy="Start with one video or reserve a batch. Every package includes a real editor, clear revisions, and final files in the formats you need."
        />

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-brand-surface">
            <EmptyState
              icon="payment"
              title="Pricing is being refreshed"
              description="New packages are being finalized. Talk to us and we will put together a clear quote for your next project."
              actionLabel="Contact us"
              actionHref="/contact"
            />
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {items.map((item, index) => {
                const discount = item.discount_percent ?? 0;

                return (
                  <FadeIn key={item.id} delay={index * 0.05} className="h-full">
                    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-soft-lg">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                          {kindLabels[item.kind] ?? 'Video'}
                        </span>
                        {discount > 0 ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            Save {discount}%
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-5 text-xl font-semibold tracking-tight text-brand-ink">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.video_count}{' '}
                        {item.video_count === 1 ? 'video' : 'videos'}
                      </p>

                      <div className="mt-5 flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold tracking-tight text-brand-ink">
                          {formatMoney(item.price_per_video)}
                        </span>
                        <span className="text-sm text-slate-500">
                          / video
                        </span>
                      </div>

                      <div className="mt-auto border-t border-slate-100 pt-5">
                        <Link
                          href="/pricing"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-indigo transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                        >
                          View package
                          <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  </FadeIn>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-brand-surface px-6 py-5 sm:flex-row">
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {[
                  'Dedicated editor',
                  'Two revision rounds',
                  'Every export format',
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <Check
                      aria-hidden="true"
                      className="h-4 w-4 text-emerald-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                See full pricing
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
