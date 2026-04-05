'use client';

import { useState } from 'react';
import { content } from '@/config/content';
import { trackEvent } from '@/utils/analytics';

export default function FaqSection(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number): void => {
    setOpenIndex((current) => {
      const nextValue = current === index ? null : index;
      if (nextValue !== null) {
        trackEvent('faq_opened', { question_index: nextValue + 1 });
      }
      return nextValue;
    });
  };

  return (
    <section aria-labelledby="faq-heading" className="section-shell bg-offwhite">
      <div className="section-container-narrow section-stack-compact">
        <h2 id="faq-heading" className="section-title">
          {content.faq.heading}
        </h2>

        <div className="space-y-3">
          {content.faq.items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className="overflow-hidden rounded-xl border border-charcoal/15 bg-white">
                <button
                  type="button"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="flex min-h-12 w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-charcoal/5 transition-colors"
                >
                  <span className="faq-question">{item.question}</span>
                  <span className="text-2xl leading-none text-terracotta" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  aria-hidden={!isOpen}
                  className={`grid motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="body-copy border-t border-charcoal/10 bg-charcoal/5 px-5 pb-4 pt-4">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
