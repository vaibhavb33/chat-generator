import type { GeneratorManifest } from '@/core/types';

export const INSTAGRAM_DM_CONFIG: GeneratorManifest = {
  id: 'instagram-dm',
  slug: 'instagram-dm',
  routeSlug: 'instagram-dm-generator',
  routePath: '/instagram-dm-generator',
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
  editorBadge: 'Instagram Direct Studio',
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
};
