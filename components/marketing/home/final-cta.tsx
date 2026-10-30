import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

const assurances = [
  'No long-term contract',
  'First cut in 24–48 hours',
  'Revisions included',
];

export function FinalCta() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-brand-indigo via-indigo-600 to-brand-blue px-6 py-12 shadow-soft-lg sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-pink-300/20 blur-3xl"
          />

          <div className="relative max-w-3xl">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to put a{' '}
              <span className="bg-gradient-to-r from-white via-indigo-100 to-pink-100 bg-clip-text text-transparent">
                real editing crew
              </span>{' '}
              behind your next upload?
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
              Send the footage and the deadline. We will turn it into a finished
              video with a process that stays clear from brief to delivery.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-indigo shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
              >
                Start your first order
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600"
              >
                Talk to the team
              </Link>
            </div>

            <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              {assurances.map((assurance) => (
                <li
                  key={assurance}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-100 sm:text-sm"
                >
                  <Check aria-hidden="true" className="h-4 w-4 text-white" />
                  {assurance}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
