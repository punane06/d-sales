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
import { content } from '@/config/content';
import { getSiteUrl } from '@/utils/site-url';
import ErrorBoundary from '@/components/ErrorBoundary';

const siteUrl = getSiteUrl();
const canonicalUrl = `${siteUrl}/`;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${canonicalUrl}#organization`,
      name: 'El Plato Seguro',
      url: canonicalUrl,
      sameAs: [
        content.footer.instagramUrl,
        content.footer.facebookUrl,
        content.footer.youtubeUrl,
        content.footer.tiktokUrl,
      ],
    },
    {
      '@type': 'Product',
      '@id': `${canonicalUrl}#product`,
      name: 'El Plato Seguro',
      description: content.hero.description,
      image: [`${siteUrl}/media/products/hero-mockup.webp`],
      brand: {
        '@type': 'Brand',
        name: 'El Plato Seguro',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: content.offer.salePrice.replace('$', ''),
        url: content.offer.saleUrl,
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: content.faq.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

export default function HomePage(): JSX.Element {
  return (
    <>
      {/* Safe: structuredData is built entirely from server-side static config — no user input. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ScrollMilestoneTracker />
      <StickyHeader />
      <main id="main-content" tabIndex={-1} className="pt-[var(--sticky-header-offset)] transition-[padding] duration-200">
        <ErrorBoundary>
          <HeroSection />
          <EmpathySection />
          <ValueStackSection />
          <TestimonialsSection />
          <GuaranteeSection />
          <FaqSection />
          <FinalCtaSection />
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
