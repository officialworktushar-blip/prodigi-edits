import type { Metadata } from 'next';
import { BRAND_NAME } from '@/lib/config';
import { Hero } from '@/components/marketing/home/hero';
import { CreateVideosSection } from '@/components/marketing/home/create-videos-section';
import { ThreeWaysSection } from '@/components/marketing/home/three-ways-section';
import { ReviewDeliverySection } from '@/components/marketing/home/review-delivery-section';
import { UseCasesCarousel } from '@/components/marketing/home/use-cases-carousel';
import { FeaturesSection } from '@/components/marketing/home/features-section';
import { CaseStudiesSection } from '@/components/marketing/home/case-studies-section';
import { FaqSection } from '@/components/marketing/home/faq-section';
import { FinalCta } from '@/components/marketing/home/final-cta';

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Video editing that keeps your pace`,
  description:
    'Send your footage and get polished long-form, short-form, and managed channel videos without building an in-house editing team.',
};

export default function MarketingHomePage() {
  return (
    <>
      <Hero />
      <CreateVideosSection />
      <ThreeWaysSection />
      <ReviewDeliverySection />
      <UseCasesCarousel />
      <FeaturesSection />
      <CaseStudiesSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
