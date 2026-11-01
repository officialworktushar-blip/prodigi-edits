import Link from 'next/link';
import { Check } from 'lucide-react';

const assurances = [
  'No long-term contract',
  'First cut in 24–48 hours',
  'Revisions included',
];

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-hero-dark text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-screen-1200 px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Ready to put a real editing crew{' '}
          <span className="text-gradient-hero">behind your next upload?</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200/90 sm:text-lg">
          Send the footage and the deadline, and we will turn them into a finished
          video with a clear process from brief to delivery.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="btn-cyan">
            Start your first order
          </Link>
          <Link href="/contact" className="btn-outline-light">
            Talk to the team
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {assurances.map((assurance) => (
            <li
              key={assurance}
              className="flex items-center gap-1.5 text-xs font-medium text-white/80 sm:text-sm"
            >
              <Check aria-hidden="true" className="h-4 w-4 text-white/80" />
              {assurance}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
