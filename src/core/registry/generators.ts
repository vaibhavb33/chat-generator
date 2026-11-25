import type { GeneratorManifest } from '@/core/types';

export const GENERATOR_MANIFESTS: GeneratorManifest[] = [
  {
    id: 'whatsapp-chat',
    slug: 'whatsapp-chat',
    name: 'WhatsApp Chat Generator',
    shortName: 'WhatsApp Chat',
    tagline: 'Pixel-accurate 1-on-1 WhatsApp mockups with blue ticks, voice notes & dark mode.',
    description:
      'Create realistic WhatsApp conversations with iOS and Android UI toggles, voice message waveforms, delivery/read ticks, and instant watermark-free PNG downloads.',
    category: 'messaging',
    platformFamily: 'WhatsApp',
    popular: true,
    accentGradient: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    capabilities: {
      archetype: 'chat_thread',
      supportsGroupChat: false,
      supportsDarkMode: true,
      supportsOsSwitch: true,
      supportsReadReceipts: true,
      supportsTypingIndicator: true,
      supportsReactions: true,
      supportsStatusBar: true,
      supportedMessageTypes: [
        'text',
        'image',
        'video_preview',
        'audio',
        'voice_note',
        'gif',
        'sticker',
        'document',
        'location',
        'contact_card',
        'call_event',
        'system',
        'date_separator',
      ],
    },
    tags: ['whatsapp', 'chat', 'dm', 'voice note', 'blue ticks', 'ios', 'android', 'no watermark'],
    seoTitle: 'Fake WhatsApp Chat Generator — Free, No Watermark | ChatForge',
    seoDescription:
      'Generate realistic fake WhatsApp chat screenshots online in seconds. Supports iOS & Android styles, dark mode, voice notes, blue ticks, and free HD PNG export.',
    faqs: [
      {
        question: 'Does the WhatsApp Chat Generator add a watermark?',
        answer:
          'No. All static PNG and JPEG exports from ChatForge are 100% watermark-free and require zero sign-up.',
      },
      {
        question: 'Are my messages or uploaded profile photos stored on a server?',
        answer:
          'No. Rendering runs completely inside your browser and drafts are saved locally in IndexedDB.',
      },
      {
        question: 'Can I switch between iPhone and Android WhatsApp layouts?',
        answer:
          'Yes. Use the OS switch in the top toolbar or right panel to preview iOS and Android headers, status bars, and bubble styles.',
      },
    ],
  },
  {
    id: 'whatsapp-group-chat',
    slug: 'whatsapp-group-chat',
    name: 'WhatsApp Group Chat Generator',
    shortName: 'WhatsApp Group',
    tagline: 'Multi-speaker WhatsApp groups with color-coded members, replies & polls.',
    description:
      'Orchestrate multi-participant WhatsApp group threads with automatic member color coding, reply-to-message quote bubbles, system events, and interactive polls.',
    category: 'messaging',
    platformFamily: 'WhatsApp',
    popular: true,
    recentlyAdded: true,
    accentGradient: 'from-teal-500 to-emerald-600',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    capabilities: {
      archetype: 'chat_thread',
      supportsGroupChat: true,
      supportsDarkMode: true,
      supportsOsSwitch: true,
      supportsReadReceipts: true,
      supportsTypingIndicator: true,
      supportsReactions: true,
      supportsStatusBar: true,
      supportedMessageTypes: [
        'text',
        'image',
        'voice_note',
        'gif',
        'sticker',
        'document',
        'location',
        'contact_card',
        'poll',
        'system',
        'date_separator',
      ],
    },
    tags: ['whatsapp', 'group chat', 'multi speaker', 'poll', 'replies', 'family', 'work'],
    seoTitle: 'Fake WhatsApp Group Chat Generator (Multi-Speaker) | ChatForge',
    seoDescription:
      'Build multi-speaker fake WhatsApp group conversations with color-coded participants, reply quotes, system messages, and polls.',
    faqs: [
      {
        question: 'How many participants can I add to a WhatsApp group mockup?',
        answer:
          'You can add unlimited participants from the Participants panel, each with distinct auto-assigned bubble name colors and avatars.',
      },
      {
        question: 'Can I import a multi-person script all at once?',
        answer:
          'Yes. Use the Script Import modal to paste dialogue formatted as "Name: Message" and ChatForge creates every participant automatically.',
      },
    ],
  },
  {
    id: 'instagram-dm',
    slug: 'instagram-dm',
    name: 'Instagram DM Generator',
    shortName: 'Instagram DM',
    tagline: 'Gradient DM bubbles, story replies, heart reactions & vanish mode.',
    description:
      'Design authentic Instagram Direct Message conversations featuring violet-blue gradient outgoing bubbles, verified badges, seen indicators, and voice note pills.',
    category: 'messaging',
    platformFamily: 'Instagram',
    popular: true,
    accentGradient: 'from-fuchsia-500 via-purple-600 to-indigo-600',
    badgeColor: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    capabilities: {
      archetype: 'chat_thread',
      supportsGroupChat: true,
      supportsDarkMode: true,
      supportsOsSwitch: true,
      supportsReadReceipts: true,
      supportsTypingIndicator: true,
      supportsReactions: true,
      supportsStatusBar: true,
      supportedMessageTypes: [
        'text',
        'image',
        'video_preview',
        'voice_note',
        'gif',
        'sticker',
        'story_reply',
        'shared_post',
        'call_event',
        'system',
        'date_separator',
      ],
    },
    tags: ['instagram', 'dm', 'direct message', 'gradient', 'reels', 'creator', 'dark mode'],
    seoTitle: 'Fake Instagram DM Screenshot Generator (No Watermark) | ChatForge',
    seoDescription:
      'Create realistic fake Instagram DM screenshots with gradient bubbles, verified checkmarks, reactions, and dark mode — free and watermark-free.',
    faqs: [
      {
        question: 'Is this an ig.me click-to-chat link generator or a DM screenshot mockup tool?',
        answer:
          'This is a visual Instagram DM screenshot and video mockup studio for creators, marketers, and storytellers.',
      },
      {
        question: 'Does it support Instagram dark mode and verified badges?',
        answer:
          'Yes. Toggle Dark Mode in the customization panel and enable blue verified badges on any participant.',
      },
    ],
  },
  {
    id: 'instagram-story',
    slug: 'instagram-story',
    name: 'Instagram Story Mockup Generator',
    shortName: 'Instagram Story',
    tagline: '9:16 story frames with progress bars, poll stickers & viewer counts.',
    description:
      'Mock up realistic 9:16 Instagram Story screens complete with multi-slide progress bars, interactive poll/music stickers, and customizable viewer counts.',
    category: 'story_profile',
    platformFamily: 'Instagram',
    recentlyAdded: true,
    accentGradient: 'from-pink-500 via-rose-500 to-amber-500',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
    capabilities: {
      archetype: 'ephemeral_story',
      supportsGroupChat: false,
      supportsDarkMode: false,
      supportsOsSwitch: true,
      supportsReadReceipts: false,
      supportsTypingIndicator: false,
      supportsReactions: true,
      supportsStatusBar: true,
      supportedMessageTypes: ['image', 'text'],
    },
    tags: ['instagram', 'story', '9:16', 'poll sticker', 'views', 'mockup', 'profile'],
    seoTitle: 'Fake Instagram Story Mockup & Viewer List Generator | ChatForge',
    seoDescription:
      'Preview and export realistic 9:16 Instagram Story UI mockups with multi-slide bars, poll stickers, and custom viewer counts.',
    faqs: [
      {
        question: 'Can I customize the story viewer count and poll sticker options?',
        answer:
          'Yes. Edit poll questions, two voting options, music badges, and viewer count numbers directly inside the Story editor panel.',
      },
    ],
  },
  {
    id: 'instagram-post',
    slug: 'instagram-post',
    name: 'Instagram Post Mockup Generator',
    shortName: 'Instagram Post',
    tagline: 'Feed previews with ...more caption truncation, likes & verified headers.',
    description:
      'Build pixel-accurate Instagram feed post mockups for agency client approvals and content previews with realistic caption truncation, verified icons, and engagement metrics.',
    category: 'social_post',
    platformFamily: 'Instagram',
    popular: true,
    accentGradient: 'from-purple-600 to-pink-600',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    capabilities: {
      archetype: 'social_post',
      supportsGroupChat: false,
      supportsDarkMode: true,
      supportsOsSwitch: false,
      supportsReadReceipts: false,
      supportsTypingIndicator: false,
      supportsReactions: true,
      supportsStatusBar: false,
      supportedMessageTypes: ['image', 'text'],
    },
    tags: ['instagram', 'post', 'feed', 'social media', 'marketing', 'caption truncation', 'ad'],
    seoTitle: 'Instagram Post Mockup Generator (Client Previews & Ads) | ChatForge',
    seoDescription:
      'Create clean Instagram post mockups with verified badges, 1:1 or 4:5 media, accurate ...more caption truncation, and engagement counters.',
    faqs: [
      {
        question: 'Does the Instagram Post generator simulate "...more" caption cutoffs?',
        answer:
          'Yes. Toggle the "...more" cutoff simulator in the Post Editor to verify whether your hook sits above the mobile truncation fold.',
      },
    ],
  },
  {
    id: 'imessage',
    slug: 'imessage',
    name: 'iMessage Generator',
    shortName: 'iMessage (iOS)',
    tagline: 'Authentic iOS blue & green SMS bubbles, Tapbacks & Dynamic Island.',
    description:
      'Generate crisp iPhone text message mockups featuring Dynamic Island status bars, iMessage blue vs SMS green bubbles, Tapback reactions, and Delivered/Read receipts.',
    category: 'messaging',
    platformFamily: 'Apple',
    popular: true,
    accentGradient: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    capabilities: {
      archetype: 'chat_thread',
      supportsGroupChat: true,
      supportsDarkMode: true,
      supportsOsSwitch: false,
      supportsReadReceipts: true,
      supportsTypingIndicator: true,
      supportsReactions: true,
      supportsStatusBar: true,
      supportedMessageTypes: [
        'text',
        'image',
        'video_preview',
        'voice_note',
        'location',
        'contact_card',
        'system',
        'date_separator',
      ],
    },
    tags: ['imessage', 'iphone', 'ios', 'sms', 'tapback', 'text message', 'apple'],
    seoTitle: 'Fake iPhone iMessage Text Generator (Free, No Watermark) | ChatForge',
    seoDescription:
      'Create realistic fake iPhone iMessage and green SMS screenshots with Tapbacks, Delivered/Read receipts, Dynamic Island, and dark mode.',
    faqs: [
      {
        question: 'Can I switch between blue iMessage bubbles and green SMS bubbles?',
        answer:
          'Yes. Switch bubble style between iMessage Blue and SMS Green in the Appearance panel at any time.',
      },
    ],
  },
  {
    id: 'android-messages',
    slug: 'android-messages',
    name: 'Android Messages Generator',
    shortName: 'Android Messages',
    tagline: 'Material You RCS & SMS chat mockups with Pixel status bar & checkmarks.',
    description:
      'Simulate modern Google / Android Messages RCS conversations with Material You surfaces, delivery/read checkmarks, emoji reactions, and punch-hole status bars.',
    category: 'messaging',
    platformFamily: 'Google',
    recentlyAdded: true,
    accentGradient: 'from-sky-500 to-blue-600',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    capabilities: {
      archetype: 'chat_thread',
      supportsGroupChat: true,
      supportsDarkMode: true,
      supportsOsSwitch: false,
      supportsReadReceipts: true,
      supportsTypingIndicator: true,
      supportsReactions: true,
      supportsStatusBar: true,
      supportedMessageTypes: [
        'text',
        'image',
        'voice_note',
        'gif',
        'location',
        'contact_card',
        'system',
        'date_separator',
      ],
    },
    tags: ['android', 'messages', 'google', 'rcs', 'sms', 'pixel', 'material you'],
    seoTitle: 'Fake Android Text Message & RCS Chat Generator | ChatForge',
    seoDescription:
      'Design realistic Google Android Messages RCS and SMS chat screenshots with Material You styling and dark mode.',
    faqs: [
      {
        question: 'Does Android Messages support RCS read checkmarks and dark mode?',
        answer:
          'Yes. Toggle light/dark Material themes and configure sent, delivered, or read checkmarks per message.',
      },
    ],
  },
  {
    id: 'telegram-chat',
    slug: 'telegram-chat',
    name: 'Telegram Chat Generator',
    shortName: 'Telegram Chat',
    tagline: 'Clean Telegram conversations with patterned wallpaper, replies & checkmarks.',
    description:
      'Build high-fidelity Telegram personal and group chats with custom patterned backdrops, single/double checkmarks, inline reply quotes, and document cards.',
    category: 'messaging',
    platformFamily: 'Telegram',
    popular: true,
    accentGradient: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    capabilities: {
      archetype: 'chat_thread',
      supportsGroupChat: true,
      supportsDarkMode: true,
      supportsOsSwitch: true,
      supportsReadReceipts: true,
      supportsTypingIndicator: true,
      supportsReactions: true,
      supportsStatusBar: true,
      supportedMessageTypes: [
        'text',
        'image',
        'video_preview',
        'audio',
        'voice_note',
        'gif',
        'sticker',
        'document',
        'location',
        'poll',
        'system',
        'date_separator',
      ],
    },
    tags: ['telegram', 'chat', 'channel', 'bot', 'wallpaper', 'voice note', 'document'],
    seoTitle: 'Fake Telegram Chat & Channel Mockup Generator | ChatForge',
    seoDescription:
      'Create realistic Telegram chat mockups with reply quotes, document attachments, patterned wallpapers, and light/dark modes.',
    faqs: [
      {
        question: 'Can I add file attachments and reply quotes to Telegram mockups?',
        answer:
          'Yes. Telegram supports documents, voice notes, polls, locations, and reply-to-message references out of the box.',
      },
    ],
  },
  {
    id: 'discord-chat',
    slug: 'discord-chat',
    name: 'Discord Chat Generator',
    shortName: 'Discord Chat',
    tagline: 'Authentic Discord channels with role colors, APP/BOT badges & reactions.',
    description:
      'Simulate Discord server channel threads with customizable member role colors, APP/BOT tags, reaction pills, stacked message grouping, and Dark/Light themes.',
    category: 'messaging',
    platformFamily: 'Discord',
    recentlyAdded: true,
    accentGradient: 'from-indigo-500 to-violet-600',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    capabilities: {
      archetype: 'chat_thread',
      supportsGroupChat: true,
      supportsDarkMode: true,
      supportsOsSwitch: false,
      supportsReadReceipts: false,
      supportsTypingIndicator: true,
      supportsReactions: true,
      supportsStatusBar: false,
      supportedMessageTypes: [
        'text',
        'image',
        'gif',
        'sticker',
        'document',
        'system',
        'date_separator',
      ],
    },
    tags: ['discord', 'server', 'channel', 'role colors', 'bot', 'gaming', 'community'],
    seoTitle: 'Fake Discord Chat & Server Channel Generator | ChatForge',
    seoDescription:
      'Generate realistic Discord chat mockups with role colors, bot badges, emoji reaction counters, and dark mode.',
    faqs: [
      {
        question: 'Can I customize member role colors and BOT tags in Discord?',
        answer:
          'Yes. Edit any participant in the Cast panel to assign a hex role color and select the BOT/APP badge.',
      },
    ],
  },
  {
    id: 'fake-call-screen',
    slug: 'fake-call-screen',
    name: 'Fake Call Screen Generator',
    shortName: 'Fake Call Screen',
    tagline: 'Incoming & active iOS, FaceTime & WhatsApp call UIs + live ring mode.',
    description:
      'Create realistic incoming or active voice and video call screen mockups for iOS Phone, FaceTime, WhatsApp, and Instagram—plus run a live ticking timer simulator.',
    category: 'phone_mockup',
    platformFamily: 'Phone UI',
    recentlyAdded: true,
    accentGradient: 'from-violet-600 to-blue-600',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    capabilities: {
      archetype: 'call_screen',
      supportsGroupChat: false,
      supportsDarkMode: true,
      supportsOsSwitch: true,
      supportsReadReceipts: false,
      supportsTypingIndicator: false,
      supportsReactions: false,
      supportsStatusBar: true,
      supportedMessageTypes: ['call_event'],
    },
    tags: ['call screen', 'phone mockup', 'facetime', 'whatsapp call', 'incoming call', 'film prop'],
    seoTitle: 'Fake Call Screen Generator (iPhone, WhatsApp & FaceTime) | ChatForge',
    seoDescription:
      'Design realistic incoming and active call screen mockups for film props, storyboards, and skits with live timer simulation.',
    faqs: [
      {
        question: 'Can I switch between iOS Phone, FaceTime, and WhatsApp call layouts?',
        answer:
          'Yes. Use the Call Screen customization panel to switch platform skins, toggle incoming vs active timer states, and simulate live call duration.',
      },
    ],
  },
];

export const GENERATOR_MAP = Object.fromEntries(
  GENERATOR_MANIFESTS.map((m) => [m.id, m])
) as Record<string, GeneratorManifest>;

export function getGeneratorBySlug(slug: string): GeneratorManifest | undefined {
  return GENERATOR_MANIFESTS.find((g) => g.slug === slug);
}
