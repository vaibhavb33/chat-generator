# Mobile Interface Research (2025–2026 Current Platform Verification)

**Research Date**: 2026-11-26  
**Researcher Role**: Senior Product Researcher, iOS Interface Specialist, Android Interface Specialist, Mobile UI/UX Designer  
**Primary Visual Evidence Inspected Directly**:
- `/Users/vaibhavborkar/Downloads/IMG_5413.PNG` — Real WhatsApp iOS 26 (Dark Mode) Chat List screenshot (captured 10:31, iPhone Dynamic Island, battery 55% yellow Low Power pill).
- `/Users/vaibhavborkar/Downloads/IMG_5414.PNG` — Real Instagram iOS 26 (Dark header/nav) Home Feed & Stories screenshot (captured 10:31, location indicator, battery 54% yellow Low Power pill).
- `/Users/vaibhavborkar/Downloads/IMG_5415.PNG` — Real Telegram iOS 26 (Dark Mode) Chat List screenshot (captured 10:32, muted focus icon, battery 54% yellow Low Power pill).
- **Uncertainty Disclosure**: The referenced pricing image `image(20261126-111354).png` was not present on the local filesystem (`/Users/vaibhavborkar/Downloads`, workspace, or brain storage) during automated inspection. Pricing and Free-vs-Pro split research for `https://www.thefake.design/pricing` was therefore verified via public web search results rather than direct pixel inspection of that image.

---

## Research Summary Table (All 10 Mobile Platform Targets)

| # | Platform | OS | App Version / Generation | Research Date | Primary Source(s) | Verification Confidence |
|---|----------|----|--------------------------|---------------|-------------------|-------------------------|
| 1 | WhatsApp | iOS | iOS 26 / WhatsApp v25–26.x (Liquid Glass rollout) | 2026-11-26 | Direct inspection (`IMG_5413.PNG`), WABetaInfo (`wabetainfo.com`), MacRumors | **High (Direct Pixel + Docs)** |
| 2 | WhatsApp | Android | Android 15–16 / Material 3 floating pill nav (v2.25–2.26.x) | 2026-11-26 | WABetaInfo (`wabetainfo.com`), Android/Croma docs | **High (Docs + Changelog); Unverified build #** |
| 3 | Instagram | iOS | iOS 26 / Instagram 2025–2026 Redesign (Home/Reels/DMs/Search/Profile) | 2026-11-26 | Direct inspection (`IMG_5414.PNG`), SocialMediaToday, Storrito | **High (Direct Pixel + Docs)** |
| 4 | Instagram | Android | Android 15–16 / Unified Meta 2025–2026 Redesign | 2026-11-26 | SocialMediaToday, Instagram Help / Dark mode settings | **Medium-High (Docs); exact APK build unverified** |
| 5 | Telegram | iOS | iOS 26 / Telegram Liquid Glass (v12.x) | 2026-11-26 | Direct inspection (`IMG_5415.PNG`), `telegram.org/blog`, Ghacks | **High (Direct Pixel + Official Blog)** |
| 6 | Telegram | Android | Android 15–16 / Telegram v12.4.0+ (4-tab Liquid Glass, no drawer) | 2026-11-26 | Business Standard, 9to5Google, Techbooky | **High (Exact v12.4.0 documented)** |
| 7 | iMessage | iOS | iOS 26 / Apple Messages (Liquid Glass + Chat Wallpapers + Polls) | 2026-11-26 | `apple.com`, MacRumors, AppleInsider, CNET | **High (Official Apple HIG / WWDC)** |
| 8 | Android Messages | Android | Android 16 / Google Messages (Material 3 Expressive + RCS) | 2026-11-26 | `design.google`, `blog.google`, 9to5Google, Android Authority | **High (Official Google M3 Expressive)** |
| 9 | Discord | iOS | iOS 26 / Discord Mobile Redesign (You Bar + Squircle + Ash/Onyx) | 2026-11-26 | `discord.com` blog, TechCrunch, Notebookcheck | **Medium-High (Official Blog); exact 2026 build unverified** |
| 10 | Discord | Android | Android 15–16 / Discord Mobile Redesign (Material gestures + Squircle) | 2026-11-26 | `discord.com` blog, Indian Express | **Medium-High (Official Blog); exact APK build unverified** |

---

## Detailed Platform Research Records

### 1. WhatsApp — iPhone (iOS 26 Liquid Glass)
- **Operating System**: iOS 26 (`393×852pt` iPhone 15/16/17 Pro baseline, 3x DPR, Dynamic Island safe area top `59px` / bottom `34px`).
- **App Version**: WhatsApp Messenger iOS `v25.x`–`v26.45.10.70` (gradual Liquid Glass rollout).
- **Direct Visual Reference (`IMG_5413.PNG`)**:
  - **Status Bar**: Time `10:31` + silent muted bell icon left; Dynamic Island pill center; 4-bar cellular signal + Wi-Fi + horizontal rounded battery capsule with numeric percentage (`55` in yellow Low Power fill) right.
  - **Chat List Header**: Floating circular glass `•••` button left + bold `Chats` title; top-right dual-icon glass pill (`₹` payments badge + camera icon) + standalone `#25D366` / `#1DAB61` green circular `+` compose button.
  - **Chat Conversation Header**: Back chevron `<` (with unread count pill in glass or blue/green accent) + circular avatar + contact/group title + subtitle (`online`, `typing...`, participant list) + Video & Voice call buttons.
  - **Bottom Navigation (Chat List View)**: Floating iOS 26 Liquid Glass rounded capsule (`rounded-full`, translucent dark/light frosted blur with specular 1px border) holding 5 tabs: `Updates`, `Calls`, `Communities`, `Chats` (active pill highlight + green `396` unread badge), `You` (user circular avatar). Floating iridescent Meta AI ring button above bottom-right.
  - **Typography & Spacing**: SF Pro Display / SF Pro Text (`-apple-system`), row height ~74px, avatar 52px circle (or stacked rounded-square cards for Communities/Announcements), unread timestamps and count pills in WhatsApp Green (`#25D366` dark / `#1DAA61` light).
  - **Bubbles & Attachments (Chat Thread)**: Softer, rounder bubble corners (`16–18px` radius with compact corner tail), frameless edge-to-edge image/video thumbnails inside bubbles, floating glass composer bar (`+` button left, pill input with sticker/media icon right, camera + mic icons outside).
  - **Light / Dark Mode**: Light (`#EFEAE2` classic doodle wallpaper, `#D9FDD3` outgoing, `#FFFFFF` incoming, translucent `#F6F6F6/80` glass bars); Dark (`#0B141A` OLED/deep slate doodle wallpaper, `#005C4B` outgoing, `#202C33` incoming, `#1C1C1E/75` smoky glass bars).

### 2. WhatsApp — Android (Android 15/16 Material Design 3)
- **Operating System**: Android 15 / 16 (`412×915dp` Pixel 9 baseline, punch-hole camera cutout, edge-to-edge gesture bar bottom `24px`).
- **App Version**: WhatsApp Messenger Android `2.25.x`–`2.26.x` (Material 3 floating/pill nav rollout; gradual server-side A/B).
- **Source URLs**: `https://wabetainfo.com/`, `https://www.whatsapp.com/`.
- **Interface Characteristics**:
  - **Status Bar**: Left-aligned clock, optional small notification glyphs; right-aligned Wi-Fi, 5G/LTE signal triangle, horizontal pill battery (Android 16 M3 Expressive style) or vertical battery (Android 14/15).
  - **Chat List Header**: `WhatsApp` bold green/white brand wordmark top-left (or `Chats`), top-right Camera, Search (or docked rounded pill search bar `Ask Meta AI or Search`), and 3-dot overflow menu (`MoreVertical`).
  - **Bottom Navigation**: Material 3 bar with tonal rounded pill active indicator (`#D9FDD3` light / `#005C4B` dark tint) for `Chats`, `Updates`, `Communities`, `Calls` (note: Android keeps `Calls` on 4th tab and keeps settings under top-right 3-dot menu / profile icon, whereas iOS 26 screenshot shows `You` tab with avatar as 5th tab). Floating rectangular-rounded FAB (`rounded-2xl`, green `#1DAA61` / `#25D366`) for New Chat above bottom-right.
  - **Chat Thread Header**: Left Material `ArrowLeft` (never iOS chevron!), 36–40px avatar, left-aligned contact name + status, right Video, Voice, and 3-dot menu (`MoreVertical`).
  - **Composer**: Floating white/dark pill input (`Emoji` left, text field, `Paperclip` attach + `₹`/payment + `Camera` inside pill) + circular green `Mic` / `Send` FAB outside on right.
  - **Uncertainty**: Android 2026 progressive-blur floating pill bottom nav vs edge-to-edge Material 3 docked bar varies by WhatsApp server-side flag; our implementation should align with Material 3 edge-to-edge / tonal pill convention and avoid iOS Liquid Glass capsule styling on Android.

### 3. Instagram — iPhone (iOS 26)
- **Operating System**: iOS 26.
- **App Version**: Instagram iOS 2025–2026 Redesign.
- **Direct Visual Reference (`IMG_5414.PNG`)**:
  - **Status Bar**: `10:31` + location arrow icon left; signal, Wi-Fi, yellow `54` battery right.
  - **Home Top Header**: Left `+` (Create) button — **crucial update**: Create moved from bottom center to top-left! Center `Instagram ⌄` script logo with dropdown chevron; Right `♡` Activity/Notifications heart icon with red unread dot (**DMs moved out of top-right into bottom nav**).
  - **Stories Tray**: Horizontal row directly under Home header. `Your story` avatar (72px) with bottom-right `+` dark-ringed white badge, followed by rainbow gradient ring avatars (`hit___9898`, `ganyaa_wankhed...`) with truncated usernames.
  - **Home Feed / Reels Card**: Edge-to-edge media (`4:5` or full-bleed reel card), overlaid header with avatar + username + verified blue checkmark + audio line (`♪ username · Original audio`) + menu button, bottom-right mute speaker icon pill.
  - **Bottom Navigation (Home/Feed/Profile)**: Floating iOS 26 dark frosted-glass capsule (`Home` -> `Reels` -> `DMs` paper plane with unread red dot -> `Search` -> `Profile` avatar).
  - **DM Conversation View**: Left `<` chevron back, 32–36px avatar + bold Display Name + gray `@handle` / `Active now` subtitle, right Phone, Video, Info/Flag icons. Outgoing bubbles use purple-blue-pink gradient (`#5851DB` -> `#833AB4` -> `#C13584` or blue-purple theme gradient), incoming bubbles `#EFEFEF` (light) / `#262626` (dark). Composer pill has camera blue/purple circle left, `Message...` placeholder, Mic, Photo gallery, Sticker/AI icons right.

### 4. Instagram — Android (Android 15/16)
- **Operating System**: Android 15 / 16.
- **App Version**: Instagram Android 2025–2026 Redesign.
- **Source URLs**: `https://www.socialmediatoday.com/`, Instagram Help Center.
- **Interface Characteristics**:
  - Mirrors Meta's unified **Home -> Reels -> DMs -> Search -> Profile** bottom bar and top-left `+` create button rollout, with Material `ArrowLeft` in DM/sub-pages, Roboto font rendering, Android status bar, and edge-to-edge gesture navigation bar (`24dp`) instead of iOS Liquid Glass floating pill capsule.
  - Supports dedicated in-app Dark Mode setting (`On` / `Off` / `System default`) using true black (`#000000`) or deep charcoal (`#121212`) backgrounds and `#262626` incoming DM bubbles.
  - **Uncertainty**: Meta runs staggered UI experiments on the bottom bar (`Home / Reels / DMs / Search / Profile` vs `Home / Search / + / Reels / Profile`). Our implementation follows the documented 2025–2026 layout confirmed in `IMG_5414.PNG`.

### 5. Telegram — iPhone (iOS 26 Liquid Glass)
- **Operating System**: iOS 26.
- **App Version**: Telegram iOS v12.x (Liquid Glass release).
- **Direct Visual Reference (`IMG_5415.PNG`)**:
  - **Status Bar**: `10:32` + muted bell icon left; signal, Wi-Fi, `54` yellow battery pill right.
  - **Chat List Header**: Floating glass pill `Edit` top-left; overlapping story bubbles + `Chats` bold title center; right glass circular `+` Story crosshair button + Telegram Blue (`#007AFF`) circular Compose button.
  - **Search & Folder Tabs**: Full-width frosted search pill (`🔍 Search`), followed by horizontal frosted folder tabs bar (`All` selected lighter glass pill, `Trade [5]`, `Chill`, `TradingArena [4]`).
  - **Chat List Rows**: `Archived Chats` blue circle folder icon; channels/groups with 56px circular avatars, bold titles, mute slash icon, right-aligned timestamps (`10:28 PM`, `23/04`), pin icon or rounded blue (`35`) / gray (`4.4K`, `54.6K`) unread counters.
  - **Bottom Navigation**: Floating Liquid Glass capsule with 4 tabs: `Contacts`, `Calls`, `Chats` (active highlight + red `96.8K` badge), `Settings` (avatar + red `!` badge).
  - **Individual / Group Chat View**: iOS translucent header with `<` Back + unread pill left, centered title + subtitle (`online` / `last seen...` / `N members, M online`), circular avatar right (distinct iOS Telegram pattern: avatar is on the **right** of the chat header, unlike WhatsApp/Android where avatar is left of title!). Bottom bar: frosted paperclip left, pill message input with sticker icon, mic/video-message toggle right. Outgoing bubbles: `#EEFFDE` (light) / `#2B5278` or Telegram blue-violet `#3E6CE6` gradient (dark); incoming: `#FFFFFF` (light) / `#182533` or `#212121` (dark).

### 6. Telegram — Android (v12.4.0+ Liquid Glass Unified Tab Bar)
- **Operating System**: Android 15 / 16.
- **App Version**: Telegram for Android `v12.4.0+`.
- **Source URLs**: `https://telegram.org/blog`, `9to5google.com`, `business-standard.com`.
- **Interface Characteristics**:
  - **Major Update (`v12.4.0`)**: Removed the legacy left hamburger drawer! Replaced with a persistent **4-tab bottom navigation bar** (`Chats`, `Contacts`, `Settings`, `Profile`), translucent rounded cards, and a top-right 3-dot overflow menu (`MoreVertical`) for New Group / New Channel actions.
  - **Chat Thread Header**: Left Material `ArrowLeft` -> Avatar -> Title + Subtitle left-aligned (`#517DA2` classic blue or `#FFFFFF` clean header in light mode; `#17212B` / `#212D3B` in dark mode) -> Call / Search / 3-dot overflow right.
  - **Typography**: Roboto, inline checkmarks + timestamp inside bottom-right of bubble, subtle bottom-corner tail on last message in cluster.

### 7. iMessage — iPhone (iOS 26 Liquid Glass)
- **Operating System**: iOS 26.
- **App Version**: Apple Messages (bundled with iOS 26).
- **Source URLs**: `https://www.apple.com/`, `macrumors.com`, `appleinsider.com`.
- **Interface Characteristics**:
  - **Header**: Translucent floating Liquid Glass pill `<` back button (with optional unread badge count) on left; centered floating glass avatar + contact name pill (`Name >`) or stacked group avatars; floating FaceTime video glass circle on right.
  - **Chat Surface**: Default crisp `#FFFFFF` (light) / `#000000` (dark), PLUS newly supported custom chat wallpapers in iOS 26 (`IMG` / gradient backdrop behind bubbles).
  - **Bubbles**: Outgoing iMessage `#007AFF` (or `#0A84FF` in dark mode); Outgoing SMS `#34C759` (`#30D158` dark); Incoming `#E9E9EB` (light) / `#262629` (dark). `18px` pill-rounded bubbles with iconic sweeping tail on the last bubble of a consecutive group. Timestamps centered above blocks (`Today 9:41 AM`), `Delivered` / `Read 9:42 AM` subtle gray label below last outgoing bubble.
  - **Tapbacks & Composer**: Floating translucent Tapback pill anchored to top-right/top-left corner of bubble (support standard 6 reactions + custom emoji/stickers). Floating glass composer: `+` circular glass button left (Apps / Polls / Photos / Audio), rounded pill `iMessage` input with dictation mic inside right.
  - **Device Rule**: iMessage is an iOS-native Apple app (does not exist on Android; if Android device is selected on `/imessage-generator`, document/present SMS/RCS fallback behavior clearly or lock authentic iOS Messages chrome while updating status bar cleanly — we will inspect exact UX decision in Phase 2/9).

### 8. Android Messages — Google Messages (Android 16 Material 3 Expressive)
- **Operating System**: Android 16 (and Android 15 QPR).
- **App Version**: Google Messages (`messages.android` 2025–2026 Material 3 Expressive).
- **Source URLs**: `https://design.google/`, `https://blog.google/`, `9to5google.com`, `androidcentral.com`.
- **Interface Characteristics**:
  - **Header**: Top bar with Material `ArrowLeft`, circular contact avatar, bold contact name, right Video call, Phone call, Search, and 3-dot overflow menu. Below/integrated container has rounded top corners (`rounded-t-3xl`) in Material 3 Expressive separating the thread container from the top bar!
  - **Bubbles & RCS**:
    - Light Mode RCS Outgoing: `#0B57D0` or `#D3E3FD` tonal pill depending on dynamic color (white text on `#0B57D0` or deep navy `#041E49` on `#D3E3FD`); Dark Mode RCS Outgoing: `#A8C7FA` (dark navy `#062E6F` text) or `#004A77` tonal blue.
    - Incoming: `#E8EDF5` / `#F0F4F9` (light), `#24262F` / `#2B2D35` (dark).
    - SMS mode uses teal/slate bubble styling with `Text message • SIM 1` composer label instead of `RCS message`.
  - **Receipts**: Circled single checkmark (`Sent`), double circled checkmarks outlined (`Delivered`), double filled checkmarks (`Read`), plus `End-to-end encrypted` lock badge next to RCS status.
  - **Composer**: Material 3 pill composer (`+` attach button left, emoji button, `RCS message` input, Photomoji/Magic Compose spark icon, camera/mic pill on right).

### 9. Discord — iPhone (iOS 26)
- **Operating System**: iOS 26.
- **App Version**: Discord iOS Mobile Redesign (`2025–2026`, Squircle + You Bar + 4-Theme Unified Palette).
- **Source URLs**: `https://discord.com/blog/`, `techcrunch.com`, `friendcordapp.com`.
- **Interface Characteristics**:
  - **Bottom Navigation ("You Bar")**: 3/4 main sections (`Home` / Servers+Messages, `Notifications`, `You` profile card) when viewing servers/DMs list, hiding inside active channel view or showing persistent quick-reply bar.
  - **Themes (Unified across Desktop/Mobile)**: `Light` (`#FFFFFF`), `Ash` (`#313338` classic dark gray), `Dark` (`#1A1A1E` deeper charcoal), `Onyx` (`#000000` true OLED black).
  - **Chat View Header**: Hamburger/back arrow left, `# channel-name` (or `@username` DM) with channel topic chevron, right Search, Threads, and Members drawer icon.
  - **Messages**: Flat full-width message rows (NOT chat bubbles!), 40px circular avatar left, colored role display name + optional `APP`/`BOT` blurple (`#5865F2`) tag + timestamp (`Today at 10:31 AM`), markdown/code blocks, embeds with left colored border, reaction pills (`rounded-lg` squircle chips with blurple active state).
  - **Composer**: Circular `+` button, squircle `Message #general` field, Gift/Apps/Emoji icons, voice mic or blue/blurple send icon.

### 10. Discord — Android (Android 15/16)
- **Operating System**: Android 15 / 16.
- **App Version**: Discord Android Mobile Redesign (`2025–2026`).
- **Source URLs**: `https://discord.com/blog/`, `indianexpress.com`, `notebookcheck.net`.
- **Interface Characteristics**:
  - Identical 4-theme system (`Light`, `Ash`, `Dark`, `Onyx`), squircle geometry, and message-row anatomy as iOS Discord, differentiated by Android status bar (clock left, punch-hole cutout, M3 battery/signal), Roboto/gg-sans typography fallbacks, Material `ArrowLeft` navigation, and Android gesture pill (`24px` safe area bottom).

---

## Documentation of Uncertainties
1. Exact semantic build numbers for 2026 WhatsApp Android (`2.26.x`), Instagram iOS/Android, and Discord iOS/Android are rolled out continuously via server-side A/B flags; design specs reflect publicly confirmed 2025–2026 releases and direct screenshots (`IMG_5413.PNG`, `IMG_5414.PNG`, `IMG_5415.PNG`).
2. `image(20261126-111354).png` was unavailable locally; all competitor comparison notes for `thefake.design/pricing` come from public web search indexing and are kept cleanly separated from ChatForge's own INR pricing architecture.
