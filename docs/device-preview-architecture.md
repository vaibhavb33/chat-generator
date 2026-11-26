# Device & Full-Screen Preview Architecture

**Document Version**: 2.0  
**Last Verified**: 2026-11-26  
**Core Files**:
- `src/components/studio/StudioTopBar.tsx`
- `src/platforms/PlatformRendererHost.tsx`
- `src/components/shared-renderers/DeviceFrameWrapper.tsx`
- `src/components/shared-renderers/StatusBar.tsx`
- `src/components/studio/StudioWorkspace.tsx`
- `src/core/store/useStudioStore.ts`

---

## 1. Two-Device + Two-Appearance Header Architecture

The studio top header (`StudioTopBar`) enforces strict simplicity:
1. **Device Selector (`[ iPhone ] [ Android ]`)**:
   - Exclusively renders two options (`iphone` and `android`).
   - Action `setDeviceType(device)` atomically updates:
     - `theme.deviceType` (`'iphone' | 'android'`)
     - `theme.osVariant` (`'ios' | 'android'`)
     - `theme.uiVersion` (`'ios_modern' | 'android_modern'`)
     - `theme.statusBar.notchStyle` (`'dynamic_island' | 'punch_hole'`)
     - `exportSettings.deviceFrame` (`'iphone_16_pro' | 'pixel_9'`, unless `'none'` edge-to-edge screen mode is active)
     - Platform-specific call/layout flags (`callMeta.deviceMode`, `discordLayout` -> `'mobile_chat'` when switching from desktop server view)
   - Preserves all conversation messages, participants, timestamps, wallpapers, and Dark/Light state.
2. **Appearance Selector (`[ Dark ] [ Light ]`)**:
   - Action `setAppearance(mode)` operates orthogonally to `deviceType`, enabling all four combinations (`iPhone + Dark`, `iPhone + Light`, `Android + Dark`, `Android + Light`) and persisting with the project in IndexedDB.

---

## 2. Responsive Preview Stage & Edit-in-Preview

- **Desktop (`lg:` >= 1024px)**: 3-column grid (`330px` Content Editor | `1fr` Live Preview Stage | `300px` Style & Appearance). Clicking **Preview** (`preview-edit-button`) collapses sidebars into a focused canvas; clicking **Edit** restores them without obscuring the device.
- **Controlled Desktop Zoom**: Stage action bar provides `-` / `+` zoom scaling (`80%`–`115%`) and hardware `Frame` bezel toggle (`iphone_16_pro` / `pixel_9` vs `none`).
- **Mobile (`< 1024px`)**: Live preview renders edge-to-edge cleanly (`pb-20` clearance above sticky footer, zero thick unnecessary bezels below `640px`, zero horizontal overflow down to `360px`). Expandable editing drawer sits cleanly below preview so edits reflect live without covering the device screen.
- **Click-to-Edit Selection**: Clicking Status Bar, Avatar, Contact Name, Message Bubble, or Chat List Row dispatches `setSelectedElement(...)`, highlights the element, focuses the relevant editor tab (`messages`, `participants`, `appearance`), and opens editing if closed.
