import { cn } from '../../lib/utils';

export interface SectionHeadingProps {
  eyebrow?: string;
  headline: string;
  highlight?: string;
  subcopy?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
}

const headingSizes = {
  h1: 'text-4xl leading-tight sm:text-5xl',
  h2: 'text-3xl leading-tight sm:text-4xl',
  h3: 'text-2xl leading-tight sm:text-3xl',
} as const;

function renderHeadline(headline: string, highlight?: string) {
  const target = highlight?.trim();

  if (target) {
    const index = headline.indexOf(target);

    if (index >= 0) {
      const before = headline.slice(0, index);
      const after = headline.slice(index + target.length);

      return (
        <>
          {before}
          <span className="text-gradient">{target}</span>
          {after}
        </>
      );
    }
  }

  const words = headline.trim().split(/\s+/).filter(Boolean);

  if (words.length <= 1) {
    return <span className="text-gradient">{headline.trim()}</span>;
  }

  const lastWord = words[words.length - 1];
  const leadingWords = words.slice(0, -1).join(' ');

  return (
    <>
      {leadingWords} <span className="text-gradient">{lastWord}</span>
    </>
  );
}

export function SectionHeading({
  eyebrow,
  headline,
  highlight,
  subcopy,
  align = 'center',
  as: Heading = 'h2',
  id,
  className,
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div
      className={cn(
        'max-w-3xl',
        isCentered ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
          {eyebrow}
        </span>
      ) : null}
      <Heading
        id={id}
        className={cn(
          'font-semibold tracking-tight text-brand-ink',
          eyebrow ? 'mt-4' : '',
          headingSizes[Heading]
        )}
      >
        {renderHeadline(headline, highlight)}
      </Heading>
      {subcopy ? (
        <p
          className={cn(
            'mt-4 text-base leading-7 text-slate-500 sm:text-lg',
            isCentered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          )}
        >
          {subcopy}
        </p>
      ) : null}
    </div>
  );
}
