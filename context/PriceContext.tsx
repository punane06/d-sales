

'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { content } from '@/config/content';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { trackEvent } from '@/utils/analytics';

interface PriceContextValue {
  currentPrice: string;
  currentUrl: string;
  isExpired: boolean;
  timeLeft: number;
  ready: boolean;
}

const PriceContext = createContext<PriceContextValue | null>(null);

type PriceProviderProps = {
  readonly children: React.ReactNode;
};

function PriceProvider({ children }: PriceProviderProps): JSX.Element {
  // Auto-refresh if Hotmart return param is present to sync timer/price state
  // Refresh if Hotmart marker is present when tab becomes visible again
  useEffect(() => {
    const handleVisibility = () => {
      if (
        document.visibilityState === 'visible' &&
        globalThis.window.localStorage.getItem('awaitingHotmartReturn') === 'true'
      ) {
        globalThis.window.localStorage.removeItem('awaitingHotmartReturn');
        globalThis.window.location.reload();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const [timeLeft, isExpired, ready] = useCountdownTimer(
    content.offer.durationSeconds,
    content.offer.storageKey,
  );
  const didTrackExpiry = useRef(false);

  useEffect(() => {
    if (isExpired && !didTrackExpiry.current) {
      trackEvent('timer_expired', { timer_expired: true });
      didTrackExpiry.current = true;
    }
  }, [isExpired]);

  const value = useMemo<PriceContextValue>(
    () => ({
      currentPrice: isExpired ? content.offer.expiredPrice : content.offer.salePrice,
      currentUrl: isExpired ? content.offer.expiredUrl : content.offer.saleUrl,
      isExpired,
      timeLeft,
      ready,
    }),
    [isExpired, timeLeft, ready],
  );
  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
}

export { PriceProvider };

export function usePrice(): PriceContextValue {
  const contextValue = useContext(PriceContext);

  if (!contextValue) {
    throw new Error('usePrice must be used within PriceProvider');
  }

  return contextValue;
}
