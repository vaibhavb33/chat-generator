# Android Reference Analysis (Android 15/16 Material 3 & App Anatomy)

**Target OS**: Android 15 / Android 16 (Material 3 Expressive) — Pixel 9 / Galaxy S25 baseline  
**Viewport Geometry**: `412 × 915 dp` logical screen (`9:20` aspect ratio), centered punch-hole front camera (`14–16px` circle), edge-to-edge gesture navigation bar (`24px` bottom inset with centered `108px × 4px` translucent pill)  
**Research Date**: 2026-11-26

---

## 1. Android 16 Material 3 Expressive System Chrome

1. **Top Status Bar (`36px`–`42px` height)**:
   - **Left Cluster**: Clock (`10:31`, `9:41`) in Roboto / Google Sans Medium (`13px`–`14px`), optionally accompanied by up to 2–3 muted monochrome app notification icons (unlike iOS where left side only holds time + Focus/location).
   - **Center**: Small circular punch-hole camera cutout (`14px × 14px` `#000000` circle, `8px` from top) — never a wide Dynamic Island capsule!
   - **Right Cluster**: Wi-Fi fan icon, 5G/LTE cellular triangle (`triangle fill`), Android 16 horizontal rounded-pill battery icon (`22px × 12px` with inline bold percentage or adjacent `55%` label; color-coded green on charge, yellow on battery saver, red <= 15%).

2. **Bottom System Navigation (`20px`–`24px` height)**:
   - **Gesture Navigation Pill**: Centered `108px × 4px` rounded pill (`rgba(255,255,255,0.75)` dark / `rgba(15,23,42,0.55)` light), edge-to-edge transparent background behind app bottom bar.
   - **Never mix iOS home bar width (`134px`) or Dynamic Island into Android mode.**

---

## 2. Android Material 3 Design Tokens

| Token | Light Mode Value | Dark Mode Value | Notes |
|---|---|---|---|
| **Surface Background** | `#FFFFFF` / `#FDFBFF` | `#121318` / `#0B141A` | M3 Expressive uses layered tonal elevation |
| **Elevated Container** | `#EFF3F9` / `#F0F4F9` | `#1D1F27` / `#1F2C34` | Used for top bars, nav bars, message sheets |
| **Nav Indicator Pill** | `64px × 32px` rounded-full tonal tint (`#D3E3FD` / `#D9FDD3`) | `64px × 32px` `#004A77` / `#005C4B` | Active bottom tab icon sits inside tonal pill |
| **System Font Stack** | `"Roboto", "Google Sans Text", "Noto Sans", sans-serif` | Same | Left-aligned titles in app bars (`20px`–`22px` regular/medium) |

---

## 3. App-by-App Android Reference Breakdown

### A. WhatsApp Android (Material 3)
- **Chat List View**:
  - Top bar: Bold `WhatsApp` green (`#1DAA61`, light) or white (`#FFFFFF`, dark) brand wordmark left; Camera icon, QR/Search or overflow `⋮` (`MoreVertical`) top-right; rounded pill search bar `Ask Meta AI or Search` directly below header.
  - Filter chips row: `All`, `Unread`, `Favorites`, `Groups` in rounded tonal pills.
  - Bottom Navigation: 4-tab docked M3 bar (`Chats`, `Updates`, `Communities`, `Calls`) with tonal pill highlight under active icon (`#D9FDD3` light / `#005C4B` dark) + green circular unread badge. Floating Action Button (`rounded-2xl` squircle `#1DAA61` with chat-plus icon) above bottom-right + Meta AI gradient circle above it.
- **Chat Thread View**:
  - Top bar: Left Material `ArrowLeft` (never chevron!), `36px` circular avatar, **left-aligned** Contact Name + status (`online` / `typing...`), right Video call, Voice call, and `⋮` (`MoreVertical`) overflow menu.
  - Bubbles: `#D9FDD3` (light outgoing) / `#005C4B` (dark outgoing); `#FFFFFF` / `#202C33` incoming; inline timestamp + double checkmarks bottom-right.
  - Composer: Rounded white/dark-slate pill (`Emoji` smiley left, `Message` field, `Paperclip` + `₹` + `Camera` inside right) + circular `#1DAA61` / `#00A884` Mic/Send FAB outside on right.

### B. Instagram Android (2025–2026 Unified Nav)
- **Home Feed & Stories**:
  - Top bar: `+` (Create) top-left, `Instagram ⌄` wordmark, `♡` heart icon with red dot top-right.
  - Stories tray: `72px` circular avatars with rainbow gradient ring.
  - Bottom Bar: Edge-to-edge solid `#FFFFFF` (light) / `#000000` (dark) 5-tab bar (`Home`, `Reels`, `DMs`, `Search`, `Profile`) above Android `20px` gesture bar (instead of iOS Liquid Glass floating pill).
- **DM Thread**:
  - Left `ArrowLeft`, `34px` avatar + Display Name + `@handle` subtitle left-aligned, Phone + Video + Flag/Info icons right.
  - Gradient outgoing bubbles (`#5851DB` -> `#C13584`), `#F2F2F2` / `#262626` incoming bubbles, Material pill composer with blue/purple camera circle left, Mic + Gallery + Sticker right.

### C. Telegram Android (`v12.4.0+`)
- **Chat List View**:
  - Version `12.4.0` removed the classic left hamburger drawer and introduced a persistent **4-tab bottom bar** (`Chats`, `Contacts`, `Settings`, `Profile`) with rounded translucent/elevated styling, plus top-right `Search` and `⋮` overflow menu (`New Group`, `New Channel`).
  - Folder tabs (`All`, `Trade`, `Chill`) sit under the top header with underline/pill indicator.
  - Floating circular Telegram Blue (`#3390EC`) pencil FAB above bottom-right.
- **Chat Thread View**:
  - **Left-aligned** header layout: `ArrowLeft`, `38px` circular avatar, Title + Subtitle (`online` / `N members`), right Phone, Search, `⋮` overflow (`#517DA2` classic blue or clean `#FFFFFF` light / `#17212B` dark header).

### D. Google Messages (Android 16 Material 3 Expressive)
- **Thread Layout**:
  - Outer top bar (`#EFF3F9` light / `#1D1F27` dark) with `ArrowLeft`, `36px` avatar, Contact Name, Video + Call + Search + `⋮` icons.
  - M3 Expressive **rounded top container** (`rounded-t-3xl` `#FFFFFF` / `#121318`) framing the chat stream.
  - Outgoing RCS bubbles: `#0B57D0` (light, white text) / `#A8C7FA` (dark, `#062E6F` text); Incoming: `#E8EDF5` (light) / `#24262F` (dark).
  - Read receipts: Material circled check icons (`✓` sent, `✓✓` delivered, filled `✓✓` read) + `End-to-end encrypted` lock notice.
  - Pill composer (`+` attach circle, Emoji, `RCS message` input, Photomoji/Gallery, Mic pill on right).

### E. Discord Android
- Uses `Light`, `Ash`, `Dark`, `Onyx` themes, `ArrowLeft` channel/DM navigation, Roboto/gg-sans fallback, Android status bar + `20px` gesture pill, flat message rows with circular `40px` avatars, role colors, embeds, and squircle composer + reaction chips.

### F. Android Native Fallback for Apple-Exclusive Generator (`/imessage-generator`)
- Since Apple iMessage does not exist natively on Android, if a user switches the Device toggle to `Android` on `/imessage-generator`, the studio should cleanly explain/display an **Android RCS / SMS Cross-Platform Conversation View** (with Android status bar, Material `ArrowLeft`, RCS/SMS bubbles) or show a clear non-blocking OS compatibility banner while updating the device chrome to authentic Android so device switching always visibly updates the entire viewport rather than faking an iOS-on-Android screenshot.
