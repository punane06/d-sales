// StickyHeader.client.tsx
'use client';

import { useEffect, useRef } from 'react';
// ...existing code...
import { usePrice } from '@/context/PriceContext';

function StickyHeader(): JSX.Element {
  const { timeLeft, ready } = usePrice();
  const headerRef = useRef<HTMLElement | null>(null);
  const safeTime = Math.max(0, timeLeft);
  const hours = String(Math.floor(safeTime / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((safeTime % 3600) / 60)).padStart(2, '0');
  const seconds = String(safeTime % 60).padStart(2, '0');

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;
    const updateOffset = (): void => {
      const headerHeight = headerElement.getBoundingClientRect().height;
      globalThis.document.documentElement.style.setProperty('--sticky-header-offset', `${headerHeight}px`);
    };
    updateOffset();
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => { updateOffset(); });
      resizeObserver.observe(headerElement);
    }
    globalThis.addEventListener('resize', updateOffset);
    return () => {
      resizeObserver?.disconnect();
      globalThis.removeEventListener('resize', updateOffset);
    };
  }, []);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 bg-charcoal text-white shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-1 sm:gap-2">
        {/* Top row: Clara photo + El Plato Seguro */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <img
            src="/media/clara.png"
            alt="Clara smiling"
            className="w-12 h-12 rounded-full object-cover"
            style={{ minWidth: 48, minHeight: 48 }}
          />
          <span className="mx-1 text-xl font-bold text-white select-none">|</span>
          <span className="font-semibold text-lg sm:text-xl tracking-tight">El Plato Seguro</span>
        </div>
        {/* Bottom row: Timer with prefix */}
        <div className="flex flex-col items-center justify-center">
          <span className="flex items-center gap-1 text-base sm:text-lg">
            <span className="mr-0.5">⏳</span>
            <span>Tu oferta especial termina en:</span>
            <span
              className="ml-2 flex items-center rounded-md bg-white/10 px-2 py-1 font-sans font-semibold leading-tight tabular-nums text-base sm:text-lg md:text-xl"
              role="timer"
              aria-label="Tiempo restante de la oferta"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="inline-block w-[2ch] text-center">{ready ? hours : '--'}</span>
              <span className="inline-block w-1.5 text-center">:</span>
              <span className="inline-block w-[2ch] text-center">{ready ? minutes : '--'}</span>
              <span className="inline-block w-1.5 text-center">:</span>
              <span className="inline-block w-[2ch] text-center">{ready ? seconds : '--'}</span>
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
export default StickyHeader;
