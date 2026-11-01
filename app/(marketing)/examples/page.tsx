import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { BRAND_NAME } from '@/lib/config';
import { FinalCta } from '@/components/marketing/home/final-cta';
import { ExamplesGallery } from '@/components/marketing/examples/examples-gallery';
import { PageHero } from '@/components/marketing/page-hero';

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
      <PageHero
        eyebrow="Examples"
        title="A gallery of finished work"
        highlight="finished"
        description="A closer look at the formats we build most often. Every preview below is a layout example; published project stories live in the case study library."
        actions={
          <Link href="/case-studies" className="btn-cyan">
            Read case studies
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
