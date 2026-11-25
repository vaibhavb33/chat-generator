import type { GeneratorManifest } from '@/core/types';

export const DISCORD_CHAT_CONFIG: GeneratorManifest = {
  id: 'discord-chat',
  slug: 'discord-chat',
  routeSlug: 'discord-chat-generator',
  routePath: '/discord-chat-generator',
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
  editorBadge: 'Discord Channel Studio',
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
};
