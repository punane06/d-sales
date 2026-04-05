'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/utils/analytics';

export default function ScrollMilestoneTracker(): null {
  const milestonesRef = useRef(new Set<number>());

  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    let frameId: number | null = null;

    const evaluateMilestones = (): void => {
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

      // Stop observing once all milestones were emitted.
      if (milestonesRef.current.size === milestones.length) {
        window.removeEventListener('scroll', onScroll);
      }
    };

    const onScroll = (): void => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        evaluateMilestones();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    evaluateMilestones();

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
