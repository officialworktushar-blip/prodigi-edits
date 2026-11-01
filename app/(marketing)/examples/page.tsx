import type { Metadata } from 'next';
import { BRAND_NAME } from '@/lib/config';
import { getMarketingPageContent } from '@/lib/data/marketing-pages';
import { ExamplesGallery } from '@/components/marketing/examples/examples-gallery';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';

export const metadata: Metadata = {
  title: `Examples — ${BRAND_NAME}`,
  description:
    'Browse representative long-form, short-form, vertical, and channel packaging examples arranged by format. These are layout examples, not client reels.',
};

export default function ExamplesPage() {
  const content = getMarketingPageContent('examples');

  return (
    <MarketingPageShell
      content={content}
      afterWay={<ExamplesGallery />}
    />
  );
}
