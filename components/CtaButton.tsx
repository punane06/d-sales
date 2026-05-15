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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    const navigate = (): void => {
      if (navigated) return;
      navigated = true;
      globalThis.location.href = destination;
    };

    // Fallback in case event_callback never fires (e.g. tracker blocked).
    const fallback = setTimeout(navigate, 500);

    // GA4 with explicit event_callback — fires when the beacon flushes.
    try {
      if (typeof globalThis.window?.gtag === 'function') {
        globalThis.window.gtag('event', 'cta_click', {
          ...params,
          event_callback: () => {
            clearTimeout(fallback);
            navigate();
          },
          event_timeout: 400,
        });
      } else {
        // No gtag yet — queue to dataLayer via trackEvent.
        trackEvent('cta_click', params);
      }
    } catch {
      trackEvent('cta_click', params);
    }

    // Meta Pixel — fire in parallel, no callback needed (fire-and-forget).
    try {
      if (typeof globalThis.window?.fbq === 'function') {
        globalThis.window.fbq('track', 'InitiateCheckout', {
          value: Number.parseFloat(currentPrice.replace(/[^0-9.]/g, '')) || 0,
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
