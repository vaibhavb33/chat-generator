# Free & Premium Feature Access Architecture

**Document Version**: 2.0  
**Last Verified**: 2026-11-26  
**Modules**:
- Pricing & Catalog Registry: `src/core/billing/plansConfig.ts`
- Entitlements Store: `src/core/billing/entitlements.ts`
- Upgrade Modal: `src/components/studio/PremiumUpgradeModal.tsx`

---

## 1. Free Tier (`₹0 Forever`, Zero Registration Required)

Every user receives unrestricted access to:
- All 10 dedicated generator routes & full-screen app previews
- iPhone & Android device modes + Dark & Light appearances
- Click-to-edit preview elements, message composer, participant management, timestamps, reactions, and starter templates
- **100% watermark-free PNG & JPG screenshot exports** (`1x` and `2x`) + WebP
- Local **Save Chat** via IndexedDB (auto-save, refresh persistence, restore, rename, duplicate, delete with confirmation, `.JSON` export/import)

---

## 2. Gated Pro Features (14 Capabilities)

Verified via `isPlanEntitledToFeature(plan, feature)`:
1. `ai_conversation_generator` — Multi-turn AI conversation drafting
2. `ai_writing_assistant` — Tone & localization AI rewriter
3. `animated_playback` — Animated typing & reveal playback enhancements
4. `video_export` — HD MP4/WebM Reels & Shorts video rendering
5. `video_4k_export` — 4K (2160p) hardware-checked video rendering
6. `video_60fps_export` — 60 FPS smooth frame capture
7. `advanced_animation_controls` — Granular per-message timing & keyboard sync
8. `carousel_export` — Multi-slide carousel sequence exports
9. `batch_png_export` — Multi-device/appearance batch PNG export packs
10. `reusable_character_library` — Cross-project character persona vault
11. `advanced_templates` — Pro storytelling & campaign template packs
12. `advanced_rendering` — `3x` Ultra HD scaling & studio rendering options
13. `cloud_project_management` — Cloud sync & bulk project management
14. `premium_scene_templates` — Pre-built multi-screen creator scenes

---

## 3. Configurable Pricing & Honest Payment Provider Integration

- Default market currency is **INR (`₹`)** (`Free: ₹0`, `Weekly Pass: ₹149`, `Monthly: ₹299`, `Lifetime: ₹1,999`), configurable dynamically alongside `USD` and `EUR` inside `PRICING_PLANS` and `DEFAULT_BILLING_SETTINGS`.
- **Zero Fake Checkout Policy**: `startProviderCheckout(planId)` checks `paymentProvider.isConfigured` and `paymentProvider.checkoutBaseUrl` (populated via `NEXT_PUBLIC_BILLING_PROVIDER` and `NEXT_PUBLIC_CHECKOUT_URL`). When no live gateway is configured, it surfaces a transparent configuration notice (`billing-provider-notice`) and never simulates a fake purchase or client-side Pro bypass.
