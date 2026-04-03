'use client';

import { useEffect, useState } from 'react';
import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';

export default function StickyHeader(): JSX.Element {
  const { timeLeft, currentPrice } = usePrice();
  const [isMounted, setIsMounted] = useState(false);
  const safeTime = Math.max(0, timeLeft);
  const hours = String(Math.floor(safeTime / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((safeTime % 3600) / 60)).padStart(2, '0');
  const seconds = String(safeTime % 60).padStart(2, '0');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-charcoal text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-2 text-center sm:flex-row sm:justify-between sm:gap-3 sm:py-3 sm:text-left">
        <p className="text-sm font-semibold text-softred sm:text-base md:text-lg">{content.header.warning}</p>
        <div className="flex w-44 items-center justify-center rounded-md bg-white/10 px-2 py-1 font-sans text-xl font-semibold leading-tight tabular-nums sm:text-2xl md:text-3xl" aria-live="polite" aria-label="Countdown timer">
          <span className="inline-block w-[2ch] text-center">{isMounted ? hours : '00'}</span>
          <span className="inline-block w-1.5 text-center">:</span>
          <span className="inline-block w-[2ch] text-center">{isMounted ? minutes : '00'}</span>
          <span className="inline-block w-1.5 text-center">:</span>
          <span className="inline-block w-[2ch] text-center">{isMounted ? seconds : '00'}</span>
        </div>
        <p className="text-sm font-medium sm:text-base md:text-lg" aria-label="Current price">
          <span className="mr-1.5 opacity-80 sm:mr-2">{content.header.currentPriceLabel}:</span>
          <strong className="font-bold text-offwhite">{currentPrice} USD</strong>
        </p>
      </div>
    </header>
  );
}
