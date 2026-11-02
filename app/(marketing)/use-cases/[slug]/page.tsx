import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRAND_NAME } from '@/lib/config';
import { USE_CASES, getUseCasePage } from '@/lib/data/use-cases';
import { getUseCasePageContent } from '@/lib/data/use-case-pages';
import {
  FeatureSplit,
  GradientCTABanner,
  PainSection,
  ReviewsWall,
  SectionIllustration,
  WaySection,
} from '@/components/sections';
import { UseCaseHero } from '@/components/marketing/use-cases/use-case-hero';
import {
  BusinessesHeroVisual,
  CourseCreatorsHeroVisual,
  DoctorsHeroVisual,
  LawyersHeroVisual,
  PodcastersHeroVisual,
  RealtorsHeroVisual,
  YouTubersHeroVisual,
} from '@/components/marketing/use-cases/use-case-hero-visuals';

function getHeroMockup(slug: string) {
  const mockupMap: Record<string, JSX.Element> = {
    youtubers: <YouTubersHeroVisual />,
    businesses: <BusinessesHeroVisual />,
    podcasters: <PodcastersHeroVisual />,
    realtors: <RealtorsHeroVisual />,
    'course-creators': <CourseCreatorsHeroVisual />,
    doctors: <DoctorsHeroVisual />,
    lawyers: <LawyersHeroVisual />,
  };
  return mockupMap[slug];
}

export function generateStaticParams() {
  return USE_CASES.map((useCase) => ({
    slug: useCase.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = getUseCasePage(params.slug);

  if (!page) {
    return {
      title: `Use case not found — ${BRAND_NAME}`,
    };
  }

  const content = getUseCasePageContent(params.slug);

  return {
    title: `Video editing for ${page.label} — ${BRAND_NAME}`,
    description: content?.description ?? page.description,
  };
}

export default function UseCasePage({
  params,
}: {
  params: { slug: string };
}) {
  const page = getUseCasePage(params.slug);
  const content = getUseCasePageContent(params.slug);

  if (!page || !content) {
    notFound();
  }

  const wayCards = content.way.cards.map((card) => ({
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
      <UseCaseHero
        eyebrow={content.eyebrow}
        title={content.headline}
        highlight={content.highlight}
        description={content.description}
        primaryAction={content.primaryAction}
        secondaryAction={content.secondaryAction}
        visual={getHeroMockup(params.slug)}
      />

      <PainSection
        eyebrow={content.pain.eyebrow}
        title={content.pain.title}
        highlight={content.pain.highlight}
        description={content.pain.description}
        items={content.pain.items}
      />

      <WaySection
        eyebrow={content.way.eyebrow}
        title={content.way.title}
        highlight={content.way.highlight}
        description={content.way.description}
        cards={wayCards}
      />

      {content.features.map((feature, index) => (
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
        eyebrow={content.cta.eyebrow}
        title={content.cta.title}
        accent={content.cta.accent}
        description={content.cta.description}
        primaryAction={content.cta.primaryAction}
      />

      <ReviewsWall />
    </>
  );
}
