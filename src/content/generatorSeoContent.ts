export interface GeneratorSeoProfile {
  slug: string;
  h1Title: string;
  subtitle: string;
  introParagraphs: string[];
  howToSteps: Array<{ title: string; detail: string }>;
  examples: Array<{ title: string; useCase: string; snippet: string }>;
  features: Array<{ title: string; detail: string }>;
  relatedSlugs: string[];
  schemaFeatureList: string[];
}

export const GENERATOR_SEO_CONTENT: Record<string, GeneratorSeoProfile> = {
  'whatsapp-chat': {
    slug: 'whatsapp-chat',
    h1Title: 'Fake WhatsApp Chat Generator',
    subtitle: 'Free WhatsApp Chat Screenshot & Story Video Maker (No Watermark)',
    introParagraphs: [
      'Create realistic 1-on-1 WhatsApp conversation mockups directly in your browser without watermarks, intrusive banner ads, or server uploads. Customize contact names, profile photos, online or typing statuses, blue read ticks, voice note waveforms, and iOS or Android interface themes.',
      'Whether you are producing a TikTok texting story, building a SaaS customer-support case study, or preparing a classroom media-literacy exercise, ChatForge renders pixel-accurate light and dark WhatsApp threads locally and exports crisp 2x and 3x PNG, JPG, WebP, or animated video previews.',
    ],
    howToSteps: [
      {
        title: 'Choose iOS or Android WhatsApp Style',
        detail:
          'Toggle Light or Dark mode, pick iOS or Android header chrome, and adjust the top status bar clock, 5G/LTE signal, and battery percentage.',
      },
      {
        title: 'Compose Messages, Voice Notes & Receipts',
        detail:
          'Add text bubbles, voice note waveforms, images, location pins, or missed call events—or paste an entire dialogue using the Screenplay Script importer.',
      },
      {
        title: 'Export Clean HD Images or Animated Stories',
        detail:
          'Download watermark-free PNG, JPG, or WebP screenshots up to 3x resolution, or switch to the Video Timeline to preview and export a 9:16 story clip.',
      },
    ],
    examples: [
      {
        title: 'SaaS Customer Support Case Study',
        useCase: 'Landing Page Social Proof',
        snippet: 'Customer reports damaged order #CF-8841 -> Support dispatches express replacement in under 60 seconds with blue read ticks.',
      },
      {
        title: 'Courier Delivery Comedy Skit',
        useCase: 'YouTube Shorts / Reels Thumbnail',
        snippet: 'Courier texts from the front gate about keypad trouble -> Recipient shares gate code and blue planter drop-off note.',
      },
    ],
    features: [
      {
        title: 'Authentic Single, Double & Blue Ticks',
        detail: 'Set delivery states individually per outgoing message between sent, delivered, read, or none.',
      },
      {
        title: 'Voice Note Waveform Simulation',
        detail: 'Insert realistic audio bubbles with duration labels and animated playback progress bars.',
      },
      {
        title: 'iOS, Android & Film-Safe Headers',
        detail: 'Switch between Apple iOS headers, Android Material green bars, or trademark-free Film-Safe status bars.',
      },
      {
        title: '100% Client-Side IndexedDB Auto-Save',
        detail: 'Drafts never leave your browser and automatically restore after tab refreshes or offline sessions.',
      },
    ],
    relatedSlugs: ['whatsapp-group-chat', 'imessage', 'instagram-dm', 'fake-call-screen'],
    schemaFeatureList: [
      'Watermark-free PNG/JPG/WebP export',
      'iOS and Android WhatsApp UI switch',
      'Voice note waveforms and read ticks',
      'Client-side IndexedDB draft persistence',
    ],
  },
  'whatsapp-group-chat': {
    slug: 'whatsapp-group-chat',
    h1Title: 'Fake WhatsApp Group Chat Mockup Generator',
    subtitle: 'Multi-Speaker Group Conversations with Colored Members, Replies & Polls',
    introParagraphs: [
      'Most online chat makers restrict you to two speakers. Our dedicated WhatsApp Group Chat Mockup Generator lets you add unlimited participants with automatic member name coloring, group icons, reply-to-message quote blocks, system announcements, and native group polls.',
      'Designed explicitly for visual UI mockups and multi-character storytelling—not real chat.whatsapp.com invite links—every group thread runs locally in your browser with instant PNG, WebP, HTML, and animated 9:16 video export.',
    ],
    howToSteps: [
      {
        title: 'Name Your Group & Add Participants',
        detail:
          'Set the group subject line in the editor and add as many members as your scene requires inside the People tab with custom avatars and badges.',
      },
      {
        title: 'Build Multi-Speaker Dialogue & Polls',
        detail:
          'Switch senders effortlessly, link reply quotes to earlier messages, insert group polls with vote bars, or bulk-import a multi-person script.',
      },
      {
        title: 'Customize Appearance & Export',
        detail:
          'Preview in WhatsApp Dark or Light mode, enable an optional Simulated disclosure footer if needed, and export clean high-resolution images.',
      },
    ],
    examples: [
      {
        title: 'Weekend Shoot Crew Coordination',
        useCase: 'Team & Agency Mockups',
        snippet: '4 participants coordinate thumbnail delivery, reply-quote earlier feedback, and vote on launch timing.',
      },
      {
        title: 'Roadtrip Friend Group Banter',
        useCase: 'Comedy Carousel & Storytelling',
        snippet: 'Three friends debate roadtrip playlist rules with emoji reactions and system join notices.',
      },
    ],
    features: [
      {
        title: 'Auto Color-Coded Member Labels',
        detail: 'Incoming group bubbles automatically render distinct sender colors and mini participant avatars.',
      },
      {
        title: 'Reply-to-Message Quote Cards',
        detail: 'Reference any prior group message so multi-person threads stay easy to follow.',
      },
      {
        title: 'Interactive Group Polls',
        detail: 'Display WhatsApp-style poll questions with proportional progress bars and vote tallies.',
      },
      {
        title: 'Screenplay Bulk Script Parser',
        detail: 'Paste "Maya: ...", "Daniel: ...", "[system]: ..." dialogue to auto-create participants in one click.',
      },
    ],
    relatedSlugs: ['whatsapp-chat', 'discord-chat', 'telegram-chat', 'imessage'],
    schemaFeatureList: [
      'Unlimited multi-speaker participants',
      'Color-coded group sender names',
      'Reply-to-message quotes and polls',
      'Screenplay bulk script import',
    ],
  },
  'instagram-dm': {
    slug: 'instagram-dm',
    h1Title: 'Fake Instagram DM Screenshot Generator',
    subtitle: 'Gradient DM Bubbles, Story Replies, Shared Reels & Dark Mode (No Watermark)',
    introParagraphs: [
      'Build authentic Instagram Direct Message screenshots featuring violet-to-blue gradient outgoing bubbles, verified blue checkmarks, active green status dots, story reply previews, shared reel cards, and Seen indicators.',
      'This tool creates visual Instagram DM UI mockups and animated story videos—not real ig.me click-to-chat URLs—making it ideal for D2C product launch ads, creator skits, giveaway announcements, and social campaign presentations.',
    ],
    howToSteps: [
      {
        title: 'Configure Profiles & Verified Badges',
        detail:
          'Set handles, display names, profile photos, and toggle verified checkmarks inside the People panel.',
      },
      {
        title: 'Add DMs, Story Replies & Shared Posts',
        detail:
          'Compose gradient text messages, heart reactions, voice note pills, Instagram Story replies, or shared Reel preview cards.',
      },
      {
        title: 'Toggle Dark Mode & Export Cleanly',
        detail:
          'Switch between crisp white and OLED black Instagram themes and export watermark-free PNG, JPG, or WebP files.',
      },
    ],
    examples: [
      {
        title: 'VIP Product Drop Announcement',
        useCase: 'Paid Social Ad Creative',
        snippet: 'Customer replies to product teaser Story -> Brand shares early-access promo code in gradient DM bubble.',
      },
      {
        title: 'Creator Giveaway Winner Reveal',
        useCase: 'Instagram Reel Hook',
        snippet: 'Verified creator messages lucky follower with confetti celebration and Seen receipt.',
      },
    ],
    features: [
      {
        title: 'Native Story Reply Cards',
        detail: 'Attach a miniature story preview thumbnail directly above a follower reply message.',
      },
      {
        title: 'Shared Post & Reel Previews',
        detail: 'Simulate shared Instagram posts and reels inside DM threads for creator narratives.',
      },
      {
        title: 'Instagram Gradient & OLED Dark Mode',
        detail: 'Authentic purple-indigo outgoing gradients paired with clean light or pure black dark mode.',
      },
      {
        title: 'Single-Click Seen Status & Reactions',
        detail: 'Display "Seen" beneath the latest outgoing message alongside floating emoji reactions.',
      },
    ],
    relatedSlugs: ['instagram-story', 'instagram-post', 'whatsapp-chat', 'imessage'],
    schemaFeatureList: [
      'Instagram DM gradient bubbles',
      'Story reply and shared post previews',
      'Verified badge and Seen status controls',
      'Light and OLED dark theme support',
    ],
  },
  'instagram-story': {
    slug: 'instagram-story',
    h1Title: 'Fake Instagram Story Mockup & Viewer List Generator',
    subtitle: 'Realistic 9:16 Story UI Previews with Progress Bars, Poll Stickers & View Counts',
    introParagraphs: [
      'Preview and export realistic 9:16 Instagram Story interface mockups complete with multi-slide top progress bars, author headers, verified badges, music tags, interactive poll stickers, and bottom viewer count bars.',
      'Unlike graphic flyer makers, ChatForge simulates the exact in-app Instagram Story chrome so social media strategists, agencies, and storytellers can test layouts, safe zones, and viewer narratives before publishing.',
    ],
    howToSteps: [
      {
        title: 'Select or Add Story Slides',
        detail:
          'Switch between multi-slide frames in the Story Slides panel to update progress bar counts automatically.',
      },
      {
        title: 'Edit Headline, Music & Poll Stickers',
        detail:
          'Customize story headline text, subtitle, music track pill, and interactive poll sticker questions and options.',
      },
      {
        title: 'Adjust Author & Export 9:16 PNG',
        detail:
          'Set the creator handle, verified badge, and timestamp label, then export a high-resolution 9:16 PNG or WebP.',
      },
    ],
    examples: [
      {
        title: 'Product Launch Teaser Poll',
        useCase: 'Agency Client Story Approval',
        snippet: '2-slide launch announcement featuring custom gradient backdrop, music badge, and 68%/32% poll sticker.',
      },
      {
        title: 'Creator Q&A Prompt Frame',
        useCase: 'Portfolio & Deck Preview',
        snippet: 'Verified creator story displaying 1,428 views and bottom reply bar safe-zone alignment.',
      },
    ],
    features: [
      {
        title: 'Multi-Slide Progress Bars',
        detail: 'Automatically renders segmented progress bars matching your active story slide index.',
      },
      {
        title: 'Poll Sticker Mockup Card',
        detail: 'Preview realistic split-percentage poll stickers right inside the 9:16 story canvas.',
      },
      {
        title: 'Viewer Count & Seen Indicator',
        detail: 'Display authentic bottom-left eye counters and viewer summary text.',
      },
      {
        title: 'Status Bar & Device Frame Controls',
        detail: 'Export raw 9:16 screens for Reels/Slides or wrap inside an iPhone 16 Pro bezel.',
      },
    ],
    relatedSlugs: ['instagram-post', 'instagram-dm', 'whatsapp-chat', 'fake-call-screen'],
    schemaFeatureList: [
      '9:16 Instagram Story UI simulation',
      'Multi-slide progress indicators',
      'Interactive poll sticker previews',
      'Customizable viewer count and music tag',
    ],
  },
  'instagram-post': {
    slug: 'instagram-post',
    h1Title: 'Instagram Post Mockup Generator',
    subtitle: 'Feed Previews with "...more" Caption Truncation, Verified Headers & Comments',
    introParagraphs: [
      'Design pixel-accurate Instagram feed post mockups for client approvals, campaign pitch decks, and UI showcases—without wrestling broken Photoshop smart objects or missing fonts.',
      'Test 1:1 square or 4:5 portrait creatives, simulate exact mobile "...more" caption cutoffs so key hooks never hide below the fold, and customize likes, location tags, verified badges, and comment previews.',
    ],
    howToSteps: [
      {
        title: 'Configure Account Header & Location',
        detail:
          'Edit the account handle, profile picture with Story ring, verified badge, and optional city location label.',
      },
      {
        title: 'Write Caption & Test "...more" Truncation',
        detail:
          'Choose 1:1 or 4:5 aspect ratio, enter your post caption, and toggle the "...more" truncation simulator.',
      },
      {
        title: 'Customize Metrics & Export',
        detail:
          'Set like counts and light or dark mode appearance, then download a clean 2x or 3x Retina PNG or WebP.',
      },
    ],
    examples: [
      {
        title: 'Client Campaign Hook Verification',
        useCase: 'Performance Marketing Agency',
        snippet: '4:5 portrait creative tested with "...more" truncation enabled to verify CTA visibility before ad spend.',
      },
      {
        title: 'Social Proof Feed Card',
        useCase: 'SaaS Pitch Deck Visual',
        snippet: 'Verified brand post with 2,841 likes and two pinned community comments.',
      },
    ],
    features: [
      {
        title: 'Accurate "...more" Caption Cutoff',
        detail: 'Preview how long captions truncate on mobile feeds and click "more" interactively to expand.',
      },
      {
        title: '1:1 & 4:5 Feed Aspect Ratios',
        detail: 'Switch cleanly between classic square and tall portrait Instagram feed dimensions.',
      },
      {
        title: 'Gradient Story Ring & Verified Badges',
        detail: 'Includes authentic Instagram story ring framing around author avatars.',
      },
      {
        title: 'Light & Dark Feed Themes',
        detail: 'Verify visual contrast across both standard white and OLED black Instagram feeds.',
      },
    ],
    relatedSlugs: ['instagram-story', 'instagram-dm', 'whatsapp-chat', 'discord-chat'],
    schemaFeatureList: [
      '1:1 and 4:5 Instagram post ratios',
      'Mobile caption "...more" truncation simulator',
      'Verified badge and Story ring avatar',
      'Light and dark feed modes',
    ],
  },
  imessage: {
    slug: 'imessage',
    h1Title: 'Fake iPhone iMessage Text Generator',
    subtitle: 'Blue iMessage & Green SMS Bubbles, Apple Tapbacks & Dynamic Island',
    introParagraphs: [
      'Generate crisp iPhone text message mockups featuring authentic Apple iMessage blue and SMS green bubbles, centered contact headers, Dynamic Island status bars, Delivered and Read timestamps, and iOS Tapback reactions.',
      'Built for TikTok and YouTube Shorts texting story creators, indie filmmakers needing prop screens, and UX designers, ChatForge produces watermark-free HD screenshots and 9:16 animated story videos 100% locally.',
    ],
    howToSteps: [
      {
        title: 'Pick Blue iMessage or Green SMS Style',
        detail:
          'Switch between iMessage Blue and SMS Green inside the Style panel and toggle Light or Dark iOS appearance.',
      },
      {
        title: 'Add Texts, Voice Notes & Tapbacks',
        detail:
          'Compose dialogue, attach photos or location pins, apply top-corner Tapback reactions, and set Delivered or Read receipts.',
      },
      {
        title: 'Export HD PNG or Animate for Shorts',
        detail:
          'Export crisp 2x/3x Retina PNGs or open the Video Timeline to preview typing dots, keyboard overlays, and vertical 9:16 video.',
      },
    ],
    examples: [
      {
        title: '9:16 Texting Story Opener',
        useCase: 'TikTok & YouTube Shorts',
        snippet: 'Dark-mode iMessage thread with 9:41 Dynamic Island clock, Tapback heart, and Read 9:39 AM receipt.',
      },
      {
        title: 'Green Bubble SMS Fallback',
        useCase: 'Comedy Meme & Film Prop',
        snippet: 'Two-person exchange switching to green SMS bubbles with Film-Safe generic status bar.',
      },
    ],
    features: [
      {
        title: 'Blue iMessage vs Green SMS Toggle',
        detail: 'Flip outgoing bubble colors instantly between iMessage Blue (#007AFF) and SMS Green (#34C759).',
      },
      {
        title: 'iOS Tapback Corner Badges',
        detail: 'Attach authentic top-corner Tapback reaction pills with white/dark outer rings.',
      },
      {
        title: 'Dynamic Island & 9:41 Status Bar',
        detail: 'Customize clock time, 5G/LTE carrier, Wi-Fi, and battery percentage—or hide for clean slides.',
      },
      {
        title: 'Animated Typing & Keyboard Video Mode',
        detail: 'Preview message-by-message reveals with an optional iOS keyboard overlay for vertical videos.',
      },
    ],
    relatedSlugs: ['android-messages', 'whatsapp-chat', 'fake-call-screen', 'instagram-dm'],
    schemaFeatureList: [
      'Blue iMessage and green SMS bubble styles',
      'Apple Tapback reaction badges',
      'Dynamic Island status bar controls',
      '9:16 animated video timeline preview',
    ],
  },
  'android-messages': {
    slug: 'android-messages',
    h1Title: 'Fake Android Messages & RCS Chat Generator',
    subtitle: 'Material You Google Messages UI with RCS Encryption, Checkmarks & Pixel Bar',
    introParagraphs: [
      'Simulate modern Google Android Messages RCS and SMS conversations with Material You tonal surfaces, Pixel punch-hole status bars, end-to-end RCS encryption headers, and double-circle delivery checkmarks.',
      'Ideal for Android app tutorials, product walkthroughs, cross-platform comparisons, and creative skits, every screenshot renders locally in your browser with zero watermarks and full dark mode support.',
    ],
    howToSteps: [
      {
        title: 'Set Contact & Android Status Bar',
        detail:
          'Configure the recipient name, Pixel punch-hole status bar, battery percentage, and 5G/LTE network indicator.',
      },
      {
        title: 'Build RCS Thread & Reactions',
        detail:
          'Add text messages, voice notes, locations, or contact cards with sent, delivered, or read RCS checkmarks.',
      },
      {
        title: 'Switch Material Light/Dark & Export',
        detail:
          'Toggle Material You light and dark surfaces and export clean PNG, JPG, or WebP assets.',
      },
    ],
    examples: [
      {
        title: 'RCS Onboarding Product Demo',
        useCase: 'SaaS & Mobile Documentation',
        snippet: 'Clean Material You conversation showcasing encrypted RCS messaging and read receipts.',
      },
      {
        title: 'iOS vs Android UI Comparison',
        useCase: 'Editorial & Tech Blog Graphic',
        snippet: 'Side-by-side conversation cloned effortlessly from iMessage into Android Messages.',
      },
    ],
    features: [
      {
        title: 'Material You Tonal Palette',
        detail: 'Accurate Google Blue outgoing bubbles paired with soft tonal incoming surfaces.',
      },
      {
        title: 'Android Punch-Hole Status Bar',
        detail: 'Includes centered camera punch-hole chrome with customizable signal and battery controls.',
      },
      {
        title: 'RCS Encryption Banner & Receipts',
        detail: 'Displays authentic "RCS chat with..." lock notice and delivery checkmarks.',
      },
      {
        title: 'One-Click Cross-Platform Switching',
        detail: 'Switch any drafted thread between Android Messages, iMessage, and WhatsApp without retyping.',
      },
    ],
    relatedSlugs: ['imessage', 'whatsapp-chat', 'telegram-chat', 'fake-call-screen'],
    schemaFeatureList: [
      'Material You light and dark themes',
      'Android punch-hole status bar',
      'RCS encryption notice and read checkmarks',
      'Cross-platform dialogue preservation',
    ],
  },
  'telegram-chat': {
    slug: 'telegram-chat',
    h1Title: 'Fake Telegram Chat & Channel Mockup Generator',
    subtitle: 'Patterned Wallpapers, Reply Quotes, Voice Notes & Document Cards',
    introParagraphs: [
      'Design realistic Telegram personal chats and community threads featuring signature patterned light and dark wallpapers, Telegram blue headers, inline reply quote bars, crisp checkmarks, voice note waveforms, and PDF/file attachment cards.',
      'Everything renders privately in your browser with automatic local draft recovery, screenplay script import, and instant watermark-free exports.',
    ],
    howToSteps: [
      {
        title: 'Customize Contact & Last-Seen Status',
        detail:
          'Set display names, verified badges, and realistic Telegram subtitles like "last seen recently" or "online".',
      },
      {
        title: 'Add Messages, Documents & Replies',
        detail:
          'Compose text bubbles, document cards, voice messages, location pins, or polls with inline reply quotes.',
      },
      {
        title: 'Choose Light/Dark Wallpaper & Export',
        detail:
          'Toggle between classic mint-green light wallpaper and deep slate dark mode, then export at 1x–3x scale.',
      },
    ],
    examples: [
      {
        title: 'Web3 / Developer Community Update',
        useCase: 'Product Announcement Mockup',
        snippet: 'Admin shares PDF release brief with reply quotes and green double-check read indicators.',
      },
      {
        title: 'Bilingual Travel Coordination',
        useCase: 'Localization & UX Showcase',
        snippet: 'Two travelers share live location pins and voice notes over Telegram.',
      },
    ],
    features: [
      {
        title: 'Signature Telegram Wallpapers',
        detail: 'Clean mint-sky light gradient and deep midnight dark theme palettes.',
      },
      {
        title: 'Document & File Cards',
        detail: 'Render structured PDF and file attachment cards with page counts and file sizes.',
      },
      {
        title: 'Inline Reply Quote Threads',
        detail: 'Link replies cleanly to any earlier message with accented left quote borders.',
      },
      {
        title: 'Zero-Upload Client Privacy',
        detail: 'All messages, avatars, and exports stay strictly inside your local browser.',
      },
    ],
    relatedSlugs: ['discord-chat', 'whatsapp-chat', 'whatsapp-group-chat', 'android-messages'],
    schemaFeatureList: [
      'Light and dark Telegram wallpapers',
      'Document attachment cards and polls',
      'Inline reply quote blocks',
      'Watermark-free PNG and WebP export',
    ],
  },
  'discord-chat': {
    slug: 'discord-chat',
    h1Title: 'Fake Discord Chat & Server Channel Generator',
    subtitle: 'Role-Colored Usernames, APP/BOT Tags, Reply Spines & Reaction Pills',
    introParagraphs: [
      'Build authentic Discord server channel screenshots featuring flat stacked member messages, customizable hex role colors, APP/BOT badges, inline reply spine connectors, emoji reaction counter pills, and Discord Dark or Light themes.',
      'Perfect for gaming memes, community onboarding guides, SaaS bot demos, and YouTube storytelling, ChatForge renders every Discord thread locally without login or watermarks.',
    ],
    howToSteps: [
      {
        title: 'Set Channel Name & Server Members',
        detail:
          'Name your #channel topic in the editor and add moderators, members, or BOT/APP accounts with custom role colors.',
      },
      {
        title: 'Compose Messages, Replies & Reactions',
        detail:
          'Add stacked messages, attach inline reply references, and toggle Discord reaction counter pills.',
      },
      {
        title: 'Export Clean Server Screenshots',
        detail:
          'Preview in classic Discord Dark (#313338) or Light mode and download crisp HD PNG or WebP images.',
      },
    ],
    examples: [
      {
        title: 'Launch Weekend Dev Channel',
        useCase: 'SaaS Bot & DevTools Demo',
        snippet: 'Moderator, Design Lead, and Helper BOT post build status updates with reaction pills.',
      },
      {
        title: 'Gaming Server Meme Thread',
        useCase: 'Community & Social Content',
        snippet: 'Multi-member Discord banter with reply spines and custom role badge colors.',
      },
    ],
    features: [
      {
        title: 'Member Role Colors & BOT/APP Tags',
        detail: 'Customize individual username colors and toggle official APP/BOT badges per participant.',
      },
      {
        title: 'Inline Reply Spine Connectors',
        detail: 'Displays Discord-accurate curved reply previews linking back to referenced messages.',
      },
      {
        title: 'Counter Pill Reactions',
        detail: 'Interactive emoji reaction chips with vote counts below messages.',
      },
      {
        title: 'Presentation-Ready Clean Mode',
        detail: 'Hide mobile phone bezels automatically or wrap inside a desktop browser frame.',
      },
    ],
    relatedSlugs: ['whatsapp-group-chat', 'telegram-chat', 'whatsapp-chat', 'instagram-dm'],
    schemaFeatureList: [
      'Discord role colors and APP/BOT badges',
      'Inline reply spine previews',
      'Emoji reaction counter pills',
      'Dark and light Discord channel themes',
    ],
  },
  'fake-call-screen': {
    slug: 'fake-call-screen',
    h1Title: 'Fake Call Screen Generator',
    subtitle: 'iPhone, FaceTime, WhatsApp & Instagram Call Mockups + Live Timer Mode',
    introParagraphs: [
      'Create realistic incoming, outgoing, and active voice or video call screen mockups for iPhone Phone, FaceTime, WhatsApp, and Instagram—with customizable caller photos, ringing pulse animations, and interactive mute, speaker, and video toggles.',
      'Designed to satisfy both static graphic mockups and live on-set film prop needs, you can export a clean screenshot PNG or tap Accept to trigger a live ticking call duration timer right in your browser.',
    ],
    howToSteps: [
      {
        title: 'Choose Call Platform & State',
        detail:
          'Select WhatsApp Voice, WhatsApp Video, iPhone Call, FaceTime, or Instagram Video, then pick Incoming, Outgoing, or Active.',
      },
      {
        title: 'Customize Caller Identity & Status Bar',
        detail:
          'Upload a caller avatar, edit the caller display name and subtitle, and adjust clock and battery indicators.',
      },
      {
        title: 'Run Live Timer or Export Screenshot',
        detail:
          'Click Accept on the live preview to start the connected call timer for film shoots, or export a crisp PNG/WebP.',
      },
    ],
    examples: [
      {
        title: 'Indie Film On-Set Prop Call',
        useCase: 'Short Film & Video Production',
        snippet: 'Incoming WhatsApp voice call with pulsing avatar ring -> Actor taps Accept to start live 01:14 call timer.',
      },
      {
        title: 'Story Hook Opening Frame',
        useCase: 'TikTok & Reels Intro',
        snippet: 'Late-night FaceTime incoming call screenshot used as a 2-second hook before cutting to chat.',
      },
    ],
    features: [
      {
        title: '5 Call Interface Skins',
        detail: 'Switch effortlessly between WhatsApp Voice, WhatsApp Video, iPhone, FaceTime, and Instagram.',
      },
      {
        title: 'Interactive Accept & Timer Mode',
        detail: 'Tap Accept or Decline directly on the preview to transition from pulsing ring to live elapsed seconds.',
      },
      {
        title: 'Working Speaker, Video & Mute Toggles',
        detail: 'Test active call button states visually before capturing your screenshot.',
      },
      {
        title: 'Film-Safe Generic Status Bar Option',
        detail: 'Remove trademarked carrier/notch elements for festival-cleared film distribution.',
      },
    ],
    relatedSlugs: ['whatsapp-chat', 'imessage', 'instagram-dm', 'instagram-story'],
    schemaFeatureList: [
      'iPhone, FaceTime, WhatsApp, and Instagram call skins',
      'Incoming, outgoing, and live active timer modes',
      'Interactive speaker, video, and mute toggles',
      'Watermark-free PNG and WebP export',
    ],
  },
};
