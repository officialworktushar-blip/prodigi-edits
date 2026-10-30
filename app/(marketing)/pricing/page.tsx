import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import {
  getActiveAddOns,
  getActivePackages,
} from '@/lib/data/marketing';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { PageHeader } from '@/components/shared/page-header';
import { PricingExperience } from '@/components/marketing/pricing/pricing-experience';

export const metadata: Metadata = {
  title: `Pricing — ${BRAND_NAME}`,
  description:
    'Compare long-form, short-form, and channel management plans. Clear per-video pricing, included revisions, and add-ons only when you need them.',
};

const assurances = [
  'No hidden production fees',
  'Revisions included',
  'Flexible after the minimum term',
];

export default async function PricingPage() {
  const [packages, addOns] = await Promise.all([
    getActivePackages(),
    getActiveAddOns(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-transparent"
        />

        <div className="relative mx-auto max-w-screen-1200 px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <PageHeader
            eyebrow="Pricing"
            title="Clear pricing for every kind of edit"
            highlight="pricing"
            description="Choose a video package for a one-off project or hand over the weekly publishing rhythm. Either way, you see the price before the work starts."
            actions={
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                Need a custom mix?
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            }
          />

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            {assurances.map((assurance) => (
              <li
                key={assurance}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <Check
                  aria-hidden="true"
                  className="h-4 w-4 text-emerald-600"
                />
                {assurance}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PricingExperience packages={packages ?? []} addOns={addOns ?? []} />

      <FinalCta />
    </>
  );
}
