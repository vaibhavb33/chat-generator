# XML Sitemap Index & Child Sitemaps Report

**Prepared by:** Senior Technical SEO Specialist  
**Date:** November 25, 2026  

---

## 1. Sitemap Architecture

ChatForge implements an **XML Sitemap Index** at `/sitemap.xml` (`src/app/sitemap.xml/route.ts`) referencing three modular child XML sitemaps (`src/app/sitemaps/[name]/route.ts`), keeping crawl signals organized cleanly as the catalog grows from 10 to 50+ generators:

| Endpoint | Role | Contents | Status Code / Content-Type |
|:---|:---|:---|:---|
| `/sitemap.xml` | `<sitemapindex>` | Points to `core.xml`, `generators.xml`, `guides.xml` | `200 OK` / `application/xml` |
| `/sitemaps/core.xml` | `<urlset>` | `/`, `/generators`, `/blog` (`xhtml:link` hreflang included) | `200 OK` / `application/xml` |
| `/sitemaps/generators.xml` | `<urlset>` | All 10 MVP `/generators/[slug]` canonical URLs | `200 OK` / `application/xml` |
| `/sitemaps/guides.xml` | `<urlset>` | All `/blog/[slug]` E-E-A-T editorial guides | `200 OK` / `application/xml` |

## 2. Robots.txt Verification (`src/app/robots.ts`)
- **Allows:** `/`, `/generators`, `/generators/`, `/blog`, `/blog/`
- **Disallows:** `/api/`, `/studio/`, `/offline`, `/_next/`
- **Sitemap Declaration:** `Sitemap: https://chatforge.studio/sitemap.xml`

## 3. Exclusion Hygiene
- `/offline` and future `/studio/*` routes are strictly excluded from all sitemaps and marked `noindex, nofollow` / `Disallow`.
- 301 redirect alias paths (`/generators/whatsapp`, `/generators/iphone-imessage`, etc.) are omitted from sitemaps so only canonical `200 OK` URLs appear.
