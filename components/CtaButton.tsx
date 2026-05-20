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
  const [href, setHref] = useState(currentUrl);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(resolveCurrentUrl());
  }, []);

  useEffect(() => {
    const sync = (): void => setHref(resolveCurrentUrl());
    globalThis.window?.addEventListener('pageshow', sync);
    globalThis.document?.addEventListener('visibilitychange', sync);
    globalThis.window?.addEventListener('eps-timer-reset', sync);
    globalThis.window?.addEventListener('eps-timer-expired', sync);
    return () => {
      globalThis.window?.removeEventListener('pageshow', sync);
      globalThis.document?.removeEventListener('visibilitychange', sync);
      globalThis.window?.removeEventListener('eps-timer-reset', sync);
      globalThis.window?.removeEventListener('eps-timer-expired', sync);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHref(resolveCurrentUrl());
  }, [currentUrl]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    const destination = resolveCurrentUrl();

    const params = {
      price_shown: currentPrice,
      section_name: sectionName,
      timer_expired: isExpired,
      cta_label: baseLabel,
      destination_url: destination,
    };

    let navigated = false;
    const go = (): void => {
      if (navigated) return;
      navigated = true;
      globalThis.location.href = destination;
    };

    // Hard fallback in case the event_callback never fires (tracker blocked, etc.)
    const fallback = setTimeout(go, 500);

    // GA4 with event_callback — fires when the beacon flushes
    try {
      if (typeof globalThis.window?.gtag === 'function') {
        globalThis.window.gtag('event', 'cta_click', {
          ...params,
          event_callback: () => { clearTimeout(fallback); go(); },
          event_timeout: 400,
          transport_type: 'beacon',
        });
      } else {
        trackEvent('cta_click', params);
      }
    } catch {
      trackEvent('cta_click', params);
    }

    // Meta Pixel — InitiateCheckout fires in parallel
    try {
      if (typeof globalThis.window?.fbq === 'function') {
        const numericPrice = Number.parseFloat(currentPrice.replace(/[^0-9.]/g, '')) || 0;
        globalThis.window.fbq('track', 'InitiateCheckout', {
          value: numericPrice,
          currency: 'USD',
          content_name: baseLabel,
          content_category: sectionName,
        });
      }
    } catch { /* noop */ }
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
