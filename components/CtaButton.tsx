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
      className={`cta-shell ${className ?? ''}`}
    >
      <span className="cta-main">{baseLabel}</span>
      <span className="cta-price">({currentPrice})</span>
    </a>
  );
}
