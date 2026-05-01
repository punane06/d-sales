
'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { content } from '@/config/content';
import { trackEvent } from '@/utils/analytics';

interface PriceContextValue {
  currentPrice: string;
  currentUrl: string;
  isExpired: boolean;
  ready: boolean;
}

const PriceContext = createContext<PriceContextValue | null>(null);

type PriceProviderProps = {
  readonly children: React.ReactNode;
};

const { durationSeconds, storageKey } = content.offer;
const COOKIE_SUFFIX = '-timer';

function readStoredExpiry(): number {
  try {
    const raw = globalThis.window?.localStorage?.getItem(storageKey);
    if (raw) {
      const d = JSON.parse(raw) as Record<string, unknown>;
      const exp = d?.expiry;
      if (typeof exp === 'number' && Number.isFinite(exp) && exp > 0) return exp;
    }
  } catch { /* noop */ }
  try {
    const name = storageKey + COOKIE_SUFFIX;
    const prefix = name + '=';
    const c = globalThis.document?.cookie
      .split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith(prefix));
    if (c) {
      const d = JSON.parse(decodeURIComponent(c.slice(prefix.length))) as Record<string, unknown>;
      const exp = d?.expiry;
      if (typeof exp === 'number' && Number.isFinite(exp) && exp > 0) return exp;
    }
  } catch { /* noop */ }
  return 0;
}

function persistExpiry(expiry: number): void {
  // Same {expiry, cycleStart} shape that the plain-JS countdown script reads
  const payload = JSON.stringify({ expiry, cycleStart: expiry - durationSeconds * 1000 });
  try { globalThis.window?.localStorage?.setItem(storageKey, payload); } catch { /* noop */ }
  try {
    const name = storageKey + COOKIE_SUFFIX;
    const secure = globalThis.location?.protocol === 'https:' ? '; secure' : '';
    if (globalThis.document) {
      globalThis.document.cookie = `${name}=${encodeURIComponent(payload)}; path=/; max-age=31536000; samesite=lax${secure}`;
    }
  } catch { /* noop */ }
}

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
    // Runs once on mount (and on pageshow bfcache restore).
    // Uses setTimeout — NOT setInterval — so PriceProvider never re-renders per-second.
    function checkAndSchedule(): ReturnType<typeof setTimeout> | null {
      const now = Date.now();
      let expiry = readStoredExpiry();

      if (expiry <= 0) {
        expiry = now + durationSeconds * 1000;
        persistExpiry(expiry);
      }

      if (expiry <= now) {
        setIsExpired(true);
        setReady(true);
        return null;
      }

      setReady(true);
      return setTimeout(() => setIsExpired(true), expiry - now);
    }

    let tid = checkAndSchedule();

    const handlePageShow = (e: PageTransitionEvent): void => {
      if (e.persisted) {
        if (tid !== null) clearTimeout(tid);
        tid = checkAndSchedule();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      if (tid !== null) clearTimeout(tid);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  const value = useMemo<PriceContextValue>(
    () => ({
      currentPrice: isExpired ? content.offer.expiredPrice : content.offer.salePrice,
      currentUrl: isExpired ? content.offer.expiredUrl : content.offer.saleUrl,
      isExpired,
      ready,
    }),
    [isExpired, ready],
  );
  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
}

export { PriceProvider };

export function usePrice(): PriceContextValue {
  const contextValue = useContext(PriceContext);

  if (!contextValue) {
    throw new Error('usePrice must be used within PriceProvider');
  }

  return contextValue;
}
