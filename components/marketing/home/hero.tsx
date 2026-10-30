import Link from 'next/link';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react';
import { FadeIn } from '../../shared/fade-in';
import { MediaPlaceholder } from '../../shared/media-placeholder';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-hero-mesh">
      <div className="mx-auto grid max-w-screen-1200 gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-28 lg:pt-24">
        <FadeIn className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 shadow-soft backdrop-blur">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue"
            />
            Editing built for a weekly pace
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
            A faster way to ship{' '}
            <span className="text-gradient">professional videos</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            Send the footage. We handle the pacing, sound, captions, and polish.
            You get a finished video that feels like your channel, not a
            template.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Start your first order
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 shadow-soft backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              See pricing
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div
              aria-hidden="true"
              className="flex items-center gap-0.5"
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-brand-ink">4.9/5</span> from
              120+ creative teams
            </p>
            <span aria-hidden="true" className="hidden h-4 w-px bg-slate-300 sm:block" />
            <p className="flex items-center gap-1.5 text-sm text-slate-600">
              <Check aria-hidden="true" className="h-4 w-4 text-emerald-600" />
              No long-term contract
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative">
            <MediaPlaceholder
              aspect="video"
              badge="Ready for review"
              title="Brand film — cut 03"
              description="Color, sound, captions, and a clean handoff in one pass."
              icon="film"
            />

            <div className="absolute -left-4 top-8 hidden items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-3.5 py-2.5 shadow-soft backdrop-blur sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Clock aria-hidden="true" className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-ink">
                  32h
                </span>
                <span className="block text-[11px] text-slate-500">
                  First cut delivered
                </span>
              </span>
            </div>

            <div className="absolute -bottom-5 -right-3 hidden items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-3.5 py-2.5 shadow-soft backdrop-blur sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-ink">
                  Revision approved
                </span>
                <span className="block text-[11px] text-slate-500">
                  v2 locked for delivery
                </span>
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
