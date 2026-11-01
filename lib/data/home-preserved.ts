// Preserved content from old home sections (for potential reuse)
// These sections were removed in the redesign:
// - Stats (hardcoded: 24-48h, 4.9/5, 1,200+, 87%)
// - HowItWorks (interactive tabs)
// - GetStartedCards (3 cards: single order, package, channel management)
// - FeaturesGrid (6 features)
// - ServicesTabs (3 services: long-form, short-form, channel management)
// - CaseStudiesCarousel (from Supabase)
// - Testimonials (from Supabase)

export const preservedStats = [
  {
    value: '24–48h',
    label: 'Typical first-cut turnaround',
    hint: 'Starts when footage lands',
    icon: 'clock',
  },
  {
    value: '4.9/5',
    label: 'Average review score',
    hint: 'Across 300+ deliveries',
    icon: 'sparkles',
  },
  {
    value: '1,200+',
    label: 'Videos shipped',
    hint: 'Long-form, short-form, and ads',
    icon: 'video',
  },
  {
    value: '87%',
    label: 'Teams that reorder',
    hint: 'Within their first month',
    icon: 'trend',
  },
] as const;

export const preservedServices = [
  {
    key: 'long-form',
    label: 'Long-form',
    title: 'Deep dives with a story spine',
    description:
      'Interviews, essays, documentaries, and flagship uploads shaped into something people finish.',
    href: '/services/long-form',
    cta: 'Explore long-form editing',
    features: [
      'Story-first paper edit',
      'Color, sound, and captions',
      'Chapter markers and clean exports',
    ],
  },
  {
    key: 'short-form',
    label: 'Short-form',
    title: 'Cuts built for the first three seconds',
    description:
      'Vertical clips with a strong hook, readable captions, and pacing that survives a fast feed.',
    href: '/services/short-form',
    cta: 'Explore short-form editing',
    features: [
      'Hook-first structure',
      'Kinetic captions and clean type',
      'Native exports for every platform',
    ],
  },
  {
    key: 'channel-management',
    label: 'Channel management',
    title: 'A publishing partner, not just an editor',
    description:
      'Hand over the weekly rhythm: planning, titles, thumbnails, uploads, and a clear performance recap.',
    href: '/services/channel-management',
    cta: 'Explore channel management',
    features: [
      'Weekly content planning',
      'Titles and thumbnail concepts',
      'Upload scheduling and recaps',
    ],
  },
] as const;

export const preservedFeatures = [
  {
    title: 'Dedicated team',
    description:
      'Every order goes to a small, accountable crew with a named contact and a clear handoff.',
  },
  {
    title: 'Multiple specialists',
    description:
      'Editing, motion, color, and sound sit in the same workflow, so polish never waits in a queue.',
  },
  {
    title: 'Live progress',
    description:
      'Track drafts, comments, and approvals in one place instead of chasing updates across inboxes.',
  },
  {
    title: 'Useful revisions',
    description:
      'Leave timecoded notes and get a clear response. We explain the trade-offs before pushing back.',
  },
  {
    title: '24–48 hour turnaround',
    description:
      'Most packages start shipping within a day. Long-form builds get a schedule you can plan around.',
  },
  {
    title: 'One order dashboard',
    description:
      'Status, footage, drafts, comments, and final downloads stay together from kickoff to delivery.',
  },
] as const;

export const preservedGetStartedCards = [
  {
    title: 'Order one video',
    tag: 'Single project',
    description:
      'Perfect for a launch, interview, or flagship upload. Send the brief and footage; we return a polished cut.',
    features: [
      'One dedicated editor',
      'Two revision rounds',
      'Every export format',
    ],
    href: '/signup',
    cta: 'Start an order',
  },
  {
    title: 'Buy a package',
    tag: 'Most popular',
    description:
      'Reserve a monthly block of edits and keep a steady publishing rhythm with priority scheduling.',
    features: [
      'Priority turnaround',
      'Rollover editing hours',
      'Monthly strategy check-in',
    ],
    href: '/pricing',
    cta: 'Compare packages',
  },
  {
    title: 'Channel management',
    tag: 'Full service',
    description:
      'Hand over publishing, titles, thumbnails, and weekly planning to a crew that knows the channel.',
    features: [
      'Upload and scheduling',
      'Thumbnail concepts',
      'Performance recap',
    ],
    href: '/services/channel-management',
    cta: 'Explore management',
  },
] as const;
