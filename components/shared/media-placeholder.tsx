import {
  Clapperboard,
  Film,
  Image as ImageIcon,
  Play,
  Sparkles,
  Video,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const icons: Record<string, LucideIcon> = {
  play: Play,
  video: Video,
  film: Film,
  clapperboard: Clapperboard,
  image: ImageIcon,
  sparkles: Sparkles,
};

const aspectClasses = {
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  square: 'aspect-square',
  portrait: 'aspect-[9/16]',
} as const;

export type MediaPlaceholderAspect = keyof typeof aspectClasses;

export interface MediaPlaceholderProps {
  title?: string;
  description?: string;
  badge?: string;
  icon?: string;
  aspect?: MediaPlaceholderAspect;
  className?: string;
}

export function MediaPlaceholder({
  title,
  description,
  badge,
  icon = 'play',
  aspect = 'video',
  className,
}: MediaPlaceholderProps) {
  const Icon = icons[icon] ?? Play;
  const label = title ?? description ?? 'Media preview';

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-indigo-100 via-white to-pink-100 shadow-soft',
        aspectClasses[aspect],
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 -top-16 h-48 w-48 rounded-full bg-indigo-300/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-8 h-48 w-48 rounded-full bg-pink-300/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.75),transparent_55%)]"
      />

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-brand-indigo shadow-soft backdrop-blur">
          <Icon aria-hidden="true" className="h-6 w-6" />
        </span>
        {badge ? (
          <span className="rounded-full border border-white/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600 backdrop-blur">
            {badge}
          </span>
        ) : null}
        {title ? (
          <p className="max-w-xs text-base font-semibold tracking-tight text-brand-ink">
            {title}
          </p>
        ) : null}
        {description ? (
          <p className="max-w-sm text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
