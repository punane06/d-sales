import Image from 'next/image';
import { content } from '@/config/content';

export default function GuaranteeSection(): JSX.Element {
  return (
    <section aria-labelledby="guarantee-heading" className="section-shell bg-charcoal text-white">
      <div className="section-container space-y-8">
        <h2 id="guarantee-heading" className="section-title">
          {content.guarantee.heading}
        </h2>
        <p className="body-copy">{content.guarantee.text}</p>

        <article className="rounded-2xl bg-white/10 p-6">
          <h3 className="font-heading text-2xl font-semibold md:text-3xl">
            {content.guarantee.trustHeading}
          </h3>
          <p className="body-copy mt-3">{content.guarantee.trustText}</p>

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
                <p className="mt-3 text-center text-base font-medium">{badge.label}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
