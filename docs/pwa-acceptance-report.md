# PWA Acceptance & Browser Compatibility Report

**Prepared by:** Senior PWA Developer & QA Engineer  
**Date:** November 25, 2026  
**Scope:** Web App Manifest, Service Worker (`public/sw.js`), Offline Fallback, Installability, Update Flow, Image/Video Exports

---

## 1. PWA Acceptance Checklist

| Criterion | Implementation | Verified Status |
|:---|:---|:---|
| Web App Manifest | `src/app/manifest.ts` (`/manifest.webmanifest`) | **PASS** — `display: "standalone"`, `theme_color: "#4f46e5"`, `background_color: "#ffffff"` |
| Custom App Icons | `public/icons/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `icon.svg` | **PASS** — Verified HTTP 200 & valid PNG payloads |
| Service Worker | `public/sw.js` registered via `PwaManager` | **PASS** — `navigator.serviceWorker.ready` resolves cleanly |
| Offline Fallback Page | `src/app/offline/page.tsx` (`/offline`) | **PASS** — Pre-cached during `install` event |
| Offline Editor & Export | Pre-cached `/generators/whatsapp-chat` + client-side `html-to-image` | **PASS** — Verified editing & PNG export while offline |
| Project Cache Isolation | `sw.js` explicitly skips `/api/` & non-GET; user drafts live only in IndexedDB | **PASS** — Verified Cache Storage contains zero user projects |
| Network-Aware UI | Online/Offline listeners in `PwaManager.tsx` | **PASS** — Live offline & reconnected banners |
| Update Notification | `updatefound` / `SKIP_WAITING` flow in `PwaManager.tsx` | **PASS** — Verified reload banner trigger |
| Install Prompt | `beforeinstallprompt` (Chrome/Android) + iOS Safari Share tip | **PASS** (Chromium event) / **Documented** (iOS Safari) |

---

## 2. Browser Matrix & Documented Limitations

### 2.1 Chrome Desktop (Verified Automated via Playwright Chromium)
- **Installability:** Supports `beforeinstallprompt` and standalone desktop window installation via `/manifest.webmanifest`.
- **Offline & Export:** Full Service Worker caching, IndexedDB persistence, PNG/JPG/WebP export, and `MediaRecorder` video export (`video/webm` or `video/mp4`).

### 2.2 Android Chrome (Verified at `390px` Mobile Viewport)
- **Installability:** Supports WebAPK / Add-to-Home-Screen prompt with `192x192` and `512x512` maskable icons.
- **Limitation:** Background video rendering should keep the tab foregrounded because mobile OS power savers throttle `requestAnimationFrame` / timers if the screen locks mid-render.

### 2.3 iOS Safari (Metadata & Guidelines Verified; Native Hardware Install Untested in Linux/macOS Headless)
- **Support Implemented:** `appleWebApp` (`apple-mobile-web-app-capable`), `apple-touch-icon.png` (`180x180`), and tailored iOS `"Tap Share -> Add to Home Screen"` guidance inside `PwaManager.tsx`.
- **Documented Browser-Specific Limitations:**
  1. **No `beforeinstallprompt` API:** Apple WebKit does not emit `beforeinstallprompt`; installation requires the manual Share sheet flow.
  2. **Storage Eviction Policy:** Safari may evict IndexedDB/Cache Storage after 7 days of non-use unless the PWA is added to the Home Screen (or persistent storage is granted); `.chatforge.json` file export provides a portable backup workaround.
  3. **Video Codec Support:** Older iOS Safari builds lack VP9 WebM encoding (`MediaRecorder` supports H.264 `video/mp4` on iOS 14.3+, and our `videoExporter.ts` falls back to an interactive animated HTML player if `captureStream` is restricted).
