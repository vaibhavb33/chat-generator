# Testing Strategy & Quality Assurance Plan

**Document Status:** Phase 2 Specification (Pending Approval)  
**Test Stack:** Vitest (Unit & Integration) + Playwright (E2E, Exports, Visual Regression, Accessibility) + Lighthouse CI

---

## 1. Testing Philosophy & Pyramid

Because users abandon fake chat tools over **layout/text-clipping bugs**, **broken exports**, **lost drafts**, and **slow mobile performance**, QA emphasizes deterministic engine testing and real-browser export verification:

```text
           /\
          /  \      Playwright Visual Regression + Lighthouse CI
         /----\     (Pixel fidelity, Core Web Vitals, a11y axe)
        /      \
       /--------\   Playwright E2E Journeys
      /          \  (All 10 MVP generators, PNG export, PWA offline)
     /------------\
    /              \ Vitest Unit & Integration Tests
   /________________\ (Types, Parser, Store, Undo/Redo, Templates, Registry)
```

---

## 2. Unit & Integration Testing (Vitest)

Configured in `vitest.config.ts` with `jsdom` / `happy-dom` and `@testing-library/react`.

### 2.1 Core Engine Coverage Targets (`>= 90%` line coverage on `src/core/`)

| Module | What We Test |
|:---|:---|
| **Zustand Store & Undo/Redo (`useStudioStore`, `undoRedo.ts`)** | Message add/edit/delete/reorder; 50-step ring buffer bounds; redo stack clears on new branch edit; ephemeral `ui` state excluded from undo history; cross-platform switching preserves dialogue & Cast. |
| **Screenplay Script Parser (`scriptParser.ts`)** | Standard `Name: Text` lines; multi-line messages; `[voice 0:15]` and `[system]` directives; RTL/Unicode/emoji strings; malformed input resilience without throwing. |
| **Template Hydrator (`templateHydrator.ts`)** | Role mapping into 1-on-1 vs group modes; fallback behavior when target platform lacks a feature (e.g., downgrading a poll or sticker gracefully). |
| **File Serialization (`fileSerialization.ts`)** | Round-trip `.chatforge.json` export/import integrity; `schemaVersion` migration hooks; corrupted JSON / oversized payload rejection. |
| **Message Grouping & Formatting (`messageGrouping.ts`, `timeFormatter.ts`)** | Consecutive same-sender bubble grouping (`first`, `middle`, `last`, `single` tail calculation); 12h vs 24h formatting; locale labels (`en`, `es`, `pt`, `ar` RTL). |
| **Platform Registry Contracts (`src/core/registry/`)** | Every registered manifest has unique `id` and `seo.slug`, valid `archetype`, valid `loadRenderer()`, and non-empty `supportedMessageTypes`. |
| **IndexedDB Persistence (`indexedDb.ts`)** | Using `fake-indexeddb`: auto-save debounce writes, project restore on reload, orphan Blob garbage collection. |

---

## 3. End-to-End & Export Testing (Playwright)

Configured in `playwright.config.ts` across Chromium, Firefox, WebKit (Safari), and mobile device emulators (`iPhone 14`, `Pixel 7`).

### 3.1 Critical E2E User Journeys
1. **Zero-Signup Creation & PNG Export (All 10 MVP Generators):**
   - Navigate to `/generators/[slug]` -> edit participant name & message -> toggle Dark Mode -> click Export PNG -> intercept browser download event -> assert non-empty file, valid PNG magic bytes (`89 50 4E 47`), expected retina dimensions (`scaleFactor: 2`), and zero error toasts.
2. **Draft Persistence Across Reload:**
   - Add 5 messages and upload a sample avatar -> wait for IndexedDB auto-save -> `page.reload()` -> verify all 5 messages and avatar ObjectURL restore intact.
3. **Group Chat & Script-Paste Workflow:**
   - Open `/generators/whatsapp-group-chat` -> paste 12-line 4-speaker script -> verify 4 color-coded participants created -> export full-height PNG.
4. **Platform-Specific Interactive Journeys:**
   - **Instagram Story:** Add 2nd slide + poll sticker -> open viewer list -> export 9:16 PNG.
   - **Instagram Post:** Toggle long caption + `...more` truncation -> verify truncated preview renders.
   - **Fake Call Screen:** Trigger live Ring Simulator -> verify timer increments cleanly without console errors.
   - **iMessage / Discord:** Toggle Tapbacks / Discord role colors and bot badges.
5. **PWA & Offline Resilience:**
   - Load `/generators/whatsapp-chat` online -> toggle `context.setOffline(true)` -> compose new message -> export PNG client-side -> assert offline export succeeds!
6. **Optional Cloud Sync & Auth (Mocked / Staging Supabase):**
   - Sign in -> verify local IndexedDB draft merges to cloud -> simulate `409` sync conflict -> verify conflict prompt renders cleanly.

---

## 4. Visual Regression & Pixel Fidelity QA

Directly addresses the #1 UI complaint found in Reddit research (clipped text, misaligned bubbles, broken dark mode):
- **Golden Snapshot Matrix:** Playwright captures deterministic Canvas/DOM screenshots (`toHaveScreenshot({ maxDiffPixelRatio: 0.01 })`) for each of the 10 MVP platforms across:
  - Light Mode vs Dark Mode
  - iOS vs Android variants (where applicable)
  - Long-word overflow (`supercalifragilisticexpialidocious` + URLs + multi-line Arabic RTL + emoji-only messages)
  - All 12 attachment types (image, voice note waveform, document card, location card, contact card, call event)
- **Manual Reference Comparison:** Before each release, QA runs a visual side-by-side audit comparing exported PNGs against real device screenshots from current iOS 18 and Android 15 app builds.

---

## 5. Accessibility, Performance & CI Quality Gates

### 5.1 Automated Accessibility (`@axe-core/playwright`)
- Every generator page and modal (`ExportModal`, `ScriptImportModal`, `ParticipantManager`) must pass automated axe-core WCAG 2.1 AA scans with **zero `critical` or `serious` violations**.
- Keyboard-only navigation check: user can tab from message composer to export button and trigger download without a mouse.

### 5.2 Lighthouse CI & Core Web Vitals Budgets
Enforced on every Pull Request via GitHub Actions against production Next.js build:
- **Lighthouse Performance:** `>= 90`
- **Lighthouse Accessibility:** `>= 95`
- **Lighthouse SEO:** `>= 95`
- **CLS (Cumulative Layout Shift):** `< 0.05` (enforced via fixed `min-height` Studio container dimensions)
- **Initial Client JS Budget:** `< 200 KB` gzipped on `/generators/[slug]` initial route load (platform skins lazy-loaded).
