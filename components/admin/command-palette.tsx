'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ArrowRight, ClipboardList, Loader2, Search, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { getAdminNavItems, type AdminRole } from './nav-items';

interface OrderSearchResult {
  id: string;
  order_no: number;
  title: string;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In progress',
  IN_REVIEW: 'In review',
  REVISION_REQUESTED: 'Revision requested',
  APPROVED: 'Approved',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export interface CommandPaletteProps {
  role: AdminRole;
}

export function CommandPalette({ role }: CommandPaletteProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<OrderSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const pages = useMemo(() => {
    const items = getAdminNavItems(role);
    const term = query.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(term) ||
        item.href.toLowerCase().includes(term)
    );
  }, [query, role]);

  const totalItems = pages.length + orders.length;
  const safeActiveIndex =
    totalItems === 0 ? 0 : Math.min(activeIndex, totalItems - 1);
  const trimmedQuery = query.trim();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);

    function onEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
    }

    window.addEventListener('keydown', onEscape);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onEscape);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuery('');
    setOrders([]);
    setSearchError(null);
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    const term = query.trim();

    if (!open) {
      return;
    }

    if (term.length < 2) {
      setOrders([]);
      setSearchError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const searchTimer = window.setTimeout(async () => {
      try {
        const supabase = createClient();
        const safeTerm = term
          .replace(/[,()%'"\\]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 80);

        const normalizedTerm = safeTerm.replace(/^#/, '').trim();

        let request = supabase
          .from('orders')
          .select('id, order_no, title, status, created_at');

        request = /^\d{1,10}$/.test(normalizedTerm)
          ? request.or(
              `title.ilike.%${normalizedTerm}%,order_no.eq.${normalizedTerm}`
            )
          : request.ilike('title', `%${safeTerm}%`);

        const { data, error } = await request
          .order('created_at', { ascending: false })
          .limit(8);

        if (cancelled) {
          return;
        }

        if (error) {
          setSearchError('Order search could not be completed. Try again.');
          setOrders([]);
          return;
        }

        setSearchError(null);
        setOrders((data as OrderSearchResult[] | null) ?? []);
      } catch {
        if (!cancelled) {
          setSearchError('Order search could not be completed. Try again.');
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(searchTimer);
    };
  }, [open, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open || totalItems === 0) {
      return;
    }

    const activeItem = document.getElementById(
      `admin-command-item-${safeActiveIndex}`
    );
    activeItem?.scrollIntoView({ block: 'nearest' });
  }, [open, safeActiveIndex, totalItems]);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  function goTo(href: string) {
    close();
    router.push(href);
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (totalItems > 0) {
        setActiveIndex((safeActiveIndex + 1) % totalItems);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (totalItems > 0) {
        setActiveIndex((safeActiveIndex - 1 + totalItems) % totalItems);
      }
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (safeActiveIndex < pages.length) {
        const page = pages[safeActiveIndex];
        if (page) {
          goTo(page.href);
        }
        return;
      }

      const order = orders[safeActiveIndex - pages.length];
      if (order) {
        goTo(`/admin/orders/${order.id}`);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-500 shadow-soft transition hover:border-slate-300 hover:text-brand-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
      >
        <Search aria-hidden="true" className="h-4 w-4" />
        <span className="hidden sm:inline">Search or jump to</span>
        <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 sm:inline-flex">
          Ctrl K
        </kbd>
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/40 p-4 pt-[10vh] backdrop-blur-sm"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  close();
                }
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Admin command palette"
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 px-4">
                  <Search
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-slate-400"
                  />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Search orders or jump to a page"
                    role="combobox"
                    aria-expanded="true"
                    aria-controls="admin-command-results"
                    aria-autocomplete="list"
                    aria-activedescendant={
                      totalItems > 0
                        ? `admin-command-item-${safeActiveIndex}`
                        : undefined
                    }
                    className="h-14 min-w-0 flex-1 bg-transparent text-sm text-brand-ink outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close command palette"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>

                <div
                  id="admin-command-results"
                  role="listbox"
                  aria-label="Command results"
                  className="max-h-[60vh] overflow-y-auto p-2"
                >
                  {pages.length > 0 ? (
                    <div role="presentation">
                      <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Pages
                      </p>
                      <div role="presentation" className="space-y-1">
                        {pages.map((page, index) => {
                          const isActive = safeActiveIndex === index;

                          return (
                            <button
                              key={page.href}
                              id={`admin-command-item-${index}`}
                              type="button"
                              role="option"
                              aria-selected={isActive}
                              onMouseEnter={() => setActiveIndex(index)}
                              onClick={() => goTo(page.href)}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                                isActive
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'text-slate-600 hover:bg-slate-50'
                              )}
                            >
                              <span
                                className={cn(
                                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                  isActive
                                    ? 'bg-white text-indigo-600 shadow-soft'
                                    : 'bg-slate-50 text-slate-400'
                                )}
                              >
                                <ArrowRight
                                  aria-hidden="true"
                                  className="h-4 w-4"
                                />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-medium">
                                  {page.label}
                                </span>
                                <span className="block truncate text-xs text-slate-400">
                                  {page.href}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {trimmedQuery.length >= 2 ? (
                    <div role="presentation" className="mt-2">
                      <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Orders
                      </p>

                      {isLoading ? (
                        <div className="flex items-center gap-2 px-3 py-4 text-sm text-slate-500">
                          <Loader2
                            aria-hidden="true"
                            className="h-4 w-4 animate-spin text-indigo-500"
                          />
                          Searching orders...
                        </div>
                      ) : null}

                      {!isLoading && searchError ? (
                        <p
                          aria-live="polite"
                          className="px-3 py-4 text-sm text-rose-600"
                        >
                          {searchError}
                        </p>
                      ) : null}

                      {!isLoading && !searchError && orders.length === 0 ? (
                        <p className="px-3 py-4 text-sm text-slate-500">
                          No orders match &ldquo;{trimmedQuery}&rdquo;.
                        </p>
                      ) : null}

                      {!isLoading && !searchError && orders.length > 0 ? (
                        <div role="presentation" className="space-y-1">
                          {orders.map((order, index) => {
                            const itemIndex = pages.length + index;
                            const isActive = safeActiveIndex === itemIndex;

                            return (
                              <button
                                key={order.id}
                                id={`admin-command-item-${itemIndex}`}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onMouseEnter={() => setActiveIndex(itemIndex)}
                                onClick={() =>
                                  goTo(`/admin/orders/${order.id}`)
                                }
                                className={cn(
                                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
                                  isActive
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                )}
                              >
                                <span
                                  className={cn(
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                    isActive
                                      ? 'bg-white text-indigo-600 shadow-soft'
                                      : 'bg-slate-50 text-slate-400'
                                  )}
                                >
                                  <ClipboardList
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate font-medium">
                                    {order.title || 'Untitled order'}
                                  </span>
                                  <span className="block truncate text-xs text-slate-400">
                                    #{order.order_no} ·{' '}
                                    {STATUS_LABELS[order.status] ??
                                      order.status}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="px-3 py-3 text-xs text-slate-400">
                      Type at least two characters to search orders.
                    </p>
                  )}

                  {pages.length === 0 && trimmedQuery.length < 2 ? (
                    <p className="px-3 py-4 text-sm text-slate-500">
                      No pages match &ldquo;{trimmedQuery}&rdquo;.
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 px-4 py-3 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-semibold">
                      ↑
                    </kbd>
                    <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-semibold">
                      ↓
                    </kbd>
                    navigate
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-semibold">
                      Enter
                    </kbd>
                    open
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-semibold">
                      Esc
                    </kbd>
                    close
                  </span>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
