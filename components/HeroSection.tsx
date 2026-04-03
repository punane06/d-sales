import Image from 'next/image';
import { content } from '@/config/content';
import CtaButton from '@/components/CtaButton';

export default function HeroSection(): JSX.Element {
  return (
    <section
      aria-labelledby="hero-heading"
      className="section-shell-tight bg-offwhite pt-3 sm:pt-10"
    >
      <div className="section-container-narrow">
        <div className="space-y-2.5 sm:space-y-4">
          <p className="body-copy font-semibold text-softred">{content.hero.attention}</p>
          <h1
            id="hero-heading"
            className="font-heading text-2xl font-bold leading-tight sm:text-4xl md:text-6xl"
          >
            {content.hero.heading}
          </h1>
          <p className="font-heading text-base italic sm:text-xl md:text-3xl">{content.hero.subheadline}</p>
          <p className="body-copy">{content.hero.description}</p>

          <div className="pt-1">
            <CtaButton
              baseLabel={content.hero.ctaLabel}
              sectionName={content.analytics.sectionNames.hero}
            />
            <p className="mt-2 text-base text-charcoal/80 md:text-xl">{content.hero.trustLine}</p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/media/products/hero-mockup.png"
              alt={content.hero.imageAlt}
              width={540}
              height={640}
              priority
              className="h-auto w-full max-w-[10.5rem] rounded-2xl object-contain shadow-xl sm:max-w-sm"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
