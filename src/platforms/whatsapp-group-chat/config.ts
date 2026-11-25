import type { GeneratorManifest } from '@/core/types';

export const WHATSAPP_GROUP_CHAT_CONFIG: GeneratorManifest = {
  id: 'whatsapp-group-chat',
  slug: 'whatsapp-group-chat',
  routeSlug: 'whatsapp-group-chat-generator',
  routePath: '/whatsapp-group-chat-generator',
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
  editorBadge: 'Multi-Speaker Group Studio',
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
      'contact_card',
      'call_event',
      'poll',
      'system',
      'date_separator',
      'unread_divider',
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
};
