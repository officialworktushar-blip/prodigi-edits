import type { Metadata } from 'next';
import { BRAND_NAME } from '@/lib/config';
import { getMarketingPageContent } from '@/lib/data/marketing-pages';
import { MarketingPageShell } from '@/components/marketing/marketing-page-shell';

export const metadata: Metadata = {
  title: `Platform — ${BRAND_NAME}`,
  description:
    'A shared workspace for the brief, footage, timecoded review notes, approvals, and final delivery.',
};

export default function PlatformPage() {
  const content = getMarketingPageContent('platform');

  return (
    <MarketingPageShell content={content} />
  );
}
