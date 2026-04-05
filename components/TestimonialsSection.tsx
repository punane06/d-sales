import Image from 'next/image';
import { content } from '@/config/content';

export default function TestimonialsSection(): JSX.Element {
  return (
    <section aria-labelledby="testimonials-heading" className="section-shell bg-offwhite">
      <div className="section-container section-stack">
        <h2 id="testimonials-heading" className="section-title">
          {content.testimonials.heading}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.testimonials.entries.map((item, index) => (
            <article key={index} className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
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
                  <span className="sr-only">5 estrellas</span>
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
