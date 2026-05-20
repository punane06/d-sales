declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, unknown>;

const META_EVENT_MAP: Record<string, string> = {
  cta_click: 'InitiateCheckout',
  timer_expired: 'CustomEvent',
  scroll_milestone: 'CustomEvent',
  faq_opened: 'CustomEvent',
};

export function trackEvent(eventName: string, params?: EventParams): void {
  if (globalThis.window === undefined) return;

  // GA4
  try {
    if (typeof globalThis.window.gtag === 'function') {
      globalThis.window.gtag('event', eventName, params);
    }
  } catch { /* noop */ }

  // Meta Pixel
  try {
    if (typeof globalThis.window.fbq === 'function') {
      const mapped = META_EVENT_MAP[eventName];
      if (mapped === 'CustomEvent') {
        globalThis.window.fbq('trackCustom', eventName, params || {});
      } else if (mapped) {
        globalThis.window.fbq('track', mapped, params || {});
      } else {
        globalThis.window.fbq('trackCustom', eventName, params || {});
      }
    }
  } catch { /* noop */ }
}
