'use client';
import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { EmptyState } from '@/components/shared/empty-state';
import type { FaqItem } from '@/lib/config';

interface AccordionProps {
  items?: FaqItem[];
}

export function FaqAccordion({ items = [] }: AccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  if (!items || items.length === 0) {
    return <EmptyState icon="x" title="Frequently asked questions" description="Need help setting up your first order? Reach out to support@cutcrew.com." actionLabel="Contact us" href="/contact" />;
  }

  return (
    <div className="mx-auto max-w-screen-1200px px-6 pt-12 pb-16">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">FAQ</h2>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <button
              aria-expanded={openIdx === i}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="flex w-full items-start gap-3 font-semibold text-left text-slate-800 hover:text-primary-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <ChevronDown size={20} className="mt-0.5 flex-shrink-0 text-slate-400 transition-transform duration-200" />
              <span>{item.question}</span>
            </button>
            {openIdx === i && (
              <div className="animate-fade-in mt-3 overflow-hidden">
                <p className="text-sm leading-relaxed text-slate-600 pl-1">{item.answer}</p>
                <button aria-label="Close" className="absolute right-4 top-4 text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1" onClick={() => setOpenIdx(null)}>
                  <X size={14} /> Close
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const CLOSE_BTN = <button aria-label="Close" onClick={() => setOpenIdx(null)}><X size={14} /></button>;
import { ChevronDown as ChevronIcon } from 'lucide-react';
export default CLOSE_BTN;