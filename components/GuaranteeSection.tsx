import Image from 'next/image';
import { content } from '@/config/content';

export default function GuaranteeSection(): JSX.Element {
  return (
    <section aria-label="Garantia" className="bg-charcoal px-4 py-14 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <h2 className="font-heading text-3xl font-bold leading-tight md:text-5xl">
          {content.guarantee.heading}
        </h2>
        <p className="text-base leading-relaxed md:text-lg">{content.guarantee.text}</p>

        <article className="rounded-2xl bg-white/10 p-6">
          <h3 className="font-heading text-2xl font-semibold md:text-3xl">
            {content.guarantee.trustHeading}
          </h3>
          <p className="mt-3 text-base leading-relaxed md:text-lg">{content.guarantee.trustText}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {content.guarantee.badges.map((badge) => (
              <div key={badge.label} className="rounded-xl bg-white/5 p-4">
                <Image
                  src={badge.src}
                  alt={badge.label}
                  width={120}
                  height={120}
                  className="mx-auto h-auto w-20 object-contain"
                />
                <p className="mt-3 text-center text-sm">{badge.label}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
