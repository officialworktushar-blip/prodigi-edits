'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Reveal } from '../../shared/reveal';

const faqItems = [
  {
    question: 'How fast do you deliver the first cut?',
    answer: 'Most first cuts ship within 24-48 hours after footage lands. Long-form builds may take longer depending on complexity, but we always provide a clear schedule upfront.',
  },
  {
    question: 'What file formats do you deliver?',
    answer: 'We deliver in the formats you need: 1080p and 4K exports, platform-specific vertical crops for TikTok and Reels, SRT caption files, and project files on request.',
  },
  {
    question: 'How do revisions work?',
    answer: 'Leave timecoded notes directly on the draft in our review room. We respond to each note, explain trade-offs before pushing back, and deliver revisions in the same 24-48 hour window.',
  },
  {
    question: 'Do I need to provide music?',
    answer: 'No. We have a licensed music library and can select tracks that fit your brand. If you have specific music you want to use, just include it in your footage upload.',
  },
  {
    question: 'Can I cancel or pause a subscription?',
    answer: 'Yes. You can cancel or pause your subscription at any time with no penalties. Unused credits roll over for up to 90 days if you pause.',
  },
  {
    question: 'What happens if I am not happy with the edit?',
    answer: 'We offer unlimited revisions within the scope of your original brief. If we miss the brief entirely, we will re-edit at no extra cost. Your satisfaction is guaranteed.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{ backgroundColor: 'var(--hs-light)' }}>
      <div className="mx-auto max-w-screen-1200 px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center text-[clamp(2rem,4vw,3.25rem)] font-medium tracking-tight [-webkit-font-smoothing:antialiased] hs-grad-text">
            Frequently asked questions
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 max-w-[960px] space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;

            return (
              <Reveal key={item.question} delay={index * 0.05}>
                <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                    className="flex w-full items-center justify-between gap-4 px-8 py-[28px] text-left transition-colors hover:bg-slate-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--hs-cyan)]"
                  >
                    <span className="text-base font-medium leading-relaxed" style={{ color: 'var(--hs-ink)' }}>
                      {item.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        'h-5 w-5 shrink-0 transition-transform duration-200',
                        isOpen ? 'rotate-180' : ''
                      )}
                      style={{ color: 'var(--hs-ink)' }}
                    />
                  </button>

                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="px-8 pb-8">
                          <p className="text-base leading-relaxed text-slate-600">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
