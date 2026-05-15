// StickyHeader.client.tsx
'use client';

import { useEffect, useRef } from 'react';
import { content } from '@/config/content';

const { durationSeconds } = content.offer;

// Initial server-render values — the plain-JS countdown script (layout.tsx)
// takes over immediately after the page becomes interactive.
const initH = String(Math.floor(durationSeconds / 3600)).padStart(2, '0');
const initM = String(Math.floor((durationSeconds % 3600) / 60)).padStart(2, '0');
const initS = String(durationSeconds % 60).padStart(2, '0');

function StickyHeader(): JSX.Element {
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const updateOffset = (): void => {
      globalThis.document.documentElement.style.setProperty(
        '--sticky-header-offset',
        `${el.getBoundingClientRect().height}px`,
      );
    };
    updateOffset();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateOffset);
      ro.observe(el);
    }
    globalThis.addEventListener('resize', updateOffset);
    return () => {
      ro?.disconnect();
      globalThis.removeEventListener('resize', updateOffset);
    };
  }, []);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 bg-charcoal text-white shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-2 flex flex-col gap-1 sm:gap-2">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/clara.png"
            alt="Clara smiling"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
            style={{ minWidth: 48, minHeight: 48 }}
          />
          <span className="mx-1 text-xl font-bold text-white select-none">|</span>
          <span className="font-semibold text-2xl sm:text-3xl tracking-tight">El Plato Seguro</span>
        </div>
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
              <span id="t-h" suppressHydrationWarning className="inline-block w-[2ch] text-center">{initH}</span>
              <span className="inline-block w-1.5 text-center">:</span>
              <span id="t-m" suppressHydrationWarning className="inline-block w-[2ch] text-center">{initM}</span>
              <span className="inline-block w-1.5 text-center">:</span>
              <span id="t-s" suppressHydrationWarning className="inline-block w-[2ch] text-center">{initS}</span>
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
export default StickyHeader;
