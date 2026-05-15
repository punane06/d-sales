/* eslint-disable @next/next/no-img-element */
"use client";
import { content } from "@/config/content";
import CtaButton from "@/components/CtaButton";
import { usePrice } from "@/context/PriceContext";

export default function FinalCtaSection(): JSX.Element {
  const { ready, isExpired } = usePrice();

  const renderParagraph = (item: any) => {
    if (typeof item === 'string') {
      return item;
    }
    if (item.bold && item.rest) {
      return (
        <>
          <strong>{item.text}</strong>
          {item.rest}
        </>
      );
    }
    return item.text;
  };

  return (
    <section
      aria-labelledby="final-cta-heading"
      className="section-shell bg-offwhite"
    >
      <div className="section-container section-stack">
        <h2 id="final-cta-heading" className="section-title  mx-auto max-w-2xl">
          {content.finalCta.heading}
        </h2>
        {content.finalCta.paragraphs.map((para, idx) => {
          const key = typeof para === 'string' ? para : para.text;
          return (
            <p key={key} className="body-copy mx-auto max-w-2xl">
              {renderParagraph(para)}
              {idx === content.finalCta.paragraphs.length - 1 && (
                <span aria-label="corazón" role="img"> ❤️</span>
              )}
            </p>
          );
        })}
        <p className="mx-auto max-w-2xl">
          {content.finalCta.signature1}<br />
          <span className="italic ">{content.finalCta.signature2}</span>
        </p>
        <div className="pt-2">
          <CtaButton
            baseLabel={ready ? `Quiero Mi Paquete Completo` : 'Quiero Mi Paquete Completo'}
            sectionName={content.analytics.sectionNames.finalCta}
          />
        </div>
        <div className="abel-copy mt-3 text-xs text-charcoal/70 text-left block">🔒 Equivalente a solo {isExpired ? <>$27.<sup>97</sup></> : <>$16.<sup>97</sup></>} USD. Al hacer clic, verás el precio exacto adaptado
          mágicamente a la moneda de tu país, sin cobros sorpresa</div>
        <div className="mt-8 space-y-6">
          {/* Row 1: Guarantee, SSL, Hotmart */}
          <div className="flex flex-nowrap justify-center gap-6 items-center">
            {content.guarantee.badges.slice(0, 3).map((badge) => (
              <img
                key={badge.label}
                src={badge.src}
                alt={badge.label}
                className="h-12 object-contain flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>

          {/* Row 2: Visa/Mastercard, PayPal */}
          <div className="flex flex-nowrap justify-center gap-8 items-center">
            {content.guarantee.badges.slice(3, 5).map((badge) => (
              <img
                key={badge.label}
                src={badge.src}
                alt={badge.label}
                className="h-7 object-contain flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>

          {/* Row 3: OXXO, Efecty, Baloto, Sencillito */}
          <div className="flex flex-nowrap justify-center gap-4 items-center">
            {content.guarantee.badges.slice(5).map((badge) => (
              <img
                key={badge.label}
                src={badge.src}
                alt={badge.label}
                className="h-6 object-contain flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
