import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const LAST_MODIFIED = '2026-04-04T00:00:00.000Z';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.elplatoseguro.com';

  return [
    {
      url: `${siteUrl}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
