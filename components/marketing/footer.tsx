import Link from 'next/link';
import { Logo } from '../shared/logo';
import { BRAND_NAME, BRAND_TAGLINE, SUPPORT_EMAIL } from '../../lib/config';

const footerGroups = [
  {
    title: 'Services',
    links: [
      { label: 'Long-form editing', href: '/services/long-form' },
      { label: 'Short-form editing', href: '/services/short-form' },
      { label: 'Channel management', href: '/services/channel-management' },
    ],
  },
  {
    title: 'Use cases',
    links: [
      { label: 'YouTubers', href: '/use-cases/youtubers' },
      { label: 'Businesses', href: '/use-cases/businesses' },
      { label: 'Podcasters', href: '/use-cases/podcasters' },
      { label: 'Realtors', href: '/use-cases/realtors' },
      { label: 'Course creators', href: '/use-cases/course-creators' },
      { label: 'Doctors', href: '/use-cases/doctors' },
      { label: 'Lawyers', href: '/use-cases/lawyers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Examples', href: '/examples' },
      { label: 'Case studies', href: '/case-studies' },
      { label: 'About', href: '/about' },
      { label: 'Platform', href: '/platform' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', href: '/login' },
      { label: 'Get started', href: '/signup' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-brand-surface">
      <div className="mx-auto max-w-screen-1200 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="max-w-sm lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-slate-500">
              {BRAND_TAGLINE}. Clear timelines, thoughtful edits, and one calm
              dashboard from upload to delivery.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-4 inline-flex text-sm font-semibold text-brand-indigo underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={`${group.title} links`}>
              <h2 className="text-sm font-semibold text-brand-ink">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {year} {BRAND_NAME}. All rights reserved.
          </p>
          <nav
            aria-label="Footer legal and account links"
            className="flex flex-wrap items-center gap-5"
          >
            <Link
              href="/privacy"
              className="text-xs font-medium text-slate-500 transition-colors hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs font-medium text-slate-500 transition-colors hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-xs font-medium text-slate-500 transition-colors hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-xs font-medium text-slate-500 transition-colors hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Log in
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
