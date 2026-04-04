'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface AnalyticsScriptsProps {
  gaId?: string;
  clarityId?: string;
}

export default function AnalyticsScripts({ gaId, clarityId }: Readonly<AnalyticsScriptsProps>): JSX.Element | null {
  const hasGaId = Boolean(gaId && gaId !== 'G-XXXXXXXXXX' && gaId !== 'GA_MEASUREMENT_ID');
  const hasClarityId = Boolean(
    clarityId && clarityId !== 'xxxxxxxxxx' && clarityId !== 'CLARITY_PROJECT_ID',
  );

  useEffect(() => {
    if (!hasClarityId || !clarityId) {
      return;
    }

    const win = globalThis.window as Window & {
      clarity?: (...args: unknown[]) => void;
      __clarityInitialized?: boolean;
    };

    if (win.__clarityInitialized) {
      return;
    }
    win.__clarityInitialized = true;

    win.clarity =
      win.clarity ||
      ((...args: unknown[]) => {
        (win.clarity as { q?: unknown[] }).q = (win.clarity as { q?: unknown[] }).q || [];
        (win.clarity as { q?: unknown[] }).q?.push(args);
      });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${clarityId}`;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [clarityId, hasClarityId]);

  if (!hasGaId || !gaId) {
    return null;
  }

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      strategy="afterInteractive"
      onLoad={() => {
        const win = globalThis.window as Window & {
          dataLayer?: unknown[];
          gtag?: (...args: unknown[]) => void;
        };

        win.dataLayer = win.dataLayer || [];
        const gtag = (...args: unknown[]): void => {
          win.dataLayer?.push(args);
        };
        win.gtag = gtag;
        gtag('js', new Date());
        gtag('config', gaId);
      }}
    />
  );
}
