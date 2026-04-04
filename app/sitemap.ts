import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/utils/site-url';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
