'use client';

import { useEffect, useState } from 'react';

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

    const savedExpiry = win.localStorage.getItem(storageKey);
    const now = Date.now();

    let expiry = Number(savedExpiry);
    if (!savedExpiry || Number.isNaN(expiry)) {
      expiry = now + durationSeconds * 1000;
      win.localStorage.setItem(storageKey, String(expiry));
    }

    const updateRemaining = (): number => {
      const seconds = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
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
