import Image from 'next/image';
import { content } from '@/config/content';
import CtaButton from '@/components/CtaButton';

export default function FinalCtaSection(): JSX.Element {
  return (
    <section aria-labelledby="final-cta-heading" className="section-shell bg-offwhite">
      <div className="section-container-narrow section-stack-compact text-center">
        <h2 id="final-cta-heading" className="section-title">
          {content.finalCta.heading}
        </h2>
        <p className="body-copy">{content.finalCta.paragraph}</p>
        <p className="subsection-title italic">{content.finalCta.signature}</p>
        <div className="pt-2">
          <CtaButton
            baseLabel={content.finalCta.ctaLabel}
            sectionName={content.analytics.sectionNames.finalCta}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Image src="/media/payment/visa.svg" alt="Visa" width={48} height={32} className="h-6 w-auto" />
          <Image src="/media/payment/mastercard.svg" alt="Mastercard" width={48} height={32} className="h-6 w-auto" />
          <Image src="/media/payment/paypal.svg" alt="PayPal" width={48} height={32} className="h-6 w-auto" />
        </div>
      </div>
    </section>
  );
}
