import type { BillingType, PlanType } from '../../types/db';

export interface BillingOption {
  value: BillingType;
  label: string;
  note: string;
}

export const BILLING_OPTIONS: BillingOption[] = [
  {
    value: 'QUARTERLY',
    label: 'Quarterly',
    note: 'Billed every 3 months',
  },
  {
    value: 'ANNUAL',
    label: 'Annual',
    note: 'Save 20%',
  },
];

export interface ChannelPlan {
  id: PlanType;
  name: string;
  tagline: string;
  description: string;
  monthlyPrice: number;
  billedLabel: string;
  billingNote: string;
  features: string[];
  ctaLabel: string;
  featured?: boolean;
}

export const CHANNEL_PLANS: Record<BillingType, ChannelPlan[]> = {
  QUARTERLY: [
    {
      id: 'STARTER',
      name: 'Starter',
      tagline: 'A dependable weekly rhythm',
      description:
        'For creators publishing one flagship video a week while keeping a steady stream of shorts moving.',
      monthlyPrice: 749,
      billedLabel: '$2,247 billed quarterly',
      billingNote: 'Works out to $749 per month',
      features: [
        '4 long-form edits each month',
        '12 vertical shorts each month',
        '4 thumbnails with title support',
        'Monthly planning and performance recap',
        '2 revision rounds per edit',
        'Publishing and scheduling included',
      ],
      ctaLabel: 'Start with Starter',
    },
    {
      id: 'PRO',
      name: 'Pro',
      tagline: 'A full channel operating system',
      description:
        'For teams publishing more often and needing a named lead editor, faster turns, and weekly planning.',
      monthlyPrice: 1399,
      billedLabel: '$4,197 billed quarterly',
      billingNote: 'Works out to $1,399 per month',
      features: [
        '8 long-form edits each month',
        '30 vertical shorts each month',
        '8 thumbnails with title support',
        'Weekly planning and performance recap',
        '3 revision rounds per edit',
        'Publishing and scheduling included',
        'Named lead editor and priority support',
      ],
      ctaLabel: 'Start with Pro',
      featured: true,
    },
  ],
  ANNUAL: [
    {
      id: 'STARTER',
      name: 'Starter',
      tagline: 'A dependable weekly rhythm',
      description:
        'For creators publishing one flagship video a week while keeping a steady stream of shorts moving.',
      monthlyPrice: 599,
      billedLabel: '$7,188 billed annually',
      billingNote: 'Works out to $599 per month',
      features: [
        '4 long-form edits each month',
        '12 vertical shorts each month',
        '4 thumbnails with title support',
        'Monthly planning and performance recap',
        '2 revision rounds per edit',
        'Publishing and scheduling included',
      ],
      ctaLabel: 'Start with Starter',
    },
    {
      id: 'PRO',
      name: 'Pro',
      tagline: 'A full channel operating system',
      description:
        'For teams publishing more often and needing a named lead editor, faster turns, and weekly planning.',
      monthlyPrice: 1119,
      billedLabel: '$13,428 billed annually',
      billingNote: 'Works out to $1,119 per month',
      features: [
        '8 long-form edits each month',
        '30 vertical shorts each month',
        '8 thumbnails with title support',
        'Weekly planning and performance recap',
        '3 revision rounds per edit',
        'Publishing and scheduling included',
        'Named lead editor and priority support',
      ],
      ctaLabel: 'Start with Pro',
      featured: true,
    },
  ],
};

export interface ChannelComparisonRow {
  id: string;
  label: string;
  hint?: string;
  starter: string | boolean;
  pro: string | boolean;
}

export const CHANNEL_COMPARISON_ROWS: ChannelComparisonRow[] = [
  {
    id: 'long-form',
    label: 'Long-form edits per month',
    hint: 'Story-led edits up to 30 minutes',
    starter: '4',
    pro: '8',
  },
  {
    id: 'short-form',
    label: 'Vertical shorts per month',
    hint: 'Hook-first cuts from the same footage',
    starter: '12',
    pro: '30',
  },
  {
    id: 'thumbnails',
    label: 'Custom thumbnails per month',
    hint: 'Designed for your channel style',
    starter: '4',
    pro: '8',
  },
  {
    id: 'lead-editor',
    label: 'Editing team',
    hint: 'Who owns the day-to-day edit',
    starter: 'Shared editing pod',
    pro: 'Named lead editor',
  },
  {
    id: 'planning',
    label: 'Content planning',
    hint: 'A repeatable publishing calendar',
    starter: 'Monthly plan',
    pro: 'Weekly planning call',
  },
  {
    id: 'revisions',
    label: 'Revision rounds',
    hint: 'Timecoded notes on every draft',
    starter: '2 per edit',
    pro: '3 per edit',
  },
  {
    id: 'turnaround',
    label: 'Standard turnaround',
    hint: 'Starts when footage and brief are complete',
    starter: '3 business days',
    pro: '2 business days',
  },
  {
    id: 'publishing',
    label: 'Publishing and scheduling',
    hint: 'Uploads prepared in your channel',
    starter: true,
    pro: true,
  },
  {
    id: 'metadata',
    label: 'Titles and descriptions',
    hint: 'Platform-ready copy for every upload',
    starter: true,
    pro: true,
  },
  {
    id: 'recap',
    label: 'Performance recap',
    hint: 'What worked and what to try next',
    starter: 'Monthly',
    pro: 'Weekly',
  },
  {
    id: 'strategy',
    label: 'Strategy call',
    hint: 'A live review with your lead',
    starter: 'Quarterly',
    pro: 'Monthly',
  },
  {
    id: 'support',
    label: 'Priority support channel',
    hint: 'Direct access to the team handling your channel',
    starter: false,
    pro: true,
  },
  {
    id: 'storage',
    label: 'Footage storage',
    hint: 'Active project storage included',
    starter: '100 GB',
    pro: '250 GB',
  },
  {
    id: 'extra-long-form',
    label: 'Additional long-form rate',
    hint: 'When you need more than the monthly allowance',
    starter: '$129 per video',
    pro: '$109 per video',
  },
  {
    id: 'extra-short-form',
    label: 'Additional short-form rate',
    hint: 'When you need more than the monthly allowance',
    starter: '$79 per video',
    pro: '$69 per video',
  },
];
