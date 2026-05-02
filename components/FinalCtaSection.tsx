"use client";
import Image from "next/image";
import { content } from "@/config/content";
import CtaButton from "@/components/CtaButton";
import { usePrice } from "@/context/PriceContext";

export default function FinalCtaSection(): JSX.Element {
  const { ready } = usePrice();

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
        <div className="abel-copy mt-3 text-xs text-charcoal/70 text-left block">🔒 Equivalente a solo ~$17 USD. Al hacer clic, verás el precio exacto adaptado
          mágicamente a la moneda de tu país, sin cobros sorpresa</div>
        <div className="mt-6 flex flex-row items-center justify-center">
          <div className="flex flex-row items-center gap-x-0">
            {content.guarantee.badges.slice(0, 2).map((badge) => {
              const isLock = badge.label.toLowerCase().includes("ssl") || badge.label.toLowerCase().includes("lukk") || badge.label.toLowerCase().includes("lock");
              return (
                <Image
                  key={badge.label}
                  src={badge.src}
                  alt={badge.label}
                  width={isLock ? 48 : 72}
                  height={isLock ? 48 : 72}
                  style={{ width: 'auto' }}
                  className={`object-contain ${isLock ? "h-12" : "h-14"}`}
                />
              );
            })}
          </div>
          {/* Add a little more space before Hotmart icon */}
          <div className="ml-3">
            {(() => {
              const badge = content.guarantee.badges[2];
              return (
                <Image
                  key={badge.label}
                  src={badge.src}
                  alt={badge.label}
                  width={72}
                  height={72}
                  style={{ width: 'auto' }}
                  className="object-contain h-14"
                />
              );
            })()}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <span className="sr-only">Formas de pago aceptadas:</span>
          <Image
            src="/media/payment/visa.svg"
            alt="Visa"
            width={48}
            height={32}
            className="h-6 w-auto"
          />
          <Image
            src="/media/payment/mastercard.svg"
            alt="Mastercard"
            width={48}
            height={32}
            className="h-6 w-auto"
          />
          <Image
            src="/media/payment/paypal.svg"
            alt="PayPal"
            width={48}
            height={32}
            className="h-6 w-auto"
          />
        </div>
      </div>
    </section>
  );
}
