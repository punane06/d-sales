import Image from 'next/image';
import { content } from '@/config/content';
import CtaButton from '@/components/CtaButton';

export default function HeroSection(): JSX.Element {
  return (
    <section
      aria-labelledby="hero-heading"
      className="bg-offwhite px-4 pb-12 pt-6 sm:pt-10"
    >
      <div className="mx-auto max-w-4xl">
        <div className="space-y-4">
          <p className="text-base font-semibold text-softred md:text-lg">{content.hero.attention}</p>
          <h1 id="hero-heading" className="font-heading text-4xl font-bold leading-tight md:text-6xl">
            {content.hero.heading}
          </h1>
          <p className="font-heading text-xl italic md:text-3xl">{content.hero.subheadline}</p>
          <p className="text-base leading-relaxed md:text-lg">{content.hero.description}</p>

          <div className="flex justify-center">
            <Image
              src="/media/products/hero-mockup.png"
              alt={content.hero.imageAlt}
              width={540}
              height={640}
              priority
              className="h-auto w-full max-w-xs rounded-2xl object-contain shadow-xl sm:max-w-sm"
            />
          </div>

          <div className="pt-2">
            <CtaButton
              baseLabel={content.hero.ctaLabel}
              sectionName={content.analytics.sectionNames.hero}
            />
            <p className="mt-3 text-base text-charcoal/80">{content.hero.trustLine}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
