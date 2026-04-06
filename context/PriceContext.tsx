'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { content } from '@/config/content';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { trackEvent } from '@/utils/analytics';

interface PriceContextValue {
  currentPrice: string;
  currentUrl: string;
  isExpired: boolean;
  timeLeft: number;
  isMounted: boolean;
}

const PriceContext = createContext<PriceContextValue | null>(null);

interface PriceProviderProps {
  children: React.ReactNode;
}

function PriceProvider({ children }: Readonly<PriceProviderProps>): JSX.Element {
  const [timeLeft, isExpired] = useCountdownTimer(
    content.offer.durationSeconds,
    content.offer.storageKey,
  );
  const [isMounted, setIsMounted] = useState(false);
  const didTrackExpiry = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      isMounted,
    }),
    [isExpired, timeLeft, isMounted],
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

export type { PriceContextValue };
