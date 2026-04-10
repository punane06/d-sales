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
const CYCLE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// NOTE: This signing is best-effort tamper detection only.
function signPayload(expiry: number, cycleStart: number, storageKey: string): string {
  const raw = `${expiry}:${cycleStart}:${storageKey}:${SIGNING_SALT}`;
  let hash = 5381;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash * 33) ^ (raw.codePointAt(i) ?? 0);
  }
  return (hash >>> 0).toString(16);
}

function toPayload(expiry: number, cycleStart: number, storageKey: string): TimerPayload {
  return {
    expiry,
    cycleStart,
    signature: signPayload(expiry, cycleStart, storageKey),
  };
}

function isValidPayload(
  payload: TimerPayload | null,
  storageKey: string
): payload is TimerPayload {
  if (!payload) return false;
  const { expiry, cycleStart, signature } = payload;
  if (typeof expiry !== 'number' || !Number.isFinite(expiry) || expiry <= 0) return false;
  if (typeof cycleStart !== 'number' || !Number.isFinite(cycleStart) || cycleStart <= 0) return false;
  if (typeof signature !== 'string') return false;
  return signature === signPayload(expiry, cycleStart, storageKey);
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string): void {
  const secureAttr = globalThis.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax${secureAttr}`;
}

function parsePayload(value: string | null): TimerPayload | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return null;
    const expiry = Reflect.get(parsed, 'expiry');
    const cycleStart = Reflect.get(parsed, 'cycleStart');
    const signature = Reflect.get(parsed, 'signature');
    if (
      typeof expiry !== 'number' ||
      typeof cycleStart !== 'number' ||
      typeof signature !== 'string'
    ) {
      return null;
    }
    return { expiry, cycleStart, signature };
  } catch {
    return null;
  }
}

function persistPayload(payload: TimerPayload, storageKey: string): void {
  const serialized = JSON.stringify(payload);
  try {
    globalThis.window.localStorage.setItem(storageKey, serialized);
  } catch {
    // noop — privacy mode or storage full
  }
  try {
    writeCookie(`${storageKey}${COOKIE_SUFFIX}`, serialized);
  } catch {
    // noop
  }
}

function resolveExpiry(
  durationSeconds: number,
  storageKey: string,
  now: number
): { expiry: number; cycleStart: number } {
  if (globalThis.window === undefined) {
    return { expiry: now + durationSeconds * 1000, cycleStart: now };
  }

  let localPayload: TimerPayload | null = null;
  let cookiePayload: TimerPayload | null = null;

  try {
    localPayload = parsePayload(
      globalThis.window.localStorage.getItem(storageKey)
    );
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

  let bestPayload: TimerPayload | null = null;

  if (hasValidLocal && hasValidCookie && localPayload && cookiePayload) {
    // Pick the one with the earlier cycleStart (more conservative)
    bestPayload =
      localPayload.cycleStart <= cookiePayload.cycleStart
        ? localPayload
        : cookiePayload;
  } else if (hasValidLocal && localPayload) {
    bestPayload = localPayload;
  } else if (hasValidCookie && cookiePayload) {
    bestPayload = cookiePayload;
  }

  if (bestPayload) {
    // EVERGREEN LOGIC: has 24h cycle passed?
    if (now - bestPayload.cycleStart >= CYCLE_DURATION_MS) {
      // Cycle is over → start again
      return { expiry: now + durationSeconds * 1000, cycleStart: now };
    }
    // Cycle is active → use stored values
    return { expiry: bestPayload.expiry, cycleStart: bestPayload.cycleStart };
  }

  // First visit — create new cycle
  return { expiry: now + durationSeconds * 1000, cycleStart: now };
}

// Returns: [secondsLeft, isExpired, ready]
export function useCountdownTimer(
  durationSeconds: number,
  storageKey: string,
): [number, boolean, boolean] {
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const win = globalThis.window;
    if (!win) return;

    const now = Date.now();
    const { expiry, cycleStart } = resolveExpiry(durationSeconds, storageKey, now);

    // Save resolved state immediately
    persistPayload(toPayload(expiry, cycleStart, storageKey), storageKey);

    const updateRemaining = (): number => {
      const nowMs = Date.now();
      const seconds = Math.max(0, Math.floor((expiry - nowMs) / 1000));
      setTimeLeft((prev) => (prev === seconds ? prev : seconds));
      return seconds;
    };

    updateRemaining();
    Promise.resolve().then(() => setReady(true));

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

    // If user returns after 24h → reload → gets a new timer
    const checkCycleAndResume = (): void => {
      if (Date.now() - cycleStart >= CYCLE_DURATION_MS) {
        // 24h has passed: remove old storage and reload page
        try { win.localStorage.removeItem(storageKey); } catch { /* noop */ }
        win.location.reload();
        return;
      }
      const remaining = tick();
      if (intervalId === null && remaining > 0) {
        intervalId = win.setInterval(tick, 1000);
      }
    };

    const handleVisibility = (): void => {
      if (document.visibilityState === 'visible') {
        checkCycleAndResume();
      }
    };

    const handleFocus = (): void => {
      checkCycleAndResume();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    win.addEventListener('focus', handleFocus);
    win.addEventListener('pageshow', handleFocus);

    return () => {
      if (intervalId !== null) win.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      win.removeEventListener('focus', handleFocus);
      win.removeEventListener('pageshow', handleFocus);
    };
  }, [durationSeconds, storageKey]);

  return [timeLeft, timeLeft <= 0, ready];
}
