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
            <article key={item.name} className="surface-card">
              <p className="text-lg text-terracotta">
                <span className="sr-only">5 estrellas</span>
                <span aria-hidden="true">⭐⭐⭐⭐⭐</span>
              </p>
              <p className="body-copy mt-3">“{item.quote}”</p>
              <p className="mt-4 font-semibold text-charcoal">
                {item.name} • {item.country}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
