'use client';

import { useEffect, useState } from 'react';

function getInitialRemaining(durationSeconds: number, storageKey: string): number {
  if (typeof window === 'undefined') {
    return durationSeconds;
  }

  const savedExpiry = window.localStorage.getItem(storageKey);
  const now = Date.now();

  if (!savedExpiry) {
    const expiry = now + durationSeconds * 1000;
    window.localStorage.setItem(storageKey, String(expiry));
    return durationSeconds;
  }

  const expiry = Number(savedExpiry);
  if (Number.isNaN(expiry)) {
    const fallbackExpiry = now + durationSeconds * 1000;
    window.localStorage.setItem(storageKey, String(fallbackExpiry));
    return durationSeconds;
  }

  const remaining = Math.floor((expiry - now) / 1000);
  return Math.max(0, remaining);
}

// Returns [timeLeftSeconds, isExpired]
export function useCountdownTimer(
  durationSeconds: number,
  storageKey: string,
): [number, boolean] {
  const [timeLeft, setTimeLeft] = useState<number>(() =>
    getInitialRemaining(durationSeconds, storageKey),
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedExpiry = window.localStorage.getItem(storageKey);
    const now = Date.now();

    if (!savedExpiry) {
      const expiry = now + durationSeconds * 1000;
      window.localStorage.setItem(storageKey, String(expiry));
      setTimeLeft(durationSeconds);
      return;
    }

    const expiry = Number(savedExpiry);
    if (Number.isNaN(expiry)) {
      const fallbackExpiry = now + durationSeconds * 1000;
      window.localStorage.setItem(storageKey, String(fallbackExpiry));
      setTimeLeft(durationSeconds);
      return;
    }

    const updateRemaining = (): void => {
      const seconds = Math.floor((expiry - Date.now()) / 1000);
      setTimeLeft(Math.max(0, seconds));
    };

    updateRemaining();

    const intervalId = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 0) {
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [durationSeconds, storageKey]);

  return [timeLeft, timeLeft <= 0];
}
