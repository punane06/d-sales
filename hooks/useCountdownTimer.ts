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
    return JSON.parse(value) as TimerPayload;
  } catch {
    return null;
  }
}

function persistPayload(payload: TimerPayload, storageKey: string): void {
  const serialized = JSON.stringify(payload);
  globalThis.window.localStorage.setItem(storageKey, serialized);
  writeCookie(`${storageKey}${COOKIE_SUFFIX}`, serialized);
}

// Returns [timeLeftSeconds, isExpired]
export function useCountdownTimer(
  durationSeconds: number,
  storageKey: string,
): [number, boolean] {
  // Keep the initial render deterministic to avoid hydration text mismatch.
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);

  useEffect(() => {
    const win = globalThis.window;
    if (!win) {
      return;
    }

    const localPayload = parsePayload(win.localStorage.getItem(storageKey));
    const cookiePayload = parsePayload(readCookie(`${storageKey}${COOKIE_SUFFIX}`));
    const now = Date.now();

    const hasValidLocal = isValidPayload(localPayload, storageKey);
    const hasValidCookie = isValidPayload(cookiePayload, storageKey);

    let trustedExpiry: number;

    if (hasValidLocal && hasValidCookie) {
      // Keep the earlier expiry to avoid extending the offer window by editing one store.
      trustedExpiry = Math.min(localPayload.expiry, cookiePayload.expiry);
    } else if (hasValidLocal) {
      trustedExpiry = localPayload.expiry;
    } else if (hasValidCookie) {
      trustedExpiry = cookiePayload.expiry;
    } else {
      trustedExpiry = now + durationSeconds * 1000;
    }

    persistPayload(toPayload(trustedExpiry, storageKey), storageKey);

    const updateRemaining = (): number => {
      const seconds = Math.max(0, Math.floor((trustedExpiry - Date.now()) / 1000));
      setTimeLeft(seconds);
      return seconds;
    };

    updateRemaining();

    const intervalId = win.setInterval(() => {
      const remaining = updateRemaining();
      if (remaining <= 0) {
        win.clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      win.clearInterval(intervalId);
    };
  }, [durationSeconds, storageKey]);

  return [timeLeft, timeLeft <= 0];
}
