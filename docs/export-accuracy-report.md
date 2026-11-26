# Export Accuracy Report

## Screenshot Export Pipeline (`src/core/export/exportEngine.ts`)
- **Zoom-Invariant Logical Capture**: Uses `offsetWidth` and `offsetHeight` with `style: { transform: 'none', margin: '0' }` so UI Content Zoom (`100%`–`130%`) never crops or shrinks exported images.
- **Asset Readiness**: `waitForAssetsReady(element)` awaits `document.fonts.ready` and `img.decode()` before rasterization.
- **Selection Border Exclusion**: `ExportModal` clears `selectedElement` and `selectedMessageId` prior to capture so Edit-in-Preview rings never appear in exported files.
- **Formats & Aspect Ratios**:
  - Free watermark-free `PNG`, `JPG`, and `WebP` verified via binary magic-byte inspection (`\x89PNG`, `FF D8 FF`, `RIFF....WEBP`) and `IHDR` dimension matching (`previewWidth × scaleFactor`, `previewHeight × scaleFactor`).
  - Aspect ratio presets (`device`, `9:16`, `4:5`, `1:1`) and custom pixel dimensions use high-quality canvas resampling (`imageSmoothingQuality = 'high'`).

## Animated Video Export Pipeline (`src/core/export/videoExporter.ts`)
- Renders wallpaper layers, iPhone Dynamic Island vs Android punch-hole status bars, contact header + avatar, sender labels, media attachment cards, reactions, read receipts, animated typing dots, and voice note waveforms.
- Reports continuous `(pct, stage)` progress to `ExportModal` (`video-export-progress`).
