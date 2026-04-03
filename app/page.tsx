'use client';

import { useEffect, useRef } from 'react';
import StickyHeader from '@/components/StickyHeader';
import HeroSection from '@/components/HeroSection';
import EmpathySection from '@/components/EmpathySection';
import ValueStackSection from '@/components/ValueStackSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import GuaranteeSection from '@/components/GuaranteeSection';
import FaqSection from '@/components/FaqSection';
import FinalCtaSection from '@/components/FinalCtaSection';
import Footer from '@/components/Footer';
import { trackEvent } from '@/utils/analytics';

export default function HomePage(): JSX.Element {
  const milestonesRef = useRef(new Set<number>());

  useEffect(() => {
    const milestones = [25, 50, 75, 100];

    const onScroll = (): void => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight - viewportHeight;
      const progress = fullHeight > 0 ? Math.round((scrollTop / fullHeight) * 100) : 100;

      milestones.forEach((milestone) => {
        if (progress >= milestone && !milestonesRef.current.has(milestone)) {
          milestonesRef.current.add(milestone);
          trackEvent('scroll_milestone', { milestone_percent: milestone });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <StickyHeader />
      <main className="pt-24 md:pt-20">
        <HeroSection />
        <EmpathySection />
        <ValueStackSection />
        <TestimonialsSection />
        <GuaranteeSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
