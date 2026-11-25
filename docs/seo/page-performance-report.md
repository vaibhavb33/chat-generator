# Page Performance & Core Web Vitals Report

**Prepared by:** Senior Technical SEO Specialist & Frontend Architect  
**Date:** November 25, 2026  

---

## 1. Core Web Vitals Engineering Controls

| Metric | Target | Implemented Engineering Optimizations |
|:---|:---|:---|
| **LCP** (Largest Contentful Paint) | `< 2.5s` | SSG pre-rendered HTML shell; zero blocking external font network requests (system geometric sans stack); zero above-the-fold banner ads |
| **INP** (Interaction to Next Paint) | `< 200ms` | Code-split modal dialogs (`ExportModal`, `ScriptImportModal`, `TemplatePickerModal`, `ProjectsModal`, `ConfirmClearModal`) loaded via `next/dynamic(..., { ssr: false })`; lightweight Zustand state slices |
| **CLS** (Cumulative Layout Shift) | `< 0.05` | Reserved `580px` hydration skeleton (`studio-loading-skeleton`) matching the Phone/Device preview dimensions; zero dynamic ad injections |
| **TTFB** (Time to First Byte) | `< 400ms` | Static pre-rendering (`○` / `●`) across `/`, all 10 `/generators/[slug]`, `/blog`, `/blog/[slug]`, and sitemaps (`Cache-Control: s-maxage=3600`) |

---

## 2. Measured Production Build Bundle Sizes (`next build` Verified)

Observed directly from `next build` output across all 26 static/SSG routes:

| Route | Route Size | First Load JS | Rendering |
|:---|:---|:---|:---|
| `/` | `1.58 kB` | `152 kB` | Static (`○`) |
| `/blog` & `/blog/[slug]` | `186 B` | `146 kB` | Static / SSG (`○` / `●`) |
| `/generators` | `3.11 kB` | `154 kB` | Dynamic SSR (`ƒ`) |
| `/generators/[slug]` (10 tools) | `90 kB` (down from `96.4 kB`) | `237 kB` (down from `244 kB`) | SSG (`●`) |
| `/offline` | `1.75 kB` | `119 kB` | Static (`○`) |
| `/sitemap.xml`, `/sitemaps/[name]`, `/robots.txt` | `142 B` | `103 kB` | Static / SSG (`○` / `●`) |

- **Shared First Load JS:** `103 kB` across all routes
- **Third-Party Scripts:** `0` external tracking/ad scripts loaded at runtime
- **Image Delivery:** Custom SVG thumbnails and `next/og` `ImageResponse` cards (`1200x630` PNG) plus client-side `html-to-image` rendering with zero server round-trips
