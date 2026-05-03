/* Evergreen timer logic with cycleStart and 24h reset */
'use client';

import { useEffect, useState } from 'react';

interface TimerPayload {
  expiry: number;
  cycleStart: number;
  signature: string;
}

const COOKIE_SUFFIX = '-timer';
const SIGNING_SALT = 'el-plate-seguro-timer-v3';
const CYCLE_DURATION_MS = 24 * 60 * 60 * 1000;

function signPayload(expiry: number, cycleStart: number, storageKey: string): string {
  const raw = `${expiry}:${cycleStart}:${storageKey}:${SIGNING_SALT}`;
  let hash = 5381;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash * 33) ^ (raw.codePointAt(i) ?? 0);
  }
  return (hash >>> 0).toString(16);
}

function toPayload(expiry: number, cycleStart: number, storageKey: string): TimerPayload {
  return { expiry, cycleStart, signature: signPayload(expiry, cycleStart, storageKey) };
}

function isValidPayload(payload: TimerPayload | null, storageKey: string): payload is TimerPayload {
  if (!payload) return false;
  const { expiry, cycleStart, signature } = payload;
  if (typeof expiry !== 'number' || !Number.isFinite(expiry) || expiry <= 0) return false;
  if (typeof cycleStart !== 'number' || !Number.isFinite(cycleStart) || cycleStart <= 0) return false;
  if (typeof signature !== 'string') return false;
  return signature === signPayload(expiry, cycleStart, storageKey);
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const match = globalThis.document?.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string): void {
  const secureAttr = globalThis.location?.protocol === 'https:' ? '; secure' : '';
  if (globalThis.document) {
    globalThis.document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax${secureAttr}`;
  }
}

function parsePayload(value: string | null): TimerPayload | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return null;
    const expiry = Reflect.get(parsed, 'expiry');
    const cycleStart = Reflect.get(parsed, 'cycleStart');
    const signature = Reflect.get(parsed, 'signature');
    if (typeof expiry !== 'number' || typeof cycleStart !== 'number' || typeof signature !== 'string') return null;
    return { expiry, cycleStart, signature };
  } catch {
    return null;
  }
}

function persistPayload(payload: TimerPayload, storageKey: string): void {
  const serialized = JSON.stringify(payload);
  try { globalThis.window.localStorage.setItem(storageKey, serialized); } catch { /* noop */ }
  try { writeCookie(`${storageKey}${COOKIE_SUFFIX}`, serialized); } catch { /* noop */ }
}

function resolveExpiry(
  durationSeconds: number,
  storageKey: string,
  now: number,
): { expiry: number; cycleStart: number } {
  if (globalThis.window === undefined) {
    return { expiry: now + durationSeconds * 1000, cycleStart: now };
  }

  let localPayload: TimerPayload | null = null;
  let cookiePayload: TimerPayload | null = null;

  try { localPayload = parsePayload(globalThis.window.localStorage.getItem(storageKey)); } catch { /* noop */ }
  try { cookiePayload = parsePayload(readCookie(`${storageKey}${COOKIE_SUFFIX}`)); } catch { /* noop */ }

  const hasValidLocal = isValidPayload(localPayload, storageKey);
  const hasValidCookie = isValidPayload(cookiePayload, storageKey);

  let bestPayload: TimerPayload | null = null;
  if (hasValidLocal && hasValidCookie && localPayload && cookiePayload) {
    bestPayload = localPayload.cycleStart <= cookiePayload.cycleStart ? localPayload : cookiePayload;
  } else if (hasValidLocal && localPayload) {
    bestPayload = localPayload;
  } else if (hasValidCookie && cookiePayload) {
    bestPayload = cookiePayload;
  }

  if (bestPayload) {
    if (now - bestPayload.cycleStart >= CYCLE_DURATION_MS) {
      return { expiry: now + durationSeconds * 1000, cycleStart: now };
    }
    return { expiry: bestPayload.expiry, cycleStart: bestPayload.cycleStart };
  }

  return { expiry: now + durationSeconds * 1000, cycleStart: now };
}

// Returns: [secondsLeft, isExpired, ready]
export function useCountdownTimer(
  durationSeconds: number,
  storageKey: string,
): [number, boolean, boolean] {
  // Lazy initialiser: on the client read from storage immediately so the real
  // time is available on the very first render (no --:--:-- flash).
  // On the server we return durationSeconds; suppressHydrationWarning on the
  // timer spans in StickyHeader handles the server/client mismatch.
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (globalThis.window === undefined) return durationSeconds;
    const now = Date.now();
    const { expiry } = resolveExpiry(durationSeconds, storageKey, now);
    return Math.max(0, Math.floor((expiry - now) / 1000));
  });

  // ready stays false on the server so there is no hydration mismatch in
  // components like FinalCtaSection that still gate on it.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const win = globalThis.window;
    if (!win) return;

    const now = Date.now();
    const { expiry, cycleStart } = resolveExpiry(durationSeconds, storageKey, now);

    // Persist so the next page load can read the same expiry.
    persistPayload(toPayload(expiry, cycleStart, storageKey), storageKey);

    const getRemaining = (): number =>
      Math.max(0, Math.floor((expiry - Date.now()) / 1000));

    // Sync timeLeft to the persisted expiry and mark ready.
    setTimeLeft(getRemaining());
    setReady(true);

    let intervalId: number | null = win.setInterval(() => {
      const remaining = getRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0 && intervalId !== null) {
        win.clearInterval(intervalId);
        intervalId = null;
      }
    }, 1000);

    const checkCycleAndResume = (): void => {
      if (Date.now() - cycleStart >= CYCLE_DURATION_MS) {
        try { win.localStorage.removeItem(storageKey); } catch { /* noop */ }
        win.location.reload();
        return;
      }
      setReady(true);
      setTimeLeft(getRemaining());
      if (intervalId === null && getRemaining() > 0) {
        intervalId = win.setInterval(() => {
          const remaining = getRemaining();
          setTimeLeft(remaining);
          if (remaining <= 0 && intervalId !== null) {
            win.clearInterval(intervalId);
            intervalId = null;
          }
        }, 1000);
      }
    };

    const handleVisibility = (): void => {
      if (globalThis.document?.visibilityState === 'visible') checkCycleAndResume();
    };

    const handlePageShow = (_event: PageTransitionEvent): void => {
      // bfcache restore — let the page resume naturally; StickyHeader's own
      // pageshow handler re-reads storage and restarts its interval.
      checkCycleAndResume();
    };

    globalThis.document?.addEventListener('visibilitychange', handleVisibility);
    win.addEventListener('pageshow', handlePageShow);

    return () => {
      if (intervalId !== null) win.clearInterval(intervalId);
      globalThis.document?.removeEventListener('visibilitychange', handleVisibility);
      win.removeEventListener('pageshow', handlePageShow);
    };
  }, [durationSeconds, storageKey]);

  return [timeLeft, ready && timeLeft <= 0, ready];
}
