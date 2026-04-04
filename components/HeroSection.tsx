import Image from 'next/image';
import { content } from '@/config/content';
import CtaButton from '@/components/CtaButton';

export default function HeroSection(): JSX.Element {
  return (
    <section
      aria-labelledby="hero-heading"
      className="section-shell-tight bg-offwhite pt-4 sm:pt-10"
    >
      <div className="section-container-narrow">
        <div className="section-stack-compact">
          <p className="body-copy font-semibold text-softred">{content.hero.attention}</p>
          <h1
            id="hero-heading"
            className="display-title"
          >
            {content.hero.heading}
          </h1>

          <div className="mx-auto w-full max-w-[23rem] overflow-hidden rounded-2xl sm:max-w-md md:max-w-lg">
            <div className="relative aspect-[16/8.4] w-full">
              <Image
                src="/media/products/hero-mockup.png"
                alt={content.hero.imageAlt}
                fill
                sizes="(min-width: 768px) 32rem, (min-width: 640px) 28rem, 22rem"
                priority
                className="object-cover object-[50%_53%]"
              />
            </div>
          </div>

          <div className="pt-2">
            <CtaButton
              baseLabel={content.hero.ctaLabel}
              sectionName={content.analytics.sectionNames.hero}
            />
            <p className="label-copy mt-2 text-charcoal/75">{content.hero.trustLine}</p>
          </div>

          <p className="body-copy max-w-prose">{content.hero.description}</p>
        </div>
      </div>
    </section>
  );
}
