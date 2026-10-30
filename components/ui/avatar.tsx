'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type AvatarStatus = 'loading' | 'loaded' | 'error';

interface AvatarContextValue {
  status: AvatarStatus;
  setStatus: (status: AvatarStatus) => void;
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const context = React.useContext(AvatarContext);

  if (!context) {
    throw new Error('Avatar components must be used inside <Avatar>.');
  }

  return context;
}

export type AvatarProps = React.HTMLAttributes<HTMLSpanElement>;

export function Avatar({ className, ...props }: AvatarProps) {
  const [status, setStatus] = React.useState<AvatarStatus>('loading');

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <span
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100',
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
}

export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AvatarImage({
  className,
  src,
  alt = '',
  onLoad,
  onError,
  ...props
}: AvatarImageProps) {
  const { status, setStatus } = useAvatarContext();

  React.useEffect(() => {
    setStatus(src ? 'loading' : 'error');
  }, [src, setStatus]);

  if (status === 'error' || !src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
      onLoad={(event) => {
        setStatus('loaded');
        onLoad?.(event);
      }}
      onError={(event) => {
        setStatus('error');
        onError?.(event);
      }}
      {...props}
    />
  );
}

export type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  const { status } = useAvatarContext();

  if (status === 'loaded') {
    return null;
  }

  return (
    <span
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
