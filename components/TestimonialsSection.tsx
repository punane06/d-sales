import { content } from '@/config/content';

export default function TestimonialsSection(): JSX.Element {
  return (
    <section aria-labelledby="testimonials-heading" className="bg-offwhite px-4 py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <h2 id="testimonials-heading" className="font-heading text-3xl font-bold leading-tight md:text-5xl">
          {content.testimonials.heading}
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.testimonials.entries.map((item) => (
            <article key={item.name} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-lg text-terracotta">
                <span className="sr-only">5 estrellas</span>
                <span aria-hidden="true">⭐⭐⭐⭐⭐</span>
              </p>
              <p className="mt-3 text-base leading-relaxed md:text-lg">“{item.quote}”</p>
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
