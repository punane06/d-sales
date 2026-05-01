
'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { content } from '@/config/content';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { trackEvent } from '@/utils/analytics';

interface PriceContextValue {
  currentPrice: string;
  currentUrl: string;
  isExpired: boolean;
  ready: boolean;
}

const PriceContext = createContext<PriceContextValue | null>(null);

type PriceProviderProps = {
  readonly children: React.ReactNode;
};

function PriceProvider({ children }: PriceProviderProps): JSX.Element {
  // timeLeft is intentionally not exposed through context — components that need
  // a live countdown read directly from localStorage via their own useEffect so
  // the display is immune to React scheduler stalls caused by hydration errors.
  const [, isExpired, ready] = useCountdownTimer(
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
      ready,
    }),
    [isExpired, ready],
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
