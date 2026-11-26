# Live Preview Synchronization & Testing Report

## Synchronization Architecture
- **Single Source of Truth**: Both the editor panels (`LeftEditorPanel`, `RightAppearancePanel`, platform-specific editors) and the live device preview (`PlatformRendererHost`) read from the centralized Zustand store (`src/core/store/useStudioStore.ts`).
- **Live Preview Controls**:
  - `livePreviewEnabled` (`true` by default) synchronizes `renderedProject` with `project` on every mutation (`commitMutation`, `undo`, `redo`, `restoreProjectById`).
  - `PlatformRendererHost` triggers `markPreviewRendered(mutationVersion)` inside `useEffect` + `requestAnimationFrame` only after React commits the DOM, guaranteeing `"Preview updated"` is never displayed prematurely.
  - When paused (`livePreviewEnabled = false`), `renderedProject` remains frozen while edits accumulate in `project`, `live-preview-status` shows `"Preview paused"`, and clicking `[ Update Preview ]` (`update-preview-btn`) flushes the latest `project` to the live preview.

## Automated Acceptance Suite
Executed via `tests/e2e/live-preview-30-steps.spec.ts` in Chromium across:
- **30-Step End-to-End Sequence** (WhatsApp contact name, avatar upload, message add/sender/timestamp/delivery status, wallpaper, Dark/Light, iPhone/Android, Pause Live Preview -> edit -> Update Preview, PNG download & dimension match, Save Chat -> browser reload -> restore).
- **Responsive Breakpoints**: `360px`, `390px`, `768px`, and `1440px` with zero horizontal overflow and visible 3-action sticky footer (`EDIT | DOWNLOAD | SAVE CHAT`).
