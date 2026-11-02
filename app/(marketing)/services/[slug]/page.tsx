import type { Metadata } from 'next';
import Image from 'next/image';
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
const SERVICE_HERO_IMAGES: Record<ServiceSlug, { src: string; alt: string }> = {
  'long-form': {
    src: '/service-mockups/service-long-form-editing.png',
    alt: 'Long-form editing workspace with a video preview, caption controls, export settings, color grading, and a multitrack timeline.',
  },
  'short-form': {
    src: '/service-mockups/service-short-form-editing.png',
    alt: 'Short-form editing workspace with a vertical video preview, caption styles, social formats, export settings, and a clip timeline.',
  },
  'channel-management': {
    src: '/service-mockups/service-channel-management.png',
    alt: 'Channel management workspace with a publishing flow, episode list, editing crew, video preview, and performance analytics.',
  },
};

function getHeroVisual(slug: ServiceSlug) {
  const image = SERVICE_HERO_IMAGES[slug];

  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <Image
        src={image.src}
        alt={image.alt}
        width={1536}
        height={1024}
        sizes="(max-width: 1024px) 100vw, 55vw"
        priority
        className="h-auto w-full object-contain lg:scale-[1.2]"
      />
    </div>
  );
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
