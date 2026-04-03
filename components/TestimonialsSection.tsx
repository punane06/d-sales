import { content } from '@/config/content';

export default function TestimonialsSection(): JSX.Element {
  return (
    <section aria-labelledby="testimonials-heading" className="section-shell bg-offwhite">
      <div className="section-container space-y-8">
        <h2 id="testimonials-heading" className="section-title">
          {content.testimonials.heading}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.testimonials.entries.map((item) => (
            <article key={item.name} className="rounded-2xl border border-charcoal/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sm font-bold text-charcoal">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{item.name}</p>
                    <p className="text-xs text-charcoal/70">{item.country}</p>
                  </div>
                </div>
                <p className="text-xs text-charcoal/50" aria-hidden="true">hoy</p>
              </div>

              <div className="relative mt-4 rounded-2xl bg-[#E6F6E6] px-4 py-3">
                <span className="absolute -left-1 top-5 h-2.5 w-2.5 rotate-45 bg-[#E6F6E6]" aria-hidden="true" />
                <p className="text-lg text-terracotta">
                  <span className="sr-only">5 estrellas</span>
                  <span aria-hidden="true">⭐⭐⭐⭐⭐</span>
                </p>
                <p className="body-copy mt-2">“{item.quote}”</p>
              </div>

              <p className="mt-3 text-right text-xs text-charcoal/60" aria-hidden="true">
                Leido
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
