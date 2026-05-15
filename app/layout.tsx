
import type { Metadata } from 'next';
import { Lora, Lato } from 'next/font/google';
import './globals.css';
import { content } from '@/config/content';
import { PriceProvider } from '@/context/PriceContext';
import ScrollRestoration from '@/components/ScrollRestoration';
import AnalyticsScripts from '@/components/AnalyticsScripts';
import MetaPixelScript from '@/components/MetaPixelScript';
import StickyHeaderWrapper from '@/components/StickyHeaderWrapper';
import WhatsAppButton from '@/components/WhatsAppButton';
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
        <AnalyticsScripts gaId={gaId} clarityId={clarityId} />
        <MetaPixelScript pixelId={metaPixelId} />
        <WhatsAppButton />
        {/* Raw <script> — NOT the Next.js Script component — so it is embedded directly in
            the static HTML output (no RSC payload indirection). Runs as soon as the browser
            parses it (end of body → DOM already ready). Writes expiry to storage immediately
            on first visit so the timer persists if the user navigates away before React
            hydrates and PriceContext has a chance to write. */}
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <script id="countdown-timer" dangerouslySetInnerHTML={{ __html: `
(function(){
  var KEY=${JSON.stringify(content.offer.storageKey)};
  var COOKIE=KEY+'-timer';
  var DUR=${content.offer.durationSeconds};
  var SALE_URL=${JSON.stringify(content.offer.saleUrl)};
  var EXPIRED_URL=${JSON.stringify(content.offer.expiredUrl)};
  var CYCLE_MS=24*60*60*1000;
  var DUR_MS=DUR*1000;
  var expiry=0,cycleStart=0,tid=0;

  function readPayload(){
    try{
      var d=JSON.parse(localStorage.getItem(KEY)||'null');
      if(d&&typeof d.expiry==='number'&&isFinite(d.expiry)&&typeof d.cycleStart==='number'&&isFinite(d.cycleStart)&&d.cycleStart>0){
        return {expiry:d.expiry,cycleStart:d.cycleStart};
      }
    }catch(e){}
    try{
      var pfx=COOKIE+'=',cs=document.cookie.split(';');
      for(var i=0;i<cs.length;i++){
        var c=cs[i].trim();
        if(c.indexOf(pfx)===0){
          var d2=JSON.parse(decodeURIComponent(c.slice(pfx.length)));
          if(d2&&typeof d2.expiry==='number'&&isFinite(d2.expiry)&&typeof d2.cycleStart==='number'&&isFinite(d2.cycleStart)&&d2.cycleStart>0){
            return {expiry:d2.expiry,cycleStart:d2.cycleStart};
          }
        }
      }
    }catch(e){}
    return null;
  }

  function writeCycle(exp,cs){
    var p=JSON.stringify({expiry:exp,cycleStart:cs});
    try{localStorage.setItem(KEY,p);}catch(e){}
    try{
      var sec=location.protocol==='https:'?'; secure':'';
      document.cookie=COOKIE+'='+encodeURIComponent(p)+'; path=/; max-age=31536000; samesite=lax'+sec;
    }catch(e){}
  }

  function updateCtaHrefs(expired){
    var url=expired?EXPIRED_URL:SALE_URL;
    var links=document.querySelectorAll('a.cta-shell');
    for(var i=0;i<links.length;i++){links[i].href=url;}
  }

  function freshCycle(now){
    cycleStart=now;
    expiry=now+DUR_MS;
    writeCycle(expiry,cycleStart);
    updateCtaHrefs(false);
    window.dispatchEvent(new Event('eps-timer-reset'));
  }

  function pad(n){return(n<10?'0':'')+n;}

  function tick(){
    var now=Date.now();
    if(cycleStart>0&&now-cycleStart>=CYCLE_MS){
      freshCycle(now);
    }
    var rem=Math.max(0,Math.floor((expiry-now)/1000));
    if(rem===0&&expiry>0){updateCtaHrefs(true);}
    var el;
    el=document.getElementById('t-h');if(el)el.textContent=pad(Math.floor(rem/3600));
    el=document.getElementById('t-m');if(el)el.textContent=pad(Math.floor((rem%3600)/60));
    el=document.getElementById('t-s');if(el)el.textContent=pad(rem%60);
    el=document.getElementById('t-vs');if(el)el.textContent=pad(Math.floor(rem/60))+':'+pad(rem%60);
  }

  function start(){
    var now=Date.now();
    var payload=readPayload();
    if(payload&&typeof payload.cycleStart==='number'&&isFinite(payload.cycleStart)&&payload.cycleStart>0){
      if(now-payload.cycleStart>=CYCLE_MS){
        freshCycle(now);
      }else{
        expiry=payload.expiry;
        cycleStart=payload.cycleStart;
        updateCtaHrefs(expiry>0&&expiry<=now);
      }
    }else{
      freshCycle(now);
    }
    tick();
    clearInterval(tid);
    tid=setInterval(tick,1000);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start);
  }else{
    start();
  }
  window.addEventListener('pageshow',start);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')start();});
})();
        ` }} />
      </body>
    </html>
  );
}
