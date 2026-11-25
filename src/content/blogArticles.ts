export interface BlogArticle {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  category: string;
  excerpt: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  relatedGeneratorSlugs: string[];
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'how-to-spot-fake-whatsapp-screenshots',
    title: 'How to Spot Fake WhatsApp & Chat Screenshots: A Practical Verification Checklist',
    seoTitle: 'How to Tell If a WhatsApp Screenshot Is Fake (Forensic Checklist) | ChatForge',
    seoDescription:
      'Learn how journalists, educators, and everyday readers spot fabricated chat screenshots by inspecting clocks, typography, checkmarks, and source context.',
    publishedAt: '2026-11-20',
    updatedAt: '2026-11-25',
    readingTime: '5 min read',
    category: 'Media Literacy & Forensics',
    excerpt:
      'Simulated chat screenshots are easy to generate for creative storytelling and UX mockups—which makes knowing how to verify viral screenshots an essential digital literacy skill.',
    sections: [
      {
        heading: '1. Cross-Check the Phone Status Bar Clock vs. Message Timestamps',
        paragraphs: [
          'One of the most frequent giveaways in hastily made mockups is a mismatch between the device clock at the very top of the screen and the timestamps inside the chat bubbles.',
          'For example, if the top status bar reads 9:41 AM while the newest message at the bottom is stamped 2:30 PM, the image is either a mockup or cropped inconsistently.',
        ],
      },
      {
        heading: '2. Inspect Platform UI Consistency (iOS vs. Android)',
        paragraphs: [
          'Authentic messaging apps follow strict operating-system conventions. Mixing an iOS Dynamic Island status bar with Android navigation icons, or pairing iOS system fonts with Android emoji styles, signals a composite or simulated screen.',
        ],
        bullets: [
          'Check tick geometry and color contrast on delivered vs. read receipts.',
          'Look for cropped headers, missing encryption notices, or inconsistent dark-mode hex shades.',
          'Verify whether the sender name colors and avatar spacing match the app version.',
        ],
      },
      {
        heading: '3. Verify Beyond Static Pixels',
        paragraphs: [
          'Because static PNGs strip platform metadata, fact-checkers and educators recommend never relying on a standalone screenshot as proof of a real-world claim.',
        ],
        bullets: [
          'Request independent corroboration from the alleged sender or platform permalink.',
          'For video verification, continuous unedited screen recordings from the home screen into the live app carry stronger context than isolated stills.',
          'Use ChatForge’s optional "Simulated Mockup" disclosure footer whenever publishing educational or editorial examples.',
        ],
      },
    ],
    relatedGeneratorSlugs: ['whatsapp-chat', 'whatsapp-group-chat', 'imessage'],
  },
  {
    slug: 'are-fake-chat-generators-legal-and-safe',
    title: 'Are Fake Chat Generators Legal and Safe? Guidelines for Creators, Marketers & Educators',
    seoTitle: 'Are Fake Chat Generators Legal & Safe? Creator & Educator Guide | ChatForge',
    seoDescription:
      'Understand lawful creative, marketing, and classroom uses for chat mockup generators—plus privacy best practices that protect your drafts and photos.',
    publishedAt: '2026-11-22',
    updatedAt: '2026-11-25',
    readingTime: '4 min read',
    category: 'Ethics, Privacy & Compliance',
    excerpt:
      'Simulated UI tools are widely used across film production, marketing previews, and classrooms. Here is how to use them responsibly and protect your browser privacy.',
    sections: [
      {
        heading: 'Legitimate Creative & Professional Uses vs. Prohibited Misuse',
        paragraphs: [
          'Simulated chat and social UI mockups are lawful when used for fiction writing, YouTube or TikTok storytelling, UI/UX design prototypes, marketing campaign approvals, indie filmmaking, and classroom media literacy.',
          'By contrast, fabricating evidence, impersonating real individuals to defame or harass, or generating deceptive financial/payment receipts is unethical and often illegal. That is why ChatForge explicitly excludes bank, wallet, and payment-receipt forgery tools.',
        ],
      },
      {
        heading: 'Why Client-Side Browser Rendering Matters for Privacy',
        paragraphs: [
          'Many legacy mobile prank apps ask for invasive contacts, camera, or storage permissions, while ad-heavy web utilities upload user photos to unknown servers.',
          'ChatForge renders every chat, story, post, and call screen 100% locally in your browser using Canvas APIs and IndexedDB—meaning your text and uploaded avatars never touch an external server.',
        ],
      },
      {
        heading: 'Using the Opt-In "Simulated" Disclosure Badge',
        paragraphs: [
          'Teachers, journalists, and compliance-conscious brands can toggle the "Simulated Mockup" disclosure footer inside the Style panel so exported PNGs and videos remain transparently labeled even if reshared out of context.',
        ],
      },
    ],
    relatedGeneratorSlugs: ['whatsapp-chat', 'instagram-dm', 'instagram-post', 'fake-call-screen'],
  },
];

export function getBlogArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}
