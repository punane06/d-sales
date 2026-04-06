"use client";
import Image from "next/image";
import { content } from "@/config/content";
import CtaButton from "@/components/CtaButton";
import { usePrice } from "@/context/PriceContext";

export default function FinalCtaSection(): JSX.Element {
  const { currentPrice } = usePrice();
  const [firstPart, ...rest] = content.finalCta.paragraph.split("\n");
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="section-shell bg-offwhite"
    >
      <div className="section-container section-stack text-center">
        <h2 id="final-cta-heading" className="section-title text-center mx-auto max-w-2xl">
          {content.finalCta.heading}
        </h2>
        <p className="body-copy text-center mx-auto max-w-2xl">
          {firstPart}
          {rest.length > 0 && (
            <>
              <br />
              {rest.join("\n").replace("❤️", "")} <span aria-label="süda" role="img">
                ❤️
              </span>
            </>
          )}
        </p>
        <p className="subsection-title italic text-center mx-auto max-w-2xl">
          {content.finalCta.signature1}<br />
          {content.finalCta.signature2}
        </p>
        <div className="pt-2">
          <CtaButton
            baseLabel={`Quiero Mi Paquete Completo por Solo ${currentPrice}`}
            sectionName={content.analytics.sectionNames.finalCta}
          />
        </div>
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
