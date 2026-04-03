import type { Metadata } from 'next';
import Script from 'next/script';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { content } from '@/config/content';
import { PriceProvider } from '@/context/PriceContext';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  other: {
    google: 'notranslate',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  const hasGaId = Boolean(gaId && gaId !== 'G-XXXXXXXXXX' && gaId !== 'GA_MEASUREMENT_ID');
  const hasClarityId = Boolean(
    clarityId && clarityId !== 'xxxxxxxxxx' && clarityId !== 'CLARITY_PROJECT_ID',
  );

  return (
    <html lang="es" translate="no" className="notranslate" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${cormorant.variable} notranslate bg-offwhite font-sans text-charcoal`}>
        <PriceProvider>
          {children}
        </PriceProvider>

        {hasGaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        ) : null}

        {hasClarityId ? (
          <Script id="clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
