// utils/timer.ts
// Shared timer helpers used by the React side (PriceContext, CtaButton).
// The single source of truth that DRIVES the timer is the inline script in
// `app/layout.tsx` — it ticks every second and dispatches:
//   - 'eps-timer-reset'   (a new 30-min cycle has started)
//   - 'eps-timer-expired' (the 30-min countdown just hit zero)
// React reads stored state to know the *current* status; it does not
// duplicate the ticking logic.

import { content } from '@/config/content';

export const STORAGE_KEY = content.offer.storageKey;
export const COOKIE_NAME = `${STORAGE_KEY}-timer`;
export const DURATION_MS = content.offer.durationSeconds * 1000; // 30 min
export const CYCLE_MS = 24 * 60 * 60 * 1000; // 24 h cooldown

export interface TimerPayload {
  expiry: number; // ms epoch when 30-min countdown ends
  cycleStart: number; // ms epoch when current cycle began
}

export interface TimerStatus {
  isExpired: boolean;
  // null when the timer is in cooldown OR has not started; otherwise ms
  // until the 30-min countdown reaches 0.
  expiryDelayMs: number | null;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function safeParsePayload(raw: string | null | undefined): TimerPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') return null;
    const expiry = Number(parsed.expiry);
    const cycleStart = Number(parsed.cycleStart);
    if (!isFiniteNumber(expiry) || expiry <= 0) return null;
    if (!isFiniteNumber(cycleStart) || cycleStart <= 0) return null;
    return { expiry, cycleStart };
  } catch {
    return null;
  }
}

function readFromLocalStorage(): TimerPayload | null {
  try {
    return safeParsePayload(globalThis.window?.localStorage?.getItem(STORAGE_KEY) ?? null);
  } catch {
    return null;
  }
}

function readFromCookie(): TimerPayload | null {
  try {
    const cookieString = globalThis.document?.cookie;
    if (!cookieString) return null;
    const prefix = `${COOKIE_NAME}=`;
    const found = cookieString
      .split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith(prefix));
    if (!found) return null;
    return safeParsePayload(decodeURIComponent(found.slice(prefix.length)));
  } catch {
    return null;
  }
}

/**
 * Read the stored timer payload. Tries localStorage first, falls back to
 * cookie. When both exist, prefers the earlier `cycleStart` so the running
 * cycle is preserved (never accidentally extended).
 */
export function readStoredPayload(): TimerPayload | null {
  const fromLs = readFromLocalStorage();
  const fromCk = readFromCookie();
  if (fromLs && fromCk) {
    return fromLs.cycleStart <= fromCk.cycleStart ? fromLs : fromCk;
  }
  return fromLs ?? fromCk;
}

/**
 * Evaluate the current timer status at `now`. Used by React to derive
 * `isExpired` for pricing/URL switching.
 *
 *  - No stored state, OR clock-skew (negative age) →
 *    treat as "fresh / not expired" (the inline script will start a new
 *    cycle the moment it boots).
 *  - Timer still counting down → not expired, returns ms until zero.
 *  - Timer expired AND 24h has passed since expiry → treat as fresh
 *    (the inline script will reset the cycle on next tick/load).
 *  - Timer expired, within 24h cooldown → expired.
 */
export function evaluateTimerStatus(now: number = Date.now()): TimerStatus {
  const payload = readStoredPayload();
  if (!payload) return { isExpired: false, expiryDelayMs: null };

  const age = now - payload.cycleStart;
  if (age < 0) {
    // Clock skew — treat as fresh
    return { isExpired: false, expiryDelayMs: null };
  }

  if (payload.expiry > now) {
    // Still counting down
    return { isExpired: false, expiryDelayMs: payload.expiry - now };
  }

  // Timer has expired — check if 24h cooldown since expiry has passed
  if (now - payload.expiry >= CYCLE_MS) {
    // 24h since expiry → inline script will start fresh on next load/tick
    return { isExpired: false, expiryDelayMs: null };
  }

  // Within 24h cooldown window
  return { isExpired: true, expiryDelayMs: null };
}

export function resolveCurrentUrl(): string {
  const { isExpired } = evaluateTimerStatus(Date.now());
  return isExpired ? content.offer.expiredUrl : content.offer.saleUrl;
}
