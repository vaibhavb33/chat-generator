# Free & Premium Feature Comparison (Inspired by TheFake, Engineered for ChatForge)

**Research Date**: 2026-11-26  
**Competitor Reference Researched**: `https://www.thefake.design/pricing` (via public web indexing; note local screenshot `image(20261126-111354).png` was unavailable for direct inspection).  
**Important Rule**: ChatForge uses **its own branding, own UX copy, own INR pricing architecture**, and never simulates fake payments or watermarks free PNG exports.

---

## 1. Benchmark Insights from Competitor Research (`thefake.design/pricing`)

Publicly documented freemium structure of `thefake.design`:
- **Free Tier**: Unlocks all basic templates/layouts, locale support, unlimited watermark-free PNG exports without mandatory signup, and basic cloud sync with a free account.
- **Pro Tiers**: Gated advanced creator workflows — AI script writer ("Magic Write"), animated video exports (up to 4K / 60 FPS), multi-slide carousel / batch ZIP exports, and reusable character library (up to 100 characters), sold on short-pass (7-day), monthly, and lifetime intervals.

---

## 2. ChatForge Feature Access Matrix (Free vs Pro)

| Capability | ChatForge Free (`₹0 Forever`) | ChatForge Pro (`Weekly / Monthly / Lifetime`) |
|---|---|---|
| **Core Generators** | All 10 platform generators (WhatsApp, WA Group, IG DM, IG Story, IG Post, iMessage, Android Messages, Telegram, Discord, Fake Call) | All generators + early access templates |
| **Device Modes** | **iPhone** & **Android** (full viewport & OS layouts) | Both + High-DPI export scaling |
| **Appearances** | **Light** & **Dark** across both iPhone and Android | Same + custom advanced studio backdrops |
| **Realistic Full-Screen Previews** | Full-screen app chrome (Chat Lists, Chats, Home Feed, Stories, Posts, Channels, Calls) | Full access |
| **Preview Editing** | Direct Edit action in preview + click-to-edit elements (avatar, name, message, timestamp, status bar, wallpaper) | Same + Reusable Character Library |
| **Static Image Exports** | **PNG & JPG** (1x / 2x Retina, **100% watermark-free**, no account required) | **PNG, JPG, WebP**, 3x Ultra HD, **Batch PNG ZIP**, **Carousel Set Export** |
| **Project Persistence** | Local **IndexedDB** Save Chat, auto-save, restore after refresh, duplicate, rename, delete, `.JSON` export/import | Cloud Sync Library + Bulk Project Management + Reusable Character Profiles |
| **AI Conversation Generator** | View sample presets only | **Pro Gated**: Multi-turn AI conversation & reply script generator + tone rewriter |
| **AI Writing Assistant** | Locked behind Pro modal | **Pro Gated**: Smart message polish, slang/locale adaptation, comedy/support rewrites |
| **Video & Animation Engine** | Timeline preview inspection | **Pro Gated**: MP4/WebM export (1080p, 4K where device-supported), 30/60 FPS, advanced typing/scroll/receipt timing controls |
| **Advanced Rendering & Scenes** | Standard Studio presets | **Pro Gated**: Pro scene templates, gradient studio backdrops, custom animation easing |

---

## 3. Configurable Billing Architecture (INR Default for Indian Market)

All pricing values, currency (`INR` default, switchable to `USD` / `EUR`), interval permissions, and feature entitlements live in a single configurable registry (`src/core/billing/plansConfig.ts`) rather than hardcoded competitor strings:

| Plan ID | Interval | Default Display Price (INR) | Optional International (USD) | Key Entitlements |
|---|---|---|---|---|
| `free` | Forever | `₹0` | `$0` | All generators, iPhone/Android, Light/Dark, watermark-free PNG/JPG, local IndexedDB Save Chat |
| `weekly` | 7-Day Pass | `₹149` | `$2.99` | Full Pro unlock for 7 days (ideal for one-off reels/campaigns) |
| `monthly` | Monthly | `₹299 / mo` | `$5.99 / mo` | Full Pro unlock, AI conversation suite, 4K/60fps video, carousel/batch ZIP, character library |
| `lifetime` | One-Time | `₹1,999` | `$39.00` | Permanent Pro access across all future ChatForge Studio tools |

- **Strict Payment Integrity**: Billing upgrades integrate via a configurable payment provider configuration (e.g., Razorpay / Stripe checkout endpoint or provider config); **never** simulate or fake a completed payment inside the browser. When no live merchant provider key is configured, the upgrade action displays an honest billing-configuration notice ("Payment provider checkout not yet configured in this environment") rather than pretending payment succeeded.
