import type { Metadata } from 'next';
import { Lora, Lato } from 'next/font/google';
import './globals.css';
import { content } from '@/config/content';
import { PriceProvider } from '@/context/PriceContext';
import ScrollRestoration from '@/components/ScrollRestoration';
import AnalyticsScripts from '@/components/AnalyticsScripts';
import MetaPixelScript from '@/components/MetaPixelScript';
import { headers } from 'next/headers';
import StickyHeaderWrapper from '@/components/StickyHeaderWrapper';
import { getSiteUrl } from '@/utils/site-url';

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  weight: ['400', '700', '900'],
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['500', '600', '700'],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: content.meta.title,
  description: content.meta.description,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: '/',
    siteName: 'El Plato Seguro',
    locale: 'es_MX',
    type: 'website',
    images: [
      {
        url: '/media/products/hero-mockup.webp',
        width: 1200,
        height: 630,
        alt: 'El Plato Seguro bundle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: content.meta.title,
    description: content.meta.description,
    images: ['/media/products/hero-mockup.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  other: {
    google: 'notranslate',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || content.analytics.metaPixelId;
  const nonce = headers().get('x-nonce') || undefined;

  return (
    <html lang="es-MX" translate="no" className="notranslate" suppressHydrationWarning>
      <body className={`${lato.variable} ${lora.variable} notranslate bg-offwhite font-sans text-charcoal`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-charcoal focus:shadow-md">
          Ir al contenido principal
        </a>
        <ScrollRestoration />
        <PriceProvider>
          <StickyHeaderWrapper />
          {children}
        </PriceProvider>
        <AnalyticsScripts gaId={gaId} clarityId={clarityId} nonce={nonce} />
        <MetaPixelScript pixelId={metaPixelId} nonce={nonce} />
      </body>
    </html>
  );
}
