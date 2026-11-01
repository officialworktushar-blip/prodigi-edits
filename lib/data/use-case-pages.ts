import type { PageHeroMockup, SectionIllustrationName } from '../../components/sections';
import type { UseCaseSlug } from './use-cases';

export interface UseCasePageAction {
  label: string;
  href: string;
}

export interface UseCasePainItem {
  title: string;
  description: string;
}

export interface UseCaseWayCard {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
  illustration: SectionIllustrationName;
}

export interface UseCaseFeatureBullet {
  title: string;
  description?: string;
}

export interface UseCaseFeature {
  title: string;
  highlight?: string;
  description: string;
  bullets: UseCaseFeatureBullet[];
  mockup: SectionIllustrationName;
}

export interface UseCasePageContent {
  slug: UseCaseSlug;
  eyebrow: string;
  headline: string;
  highlight: string;
  description: string;
  primaryAction: UseCasePageAction;
  secondaryAction: UseCasePageAction;
  heroMockup: PageHeroMockup;
  pain: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    items: UseCasePainItem[];
  };
  way: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    cards: UseCaseWayCard[];
  };
  features: UseCaseFeature[];
  cta: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primaryAction: UseCasePageAction;
  };
}

const START_ORDER: UseCasePageAction = {
  label: 'Start an order',
  href: '/signup',
};

const SEE_PRICING: UseCasePageAction = {
  label: 'See pricing',
  href: '/pricing',
};

export const USE_CASE_PAGES: Record<UseCaseSlug, UseCasePageContent> = {
  youtubers: {
    slug: 'youtubers',
    eyebrow: 'For YouTubers',
    headline: 'Edits that grow your channel',
    highlight: 'grow your channel',
    description:
      'A steady edit rhythm for flagship videos, shorts, and the packaging around them, built around the publishing calendar instead of an empty weekend.',
    primaryAction: START_ORDER,
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Creator workspace',
      toolbarLabel: 'Channel · weekly rhythm',
      status: 'On schedule',
      toolbarItems: ['Plan', 'Edit', 'Package', 'Publish'],
      railLabel: 'This week',
      clips: [
        { label: 'Flagship', from: '#38bdf8', to: '#6366f1' },
        { label: 'Shorts', from: '#a78bfa', to: '#ec4899' },
        { label: 'Thumbnail', from: '#fbbf24', to: '#fb7185' },
        { label: 'Publish', from: '#2dd4bf', to: '#3b82f6' },
      ],
      activeClipIndex: 0,
      canvasLabel: 'Retention pass',
      canvasCaption: 'Strong opening, clear turns, clean finish',
      popoverTitle: 'Channel palette',
      swatches: ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'],
      timelineLabel: 'Upload week',
      timelineSegments: [
        { label: 'Film', width: '24%', color: '#38bdf8' },
        { label: 'Edit', width: '42%', color: '#a78bfa' },
        { label: 'Package', width: '22%', color: '#f472b6' },
        { label: 'Publish', width: '12%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The problem',
      title: 'The schedule is always one edit behind',
      highlight: 'one edit behind',
      description:
        'The channel needs consistency, but every upload competes with the next shoot.',
      items: [
        {
          title: 'Filming vs editing time',
          description:
            'Every video competes with the next shoot, and the timeline keeps taking the hours you meant to spend creating.',
        },
        {
          title: 'Retention drops',
          description:
            'A slow opening or an uneven middle gives viewers a reason to leave before the idea lands.',
        },
        {
          title: 'Inconsistent uploads',
          description:
            'A long edit or a launch week pushes the next video out of the calendar, and the rhythm resets.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The creator-first way',
      highlight: 'creator-first way',
      description:
        'The channel rhythm comes first, then the edit and packaging are built to protect it.',
      cards: [
        {
          eyebrow: 'The cut',
          title: 'Retention-first pacing',
          description:
            'Openings, story turns, and cut rhythm are shaped to hold attention, not just fill the timeline.',
          href: '/examples',
          linkLabel: 'See the cuts',
          illustration: 'timeline',
        },
        {
          eyebrow: 'The package',
          title: 'Thumbnails and titles',
          description:
            'Packaging is developed alongside the edit, so the title, thumbnail, and video make one clear promise.',
          href: '/examples',
          linkLabel: 'See packaging',
          illustration: 'thumbnails',
        },
      ],
    },
    features: [
      {
        title: 'A daily upload rhythm that holds',
        highlight: 'daily upload rhythm',
        description:
          'The calendar, edits, and packaging move together, so every publish window starts with a plan.',
        bullets: [
          {
            title: 'A forward calendar for flagship videos and shorts',
            description: 'The week has a shape before the first cut.',
          },
          {
            title: 'Packaging prepared before the upload window',
            description: 'Titles and thumbnails do not wait for the final export.',
          },
          {
            title: 'One visible status from footage to publish',
            description: 'Everyone knows what is next.',
          },
          {
            title: 'A repeatable cadence instead of last-minute pushes',
            description: 'The channel keeps moving when the week gets busy.',
          },
        ],
        mockup: 'calendar',
      },
      {
        title: 'Timecoded revisions without the thread',
        highlight: 'timecoded revisions',
        description:
          'Notes land on the exact frame, so the next pass starts with context and the schedule keeps moving.',
        bullets: [
          {
            title: 'Comment on the frame that needs work',
            description: 'No timestamps copied into a separate message.',
          },
          {
            title: 'One review room for cuts, captions, and sound',
            description: 'Every note stays attached to the video.',
          },
          {
            title: 'Clear status from first cut to approval',
            description: 'The next step is visible in the workspace.',
          },
          {
            title: 'A response that explains what changed',
            description: 'The revision comes back with the reasoning included.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        title: 'A channel management add-on for busy weeks',
        highlight: 'channel management add-on',
        description:
          'Hand over planning, packaging, and publishing when the week gets tight, while keeping the creative decisions.',
        bullets: [
          {
            title: 'A weekly plan for flagship videos and shorts',
            description: 'The calendar holds both long-form and vertical work.',
          },
          {
            title: 'Thumbnail and title concepts prepared in advance',
            description: 'Packaging starts before the upload window.',
          },
          {
            title: 'Publishing windows that fit the channel',
            description: 'The schedule follows the creator rhythm.',
          },
          {
            title: 'A recap that shapes the next week',
            description: 'What worked becomes part of the next plan.',
          },
        ],
        mockup: 'analytics',
      },
    ],
    cta: {
      eyebrow: 'Keep the channel moving',
      title: 'Give the next upload',
      accent: 'a head start',
      description:
        'Send the footage and the publish date. We will keep the edit, packaging, and review moving.',
      primaryAction: START_ORDER,
    },
  },
  businesses: {
    slug: 'businesses',
    eyebrow: 'For businesses',
    headline: 'Product videos that ship every week',
    highlight: 'ship every week',
    description:
      'Product demos, launch films, and updates that keep the brand consistent while the calendar keeps moving.',
    primaryAction: START_ORDER,
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Brand workspace',
      toolbarLabel: 'Product · launch week',
      status: 'In review',
      toolbarItems: ['Plan', 'Edit', 'Review', 'Export'],
      railLabel: 'Launch kit',
      clips: [
        { label: 'Product film', from: '#38bdf8', to: '#2563eb' },
        { label: 'Demo', from: '#a78bfa', to: '#7c3aed' },
        { label: 'Social cut', from: '#f472b6', to: '#db2777' },
        { label: 'Sales clip', from: '#fbbf24', to: '#f97316' },
      ],
      activeClipIndex: 0,
      canvasLabel: 'Product story',
      canvasCaption: 'One promise, clear proof, clean handoff',
      popoverTitle: 'Brand palette',
      swatches: ['#4f46e5', '#3b82f6', '#0ea5e9', '#8b5cf6', '#ec4899'],
      timelineLabel: 'Launch path',
      timelineSegments: [
        { label: 'Brief', width: '18%', color: '#38bdf8' },
        { label: 'Edit', width: '40%', color: '#a78bfa' },
        { label: 'Review', width: '24%', color: '#f472b6' },
        { label: 'Export', width: '18%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The problem',
      title: 'Every video starts from a different place',
      highlight: 'different place',
      description:
        'The brand is consistent. The production process around it is not.',
      items: [
        {
          title: 'Juggling freelancers',
          description:
            'Every new video starts with a fresh search, a new brief, and another set of file links.',
        },
        {
          title: 'Off-brand output',
          description:
            'Different editors make different choices, so the same product can look like it came from three companies.',
        },
        {
          title: 'Launch-week scramble',
          description:
            'The launch date is fixed, but the edit, approvals, and exports all arrive at the last minute.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The on-brand way',
      highlight: 'on-brand way',
      description:
        'The brand system is set first, then every edit, template, and export follows it.',
      cards: [
        {
          eyebrow: 'The look',
          title: 'Brand-consistent edits',
          description:
            'Type, color, pacing, and lower thirds follow a shared system, so every product video belongs to the same brand.',
          href: '/examples',
          linkLabel: 'See the work',
          illustration: 'caption',
        },
        {
          eyebrow: 'The handoff',
          title: 'Launch-ready deliverables',
          description:
            'Masters, social cuts, and presentation versions are prepared together for the day the campaign goes live.',
          href: '/platform',
          linkLabel: 'See the workspace',
          illustration: 'thumbnails',
        },
      ],
    },
    features: [
      {
        title: 'A shared workspace with clear roles',
        highlight: 'clear roles',
        description:
          'Viewers, managers, and owners see the work they need, with approvals and files in one place.',
        bullets: [
          {
            title: 'Viewers review without changing the work',
            description: 'Feedback stays visible to the people who need it.',
          },
          {
            title: 'Managers keep projects and feedback moving',
            description: 'The day-to-day handoffs stay organized.',
          },
          {
            title: 'Owners keep the final say and the billing view',
            description: 'Approval and cost stay connected to the project.',
          },
          {
            title: 'Every role works from the same current cut',
            description: 'No one is reviewing an old version.',
          },
        ],
        mockup: 'team',
      },
      {
        title: 'Templates that keep every video on brand',
        highlight: 'on brand',
        description:
          'A reusable type, color, caption, and lower-third system removes the guesswork from each new brief.',
        bullets: [
          {
            title: 'A shared type and color system',
            description: 'Every edit starts from the approved direction.',
          },
          {
            title: 'Caption and lower-third patterns that repeat cleanly',
            description: 'The details stay consistent across formats.',
          },
          {
            title: 'New videos start from the approved direction',
            description: 'Less time is spent rebuilding the same look.',
          },
          {
            title: 'Less drift between teams and agencies',
            description: 'The brand holds together as the volume grows.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        title: 'A faster launch turnaround',
        highlight: 'launch turnaround',
        description:
          'The edit, review, and export steps run in one order, so launch week has fewer handoffs.',
        bullets: [
          {
            title: 'One brief and footage handoff',
            description: 'The source material arrives with the direction.',
          },
          {
            title: 'Timecoded review in the same workspace',
            description: 'Feedback stays with the cut.',
          },
          {
            title: 'Exports prepared for each channel',
            description: 'The launch kit is ready together.',
          },
          {
            title: 'A clear status through the launch',
            description: 'The team knows what is waiting on whom.',
          },
        ],
        mockup: 'calendar',
      },
    ],
    cta: {
      eyebrow: 'Ready for the next launch',
      title: 'Turn the next product story into',
      accent: 'a repeatable weekly habit',
      description:
        'Send the footage, the brand direction, and the launch date. We will keep the edit and deliverables moving.',
      primaryAction: START_ORDER,
    },
  },
  podcasters: {
    slug: 'podcasters',
    eyebrow: 'For podcasters',
    headline: 'Podcasts that sound like a show',
    highlight: 'sound like a show',
    description:
      'Long conversations shaped into episodes with a clean mix, a steady sonic identity, and clips that travel beyond the feed.',
    primaryAction: START_ORDER,
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Podcast workspace',
      toolbarLabel: 'Episode 12 · mix',
      status: 'In progress',
      toolbarItems: ['Sort', 'Edit', 'Mix', 'Export'],
      railLabel: 'Episode',
      clips: [
        { label: 'Cold open', from: '#38bdf8', to: '#6366f1' },
        { label: 'Guest', from: '#a78bfa', to: '#8b5cf6' },
        { label: 'Highlight', from: '#f472b6', to: '#ec4899' },
        { label: 'Outro', from: '#fbbf24', to: '#f97316' },
      ],
      activeClipIndex: 2,
      canvasLabel: 'Episode cut',
      canvasCaption: 'Keep the thread, remove the dead air',
      popoverTitle: 'Show palette',
      swatches: ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#14b8a6'],
      timelineLabel: 'Episode arc',
      timelineSegments: [
        { label: 'Open', width: '16%', color: '#38bdf8' },
        { label: 'Conversation', width: '46%', color: '#a78bfa' },
        { label: 'Highlight', width: '24%', color: '#f472b6' },
        { label: 'Close', width: '14%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The problem',
      title: 'The conversation is strong. The edit is not.',
      highlight: 'The edit is not',
      description:
        'The best moments are already in the room, but the path to a finished episode is slow.',
      items: [
        {
          title: 'Hours of raw recording',
          description:
            'The conversation is strong, but the edit starts with hours of false starts, tangents, and room noise.',
        },
        {
          title: 'Uneven audio',
          description:
            'Guests, rooms, and microphones change, so every episode needs a fresh balance before it sounds right.',
        },
        {
          title: 'No clips for social',
          description:
            'The best moments stay buried in the full episode because there is no time to pull and caption them.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The broadcast-quality way',
      highlight: 'broadcast-quality way',
      description:
        'The episode leads, then the mix and clips are built around the moments worth keeping.',
      cards: [
        {
          eyebrow: 'The mix',
          title: 'Sound polish',
          description:
            'Dialogue is balanced, filler is trimmed, and the room tone is smoothed so the conversation stays easy to follow.',
          href: '/examples',
          linkLabel: 'Hear the mix',
          illustration: 'podcast',
        },
        {
          eyebrow: 'The clips',
          title: 'Highlights and clips',
          description:
            "Self-contained moments are pulled from the episode and framed for social without losing the guest's point.",
          href: '/examples',
          linkLabel: 'See the clips',
          illustration: 'timeline',
        },
      ],
    },
    features: [
      {
        title: 'Tight episode edits that protect the idea',
        highlight: 'protect the idea',
        description:
          "False starts and repeated points come out while the guest's argument stays intact.",
        bullets: [
          {
            title: 'A clean opening that sets up the episode',
            description: 'The listener knows what the conversation is about.',
          },
          {
            title: 'Tangents trimmed without losing the thread',
            description: 'The detours stay only when they add something.',
          },
          {
            title: 'Transitions that keep the conversation moving',
            description: 'The episode does not stall between topics.',
          },
          {
            title: 'A final pass for pace and clarity',
            description: 'The finished cut feels easy to stay with.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        title: 'A consistent sonic identity',
        highlight: 'sonic identity',
        description:
          'Intro, outro, music, and level choices stay in the same family from episode to episode.',
        bullets: [
          {
            title: 'A repeatable intro and outro treatment',
            description: 'The show sounds like itself from the first second.',
          },
          {
            title: 'A consistent music and level approach',
            description: 'Each episode sits in the same listening range.',
          },
          {
            title: 'Voice clarity across guests and rooms',
            description: 'The conversation stays balanced even when the setup changes.',
          },
          {
            title: 'A sound that regular listeners recognize',
            description: 'The identity carries across the feed.',
          },
        ],
        mockup: 'analytics',
      },
      {
        title: 'Short-form clips for the social feed',
        highlight: 'short-form clips',
        description:
          'Complete thoughts become vertical clips with captions and framing that hold up outside the full episode.',
        bullets: [
          {
            title: 'Moments selected for a clear beginning and end',
            description: 'The clip makes sense without the full context.',
          },
          {
            title: 'Captions that stay readable on small screens',
            description: 'The point lands with the sound off.',
          },
          {
            title: 'Vertical framing that keeps the speaker in view',
            description: 'The crop follows the conversation.',
          },
          {
            title: 'A batch ready for the publishing calendar',
            description: 'Clips arrive together, not one at a time.',
          },
        ],
        mockup: 'thumbnails',
      },
    ],
    cta: {
      eyebrow: 'Ready for the next episode',
      title: 'Turn the next recording into',
      accent: 'an episode people finish',
      description:
        'Send the recording and the show direction. We will shape the episode, the mix, and the clips.',
      primaryAction: START_ORDER,
    },
  },
  realtors: {
    slug: 'realtors',
    eyebrow: 'For realtors',
    headline: 'Listing tours before the open house',
    highlight: 'before the open house',
    description:
      'Property tours that feel ready for the listing page, with a clear room order, polished pacing, and cuts for the social feed.',
    primaryAction: START_ORDER,
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Listing workspace',
      toolbarLabel: 'Maple Street · tour',
      status: 'Open house',
      toolbarItems: ['Order', 'Edit', 'Brand', 'Export'],
      railLabel: 'Room order',
      clips: [
        { label: 'Exterior', from: '#38bdf8', to: '#0ea5e9' },
        { label: 'Living', from: '#a78bfa', to: '#8b5cf6' },
        { label: 'Kitchen', from: '#fbbf24', to: '#f97316' },
        { label: 'Neighborhood', from: '#2dd4bf', to: '#14b8a6' },
      ],
      activeClipIndex: 0,
      canvasLabel: 'Property tour',
      canvasCaption: 'A clear path through the space',
      popoverTitle: 'Listing palette',
      swatches: ['#0f172a', '#0ea5e9', '#94a3b8', '#f59e0b', '#f8fafc'],
      timelineLabel: 'Tour path',
      timelineSegments: [
        { label: 'Arrival', width: '20%', color: '#38bdf8' },
        { label: 'Walkthrough', width: '48%', color: '#a78bfa' },
        { label: 'Details', width: '20%', color: '#f472b6' },
        { label: 'Close', width: '12%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The problem',
      title: 'The listing date does not move',
      highlight: 'does not move',
      description:
        'The open house has a date, and the video has to be ready before the first buyer arrives.',
      items: [
        {
          title: 'Weekends lost editing',
          description:
            'Showings, paperwork, and family time leave little room for a timeline, so the edit slips into Sunday night.',
        },
        {
          title: 'Inconsistent listing quality',
          description:
            'Some listings get a careful tour and others get a phone clip, which makes the whole portfolio feel uneven.',
        },
        {
          title: 'Slow turnaround',
          description:
            'The open house has a date, but the video arrives after the first wave of buyers has already looked.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The listing-ready way',
      highlight: 'listing-ready way',
      description:
        'The walkthrough is mapped first, then the polish and social cuts are built for the listing window.',
      cards: [
        {
          eyebrow: 'The tour',
          title: 'Polished property tours',
          description:
            'A logical room order, clean transitions, and a steady pace help buyers understand the space without a rushed walkthrough.',
          href: '/examples',
          linkLabel: 'See a tour',
          illustration: 'house',
        },
        {
          eyebrow: 'The feed',
          title: 'Social-ready cuts',
          description:
            'Short vertical moments highlight the strongest rooms and details for the feed that sends buyers to the listing.',
          href: '/examples',
          linkLabel: 'See the cuts',
          illustration: 'thumbnails',
        },
      ],
    },
    features: [
      {
        title: 'Fast delivery for the listing window',
        highlight: 'listing window',
        description:
          'The tour moves from footage to final without a weekend lost in the timeline.',
        bullets: [
          {
            title: 'A clear handoff for footage and listing details',
            description: 'The tour starts with the rooms and the story in view.',
          },
          {
            title: 'One review pass on the full tour',
            description: 'Notes stay on the exact moment.',
          },
          {
            title: 'Exports ready for the listing and social',
            description: 'The full tour and the clips arrive together.',
          },
          {
            title: 'A delivery that fits the open-house date',
            description: 'The video is ready before the first showing.',
          },
        ],
        mockup: 'calendar',
      },
      {
        title: 'Branded lower thirds and details',
        highlight: 'branded lower thirds',
        description:
          'Agent name, property details, and neighborhood context appear in the same polished system on every listing.',
        bullets: [
          {
            title: 'Consistent lower thirds for the agent and property',
            description: 'The details are easy to read and always placed.',
          },
          {
            title: 'Room and feature labels that are easy to read',
            description: 'Viewers can follow the tour without guessing.',
          },
          {
            title: 'A type and color system that stays on brand',
            description: 'Every listing feels part of the same portfolio.',
          },
          {
            title: 'Finished details that match the listing page',
            description: 'The video and the property page feel connected.',
          },
        ],
        mockup: 'caption',
      },
      {
        title: 'Multi-format exports for every channel',
        highlight: 'multi-format exports',
        description:
          'The full tour, vertical clips, and listing-page versions come from one approved cut.',
        bullets: [
          {
            title: 'A full walkthrough for the listing',
            description: 'The complete tour is ready for the property page.',
          },
          {
            title: 'Vertical cuts for social',
            description: 'The strongest moments are framed for the feed.',
          },
          {
            title: 'A clean master for the website',
            description: 'The tour is ready for the agent site.',
          },
          {
            title: 'Framing that holds up on each screen',
            description: 'The space stays clear at every crop.',
          },
        ],
        mockup: 'dashboard',
      },
    ],
    cta: {
      eyebrow: 'Before the first showing',
      title: 'Get the listing tour',
      accent: 'ready before the open house',
      description:
        'Send the footage and the listing date. We will build the tour and the social cuts.',
      primaryAction: START_ORDER,
    },
  },
  'course-creators': {
    slug: 'course-creators',
    eyebrow: 'For course creators',
    headline: 'Courses that feel like one coherent program',
    highlight: 'one coherent program',
    description:
      'Module intros, lessons, and recaps built with one visual language, clear chapters, and captions that help learners keep moving.',
    primaryAction: START_ORDER,
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Course workspace',
      toolbarLabel: 'Module 04 · lesson',
      status: 'On track',
      toolbarItems: ['Plan', 'Edit', 'Caption', 'Export'],
      railLabel: 'Modules',
      clips: [
        { label: 'Intro', from: '#38bdf8', to: '#6366f1' },
        { label: 'Lesson', from: '#a78bfa', to: '#8b5cf6' },
        { label: 'Demo', from: '#fbbf24', to: '#f97316' },
        { label: 'Recap', from: '#2dd4bf', to: '#14b8a6' },
      ],
      activeClipIndex: 1,
      canvasLabel: 'Lesson cut',
      canvasCaption: 'One idea, clear steps, calm pace',
      popoverTitle: 'Course palette',
      swatches: ['#0ea5e9', '#8b5cf6', '#f59e0b', '#14b8a6', '#f8fafc'],
      timelineLabel: 'Module flow',
      timelineSegments: [
        { label: 'Intro', width: '18%', color: '#38bdf8' },
        { label: 'Teach', width: '44%', color: '#a78bfa' },
        { label: 'Example', width: '24%', color: '#f472b6' },
        { label: 'Recap', width: '14%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The problem',
      title: 'A course should feel like one program',
      highlight: 'one program',
      description:
        'The lessons are connected, but the edit can make them feel like separate videos.',
      items: [
        {
          title: 'Module-by-module editing',
          description:
            'Each lesson is edited in isolation, so the course starts to feel like a folder of unrelated videos.',
        },
        {
          title: 'Inconsistent intros',
          description:
            'Every module opens a different way, which makes the program feel less finished than the teaching deserves.',
        },
        {
          title: 'Long recordings',
          description:
            'A single lesson can hold hours of setup, repetition, and tangents that slow the learner down.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The learner-first way',
      highlight: 'learner-first way',
      description:
        'The lesson comes first, then the intro, chapter markers, and captions are shaped around how people learn.',
      cards: [
        {
          eyebrow: 'The opening',
          title: 'Consistent module intros',
          description:
            'A repeatable opening makes each lesson feel like part of the same program and tells learners what comes next.',
          href: '/examples',
          linkLabel: 'See the modules',
          illustration: 'course',
        },
        {
          eyebrow: 'The structure',
          title: 'Clean chapters and captions',
          description:
            'Clear section breaks and readable captions help learners follow the material at their own pace.',
          href: '/examples',
          linkLabel: 'See the structure',
          illustration: 'timeline',
        },
      ],
    },
    features: [
      {
        title: 'Chapter markers that map the lesson',
        highlight: 'chapter markers',
        description:
          'Each lesson gets a clear path through the material, so learners can return to the part they need.',
        bullets: [
          {
            title: 'Markers that match the teaching beats',
            description: 'The lesson structure is visible at a glance.',
          },
          {
            title: 'A visible structure for long lessons',
            description: 'Learners can find the section they need.',
          },
          {
            title: 'Fewer rewinds from a lost place',
            description: 'The path back is easy to follow.',
          },
          {
            title: 'A consistent pattern across modules',
            description: 'Every lesson uses the same clear map.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        title: 'Captions built for accessibility',
        highlight: 'accessibility',
        description:
          'Captions are prepared with the lesson, with readable timing and a style that matches the course.',
        bullets: [
          {
            title: 'Accurate captions timed to the lesson',
            description: 'The text follows the teaching pace.',
          },
          {
            title: 'Readable type on small screens',
            description: 'Learners can follow on any device.',
          },
          {
            title: 'A consistent caption style across modules',
            description: 'The course feels like one body of work.',
          },
          {
            title: 'A clearer experience for every learner',
            description: 'The material is easier to stay with.',
          },
        ],
        mockup: 'caption',
      },
      {
        title: 'Batch packages for the full course',
        highlight: 'batch packages',
        description:
          'Several modules move through the same review and delivery rhythm, so the program arrives as one complete package.',
        bullets: [
          {
            title: 'Multiple modules planned in one schedule',
            description: 'The whole course has a delivery shape.',
          },
          {
            title: 'Shared intros and caption rules',
            description: 'Every module follows the same system.',
          },
          {
            title: 'Consistent exports for each module',
            description: 'The files arrive ready for the course platform.',
          },
          {
            title: 'A delivery that feels like one course',
            description: 'The program stays coherent from start to finish.',
          },
        ],
        mockup: 'calendar',
      },
    ],
    cta: {
      eyebrow: 'Build the whole program',
      title: 'Turn each lesson into',
      accent: 'part of one clear course',
      description:
        'Send the recordings and the curriculum. We will keep the modules consistent from the first intro to the last caption.',
      primaryAction: START_ORDER,
    },
  },
  doctors: {
    slug: 'doctors',
    eyebrow: 'For doctors and dentists',
    headline: 'Patient education videos with a calm, trusted look',
    highlight: 'with a calm, trusted look',
    description:
      'Plain-language patient education with a considerate pace, readable captions, and a polished presentation that feels calm and professional.',
    primaryAction: START_ORDER,
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Patient education',
      toolbarLabel: 'Explainer · review',
      status: 'Private',
      toolbarItems: ['Outline', 'Edit', 'Caption', 'Review'],
      railLabel: 'Sections',
      clips: [
        { label: 'Welcome', from: '#38bdf8', to: '#0ea5e9' },
        { label: 'Explanation', from: '#a78bfa', to: '#8b5cf6' },
        { label: 'Steps', from: '#2dd4bf', to: '#14b8a6' },
        { label: 'Contact', from: '#fbbf24', to: '#f97316' },
      ],
      activeClipIndex: 1,
      canvasLabel: 'Plain-language cut',
      canvasCaption: 'Calm pacing, clear captions, steady framing',
      popoverTitle: 'Practice palette',
      swatches: ['#0ea5e9', '#14b8a6', '#8b5cf6', '#94a3b8', '#f8fafc'],
      timelineLabel: 'Chapter order',
      timelineSegments: [
        { label: 'Welcome', width: '18%', color: '#38bdf8' },
        { label: 'Explain', width: '46%', color: '#a78bfa' },
        { label: 'Steps', width: '22%', color: '#f472b6' },
        { label: 'Close', width: '14%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The problem',
      title: 'The clinic day leaves no room for the timeline',
      highlight: 'no room for the timeline',
      description:
        'The footage waits while appointments, notes, and follow-ups come first.',
      items: [
        {
          title: 'No time between patients',
          description:
            'The clinic day fills up, and the footage sits while appointments, notes, and follow-ups take priority.',
        },
        {
          title: 'Jargon-heavy footage',
          description:
            'The expertise is clear in the room, but the recorded explanation can be hard for a patient to follow at home.',
        },
        {
          title: 'Unpolished presentation hurting trust',
          description:
            'Shaky framing and uneven sound can make useful guidance feel less credible than it is.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The trusted way',
      highlight: 'trusted way',
      description:
        'Clear language and a calm finish come first, with working files kept private to the workspace.',
      cards: [
        {
          eyebrow: 'The explanation',
          title: 'Clear patient education',
          description:
            "Explanations are tightened around the patient's question, with plain language and a pacing that leaves room to absorb it.",
          href: '/examples',
          linkLabel: 'See the approach',
          illustration: 'clinic',
        },
        {
          eyebrow: 'The finish',
          title: 'Professional, calm polish',
          description:
            'Clean sound, steady framing, and readable captions give the practice a presentation that feels considered.',
          href: '/examples',
          linkLabel: 'See the finish',
          illustration: 'timeline',
        },
      ],
    },
    features: [
      {
        title: 'Captions and clarity for every patient',
        highlight: 'clarity',
        description:
          'On-screen text and a clean edit help patients follow the explanation without extra guesswork.',
        bullets: [
          {
            title: 'Captions timed to the spoken explanation',
            description: 'The text stays with the pace of the video.',
          },
          {
            title: 'Plain-language text on screen',
            description: 'The key points are easy to read.',
          },
          {
            title: 'A pace that leaves room to absorb the point',
            description: 'The explanation does not rush past the viewer.',
          },
          {
            title: 'A consistent style across patient videos',
            description: 'The practice stays recognizable.',
          },
        ],
        mockup: 'caption',
      },
      {
        title: 'A clean, branded look',
        highlight: 'branded look',
        description:
          'A steady visual system keeps the practice recognizable without making the content feel clinical or cold.',
        bullets: [
          {
            title: 'Consistent type and color for the practice',
            description: 'Every video feels part of the same library.',
          },
          {
            title: 'Calm lower thirds and labels',
            description: 'The details support the explanation without distraction.',
          },
          {
            title: 'Framing that feels welcoming',
            description: 'The presentation stays composed and approachable.',
          },
          {
            title: 'A polished finish across every video',
            description: 'The library holds together as it grows.',
          },
        ],
        mockup: 'thumbnails',
      },
      {
        title: 'A private workspace for working files',
        highlight: 'private workspace',
        description:
          'Working files stay private to the workspace, with clear access for the people involved in the review.',
        bullets: [
          {
            title: 'Files organized inside the workspace',
            description: 'The project has one controlled home.',
          },
          {
            title: 'Access limited to the people on the project',
            description: 'Working files stay inside the workspace.',
          },
          {
            title: 'One place for review and approval',
            description: 'Feedback stays attached to the cut.',
          },
          {
            title: 'A calmer handoff for the practice',
            description: 'The final files are easy to find.',
          },
        ],
        mockup: 'dashboard',
      },
    ],
    cta: {
      eyebrow: 'A calmer patient experience',
      title: 'Give every explanation',
      accent: 'a clearer finish',
      description:
        'Send the footage and the patient question. We will shape a calm, plain-language video with captions and a considerate pace.',
      primaryAction: START_ORDER,
    },
  },
  lawyers: {
    slug: 'lawyers',
    eyebrow: 'For lawyers and firms',
    headline: 'Explainer videos that build client confidence',
    highlight: 'that build client confidence',
    description:
      'Plain-language explainers with a credible finish, consistent firm branding, and a private workspace for the work in progress.',
    primaryAction: START_ORDER,
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Firm workspace',
      toolbarLabel: 'Explainer · review',
      status: 'Private',
      toolbarItems: ['Outline', 'Edit', 'Caption', 'Review'],
      railLabel: 'Sections',
      clips: [
        { label: 'Opening', from: '#38bdf8', to: '#2563eb' },
        { label: 'Question', from: '#a78bfa', to: '#7c3aed' },
        { label: 'Explanation', from: '#2dd4bf', to: '#0f766e' },
        { label: 'Next step', from: '#fbbf24', to: '#f97316' },
      ],
      activeClipIndex: 1,
      canvasLabel: 'Plain-language cut',
      canvasCaption: 'Clear structure, credible finish',
      popoverTitle: 'Firm palette',
      swatches: ['#0f172a', '#1e3a8a', '#0ea5e9', '#94a3b8', '#f8fafc'],
      timelineLabel: 'Review path',
      timelineSegments: [
        { label: 'Open', width: '18%', color: '#38bdf8' },
        { label: 'Context', width: '30%', color: '#a78bfa' },
        { label: 'Explain', width: '36%', color: '#f472b6' },
        { label: 'Next', width: '16%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The problem',
      title: 'The timeline waits between billable hours',
      highlight: 'between billable hours',
      description:
        'The subject needs care, and the video needs time that is already spoken for.',
      items: [
        {
          title: 'Billable time vs editing',
          description:
            'Every hour in a timeline is an hour not spent on client work, so the video waits.',
        },
        {
          title: 'Complex topics',
          description:
            'The subject needs care, but dense language and a rushed edit can make a clear answer harder to find.',
        },
        {
          title: 'Inconsistent professional image',
          description:
            'Different videos carry different type, tone, and polish, which makes the firm feel less unified than it is.',
        },
      ],
    },
    way: {
      eyebrow: 'The way we work',
      title: 'The credible way',
      highlight: 'credible way',
      description:
        "The explanation comes first, then the finish and branding support the firm's voice.",
      cards: [
        {
          eyebrow: 'The explanation',
          title: 'Plain-language explainers',
          description:
            'Complex topics are shaped into a clear sequence that helps a prospective client understand the next step.',
          href: '/examples',
          linkLabel: 'See the approach',
          illustration: 'law',
        },
        {
          eyebrow: 'The finish',
          title: 'Credible, polished presentation',
          description:
            'Steady pacing, clean sound, and a consistent visual system give the firm a presentation that feels considered.',
          href: '/examples',
          linkLabel: 'See the finish',
          illustration: 'timeline',
        },
      ],
    },
    features: [
      {
        title: 'Captions and clarity for every viewer',
        highlight: 'captions and clarity',
        description:
          'Readable captions and a clean edit make the explanation easier to follow without oversimplifying the subject.',
        bullets: [
          {
            title: 'Captions timed to the explanation',
            description: 'The text follows the pace of the video.',
          },
          {
            title: 'On-screen labels that keep the structure visible',
            description: 'The viewer can see where the explanation is going.',
          },
          {
            title: 'A pace that respects a complex topic',
            description: 'The video leaves room for the point to land.',
          },
          {
            title: 'A consistent style across practice areas',
            description: 'Every explainer feels part of the firm.',
          },
        ],
        mockup: 'caption',
      },
      {
        title: 'Consistent firm branding',
        highlight: 'firm branding',
        description:
          'Type, color, and lower thirds follow one system, so every explainer feels like it came from the same firm.',
        bullets: [
          {
            title: 'A shared type and color system',
            description: 'The firm stays recognizable across videos.',
          },
          {
            title: 'Lower thirds that stay on brand',
            description: 'Names and practice areas are presented consistently.',
          },
          {
            title: 'A repeatable structure for explainers',
            description: 'New videos start from an approved direction.',
          },
          {
            title: 'A professional image across every video',
            description: 'The library holds together as it grows.',
          },
        ],
        mockup: 'thumbnails',
      },
      {
        title: 'A secure private workspace',
        highlight: 'private workspace',
        description:
          'Working files stay inside a private workspace, with review and approvals in one controlled place.',
        bullets: [
          {
            title: 'Files organized in one workspace',
            description: 'The project has a clear home.',
          },
          {
            title: 'Access limited to the project team',
            description: 'Working files stay private to the workspace.',
          },
          {
            title: 'Timecoded review without scattered copies',
            description: 'Feedback stays with the current cut.',
          },
          {
            title: 'A clear handoff when the video is approved',
            description: 'The final files are easy to find.',
          },
        ],
        mockup: 'dashboard',
      },
    ],
    cta: {
      eyebrow: 'A clearer next step',
      title: 'Turn complex guidance into',
      accent: 'a credible explainer',
      description:
        'Send the footage and the subject. We will build a plain-language explainer with captions, firm branding, and a private review space.',
      primaryAction: START_ORDER,
    },
  },
};

export function getUseCasePageContent(
  slug: string
): UseCasePageContent | undefined {
  return USE_CASE_PAGES[slug as UseCaseSlug];
}

export default USE_CASE_PAGES;
