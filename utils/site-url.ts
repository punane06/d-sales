const DEFAULT_SITE_URL = 'https://www.elplatoseguro.com';

export function getSiteUrl(): string {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!candidate) {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(candidate);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return DEFAULT_SITE_URL;
    }

    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}