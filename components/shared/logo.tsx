import Link from 'next/link';
import { Play } from 'lucide-react';
import { BRAND_NAME, BRAND_TAGLINE } from '../../lib/config';
import { cn } from '../../lib/utils';

export type LogoSize = 'sm' | 'md' | 'lg';
export type LogoTone = 'default' | 'light';

export interface LogoProps {
  href?: string;
  showTagline?: boolean;
  size?: LogoSize;
  tone?: LogoTone;
  className?: string;
}

const markSizes: Record<LogoSize, string> = {
  sm: 'h-8 w-8 rounded-xl',
  md: 'h-10 w-10 rounded-2xl',
  lg: 'h-12 w-12 rounded-2xl',
};

const iconSizes: Record<LogoSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const nameSizes: Record<LogoSize, string> = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
};

export function Logo({
  href = '/',
  showTagline = false,
  size = 'md',
  tone = 'default',
  className,
}: LogoProps) {
  const content = (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-brand-indigo to-brand-blue text-white shadow-soft',
          markSizes[size]
        )}
      >
        <Play className={cn('translate-x-px fill-current', iconSizes[size])} />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            'font-semibold tracking-tight',
            nameSizes[size],
            tone === 'light' ? 'text-white' : 'text-brand-ink'
          )}
        >
          {BRAND_NAME}
        </span>
        {showTagline ? (
          <span
            className={cn(
              'mt-1.5 text-xs leading-4',
              tone === 'light' ? 'text-white/70' : 'text-slate-500'
            )}
          >
            {BRAND_TAGLINE}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!href) {
    return <span className={cn('inline-flex', className)}>{content}</span>;
  }

  return (
    <Link
      href={href}
      aria-label={`${BRAND_NAME} home`}
      className={cn(
        'inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
        className
      )}
    >
      {content}
    </Link>
  );
}
