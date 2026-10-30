import type { Metadata } from 'next';
import { BRAND_NAME } from '@/lib/config';
import { createClient } from '@/lib/supabase/server';
import type {
  CaseStudy,
  FaqItem,
  Package,
  Testimonial,
} from '@/types/db';
import { Hero } from '@/components/marketing/home/hero';
import { TrustedBy } from '@/components/marketing/home/trusted-by';
import { Stats } from '@/components/marketing/home/stats';
import { HowItWorks } from '@/components/marketing/home/how-it-works';
import { GetStartedCards } from '@/components/marketing/home/get-started-cards';
import { FeaturesGrid } from '@/components/marketing/home/features-grid';
import { ServicesTabs } from '@/components/marketing/home/services-tabs';
import { CaseStudiesCarousel } from '@/components/marketing/home/case-studies-carousel';
import { Testimonials } from '@/components/marketing/home/testimonials';
import { PricingTeaser } from '@/components/marketing/home/pricing-teaser';
import { FaqAccordion } from '@/components/marketing/home/faq';
import { FinalCta } from '@/components/marketing/home/final-cta';

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Video editing that keeps your pace`,
  description:
    'Send your footage and get polished long-form, short-form, and managed channel videos without building an in-house editing team.',
};

interface HomeData {
  testimonials: Testimonial[];
  caseStudies: CaseStudy[];
  faqItems: FaqItem[];
  packages: Package[];
}

const EMPTY_HOME_DATA: HomeData = {
  testimonials: [],
  caseStudies: [],
  faqItems: [],
  packages: [],
};

function selectFeaturedPackages(packages: Package[], limit = 3) {
  const selected: Package[] = [];
  const kinds: Package['kind'][] = ['HORIZONTAL', 'VERTICAL', 'THUMBNAIL'];

  for (const kind of kinds) {
    const match = packages.find((item) => item.kind === kind);

    if (match) {
      selected.push(match);
    }

    if (selected.length === limit) {
      return selected;
    }
  }

  for (const item of packages) {
    if (selected.length === limit) {
      break;
    }

    if (!selected.some((selectedItem) => selectedItem.id === item.id)) {
      selected.push(item);
    }
  }

  return selected.slice(0, limit);
}

async function getHomeData(): Promise<HomeData> {
  try {
    const supabase = createClient();

    const [testimonialsResult, caseStudiesResult, faqResult, packagesResult] =
      await Promise.all([
        supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('case_studies')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('faq_items')
          .select('*')
          .eq('is_published', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('packages')
          .select('*')
          .eq('is_active', true)
          .order('video_count', { ascending: true }),
      ]);

    const activePackages = packagesResult.error
      ? []
      : ((packagesResult.data as Package[] | null) ?? []);

    return {
      testimonials: testimonialsResult.error
        ? []
        : ((testimonialsResult.data as Testimonial[] | null) ?? []),
      caseStudies: caseStudiesResult.error
        ? []
        : ((caseStudiesResult.data as CaseStudy[] | null) ?? []),
      faqItems: faqResult.error
        ? []
        : ((faqResult.data as FaqItem[] | null) ?? []),
      packages: selectFeaturedPackages(activePackages),
    };
  } catch {
    return EMPTY_HOME_DATA;
  }
}

export default async function MarketingHomePage() {
  const { testimonials, caseStudies, faqItems, packages } =
    await getHomeData();

  return (
    <>
      <Hero />
      <TrustedBy />
      <Stats />
      <HowItWorks />
      <GetStartedCards />
      <FeaturesGrid />
      <ServicesTabs />
      <CaseStudiesCarousel caseStudies={caseStudies} />
      <Testimonials testimonials={testimonials} />
      <PricingTeaser packages={packages} />
      <FaqAccordion items={faqItems} />
      <FinalCta />
    </>
  );
}
