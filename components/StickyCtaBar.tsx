'use client';

import { useEffect, useState } from 'react';
import CtaButton from '@/components/CtaButton';
import { content } from '@/config/content';

export default function StickyCtaBar(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const heroSection = document.getElementById('hero-section');

    if (!heroSection) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(heroSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-x-0 bottom-0 z-40 h-16 bg-terracotta px-3 py-2 shadow-[0_-8px_24px_rgba(0,0,0,0.2)] transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex h-full max-w-md items-center">
        <CtaButton
          baseLabel={content.finalCta.ctaLabel}
          sectionName={content.analytics.sectionNames.finalCta}
          className="!w-full !min-h-0 !animate-none !py-2"
        />
      </div>
    </div>
  );
}
