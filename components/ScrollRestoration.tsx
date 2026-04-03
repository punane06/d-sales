'use client';

import { useEffect } from 'react';

export default function ScrollRestoration(): null {
  useEffect(() => {
    // Restore scroll position from sessionStorage on page load
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      // Use requestAnimationFrame to ensure DOM is fully ready
      requestAnimationFrame(() => {
        window.scrollTo(0, Number.parseInt(savedScrollPosition, 10));
      });
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  useEffect(() => {
    // Save scroll position to sessionStorage when user scrolls
    const handleScroll = (): void => {
      sessionStorage.setItem('scrollPosition', String(window.scrollY));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
