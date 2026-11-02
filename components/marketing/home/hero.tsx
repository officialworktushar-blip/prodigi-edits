import Link from 'next/link';
import { HeroProductWindow } from './hero-product-window';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-hero-dark text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 animate-glow-drift rounded-full bg-violet-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/4 h-96 w-96 animate-glow-drift rounded-full bg-pink-600/20 blur-3xl"
        style={{ animationDelay: '-9s' }}
      />

      <div className="mx-auto max-w-[1280px] px-4 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
          <span className="block animate-hero-fade-up text-white">
            A faster way to ship
          </span>
          <span
            className="block animate-hero-fade-up"
            style={{ animationDelay: '0.12s' }}
          >
            <span className="text-gradient-hero animate-text-shimmer">
              professional videos
            </span>
          </span>
        </h1>

        <p
          className="mx-auto mt-6 max-w-2xl animate-hero-fade-up text-base leading-7 text-slate-200/90 sm:text-lg"
          style={{ animationDelay: '0.22s' }}
        >
          Send your footage. We handle the pacing, sound, captions, and polish, so
          every upload feels like your channel.
        </p>

        <div
          className="mt-9 flex animate-hero-fade-up flex-col justify-center gap-3 sm:flex-row"
          style={{ animationDelay: '0.32s' }}
        >
          <Link href="/signup" className="btn-cyan">
            Start your first order
          </Link>
          <Link href="/pricing" className="btn-outline-light">
            See pricing
          </Link>
        </div>

        <div
          className="mt-14 animate-hero-rise sm:mt-16"
          style={{ animationDelay: '0.4s' }}
        >
          <HeroProductWindow />
        </div>

        <div className="mt-14 pb-16">
          <ul
            aria-label="Teams who publish every week"
            className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-5"
          >
            <li className="text-center text-lg text-white/45 sm:text-xl">
              Northstar
            </li>
            <li className="text-center text-lg font-bold lowercase tracking-tight text-white/45 sm:text-xl">
              clipline
            </li>
            <li className="text-center text-lg uppercase tracking-[0.2em] text-white/45 sm:text-xl">
              ORBIT STUDIO
            </li>
            <li className="text-center font-serif text-lg italic text-white/45 sm:text-xl">
              Fieldnote
            </li>
            <li className="text-center text-lg font-semibold tracking-tight text-white/45 sm:text-xl">
              Brightwave
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
