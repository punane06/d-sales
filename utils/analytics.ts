declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (globalThis.window !== undefined && typeof globalThis.window.gtag === 'function') {
    globalThis.window.gtag('event', eventName, params);
  }
}

export function trackMetaPageView(): void {
  if (globalThis.window !== undefined && typeof globalThis.window.fbq === 'function') {
    globalThis.window.fbq('track', 'PageView');
  }
}

export function trackMetaInitiateCheckout(params?: Record<string, unknown>): void {
  if (globalThis.window !== undefined && typeof globalThis.window.fbq === 'function') {
    globalThis.window.fbq('track', 'InitiateCheckout', params);
  }
}
