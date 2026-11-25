import type { GeneratorManifest } from '@/core/types';

export const INSTAGRAM_STORY_CONFIG: GeneratorManifest = {
  id: 'instagram-story',
  slug: 'instagram-story',
  routeSlug: 'instagram-story-generator',
  routePath: '/instagram-story-generator',
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
  editorBadge: '9:16 Story Frame Studio',
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
};
