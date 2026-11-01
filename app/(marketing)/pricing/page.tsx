import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import {
  getActiveAddOns,
  getActivePackages,
} from '@/lib/data/marketing';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { PageHero } from '@/components/marketing/page-hero';
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
      <PageHero
        eyebrow="Pricing"
        title="Clear pricing for every kind of edit"
        highlight="pricing"
        description="Choose a video package for a one-off project or hand over the weekly publishing rhythm. Either way, you see the price before the work starts."
        actions={
          <Link href="/contact" className="btn-cyan">
            Need a custom mix?
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        }
      />

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 pb-4 pt-10 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
