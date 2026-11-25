# Structured Data (JSON-LD) Schema Validation Report

**Prepared by:** Senior Technical SEO Specialist  
**Date:** November 25, 2026  

---

## 1. Implemented Schema Matrix

| Schema Type | Deployed Routes | Required / Recommended Properties Verified | Purpose |
|:---|:---|:---|:---|
| `Organization` | All routes (`src/app/layout.tsx`) | `@context`, `@type`, `name`, `url`, `logo` | Brand entity graph & Knowledge Graph signal |
| `WebSite` | All routes (`src/app/layout.tsx`) | `@context`, `@type`, `name`, `url`, `potentialAction` (`SearchAction` -> `/generators?q=...`) | Site-wide search action markup |
| `WebApplication` | `/generators/[slug]` (all 10 tools) | `name`, `url`, `description`, `applicationCategory: "DesignApplication"`, `operatingSystem: "All"`, `browserRequirements`, `featureList`, `offers` (`$0.00 USD`) | Primary web-tool rich entity markup |
| `SoftwareApplication` | `/generators/[slug]` (all 10 tools) | `name`, `url`, `applicationCategory: "MultimediaApplication"`, `operatingSystem: "Web"`, `offers` (`$0.00 USD`) | Reinforces software/app classification |
| `BreadcrumbList` | `/generators`, `/generators/[slug]`, `/blog`, `/blog/[slug]` | `itemListElement` with sequential `position`, `name`, `item` | Breadcrumb path hierarchy in SERPs |
| `Article` | `/blog/[slug]` (all editorial guides) | `headline`, `description`, `datePublished`, `dateModified`, `mainEntityOfPage`, `author`, `publisher` | E-E-A-T editorial guide attribution |

---

## 2. Google Guideline Compliance Decisions

1. **Deliberate `FAQPage` Exclusion on Commercial Generator Pages:**
   - Under Google's post-August 2023 Rich Results policy, `FAQPage` rich snippets are restricted primarily to authoritative government and health websites.
   - Accordingly, ChatForge renders accessible, keyword-rich **visible FAQ accordions** on `/` and every `/generators/[slug]` page for users and AI Answer Engines while omitting unnecessary `FAQPage` JSON-LD noise on commercial tool pages.
2. **Zero Fabricated Ratings (`aggregateRating`):**
   - `aggregateRating` and `review` properties are intentionally omitted until genuine, verified first-party user reviews are collected and displayed visibly on-page—avoiding manual spam penalties.
3. **Automated JSON-LD Parsing Validation:**
   - All `<script type="application/ld+json">` tags are verified by Playwright (`tests/e2e/seo-audit.spec.ts`) to parse cleanly as valid JSON with `@context: "https://schema.org"` and expected `@type` assertions across `/`, `/generators`, all `/generators/[slug]` routes, `/blog`, and `/blog/[slug]`.
