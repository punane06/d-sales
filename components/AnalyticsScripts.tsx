'use client';

import { useEffect, useLayoutEffect } from 'react';
import Script from 'next/script';

interface AnalyticsScriptsProps {
  gaId?: string;
  clarityId?: string;
  nonce?: string;
}

export default function AnalyticsScripts({
  gaId,
  clarityId,
  nonce,
}: Readonly<AnalyticsScriptsProps>): JSX.Element | null {
  const hasGaId = Boolean(gaId && gaId !== 'G-XXXXXXXXXX' && gaId !== 'GA_MEASUREMENT_ID');
  const hasClarityId = Boolean(
    clarityId && clarityId !== 'xxxxxxxxxx' && clarityId !== 'CLARITY_PROJECT_ID',
  );

  // GA: prime dataLayer + gtag synchronously so early trackEvent calls queue
  // instead of being dropped. useLayoutEffect runs before paint, before any
  // child component's useEffect can fire trackEvent.
  useLayoutEffect(() => {
    if (!hasGaId || !gaId) return;
    const win = globalThis.window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    win.dataLayer = win.dataLayer || [];
    if (!win.gtag) {
      win.gtag = function gtag(...args: unknown[]) {
        (win.dataLayer as unknown[]).push(args);
      };
    }
    win.gtag('js', new Date());
    win.gtag('config', gaId, {
      transport_type: 'beacon',
      send_page_view: true,
    });
  }, [gaId, hasGaId]);

  // Clarity: same pattern, queue against a stub before the script loads.
  useEffect(() => {
    if (!hasClarityId || !clarityId) return;
    const win = globalThis.window as Window & {
      clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
      __clarityInitialized?: boolean;
    };
    if (win.__clarityInitialized) return;
    win.__clarityInitialized = true;

    if (!win.clarity) {
      const c = ((...args: unknown[]) => {
        c.q = c.q || [];
        c.q.push(args);
      }) as ((...args: unknown[]) => void) & { q?: unknown[] };
      win.clarity = c;
    }

    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${clarityId}`;
    document.head.appendChild(s);
    // Intentionally NOT removing on cleanup — Clarity must keep running.
  }, [clarityId, hasClarityId]);

  if (!hasGaId || !gaId) return null;

  return (
    <Script
      id="ga-script"
      src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      strategy="afterInteractive"
      nonce={nonce}
    />
  );
}
