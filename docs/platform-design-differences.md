# Platform Design Differences Matrix (iPhone vs Android)

**Research Date**: 2026-11-26  
**Scope**: Complete side-by-side structural, typographic, iconographic, and navigational differences between **iPhone (iOS 26)** and **Android (Android 15/16 Material 3)**.

---

## 1. System & Hardware Viewport Differences

| Element | iPhone (iOS 26) | Android (Android 15 / 16 M3 Expressive) |
|---|---|---|
| **Logical Screen Ratio** | `393 × 852 pt` (~`9:19.5`) | `412 × 915 dp` (~`9:20`) |
| **Top Cutout** | Dynamic Island pill (`120 × 34px` centered capsule) | Centered circular punch-hole (`14px` circle) |
| **Status Bar Left** | Clock (`9:41`, `10:31`) + optional Focus/Location glyph | Clock + small monochrome notification icons |
| **Status Bar Right** | 4 vertical bars + Wi-Fi arcs + Battery capsule with inline `%` (Yellow `#FACC15` when Low Power) | 5G/LTE + triangular cellular signal + Wi-Fi + Horizontal rounded battery pill (Android 16 M3 Expressive) |
| **Bottom System Bar** | `134 × 5px` home indicator (`34px` safe area) | `108 × 4px` gesture navigation pill (`24px` safe area) |
| **Primary Font Stack** | SF Pro Display / SF Pro Text (`-apple-system`) | Roboto / Google Sans Text (`"Roboto", sans-serif`) |
| **Navigation Surface** | **Floating Liquid Glass Capsule** (`backdrop-blur`, specular border, content bleeds under) | **Docked Material 3 Surface** (solid/tonal elevation bar + tonal active pill `#D3E3FD` / `#D9FDD3`) |
| **Back Button Icon** | `<` Thin/Medium Chevron (`ChevronLeft`) + optional label (`Messages`, `12`) | `←` Material Arrow (`ArrowLeft`) — no text label |
| **Overflow Menu Icon** | `•••` Horizontal dots in circular glass button (or Settings gear/`You` tab) | `⋮` Vertical 3 dots (`MoreVertical`) top-right |

---

## 2. Per-App iPhone vs Android Layout Matrix

| App | Header Alignment | Bottom Nav Bar (List Views) | Composer Anatomy |
|---|---|---|---|
| **WhatsApp** | **iOS**: Glass `<` left; centered or compact avatar+name; Video+Call glass pill right.<br>**Android**: `←` arrow + avatar + left-aligned name; Video + Call + `⋮` right. | **iOS**: 5-tab floating Liquid Glass pill (`Updates`, `Calls`, `Communities`, `Chats`, `You` avatar).<br>**Android**: 4-tab Material 3 bar (`Chats`, `Updates`, `Communities`, `Calls`) + green FAB above right. | **iOS**: Floating glass `+` left -> pill input (sticker icon) -> Camera & Mic outside.<br>**Android**: White/dark pill (`Emoji`, input, `Paperclip`, `₹`, `Camera`) + circular green Mic FAB outside. |
| **Instagram** | **Home**: Both share `+` top-left, `Instagram ⌄` center, `♡` top-right.<br>**DM Thread**: **iOS** uses `<` chevron; **Android** uses `←` arrow. | **iOS**: Floating Liquid Glass 5-tab capsule (`Home`, `Reels`, `DMs`, `Search`, `Profile`).<br>**Android**: Edge-to-edge 5-tab bar above gesture pill. | **iOS**: Camera gradient circle left, `Message...`, Mic + Gallery + Sticker right.<br>**Android**: Same core tools with Roboto placeholder and Material touch ripples. |
| **Telegram** | **iOS Chat Thread**: `< Back` left, **centered** title+status, **avatar on right**!<br>**Android Chat Thread**: `←` + **avatar on left** + left-aligned title + Call + Search + `⋮` right. | **iOS**: 4-tab floating Liquid Glass capsule (`Contacts`, `Calls`, `Chats` w/ badge, `Settings`).<br>**Android v12.4.0+**: Persistent 4-tab bottom bar (`Chats`, `Contacts`, `Settings`, `Profile`), NO hamburger drawer! | **iOS**: Glass paperclip left, pill input with sticker icon, Mic/Video toggle right.<br>**Android**: Flat/rounded bar with Emoji left, text input, Paperclip + Mic right. |
| **SMS / Native** | **iOS (iMessage)**: Glass `<` w/ count, centered stacked avatar + `Name >`, FaceTime glass circle.<br>**Android (Google Messages)**: `←` + avatar + left-aligned name, Video + Call + Search + `⋮` + M3 rounded thread sheet. | Thread-focused (no bottom nav inside chat; back returns to thread list). | **iOS**: Glass `+` circle + `iMessage` pill with dictation mic.<br>**Android**: `+` circle + Emoji + `RCS message` pill + Gallery + Mic pill. |
| **Discord** | **iOS**: `<` + `# channel` + topic, edge swipe gestures.<br>**Android**: `←` + `# channel`, predictive back, `⋮` / members icon. | Both use 4-theme unified system (`Light`, `Ash`, `Dark`, `Onyx`) & `You Bar` / squircle navigation on overview screens. | Both use circular `+` + squircle `Message #channel` + Gift/Emoji/Mic; iOS renders inside Liquid-compatible safe area, Android uses Material spacing & gesture bar. |
