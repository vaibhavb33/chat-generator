# Editor Feature Comparison: Reference vs ChatForge Studio

| Capability | Reference (`thefake.design` Public Spec) | ChatForge Studio Implementation |
| :--- | :--- | :--- |
| **Workspace Layout** | 3-area desktop studio + mobile bottom controls | 3-area desktop (`LeftEditorPanel`, `PlatformRendererHost`, `RightAppearancePanel`) + mobile expandable bottom sheets (`Contact Info`, `Messages`, `Appearance`, `Settings`) + sticky 3-action footer (`EDIT \| DOWNLOAD \| SAVE CHAT`) |
| **Left Panel Sections** | Contact details, messages, participants, media/templates | Dedicated tabs: `Contact Info`, `Messages`, `People`, `Media`, `Templates`, `Animation` (`src/components/studio/LeftEditorPanel.tsx`) |
| **Top Header** | Generator switcher, device, theme, history | Generator switcher, 2-option Device (`iPhone`, `Android`), 2-option Appearance (`Dark`, `Light`), `Undo`/`Redo`, `Templates`, `Projects`, `Pro` (`src/components/studio/StudioTopBar.tsx`) |
| **Real-Time Live Preview** | Instant preview updates from editor state | Single Zustand `project` / `renderedProject` model with `[ Live Preview: ON / PAUSED ]` toggle, `[ Update Preview ]` button, and live status (`Live preview active`, `Updating preview`, `Preview updated`, `Preview paused`) |
| **Edit in Preview** | Click preview elements to edit | Clickable contact name, avatar, message bubbles, timestamps, status bar, and wallpaper with selection ring + `Exit Selection` button; selection rings cleared before export |
| **Content Zoom vs Export Scale** | UI preview zoom separate from export scale | Content Zoom (`80%`–`130%` / `100%`–`130%` slider) scales UI preview only; Export Scale (`1x`, `2x`, `3x`) controls output pixel resolution |
| **Image Export** | Watermark-free PNG | Watermark-free `PNG`, `JPG`, `WebP`, and semantic `HTML` with `9:16`, `4:5`, `1:1`, `device`, and custom px dimensions |
| **Video Export** | Pro animated story video | Pro `MediaRecorder` (`MP4`/`WebM`) with typing animation, voice waveform playback, wallpapers, resolution/FPS controls, and live progress bar (`video-export-progress`) |
| **Persistence (Save Chat)** | Local + Pro library | Free local `IndexedDB` persistence (save, auto-restore after refresh, rename, duplicate, delete, JSON import/export) |
| **Pricing & Permissions** | Free static vs Pro passes (Weekly/Monthly/Lifetime) | Configurable Free & Pro plans (`src/core/billing/plansConfig.ts`), honest unconfigured checkout notice, zero simulated payments |
