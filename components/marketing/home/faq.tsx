'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '../../../types/db';
import { cn } from '../../../lib/utils';
import { EmptyState } from '../../shared/empty-state';
import { SectionHeading } from '../../shared/section-heading';

export interface FaqAccordionProps {
  items?: FaqItem[];
}

export function FaqAccordion({ items = [] }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqItems = items ?? [];

  return (
    <section className="bg-brand-surface">
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Good to know"
          headline="Questions, answered plainly"
          highlight="plainly"
          subcopy="The things teams usually ask before their first order. If yours is not here, a real person is one message away."
        />

        {faqItems.length === 0 ? (
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white">
            <EmptyState
              icon="message"
              title="Answers are being written"
              description="We are updating the FAQ with clearer details about footage, revisions, and delivery. Ask us anything in the meantime."
              actionLabel="Contact us"
              actionHref="/contact"
            />
          </div>
        ) : (
          <ul className="mx-auto mt-10 max-w-3xl space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              const panelId = `home-faq-panel-${item.id}`;
              const buttonId = `home-faq-button-${item.id}`;

              return (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft"
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-indigo sm:px-6"
                    >
                      <span className="text-sm font-semibold text-brand-ink sm:text-base">
                        {item.question}
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200',
                          isOpen ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                    className={cn(
                      'grid transition-all duration-200 ease-out',
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-7 text-slate-500 sm:px-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default FaqAccordion;
