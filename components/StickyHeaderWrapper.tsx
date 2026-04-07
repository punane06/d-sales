// StickyHeaderWrapper.tsx
'use client';
import dynamic from 'next/dynamic';

const StickyHeader = dynamic(() => import('./StickyHeader.client'), { ssr: false });

export default function StickyHeaderWrapper() {
    return <StickyHeader />;
}
