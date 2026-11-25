import type { GeneratorManifest } from '@/core/types';

export const ANDROID_MESSAGES_CONFIG: GeneratorManifest = {
  id: 'android-messages',
  slug: 'android-messages',
  routeSlug: 'android-message-generator',
  routePath: '/android-message-generator',
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
  editorBadge: 'Material You RCS Studio',
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
};
