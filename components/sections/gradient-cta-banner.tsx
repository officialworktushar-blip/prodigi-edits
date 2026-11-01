import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface GradientCTABannerAction {
  label: string;
  href: string;
}

export interface GradientCTABannerProps {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  primaryAction?: GradientCTABannerAction;
  secondaryAction?: GradientCTABannerAction;
  className?: string;
}

type FanChart = 'bars' | 'donut' | 'line';

interface FanCardConfig {
  left: string;
  top: string;
  rotate: string;
  from: string;
  to: string;
  chart: FanChart;
  delay: string;
  depth?: boolean;
}

const FAN_CARDS: FanCardConfig[] = [
  {
    left: '2%',
    top: '18%',
    rotate: '-14deg',
    from: '#38bdf8',
    to: '#6366f1',
    chart: 'bars',
    delay: '-1.2s',
    depth: true,
  },
  {
    left: '17%',
    top: '4%',
    rotate: '-8deg',
    from: '#a78bfa',
    to: '#7c3aed',
    chart: 'line',
    delay: '-2.4s',
  },
  {
    left: '35%',
    top: '0%',
    rotate: '-2deg',
    from: '#f472b6',
    to: '#db2777',
    chart: 'donut',
    delay: '-3.1s',
  },
  {
    left: '54%',
    top: '8%',
    rotate: '6deg',
    from: '#fbbf24',
    to: '#f97316',
    chart: 'bars',
    delay: '-1.8s',
  },
  {
    left: '68%',
    top: '24%',
    rotate: '13deg',
    from: '#2dd4bf',
    to: '#0ea5e9',
    chart: 'line',
    delay: '-2.8s',
    depth: true,
  },
  {
    left: '30%',
    top: '38%',
    rotate: '4deg',
    from: '#c4b5fd',
    to: '#4f46e5',
    chart: 'donut',
    delay: '-4s',
  },
  {
    left: '48%',
    top: '44%',
    rotate: '-5deg',
    from: '#f9a8d4',
    to: '#ec4899',
    chart: 'bars',
    delay: '-0.8s',
    depth: true,
  },
];

function FanChartGraphic({ chart }: { chart: FanChart }) {
  if (chart === 'donut') {
    return (
      <svg viewBox="0 0 64 48" aria-hidden="true" className="h-12 w-full">
        <circle cx="24" cy="24" r="13" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="7" />
        <circle
          cx="24"
          cy="24"
          r="13"
          fill="none"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="56 82"
          transform="rotate(-90 24 24)"
        />
        <rect x="44" y="12" width="14" height="4" rx="2" fill="#ffffff" fillOpacity="0.75" />
        <rect x="44" y="21" width="10" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
        <rect x="44" y="28" width="12" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
      </svg>
    );
  }

  if (chart === 'line') {
    return (
      <svg viewBox="0 0 64 48" aria-hidden="true" className="h-12 w-full">
        <path
          d="M4 36l12-10 10 5 12-16 10 8 12-12"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="60" cy="11" r="3" fill="#ffffff" />
        <rect x="4" y="41" width="24" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.45" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 48" aria-hidden="true" className="h-12 w-full">
      {[18, 28, 22, 34, 27, 39].map((height, index) => (
        <rect
          key={index}
          x={4 + index * 10}
          y={42 - height}
          width="6"
          height={height}
          rx="2"
          fill="#ffffff"
          fillOpacity={index % 2 === 0 ? 0.85 : 0.45}
        />
      ))}
    </svg>
  );
}

function FanCard({ card }: { card: FanCardConfig }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-float absolute w-[150px] sm:w-[168px]', card.depth ? 'opacity-70 blur-[1px]' : '')}
      style={{ left: card.left, top: card.top, animationDelay: card.delay }}
    >
      <div
        className="rounded-2xl border border-white/25 p-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)] backdrop-blur-sm"
        style={{
          backgroundImage: `linear-gradient(145deg, ${card.from}, ${card.to})`,
          transform: `rotate(${card.rotate})`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="h-1.5 w-12 rounded-full bg-white/80" />
          <span className="h-2 w-2 rounded-full bg-white/80" />
        </div>
        <div className="mt-2 rounded-lg bg-white/15 p-2">
          <FanChartGraphic chart={card.chart} />
        </div>
        <div className="mt-2 space-y-1.5">
          <span className="block h-1.5 w-20 rounded-full bg-white/65" />
          <span className="block h-1.5 w-14 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}

export function GradientCTABanner({
  eyebrow,
  title,
  accent,
  description,
  primaryAction = { label: 'Start an order', href: '/signup' },
  secondaryAction,
  className,
}: GradientCTABannerProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-[linear-gradient(115deg,#07131f_0%,#24104f_52%,#0b3b8c_100%)] text-white',
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-screen-1200 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:px-8">
        <div className="max-w-xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className={cn(
              'text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl',
              eyebrow ? 'mt-4' : ''
            )}
          >
            <span className="block text-white">{title}</span>
            {accent ? (
              <span className="text-gradient-hero animate-text-shimmer mt-1 block">
                {accent}
              </span>
            ) : null}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-7 text-slate-200/85">
              {description}
            </p>
          ) : null}

          {primaryAction || secondaryAction ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {primaryAction ? (
                <Link href={primaryAction.href} className="btn-cyan">
                  {primaryAction.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              ) : null}
              {secondaryAction ? (
                <Link href={secondaryAction.href} className="btn-outline-light">
                  {secondaryAction.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="relative hidden h-[360px] w-full sm:block"
          style={{ perspective: '1200px' }}
        >
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-sky-400/10 via-violet-500/10 to-pink-500/10 blur-2xl" />
          {FAN_CARDS.map((card) => (
            <FanCard key={`${card.left}-${card.top}`} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
