'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface MetaPixelScriptProps {
  pixelId?: string;
}

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  q?: unknown[][];
  push?: (...args: unknown[]) => void;
  loaded?: boolean;
  version?: string;
};

export default function MetaPixelScript({ pixelId }: Readonly<MetaPixelScriptProps>): JSX.Element | null {
  const hasPixelId = Boolean(pixelId && pixelId !== 'xxxxxxxxxx' && pixelId !== 'PIXEL_ID');

  useEffect(() => {
    if (!hasPixelId || !pixelId) {
      return;
    }

    const win = globalThis.window as Window & {
      fbq?: FbqFunction;
      _fbp?: string;
    };

    // Set up fbq stub so init/track calls queue correctly before fbevents.js loads.
    // init + PageView are fired in onLoad — not here — to ensure correct ordering.
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

      win.fbq = fbqStub;
    }
  }, [pixelId, hasPixelId]);

  if (!hasPixelId || !pixelId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://connect.facebook.net/en_US/fbevents.js`}
        strategy="afterInteractive"
        onLoad={() => {
          const win = globalThis.window as Window & {
            fbq?: FbqFunction;
          };

          if (win.fbq) {
            win.fbq('init', pixelId);
            win.fbq('track', 'PageView');
          }
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{
            display: 'none',
          }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
