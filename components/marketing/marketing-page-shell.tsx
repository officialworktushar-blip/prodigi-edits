import type { ReactNode } from 'react';
import {
  FeatureSplit,
  GradientCTABanner,
  PageHero,
  PainSection,
  ReviewsWall,
  SectionIllustration,
  WaySection,
} from '@/components/sections';
import { UseCaseHeroMockup } from '@/components/marketing/use-cases/use-case-hero-mockup';
import type { MarketingPageContent } from '@/lib/data/marketing-pages';

export interface MarketingPageShellProps {
  content: MarketingPageContent;
  afterHero?: ReactNode;
  afterPain?: ReactNode;
  afterWay?: ReactNode;
  beforeCta?: ReactNode;
}

export function MarketingPageShell({
  content,
  afterHero,
  afterPain,
  afterWay,
  beforeCta,
}: MarketingPageShellProps) {
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
      <PageHero
        eyebrow={content.eyebrow}
        title={content.headline}
        highlight={content.highlight}
        description={content.description}
        primaryAction={content.primaryAction}
        secondaryAction={content.secondaryAction}
        visual={<UseCaseHeroMockup mockup={content.heroMockup} />}
        tone="dark"
        pill={null}
      />

      {afterHero}

      <PainSection
        eyebrow={content.pain.eyebrow}
        title={content.pain.title}
        highlight={content.pain.highlight}
        description={content.pain.description}
        items={content.pain.items}
      />

      {afterPain}

      <WaySection
        eyebrow={content.way.eyebrow}
        title={content.way.title}
        highlight={content.way.highlight}
        description={content.way.description}
        cards={wayCards}
      />

      {afterWay}

      {content.features.map((feature, index) => (
        <FeatureSplit
          key={feature.title}
          eyebrow={feature.eyebrow}
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

      {beforeCta}

      <GradientCTABanner
        eyebrow={content.cta.eyebrow}
        title={content.cta.title}
        accent={content.cta.accent}
        description={content.cta.description}
        primaryAction={content.cta.primaryAction}
        secondaryAction={content.cta.secondaryAction}
      />

      <ReviewsWall />
    </>
  );
}
