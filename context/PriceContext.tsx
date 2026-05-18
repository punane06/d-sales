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

const { storageKey } = content.offer;
const COOKIE_SUFFIX = '-timer';
const CYCLE_MS = 24 * 60 * 60 * 1000;

interface StoredPayload {
  expiry: number;
  cycleStart: number;
}

function safeParse(raw: string | null): StoredPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    const exp = Number(parsed.expiry);
    const cs = Number(parsed.cycleStart);
    if (!Number.isFinite(exp) || exp <= 0) return null;
    if (!Number.isFinite(cs) || cs <= 0) return null;
    return { expiry: exp, cycleStart: cs };
  } catch {
    return null;
  }
}

function readStored(): StoredPayload | null {
  let fromLs: StoredPayload | null = null;
  let fromCk: StoredPayload | null = null;

  try {
    fromLs = safeParse(globalThis.window?.localStorage?.getItem(storageKey) ?? null);
  } catch { /* noop */ }

  try {
    const prefix = `${storageKey}${COOKIE_SUFFIX}=`;
    const c = globalThis.document?.cookie
      .split(';').map((s) => s.trim()).find((s) => s.startsWith(prefix));
    if (c) fromCk = safeParse(decodeURIComponent(c.slice(prefix.length)));
  } catch { /* noop */ }

  if (fromLs && fromCk) {
    return fromLs.cycleStart <= fromCk.cycleStart ? fromLs : fromCk;
  }
  return fromLs ?? fromCk;
}

function evaluateState(now: number): { isExpired: boolean; expiryDelayMs: number | null } {
  const p = readStored();
  if (!p) return { isExpired: false, expiryDelayMs: null };

  const age = now - p.cycleStart;
  // Beyond 24h OR clock skew — inline script will reset; treat as fresh
  if (age >= CYCLE_MS || age < 0) {
    return { isExpired: false, expiryDelayMs: null };
  }

  if (p.expiry <= now) return { isExpired: true, expiryDelayMs: null };
  return { isExpired: false, expiryDelayMs: p.expiry - now };
}

type PriceProviderProps = { readonly children: React.ReactNode };

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
    let pending: ReturnType<typeof setTimeout> | null = null;

    function sync(): void {
      if (pending !== null) {
        clearTimeout(pending);
        pending = null;
      }
      const { isExpired: nextExpired, expiryDelayMs } = evaluateState(Date.now());
      setIsExpired(nextExpired);
      setReady(true);
      if (!nextExpired && expiryDelayMs !== null && expiryDelayMs > 0) {
        pending = setTimeout(() => setIsExpired(true), expiryDelayMs);
      }
    }

    sync();

    const onPageShow = (): void => sync();
    const onVisibility = (): void => {
      if (globalThis.document?.visibilityState === 'visible') sync();
    };
    const onReset = (): void => {
      didTrackExpiry.current = false;
      sync();
    };
    const onExpired = (): void => {
      // Inline script detected expiry while we were on the page — keep React state in sync.
      sync();
    };

    globalThis.window?.addEventListener('pageshow', onPageShow);
    globalThis.document?.addEventListener('visibilitychange', onVisibility);
    globalThis.window?.addEventListener('eps-timer-reset', onReset);
    globalThis.window?.addEventListener('eps-timer-expired', onExpired);

    return () => {
      if (pending !== null) clearTimeout(pending);
      globalThis.window?.removeEventListener('pageshow', onPageShow);
      globalThis.document?.removeEventListener('visibilitychange', onVisibility);
      globalThis.window?.removeEventListener('eps-timer-reset', onReset);
      globalThis.window?.removeEventListener('eps-timer-expired', onExpired);
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

export function resolveCurrentUrl(): string {
  const { isExpired } = evaluateState(Date.now());
  return isExpired ? content.offer.expiredUrl : content.offer.saleUrl;
}
