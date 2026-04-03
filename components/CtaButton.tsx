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
      cta_label: baseLabel,
      destination_url: currentUrl,
    });
  };

  return (
    <a
      href={currentUrl}
      onClick={handleClick}
      aria-label={`${baseLabel} ${currentPrice} USD`}
      className={`inline-flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-lg bg-terracotta px-5 py-3.5 text-center text-[0.95rem] font-bold text-white shadow-md transition-all duration-200 hover:brightness-110 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal md:w-auto md:px-8 md:text-base motion-safe:[animation:cta-pulse_2s_ease-in-out_infinite] ${className ?? ''}`}
    >
      <span className="max-w-[24ch] leading-tight [text-wrap:balance]">{baseLabel}</span>
      <span className="whitespace-nowrap text-sm font-semibold leading-tight md:text-[0.95rem]">({currentPrice} USD)</span>
    </a>
  );
}
