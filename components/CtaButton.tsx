'use client';

import { usePrice } from '@/context/PriceContext';
import { trackEvent } from '@/utils/analytics';

interface CtaButtonProps {
  baseLabel: string;
  sectionName: string;
  className?: string;
}

export default function CtaButton({
  baseLabel,
  sectionName,
  className,
}: Readonly<CtaButtonProps>): JSX.Element {
  const { currentPrice, currentUrl, isExpired } = usePrice();

  const handleClick = (): void => {
    trackEvent('cta_click', {
      price_shown: currentPrice,
      section_name: sectionName,
      timer_expired: isExpired,
    });
  };

  return (
    <a
      href={currentUrl}
      onClick={handleClick}
      aria-label={`${baseLabel} ${currentPrice} USD`}
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-terracotta px-8 py-4 text-center text-base font-bold text-white transition duration-200 hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal md:w-auto md:text-lg [animation:cta-pulse_2s_ease-in-out_infinite] ${className ?? ''}`}
    >
      {`${baseLabel} (${currentPrice} USD)`}
    </a>
  );
}
