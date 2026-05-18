
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

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

const lato = Lato({ subsets: ['latin'], display: 'swap', variable: '--font-lato', weight: ['400', '700', '900'] });
const lora = Lora({ subsets: ['latin'], display: 'swap', variable: '--font-lora', weight: ['500', '600', '700'] });

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: content.meta.title,
  description: content.meta.description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    url: '/',
    siteName: 'El Plato Seguro',
    locale: 'es_MX',
    type: 'website',
    images: [{ url: '/media/products/hero-mockup.webp', width: 1200, height: 630, alt: 'El Plato Seguro bundle' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: content.meta.title,
    description: content.meta.description,
    images: ['/media/products/hero-mockup.webp'],
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }, { url: '/icon.svg', type: 'image/svg+xml' }],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  manifest: '/site.webmanifest',
  other: { google: 'notranslate' },
};

const COUNTDOWN_SCRIPT = `
(function(){
  'use strict';
  var KEY=${JSON.stringify(content.offer.storageKey)};
  var COOKIE=KEY+'-timer';
  var DUR_MS=${content.offer.durationSeconds}*1000;
  var CYCLE_MS=24*60*60*1000;
  var SALE_URL=${JSON.stringify(content.offer.saleUrl)};
  var EXPIRED_URL=${JSON.stringify(content.offer.expiredUrl)};

  var state={expiry:0,cycleStart:0,expired:false};
  var tickId=0;
  var started=false;

  function safeParse(raw){
    if(!raw)return null;
    try{
      var d=JSON.parse(raw);
      if(!d||typeof d!=='object')return null;
      var exp=Number(d.expiry);
      var cs=Number(d.cycleStart);
      if(!isFinite(exp)||exp<=0)return null;
      if(!isFinite(cs)||cs<=0)return null;
      return {expiry:exp,cycleStart:cs};
    }catch(e){return null;}
  }

  function readLs(){try{return safeParse(localStorage.getItem(KEY));}catch(e){return null;}}
  function readCk(){
    try{
      var prefix=COOKIE+'=';
      var cookies=(document.cookie||'').split(';');
      for(var i=0;i<cookies.length;i++){
        var c=cookies[i].trim();
        if(c.indexOf(prefix)===0)return safeParse(decodeURIComponent(c.slice(prefix.length)));
      }
    }catch(e){}
    return null;
  }

  function readPayload(){
    var fromLs=readLs();
    var fromCk=readCk();
    if(fromLs&&fromCk)return fromLs.cycleStart<=fromCk.cycleStart?fromLs:fromCk;
    return fromLs||fromCk;
  }

  function writePayload(expiry,cycleStart){
    var payload=JSON.stringify({expiry:expiry,cycleStart:cycleStart});
    try{localStorage.setItem(KEY,payload);}catch(e){}
    try{
      var secure=location.protocol==='https:'?'; secure':'';
      document.cookie=COOKIE+'='+encodeURIComponent(payload)+'; path=/; max-age=31536000; samesite=lax'+secure;
    }catch(e){}
  }

  function startFreshCycle(now){
    state.cycleStart=now;
    state.expiry=now+DUR_MS;
    state.expired=false;
    writePayload(state.expiry,state.cycleStart);
  }

  function resolveState(){
    var now=Date.now();
    var p=readPayload();
    if(!p){startFreshCycle(now);return;}
    var age=now-p.cycleStart;
    if(age>=CYCLE_MS||age<0){startFreshCycle(now);return;}
    state.expiry=p.expiry;
    state.cycleStart=p.cycleStart;
    state.expired=p.expiry<=now;
  }

  function dispatch(name){try{window.dispatchEvent(new Event(name));}catch(e){}}

  function updateCtaHrefs(expired){
    var url=expired?EXPIRED_URL:SALE_URL;
    var links=document.querySelectorAll('a.cta-shell');
    for(var i=0;i<links.length;i++){
      try{links[i].setAttribute('href',url);}catch(e){}
    }
  }

  function pad(n){return(n<10?'0':'')+n;}

  function paint(rem){
    var h=Math.floor(rem/3600);
    var m=Math.floor((rem%3600)/60);
    var s=rem%60;
    var hh=pad(h),mm=pad(m),ss=pad(s);
    var el;
    el=document.getElementById('t-h');if(el&&el.textContent!==hh)el.textContent=hh;
    el=document.getElementById('t-m');if(el&&el.textContent!==mm)el.textContent=mm;
    el=document.getElementById('t-s');if(el&&el.textContent!==ss)el.textContent=ss;
  }

  function tick(){
    var now=Date.now();
    if(state.cycleStart>0&&now-state.cycleStart>=CYCLE_MS){
      startFreshCycle(now);
      updateCtaHrefs(false);
      dispatch('eps-timer-reset');
    }
    var rem=Math.max(0,Math.floor((state.expiry-now)/1000));
    paint(rem);
    var nowExpired=state.expiry>0&&state.expiry<=now;
    if(nowExpired!==state.expired){
      state.expired=nowExpired;
      updateCtaHrefs(nowExpired);
      if(nowExpired)dispatch('eps-timer-expired');
    }
  }

  function start(){
    resolveState();
    updateCtaHrefs(state.expired);
    if(tickId){clearInterval(tickId);tickId=0;}
    tick();
    tickId=setInterval(tick,1000);
    if(!started){started=true;dispatch('eps-timer-ready');}
  }

  function stop(){if(tickId){clearInterval(tickId);tickId=0;}}

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',start);
  }else{
    start();
  }

  window.addEventListener('pageshow',function(){start();});

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible'){start();}
    else{stop();}
  });

  window.addEventListener('storage',function(e){
    if(!e||e.key===null||e.key===KEY)start();
  });

  window.addEventListener('pagehide',stop);
})();
`;

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
        <script id="countdown-timer" dangerouslySetInnerHTML={{ __html: COUNTDOWN_SCRIPT }} />
      </body>
    </html>
  );
}
