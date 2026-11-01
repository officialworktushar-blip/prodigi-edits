import type {
  PageHeroAction,
  PageHeroMockup,
  SectionIllustrationName,
} from '../../components/sections';
import { SUPPORT_EMAIL } from '../config';

export type MarketingPageSlug =
  | 'pricing'
  | 'examples'
  | 'case-studies'
  | 'platform'
  | 'contact'
  | 'about';

export interface MarketingPagePainItem {
  title: string;
  description: string;
}

export interface MarketingPageWayCard {
  eyebrow?: string;
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
  illustration: SectionIllustrationName;
}

export interface MarketingPageFeatureBullet {
  title: string;
  description?: string;
}

export interface MarketingPageFeature {
  eyebrow: string;
  title: string;
  highlight?: string;
  description: string;
  bullets: MarketingPageFeatureBullet[];
  mockup: SectionIllustrationName;
}

export interface MarketingPageContent {
  eyebrow: string;
  headline: string;
  highlight: string;
  description: string;
  primaryAction: PageHeroAction;
  secondaryAction?: PageHeroAction;
  heroMockup: PageHeroMockup;
  pain: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    items: MarketingPagePainItem[];
  };
  way: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    cards: MarketingPageWayCard[];
  };
  features: MarketingPageFeature[];
  cta: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primaryAction: PageHeroAction;
    secondaryAction?: PageHeroAction;
  };
  values?: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    items: MarketingPageFeatureBullet[];
  };
}

const START_ORDER: PageHeroAction = {
  label: 'Start an order',
  href: '/signup',
};

const SEE_PRICING: PageHeroAction = {
  label: 'See pricing',
  href: '/pricing',
};

const TALK_TO_TEAM: PageHeroAction = {
  label: 'Talk to the team',
  href: '/contact',
};

export const MARKETING_PAGES: Record<
  MarketingPageSlug,
  MarketingPageContent
> = {
  pricing: {
    eyebrow: 'Pricing',
    headline: 'Prices that match the way you publish',
    highlight: 'match the way you publish',
    description:
      'Choose a package for one video, a block for a busy month, or a channel plan for a steady publishing rhythm. The price is visible before the work starts.',
    primaryAction: { label: 'Choose a package', href: '/signup' },
    secondaryAction: TALK_TO_TEAM,
    heroMockup: {
      windowTitle: 'Pricing workspace',
      toolbarLabel: 'Package fit · clear before checkout',
      status: 'Clear',
      toolbarItems: ['Compare', 'Choose', 'Brief', 'Start'],
      railLabel: 'Packages',
      clips: [
        { label: 'Solo Cut', from: '#38bdf8', to: '#6366f1' },
        { label: 'Creator Batch', from: '#a78bfa', to: '#ec4899' },
        { label: 'Shorts Fifteen', from: '#fbbf24', to: '#fb7185' },
        { label: 'Channel Plans', from: '#2dd4bf', to: '#3b82f6' },
      ],
      activeClipIndex: 0,
      canvasLabel: 'Package match',
      canvasCaption: 'One clear price, every included essential',
      popoverTitle: 'Format palette',
      swatches: ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'],
      timelineLabel: 'What is included',
      timelineSegments: [
        { label: 'Edit', width: '34%', color: '#38bdf8' },
        { label: 'Review', width: '26%', color: '#a78bfa' },
        { label: 'Captions', width: '22%', color: '#f472b6' },
        { label: 'Exports', width: '18%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The pricing problem',
      title: 'The quote is clear until the extras appear',
      highlight: 'the extras appear',
      description:
        'Most editing quotes hide the real cost in add-ons, vague revision limits, or a contract that outlasts the project.',
      items: [
        {
          title: 'Quotes that need a decoder',
          description:
            'A low headline rate can hide footage limits, caption fees, and charges for the exports you assumed were included.',
        },
        {
          title: 'Add-ons revealed too late',
          description:
            'Thumbnail work, vertical reformatting, and extra revisions should be visible before checkout, not after the first cut.',
        },
        {
          title: 'Contracts longer than the plan',
          description:
            'A busy month should not lock you into a year of work. Channel plans stay flexible after the minimum term.',
        },
      ],
    },
    way: {
      eyebrow: 'The clear path',
      title: 'Pick the plan that fits the publishing rhythm',
      highlight: 'the publishing rhythm',
      description:
        'Start with the format you publish most, then scale up when the calendar gets busy. No custom quote required for the standard packages.',
      cards: [
        {
          eyebrow: 'By the video',
          title: 'Buy a block that matches your output',
          description:
            'Long-form packages start at $129 for one video and drop to $109 per video in a block of eight. Short-form starts at $99 and drops to $79 per video at thirty.',
          href: '/services/long-form',
          linkLabel: 'Explore long-form editing',
          illustration: 'timeline',
        },
        {
          eyebrow: 'By the channel',
          title: 'Hand over the full publishing rhythm',
          description:
            'Channel plans combine edits, shorts, thumbnails, planning, and publishing. Starter begins at $749 per month, or $599 per month on annual billing.',
          href: '/services/channel-management',
          linkLabel: 'Explore channel management',
          illustration: 'calendar',
        },
      ],
    },
    features: [
      {
        eyebrow: 'Inside every package',
        title: 'Every package includes the essentials',
        highlight: 'the essentials',
        description:
          'A named editor, two focused revision rounds, captions where the format needs them, and the exports your channel actually uses.',
        bullets: [
          {
            title: 'A real editor owns the cut',
            description:
              'You are not sending footage into an anonymous queue. A named person owns the next pass.',
          },
          {
            title: 'Two revision rounds',
            description:
              'Notes stay attached to the draft, so feedback becomes a focused pass instead of a new project.',
          },
          {
            title: 'Captions, sound, and platform exports',
            description:
              'The finish includes readable captions, a balanced mix, and the aspect ratios you requested.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        eyebrow: 'Compare without guesswork',
        title: 'See the per-video price at every volume',
        highlight: 'every volume',
        description:
          'Blocks are priced per video, so the savings are visible. A larger block lowers the rate without changing the standard of the edit.',
        bullets: [
          {
            title: 'Long-form blocks',
            description:
              'One video is $129. Four videos drop to $119 each, and eight videos drop to $109 each.',
          },
          {
            title: 'Short-form blocks',
            description:
              'One vertical video is $99. Fifteen drop to $89 each, and thirty drop to $79 each.',
          },
          {
            title: 'No hidden production fee',
            description:
              'The package price is the editing price. Optional extras are listed separately and only added when you choose them.',
          },
        ],
        mockup: 'analytics',
      },
      {
        eyebrow: 'Before you commit',
        title: 'The fine print stays in plain sight',
        highlight: 'plain sight',
        description:
          'Footage guidance, revision limits, ownership, and turnaround are explained in the same place as the price.',
        bullets: [
          {
            title: 'First cut in 24 to 48 hours',
            description:
              'Turnaround starts when the brief and footage are complete. Larger projects get a confirmed schedule.',
          },
          {
            title: 'Revisions are a focused pass',
            description:
              'Trimming, swapping a clip, changing captions, or adjusting music counts as a revision. A new concept is a new order.',
          },
          {
            title: 'You own the final video',
            description:
              'Delivered files are yours to publish and repurpose. Working files stay private to your workspace.',
          },
        ],
        mockup: 'caption',
      },
    ],
    cta: {
      eyebrow: 'Start with clarity',
      title: 'Choose the package.',
      accent: 'Keep the price clear.',
      description:
        'Start with one video or a full channel rhythm. The scope, price, and next step are visible before the first timeline opens.',
      primaryAction: START_ORDER,
      secondaryAction: TALK_TO_TEAM,
    },
  },
  examples: {
    eyebrow: 'Examples',
    headline: 'Work that speaks for itself',
    highlight: 'speaks for itself',
    description:
      'Representative edits arranged by format, with the pacing, captions, and packaging decisions visible at a glance. These are examples, not client reels.',
    primaryAction: { label: 'Read the case studies', href: '/case-studies' },
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Example library',
      toolbarLabel: 'Format previews · representative work',
      status: 'Labeled',
      toolbarItems: ['Formats', 'Frames', 'Captions', 'Exports'],
      railLabel: 'Formats',
      clips: [
        { label: 'Long-form', from: '#38bdf8', to: '#6366f1' },
        { label: 'Short-form', from: '#a78bfa', to: '#ec4899' },
        { label: 'Vertical', from: '#fbbf24', to: '#fb7185' },
        { label: 'Packaging', from: '#2dd4bf', to: '#3b82f6' },
      ],
      activeClipIndex: 1,
      canvasLabel: 'Example preview',
      canvasCaption: 'Story-first pacing with a clean visual system',
      popoverTitle: 'Format colors',
      swatches: ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'],
      timelineLabel: 'Format mix',
      timelineSegments: [
        { label: 'Story', width: '38%', color: '#38bdf8' },
        { label: 'Hook', width: '28%', color: '#a78bfa' },
        { label: 'Captions', width: '20%', color: '#f472b6' },
        { label: 'Package', width: '14%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The portfolio problem',
      title: 'A reel can hide the work behind the edit',
      highlight: 'behind the edit',
      description:
        'A polished montage does not tell you how the story was shaped, how the captions were handled, or whether the format fits your channel.',
      items: [
        {
          title: 'Pretty frames, no context',
          description:
            'A highlight reel can look impressive without showing the structure that made the finished piece easy to follow.',
        },
        {
          title: 'One style for every format',
          description:
            'Long-form, vertical, and channel packaging need different pacing. The same template rarely serves all three well.',
        },
        {
          title: 'Missing production details',
          description:
            'The useful questions are about captions, exports, revisions, and delivery. Those details are usually absent from a showreel.',
        },
      ],
    },
    way: {
      eyebrow: 'Browse by format',
      title: 'See the shape of the work before the brief',
      highlight: 'before the brief',
      description:
        'The gallery is organized the same way the packages are: long-form storytelling, short-form pacing, and the packaging around a channel.',
      cards: [
        {
          eyebrow: 'Long-form',
          title: 'Edits built around a complete story',
          description:
            'Interviews, essays, product walkthroughs, and podcast episodes with a clear beginning, useful middle, and finish that lands.',
          href: '/services/long-form',
          linkLabel: 'See long-form editing',
          illustration: 'timeline',
        },
        {
          eyebrow: 'Short-form',
          title: 'Cuts built for the first second',
          description:
            'Hook-first vertical edits with readable captions, clean resizing, and pacing that survives a fast feed.',
          href: '/services/short-form',
          linkLabel: 'See short-form editing',
          illustration: 'thumbnails',
        },
      ],
    },
    features: [
      {
        eyebrow: 'Long-form examples',
        title: 'Structure you can follow, not just footage you can watch',
        highlight: 'not just footage you can watch',
        description:
          'The edit finds the point, gives it room, and removes the detours that make a viewer leave before the payoff.',
        bullets: [
          {
            title: 'A story-first opening',
            description:
              'The first minute establishes the question or promise that keeps the rest of the video moving.',
          },
          {
            title: 'Captions that match the tone',
            description:
              'Type, placement, and timing support the edit rather than competing with it.',
          },
          {
            title: 'Exports ready for the platform',
            description:
              'The final package includes the aspect ratios and file formats the channel needs.',
          },
        ],
        mockup: 'timeline',
      },
      {
        eyebrow: 'Short-form examples',
        title: 'The point arrives before the thumb moves',
        highlight: 'before the thumb moves',
        description:
          'Short edits open on the useful moment, keep every caption readable, and finish before the idea runs out of energy.',
        bullets: [
          {
            title: 'Hook-first sequencing',
            description:
              'The strongest line or visual leads. Setup happens only after the viewer has a reason to stay.',
          },
          {
            title: 'Vertical framing that holds up',
            description:
              'Subjects stay in frame and on-screen text remains readable without awkward crops.',
          },
          {
            title: 'One idea per cut',
            description:
              'Each clip carries a complete thought, making the series easier to follow and easier to publish.',
          },
        ],
        mockup: 'thumbnails',
      },
      {
        eyebrow: 'Packaging examples',
        title: 'A library that still looks like one channel',
        highlight: 'one channel',
        description:
          'Thumbnails, titles, and series graphics can feel consistent without making every upload look identical.',
        bullets: [
          {
            title: 'A repeatable visual family',
            description:
              'Shared type, color, and layout rules keep the channel recognizable at a glance.',
          },
          {
            title: 'Room for the specific idea',
            description:
              'Each thumbnail gets its own focal point instead of forcing every topic into the same template.',
          },
          {
            title: 'Packaging that matches the edit',
            description:
              'The cover and title promise the same thing the finished video delivers.',
          },
        ],
        mockup: 'caption',
      },
    ],
    cta: {
      eyebrow: 'Make the next example yours',
      title: 'Bring the footage.',
      accent: 'We will shape the story.',
      description:
        'Start with one video in the format you publish most. You will see the structure, captions, and delivery before the work begins.',
      primaryAction: START_ORDER,
      secondaryAction: SEE_PRICING,
    },
  },
  'case-studies': {
    eyebrow: 'Case studies',
    headline: 'Proof, not promises',
    highlight: 'Proof',
    description:
      'Project stories with the brief, the review loop, and the delivery details intact. These are working examples, not vague before-and-after claims.',
    primaryAction: { label: 'Browse examples', href: '/examples' },
    secondaryAction: START_ORDER,
    heroMockup: {
      windowTitle: 'Story library',
      toolbarLabel: 'Published projects · clear outcomes',
      status: 'Published',
      toolbarItems: ['Brief', 'Edit', 'Review', 'Deliver'],
      railLabel: 'Stories',
      clips: [
        { label: 'Daily uploads', from: '#38bdf8', to: '#6366f1' },
        { label: 'Launch week', from: '#a78bfa', to: '#ec4899' },
        { label: 'Podcast show', from: '#fbbf24', to: '#fb7185' },
        { label: 'Next story', from: '#2dd4bf', to: '#3b82f6' },
      ],
      activeClipIndex: 0,
      canvasLabel: 'Project story',
      canvasCaption: 'What changed, how it shipped, what it proves',
      popoverTitle: 'Story tags',
      swatches: ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'],
      timelineLabel: 'Project arc',
      timelineSegments: [
        { label: 'Brief', width: '24%', color: '#38bdf8' },
        { label: 'Edit', width: '34%', color: '#a78bfa' },
        { label: 'Review', width: '24%', color: '#f472b6' },
        { label: 'Deliver', width: '18%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The proof gap',
      title: 'A logo wall is not a project story',
      highlight: 'not a project story',
      description:
        'Testimonials help, but they rarely show how a busy week was handled, where the review slowed down, or what changed between the first cut and the final file.',
      items: [
        {
          title: 'Outcomes without the process',
          description:
            'A result is easier to trust when you can see the brief, the constraint, and the decisions that shaped the delivery.',
        },
        {
          title: 'Highlights without the trade-offs',
          description:
            'Every edit involves choices. A useful case study says what was protected and what was removed.',
        },
        {
          title: 'Claims without a clear handoff',
          description:
            'The final question is simple: what arrived, in what format, and was it ready to publish?',
        },
      ],
    },
    way: {
      eyebrow: 'How to read the stories',
      title: 'Start with the constraint, then the finish',
      highlight: 'then the finish',
      description:
        'Each story is organized around the same three moments: the brief, the review loop, and the delivery package.',
      cards: [
        {
          eyebrow: 'The brief',
          title: 'What the calendar demanded',
          description:
            'Volume, turnaround, and the format of the final delivery. The constraint comes before the creative choice.',
          href: '/platform',
          linkLabel: 'See the workspace',
          illustration: 'calendar',
        },
        {
          eyebrow: 'The finish',
          title: 'What arrived on delivery day',
          description:
            'The edits, captions, thumbnails, and export formats that were ready when the project closed.',
          href: '/examples',
          linkLabel: 'Browse the formats',
          illustration: 'thumbnails',
        },
      ],
    },
    features: [
      {
        eyebrow: 'One brief',
        title: 'A clear brief keeps parallel work aligned',
        highlight: 'parallel work aligned',
        description:
          'When several assets share a launch, the brief has to hold the audience, the point, and the delivery date in one place.',
        bullets: [
          {
            title: 'One source of truth',
            description:
              'Every editor and reviewer works from the same audience, message, and deadline.',
          },
          {
            title: 'The format is decided early',
            description:
              'Aspect ratio, length, and caption needs are part of the brief, not a late reformatting request.',
          },
          {
            title: 'The next step is visible',
            description:
              'The order status shows whether work is waiting on footage, a first cut, or a review note.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        eyebrow: 'One review loop',
        title: 'Feedback that ends in a better cut',
        highlight: 'a better cut',
        description:
          'Timecoded notes, one review thread, and a clear revision boundary keep the next pass focused on what matters.',
        bullets: [
          {
            title: 'Notes stay at the moment',
            description:
              'A comment about a caption or cut sits at the timestamp where the change belongs.',
          },
          {
            title: 'Revisions stay bounded',
            description:
              'A focused pass trims, swaps, and adjusts. A new concept becomes a separate request.',
          },
          {
            title: 'Approval is explicit',
            description:
              'The final file moves forward only after the approved version is clear to everyone.',
          },
        ],
        mockup: 'caption',
      },
      {
        eyebrow: 'One delivery',
        title: 'The project closes with a usable package',
        highlight: 'a usable package',
        description:
          'The finish includes the files the channel needs, not a single export that has to be reworked elsewhere.',
        bullets: [
          {
            title: 'The requested formats',
            description:
              'Horizontal, vertical, and captioned versions arrive together when the brief asked for them.',
          },
          {
            title: 'A clean handoff',
            description:
              'Approved files stay available after the review closes, with working files kept private.',
          },
          {
            title: 'The story is ready to publish',
            description:
              'No missing audio, no placeholder titles, and no last-minute export scramble.',
          },
        ],
        mockup: 'team',
      },
    ],
    cta: {
      eyebrow: 'Build the next story',
      title: 'Bring the constraint.',
      accent: 'We will build the handoff.',
      description:
        'Start with one order or a full launch. The brief, progress, review notes, and final package stay in one visible workspace.',
      primaryAction: START_ORDER,
      secondaryAction: { label: 'Browse examples', href: '/examples' },
    },
  },
  platform: {
    eyebrow: 'The platform',
    headline: 'One calm dashboard from brief to delivery',
    highlight: 'from brief to delivery',
    description:
      'The request, footage, review notes, approvals, and final files live in one order. No mystery versions and no notes lost in a private inbox.',
    primaryAction: START_ORDER,
    secondaryAction: SEE_PRICING,
    heroMockup: {
      windowTitle: 'Order workspace',
      toolbarLabel: 'Project 184 · visible from start to finish',
      status: 'In review',
      toolbarItems: ['Brief', 'Progress', 'Comments', 'Delivery'],
      railLabel: 'Order',
      clips: [
        { label: 'Brief', from: '#38bdf8', to: '#6366f1' },
        { label: 'Progress', from: '#a78bfa', to: '#ec4899' },
        { label: 'Comments', from: '#fbbf24', to: '#fb7185' },
        { label: 'Delivery', from: '#2dd4bf', to: '#3b82f6' },
      ],
      activeClipIndex: 2,
      canvasLabel: 'Review thread',
      canvasCaption: 'Every note attached to the moment it belongs',
      popoverTitle: 'Order palette',
      swatches: ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'],
      timelineLabel: 'Order status',
      timelineSegments: [
        { label: 'Brief', width: '20%', color: '#38bdf8' },
        { label: 'Edit', width: '36%', color: '#a78bfa' },
        { label: 'Review', width: '26%', color: '#f472b6' },
        { label: 'Deliver', width: '18%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'The scattered project',
      title: 'The work is moving, but the context is missing',
      highlight: 'the context is missing',
      description:
        'A brief in email, footage in a folder, notes in chat, and final files in three different links. The edit is possible; the clarity is not.',
      items: [
        {
          title: 'Briefs spread across inboxes',
          description:
            'Audience, deadline, and creative direction get buried in a thread that the editor was not part of.',
        },
        {
          title: 'Notes without a timestamp',
          description:
            'A comment like "tighten the intro" is useful only when everyone can see the exact moment it refers to.',
        },
        {
          title: 'Versions with no clear owner',
          description:
            'When the latest file is unclear, the review slows down and the final approval becomes a guess.',
        },
      ],
    },
    way: {
      eyebrow: 'The shared workspace',
      title: 'One order holds the whole conversation',
      highlight: 'the whole conversation',
      description:
        'Each project carries its own brief, footage, draft versions, review notes, and delivery shelf from start to finish.',
      cards: [
        {
          eyebrow: 'Before the edit',
          title: 'A brief the editor can actually use',
          description:
            'Audience, point, format, deadline, and references stay together before the timeline opens.',
          href: '/services/long-form',
          linkLabel: 'See the long-form process',
          illustration: 'dashboard',
        },
        {
          eyebrow: 'During the edit',
          title: 'A review loop with a visible next step',
          description:
            'Draft versions, timecoded comments, and approval status make the next action obvious to everyone.',
          href: '/contact',
          linkLabel: 'Ask about the workflow',
          illustration: 'timeline',
        },
      ],
    },
    features: [
      {
        eyebrow: 'Brief workspace',
        title: 'The brief is part of the project, not a preamble',
        highlight: 'not a preamble',
        description:
          'The audience, the point, the format, and the deadline live beside the footage and the draft they describe.',
        bullets: [
          {
            title: 'One structured request',
            description:
              'Format, runtime, captions, references, and delivery needs are captured before work begins.',
          },
          {
            title: 'Footage intake in context',
            description:
              'Uploaded files stay attached to the order instead of becoming another scattered folder.',
          },
          {
            title: 'A confirmed scope',
            description:
              'The revision boundary and delivery package are visible before the first cut.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        eyebrow: 'Live progress',
        title: 'You can see the status without sending a check-in',
        highlight: 'without sending a check-in',
        description:
          'Every order follows the same path, so the current stage and the next handoff are always visible.',
        bullets: [
          {
            title: 'A clear order status',
            description:
              'Submitted, assigned, in progress, in review, approved, and delivered are visible states, not private updates.',
          },
          {
            title: 'Notes attached to the draft',
            description:
              'Comments stay with the version and timestamp they describe, so the next pass starts with context.',
          },
          {
            title: 'Revisions loop visibly',
            description:
              'A revision moves back to production with the notes attached, then returns to review when the next cut is ready.',
          },
        ],
        mockup: 'caption',
      },
      {
        eyebrow: 'Roles and access',
        title: 'The right people see the right part of the work',
        highlight: 'the right part of the work',
        description:
          'Customers, editors, and admins share one order without exposing the controls each role does not need.',
        bullets: [
          {
            title: 'Customer view',
            description:
              'Briefs, drafts, comments, approvals, and final files stay available in the order.',
          },
          {
            title: 'Editor view',
            description:
              'Editors see the production work they need without access to billing or account administration.',
          },
          {
            title: 'Admin view',
            description:
              'Admins can assign work, monitor status, and keep the delivery calendar moving.',
          },
        ],
        mockup: 'team',
      },
      {
        eyebrow: 'Final delivery',
        title: 'Approved files leave in a package you can use',
        highlight: 'a package you can use',
        description:
          'The delivery shelf holds the finished video, captions, and requested formats in one place after approval.',
        bullets: [
          {
            title: 'The formats you asked for',
            description:
              'Horizontal, vertical, and captioned versions arrive together when the brief included them.',
          },
          {
            title: 'A stable download shelf',
            description:
              'Approved files remain available after the review closes, so the handoff does not expire mid-launch.',
          },
          {
            title: 'Ownership is clear',
            description:
              'You own the delivered video. Working files stay private to the workspace.',
          },
        ],
        mockup: 'thumbnails',
      },
    ],
    cta: {
      eyebrow: 'Start in one place',
      title: 'Open one order.',
      accent: 'Keep the whole project calm.',
      description:
        'The brief, footage, notes, and delivery stay together from the first upload to the final download.',
      primaryAction: START_ORDER,
      secondaryAction: SEE_PRICING,
    },
  },
  contact: {
    eyebrow: 'Contact',
    headline: 'Talk to a real person',
    highlight: 'real person',
    description:
      'Ask about a package, a custom workflow, or a project that does not fit neatly into a form. The reply comes from the team that will handle the work.',
    primaryAction: {
      label: 'Email the team',
      href: `mailto:${SUPPORT_EMAIL}`,
    },
    secondaryAction: START_ORDER,
    heroMockup: {
      windowTitle: 'Support desk',
      toolbarLabel: 'A direct line to the editing team',
      status: 'Online',
      toolbarItems: ['Message', 'Reply', 'Scope', 'Next step'],
      railLabel: 'Conversation',
      clips: [
        { label: 'Your note', from: '#38bdf8', to: '#6366f1' },
        { label: 'The reply', from: '#a78bfa', to: '#ec4899' },
        { label: 'The plan', from: '#fbbf24', to: '#fb7185' },
        { label: 'The handoff', from: '#2dd4bf', to: '#3b82f6' },
      ],
      activeClipIndex: 1,
      canvasLabel: 'Human reply',
      canvasCaption: 'A clear answer from the team doing the work',
      popoverTitle: 'Help topics',
      swatches: ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'],
      timelineLabel: 'Reply path',
      timelineSegments: [
        { label: 'Read', width: '22%', color: '#38bdf8' },
        { label: 'Scope', width: '30%', color: '#a78bfa' },
        { label: 'Answer', width: '30%', color: '#f472b6' },
        { label: 'Next', width: '18%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'Before you write',
      title: 'The fastest reply starts with the useful details',
      highlight: 'useful details',
      description:
        'You do not need a finished brief to get in touch. A few basics help the team answer with a real recommendation instead of a generic brochure.',
      items: [
        {
          title: 'What you publish',
          description:
            'Long-form, vertical, podcast, course, property, or a mix. The format narrows the right package quickly.',
        },
        {
          title: 'How often it ships',
          description:
            'One video, a weekly block, or a full channel rhythm changes the recommendation more than runtime alone.',
        },
        {
          title: 'When it needs to land',
          description:
            'A real deadline helps the team confirm capacity and set a turnaround that is actually possible.',
        },
      ],
    },
    way: {
      eyebrow: 'What happens next',
      title: 'A short conversation, then a clear next step',
      highlight: 'a clear next step',
      description:
        'The first reply confirms the fit, the package, and any missing detail. If the project is unusual, the team says so plainly.',
      cards: [
        {
          eyebrow: 'First reply',
          title: 'A person reads the note and answers',
          description:
            'Expect a reply within one business day, with a package suggestion or a question that moves the project forward.',
          href: '/pricing',
          linkLabel: 'See the packages',
          illustration: 'team',
        },
        {
          eyebrow: 'First order',
          title: 'The brief becomes a visible project',
          description:
            'Once the scope is clear, the order opens with the footage, deadline, review loop, and delivery package attached.',
          href: '/platform',
          linkLabel: 'See the workspace',
          illustration: 'dashboard',
        },
      ],
    },
    features: [
      {
        eyebrow: 'A real reply',
        title: 'You hear from the team that does the work',
        highlight: 'the team that does the work',
        description:
          'No ticket maze and no generic sales script. The reply comes from people who understand the editing workflow.',
        bullets: [
          {
            title: 'A direct support address',
            description:
              `Write to ${SUPPORT_EMAIL} or use the form. Both reach the same team.`,
          },
          {
            title: 'One business day',
            description:
              'Most messages receive a reply within one business day, including a clear next step.',
          },
          {
            title: 'No pressure to book',
            description:
              'If the service is not the right fit, the team will say so instead of forcing a package.',
          },
        ],
        mockup: 'dashboard',
      },
      {
        eyebrow: 'A useful answer',
        title: 'The reply includes the detail you can act on',
        highlight: 'you can act on',
        description:
          'A recommendation should include the format, the likely package, the turnaround, and anything the team still needs to know.',
        bullets: [
          {
            title: 'A package suggestion',
            description:
              'Based on the format and volume you describe, not on the largest plan available.',
          },
          {
            title: 'A realistic timeline',
            description:
              'The first-cut window and any schedule constraint are stated before the order begins.',
          },
          {
            title: 'A clear next action',
            description:
              'Whether that is uploading footage, choosing a format, or booking a fit call, the next step is explicit.',
          },
        ],
        mockup: 'calendar',
      },
    ],
    cta: {
      eyebrow: 'Still deciding?',
      title: 'Send the question.',
      accent: 'We will send a straight answer.',
      description:
        'Share the format, the rough volume, and the deadline. If you are not sure yet, say that too. The team will help narrow it down.',
      primaryAction: {
        label: 'Email the team',
        href: `mailto:${SUPPORT_EMAIL}`,
      },
      secondaryAction: SEE_PRICING,
    },
  },
  about: {
    eyebrow: 'About',
    headline: 'Video editing, simplified',
    highlight: 'simplified',
    description:
      'A small senior editing team built around clear briefs, focused feedback, and a finished file that is ready to publish.',
    primaryAction: START_ORDER,
    secondaryAction: TALK_TO_TEAM,
    heroMockup: {
      windowTitle: 'Studio workspace',
      toolbarLabel: 'Small crew · clear ownership',
      status: 'Calm',
      toolbarItems: ['Brief', 'Edit', 'Review', 'Deliver'],
      railLabel: 'The work',
      clips: [
        { label: 'Brief', from: '#38bdf8', to: '#6366f1' },
        { label: 'Edit', from: '#a78bfa', to: '#ec4899' },
        { label: 'Review', from: '#fbbf24', to: '#fb7185' },
        { label: 'Deliver', from: '#2dd4bf', to: '#3b82f6' },
      ],
      activeClipIndex: 0,
      canvasLabel: 'Working principle',
      canvasCaption: 'Clarity before cuts, finish before delivery',
      popoverTitle: 'Team palette',
      swatches: ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399'],
      timelineLabel: 'Studio rhythm',
      timelineSegments: [
        { label: 'Clarify', width: '24%', color: '#38bdf8' },
        { label: 'Shape', width: '34%', color: '#a78bfa' },
        { label: 'Review', width: '24%', color: '#f472b6' },
        { label: 'Finish', width: '18%', color: '#fbbf24' },
      ],
    },
    pain: {
      eyebrow: 'Why we exist',
      title: 'Editing should not feel like managing a production team',
      highlight: 'managing a production team',
      description:
        'Most video work does not fail because the footage is bad. It fails because the brief is vague, the feedback is scattered, or the deadline was never realistic.',
      items: [
        {
          title: 'The brief stays vague',
          description:
            'When the audience, the point, and the deadline are not shared, every cut becomes a guess.',
        },
        {
          title: 'The feedback scatters',
          description:
            'Notes in chat, email, and a call are hard to turn into a focused revision pass.',
        },
        {
          title: 'The deadline was never real',
          description:
            'A finish date without a plan for footage, review, and approvals creates pressure instead of clarity.',
        },
      ],
    },
    values: {
      eyebrow: 'What we value',
      title: 'The standards we do not trade away',
      highlight: 'do not trade away',
      description:
        'We built the service around four principles that keep the work calm and the finish reliable.',
      items: [
        {
          title: 'Dedicated team',
          description: 'A small accountable crew with a named contact who owns the handoff.',
        },
        {
          title: 'Multiple specialists',
          description: 'Editing, motion, color, and sound in one workflow.',
        },
        {
          title: 'Live progress',
          description: 'Drafts, comments, and approvals in one place.',
        },
        {
          title: 'Useful revisions',
          description: 'Timecoded notes and honest trade-offs before pushing back.',
        },
      ],
    },
    way: {
      eyebrow: 'How we work',
      title: 'A small team, a clear process, a finished handoff',
      highlight: 'a finished handoff',
      description:
        'One workspace, one accountable crew, and a standard that treats sound, captions, color, and exports as part of the edit.',
      cards: [
        {
          eyebrow: 'Clarity',
          title: 'Confirm the brief before the timeline opens',
          description:
            'The team asks about audience, format, deadline, and the point of the piece before shaping the first cut.',
          href: '/platform',
          linkLabel: 'See the workspace',
          illustration: 'dashboard',
        },
        {
          eyebrow: 'Finish',
          title: 'Treat the delivery as part of the craft',
          description:
            'Readable captions, a balanced mix, clean color, and the requested formats are part of the final pass.',
          href: '/examples',
          linkLabel: 'Browse the formats',
          illustration: 'caption',
        },
      ],
    },
    features: [
      {
        eyebrow: 'Story over spectacle',
        title: 'Effects earn their place in the cut',
        highlight: 'earn their place',
        description:
          'Transitions and motion are useful when they serve the point. A clever cut that distracts from the reason someone is watching is not a good trade.',
        bullets: [
          {
            title: 'Protect the point',
            description:
              'Every structural choice should help the viewer understand, feel, or act on the main idea.',
          },
          {
            title: 'Remove the detour',
            description:
              'A tighter edit is usually a clearer edit, even when the removed moment was expensive to shoot.',
          },
          {
            title: 'Keep the tone honest',
            description:
              'Music, pacing, and captions should support the subject rather than manufacture a mood it does not have.',
          },
        ],
        mockup: 'timeline',
      },
      {
        eyebrow: 'A calm finish',
        title: 'The final handoff should feel ready',
        highlight: 'feel ready',
        description:
          'The delivery package arrives with the requested files and a clear record of what was approved, so publishing is not another project.',
        bullets: [
          {
            title: 'The right exports',
            description:
              'Horizontal, vertical, and captioned versions are prepared for the channels in the brief.',
          },
          {
            title: 'A visible approval',
            description:
              'The approved version is clear to the customer, the editor, and the admin before delivery closes.',
          },
          {
            title: 'Clear ownership',
            description:
              'The final video belongs to you. Working files stay private to the workspace.',
          },
        ],
        mockup: 'thumbnails',
      },
    ],
    cta: {
      eyebrow: 'Work with the crew',
      title: 'Send the next project.',
      accent: 'We will make the handoff calm.',
      description:
        'Start with one video or a full channel rhythm. A clear brief and a visible workspace come first.',
      primaryAction: START_ORDER,
      secondaryAction: TALK_TO_TEAM,
    },
  },
};

export function getMarketingPageContent(
  slug: MarketingPageSlug
): MarketingPageContent {
  return MARKETING_PAGES[slug];
}
