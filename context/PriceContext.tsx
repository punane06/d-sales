'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { content } from '@/config/content';
import { trackEvent } from '@/utils/analytics';
import { evaluateTimerStatus, resolveCurrentUrl } from '@/utils/timer';

interface PriceContextValue {
  currentPrice: string;
  currentUrl: string;
  isExpired: boolean;
  ready: boolean;
}

const PriceContext = createContext<PriceContextValue | null>(null);

type PriceProviderProps = { readonly children: React.ReactNode };

/**
 * PriceProvider does NOT run its own countdown. The single countdown engine
 * is the inline script in `app/layout.tsx` (it ticks every second and writes
 * to localStorage + cookie). React just reads the current status and reacts
 * to the events the inline script dispatches:
 *
 *   - 'eps-timer-ready'   -> first paint synced
 *   - 'eps-timer-reset'   -> a new 30-min cycle started (after 24h cooldown)
 *   - 'eps-timer-expired' -> the 30-min countdown reached zero
 */
function PriceProvider({ children }: PriceProviderProps): JSX.Element {
  const [isExpired, setIsExpired] = useState(false);
  const [ready, setReady] = useState(false);
  const didTrackExpiry = useRef(false);

  useEffect(() => {
    if (isExpired && !didTrackExpiry.current) {
      trackEvent('timer_expired', { timer_expired: true });
      didTrackExpiry.current = true;
    }
  }, [isExpired]);

  useEffect(() => {
    // Belt-and-braces fallback: if for any reason the inline script's
    // 'eps-timer-expired' event never reaches us (very narrow race during
    // BFCache restore), this single timeout flips the React flag exactly
    // when the 30 min hits zero.
    let expiryFallback: ReturnType<typeof setTimeout> | null = null;

    function clearFallback(): void {
      if (expiryFallback !== null) {
        clearTimeout(expiryFallback);
        expiryFallback = null;
      }
    }

    function sync(): void {
      clearFallback();
      const { isExpired: nextExpired, expiryDelayMs } = evaluateTimerStatus(Date.now());
      setIsExpired((prev) => (prev === nextExpired ? prev : nextExpired));
      setReady(true);
      if (!nextExpired && expiryDelayMs !== null && expiryDelayMs > 0) {
        expiryFallback = setTimeout(() => setIsExpired(true), expiryDelayMs);
      }
    }

    sync();

    const onReset = (): void => {
      didTrackExpiry.current = false;
      sync();
    };
    const onPageShow = (): void => sync();
    const onVisibility = (): void => {
      if (globalThis.document?.visibilityState === 'visible') sync();
    };

    globalThis.window?.addEventListener('pageshow', onPageShow);
    globalThis.document?.addEventListener('visibilitychange', onVisibility);
    globalThis.window?.addEventListener('eps-timer-ready', sync);
    globalThis.window?.addEventListener('eps-timer-reset', onReset);
    globalThis.window?.addEventListener('eps-timer-expired', sync);

    return () => {
      clearFallback();
      globalThis.window?.removeEventListener('pageshow', onPageShow);
      globalThis.document?.removeEventListener('visibilitychange', onVisibility);
      globalThis.window?.removeEventListener('eps-timer-ready', sync);
      globalThis.window?.removeEventListener('eps-timer-reset', onReset);
      globalThis.window?.removeEventListener('eps-timer-expired', sync);
    };
  }, []);

  const value = useMemo<PriceContextValue>(() => ({
    currentPrice: isExpired ? content.offer.expiredPrice : content.offer.salePrice,
    currentUrl: isExpired ? content.offer.expiredUrl : content.offer.saleUrl,
    isExpired,
    ready,
  }), [isExpired, ready]);

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
}

export { PriceProvider };

export function usePrice(): PriceContextValue {
  const ctx = useContext(PriceContext);
  if (!ctx) throw new Error('usePrice must be used within PriceProvider');
  return ctx;
}

// Re-export the shared resolver so existing callers (e.g. CtaButton) keep
// working without a path change.
export { resolveCurrentUrl };
