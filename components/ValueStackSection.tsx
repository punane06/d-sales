'use client';

import Image from 'next/image';
import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';
import CtaButton from '@/components/CtaButton';

export default function ValueStackSection(): JSX.Element {
  const { currentPrice } = usePrice();

  return (
    <section aria-labelledby="value-stack-heading" className="section-shell bg-sage text-white">
      <div className="section-container space-y-8">
        <h2 id="value-stack-heading" className="section-title">
          {content.valueStack.heading}
        </h2>

        <article className="rounded-2xl bg-charcoal/30 p-6">
          <Image
            src={content.valueStack.mainProduct.imageSrc}
            alt={content.valueStack.mainProduct.imageAlt}
            width={220}
            height={280}
            className="mb-4 h-auto w-44 rounded-xl object-contain shadow-lg"
          />
          <h3 className="font-heading text-2xl font-semibold md:text-3xl">
            {content.valueStack.mainProduct.title}
          </h3>
          <ul className="body-copy mt-4 space-y-2">
            {content.valueStack.mainProduct.bullets.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="body-copy mt-4">
            <span className="font-semibold">Valor: {content.valueStack.mainProduct.value}</span>
            <span className="ml-3 rounded bg-white/20 px-3 py-1 text-sm">
              {content.valueStack.mainProduct.includedLabel}
            </span>
          </p>
        </article>

        <div className="grid gap-4 md:grid-cols-2">
          {content.valueStack.bonuses.map((bonus) => (
            <article key={bonus.title} className="rounded-2xl bg-charcoal/20 p-5">
              <Image
                src={bonus.imageSrc}
                alt={bonus.imageAlt}
                width={200}
                height={240}
                className="mb-4 h-auto w-36 rounded-lg object-contain shadow-md"
              />
              <h3 className="font-heading text-xl font-semibold md:text-2xl">
                {bonus.icon} {bonus.title}
              </h3>
              <p className="body-copy mt-2">{bonus.description}</p>
              <p className="mt-3 font-semibold">Valor: {bonus.value}</p>
            </article>
          ))}
        </div>

        <article className="surface-card text-charcoal">
          <p className="body-copy text-softred line-through">
            {content.valueStack.pricing.totalLabel}
          </p>
          <p className="body-copy mt-3 font-semibold">
            {content.valueStack.pricing.discountLabel}
          </p>
          <p className="mt-4 font-heading text-5xl font-bold md:text-6xl">{currentPrice} USD</p>
          <div className="notice-card mt-4">
            <p className="body-copy font-medium text-charcoal">
              ⚠️ {content.valueStack.pricing.expiryNotice}
            </p>
          </div>
          <div className="mt-6">
            <CtaButton
              baseLabel={content.valueStack.pricing.ctaLabel}
              sectionName={content.analytics.sectionNames.valueStack}
            />
          </div>
        </article>
      </div>
    </section>
  );
}
