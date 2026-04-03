'use client';

import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';
import { formatTime } from '@/utils/formatTime';

export default function StickyHeader(): JSX.Element {
  const { timeLeft, currentPrice } = usePrice();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-charcoal text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm font-semibold text-softred md:text-base">{content.header.warning}</p>
        <p className="rounded-md bg-white/10 px-3 py-1 font-heading text-xl leading-none tracking-wide md:text-2xl">
          {formatTime(timeLeft)}
        </p>
        <p className="text-sm md:text-base">
          <span className="mr-2 opacity-80">{content.header.currentPriceLabel}:</span>
          <strong className="font-semibold text-offwhite">{currentPrice} USD</strong>
        </p>
      </div>
    </header>
  );
}
