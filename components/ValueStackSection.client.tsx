// ValueStackSection.client.tsx
"use client";

import Image from 'next/image';
import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';
import CtaButton from '@/components/CtaButton';

export default function ValueStackSection(): JSX.Element {
  const { currentPrice, isExpired, ready } = usePrice();

  return (
    <section aria-labelledby="value-stack-heading" className="section-shell bg-sage text-white">
      <div className="section-container section-stack">
        {/* Main Product */}
        <article className="bg-charcoal/30 rounded-2xl overflow-hidden max-w-md mx-auto text-center">
          <div className="relative w-full h-56 bg-white">
            <Image
              src="/media/products/section3.webp"
              alt="Portada del programa central Glucosa Plana"
              fill
              className="object-contain object-center h-full w-auto mx-auto rounded-t-2xl"
              style={{ display: 'block' }}
              priority={false}
              loading="eager"
            />
          </div>
          <div className="p-6 bg-charcoal/30 rounded-b-2xl text-center">
            <h3 className="subsection-title">📘 EL PROGRAMA CENTRAL: GLUCOSA PLANA</h3>
            <p className="body-copy mt-4 text-left">
              Más de 100 recetas caseras paso a paso para estabilizar tu azúcar en 30 días. Aprenderás a cocinar versiones seguras de tus platos favoritos que saben a gloria. <b>Nunca más tendrás que cocinar dos comidas separadas para tu familia y para ti.</b>
            </p>
            <p className="body-copy mt-4 flex items-center gap-1">
              <span className="font-semibold">Valor Normal: <span className="line-through medium-strike">$29.95</span></span>
              <span className="tag-pill text-xs px-2 py-0.5">¡HOY INCLUIDO!</span>
            </p>
          </div>
        </article>

        {/* Bonuses */}
        <h3 id="value-stack-bonuses-heading" className="sr-only">Bonos incluidos</h3>
        <div aria-labelledby="value-stack-bonuses-heading" className="grid gap-4 md:grid-cols-2 mt-8">
          {/* Bonus 1 */}
          <article className="bg-charcoal/20 rounded-2xl overflow-hidden max-w-md mx-auto text-center">
            <div className="relative w-full h-48 bg-white">
              <Image
                src="/media/products/section3-1.webp"
                alt="Portada del bono Piloto Automático Metabólico"
                fill
                className="object-contain object-center h-full w-auto mx-auto rounded-t-2xl"
                style={{ display: 'block' }}
                priority={false}
              />
            </div>
            <div className="p-6 bg-charcoal/20 rounded-b-2xl text-center">
              <h3 className="card-title">🎁 Bono #1: PILOTO AUTOMÁTICO METABÓLICO</h3>
              <p className="body-copy mt-2 text-left">
                Tu planificador semanal visual. Te entrego la lista de compras súper inteligente y el menú exacto de lunes a domingo. Nunca más sentirás el estrés de pensar "¿qué rayos voy a cocinar hoy?".
              </p>
              <p className="mt-3 font-semibold flex items-center gap-1">
                <span className="line-through medium-strike">$17.95</span>
                <span className="tag-pill text-xs px-2 py-0.5">¡HOY INCLUIDO!</span>
              </p>
            </div>
          </article>
          {/* Bonus 2 */}
          <article className="bg-charcoal/20 rounded-2xl overflow-hidden max-w-md mx-auto text-center">
            <div className="relative w-full h-48 bg-white">
              <Image
                src="/media/products/section3-2.webp"
                alt="Portada del bono Baño de Sabor"
                fill
                className="object-contain object-center h-full w-auto mx-auto rounded-t-2xl"
                style={{ display: 'block' }}
                priority={false}
              />
            </div>
            <div className="p-6 bg-charcoal/20 rounded-b-2xl text-center">
              <h3 className="card-title">🎁 Bono #2: BAÑO DE SABOR (Salsas y Dips)</h3>
              <p className="body-copy mt-2 text-left">
                20 aderezos rápidos (como mayonesa casera, salsa balsámica y pesto) que revivirán tus carnes y ensaladas en minutos, sin añadir un solo gramo de azúcar. ¡Despídete de la comida seca!
              </p>
              <p className="mt-3 font-semibold flex items-center gap-1">
                <span className="line-through medium-strike">$14.95</span>
                <span className="tag-pill text-xs px-2 py-0.5">¡HOY INCLUIDO!</span>
              </p>
            </div>
          </article>
          {/* Bonus 3 */}
          <article className="bg-charcoal/20 rounded-2xl overflow-hidden max-w-md mx-auto text-center">
            <div className="relative w-full h-48 bg-white">
              <Image
                src="/media/products/section3-3.webp"
                alt="Portada del bono Dulzura Líquida"
                fill
                className="object-contain object-center h-full w-auto mx-auto rounded-t-2xl"
                style={{ display: 'block' }}
                priority={false}
              />
            </div>
            <div className="p-6 bg-charcoal/20 rounded-b-2xl text-center">
              <h3 className="card-title">🎁 Bono #3: DULZURA LÍQUIDA (Bebidas y Tés)</h3>
              <p className="body-copy mt-2 text-left">
                15 batidos frutales y tés antiestrés listos en 3 minutos. El "escudo protector" perfecto para calmar tu sistema nervioso en la noche y apagar los antojos por lo dulce.
              </p>
              <p className="mt-3 font-semibold flex items-center gap-1">
                <span className="line-through medium-strike">$14.95</span>
                <span className="tag-pill text-xs px-2 py-0.5">¡HOY INCLUIDO!</span>
              </p>
            </div>
          </article>
          {/* Bonus 4 */}
          <article className="bg-charcoal/20 rounded-2xl overflow-hidden max-w-md mx-auto text-center">
            <div className="relative w-full h-48 bg-white">
              <Image
                src="/media/products/section3-4.webp"
                alt="Portada del bono El Hack de las Masas"
                fill
                className="object-contain object-center h-full w-auto mx-auto rounded-t-2xl"
                style={{ display: 'block' }}
                priority={false}
              />
            </div>
            <div className="p-6 bg-charcoal/20 rounded-b-2xl text-center">
              <h3 className="card-title">🎁 Bono #4: EL HACK DE LAS MASAS (Harinas y Leches)</h3>
              <p className="body-copy mt-2 text-left">
                Descubre 12 bases caseras y súper económicas para que puedas hornear tus propios panes, galletas, arepas y tortillas sin provocar picos de insulina.
              </p>
              <p className="mt-3 font-semibold flex items-center gap-1">
                <span className="line-through medium-strike">$9.95</span>
                <span className="tag-pill text-xs px-2 py-0.5">¡HOY INCLUIDO!</span>
              </p>
            </div>
          </article>
        </div>

        {/* Offer Card */}
        <article className="surface-card mx-auto max-w-2xl border-2 border-terracotta/30 text-charcoal shadow-lg text-center">
          <p className="body-copy text-softred line-through">
            Valor Total Real de todo el paquete: $87.75 USD
          </p>
          <p className="body-copy mt-3 font-semibold">
            {isExpired ? (
              <>Llévate TODO con un 68% OFF</>
            ) : (
              <>
                Llévate TODO hoy con un 80% de descuento aplicado (Solo por los próximos{' '}
                {/* id="t-vs" is updated by the plain-JS countdown script in layout.tsx */}
                <span suppressHydrationWarning id="t-vs">--:--</span>):
              </>
            )}
          </p>
          <p className="price-display mt-5">
            <span className="bg-yellow-300 text-charcoal px-4 py-1 rounded font-bold whitespace-nowrap">{ready ? currentPrice : '--'}</span>
          </p>
          {!isExpired && (
            <div className="notice-card mt-8">
              <p className="body-copy font-medium text-charcoal">
                ⚠️ Atención: Al expirar el contador, el precio subirá automáticamente a $27.97 USD.
              </p>
            </div>
          )}
          <div className="mt-6">
            <div className="flex flex-col items-center">
              <CtaButton
                baseLabel={'👇 SÍ, CLARA. QUIERO TODO ESTO AHORA MISMO'}
                sectionName={content.analytics.sectionNames.valueStack}
              />
              <span className="label-copy mt-3 text-xs text-charcoal/70 text-center">
                🔒 Equivalente a solo ~$17 USD. Cero complicaciones técnicas. Lo abres en tu celular al instante.
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
