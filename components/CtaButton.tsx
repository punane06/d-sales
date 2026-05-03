'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { usePrice, resolveCurrentUrl } from '@/context/PriceContext';
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

  // Initial value keeps server HTML and client first render in sync (no hydration
  // mismatch). useLayoutEffect below corrects to the real URL before first paint.
  const [href, setHref] = useState(currentUrl);

  // Fires synchronously after hydration, before the browser paints — so users
  // never see the wrong URL after coming back to the page with an expired timer.
  useLayoutEffect(() => {
    setHref(resolveCurrentUrl());
  }, []);

  useEffect(() => {
    const sync = () => setHref(resolveCurrentUrl());
    globalThis.window?.addEventListener('pageshow', sync);
    globalThis.document?.addEventListener('visibilitychange', sync);
    return () => {
      globalThis.window?.removeEventListener('pageshow', sync);
      globalThis.document?.removeEventListener('visibilitychange', sync);
    };
  }, []);

  // Re-sync when PriceContext state changes (timer expires while on page).
  useEffect(() => {
    setHref(resolveCurrentUrl());
  }, [currentUrl]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    const destination = resolveCurrentUrl();
    trackEvent('cta_click', {
      price_shown: currentPrice,
      section_name: sectionName,
      timer_expired: isExpired,
      cta_label: baseLabel,
      destination_url: destination,
    });
    globalThis.location.href = destination;
  };

  return (
    <div className="flex flex-col items-center">
      <a
        href={href}
        onClick={handleClick}
        className={`cta-shell ${className ?? ''}`}
        suppressHydrationWarning
      >
        <span className="cta-main">{baseLabel}</span>
      </a>
    </div>
  );
}
