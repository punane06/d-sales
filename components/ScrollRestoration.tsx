'use client';

import { useEffect } from 'react';

export default function ScrollRestoration(): null {
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (!savedScrollPosition) {
      return;
    }

    const targetY = Number.parseInt(savedScrollPosition, 10);

    requestAnimationFrame(() => {
      window.scrollTo(0, targetY);

      // Clear only after a real scroll event confirms the position was applied
      const clearOnScroll = (): void => {
        sessionStorage.removeItem('scrollPosition');
        window.removeEventListener('scroll', clearOnScroll);
      };
      window.addEventListener('scroll', clearOnScroll, { passive: true, once: true });
    });
  }, []);

  useEffect(() => {
    let frameId: number | null = null;
    let latestScrollY = window.scrollY;

    const saveScrollPosition = (): void => {
      sessionStorage.setItem('scrollPosition', String(latestScrollY));
    };

    // Coalesce scroll writes to at most one per animation frame
    const handleScroll = (): void => {
      latestScrollY = window.scrollY;
      if (frameId !== null) {
        return;
      }
      frameId = requestAnimationFrame(() => {
        frameId = null;
        saveScrollPosition();
      });
    };

    // Also persist on tab hide and page unload
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') {
        latestScrollY = window.scrollY;
        saveScrollPosition();
      }
    };

    const handlePageHide = (): void => {
      latestScrollY = window.scrollY;
      saveScrollPosition();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      saveScrollPosition();
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  return null;
}
