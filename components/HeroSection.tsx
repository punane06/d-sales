
'use client';



import Image from 'next/image';
import { content } from '@/config/content';
import CtaButton from '@/components/CtaButton';
import dynamic from 'next/dynamic';
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
  return (
    <section
      aria-labelledby="hero-heading"
      className="section-shell-tight bg-offwhite pt-4 sm:pt-10"
    >
      <div className="section-container-narrow">
        <div className="section-stack-compact">
          <p className="label-copy font-semibold text-softred mb-1">{content.hero.attention}</p>
          <h1
            id="hero-heading"
            className="display-title"
          >
            {content.hero.heading}
          </h1>

          {/* Descubre lõik ENNE pilti */}
          <p className="body-copy max-w-prose mb-4">{content.hero.description}</p>

          <div className="mx-auto w-full max-w-[23rem] overflow-hidden rounded-2xl sm:max-w-md md:max-w-lg mb-0">
            <div className="relative aspect-[16/8] w-full">
              <Image
                src="/media/products/hero-mockup.webp"
                alt={content.hero.imageAlt}
                fill
                sizes="(min-width: 768px) 32rem, (min-width: 640px) 28rem, 22rem"
                priority
                className="object-cover object-[50%_53%]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col items-center -mt-16">
            <CtaButton
              baseLabel={content.hero.ctaLabel}
              sectionName={content.analytics.sectionNames.hero}
              className="mb-2"
            />
            <HeroPriceLabel />
            <p className="label-copy mt-2 text-charcoal/75 text-center">
              <LockIcon />Compra 100% segura<SmartphoneIcon />Fácil de abrir: Te llega directo a tu celular o correo en 1 minuto.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

}
