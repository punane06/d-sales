"use client";
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { content } from '@/config/content';

export default function TestimonialsSection(): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Automaatne kerimine
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    let interval: NodeJS.Timeout;
    let testimonialWidth = 0;
    // Leia ühe testimoniali laius (eeldame, et kõik on sama laiusega)
    const firstChild = container.children[0] as HTMLDivElement | undefined;
    if (firstChild) testimonialWidth = firstChild.offsetWidth + 16; // 16px gap
    function scrollNext() {
      if (!container) return;
      // Kui jõuab lõppu, kerib algusesse
      if (container.scrollLeft + container.offsetWidth >= container.scrollWidth - testimonialWidth) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: testimonialWidth, behavior: 'smooth' });
      }
    }
    interval = setInterval(scrollNext, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section aria-labelledby="testimonials-heading" className="section-shell bg-offwhite">
      <div className="section-container section-stack">
        <h2 id="testimonials-heading" className="section-title">
          {content.testimonials.heading}
        </h2>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
          aria-label="Kliendi tagasiside, keritav horisontaalselt"
        >
          {content.testimonials.entries.map((item) => (
            <article
              key={item.name}
              className="min-w-[320px] max-w-xs flex-shrink-0 rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="overflow-hidden rounded-full ring-2 ring-sage/20 ring-offset-2 ring-offset-white">
                  <Image
                    src={item.avatarSrc}
                    alt={item.avatarAlt}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="label-copy font-semibold text-charcoal">{item.name}</p>
                  <p className="meta-copy text-charcoal/70">{item.country}</p>
                </div>
              </div>
              <div className="relative mt-4 rounded-2xl bg-mint px-4 py-3">
                <span className="absolute -left-1 top-5 h-2.5 w-2.5 rotate-45 bg-mint" aria-hidden="true" />
                <p className="text-lg text-terracotta">
                  <span className="sr-only">5 tärni</span>
                  <span aria-hidden="true">⭐⭐⭐⭐⭐</span>
                </p>
                <p className="body-copy mt-2">“{item.quote}”</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// Lisa CSS klass hide-scrollbar kui vaja:
// .hide-scrollbar::-webkit-scrollbar { display: none; }
// .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
