# iOS Reference Analysis (iOS 26 Liquid Glass & Core App Anatomy)

**Target OS**: Apple iOS 26 (`iPhone 15 Pro / 16 Pro / 17 Pro` baseline)  
**Viewport Geometry**: `393 × 852 pt` logical screen (`9:19.5` aspect ratio, `3x` Retina = `1179 × 2556 px`), corner radius `55px` hardware / `38–44px` preview frame  
**Research Date**: 2026-11-26  
**Direct Pixel Evidence**: `IMG_5413.PNG` (WhatsApp), `IMG_5414.PNG` (Instagram), `IMG_5415.PNG` (Telegram)

---

## 1. iOS 26 System Chrome & Status Bar Specification

Observed directly across `IMG_5413.PNG`, `IMG_5414.PNG`, and `IMG_5415.PNG`:

1. **Top Safe Area (`54px`–`59px` height)**:
   - **Left Cluster**:
     - Time label (`10:31`, `9:41`) in SF Pro Text **Semibold** (`15px`–`16px`, tabular numerals, `-0.02em` tracking).
     - Optional trailing system glyph immediately right of time: Silent/Focus crossed-out bell (`IMG_5413.PNG`, `IMG_5415.PNG`) or active Location arrow (`IMG_5414.PNG`).
   - **Center Cutout**:
     - **Dynamic Island**: Centered black capsule (`120px × 34px` at `393px` scale, `rounded-full`, offset `11px` from top edge).
   - **Right Cluster**:
     - **Cellular Signal**: 4 vertical rounded bars ascending left-to-right (inactive bars at `30%` opacity).
     - **Wi-Fi**: Classic 3-arc iOS Wi-Fi symbol.
     - **Battery Capsule**: Rounded-rectangle pill (`25px × 12.5px`) with tiny right terminal nub (`1.5px × 4px`). Displays numeric percentage (`54`, `55`, `86`) **inside** the battery fill (`#FACC15` Yellow in Low Power Mode as seen in all 3 reference screenshots, `#34C759` Green when charging, `#FFFFFF`/`#000000` in standard mode).

2. **Bottom Home Indicator Safe Area (`28px`–`34px` height)**:
   - Centered horizontal pill bar (`134px × 5px`, `rounded-full`), translucent contrast adaptive (`rgba(255,255,255,0.85)` dark mode, `rgba(0,0,0,0.85)` light mode).
   - Content and floating Liquid Glass tab bars sit cleanly above or softly layered over the bottom safe area without ever colliding with the home indicator.

---

## 2. iOS 26 Liquid Glass Design Tokens

Based on Apple HIG (WWDC 2025/2026) and verified screenshots:

| Token | Light Mode Value | Dark Mode Value | Notes |
|---|---|---|---|
| **Glass Surface Fill** | `rgba(255, 255, 255, 0.72)` + `blur(20px)` | `rgba(28, 28, 30, 0.72)` + `blur(24px)` | Underlying feed content bleeds subtly through |
| **Glass Specular Edge** | `1px solid rgba(255, 255, 255, 0.85)` + soft shadow | `1px solid rgba(255, 255, 255, 0.14)` | Crisp refractive highlight rim |
| **Active Tab Capsule** | `rgba(0, 0, 0, 0.08)` pill inside glass dock | `rgba(255, 255, 255, 0.14)` pill inside glass dock | Surrounds active tab icon & label |
| **System Font Stack** | `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display"` | Same | Tight negative tracking on titles |

---

## 3. App-by-App iOS Reference Breakdown

### A. WhatsApp iOS (`IMG_5413.PNG`)
- **Chat List Screen**:
  - Top bar: Floating glass circular `•••` menu button left; bold `Chats` title; top-right grouped glass pill `[ ₹ | Camera ]` + solid WhatsApp Green `#1DAA61` / `#25D366` circular `+` button.
  - Row structure: `52px` circle avatar (community rows show stacked rounded-square `12px` card effect), sender title (`16px` semibold), right timestamp (`13px`, `#25D366` if unread, `#8E8E93` if read), 2-line preview with inline icon glyphs (`📷`), circular/pill green unread counter (`47`, `3`, `17`) with dark bold numeral.
  - Bottom Dock: 5-tab floating Liquid Glass capsule (`Updates`, `Calls`, `Communities`, `Chats` with green `396` badge, `You` avatar) + floating Meta AI iridescent ring icon above right.
- **Individual & Group Chat Screen**:
  - Top bar: Glass pill `< 12` back chevron button left; avatar + bold name + online/participants subtitle; floating glass pill right holding Video + Voice call icons.
  - Bubbles: Outgoing `#D9FDD3` (light) / `#005C4B` (dark); Incoming `#FFFFFF` (light) / `#202C33` (dark); softer rounded corners (`16px`), compact corner tail on first/last message, inline bottom-right timestamp + double blue ticks (`#34B7F1` / `#53BDEB`).
  - Composer: Floating glass `+` button left, pill input field with sticker icon, external Camera + Mic glass pill buttons right.

### B. Instagram iOS (`IMG_5414.PNG`)
- **Home Feed & Stories**:
  - Top bar: `+` (Create) top-left, centered `Instagram ⌄` wordmark with dropdown chevron, `♡` heart notifications with red dot top-right.
  - Stories tray: `74px` circular avatars, gradient stroke (`#FEDA75 -> #FA7E1E -> #D62976 -> #962FBF -> #4F5BD5`) on unread stories, `Your story` `+` overlay badge on self avatar.
  - Feed / Reel card: Edge-to-edge media with overlaid top author bar (avatar + handle + verified badge + audio credit + menu), interaction bar below/overlaid (like count, comments, share, save).
  - Bottom Dock: Floating Liquid Glass capsule with `Home`, `Reels`, `DMs` (with red dot), `Search`, `Profile`.
- **Instagram DM Thread**:
  - Back chevron `<` left, `32px` avatar + bold display name + muted `@handle` / `Active now` subtitle, Phone + Video + Info icons right.
  - Outgoing bubbles: vibrant purple-blue-magenta gradient (`linear-gradient(180deg, #5851DB, #833AB4, #C13584)`) or selected theme gradient. Incoming: `#EFEFEF` (light) / `#262626` (dark). Reactions sit overlapping bottom edge of bubbles inside rounded bordered chips.

### C. Telegram iOS (`IMG_5415.PNG`)
- **Chat List Screen**:
  - Top bar: Frosted pill `Edit` left; overlapping circular story avatars + `Chats` center; right circular glass `+` Story icon + `#007AFF` solid blue Compose button.
  - Full-width rounded glass `Search` pill, followed by horizontal frosted folder tabs (`All`, `Trade [5]`, `Chill`, `TradingArena [4]`).
  - Rows: `56px` circular avatars, muted icon beside channel title, date/time right, pin icon or blue/gray pill unread badge.
  - Bottom Dock: 4-tab floating Liquid Glass capsule (`Contacts`, `Calls`, `Chats` with red `96.8K` badge, `Settings` with user avatar + `!`).
- **Telegram Conversation Screen**:
  - Header signature difference: `< Back` left, title + status centered, **circular avatar on the right**!
  - Outgoing bubbles `#E1FFC7`/`#EEFFDE` (light) or `#2B5278` / `#3E6CE6` gradient (dark); Incoming `#FFFFFF` (light) or `#182533` (dark).

### D. Apple iMessage (`iOS 26`)
- Translucent floating glass `<` back button (with badge), centered glass pill/stacked avatar + `Name >`, right floating glass FaceTime icon.
- Optional custom wallpaper layer behind bubbles (iOS 26 feature).
- `#007AFF` (iMessage blue), `#34C759` (SMS green), `#E9E9EB` / `#262629` (incoming gray), centered timestamps, `Delivered` / `Read` right-aligned below last outgoing bubble, floating glass Tapbacks & `+` composer pill.

### E. Discord iOS
- Unified 4-theme palette (`Light`, `Ash`, `Dark`, `Onyx`), full-width flat message rows (no bubbles), 40px avatars, role colors, `APP` blurple badge, `You Bar` card + squircle navigation containers, iOS swipe-back & Dynamic Island safe area.
