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

          {/* Trust icons, Hotmart ja garantii 72x72, lukk 48x48 */}
          <div className="mt-6 flex flex-row-reverse items-center justify-center gap-8">
            {content.guarantee.badges.map((badge) => {
              let size = 72;
              if (
                badge.label.toLowerCase().includes('ssl') ||
                badge.label.toLowerCase().includes('lukk') ||
                badge.label.toLowerCase().includes('lock')
              ) {
                size = 48;
              }
              return (
                <Image
                  key={badge.label}
                  src={badge.src}
                  alt={badge.label}
                  width={size}
                  height={size}
                  className={`object-contain ${size === 72 ? 'h-18 w-18' : 'h-12 w-12'}`}
                />
              );
            })}
          </div>

          {/* Payment icons, ainult ikoonid, ühel real */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <Image src="/media/payment/visa.svg" alt="Visa" width={48} height={32} className="h-8 w-auto object-contain" />
            <Image src="/media/payment/mastercard.svg" alt="Mastercard" width={48} height={32} className="h-8 w-auto object-contain" />
            <Image src="/media/payment/paypal.svg" alt="PayPal" width={48} height={32} className="h-8 w-auto object-contain" />
          </div>
        </article>
      </div>
    </section>
  );
}
