'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface AnalyticsScriptsProps {
  gaId?: string;
  clarityId?: string;
  nonce?: string;
}

export default function AnalyticsScripts({ gaId, clarityId, nonce }: Readonly<AnalyticsScriptsProps>): JSX.Element | null {
  const hasGaId = Boolean(gaId && gaId !== 'G-XXXXXXXXXX' && gaId !== 'GA_MEASUREMENT_ID');
  const hasClarityId = Boolean(clarityId && clarityId !== 'xxxxxxxxxx' && clarityId !== 'CLARITY_PROJECT_ID');

  // Synchronously prime dataLayer + gtag BEFORE gtag.js loads so that calls to
  // gtag() made during hydration (e.g. by ScrollMilestoneTracker, CtaButton on
  // fast clicks) queue correctly and are flushed when gtag.js finishes loading.
  useEffect(() => {
    if (!hasGaId || !gaId) return;
    const win = globalThis.window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    win.dataLayer = win.dataLayer || [];
    if (!win.gtag) {
      win.gtag = function gtag(...args: unknown[]) { win.dataLayer!.push(args); };
    }
    (win.gtag as (...a: unknown[]) => void)('js', new Date());
    (win.gtag as (...a: unknown[]) => void)('config', gaId, {
      transport_type: 'beacon',
      send_page_view: true,
    });
  }, [gaId, hasGaId]);

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
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${clarityId}`;
    document.head.appendChild(script);
    // Do NOT remove the script on cleanup — Clarity needs the global to survive.
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
