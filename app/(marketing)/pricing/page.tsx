import type { Metadata } from 'next';
import { BRAND_NAME } from '@/lib/config';
import {
  getActiveAddOns,
  getActivePackages,
  getPublishedFaqItems,
} from '@/lib/data/marketing';
import { getMarketingPageContent } from '@/lib/data/marketing-pages';
import { FaqAccordion } from '@/components/marketing/faq';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';
import { PricingBoard } from '@/components/marketing/pricing/pricing-board';
import { PricingPlanMockup } from '@/components/marketing/inner-page-hero-mockups';

export const metadata: Metadata = {
  title: `Pricing — ${BRAND_NAME}`,
  description:
    'Compare long-form, short-form, and channel management pricing. See per-video rates, package totals, included revisions, and optional add-ons before the work begins.',
};

export default async function PricingPage() {
  const [packages, addOns, faqItems] = await Promise.all([
    getActivePackages(),
    getActiveAddOns(),
    getPublishedFaqItems(),
  ]);
  const content = getMarketingPageContent('pricing');

  return (
    <MarketingPageShell
      content={content}
      heroVisual={<PricingPlanMockup />}
      afterWay={
        <PricingBoard
          packages={packages ?? []}
          addOns={addOns ?? []}
        />
      }
      beforeCta={<FaqAccordion items={faqItems ?? []} />}
    />
  );
}
