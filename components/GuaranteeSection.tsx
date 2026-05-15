"use client";

import CtaButton from '@/components/CtaButton';
import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';

export default function GuaranteeSection(): JSX.Element {
  const { isExpired } = usePrice();
  const discount = isExpired ? '68%' : '80%';
  return (
    <section aria-labelledby="guarantee-heading" className="section-shell bg-charcoal text-white">
      <div className="section-container section-stack">
        {/* Hero image and value/cta block */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="w-full max-w-2xl mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/products/hero-mockup.webp"
              alt="Mockup del recetario digital El Plato Seguro para mujeres con diabetes tipo 2"
              className="w-full rounded-2xl shadow-lg border border-white/20"
              style={{ background: '#fff' }}
            />
          </div>
          <article className="surface-card mx-auto max-w-2xl border-2 border-terracotta/30 text-charcoal shadow-lg text-center">
            <p className="body-copy text-softred line-through">
              Valor Total Real de todo el paquete: $87.75 USD
            </p>
            <p className="body-copy mt-3 font-semibold">
              Llévate TODO hoy con un {discount} de descuento aplicado.
            </p>
            <div className="mt-6">
              <div className="flex flex-col items-center">
                <CtaButton
                  baseLabel={"👇 SÍ, CLARA. QUIERO MI PAQUETE COMPLETO"}
                  sectionName="guarantee"
                />
                <span className="label-copy mt-3 text-xs text-charcoal/70 text-left block">
                  🔒 Equivalente a solo {isExpired ? <>$27.<sup>97</sup></> : <>$16.<sup>97</sup></>} USD. Al hacer clic, verás el precio exacto adaptado mágicamente a la moneda de tu país, sin cobros sorpresa).
                </span>
                <span className="label-copy mt-1 text-xs text-charcoal/70 text-left block">
                  <b>📱 Cero complicaciones técnicas:</b> No necesitas descargar aplicaciones pesadas ni gastar la memoria de tu teléfono. Lo lees directo en tu pantalla al instante.
                </span>
              </div>
            </div>
          </article>
        </div>
        <h2 id="guarantee-heading" className="section-title">
          {content.guarantee.heading}
        </h2>
        <p className="body-copy" dangerouslySetInnerHTML={{ __html: content.guarantee.text }} />
      </div>
    </section>
  );
}
