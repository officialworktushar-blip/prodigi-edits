import { BRAND_NAME } from '@/lib/config';

export const SERVICE_PAGE_DATA = {
  'long-form': {
    slug: 'long-form',
    headline: 'Long-Form Editing',
    description: 'Master your cuts from rough assembly to broadcast-ready polish. We tighten pacing, retime durations, fix audio flutters, grade colors evenly, and deliver clean export masters in under two days.',
    highlight: 'two-day turnaround',
    pill: 'Ship any cut fast',
    cta: '/signup',
    stats: [
      { label: 'Order speed', value: '≤ 48 h' },
      { label: 'Drop-in revisions', value: 'unlimited' },
      { label: 'Dedicated editor', value: 'one per order' },
    ],
  },
  'short-form': {
    slug: 'short-form',
    headline: 'Short-Form Editing',
    description: 'Hooks that stick and cuts that convert. We snap to trending sound, batch-cut templates, auto-caption with brand style, and produce vertical 9:16 master clips ready to post across every social platform.',
    highlight: '24 h turnaround',
    pill: 'Ship before you sleep',
    cta: '/signup',
    stats: [
      { label: 'Turnaround', value: '24 h' },
      { label: 'Add-on captions', value: 'yes' },
      { label: 'Platforms', value: 'TikTok · IG Reels · YouTube Shorts' },
    ],
  },
  'channel-management': {
    slug: 'channel-management',
    headline: 'Channel Management',
    description: 'One workspace, every platform — coordinate cross-channel releases, scheduled publishing, and approvals without juggling copies. From a single dashboard you manage all your editing jobs at once.',
    highlight: 'every platform, one place',
    pill: 'Bundle, save time',
    cta: '/signup',
    stats: [
      { label: 'Channels', value: '8' },
      { label: 'Editors per workspace', value: 'unlimited' },
      { label: 'Cross-release scheduling', value: 'built-in' },
    ],
  },
} as const;

export function getServicePage(slug: string) {
  return SERVICE_PAGE_DATA[slug];
}

export default SERVICE_PAGE_DATA;