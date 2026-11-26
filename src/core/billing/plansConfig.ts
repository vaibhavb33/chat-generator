export type CurrencyCode = 'INR' | 'USD' | 'EUR';

export type PlanTier = 'free' | 'weekly' | 'monthly' | 'lifetime';

export type PremiumFeatureKey =
  | 'ai_conversation_generator'
  | 'ai_writing_assistant'
  | 'animated_playback'
  | 'video_export'
  | 'video_4k_export'
  | 'video_60fps_export'
  | 'advanced_animation_controls'
  | 'carousel_export'
  | 'batch_png_export'
  | 'reusable_character_library'
  | 'advanced_templates'
  | 'advanced_rendering'
  | 'cloud_project_management'
  | 'premium_scene_templates';

export interface PremiumFeatureDefinition {
  key: PremiumFeatureKey;
  title: string;
  tagline: string;
  description: string;
  freeBehavior: string;
  proBehavior: string;
  previewSummary: string;
}

export interface PricingPlanConfig {
  id: PlanTier;
  name: string;
  badge?: string;
  intervalLabel: string;
  description: string;
  prices: Record<CurrencyCode, number>;
  highlights: string[];
}

export interface BillingSettingsConfig {
  currency: CurrencyCode;
  currencySymbols: Record<CurrencyCode, string>;
  paymentProvider: {
    provider: 'none' | 'razorpay' | 'stripe';
    isConfigured: boolean;
    checkoutBaseUrl?: string;
    merchantLabel: string;
  };
}

export const DEFAULT_BILLING_SETTINGS: BillingSettingsConfig = {
  currency: 'INR',
  currencySymbols: {
    INR: '₹',
    USD: '$',
    EUR: '€',
  },
  paymentProvider: {
    provider: 'none',
    isConfigured: Boolean(process.env.NEXT_PUBLIC_BILLING_PROVIDER && process.env.NEXT_PUBLIC_CHECKOUT_URL),
    checkoutBaseUrl: process.env.NEXT_PUBLIC_CHECKOUT_URL,
    merchantLabel: 'ChatForge Studio Billing',
  },
};

export const PRICING_PLANS: PricingPlanConfig[] = [
  {
    id: 'free',
    name: 'Free Creator',
    intervalLabel: 'Forever',
    description: 'Build realistic iPhone & Android app screenshots with zero watermarks.',
    prices: { INR: 0, USD: 0, EUR: 0 },
    highlights: [
      'All 10 iPhone & Android generators',
      'Dark & Light native appearances',
      'Watermark-free PNG & JPG exports',
      'Local Save Chat & browser restore',
      'Full interactive preview editing',
    ],
  },
  {
    id: 'weekly',
    name: 'Pro 7-Day Pass',
    badge: 'Quick Campaign',
    intervalLabel: 'One-time • 7 Days',
    description: 'Ideal for short launches, reels sprints, and client pitch decks.',
    prices: { INR: 149, USD: 2.99, EUR: 2.79 },
    highlights: [
      'Full MP4 & WebM animated video export',
      'AI conversation & tone assistant',
      'Batch PNG & Carousel ZIP exports',
      '1080p & browser-supported 4K/60 FPS',
    ],
  },
  {
    id: 'monthly',
    name: 'Pro Studio',
    badge: 'Most Popular',
    intervalLabel: 'Per Month',
    description: 'Complete video storytelling, AI scripting, and cloud sync workspace.',
    prices: { INR: 299, USD: 5.99, EUR: 5.49 },
    highlights: [
      'Everything in Weekly Pass',
      'Reusable Character Library (up to 100)',
      'Cloud project library & multi-device sync',
      'Premium studio scene backdrops & templates',
    ],
  },
  {
    id: 'lifetime',
    name: 'Pro Lifetime',
    badge: 'Best Value',
    intervalLabel: 'One-Time Payment',
    description: 'Pay once and unlock every Pro creator tool & future OS theme permanently.',
    prices: { INR: 1999, USD: 39, EUR: 35 },
    highlights: [
      'Permanent Pro feature access',
      'All future iOS & Android interface packs',
      'Unlimited character presets & batch exports',
      'Priority rendering enhancements',
    ],
  },
];

export const PREMIUM_FEATURE_CATALOG: Record<PremiumFeatureKey, PremiumFeatureDefinition> = {
  ai_conversation_generator: {
    key: 'ai_conversation_generator',
    title: 'AI Conversation Generator',
    tagline: 'Generate multi-speaker dialogues in seconds',
    description: 'Draft full WhatsApp, iMessage, Instagram DM, or Discord threads from a short prompt with natural pacing.',
    freeBehavior: 'Manual message composer & starter screenplay templates',
    proBehavior: 'One-click multi-turn AI thread drafting across any tone or language',
    previewSummary: 'Generates 6–15 realistic messages with sender turns, timestamps, and reactions automatically.',
  },
  ai_writing_assistant: {
    key: 'ai_writing_assistant',
    title: 'AI Writing & Tone Assistant',
    tagline: 'Rewrite messages in authentic casual, sales, or comedic styles',
    description: 'Instantly polish grammar, localize idioms, or adapt dialogue length to fit realistic mobile bubbles.',
    freeBehavior: 'Direct inline text editing & quick emoji bar',
    proBehavior: 'Context-aware AI tone rewriting & Hinglish/regional localization',
    previewSummary: 'Transforms stiff drafts into believable real-world mobile texting styles.',
  },
  animated_playback: {
    key: 'animated_playback',
    title: 'Animated Message Playback',
    tagline: 'Preview real-time typing bubbles & sequential reveals',
    description: 'Play back conversations step-by-step with customizable delays, typing bubbles, and scroll pacing.',
    freeBehavior: 'Static screenshot composition & manual timeline inspection',
    proBehavior: 'Smooth animated playback with typing indicators & receipt transitions',
    previewSummary: 'Simulates real-time texting cadence directly inside the selected device screen.',
  },
  video_export: {
    key: 'video_export',
    title: 'HD Story Video Export',
    tagline: 'Render Reels & YouTube Shorts MP4/WebM videos locally',
    description: 'Turn any scripted conversation into a vertical 9:16, 4:5, or 1:1 animated video ready for social feeds.',
    freeBehavior: 'Unlimited watermark-free PNG & JPG screenshot exports',
    proBehavior: 'MP4 / WebM animated video rendering with progress tracking',
    previewSummary: 'Exports message-by-message typing, voice waveform motion, and scroll animations.',
  },
  video_4k_export: {
    key: 'video_4k_export',
    title: '4K Ultra HD Video Export',
    tagline: 'Crisp 2160p vertical storytelling where hardware-supported',
    description: 'Export ultra-sharp high-bitrate video frames verified against your browser encoder capabilities.',
    freeBehavior: 'Static HD screenshots only',
    proBehavior: '4K (2160×3840) & 1080p lossless canvas pipeline when encoder supports it',
    previewSummary: 'Eliminates text compression blur on high-DPI OLED displays.',
  },
  video_60fps_export: {
    key: 'video_60fps_export',
    title: '60 FPS Smooth Motion Export',
    tagline: 'Silky typing, scroll, and reaction micro-animations',
    description: 'Double frame cadence for buttery bubble pops and scrolling feeds on supported devices.',
    freeBehavior: 'Static frame capture',
    proBehavior: 'Hardware-checked 60 FPS capture stream (falls back cleanly to 30 FPS if unsupported)',
    previewSummary: 'Smooth 60 FPS motion curves for Shorts, TikTok, and product demos.',
  },
  advanced_animation_controls: {
    key: 'advanced_animation_controls',
    title: 'Advanced Animation Controls',
    tagline: 'Fine-tune per-message delays, keyboard pop-ups & read receipts',
    description: 'Customize per-turn typing duration, voice note playback speed, and on-screen keyboard triggers.',
    freeBehavior: 'Standard conversation timeline order',
    proBehavior: 'Per-message delay curves, receipt morph timing & keyboard overlay sync',
    previewSummary: 'Granular director controls for comedic timing and dramatic reveals.',
  },
  carousel_export: {
    key: 'carousel_export',
    title: 'Multi-Slide Carousel Export',
    tagline: 'Export synchronized Instagram/LinkedIn carousel slide sets',
    description: 'Split long conversations or multi-image Instagram posts into crisp sequential carousel PNGs.',
    freeBehavior: 'Single active view screenshot export',
    proBehavior: 'One-click export of all carousel frames in sequence',
    previewSummary: 'Outputs matching 4:5 or 1:1 slide sequences ready for upload.',
  },
  batch_png_export: {
    key: 'batch_png_export',
    title: 'Batch PNG Export Pack',
    tagline: 'Export iPhone + Android & Light + Dark variants together',
    description: 'Generate all device and appearance combinations in a single batch bundle for A/B creative testing.',
    freeBehavior: 'One PNG/JPG export per click',
    proBehavior: 'Multi-variant batch export across iPhone/Android and Dark/Light states',
    previewSummary: 'Saves creative teams hours when shipping cross-platform ad variations.',
  },
  reusable_character_library: {
    key: 'reusable_character_library',
    title: 'Reusable Character Library',
    tagline: 'Save avatars, handles, verified badges & roles across projects',
    description: 'Keep up to 100 recurring characters ready to drop into any WhatsApp, Instagram, or Discord scene.',
    freeBehavior: 'Per-project participant customization',
    proBehavior: 'Cross-project reusable cast library with quick-insert personas',
    previewSummary: 'Consistent creator personas across episodic story arcs.',
  },
  advanced_templates: {
    key: 'advanced_templates',
    title: 'Advanced Creator Templates',
    tagline: 'Pro storytelling arcs, viral hooks & multi-part scripts',
    description: 'Unlock curated high-converting ad scripts, support escalations, and creator reaction packs.',
    freeBehavior: 'Core starter templates included',
    proBehavior: 'Full Pro script vault + custom template collections',
    previewSummary: 'Pre-paced scenes structured for high retention in the first 3 seconds.',
  },
  advanced_rendering: {
    key: 'advanced_rendering',
    title: 'Advanced Rendering Options',
    tagline: '3x Ultra DPI, studio gradient canvases & custom aspect presets',
    description: 'Render 3x retina assets with curated studio gradients, transparent alphas, and precision framing.',
    freeBehavior: 'Watermark-free 1x & 2x PNG/JPG exports',
    proBehavior: '3x Ultra HD scaling, studio gradient backdrops & custom px sizing',
    previewSummary: 'Print-grade and billboard-ready mockup exports.',
  },
  cloud_project_management: {
    key: 'cloud_project_management',
    title: 'Cloud Project Library & Sync',
    tagline: 'Sync drafts across desktop and mobile browsers',
    description: 'Back up your full mockup workspace, folders, and bulk projects across devices.',
    freeBehavior: 'Private 100% local IndexedDB Save Chat & JSON backup',
    proBehavior: 'Synced cloud project library with bulk archive/duplicate tools',
    previewSummary: 'Start scripting on desktop and export on mobile seamlessly.',
  },
  premium_scene_templates: {
    key: 'premium_scene_templates',
    title: 'Premium Scene Presets',
    tagline: 'Multi-screen storyboards & curated creator scenes',
    description: 'Pre-configured iOS 26 Liquid Glass and Android Material 3 Expressive scenes with rich media props.',
    freeBehavior: 'Standard default sample scenes per app',
    proBehavior: 'Curated seasonal, fintech, e-commerce, and creator scene kits',
    previewSummary: 'Instant ready-to-shoot app scenes with realistic props.',
  },
};

export function formatPlanPrice(
  plan: PricingPlanConfig,
  currency: CurrencyCode,
  settings: BillingSettingsConfig = DEFAULT_BILLING_SETTINGS
): string {
  const amount = plan.prices[currency];
  if (amount === 0) return `${settings.currencySymbols[currency]}0`;
  const formatted =
    currency === 'INR'
      ? amount.toLocaleString('en-IN')
      : Number.isInteger(amount)
        ? String(amount)
        : amount.toFixed(2);
  return `${settings.currencySymbols[currency]}${formatted}`;
}
