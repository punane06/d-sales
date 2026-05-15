'use client';

import { useLayoutEffect } from 'react';
import Script from 'next/script';

interface MetaPixelScriptProps {
  pixelId?: string;
  nonce?: string;
}

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  q?: unknown[][];
  push?: (...args: unknown[]) => void;
  loaded?: boolean;
  version?: string;
};

export default function MetaPixelScript({ pixelId, nonce }: Readonly<MetaPixelScriptProps>): JSX.Element | null {
  const hasPixelId = Boolean(pixelId && pixelId !== 'xxxxxxxxxx' && pixelId !== 'PIXEL_ID');

  // useLayoutEffect so the stub + init queues are in place before first paint,
  // ensuring events fired during hydration (e.g. from CtaButton) don't drop.
  useLayoutEffect(() => {
    if (!hasPixelId || !pixelId) return;
    const win = globalThis.window as Window & { fbq?: FbqFunction; _fbq?: FbqFunction };
    if (!win.fbq) {
      const fbqStub: FbqFunction = (...args: unknown[]) => {
        if (fbqStub.callMethod) {
          fbqStub.callMethod(...args);
          return;
        }
        fbqStub.q ??= [];
        fbqStub.q.push(args);
      };
      fbqStub.push = (...args: unknown[]) => fbqStub(...args);
      fbqStub.loaded = true;
      fbqStub.version = '2.0';
      fbqStub.q = [];
      win.fbq = fbqStub;
      win._fbq = fbqStub;
    }
    // Init queues against the stub; PageView too. Both flush when fbevents.js loads.
    win.fbq('init', pixelId);
    win.fbq('track', 'PageView');
  }, [pixelId, hasPixelId]);

  if (!hasPixelId || !pixelId) return null;

  return (
    <>
      <Script
        id="fb-pixel"
        src="https://connect.facebook.net/en_US/fbevents.js"
        strategy="afterInteractive"
        nonce={nonce}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
    </>
  );
}
