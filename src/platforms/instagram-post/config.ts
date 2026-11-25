import type { GeneratorManifest } from '@/core/types';

export const INSTAGRAM_POST_CONFIG: GeneratorManifest = {
  id: 'instagram-post',
  slug: 'instagram-post',
  routeSlug: 'instagram-post-generator',
  routePath: '/instagram-post-generator',
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
  editorBadge: 'Feed & Caption Cutoff Studio',
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
};
