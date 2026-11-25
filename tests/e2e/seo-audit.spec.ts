import { test, expect } from '@playwright/test';

const GENERATOR_ROUTES = [
  '/whatsapp-chat-generator',
  '/whatsapp-group-chat-generator',
  '/instagram-dm-generator',
  '/instagram-story-generator',
  '/instagram-post-generator',
  '/imessage-generator',
  '/android-message-generator',
  '/telegram-chat-generator',
  '/discord-chat-generator',
  '/fake-call-generator',
];

test.describe('Prompt 06: Technical SEO, Sitemaps, Schemas, Redirects & On-Page SEO', () => {
  test('robots.txt and XML sitemap index + child sitemaps return valid XML', async ({
    request,
  }) => {
    const robotsRes = await request.get('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    const robotsBody = await robotsRes.text();
    expect(robotsBody).toContain('Disallow: /offline');
    expect(robotsBody).toContain('Sitemap: https://chatforge.studio/sitemap.xml');

    const indexRes = await request.get('/sitemap.xml');
    expect(indexRes.status()).toBe(200);
    const indexXml = await indexRes.text();
    expect(indexXml).toContain('<sitemapindex');
    expect(indexXml).toContain('/sitemaps/core.xml');
    expect(indexXml).toContain('/sitemaps/generators.xml');
    expect(indexXml).toContain('/sitemaps/guides.xml');

    const genRes = await request.get('/sitemaps/generators.xml');
    expect(genRes.status()).toBe(200);
    const genXml = await genRes.text();
    for (const route of GENERATOR_ROUTES) {
      expect(genXml).toContain(`${route}</loc>`);
    }
    expect(genXml).toContain('hreflang="x-default"');
  });

  test('redirects, 404 status code, and offline noindex work properly', async ({
    request,
    page,
  }) => {
    const redir = await request.get('/generators/whatsapp', { maxRedirects: 0 });
    expect([301, 308]).toContain(redir.status());
    expect(redir.headers()['location']).toBe('/whatsapp-chat-generator');

    const legacyRedir = await request.get('/generators/whatsapp-chat', { maxRedirects: 0 });
    expect([301, 308]).toContain(legacyRedir.status());
    expect(legacyRedir.headers()['location']).toBe('/whatsapp-chat-generator');

    const missing = await request.get('/generators/does-not-exist-999');
    expect(missing.status()).toBe(404);

    await page.goto('/offline');
    const robotsMeta = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(robotsMeta).toContain('noindex');
  });

  test('every generator page has unique title, description, canonical, single H1, OG tags, and valid JSON-LD', async ({
    page,
  }) => {
    const seenTitles = new Set<string>();
    const seenDescriptions = new Set<string>();

    for (const route of GENERATOR_ROUTES) {
      await page.goto(route);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(20);
      expect(seenTitles.has(title)).toBe(false);
      seenTitles.add(title);

      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(desc && desc.length > 60).toBe(true);
      expect(seenDescriptions.has(desc!)).toBe(false);
      seenDescriptions.add(desc!);

      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute('href');
      expect(canonical).toContain(route);

      const ogTitle = await page
        .locator('meta[property="og:title"]')
        .getAttribute('content');
      expect(ogTitle).toBeTruthy();

      const twitterCard = await page
        .locator('meta[name="twitter:card"]')
        .getAttribute('content');
      expect(twitterCard).toBe('summary_large_image');

      // Single H1 + H2 sections
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.locator('h2').count()).toBeGreaterThanOrEqual(3);

      // Parse all JSON-LD scripts and validate WebApplication, SoftwareApplication, BreadcrumbList
      const schemas = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        ).map((el) => JSON.parse(el.textContent || '{}'));
      });
      const types = schemas.map((s) => s['@type']);
      expect(types).toContain('Organization');
      expect(types).toContain('WebSite');
      expect(types).toContain('WebApplication');
      expect(types).toContain('SoftwareApplication');
      expect(types).toContain('BreadcrumbList');
    }
  });

  test('blog editorial articles render with valid Article JSON-LD', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h1')).toHaveCount(1);

    await page.goto('/blog/how-to-spot-fake-whatsapp-screenshots');
    await expect(page.locator('h1')).toHaveCount(1);

    const schemas = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((el) => JSON.parse(el.textContent || '{}'))
    );
    const types = schemas.map((s) => s['@type']);
    expect(types).toContain('Article');
    expect(types).toContain('BreadcrumbList');
  });
});
