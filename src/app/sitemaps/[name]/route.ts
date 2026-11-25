import { NextRequest } from 'next/server';
import { GENERATOR_MANIFESTS } from '@/core/registry/generators';
import { SITE_BASE_URL, buildHreflangAlternates } from '@/core/i18n/locales';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ name: 'core.xml' }, { name: 'generators.xml' }, { name: 'guides.xml' }];
}

function renderUrlEntry(
  path: string,
  priority: string,
  changefreq: string,
  lastMod: string
): string {
  const alternates = buildHreflangAlternates(path);
  const altLinks = Object.entries(alternates)
    .map(
      ([hreflang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`
    )
    .join('\n');

  return `  <url>
    <loc>${SITE_BASE_URL}${path}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${altLinks}
  </url>`;
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;
  const lastMod = new Date().toISOString();

  let entries: string[] = [];

  if (name === 'core.xml') {
    entries = [
      renderUrlEntry('/', '1.0', 'weekly', lastMod),
      renderUrlEntry('/generators', '0.9', 'weekly', lastMod),
      renderUrlEntry('/templates', '0.85', 'weekly', lastMod),
      renderUrlEntry('/help', '0.8', 'weekly', lastMod),
      renderUrlEntry('/blog', '0.8', 'weekly', lastMod),
    ];
  } else if (name === 'generators.xml') {
    entries = GENERATOR_MANIFESTS.map((m) =>
      renderUrlEntry(m.routePath, '0.9', 'weekly', lastMod)
    );
  } else if (name === 'guides.xml') {
    entries = [
      renderUrlEntry('/blog/how-to-spot-fake-whatsapp-screenshots', '0.75', 'monthly', lastMod),
      renderUrlEntry('/blog/are-fake-chat-generators-legal-and-safe', '0.75', 'monthly', lastMod),
    ];
  } else {
    return new Response('Not Found', { status: 404 });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
