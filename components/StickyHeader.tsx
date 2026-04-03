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
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm font-semibold text-softred md:text-base">{content.header.warning}</p>
        <div className="flex w-[10.5rem] items-center justify-center rounded-md bg-white/10 px-2 py-1 font-sans text-xl font-semibold leading-none tabular-nums md:text-2xl">
          <span className="inline-block w-[2ch] text-center">{isMounted ? hours : '00'}</span>
          <span className="inline-block w-1.5 text-center">:</span>
          <span className="inline-block w-[2ch] text-center">{isMounted ? minutes : '00'}</span>
          <span className="inline-block w-1.5 text-center">:</span>
          <span className="inline-block w-[2ch] text-center">{isMounted ? seconds : '00'}</span>
        </div>
        <p className="text-sm md:text-base">
          <span className="mr-2 opacity-80">{content.header.currentPriceLabel}:</span>
          <strong className="font-semibold text-offwhite">{currentPrice} USD</strong>
        </p>
      </div>
    </header>
  );
}
