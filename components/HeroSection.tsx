
'use client';




import Image from 'next/image';
import { content } from '@/config/content';
import CtaButton from '@/components/CtaButton';
import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import { usePrice } from '@/context/PriceContext';
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
  const { isExpired } = usePrice();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="section-shell-tight bg-offwhite pt-2 sm:pt-10"
    >
      <div className="section-container-narrow">
        <div className="section-stack-compact">
          <h1
            id="hero-heading"
            className="text-left text-[25px] sm:text-4xl font-extrabold text-charcoal leading-tight"
          >
            El fin de las dietas de hospital y el terror a la insulina.
          </h1>
          <p className="body-copy max-w-prose mb-2 text-left">
            Descubre el método paso a paso para estabilizar tu glucosa en 30 días comiendo delicioso,
            abundante y en la misma mesa que toda tu familia.
          </p>


          <div className="mx-auto w-full max-w-[23rem] overflow-hidden rounded-2xl sm:max-w-md md:max-w-lg mb-0">
            <div className="relative w-full flex justify-center items-center" style={{ minHeight: '17rem', height: '17rem' }}>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={videoRef}
                className="object-contain w-auto h-full rounded-2xl bg-offwhite mx-auto"
                poster="/media/products/hero-mockup.webp"
                src="/media/VideoPromo.webm"
                playsInline
                muted={!isPlaying}
                loop
                controls={isPlaying}
                preload="none"
                style={{ background: '#e5e7eb', height: '100%', maxHeight: '100%' }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Sorry, your browser does not support embedded videos.
              </video>
              {!isPlaying && (
                <button
                  onClick={handlePlay}
                  aria-label="Reproducir video"
                  className="absolute inset-0 flex items-center justify-center w-full h-full bg-black/40 hover:bg-black/60 transition rounded-2xl focus:outline-none z-10"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="sr-only">Reproducir video</span>
                  <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="45" cy="45" r="45" fill="#fff" fillOpacity="0.85" />
                    <polygon points="36,28 68,45 36,62" fill="#1a202c" />
                  </svg>
                </button>
              )}
            </div>
          </div>


          <div className="pt-2 flex flex-col items-center -mt-16">
            <CtaButton
              baseLabel="👇 SÍ, CLARA. QUIERO COMER RICO Y SANAR MI CUERPO"
              sectionName={content.analytics.sectionNames.hero}
              className="mb-2"
            />
            <div className="label-copy mt-2 text-charcoal/75 text-left max-w-prose mx-auto leading-snug text-xs sm:text-sm">
              <div>🔒 Equivalente a solo {isExpired ? <>$29.<sup>97</sup></> : <>$16.<sup>97</sup></>} USD. Al hacer clic, verás el precio exacto adaptado mágicamente a la moneda de tu país, sin cobros sorpresa).</div>
              <div>
                <span>✅ <strong>Compra 100% segura.</strong></span>
                <span> &nbsp;|&nbsp; </span>
                <span>📱 <strong>Fácil de abrir:</strong> Te llega directo a tu celular o correo en 1 minuto.</span>
              </div>
            </div>
          </div>
          <p className="body-copy max-w-prose pt-2 mb-4 text-left">
            Vuelve a disfrutar de tus comidas favoritas (pizzas, panes y postres)... <strong>sin picos de azúcar, sin pasar hambre y sin cocinar dos veces.</strong>
          </p>
        </div>
      </div>
    </section>
  );

}
