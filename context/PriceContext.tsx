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
}

const PriceContext = createContext<PriceContextValue | null>(null);

interface PriceProviderProps {
  children: React.ReactNode;
}

export function PriceProvider({ children }: Readonly<PriceProviderProps>): JSX.Element {
  const [timeLeft, isExpired] = useCountdownTimer(
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
    }),
    [isExpired, timeLeft],
  );

  return <PriceContext.Provider value={value}>{children}</PriceContext.Provider>;
}

export function usePrice(): PriceContextValue {
  const contextValue = useContext(PriceContext);

  if (!contextValue) {
    throw new Error('usePrice must be used within PriceProvider');
  }

  return contextValue;
}

export type { PriceContextValue };
