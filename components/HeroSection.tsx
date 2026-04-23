
'use client';




import Image from 'next/image';
import { content } from '@/config/content';
import CtaButton from '@/components/CtaButton';
import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
const HeroPriceLabel = dynamic(() => import('@/components/HeroPriceLabel.client'), { ssr: false });

function LockIcon() {
  return (
    <Image src="/media/trust/ssl-lock.svg" alt="Lock" width={16} height={16} className="inline align-text-bottom mx-1" />
  );
}
function SmartphoneIcon() {
  return (
    <Image src="/media/trust/smartphone.svg" alt="Smartphone" width={16} height={16} className="inline align-text-bottom mx-1" />
  );
}

export default function HeroSection(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <section
      aria-labelledby="hero-heading"
      className="section-shell-tight bg-offwhite pt-4 sm:pt-10"
    >
      <div className="section-container-narrow">
        <div className="section-stack-compact">
          <p className="text-center text-3xl sm:text-5xl font-extrabold text-charcoal mb-4">{content.hero.attention}</p>
          <h1
            id="hero-heading"
            className="display-title"
          >
            {content.hero.heading}
          </h1>

          {/* Descubre lõik ENNE pilti */}
          <p className="body-copy max-w-prose mb-4">{content.hero.description}</p>

          <div className="mx-auto w-full max-w-[23rem] overflow-hidden rounded-2xl sm:max-w-md md:max-w-lg mb-0">
            <div className="relative w-full flex justify-center items-center" style={{ minHeight: '17rem', height: '17rem' }}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={videoRef}
                className="object-contain w-auto h-full rounded-2xl bg-offwhite mx-auto"
                poster="/media/products/hero-mockup.webp"
                src="/media/VideoPromo.webm"
                playsInline
                controls
                autoPlay
                loop
                preload="none"
                style={{ background: '#e5e7eb', height: '100%', maxHeight: '100%' }}
              >
                Sorry, your browser does not support embedded videos.
              </video>
            </div>
          </div>

          <p className="body-copy max-w-prose mb-4 text-left">
            Vuelve a disfrutar de tus comidas favoritas (pizzas, panes y postres)... <strong>sin picos de azúcar, sin pasar hambre y sin cocinar dos veces.</strong>
          </p>
          <div className="pt-2 flex flex-col items-center -mt-16">
            <CtaButton
              baseLabel={content.hero.ctaLabel}
              sectionName={content.analytics.sectionNames.hero}
              className="mb-2"
            />
            <div className="label-copy mt-2 text-charcoal/75 text-center max-w-prose mx-auto leading-snug text-sm sm:text-base">
              <span>
                <span role="img" aria-label="lock">🔒</span> Equivalente a solo ~$17 USD. Al hacer clic, verás el precio exacto adaptado mágicamente a la moneda de tu país, sin cobros sorpresa).<br />
                <span role="img" aria-label="check">✅</span> <strong>Compra 100% segura.</strong> <span role="img" aria-label="smartphone">📱</span> <strong>Fácil de abrir:</strong> Te llega directo a tu celular o correo en 1 minuto.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

}
