
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
  readonly initialIsExpired?: boolean;
};

const { storageKey } = content.offer;
const COOKIE_SUFFIX = '-timer';

const CYCLE_MS = 24 * 60 * 60 * 1000;

function readStoredExpiry(): { expiry: number; cycleStart: number } {
  const now = Date.now();
  try {
    const raw = globalThis.window?.localStorage?.getItem(storageKey);
    if (raw) {
      const d = JSON.parse(raw) as Record<string, unknown>;
      const exp = d?.expiry;
      const cs = d?.cycleStart;
      if (
        typeof exp === 'number' && Number.isFinite(exp) && exp > 0 &&
        typeof cs === 'number' && Number.isFinite(cs) && cs > 0
      ) {
        if (now - cs >= CYCLE_MS) return { expiry: 0, cycleStart: 0 };
        return { expiry: exp, cycleStart: cs };
      }
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
      const cs = d?.cycleStart;
      if (
        typeof exp === 'number' && Number.isFinite(exp) && exp > 0 &&
        typeof cs === 'number' && Number.isFinite(cs) && cs > 0
      ) {
        if (now - cs >= CYCLE_MS) return { expiry: 0, cycleStart: 0 };
        return { expiry: exp, cycleStart: cs };
      }
    }
  } catch { /* noop */ }
  return { expiry: 0, cycleStart: 0 };
}

function PriceProvider({ children, initialIsExpired = false }: PriceProviderProps): JSX.Element {
  const [isExpired, setIsExpired] = useState(initialIsExpired);
  const [ready, setReady] = useState(false);
  const didTrackExpiry = useRef(false);

  useEffect(() => {
    if (isExpired && !didTrackExpiry.current) {
      trackEvent('timer_expired', { timer_expired: true });
      didTrackExpiry.current = true;
    }
  }, [isExpired]);

  useEffect(() => {
    // Reads stored expiry from localStorage/cookie and syncs React state.
    // Does NOT write to storage — the plain-JS countdown script (layout.tsx)
    // is the sole authority on creating and persisting the initial expiry.
    function syncFromStorage(): ReturnType<typeof setTimeout> | null {
      const { expiry } = readStoredExpiry();

      if (expiry <= 0) {
        // No stored data yet (script hasn't written it, or storage unavailable).
        // Mark ready with the default non-expired state and wait.
        setReady(true);
        return null;
      }

      if (expiry <= Date.now()) {
        setIsExpired(true);
        setReady(true);
        return null;
      }

      setReady(true);
      return setTimeout(() => setIsExpired(true), expiry - Date.now());
    }

    let tid = syncFromStorage();

    // Re-sync on every pageshow (covers both BFCache restores and fresh loads
    // triggered by pressing Back from an external site like Hotmart).
    const handlePageShow = (): void => {
      if (tid !== null) clearTimeout(tid);
      tid = syncFromStorage();
    };

    // Re-sync when the tab becomes visible again (e.g. user opened Hotmart in
    // a new tab and switched back — pageshow does not fire in this case).
    const handleVisibilityChange = (): void => {
      if (globalThis.document?.visibilityState === 'visible') {
        if (tid !== null) clearTimeout(tid);
        tid = syncFromStorage();
      }
    };

    // When the inline script detects a 24h boundary crossing mid-session,
    // it dispatches this event. Reset expired state and start a fresh cycle.
    const handleTimerReset = (): void => {
      if (tid !== null) clearTimeout(tid);
      didTrackExpiry.current = false;
      setIsExpired(false);
      tid = syncFromStorage();
    };

    globalThis.window?.addEventListener('pageshow', handlePageShow);
    globalThis.document?.addEventListener('visibilitychange', handleVisibilityChange);
    globalThis.window?.addEventListener('eps-timer-reset', handleTimerReset);
    return () => {
      if (tid !== null) clearTimeout(tid);
      globalThis.window?.removeEventListener('pageshow', handlePageShow);
      globalThis.document?.removeEventListener('visibilitychange', handleVisibilityChange);
      globalThis.window?.removeEventListener('eps-timer-reset', handleTimerReset);
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

// Reads the stored expiry fresh from storage and returns the correct URL.
// Call this inside click handlers and on mount — never rely on React state
// alone, since the setTimeout in PriceProvider can lag behind the plain-JS
// countdown when the page is restored from BFCache or after tab-switching.
export function resolveCurrentUrl(): string {
  const { expiry } = readStoredExpiry();
  const expired = expiry > 0 && expiry <= Date.now();
  return expired ? content.offer.expiredUrl : content.offer.saleUrl;
}
