'use client';

import { useEffect, useRef, useState } from 'react';
import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';

function StickyHeader(): JSX.Element {
  const { timeLeft, currentPrice } = usePrice();
  const headerRef = useRef<HTMLElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const safeTime = Math.max(0, timeLeft);
  const hours = String(Math.floor(safeTime / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((safeTime % 3600) / 60)).padStart(2, '0');
  const seconds = String(safeTime % 60).padStart(2, '0');
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const headerElement = headerRef.current;

    if (!headerElement) {
      return;
    }

    const updateOffset = (): void => {
      const headerHeight = headerElement.getBoundingClientRect().height;
      globalThis.document.documentElement.style.setProperty(
        '--sticky-header-offset',
        `${headerHeight}px`,
      );
    };

    updateOffset();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateOffset();
      });
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
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-2 px-4 py-2 text-center sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-3 sm:text-left">
        <div>
          <p className="label-copy font-semibold text-softred">{content.header.warning}</p>
        </div>
        {isClient && (
          <>
            <div
              className="mx-auto flex w-44 items-center justify-center rounded-md bg-white/10 px-2 py-1 font-sans text-xl font-semibold leading-tight tabular-nums sm:mx-0 sm:text-2xl md:text-3xl"
              role="timer"
              aria-label="Tiempo restante de la oferta"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="inline-block w-[2ch] text-center">{hours}</span>
              <span className="inline-block w-1.5 text-center">:</span>
              <span className="inline-block w-[2ch] text-center">{minutes}</span>
              <span className="inline-block w-1.5 text-center">:</span>
              <span className="inline-block w-[2ch] text-center">{seconds}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end">
              <p className="label-copy">
                <span className="mr-1.5 opacity-80 sm:mr-2">{content.header.currentPriceLabel}:</span>
                <strong className="font-bold text-offwhite">{currentPrice}</strong>
              </p>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
export default StickyHeader;
