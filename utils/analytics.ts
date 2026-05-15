type EventParams = Record<string, unknown>;

// GA4 → Meta Pixel standard event mapping. Unmapped events go as trackCustom.
const META_EVENT_MAP: Record<string, string> = {
  cta_click: 'InitiateCheckout',
  timer_expired: 'CustomEvent',
  scroll_milestone: 'CustomEvent',
  faq_opened: 'CustomEvent',
};

export function trackEvent(eventName: string, params?: EventParams): void {
  if (globalThis.window === undefined) return;

  try {
    if (typeof globalThis.window.gtag === 'function') {
      globalThis.window.gtag('event', eventName, params);
    }
  } catch { /* noop */ }

  try {
    if (typeof globalThis.window.fbq === 'function') {
      const metaEventName = META_EVENT_MAP[eventName];
      if (metaEventName === 'CustomEvent') {
        globalThis.window.fbq('trackCustom', eventName, params || {});
      } else if (metaEventName) {
        globalThis.window.fbq('track', metaEventName, params || {});
      } else {
        globalThis.window.fbq('trackCustom', eventName, params || {});
      }
    }
  } catch { /* noop */ }
}
