import type { MetadataRoute } from 'next';
import { SITE_BASE_URL } from '@/core/i18n/locales';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/generators', '/templates', '/help', '/blog', '/blog/'],
        disallow: ['/api/', '/studio/', '/offline', '/_next/'],
      },
    ],
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
    host: SITE_BASE_URL,
  };
}
