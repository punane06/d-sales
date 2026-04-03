import { content } from '@/config/content';

function InstagramIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-6 w-6">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-6 w-6">
      <path
        d="M14 4V13.2C14 15.3 12.3 17 10.2 17C8.1 17 6.4 15.3 6.4 13.2C6.4 11.1 8.1 9.4 10.2 9.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 4C14.7 5.8 16.3 7 18.2 7.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-6 w-6">
      <path
        d="M13.5 21V12.8H16.2L16.6 10H13.5V8.2C13.5 7.4 13.9 6.7 15.2 6.7H16.7V4.3C16.7 4.3 15.4 4 14.1 4C11.4 4 9.6 5.6 9.6 8.5V10H6.8V12.8H9.6V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function YouTubeIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-6 w-6">
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M11 10L15 12L11 14V10Z" fill="currentColor" />
    </svg>
  );
}

export default function Footer(): JSX.Element {
  return (
    <footer className="bg-charcoal px-4 py-10 text-white">
      <div className="section-container flex flex-col items-center gap-5 text-center">
        <div className="flex items-center gap-4">
          <a
            href={content.footer.facebookUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={content.footer.facebookLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition hover:bg-white/10"
          >
            <FacebookIcon />
          </a>
          <a
            href={content.footer.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={content.footer.instagramLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition hover:bg-white/10"
          >
            <InstagramIcon />
          </a>
          <a
            href={content.footer.tiktokUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={content.footer.tiktokLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition hover:bg-white/10"
          >
            <TikTokIcon />
          </a>
          <a
            href={content.footer.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={content.footer.youtubeLabel}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition hover:bg-white/10"
          >
            <YouTubeIcon />
          </a>
        </div>
        <p className="body-copy text-white/90">{content.footer.copyright}</p>
      </div>
    </footer>
  );
}
