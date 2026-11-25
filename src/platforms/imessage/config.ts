import type { GeneratorManifest } from '@/core/types';

export const IMESSAGE_CONFIG: GeneratorManifest = {
  id: 'imessage',
  slug: 'imessage',
  routeSlug: 'imessage-generator',
  routePath: '/imessage-generator',
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
  editorBadge: 'iPhone Messages Studio',
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
};
