'use client';

import Image from 'next/image';
import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';
import CtaButton from '@/components/CtaButton';

export default function ValueStackSection(): JSX.Element {
  const { currentPrice } = usePrice();

  return (
    <section aria-labelledby="value-stack-heading" className="section-shell bg-sage text-white">
      <div className="section-container section-stack">
        <h2 id="value-stack-heading" className="section-title">
          {content.valueStack.heading}
        </h2>

        <article className="rounded-2xl bg-charcoal/30 p-6">
          <div className="grid items-start gap-5 md:grid-cols-[auto_minmax(0,1fr)]">
            <Image
              src={content.valueStack.mainProduct.imageSrc}
              alt={content.valueStack.mainProduct.imageAlt}
              width={220}
              height={280}
              className="h-auto w-44 rounded-xl object-contain shadow-lg"
            />
            <div>
              <h3 className="subsection-title">
                {content.valueStack.mainProduct.title}
              </h3>
              <ul className="body-copy mt-4 space-y-2">
                {content.valueStack.mainProduct.bullets.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <p className="body-copy mt-4">
                <span className="font-semibold">Valor: {content.valueStack.mainProduct.value}</span>
                <span className="tag-pill ml-3">
                  {content.valueStack.mainProduct.includedLabel}
                </span>
              </p>
            </div>
          </div>
        </article>

        <h2 className="sr-only">Bonos incluidos</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {content.valueStack.bonuses.map((bonus, index) => (
            <article key={index} className="rounded-2xl bg-charcoal/20 p-5">
              <Image
                src={bonus.imageSrc}
                alt={bonus.imageAlt}
                width={200}
                height={240}
                className="mb-4 h-auto w-36 rounded-lg object-contain shadow-md"
              />
              <h3 className="card-title">
                {bonus.icon} {bonus.title}
              </h3>
              <p className="body-copy mt-2">{bonus.description}</p>
              <p className="mt-3 font-semibold">Valor: {bonus.value}</p>
            </article>
          ))}
        </div>

        <article className="surface-card mx-auto max-w-2xl border-2 border-terracotta/30 text-charcoal shadow-lg">
          <p className="body-copy text-softred line-through">
            {content.valueStack.pricing.totalLabel}
          </p>
          <p className="body-copy mt-3 font-semibold">
            {content.valueStack.pricing.discountLabel}
          </p>
          <p className="price-display mt-4">{currentPrice}</p>
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
