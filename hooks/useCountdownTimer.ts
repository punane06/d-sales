'use client';

import { useEffect, useState } from 'react';

interface TimerPayload {
  expiry: number;
  signature: string;
}

const COOKIE_SUFFIX = '-timer';
// NOTE: This signing is best-effort tamper detection only. A motivated user can still
// recompute the hash client-side. Server-side enforcement (e.g. HttpOnly cookie set
// by an Edge Function) would be required for true integrity guarantees.
const SIGNING_SALT = 'el-plate-seguro-timer-v1';

function signExpiry(expiry: number, storageKey: string): string {
  const raw = `${expiry}:${storageKey}:${SIGNING_SALT}`;
  let hash = 5381;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 33) ^ (raw.codePointAt(index) ?? 0);
  }
  return (hash >>> 0).toString(16);
}

function toPayload(expiry: number, storageKey: string): TimerPayload {
  return {
    expiry,
    signature: signExpiry(expiry, storageKey),
  };
}

function isValidPayload(payload: TimerPayload | null, storageKey: string): payload is TimerPayload {
  if (!payload) {
    return false;
  }

  if (typeof payload !== 'object') {
    return false;
  }

  const { expiry, signature } = payload;

  if (typeof expiry !== 'number' || !Number.isFinite(expiry) || expiry <= 0) {
    return false;
  }

  if (typeof signature !== 'string') {
    return false;
  }

  return signature === signExpiry(expiry, storageKey);
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const match = document.cookie
    .split(';')
    .map((cookiePart) => cookiePart.trim())
    .find((cookiePart) => cookiePart.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string): void {
  const secureAttribute = globalThis.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax${secureAttribute}`;
}

function parsePayload(value: string | null): TimerPayload | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const expiry = Reflect.get(parsed, 'expiry');
    const signature = Reflect.get(parsed, 'signature');

    if (typeof expiry !== 'number' || typeof signature !== 'string') {
      return null;
    }

    return { expiry, signature };
  } catch {
    return null;
  }
}

function persistPayload(payload: TimerPayload, storageKey: string): void {
  const serialized = JSON.stringify(payload);

  // Storage can throw on privacy-restricted browsers; keep timer running in-memory.
  try {
    globalThis.window.localStorage.setItem(storageKey, serialized);
  } catch {
    // noop
  }

  try {
    writeCookie(`${storageKey}${COOKIE_SUFFIX}`, serialized);
  } catch {
    // noop
  }
}

function resolveTrustedExpiry(durationSeconds: number, storageKey: string, now: number): number {
  if (globalThis.window === undefined) {
    return now + durationSeconds * 1000;
  }

  let localPayload: TimerPayload | null = null;
  let cookiePayload: TimerPayload | null = null;

  try {
    localPayload = parsePayload(globalThis.window.localStorage.getItem(storageKey));
  } catch {
    localPayload = null;
  }

  try {
    cookiePayload = parsePayload(readCookie(`${storageKey}${COOKIE_SUFFIX}`));
  } catch {
    cookiePayload = null;
  }

  const hasValidLocal = isValidPayload(localPayload, storageKey);
  const hasValidCookie = isValidPayload(cookiePayload, storageKey);

  if (hasValidLocal && hasValidCookie && localPayload && cookiePayload) {
    // Keep the earlier expiry to avoid extending the offer window by editing one store.
    return Math.min(localPayload.expiry, cookiePayload.expiry);
  }

  if (hasValidLocal && localPayload) {
    return localPayload.expiry;
  }

  if (hasValidCookie && cookiePayload) {
    return cookiePayload.expiry;
  }

  return now + durationSeconds * 1000;
}

// Returns [timeLeftSeconds, isExpired]
export function useCountdownTimer(
  durationSeconds: number,
  storageKey: string,
): [number, boolean] {
  // Keep first render deterministic to match server HTML and avoid hydration mismatch.
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);

  useEffect(() => {
    const win = globalThis.window;
    if (!win) {
      return;
    }

    const now = Date.now();
    const trustedExpiry = resolveTrustedExpiry(durationSeconds, storageKey, now);

    persistPayload(toPayload(trustedExpiry, storageKey), storageKey);

    const updateRemaining = (): number => {
      const seconds = Math.max(0, Math.floor((trustedExpiry - Date.now()) / 1000));
      setTimeLeft((previous) => (previous === seconds ? previous : seconds));
      return seconds;
    };

    updateRemaining();

    const tick = (): number => {
      const remaining = updateRemaining();
      if (remaining <= 0) {
        if (intervalId !== null) {
          win.clearInterval(intervalId);
          intervalId = null;
        }
      }
      return remaining;
    };

    let intervalId: number | null = win.setInterval(tick, 1000);
    let rafId: number | null = null;

    const startRafLoop = (): void => {
      if (typeof win.requestAnimationFrame !== 'function' || rafId !== null) {
        return;
      }

      let lastUpdateAt = 0;

      const frame = (timestamp: number): void => {
        if (lastUpdateAt === 0 || timestamp - lastUpdateAt >= 1000) {
          const remaining = tick();
          lastUpdateAt = timestamp;

          if (remaining <= 0) {
            if (rafId !== null) {
              win.cancelAnimationFrame(rafId);
              rafId = null;
            }
            return;
          }
        }

        rafId = win.requestAnimationFrame(frame);
      };

      rafId = win.requestAnimationFrame(frame);
    };

    const stopRafLoop = (): void => {
      if (rafId !== null) {
        win.cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    startRafLoop();

    const handleVisibility = (): void => {
      if (document.visibilityState === 'visible') {
        const remaining = tick();
        if (intervalId === null && remaining > 0) {
          intervalId = win.setInterval(tick, 1000);
        }
        if (remaining > 0) {
          startRafLoop();
        }
      }
    };

    const handleFocus = (): void => {
      const remaining = tick();
      if (intervalId === null && remaining > 0) {
        intervalId = win.setInterval(tick, 1000);
      }
      if (remaining > 0) {
        startRafLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    win.addEventListener('focus', handleFocus);
    win.addEventListener('pageshow', handleFocus);

    return () => {
      if (intervalId !== null) {
        win.clearInterval(intervalId);
      }
      stopRafLoop();
      document.removeEventListener('visibilitychange', handleVisibility);
      win.removeEventListener('focus', handleFocus);
      win.removeEventListener('pageshow', handleFocus);
    };
  }, [durationSeconds, storageKey]);

  return [timeLeft, timeLeft <= 0];
}
