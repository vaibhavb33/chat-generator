import { SITE_BASE_URL } from '@/core/i18n/locales';

export const dynamic = 'force-static';

export async function GET() {
  const lastMod = new Date().toISOString();
  const sitemaps = ['core.xml', 'generators.xml', 'guides.xml'];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    (name) => `  <sitemap>
    <loc>${SITE_BASE_URL}/sitemaps/${name}</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
