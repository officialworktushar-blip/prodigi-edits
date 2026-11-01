import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRAND_NAME } from '@/lib/config';
import {
  SERVICE_PAGE_DATA,
  getServicePage,
  type ServiceSlug,
} from '@/lib/data/services';
import {
  FeatureSplit,
  GradientCTABanner,
  PageHero,
  PainSection,
  ReviewsWall,
  SectionIllustration,
  WaySection,
} from '@/components/sections';
import {
  ChannelManagementHeroMockup,
  LongFormHeroMockup,
  ShortFormHeroMockup,
} from '@/components/marketing/services/service-hero-mockups';

function getHeroVisual(slug: ServiceSlug) {
  if (slug === 'short-form') {
    return <ShortFormHeroMockup />;
  }

  if (slug === 'channel-management') {
    return <ChannelManagementHeroMockup />;
  }

  return <LongFormHeroMockup />;
}

export function generateStaticParams() {
  return (Object.keys(SERVICE_PAGE_DATA) as ServiceSlug[]).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getServicePage(params.slug);

  if (!page) {
    return {
      title: `Service not found — ${BRAND_NAME}`,
    };
  }

  return {
    title: `${page.title} — ${BRAND_NAME}`,
    description: page.description,
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getServicePage(params.slug);

  if (!page) {
    notFound();
  }

  const wayCards = page.way.cards.map((card) => ({
    ...card,
    illustration: (
      <SectionIllustration
        name={card.illustration}
        className="h-full w-full"
      />
    ),
  }));

  return (
    <>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        highlight={page.highlight}
        highlightClassName="italic"
        description={page.description}
        primaryAction={page.primaryAction}
        secondaryAction={page.secondaryAction}
        visual={getHeroVisual(page.slug)}
        tone="dark"
        pill={null}
      />

      <PainSection
        eyebrow={page.pain.eyebrow}
        title={page.pain.title}
        highlight={page.pain.highlight}
        description={page.pain.description}
        items={page.pain.items}
      />

      <WaySection
        eyebrow={page.way.eyebrow}
        title={page.way.title}
        highlight={page.way.highlight}
        description={page.way.description}
        cards={wayCards}
      />

      {page.features.map((feature, index) => (
        <FeatureSplit
          key={feature.title}
          eyebrow="What changes"
          title={feature.title}
          highlight={feature.highlight}
          description={feature.description}
          bullets={feature.bullets}
          mockup={
            <SectionIllustration
              name={feature.mockup}
              className="h-full w-full"
            />
          }
          reverse={index % 2 === 1}
        />
      ))}

      <GradientCTABanner
        eyebrow={page.cta.eyebrow}
        title={page.cta.title}
        accent={page.cta.accent}
        description={page.cta.description}
        primaryAction={page.cta.primaryAction}
      />

      <ReviewsWall />
    </>
  );
}
