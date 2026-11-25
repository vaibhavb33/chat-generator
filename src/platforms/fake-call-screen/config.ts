import type { GeneratorManifest } from '@/core/types';

export const FAKE_CALL_CONFIG: GeneratorManifest = {
  id: 'fake-call-screen',
  slug: 'fake-call-screen',
  routeSlug: 'fake-call-generator',
  routePath: '/fake-call-generator',
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
  editorBadge: 'Voice & Video Call Studio',
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
};
