import type { ReactNode } from 'react';
import {
  Accessibility,
  ChevronDown,
  CirclePlay,
  CircleQuestionMark,
  Contrast,
  Droplets,
  Grid2x2,
  Grip,
  House,
  Lightbulb,
  MessageCirclePlus,
  Palette,
  Play,
  Settings,
  Share,
} from 'lucide-react';
import { mockupCss } from './mockup-styles';

interface MockupShellProps {
  tabs: [string, string];
  accent?: string;
  rail: ReactNode;
  canvas: ReactNode;
  popover?: ReactNode;
  buttonLabel?: string;
  className?: string;
  supportPanel: LayerPanel;
  floatingPanel: LayerPanel;
}

interface LayerPanel {
  title: string;
  detail: string;
  rows: [string, string];
}

function LayeredPanel({ panel, floating = false }: { panel: LayerPanel; floating?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-slate-200/90 bg-white/95 p-2.5 text-slate-800 shadow-[0_18px_45px_-16px_rgba(15,23,42,0.55)] backdrop-blur sm:rounded-2xl sm:p-3 ${floating ? 'rotate-1' : '-rotate-1'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400 sm:text-[9px]">
            {panel.title}
          </p>
          <p className="mt-1 truncate text-[9px] font-semibold text-slate-800 sm:text-[10px]">
            {panel.detail}
          </p>
        </div>
        <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
      </div>
      <div className="mt-2 space-y-1.5">
        {panel.rows.map((row, index) => (
          <div key={row} className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-violet-400'}`} />
            <span className="min-w-0 flex-1 truncate text-[8px] text-slate-500">{row}</span>
            <span className="h-1 w-6 shrink-0 rounded-full bg-slate-100 sm:w-8"><span className={`block h-full rounded-full ${index === 0 ? 'w-3/4 bg-sky-500' : 'w-1/2 bg-violet-400'}`} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RailClip({
  number,
  active,
  title,
  gradientId,
  from,
  to,
}: {
  number: number;
  active: boolean;
  title: string;
  gradientId: string;
  from: string;
  to: string;
}) {
  return (
    <div className="space-y-1">
      <div
        className={`overflow-hidden rounded-md border-2 transition ${
          active ? 'border-sky-400' : 'border-transparent'
        }`}
      >
        <svg viewBox="0 0 64 38" aria-hidden="true" className="block h-auto w-full">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={from} />
              <stop offset="100%" stopColor={to} />
            </linearGradient>
          </defs>
          <rect width="64" height="38" fill={`url(#${gradientId})`} />
          <rect y="22" width="64" height="16" fill="#0f172a" fillOpacity="0.24" />
          <circle cx="32" cy="19" r="7" fill="#ffffff" fillOpacity="0.85" />
          <path d="M30 15.5v7l6-3.5z" fill="#0f172a" />
        </svg>
      </div>
      <p
        className={`truncate text-[9px] ${
          active ? 'font-semibold text-white/80' : 'text-white/35'
        }`}
      >
        {title}
      </p>
    </div>
  );
}

export function PopoverSwatches({
  title,
  swatches,
}: {
  title: string;
  swatches: string[];
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0f172a]/95 p-2.5 shadow-xl backdrop-blur">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
        {title}
      </p>
      <div className="mt-2 grid grid-cols-5 gap-1">
        {swatches.slice(0, 10).map((swatch, index) => (
          <span
            key={`${swatch}-${index}`}
            className={`h-3.5 w-3.5 rounded-full ring-offset-1 ring-offset-slate-900 ${
              index === 0 ? 'ring-2 ring-white' : ''
            }`}
            style={{ backgroundColor: swatch }}
          />
        ))}
      </div>
    </div>
  );
}

export function Cursor() {
  return (
    <div className="pem-cursor">
      <svg viewBox="0 0 24 32" className="h-7 w-5 drop-shadow-lg">
        <path
          d="M2 2l18 13-8 1.5 4.5 9-4 2-4.5-9L2 24z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
      <span className="absolute left-4 top-5 rounded-full bg-violet-600 px-1.5 py-0.5 text-[8px] font-semibold text-white">
        You
      </span>
    </div>
  );
}

export function MockupShell({
  tabs,
  accent = '#4cc9ff',
  rail,
  canvas,
  popover,
  buttonLabel,
  className = '',
  supportPanel,
  floatingPanel,
}: MockupShellProps) {
  return (
    <div aria-hidden="true" className={`pem relative isolate mx-auto w-full max-w-[720px] px-2 py-4 sm:px-4 sm:py-5 ${className}`}>
      <style>{mockupCss}</style>
      <div
        className="pem-win relative z-10 ml-auto w-[96%]"
        style={{
          '--pem-accent': accent,
        } as React.CSSProperties}
      >
        <div className="pem-top">
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center bg-black sm:h-14 sm:w-14">
              <House aria-hidden="true" className="h-5 w-5" style={{ color: '#4cc9ff' }} />
            </div>

            <div className="hidden items-center gap-4 pl-4 sm:flex">
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-slate-300">
                {tabs[0]}
                <ChevronDown aria-hidden="true" className="h-3 w-3" />
              </span>
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-slate-300">
                <Palette aria-hidden="true" className="h-4 w-4" />
                {tabs[1]}
                <ChevronDown aria-hidden="true" className="h-3 w-3" />
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pr-2 sm:gap-4 sm:pr-3">
            <span className="hidden items-center gap-1 text-[11px] uppercase tracking-wider text-slate-300 sm:flex">
              <CirclePlay aria-hidden="true" className="h-4 w-4" />
              Review
              <ChevronDown aria-hidden="true" className="h-3 w-3" />
            </span>
            <span className="hidden items-center gap-1 text-[11px] uppercase tracking-wider text-slate-300 sm:flex">
              <Share aria-hidden="true" className="h-4 w-4" />
              Share
            </span>
            <Contrast aria-hidden="true" className="hidden h-4 w-4 text-slate-300 sm:block" />
            <CircleQuestionMark aria-hidden="true" className="hidden h-4 w-4 text-slate-300 sm:block" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              p.
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-[1fr] bg-gradient-to-br from-[#4a4468] via-[#3a3558] to-[#2a2644] sm:grid-cols-[48px_1fr_56px]">
          <div className="pem-rail">
            <div className="pem-rail-item">
              <Grid2x2 aria-hidden="true" className="h-5 w-5 text-slate-300" />
            </div>
            <div className="pem-rail-item">
              <Droplets aria-hidden="true" className="h-5 w-5 text-slate-300" />
            </div>
            <div className="pem-rail-item">
              <Grip aria-hidden="true" className="h-5 w-5 text-slate-300" />
            </div>
            <div className="pem-rail-item">
              <Lightbulb aria-hidden="true" className="h-5 w-5 text-slate-300" />
            </div>
            <div className="pem-rail-item">
              <CirclePlay aria-hidden="true" className="h-5 w-5 text-slate-300" />
            </div>
            <div className="pem-rail-divider pem-rail-item">
              <Settings aria-hidden="true" className="h-5 w-5 text-slate-300" />
            </div>
            <div className="pem-rail-item">
              <Accessibility aria-hidden="true" className="h-5 w-5 text-slate-300" />
            </div>
            <div className="pem-rail-item">
              <MessageCirclePlus aria-hidden="true" className="h-5 w-5 text-slate-300" />
            </div>
          </div>

          <div className="pem-canvas">
            <div className="relative">
              {canvas}
              {popover && <div className="pem-pop">{popover}</div>}
              <Cursor />
            </div>
            {buttonLabel && (
              <button className="pem-btn" type="button">
                {buttonLabel}
              </button>
            )}
          </div>

          <div className="hidden flex-col border-l border-white/10 sm:flex">
            <div className="flex flex-col">
              {[Droplets, Grip, Lightbulb, CirclePlay].map((Icon, index) => (
                <div
                  key={`top-${index}`}
                  className="flex h-10 items-center justify-center text-slate-300"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-col">
              {[Settings, Accessibility, MessageCirclePlus].map((Icon, index) => (
                <div
                  key={`bottom-${index}`}
                  className="flex h-10 items-center justify-center border-t border-white/10 text-slate-300"
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 z-20 w-[45%] sm:w-[39%]">
        <LayeredPanel panel={supportPanel} />
      </div>
      <div className="absolute right-0 top-[19%] z-20 w-[40%] sm:w-[34%]">
        <LayeredPanel panel={floatingPanel} floating />
      </div>
    </div>
  );
}
