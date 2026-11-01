import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface SectionIllustrationProps {
  className?: string;
}

interface IllustrationShellProps extends SectionIllustrationProps {
  id: string;
  label: string;
  children: ReactNode;
}

function IllustrationShell({
  id,
  label,
  className,
  children,
}: IllustrationShellProps) {
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-label={label}
      className={cn('h-full w-full', className)}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2ff" />
          <stop offset="55%" stopColor="#f5f3ff" />
          <stop offset="100%" stopColor="#fdf2f8" />
        </linearGradient>
        <linearGradient id={`${id}-accent`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id={`${id}-navy`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" rx="24" fill={`url(#${id}-bg)`} />
      <circle cx="28" cy="30" r="34" fill="#bae6fd" fillOpacity="0.55" />
      <circle cx="292" cy="168" r="42" fill="#fbcfe8" fillOpacity="0.55" />
      {children}
    </svg>
  );
}

export function TimelineEditorIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-timeline';

  return (
    <IllustrationShell id={id} label="Timeline editor illustration" className={className}>
      <rect x="28" y="26" width="264" height="148" rx="18" fill={`url(#${id}-navy)`} />
      <circle cx="46" cy="44" r="4" fill="#fb7185" />
      <circle cx="60" cy="44" r="4" fill="#fbbf24" />
      <circle cx="74" cy="44" r="4" fill="#34d399" />
      <rect x="92" y="39" width="84" height="10" rx="5" fill="#ffffff" fillOpacity="0.16" />
      <rect x="46" y="62" width="72" height="40" rx="8" fill={`url(#${id}-accent)`} />
      <path d="M74 75v14l12-7z" fill="#ffffff" />
      <rect x="126" y="62" width="48" height="40" rx="8" fill="#1d4ed8" fillOpacity="0.45" />
      <rect x="182" y="62" width="92" height="40" rx="8" fill="#312e81" fillOpacity="0.55" />
      <rect x="46" y="110" width="228" height="8" rx="4" fill="#ffffff" fillOpacity="0.12" />
      <rect x="46" y="110" width="118" height="8" rx="4" fill={`url(#${id}-accent)`} />
      <rect x="46" y="126" width="228" height="8" rx="4" fill="#ffffff" fillOpacity="0.12" />
      <rect x="104" y="126" width="86" height="8" rx="4" fill="#22d3ee" fillOpacity="0.8" />
      <rect x="46" y="142" width="228" height="8" rx="4" fill="#ffffff" fillOpacity="0.12" />
      <rect x="190" y="142" width="54" height="8" rx="4" fill="#f472b6" fillOpacity="0.85" />
      <g className="animate-draw-line">
        <path d="M172 58v100" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="animate-pulse-soft">
        <circle cx="172" cy="58" r="5" fill="#f8fafc" />
      </g>
    </IllustrationShell>
  );
}

export function CaptionEditorIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-caption';

  return (
    <IllustrationShell id={id} label="Caption editor illustration" className={className}>
      <rect x="30" y="24" width="260" height="152" rx="18" fill={`url(#${id}-navy)`} />
      <rect x="46" y="42" width="134" height="88" rx="10" fill={`url(#${id}-accent)`} />
      <path d="M103 76v22l18-11z" fill="#ffffff" fillOpacity="0.9" />
      <rect x="196" y="42" width="78" height="116" rx="10" fill="#ffffff" fillOpacity="0.96" />
      <rect x="206" y="54" width="58" height="6" rx="3" fill="#cbd5e1" />
      <rect x="206" y="68" width="44" height="6" rx="3" fill="#e2e8f0" />
      <rect x="206" y="82" width="52" height="6" rx="3" fill="#e2e8f0" />
      <rect x="206" y="96" width="36" height="6" rx="3" fill="#e2e8f0" />
      <rect x="206" y="118" width="58" height="24" rx="6" fill="#f1f5f9" />
      <rect x="206" y="118" width="30" height="24" rx="6" className="animate-shimmer" fill="#c4b5fd" />
      <rect x="58" y="142" width="110" height="18" rx="9" fill="#020617" fillOpacity="0.65" />
      <rect x="66" y="148" width="42" height="5" rx="2.5" fill="#f8fafc" />
      <rect x="114" y="148" width="44" height="5" rx="2.5" fill="#fbbf24" />
      <g className="animate-float">
        <circle cx="242" cy="158" r="10" fill={`url(#${id}-accent)`} />
      </g>
    </IllustrationShell>
  );
}

export function ThumbnailGridIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-thumbnails';

  return (
    <IllustrationShell id={id} label="Thumbnail grid illustration" className={className}>
      <rect x="34" y="26" width="252" height="148" rx="18" fill="#ffffff" fillOpacity="0.78" />
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const x = 48 + column * 78;
        const y = 44 + row * 58;

        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width="66"
              height="46"
              rx="8"
              fill={index === 1 ? `url(#${id}-accent)` : '#e2e8f0'}
              stroke={index === 1 ? '#4f46e5' : 'transparent'}
              strokeWidth="2"
            />
            <circle cx={x + 33} cy={y + 23} r="9" fill="#ffffff" fillOpacity={index === 1 ? 0.85 : 0.7} />
            <path
              d={`M${x + 30} ${y + 18}l8 5-8 5z`}
              fill={index === 1 ? '#6d28d9' : '#94a3b8'}
            />
            <rect x={x} y={y + 52} width="40" height="4" rx="2" fill="#cbd5e1" />
          </g>
        );
      })}
      <g className="animate-cursor-move">
        <path d="M238 132l12 28 5-12 12-4z" fill="#0f172a" />
      </g>
    </IllustrationShell>
  );
}

export function AnalyticsBarsIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-analytics';

  return (
    <IllustrationShell id={id} label="Analytics bars illustration" className={className}>
      <rect x="30" y="26" width="260" height="148" rx="18" fill="#ffffff" fillOpacity="0.82" />
      <rect x="46" y="42" width="70" height="8" rx="4" fill="#cbd5e1" />
      <rect x="46" y="58" width="42" height="6" rx="3" fill="#e2e8f0" />
      {[
        { x: 52, height: 46 },
        { x: 88, height: 66 },
        { x: 124, height: 54 },
        { x: 160, height: 82 },
        { x: 196, height: 70 },
        { x: 232, height: 96 },
      ].map((bar, index) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={142 - bar.height}
          width="20"
          height={bar.height}
          rx="6"
          fill={index > 3 ? `url(#${id}-accent)` : '#c7d2fe'}
        />
      ))}
      <g className="animate-draw-line">
        <path
          d="M62 96l36-16 36 8 36-26 36 10 36-24"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <circle cx="242" cy="48" r="5" fill="#f472b6" />
    </IllustrationShell>
  );
}

export function DashboardCardsIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-dashboard';

  return (
    <IllustrationShell id={id} label="Dashboard cards illustration" className={className}>
      <g className="animate-float">
        <rect x="28" y="42" width="84" height="112" rx="14" fill="#ffffff" fillOpacity="0.9" />
        <circle cx="70" cy="82" r="22" fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="70"
          cy="82"
          r="22"
          fill="none"
          stroke={`url(#${id}-accent)`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="94 140"
          transform="rotate(-90 70 82)"
        />
        <rect x="48" y="118" width="44" height="6" rx="3" fill="#e2e8f0" />
        <rect x="56" y="130" width="28" height="5" rx="2.5" fill="#cbd5e1" />
      </g>
      <g className="animate-float" style={{ animationDelay: '-1.8s' }}>
        <rect x="120" y="30" width="84" height="124" rx="14" fill={`url(#${id}-navy)`} />
        <rect x="132" y="44" width="48" height="6" rx="3" fill="#ffffff" fillOpacity="0.4" />
        <rect x="132" y="58" width="30" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.22" />
        <path
          d="M132 108l14-16 14 10 12-22 10 14"
          fill="none"
          stroke={`url(#${id}-accent)`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="132" y="126" width="60" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.18" />
      </g>
      <g className="animate-float" style={{ animationDelay: '-3.2s' }}>
        <rect x="212" y="54" width="80" height="100" rx="14" fill="#ffffff" fillOpacity="0.9" />
        <rect x="224" y="68" width="36" height="6" rx="3" fill="#e2e8f0" />
        {[0, 1, 2].map((index) => (
          <rect
            key={index}
            x="224"
            y={84 + index * 16}
            width={index === 1 ? 54 : 38}
            height="8"
            rx="4"
            fill={index === 1 ? `url(#${id}-accent)` : '#e2e8f0'}
          />
        ))}
      </g>
    </IllustrationShell>
  );
}

export function PodcastWaveformIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-podcast';
  const bars = [18, 34, 26, 54, 40, 66, 48, 72, 38, 58, 30, 46, 22, 36, 16];

  return (
    <IllustrationShell id={id} label="Podcast waveform illustration" className={className}>
      <rect x="30" y="46" width="260" height="108" rx="20" fill={`url(#${id}-navy)`} />
      <circle cx="68" cy="100" r="24" fill={`url(#${id}-accent)`} />
      <path d="M62 90v20l16-10z" fill="#ffffff" />
      <g>
        {bars.map((height, index) => (
          <rect
            key={index}
            x={104 + index * 11}
            y={100 - height / 2}
            width="6"
            height={height}
            rx="3"
            fill={index % 4 === 0 ? '#67e8f9' : '#ffffff'}
            fillOpacity={index % 4 === 0 ? 0.95 : 0.7}
            className="animate-pulse-soft"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </g>
      <circle cx="262" cy="100" r="4" fill="#f472b6" />
    </IllustrationShell>
  );
}

export function HouseListingIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-house';

  return (
    <IllustrationShell id={id} label="House listing illustration" className={className}>
      <rect x="28" y="34" width="152" height="132" rx="16" fill="#ffffff" fillOpacity="0.82" />
      <path
        d="M52 104l48-38 48 38v42H52z"
        fill={`url(#${id}-accent)`}
        fillOpacity="0.9"
      />
      <path d="M44 106l56-44 56 44" fill="none" stroke="#312e81" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="86" y="116" width="24" height="30" rx="4" fill="#ffffff" fillOpacity="0.85" />
      <rect x="64" y="114" width="14" height="14" rx="3" fill="#ffffff" fillOpacity="0.7" />
      <rect x="120" y="114" width="14" height="14" rx="3" fill="#ffffff" fillOpacity="0.7" />
      <g className="animate-float">
        <rect x="198" y="52" width="94" height="108" rx="14" fill="#ffffff" />
        <rect x="212" y="66" width="66" height="38" rx="8" fill={`url(#${id}-accent)`} />
        <rect x="212" y="114" width="42" height="6" rx="3" fill="#cbd5e1" />
        <rect x="212" y="126" width="58" height="5" rx="2.5" fill="#e2e8f0" />
        <rect x="212" y="140" width="30" height="8" rx="4" fill="#c4b5fd" />
      </g>
    </IllustrationShell>
  );
}

export function CourseModulesIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-course';

  return (
    <IllustrationShell id={id} label="Course modules illustration" className={className}>
      {[0, 1, 2].map((index) => (
        <g
          key={index}
          className="animate-float"
          style={{ animationDelay: `${index * -1.4}s` }}
        >
          <rect
            x={42 + index * 10}
            y={38 + index * 44}
            width="236"
            height="38"
            rx="12"
            fill="#ffffff"
            fillOpacity={index === 1 ? 0.98 : 0.82}
            stroke={index === 1 ? '#c4b5fd' : 'transparent'}
            strokeWidth="2"
          />
          <circle cx={62 + index * 10} cy={57 + index * 44} r="10" fill={index === 0 ? `url(#${id}-accent)` : '#e0e7ff'} />
          {index > 0 ? (
            <path
              d={`M${57 + index * 10} ${57 + index * 44}l3 3 6-6`}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path d={`M${59 + index * 10} ${53 + index * 44}l6 4 0 8-6 0z`} fill="#ffffff" />
          )}
          <rect x={82 + index * 10} y={48 + index * 44} width={index === 1 ? 98 : 72} height="6" rx="3" fill="#cbd5e1" />
          <rect x={82 + index * 10} y={60 + index * 44} width={index === 2 ? 120 : 86} height="5" rx="2.5" fill="#e2e8f0" />
          <rect x={82 + index * 10} y={70 + index * 44} width={index === 2 ? 54 : 138} height="4" rx="2" fill={index === 2 ? `url(#${id}-accent)` : '#e2e8f0'} />
        </g>
      ))}
      <circle cx="274" cy="40" r="7" fill={`url(#${id}-accent)`} className="animate-pulse-soft" />
    </IllustrationShell>
  );
}

export function ClinicCardIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-clinic';

  return (
    <IllustrationShell id={id} label="Clinic card illustration" className={className}>
      <rect x="30" y="30" width="150" height="140" rx="18" fill="#ffffff" fillOpacity="0.84" />
      <circle cx="105" cy="92" r="38" fill={`url(#${id}-accent)`} fillOpacity="0.18" />
      <circle cx="105" cy="92" r="26" fill={`url(#${id}-accent)`} />
      <rect x="99" y="78" width="12" height="28" rx="3" fill="#ffffff" />
      <rect x="91" y="86" width="28" height="12" rx="3" fill="#ffffff" />
      <path
        d="M62 142h18l7-12 9 24 8-12h22"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-draw-line"
      />
      <g className="animate-float">
        <rect x="196" y="48" width="96" height="112" rx="14" fill="#ffffff" />
        <rect x="210" y="62" width="52" height="6" rx="3" fill="#cbd5e1" />
        <rect x="210" y="76" width="66" height="5" rx="2.5" fill="#e2e8f0" />
        <rect x="210" y="90" width="44" height="5" rx="2.5" fill="#e2e8f0" />
        <rect x="210" y="112" width="66" height="22" rx="7" fill={`url(#${id}-accent)`} fillOpacity="0.2" />
        <rect x="220" y="120" width="28" height="5" rx="2.5" fill="#7c3aed" />
        <circle cx="266" cy="123" r="4" fill="#7c3aed" />
      </g>
    </IllustrationShell>
  );
}

export function LawDocIllustration({ className }: SectionIllustrationProps) {
  const id = 'pe-illustration-law';

  return (
    <IllustrationShell id={id} label="Law document illustration" className={className}>
      <rect x="74" y="24" width="150" height="156" rx="16" fill="#ffffff" fillOpacity="0.92" />
      <rect x="92" y="44" width="60" height="8" rx="4" fill="#cbd5e1" />
      {[0, 1, 2, 3, 4].map((index) => (
        <rect
          key={index}
          x="92"
          y={66 + index * 14}
          width={index % 2 === 0 ? 114 : 88}
          height="5"
          rx="2.5"
          fill="#e2e8f0"
        />
      ))}
      <path d="M92 144h72" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
      <rect x="92" y="156" width="42" height="10" rx="5" fill={`url(#${id}-accent)`} />
      <g className="animate-float">
        <circle cx="238" cy="88" r="34" fill={`url(#${id}-accent)`} fillOpacity="0.16" />
        <path d="M238 56v62" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M214 68h48" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M214 68l-9 18h18z" fill={`url(#${id}-accent)`} />
        <path d="M262 68l-9 18h18z" fill={`url(#${id}-accent)`} />
        <circle cx="238" cy="118" r="4" fill="#312e81" />
      </g>
    </IllustrationShell>
  );
}

export function CalendarIllustration({ className }: SectionIllustrationProps) {
  const id = 'pe-illustration-calendar';

  return (
    <IllustrationShell id={id} label="Calendar illustration" className={className}>
      <rect x="38" y="32" width="244" height="136" rx="18" fill="#ffffff" fillOpacity="0.9" />
      <rect x="38" y="32" width="244" height="34" rx="18" fill={`url(#${id}-accent)`} />
      <rect x="50" y="54" width="220" height="2" fill="#ffffff" fillOpacity="0.2" />
      <rect x="58" y="44" width="58" height="10" rx="5" fill="#ffffff" fillOpacity="0.7" />
      <circle cx="256" cy="49" r="7" fill="#ffffff" fillOpacity="0.55" />
      {Array.from({ length: 21 }).map((_, index) => {
        const column = index % 7;
        const row = Math.floor(index / 7);
        const x = 56 + column * 32;
        const y = 82 + row * 26;
        const active = index === 9 || index === 16;

        return (
          <g key={index}>
            <rect
              x={x}
              y={y}
              width="22"
              height="18"
              rx="5"
              fill={active ? `url(#${id}-accent)` : '#f1f5f9'}
            />
            <circle cx={x + 11} cy={y + 9} r="2" fill={active ? '#ffffff' : '#cbd5e1'} />
          </g>
        );
      })}
      <g className="animate-cursor-move">
        <path d="M218 138l12 26 4-11 11-4z" fill="#0f172a" />
      </g>
    </IllustrationShell>
  );
}

export function TeamAvatarsIllustration({
  className,
}: SectionIllustrationProps) {
  const id = 'pe-illustration-team';
  const avatars = [
    { x: 92, y: 66, fill: '#38bdf8', initials: 'MC' },
    { x: 156, y: 54, fill: '#a78bfa', initials: 'DO' },
    { x: 214, y: 76, fill: '#f472b6', initials: 'PR' },
    { x: 142, y: 132, fill: '#2dd4bf', initials: 'JW' },
  ];

  return (
    <IllustrationShell id={id} label="Team avatars illustration" className={className}>
      <path d="M92 66l64-12 58 22-72 56z" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="5 5" className="animate-draw-line" />
      <rect x="112" y="92" width="96" height="38" rx="12" fill="#ffffff" fillOpacity="0.94" />
      <rect x="126" y="104" width="46" height="6" rx="3" fill="#cbd5e1" />
      <rect x="126" y="116" width="64" height="4" rx="2" fill="#e2e8f0" />
      {avatars.map((avatar, index) => (
        <g
          key={avatar.initials}
          className="animate-float"
          style={{ animationDelay: `${index * -1.1}s` }}
        >
          <circle cx={avatar.x} cy={avatar.y} r="24" fill="#ffffff" fillOpacity="0.85" />
          <circle cx={avatar.x} cy={avatar.y} r="18" fill={avatar.fill} />
          <text
            x={avatar.x}
            y={avatar.y + 4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill="#ffffff"
          >
            {avatar.initials}
          </text>
        </g>
      ))}
      <circle cx="246" cy="146" r="8" fill={`url(#${id}-accent)`} className="animate-pulse-soft" />
    </IllustrationShell>
  );
}

export type SectionIllustrationName =
  | 'timeline'
  | 'caption'
  | 'thumbnails'
  | 'analytics'
  | 'dashboard'
  | 'podcast'
  | 'house'
  | 'course'
  | 'clinic'
  | 'law'
  | 'calendar'
  | 'team';

export interface SectionIllustrationSwitchProps extends SectionIllustrationProps {
  name: SectionIllustrationName;
}

export function SectionIllustration({
  name,
  className,
}: SectionIllustrationSwitchProps) {
  switch (name) {
    case 'caption':
      return <CaptionEditorIllustration className={className} />;
    case 'thumbnails':
      return <ThumbnailGridIllustration className={className} />;
    case 'analytics':
      return <AnalyticsBarsIllustration className={className} />;
    case 'dashboard':
      return <DashboardCardsIllustration className={className} />;
    case 'podcast':
      return <PodcastWaveformIllustration className={className} />;
    case 'house':
      return <HouseListingIllustration className={className} />;
    case 'course':
      return <CourseModulesIllustration className={className} />;
    case 'clinic':
      return <ClinicCardIllustration className={className} />;
    case 'law':
      return <LawDocIllustration className={className} />;
    case 'calendar':
      return <CalendarIllustration className={className} />;
    case 'team':
      return <TeamAvatarsIllustration className={className} />;
    case 'timeline':
    default:
      return <TimelineEditorIllustration className={className} />;
  }
}
