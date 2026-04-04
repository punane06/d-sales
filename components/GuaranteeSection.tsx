import Image from 'next/image';
import { content } from '@/config/content';

export default function GuaranteeSection(): JSX.Element {
  return (
    <section aria-labelledby="guarantee-heading" className="section-shell bg-charcoal text-white">
      <div className="section-container section-stack">
        <h2 id="guarantee-heading" className="section-title">
          {content.guarantee.heading}
        </h2>
        <p className="body-copy">{content.guarantee.text}</p>

        <article className="rounded-2xl bg-white/10 p-6">
          <h3 className="subsection-title">
            {content.guarantee.trustHeading}
          </h3>
          <p className="body-copy mt-3">{content.guarantee.trustText}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {content.guarantee.badges.map((badge) => (
              <div key={badge.label} className="rounded-xl bg-white/5 p-4">
                <Image
                  src={badge.src}
                  alt={badge.label}
                  width={120}
                  height={120}
                  className="mx-auto h-auto w-20 object-contain"
                />
                <p className="label-copy mt-3 text-center font-medium">{badge.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="label-copy text-white/60">{content.guarantee.paymentMethodsLabel}</span>
            <Image src="/media/payment/visa.svg" alt="Visa" width={48} height={32} className="h-6 w-auto" />
            <Image src="/media/payment/mastercard.svg" alt="Mastercard" width={48} height={32} className="h-6 w-auto" />
            <Image src="/media/payment/paypal.svg" alt="PayPal" width={48} height={32} className="h-6 w-auto" />
          </div>
        </article>
      </div>
    </section>
  );
}
