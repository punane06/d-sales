import { content } from '@/config/content';
import CtaButton from '@/components/CtaButton';

export default function FinalCtaSection(): JSX.Element {
  return (
    <section aria-label="Llamado final" className="bg-offwhite px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h2 className="font-heading text-3xl font-bold leading-tight md:text-5xl">
          {content.finalCta.heading}
        </h2>
        <p className="text-base leading-relaxed md:text-lg">{content.finalCta.paragraph}</p>
        <p className="font-heading text-2xl italic md:text-3xl">{content.finalCta.signature}</p>
        <div className="pt-2">
          <CtaButton
            baseLabel={content.finalCta.ctaLabel}
            sectionName={content.analytics.sectionNames.finalCta}
          />
        </div>
      </div>
    </section>
  );
}
