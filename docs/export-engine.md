# Export Engine Specification (Screenshot & Video Pipelines)

**Document Version**: 2.0  
**Last Verified**: 2026-11-26  
**Modules**:
- Static Screenshot Pipeline: `src/core/export/exportEngine.ts`
- Animated Video Pipeline: `src/core/export/videoExporter.ts`
- Download UI: `src/components/studio/StudioModals.tsx` (`ExportModal`) & `src/components/studio/VideoTimelineBar.tsx`

---

## 1. Realistic Screenshot Export Engine (`exportEngine.ts`)

Guarantees rendered exports match the live application preview:
1. **Asset Readiness (`waitForAssetsReady`)**: Awaits `document.fonts.ready` and `img.decode()` / `load` completion for every `<img>` inside the captured DOM subtree before rasterization.
2. **Full Unclipped Capture**: Computes full width and `captureScope === 'full_conversation' ? Math.max(rect.height, scrollHeight) : rect.height` so status bars, bottom navigation, long threads, and attachment previews are never cropped.
3. **Theme-Matched Backdrops**: Resolves `colorScheme` (`#000000` dark vs `#ffffff` light) and supports `platform`, `transparent`, and `solid` backdrop modes without introducing watermarks.
4. **Formats & Scaling**:
   - **PNG** (`image/png`, lossless, free & watermark-free)
   - **JPG** (`image/jpeg`, configurable quality `0.60`–`1.00`, free)
   - **WebP** (`image/webp` with automatic `.png` browser fallback where canvas WebP encoding is unsupported)
   - **HTML** (semantic escaped transcript export)
   - **Scale Factors**: `1x`, `2x` Retina (Free), `3x` Ultra HD (Pro-gated)
   - **Aspect Ratios & Custom Px**: Device Native, `9:16`, `4:5`, `1:1`, plus explicit custom pixel dimensions.

---

## 2. Video Export Engine (`videoExporter.ts`)

1. **Honest Browser Capability Detection (`detectVideoCapabilities`)**:
   - Inspects `MediaRecorder`, `HTMLCanvasElement.prototype.captureStream`, codec MIME preference (`video/mp4;codecs=avc1` -> `video/mp4` -> `video/webm;codecs=vp9` -> `vp8`), `navigator.hardwareConcurrency`, and mobile UA.
   - Disables or warns against `4K` (`2160×3840`) and `60 FPS` on mobile/low-core or non-MediaRecorder engines (e.g., headless WebKit) rather than making false promises.
2. **Platform & OS-Accurate Canvas Renderer (`drawSceneFrame`)**:
   - Renders Dynamic Island (iPhone) vs Punch-Hole (Android), platform-specific color palettes (`WhatsApp`, `iMessage`, `Instagram DM`, `Telegram`, `Android Messages`, `Discord`), message-by-message delays, incoming typing indicator frames, read receipts (`✓✓`), voice waveform progress, optional keyboard overlay, auto-scrolling message viewport, and iOS/Android bottom indicators.
3. **Resolutions & Aspect Ratios**:
   - `720p` (`540×960` / `640×800` / `720×720`)
   - `1080p` (`1080×1920` `9:16` Reels/Shorts, `1080×1350` `4:5`, `1080×1080` `1:1`)
   - `4K` (`2160×3840` `9:16`, `2160×2700` `4:5`, `2160×2160` `1:1`) when hardware-verified.
