import type { GeneratorManifest } from '@/core/types';

export const TELEGRAM_CHAT_CONFIG: GeneratorManifest = {
  id: 'telegram-chat',
  slug: 'telegram-chat',
  routeSlug: 'telegram-chat-generator',
  routePath: '/telegram-chat-generator',
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
  editorBadge: 'Telegram Messenger Studio',
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
};
