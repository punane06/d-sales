"use client";

import Image from 'next/image';
import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';
import CtaButton from '@/components/CtaButton';


export default function ValueStackSection(): JSX.Element {
  const { currentPrice, isExpired, timeLeft } = usePrice();


  return (
    <section aria-labelledby="value-stack-heading" className="section-shell bg-sage text-white">
      <div className="section-container section-stack">
        <h2 id="value-stack-heading" className="section-title">
          {content.valueStack.heading}
        </h2>

        <article className="bg-charcoal/30 rounded-2xl overflow-hidden max-w-md mx-auto text-center">
          <div className="relative w-full h-56 bg-white">
            <Image
              src={content.valueStack.mainProduct.imageSrc}
              alt={content.valueStack.mainProduct.imageAlt}
              fill
              className="object-contain object-center h-full w-auto mx-auto rounded-t-2xl"
              style={{ display: 'block' }}
              priority={false}
            />
          </div>
          <div className="p-6 bg-charcoal/30 rounded-b-2xl text-center">
            <h3 className="subsection-title">
              {content.valueStack.mainProduct.title}
            </h3>
            <ul className="body-copy mt-4 space-y-2 text-left">
              {content.valueStack.mainProduct.bullets.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <p className="body-copy mt-4 flex items-center gap-1">
              <span className="font-semibold">Valor Normal: <span className="line-through medium-strike">{content.valueStack.mainProduct.value}</span></span>
              <span className="tag-pill text-xs px-2 py-0.5">¡HOY INCLUIDO!</span>
            </p>
          </div>
        </article>

        <h3 id="value-stack-bonuses-heading" className="sr-only">Bonos incluidos</h3>
        <div aria-labelledby="value-stack-bonuses-heading" className="grid gap-4 md:grid-cols-2 mt-8">
          {content.valueStack.bonuses.map((bonus, idx) => (
            <article key={bonus.title} className="bg-charcoal/20 rounded-2xl overflow-hidden max-w-md mx-auto text-center">
              <div className="relative w-full h-48 bg-white">
                <Image
                  src={bonus.imageSrc}
                  alt={bonus.imageAlt}
                  fill
                  className="object-contain object-center h-full w-auto mx-auto rounded-t-2xl"
                  style={{ display: 'block' }}
                  priority={false}
                />
              </div>
              <div className="p-6 bg-charcoal/20 rounded-b-2xl text-center">
                <h3 className="card-title">
                  🎁 {bonus.title}
                </h3>
                <p className="body-copy mt-2 text-left">{bonus.description}</p>
                <p className="mt-3 font-semibold flex items-center gap-1">
                  <span className="line-through medium-strike">{bonus.value}</span>
                  <span className="tag-pill text-xs px-2 py-0.5">¡HOY INCLUIDO!</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <article className="surface-card mx-auto max-w-2xl border-2 border-terracotta/30 text-charcoal shadow-lg text-center">
          <p className="body-copy text-softred line-through">
            {content.valueStack.pricing.totalLabel}
          </p>
          <p className="body-copy mt-3 font-semibold">
            {isExpired ? (
              <>Llévate TODO con un 68% OFF</>
            ) : (
              <>
                Llévate TODO con un 80% OFF (Solo por los próximos {formatCountdown(timeLeft)}):
              </>
            )}
          </p>
          <p className="price-display mt-5">
            <span className="bg-yellow-300 text-charcoal px-4 py-1 rounded font-bold">{currentPrice}</span>
          </p>
          {!isExpired && (
            <div className="notice-card mt-8">
              <p className="body-copy font-medium text-charcoal">
                ⚠️ {content.valueStack.pricing.expiryNotice}
              </p>
            </div>
          )}
          <div className="mt-6">
            <CtaButton
              baseLabel={`${content.valueStack.pricing.ctaLabel.replace(/ por Solo.*$/i, '')} ${currentPrice}`}
              sectionName={content.analytics.sectionNames.valueStack}
            />
          </div>
        </article>
      </div>
    </section>
  );
}

// Helper to format seconds as mm:ss
function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
