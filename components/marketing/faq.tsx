'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { EmptyState } from '../shared/empty-state';
import type { FaqItem } from '../../types/db';

interface FaqAccordionProps {
  items?: FaqItem[];
}

export function FaqAccordion({ items = [] }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon="?"
        title="Frequently asked questions"
        description="Need help setting up your first order? Reach out to support@cutcrew.com."
        actionLabel="Contact us"
        actionHref="/contact"
      />
    );
  }

  return (
    <section className="mx-auto max-w-screen-1200 px-6 pb-16 pt-12">
      <h2 className="mb-8 text-3xl font-bold text-slate-900">
        Frequently asked questions
      </h2>
      <ul className="space-y-4">
        {items.map((item, index) => {
          const isOpen = openIdx === index;
          const panelId = `faq-panel-${item.id}`;

          return (
            <li
              key={item.id}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIdx(isOpen ? null : index)}
                className="flex w-full items-start gap-3 text-left font-semibold text-slate-800 transition-colors hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                <ChevronDown
                  size={20}
                  className={`mt-0.5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
                <span>{item.question}</span>
              </button>

              {isOpen ? (
                <div id={panelId} className="mt-3 pr-8">
                  <p className="pl-1 text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </p>
                  <button
                    type="button"
                    aria-label="Close answer"
                    className="absolute right-4 top-4 flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700"
                    onClick={() => setOpenIdx(null)}
                  >
                    <X size={14} /> Close
                  </button>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default FaqAccordion;
