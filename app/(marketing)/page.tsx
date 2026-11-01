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
import { CreateVideosSection } from '@/components/marketing/home/create-videos-section';
import { ThreeWaysSection } from '@/components/marketing/home/three-ways-section';
import { KeepCalmSection } from '@/components/marketing/home/keep-calm-section';
import { PricingTeaser } from '@/components/marketing/home/pricing-teaser';
import { FaqAccordion } from '@/components/marketing/home/faq';
import { FinalCta } from '@/components/marketing/home/final-cta';

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Video editing that keeps your pace`,
  description:
    'Send your footage and get polished long-form, short-form, and managed channel videos without building an in-house editing team.',
};

interface HomeData {
  faqItems: FaqItem[];
  packages: Package[];
}

const EMPTY_HOME_DATA: HomeData = {
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

    const [faqResult, packagesResult] = await Promise.all([
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
  const { faqItems, packages } = await getHomeData();

  return (
    <>
      <Hero />
      <TrustedBy />
      <CreateVideosSection />
      <ThreeWaysSection />
      <KeepCalmSection />
      <PricingTeaser packages={packages} />
      <FaqAccordion items={faqItems} />
      <FinalCta />
    </>
  );
}
