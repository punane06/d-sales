// HeroPriceLabel.client.tsx
'use client';
import { content } from '@/config/content';
import { usePrice } from '@/context/PriceContext';

export default function HeroPriceLabel() {
  const { currentPrice, ready } = usePrice();
  return (
    <span className="block text-center label-copy font-semibold text-softred">
      {content.header.currentPriceLabel}: {ready ? currentPrice : '--'}
    </span>
  );
}
