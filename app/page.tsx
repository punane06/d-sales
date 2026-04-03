import StickyHeader from '@/components/StickyHeader';
import HeroSection from '@/components/HeroSection';
import EmpathySection from '@/components/EmpathySection';
import ValueStackSection from '@/components/ValueStackSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import GuaranteeSection from '@/components/GuaranteeSection';
import FaqSection from '@/components/FaqSection';
import FinalCtaSection from '@/components/FinalCtaSection';
import Footer from '@/components/Footer';
import ScrollMilestoneTracker from '../components/ScrollMilestoneTracker';

export default function HomePage(): JSX.Element {
  return (
    <>
      <ScrollMilestoneTracker />
      <StickyHeader />
      <main className="pt-[var(--sticky-header-offset)] transition-[padding] duration-200">
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
