# Platform Visual Specifications (iPhone iOS 26 & Android Material 3)

**Document Version**: 2.0  
**Last Verified**: 2026-11-26  
**Supported Device Modes**: `iphone` (iOS 26 Liquid Glass) and `android` (Android 15/16 Material 3 Expressive)  
**Supported Appearances**: `dark` and `light` (independent 2×2 matrix per generator)

---

## 1. System Viewport & Safe Area Specifications

### iPhone (`iphone` — iOS 26)
- **Preview Width**: `393px` max logical screen (`rounded-[30px]` mobile / `rounded-[38px]` screen inside `46px` bezel on desktop)
- **Status Bar (`StatusBar.tsx` -> `status-bar-iphone`)**:
  - Height: `44px` (`h-11`)
  - Font: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display"` (`13px` semibold, tabular numerals)
  - Cutout: Centered Dynamic Island pill (`86px × 22px`, `bg-black rounded-full`)
  - Indicators: 4 ascending cellular bars, 3-arc Wi-Fi, numeric battery capsule (`26px × 13px`) with inline percentage (`#FACC15` when <= 60%, `#34C759` charging, `#FF3B30` <= 20%)
- **Bottom Home Indicator (`ios-home-indicator`)**: Centered `134px × 4.5px` translucent pill inside `20px` bottom safe area

### Android (`android` — Android 15/16 Material 3 Expressive)
- **Preview Width**: `404px` max logical screen (`rounded-[24px]` mobile / `rounded-[26px]` screen inside `34px` bezel on desktop)
- **Status Bar (`StatusBar.tsx` -> `status-bar-android`)**:
  - Height: `36px` (`h-9`)
  - Font: `"Roboto", "Google Sans Text", system-ui, sans-serif` (`12px` medium, tabular numerals)
  - Cutout: Centered circular punch-hole (`h-3.5 w-3.5 rounded-full bg-black/90`)
  - Indicators: Left clock + status dot; right carrier (`5G`/`LTE`), Wi-Fi, triangular cellular ramp, horizontal rounded battery pill (`24px × 13px`) with inline `%`
- **Bottom Gesture Bar (`android-gesture-bar`)**: Centered `108px × 3.5px` pill inside `16px` bottom safe area

---

## 2. Per-App Visual Specifications

| App / Route | iPhone Light & Dark | Android Light & Dark | Full-Screen Modes |
|---|---|---|---|
| **WhatsApp** (`/whatsapp-chat-generator/`, `/whatsapp-group-chat-generator/`) | `<` Chevron back, iOS `+` glass composer, external Camera/Mic; **Chat List** features `•••` glass menu, `[₹ \| Camera]` pill, green `+`, 5-tab Liquid Glass dock (`Updates`, `Calls`, `Communities`, `Chats`, `You`) + Meta AI | `←` Material arrow, `⋮` overflow, Emoji/Paperclip/Camera pill + green Mic FAB; **Chat List** features `WhatsApp` header, filter chips (`All`, `Unread`, `Favorites`, `Groups`), 4-tab M3 bar + green squircle FAB | `Chat View` / `Group View` & `Chat List` |
| **Instagram** (`/instagram-dm-generator/`, `/instagram-post-generator/`, `/instagram-story-generator/`) | Home bar (`+` top-left, `Instagram ⌄`, `♡` w/ unread dot), Stories gradient ring tray, DM `<` chevron, gradient `#5851DB` -> `#C13584` bubbles, 5-tab Liquid Glass bottom capsule (`Home`, `Reels`, `DMs`, `Search`, `Profile`) | Material `←` arrow in DM, Roboto typography, edge-to-edge solid 5-tab navigation bar above gesture pill | `Home Feed`, `Post Card`, `Stories`, `DM Thread` |
| **Telegram** (`/telegram-chat-generator/`) | `< Chats` back left, centered title/subtitle, **circular avatar on right**; **Chat List** features frosted `Edit`, overlapping stories + `Chats`, `+` crosshair & `#007AFF` compose, `Search` pill, folder tabs, 4-tab Liquid Glass dock (`Contacts`, `Calls`, `Chats`, `Settings`) | `←` Material arrow + **left-aligned avatar** + title, `⋮` overflow; **Chat List (v12.4.0+)** drops hamburger drawer for persistent 4-tab bar + floating blue compose FAB | `Chat / Group` & `Chat List` |
| **iMessage** (`/imessage-generator/`) | Glass `<` w/ count, centered stacked/single avatar + `Name >`, FaceTime glass circle, `#007AFF`/`#0A84FF` blue & `#34C759` SMS green bubbles, Tapbacks, `Delivered`/`Read`, glass `+` composer | Switches system chrome to Android punch-hole status bar + displays honest cross-platform SMS/RCS compatibility banner | `Conversation` (Direct & Group) |
| **Android Messages** (`/android-message-generator/`) | Cross-platform preview chrome if toggled to iPhone | Google Messages Material 3 Expressive: `#EFF3F9`/`#1D1F27` header, `←` arrow, `rounded-t-3xl` thread container, `#0B57D0`/`#A8C7FA` RCS bubbles, circled checkmarks, E2E notice, M3 pill composer | `RCS / SMS Thread` |
| **Discord** (`/discord-chat-generator/`) | Supports Mobile Chat & DM modes w/ iOS status bar + Dark/Light themes (`Light`, `Ash` `#313338`) | Supports Mobile Chat & DM modes w/ Android punch-hole status bar + Dark/Light themes | `Desktop Server`, `Mobile Chat`, `Direct Message` |
| **Fake Call Screen** (`/fake-call-generator/`) | iPhone Call / FaceTime layout (`Decline` / `Accept` circles, blur avatar backdrop, numeric keypad, incoming/outgoing/active/missed states) | Android Call UI layout with Material action controls & punch-hole status bar | `Incoming`, `Outgoing`, `Ongoing`, `Missed` |
