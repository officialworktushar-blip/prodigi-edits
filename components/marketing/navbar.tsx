'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { Logo } from '../shared/logo';
import { cn } from '../../lib/utils';

type DropdownKey = 'services' | 'use-cases' | 'resources';

interface NavItem {
  label: string;
  href: string;
  description: string;
}

interface NavGroup {
  key: DropdownKey;
  label: string;
  items: NavItem[];
  panelClassName: string;
  listClassName: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    key: 'services',
    label: 'Services',
    panelClassName: 'left-0 w-80',
    listClassName: 'grid gap-1',
    items: [
      {
        label: 'Long-form editing',
        href: '/services/long-form',
        description: 'Documentary-style cuts, interviews, and deep dives.',
      },
      {
        label: 'Short-form editing',
        href: '/services/short-form',
        description: 'Scroll-stopping clips built for vertical feeds.',
      },
      {
        label: 'Channel management',
        href: '/services/channel-management',
        description: 'Publishing, titles, and thumbnails handled end to end.',
      },
    ],
  },
  {
    key: 'use-cases',
    label: 'Use Cases',
    panelClassName: 'left-0 w-[34rem]',
    listClassName: 'grid gap-1 sm:grid-cols-2',
    items: [
      {
        label: 'YouTubers',
        href: '/use-cases/youtubers',
        description: 'Keep a weekly upload rhythm without burnout.',
      },
      {
        label: 'Businesses',
        href: '/use-cases/businesses',
        description: 'Turn product stories into polished video.',
      },
      {
        label: 'Podcasters',
        href: '/use-cases/podcasters',
        description: 'Cut full episodes into clips that travel.',
      },
      {
        label: 'Realtors',
        href: '/use-cases/realtors',
        description: 'Showcase listings with cinematic walkthroughs.',
      },
      {
        label: 'Course creators',
        href: '/use-cases/course-creators',
        description: 'Ship lessons that feel premium and clear.',
      },
      {
        label: 'Doctors',
        href: '/use-cases/doctors',
        description: 'Explain care with calm, credible visuals.',
      },
      {
        label: 'Lawyers',
        href: '/use-cases/lawyers',
        description: 'Present complex cases with clarity.',
      },
    ],
  },
  {
    key: 'resources',
    label: 'Resources',
    panelClassName: 'right-0 w-80',
    listClassName: 'grid gap-1',
    items: [
      {
        label: 'Examples',
        href: '/examples',
        description: 'See the finish before you start.',
      },
      {
        label: 'Case studies',
        href: '/case-studies',
        description: 'How teams ship more without adding headcount.',
      },
      {
        label: 'About',
        href: '/about',
        description: 'The crew behind the edits.',
      },
      {
        label: 'Platform',
        href: '/platform',
        description: 'How the dashboard and workflow fit together.',
      },
      {
        label: 'Contact',
        href: '/contact',
        description: 'Talk to a real person about your next project.',
      },
    ],
  },
];

const MOBILE_LINK_CLASS =
  'block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-indigo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo';

export function Navbar() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab' && mobileOpen) {
        const panel = document.getElementById('mobile-navigation');
        const focusable = panel
          ? Array.from(
              panel.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled])'
              )
            )
          : [];

        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }

      if (event.key !== 'Escape') return;

      if (openDropdown) {
        const trigger = document.getElementById(
          `nav-trigger-${openDropdown}`
        );
        setOpenDropdown(null);
        trigger?.focus();
        return;
      }

      if (mobileOpen) {
        setMobileOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, openDropdown]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = window.requestAnimationFrame(() =>
      mobileCloseRef.current?.focus()
    );

    return () => {
      document.body.style.overflow = originalOverflow;
      window.cancelAnimationFrame(frame);
      previousFocus?.focus();
    };
  }, [mobileOpen]);

  function toggleDropdown(key: DropdownKey) {
    setOpenDropdown((current) => (current === key ? null : key));
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-screen-1200 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_GROUPS.map((group) => {
              const isOpen = openDropdown === group.key;
              const panelId = `nav-panel-${group.key}`;
              const triggerId = `nav-trigger-${group.key}`;

              return (
                <div key={group.key} className="relative">
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleDropdown(group.key)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                      isOpen
                        ? 'bg-indigo-50 text-brand-indigo'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-brand-ink'
                    )}
                  >
                    {group.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isOpen ? 'rotate-180' : ''
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        id={panelId}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={cn(
                          'absolute top-full mt-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft-lg',
                          group.panelClassName
                        )}
                      >
                        <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {group.label}
                        </p>
                        <ul className={group.listClassName}>
                          {group.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setOpenDropdown(null)}
                                className="group flex flex-col rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
                              >
                                <span className="text-sm font-semibold text-brand-ink transition-colors group-hover:text-brand-indigo">
                                  {item.label}
                                </span>
                                <span className="mt-0.5 text-xs leading-5 text-slate-500">
                                  {item.description}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}

            <Link
              href="/pricing"
              aria-current={pathname === '/pricing' ? 'page' : undefined}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2',
                pathname === '/pricing'
                  ? 'bg-indigo-50 text-brand-indigo'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-brand-ink'
              )}
            >
              Pricing
            </Link>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
            >
              Get started
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <button
            ref={mobileTriggerRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => {
              setOpenDropdown(null);
              setMobileOpen(true);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2 lg:hidden"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="mobile-overlay"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          />
        ) : null}

        {mobileOpen ? (
          <motion.aside
            key="mobile-panel"
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl lg:hidden"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
              <div onClick={closeMobileMenu}>
                <Logo size="sm" />
              </div>
              <button
                ref={mobileCloseRef}
                type="button"
                aria-label="Close menu"
                onClick={closeMobileMenu}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav aria-label="Mobile navigation" className="space-y-7">
                {NAV_GROUPS.map((group) => (
                  <div key={group.key}>
                    <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {group.label}
                    </p>
                    <ul className="mt-2 space-y-0.5">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={closeMobileMenu}
                            className={MOBILE_LINK_CLASS}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div>
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Plans
                  </p>
                  <ul className="mt-2 space-y-0.5">
                    <li>
                      <Link
                        href="/pricing"
                        onClick={closeMobileMenu}
                        className={MOBILE_LINK_CLASS}
                      >
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>

            <div className="shrink-0 space-y-3 border-t border-slate-200 p-5">
              <Link
                href="/signup"
                onClick={closeMobileMenu}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-indigo to-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                Get started
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
              >
                Log in
              </Link>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
