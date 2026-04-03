declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof globalThis.window !== 'undefined' && typeof globalThis.window.gtag === 'function') {
    globalThis.window.gtag('event', eventName, params);
  }
}
