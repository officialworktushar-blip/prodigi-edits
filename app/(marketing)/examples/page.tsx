import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { ExamplesGallery } from '@/components/marketing/examples/examples-gallery';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: `Examples — ${BRAND_NAME}`,
  description:
    'Browse representative long-form, short-form, vertical, and channel management edits arranged by format.',
};

const assurances = [
  'Made for real publishing deadlines',
  'Captions and platform exports included',
  'No stock-footage filler',
];

export default function ExamplesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-transparent"
        />
        <div className="relative mx-auto max-w-screen-1200 px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <PageHeader
            eyebrow="Examples"
            title="A gallery of finished work"
            highlight="finished"
            description="A closer look at the formats we build most often. Every preview below is a layout example; published project stories live in the case study library."
            actions={
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition-colors hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                Read case studies
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
                <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
                {assurance}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ExamplesGallery />
      <FinalCta />
    </>
  );
}
