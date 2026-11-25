# ChatForge UI/UX Design System

**Document Status:** Phase 3 Design System Specification  
**Role:** Senior Product Designer & UI/UX Specialist  
**Breakpoints Verified:** `360px`, `390px`, `768px`, `1024px`, `1440px`, `1920px`

---

## 1. Visual Identity & Brand Principles

ChatForge is designed as a **precision creator studio** rather than an ad-ridden prank utility. Every surface balances editorial clarity (clean white canvases, crisp hairline borders, generous whitespace) with tactile interactive controls powered by a **purple-to-blue accent spectrum**.

### Design Principles
1. **Canvas First, Chrome Second:** Inside the Studio Workspace, the live phone/social mockup sits front-and-center on a neutral dot-grid studio backdrop (`#F8FAFC` light / `#090D16` dark) so colors inside the user's mockup never clash with noisy UI chrome.
2. **Zero Dead Controls:** Every button, toggle, badge, search input, and timeline control executes a real, deterministic action.
3. **Accessible Contrast First:** Primary actions use `#4F46E5` (Indigo-600, `6.29:1` contrast with `#FFFFFF`) and body text uses `#0F172A` (`17.4:1` on `#FFFFFF`) and `#475569` (`7.58:1` on `#FFFFFF`), exceeding WCAG 2.1 AA across both Light and Dark modes.
4. **Zero-Overflow Mobile Ergonomics:** Preview-first mobile editor with bottom-anchored export bar and slide-up/expandable editing tabs (`360px` and `390px` safe).

---

## 2. Color Tokens & Theme System

### 2.1 Light Mode (Default)
| Token | CSS Variable | Hex Value | Usage |
|:---|:---|:---|:---|
| Background Primary | `--bg-canvas` | `#FFFFFF` | Page backgrounds, cards, modals |
| Background Subtle | `--bg-subtle` | `#F8FAFC` | Alternating homepage bands, directory grid |
| Studio Stage | `--bg-stage` | `#F1F5F9` | Center live-preview stage with subtle dot grid |
| Surface Elevated | `--bg-elevated` | `#FFFFFF` | Floating toolbars, popovers, dropdowns |
| Border Hairline | `--border-default` | `#E2E8F0` | Cards, panels, dividers |
| Border Strong | `--border-strong` | `#CBD5E1` | Inputs, interactive hover borders |
| Text Primary | `--text-primary` | `#0F172A` | Headings, primary labels |
| Text Secondary | `--text-secondary` | `#475569` | Descriptions, body prose |
| Text Muted | `--text-muted` | `#64748B` | Captions, metadata, placeholders |

### 2.2 Purple / Blue Accent System
| Token | CSS Variable | Hex Value | Contrast / Role |
|:---|:---|:---|:---|
| Brand Primary | `--accent-primary` | `#4F46E5` | Primary CTAs, active tabs (`6.29:1` w/ white) |
| Brand Primary Hover | `--accent-primary-hover` | `#4338CA` | Hover state (`7.9:1` w/ white) |
| Brand Purple | `--accent-purple` | `#7C3AED` | Gradient stop, Pro/Video badges |
| Brand Blue | `--accent-blue` | `#2563EB` | Focus rings, secondary links |
| Brand Gradient | `--accent-gradient` | `linear-gradient(135deg, #6366F1 0%, #3B82F6 100%)` | Hero CTA, brand emblem, highlight accents |
| Accent Soft Tint | `--accent-tint` | `#EEF2FF` | Selected cards, category chips, pill backgrounds |
| Accent Tint Text | `--accent-tint-text` | `#3730A3` | Text inside `#EEF2FF` pills (`10.2:1`) |

### 2.3 Semantic Status Colors
| State | Background | Text / Icon | Border |
|:---|:---|:---|:---|
| Success (Exported / Saved) | `#ECFDF5` | `#047857` | `#A7F3D0` |
| Warning (Unsaved / Offline) | `#FFFBEB` | `#B45309` | `#FDE68A` |
| Error (Validation / Failed) | `#FEF2F2` | `#B91C1C` | `#FECACA` |
| Info (Client-Side Privacy) | `#EFF6FF` | `#1D4ED8` | `#BFDBFE` |

### 2.4 Optional Dark Mode (`html.dark`)
| Token | Hex Value | Usage |
|:---|:---|:---|
| `--bg-canvas` | `#0B0F19` | Primary page & modal background |
| `--bg-subtle` | `#111827` | Cards & sidebar panels |
| `--bg-stage` | `#060911` | Studio center preview stage |
| `--border-default` | `#1E293B` | Hairline dividers |
| `--text-primary` | `#F8FAFC` | Primary copy |
| `--text-secondary` | `#94A3B8` | Supporting copy |
| `--accent-primary` | `#6366F1` | Buttons & active states (`#818CF8` for inline links) |

---

## 3. Typography Scale

- **Display & UI Font:** System geometric sans (`'Inter'`, `'SF Pro Display'`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, `Roboto`, `sans-serif`) for instant zero-CLS rendering and native OS clarity.
- **Monospace Font:** `'JetBrains Mono'`, `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace` for timestamps, battery percentages, JSON project bundles, and shortcuts.

| Role | Size / Line Height | Weight | Tracking |
|:---|:---|:---|:---|
| Hero Display (`H1`) | `clamp(2.25rem, 4.5vw, 3.75rem)` / `1.08` | `700` | `-0.03em` |
| Section Heading (`H2`) | `clamp(1.625rem, 3vw, 2.25rem)` / `1.18` | `700` | `-0.02em` |
| Card Heading (`H3`) | `1.125rem` (`18px`) / `1.35` | `600` | `-0.01em` |
| Body Standard | `1rem` (`16px`) / `1.6` | `400` | `0` |
| UI Control Label | `0.875rem` (`14px`) / `1.4` | `500` | `0` |
| Micro Badge / Meta | `0.75rem` (`12px`) / `1.35` | `600` | `+0.01em` |

---

## 4. Spacing, Radius & Elevation

- **Spacing Scale:** Strict `4px` base grid (`4`, `8`, `12`, `16`, `20`, `24`, `32`, `48`, `64`, `96px`).
- **Border Radius:**
  - `6px` (`rounded-md`): Inputs, small badges, toolbar icon buttons
  - `12px` (`rounded-xl`): Cards, sidebar sections, modals
  - `16px` (`rounded-2xl`): Feature containers, preview cards
  - `9999px` (`rounded-full`): Filter pills, avatars, status indicators
- **Subtle Elevation Shadows:**
  - `--shadow-card`: `0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03)`
  - `--shadow-elevated`: `0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)`
  - `--shadow-device`: `0 25px 50px -12px rgba(15, 23, 42, 0.22)`

---

## 5. Responsive Layout Architecture

| Breakpoint | Widths Tested | Homepage & Directory | Editor Workspace |
|:---|:---|:---|:---|
| **Mobile S / M** | `360px`, `390px` | Single-column stack, hamburger drawer, sticky search, 1-col generator cards | **Preview-first** canvas at top; expandable bottom drawer/tabs (`Messages`, `Participants`, `Style`, `Timeline`); fixed bottom bar with Export CTA; zero horizontal scroll |
| **Tablet** | `768px` | 2-column generator grid, collapsible nav drawer or compact links | Preview stage on top + 2-column tabbed controls or side-by-side compact drawer |
| **Desktop S** | `1024px` | Full navbar, 3-column generator cards | 3-pane Studio (`280px` Left / Fluid Center / `280px` Right) + top toolbar + collapsible bottom video timeline |
| **Desktop M / L** | `1440px`, `1920px` | Centered `max-w-7xl` (`1280px`) container with generous breathing room | Full 3-pane Studio (`340px` Left / Fluid Center / `320px` Right) + full top toolbar + bottom video timeline |

---

## 6. UI State Matrix

Every required application state is explicitly designed, accessible via `role="status"` / `role="alert"` / `aria-live`, and interactively verifiable:

1. **Empty State:** Shown when a user clears all messages or searches a non-matching query in the Generator Directory. Includes a clear icon, helpful explanation, and 1-click recovery CTA (`"Load Sample Conversation"` / `"Clear Filters"`).
2. **Loading State:** Non-blocking skeleton placeholders matching exact panel/card dimensions (`CLS = 0`) plus inline spinner feedback during export or template loading.
3. **Error State:** Inline actionable alert banner (e.g., invalid `.chatforge.json` import or empty screenplay paste) with retry/dismiss controls.
4. **Successful Export State:** Confirmation modal + toast showing generated dimensions, scale factor (`1x`/`2x`/`3x`), zero-watermark confirmation, and instant re-download button.
5. **Unsaved Project State:** Live toolbar status pill transitioning clearly between `Unsaved changes` (amber indicator with manual `Save Now` button) and `Saved locally in browser` (emerald checkmark).
6. **Mobile Navigation:** Slide-over accessible drawer at `< 1024px` containing links, theme toggle, and direct Studio shortcut.
7. **Modal Dialogs:** Radix-backed accessible modals for **Export**, **Script-Paste Bulk Import**, **Templates**, and **JSON Project Import/Export** with focus trapping and Escape dismissal.
8. **Tooltips:** Radix tooltips on icon-only toolbar actions (Undo `Cmd+Z`, Redo `Cmd+Shift+Z`, Device Switch, Dark Mode) with keyboard shortcut hints.
9. **Confirmation Messages:** Explicit confirmation dialog before destructive actions (`Clear All Messages` or `Reset to Blank`).
