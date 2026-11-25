import type { GeneratorManifest } from '@/core/types';

export const WHATSAPP_CHAT_CONFIG: GeneratorManifest = {
  id: 'whatsapp-chat',
  slug: 'whatsapp-chat',
  routeSlug: 'whatsapp-chat-generator',
  routePath: '/whatsapp-chat-generator',
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
  editorBadge: '1-on-1 WhatsApp Composer',
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
      'unread_divider',
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
        'Yes. Use the OS switch in the customization panel to preview iOS and Android headers, status bars, and bubble styles.',
    },
  ],
};
