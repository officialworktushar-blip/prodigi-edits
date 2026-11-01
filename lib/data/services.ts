import type { SectionIllustrationName } from '../../components/sections';

export type ServiceSlug = 'long-form' | 'short-form' | 'channel-management';

export interface ServiceAction {
  label: string;
  href: string;
}

export interface ServicePainItem {
  title: string;
  description: string;
}

export interface ServiceWayCard {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
  illustration: SectionIllustrationName;
}

export interface ServiceFeatureBullet {
  title: string;
  description?: string;
}

export interface ServiceFeature {
  title: string;
  highlight?: string;
  description: string;
  bullets: ServiceFeatureBullet[];
  mockup: SectionIllustrationName;
}

export interface ServicePageContent {
  slug: ServiceSlug;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  primaryAction: ServiceAction;
  secondaryAction: ServiceAction;
  pain: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    items: ServicePainItem[];
  };
  way: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    cards: ServiceWayCard[];
  };
  features: ServiceFeature[];
  cta: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primaryAction: ServiceAction;
  };
}

export const SERVICE_PAGE_DATA: Record<ServiceSlug, ServicePageContent> = {
  'long-form': {
    slug: 'long-form',
    eyebrow: 'Long-form editing',
    title: 'Long-form edits that people actually finish',
    highlight: 'actually finish',
    description:
      'Interviews, essays, documentaries, and flagship uploads shaped into a clear story spine, with pacing, sound, and captions finished together.',
    primaryAction: { label: 'Start an order', href: '/signup' },
    secondaryAction: { label: 'See pricing', href: '/pricing' },
    pain: {
      eyebrow: 'The problem',
      title: 'Long videos drain your week',
      highlight: 'drain',
      description: 'The footage is there. The time and structure are not.',
      items: [
        {
          title: 'Time crunch',
          description:
            'Hours of cutting that should take a day, then another pass for sound and color.',
        },
        {
          title: 'Story friction',
          description:
            'Raw footage with no spine, so every timeline decision turns into a debate.',
        },
        {
          title: 'Unpolished results',
          description:
            'Weak pacing and uneven sound give viewers a reason to leave before the ending.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The story-first way',
      highlight: 'story-first way',
      description:
        'Structure first, polish second. The story is settled before the finishing work starts.',
      cards: [
        {
          eyebrow: 'Before the edit',
          title: 'Story-first paper edit',
          description:
            'We read the transcript, mark the strongest turns, and agree on the spine before the timeline gets complicated.',
          href: '/examples',
          linkLabel: 'See the work',
          illustration: 'timeline',
        },
        {
          eyebrow: 'After picture lock',
          title: 'Color, sound and captions',
          description:
            'Once the story holds, we finish the grade, clean the dialogue, shape the mix, and set captions.',
          href: '/examples',
          linkLabel: 'View examples',
          illustration: 'caption',
        },
      ],
    },
    features: [
      {
        title: 'Chapter markers and clean exports',
        highlight: 'clean exports',
        description:
          'Give viewers a map through long videos and hand every platform a tidy master.',
        bullets: [
          {
            title: 'Chapter markers that match the story beats',
            description: 'Viewers can jump to the part they came for.',
          },
          {
            title: 'Clean masters plus platform-ready exports',
            description: 'One approved cut becomes every file you need.',
          },
          {
            title: 'Captions prepared with the cut',
            description: 'No separate scramble after approval.',
          },
          {
            title: 'A delivery shelf that stays available',
            description: 'Final files remain easy to find after the order closes.',
          },
        ],
        mockup: 'course',
      },
      {
        title: 'Timecoded review that stays calm',
        highlight: 'stays calm',
        description:
          'Notes land on the moment they refer to, so the next pass starts with context instead of a thread.',
        bullets: [
          {
            title: 'Comment on the exact frame',
            description: 'No timestamps copied into an email.',
          },
          {
            title: 'One review room for structure, pacing, and sound',
            description: 'Every note stays attached to the order.',
          },
          {
            title: 'Clear status from first cut to picture lock',
            description: 'You always know what happens next.',
          },
          {
            title: 'Revisions answered with the trade-offs explained',
            description: 'A clear response instead of a silent re-cut.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        title: 'One dashboard from brief to delivery',
        highlight: 'brief to delivery',
        description:
          'Footage, drafts, comments, and finals stay in one visible order.',
        bullets: [
          {
            title: 'The brief and footage arrive in the same place',
            description: 'No chasing files across chat and inbox.',
          },
          {
            title: 'Every draft and note stays attached to the order',
            description: 'The history is easy to follow.',
          },
          {
            title: 'Approvals and downloads live on one shelf',
            description: 'The final handoff is part of the workflow.',
          },
          {
            title: 'No mystery versions or lost files',
            description: 'Everyone sees the same current cut.',
          },
        ],
        mockup: 'analytics',
      },
    ],
    cta: {
      eyebrow: 'Ready when the footage is',
      title: 'Put a real editing crew behind',
      accent: 'your next long-form',
      description:
        'Send the footage and the deadline. We will turn them into a finished video with a clear path from brief to delivery.',
      primaryAction: { label: 'Start an order', href: '/signup' },
    },
  },
  'short-form': {
    slug: 'short-form',
    eyebrow: 'Short-form editing',
    title: 'Short-form that stops the scroll',
    highlight: 'stops the scroll',
    description:
      'Vertical clips with a strong hook, readable captions, and pacing that survives a fast feed.',
    primaryAction: { label: 'Start an order', href: '/signup' },
    secondaryAction: { label: 'See pricing', href: '/pricing' },
    pain: {
      eyebrow: 'The problem',
      title: "Shorts are fast. Editing them shouldn't be slow",
      highlight: 'fast',
      description:
        'The format moves quickly. The work behind it should not.',
      items: [
        {
          title: 'Daily pressure',
          description:
            "A new clip is due before yesterday's edit has room to breathe.",
        },
        {
          title: 'Caption busywork',
          description:
            'Transcribing, styling, and re-cropping captions should not eat the day.',
        },
        {
          title: 'Inconsistent look',
          description:
            'Every clip looks like it came from a different channel.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The scroll-stopping way',
      highlight: 'scroll-stopping way',
      description:
        'Hook first, then pace, captions, and crops that feel native to the feed.',
      cards: [
        {
          eyebrow: 'The opening',
          title: 'Hooks and pacing',
          description:
            'The opening frame, first line, and cut rhythm are built together instead of patched on at the end.',
          href: '/examples',
          linkLabel: 'See the cuts',
          illustration: 'timeline',
        },
        {
          eyebrow: 'The look',
          title: 'Captions and brand styling',
          description:
            'Readable captions, safe-zone framing, and consistent type make every clip feel like the same channel.',
          href: '/examples',
          linkLabel: 'View examples',
          illustration: 'caption',
        },
      ],
    },
    features: [
      {
        title: 'A caption style library that stays on brand',
        highlight: 'stays on brand',
        description:
          'Pick a look once, then every clip carries the same type, color, and safe-zone rules.',
        bullets: [
          {
            title: 'Readable caption styles for vertical frames',
            description: 'Type that holds up on a small screen.',
          },
          {
            title: 'Brand colors and type across every clip',
            description:
              'The feed recognizes the channel before the logo.',
          },
          {
            title: 'Safe-zone framing for platform controls',
            description: 'Captions stay clear of buttons and handles.',
          },
          {
            title: 'A repeatable system instead of one-off fixes',
            description: 'New clips start from the same rules.',
          },
        ],
        mockup: 'thumbnails',
      },
      {
        title: 'One cut, native exports for every platform',
        highlight: 'every platform',
        description:
          'Shorts, Reels, and TikTok get the ratios and framing they expect without a separate edit.',
        bullets: [
          {
            title: 'YouTube Shorts, Instagram Reels, and TikTok versions',
            description: 'The same idea, framed for each feed.',
          },
          {
            title: 'Vertical 9:16 masters with clean crops',
            description: 'No awkward reframing at the edges.',
          },
          {
            title: 'Platform-specific captions and end cards',
            description: 'Each export is ready to publish.',
          },
          {
            title: 'Batch delivery for the publishing calendar',
            description: 'Clips arrive together, not one at a time.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        title: 'A revision loop that keeps up with the feed',
        highlight: 'keeps up with the feed',
        description:
          'Comment on the hook, pace, captions, or framing in one pass and get the next version back inside 24–48h.',
        bullets: [
          {
            title: 'Timecoded notes on the exact moment',
            description: 'The note points at the frame that needs work.',
          },
          {
            title: 'One place for hook, caption, and crop changes',
            description: 'No split feedback across apps.',
          },
          {
            title: 'Next version back inside 24–48h',
            description: 'The schedule keeps moving.',
          },
          {
            title: 'A clear status from first cut to delivery',
            description: 'You know when to review and when to post.',
          },
        ],
        mockup: 'analytics',
      },
    ],
    cta: {
      eyebrow: 'Built for the feed',
      title: 'Turn a long recording into',
      accent: 'a week of short-form',
      description:
        'Send the source and the platforms. We will handle hooks, captions, crops, and the batch your calendar needs.',
      primaryAction: { label: 'Start an order', href: '/signup' },
    },
  },
  'channel-management': {
    slug: 'channel-management',
    eyebrow: 'Channel management',
    title: 'A crew that runs your channel end to end',
    highlight: 'end to end',
    description:
      'Planning, editing, packaging, and publishing move through one weekly rhythm, with a clear read on what to do next.',
    primaryAction: { label: 'Start an order', href: '/signup' },
    secondaryAction: { label: 'See pricing', href: '/pricing' },
    pain: {
      eyebrow: 'The problem',
      title: 'Running a channel is a second job',
      highlight: 'second job',
      description:
        'The upload schedule does not pause while you film, edit, and answer comments.',
      items: [
        {
          title: 'Upload and scheduling chaos',
          description:
            'Files, approvals, and publish dates live in different tabs.',
        },
        {
          title: 'Thumbnail and title guesswork',
          description:
            'Packaging gets decided at the last minute, then revised after the upload.',
        },
        {
          title: 'No weekly planning',
          description:
            'Every week starts from scratch instead of building on what worked.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The hands-off way',
      highlight: 'hands-off way',
      description:
        'One team owns the weekly rhythm, from the plan to the publish button.',
      cards: [
        {
          eyebrow: 'The schedule',
          title: 'Upload and scheduling',
          description:
            'The calendar, files, and publish windows stay in one visible order.',
          href: '/pricing',
          linkLabel: 'See plans',
          illustration: 'calendar',
        },
        {
          eyebrow: 'The packaging',
          title: 'Thumbnails, titles and weekly planning',
          description:
            'Packaging is prepared before the upload window, with a clear plan for what comes next.',
          href: '/examples',
          linkLabel: 'See packaging',
          illustration: 'course',
        },
      ],
    },
    features: [
      {
        title: 'A weekly plan you can actually follow',
        highlight: 'actually follow',
        description:
          'The calendar starts with the stories worth telling, then maps the formats around them.',
        bullets: [
          {
            title: 'A forward-looking plan for flagship videos and shorts',
            description: 'The week has a shape before it starts.',
          },
          {
            title: 'Clear owners and status for every handoff',
            description: 'Nothing waits in a quiet queue.',
          },
          {
            title: 'Publishing windows that match your rhythm',
            description:
              'The schedule fits the team, not the other way around.',
          },
          {
            title: 'One place to see what happens next',
            description: 'Planning stays visible to everyone.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        title: 'Thumbnail concepts before the upload window',
        highlight: 'before the upload window',
        description:
          'Titles and thumbnail directions are prepared while the edit is still moving.',
        bullets: [
          {
            title: 'Concepts built around one clear idea',
            description: 'The packaging starts with the promise.',
          },
          {
            title: 'Titles and thumbnail directions reviewed together',
            description: 'The pair works as a unit.',
          },
          {
            title: 'Packaging ready before the publish date',
            description: 'No last-minute scramble.',
          },
          {
            title: 'A consistent look across the channel',
            description: 'The shelf feels like one body of work.',
          },
        ],
        mockup: 'thumbnails',
      },
      {
        title: "A performance recap that turns into next week's plan",
        highlight: "next week's plan",
        description:
          'A plain-language read on what worked, what stalled, and what to adjust.',
        bullets: [
          {
            title: 'A weekly read on the videos that earned attention',
            description: 'See where viewers stayed and where they left.',
          },
          {
            title: 'Notes on what stalled and why',
            description: 'A useful explanation, not just a chart.',
          },
          {
            title: 'Adjustments mapped to the next calendar',
            description: 'The recap changes what gets planned.',
          },
          {
            title: 'One shared view for the team',
            description: 'Everyone works from the same read.',
          },
        ],
        mockup: 'analytics',
      },
    ],
    cta: {
      eyebrow: 'Take back the week',
      title: 'Hand over the',
      accent: 'weekly rhythm',
      description:
        'Keep the creative decisions. Let the crew handle planning, packaging, publishing, and the recap.',
      primaryAction: { label: 'Start an order', href: '/signup' },
    },
  },
};

const SERVICE_PAGES = SERVICE_PAGE_DATA as Record<
  string,
  ServicePageContent | undefined
>;

export function getServicePage(slug: string): ServicePageContent | undefined {
  return SERVICE_PAGES[slug];
}

export default SERVICE_PAGE_DATA;
