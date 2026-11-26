export type ArchetypeKind =
  | 'chat_thread'
  | 'ephemeral_story'
  | 'social_post'
  | 'call_screen';

export type VerificationBadgeType =
  | 'none'
  | 'blue'
  | 'gold'
  | 'gray'
  | 'business_green'
  | 'bot';

export type MessageType =
  | 'text'
  | 'image'
  | 'video_preview'
  | 'audio'
  | 'voice_note'
  | 'gif'
  | 'sticker'
  | 'document'
  | 'location'
  | 'contact_card'
  | 'call_event'
  | 'story_reply'
  | 'shared_post'
  | 'system'
  | 'date_separator'
  | 'unread_divider'
  | 'poll'
  | 'link_preview';

export type AttachmentKind =
  | 'image'
  | 'video_preview'
  | 'audio'
  | 'voice_note'
  | 'gif'
  | 'sticker'
  | 'document'
  | 'location'
  | 'contact_card'
  | 'story_reply'
  | 'shared_post'
  | 'link_preview';

export type ReadReceiptStatus =
  | 'none'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed';

export type ColorSchemeMode = 'light' | 'dark' | 'dim';
export type OsPlatformVariant = 'ios' | 'android' | 'desktop' | 'generic_filmsafe';

export type DeviceFramePreset =
  | 'none'
  | 'iphone_16_pro'
  | 'pixel_9'
  | 'browser_window'
  | 'transparent_card';

export type ExportFormat = 'png' | 'jpeg' | 'webp' | 'html_css' | 'json_project';

export interface Reaction {
  emoji: string;
  participantIds: string[];
  count: number;
}

export interface ReadReceipt {
  status: ReadReceiptStatus;
  readAtLabel?: string;
  seenByParticipantIds?: string[];
}

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  assetId?: string;
  previewDataUrl?: string;
  mimeType?: string;
  fileName?: string;
  fileSizeBytes?: number;
  pageCount?: number;
  durationSeconds?: number;
  caption?: string;
  voiceNoteMeta?: {
    waveformPeaks: number[];
    playbackSpeed: '1x' | '1.5x' | '2x';
    isListened: boolean;
    transcriptText?: string;
  };
  audioMeta?: {
    trackTitle: string;
    artistName?: string;
  };
  locationMeta?: {
    latitude: number;
    longitude: number;
    placeName: string;
    address?: string;
    isLiveLocation?: boolean;
  };
  contactCardMeta?: {
    fullName: string;
    phoneOrHandle: string;
    organization?: string;
  };
  gifMeta?: {
    providerLabel?: string;
    isLooping: boolean;
  };
  storyReplyMeta?: {
    authorHandle: string;
    storyLabel: string;
    storyGradient?: string;
  };
  sharedPostMeta?: {
    authorHandle: string;
    captionSnippet: string;
    isReel?: boolean;
  };
  linkPreviewMeta?: {
    url: string;
    title: string;
    domain: string;
    previewDataUrl?: string;
    description?: string;
  };
}

export interface Participant {
  id: string;
  displayName: string;
  handle?: string;
  phoneOrEmail?: string;
  avatarDataUrl?: string;
  avatarFallbackColor: string;
  nameColorHex?: string;
  roleLabel?: string;
  verifiedBadge: VerificationBadgeType;
  bioStatus?: string;
  isSelfDefault?: boolean;
  isAdmin?: boolean;
  isGroupCreator?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  type: MessageType;
  text?: string;
  timestampLabel: string;
  replyToMessageId?: string;
  forwardedLabel?: 'none' | 'forwarded' | 'frequently_forwarded';
  isDeleted?: boolean;
  isEdited?: boolean;
  isStarred?: boolean;
  isPinned?: boolean;
  commentLikes?: number;
  messageEffect?:
    | 'none'
    | 'invisible_ink'
    | 'gentle'
    | 'loud'
    | 'slam'
    | 'echo'
    | 'confetti'
    | 'lasers'
    | 'balloons';
  attachments: Attachment[];
  reactions: Reaction[];
  readReceipt: ReadReceipt;
  callEvent?: {
    media: 'voice' | 'video';
    outcome: 'answered' | 'missed' | 'declined' | 'cancelled';
    durationLabel?: string;
  };
  pollData?: {
    question: string;
    allowMultiple: boolean;
    options: Array<{ id: string; label: string; voteCount: number; votedBySelf?: boolean }>;
  };
}

export type StoryStickerType =
  | 'text'
  | 'mention'
  | 'location'
  | 'hashtag'
  | 'poll'
  | 'question'
  | 'emoji_slider'
  | 'countdown'
  | 'link'
  | 'music'
  | 'image_overlay';

export type StoryFontStyle =
  | 'classic'
  | 'modern'
  | 'neon'
  | 'typewriter'
  | 'strong';

export interface StoryElement {
  id: string;
  type: StoryStickerType;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale?: number; // scale factor 0.5 to 2
  rotation?: number; // degrees -180 to 180
  zIndex?: number;
  text?: string;
  fontStyle?: StoryFontStyle;
  color?: string;
  bgColor?: string;
  align?: 'left' | 'center' | 'right';
  mentionHandle?: string;
  locationName?: string;
  hashtagText?: string;
  pollQuestion?: string;
  pollOption1?: string;
  pollOption2?: string;
  pollVotes1?: number;
  pollVotes2?: number;
  questionPrompt?: string;
  sliderEmoji?: string;
  sliderValue?: number;
  sliderQuestion?: string;
  countdownName?: string;
  countdownTarget?: string;
  linkUrl?: string;
  linkText?: string;
  musicTrack?: string;
  musicArtist?: string;
  imageUrl?: string;
}

export interface StorySlide {
  id: string;
  backgroundCss: string;
  imageDataUrl?: string;
  headlineText: string;
  subText?: string;
  postedAtLabel: string;
  pollQuestion?: string;
  pollOptions?: [string, string];
  musicLabel?: string;
  elements?: StoryElement[];
}

export interface PostCarouselSlide {
  id: string;
  imageDataUrl?: string;
  imageGradient?: string;
  alt?: string;
  tagCount?: number;
}

export interface Conversation {
  id: string;
  title: string;
  platformId: string;
  mode: 'direct' | 'group' | 'channel' | 'story' | 'post' | 'call';
  participantIds: string[];
  selfParticipantId: string;
  groupMeta?: {
    groupName: string;
    groupDescription?: string;
    groupAvatarDataUrl?: string;
    pinnedMessageId?: string;
    memberCountOverride?: number;
    showSenderNamesInBubbles: boolean;
    showSenderAvatarsInBubbles: boolean;
  };
  headerState: {
    statusText?: string;
    typingParticipantIds: string[];
    isEncryptedNoticeVisible?: boolean;
    isVanishMode?: boolean;
    channelName?: string;
    backButtonLabel?: string;
    serviceSubtitle?: string;
    showFaceTimeAction?: boolean;
    androidProfile?: 'google_messages' | 'samsung_oneui' | 'classic_sms';
    simSlotLabel?: string;
    isRcsMode?: boolean;
    showSearchAction?: boolean;
    telegramProfile?: 'telegram_modern' | 'telegram_classic' | 'telegram_ios';
    showPinnedBar?: boolean;
    pinnedBarText?: string;
    pinnedBarTitle?: string;
    telegramTheme?: 'classic_blue' | 'dark' | 'night' | 'day';
    telegramMembersCountLabel?: string;
  };
  storyMeta?: {
    slides: StorySlide[];
    activeSlideIndex: number;
    viewerCount: number;
  };
  postMeta?: {
    locationLabel?: string;
    aspectRatio: '1:1' | '4:5' | '16:9';
    caption: string;
    imageDataUrl?: string;
    imageGradient?: string;
    carouselImages?: PostCarouselSlide[];
    activeCarouselIndex?: number;
    simulateMoreCutoff: boolean;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isLikedBySelf: boolean;
    isBookmarkedBySelf: boolean;
    isSponsored?: boolean;
    isVideo?: boolean;
    videoDurationLabel?: string;
    viewCount?: number;
    objectFit?: 'cover' | 'contain';
    musicTrack?: string;
    musicArtist?: string;
    taggedAccounts?: string[];
    showTags?: boolean;
    postTimestampLabel?: string;
    likedByUsername?: string;
    hasStoryRing?: boolean;
  };
  callMeta?: {
    callPlatform: 'ios-phone' | 'facetime' | 'whatsapp-voice' | 'whatsapp-video' | 'instagram-video';
    direction: 'incoming' | 'outgoing' | 'active';
    callStateLabel: string;
    durationSeconds: number;
    isMuted: boolean;
    isSpeakerOn: boolean;
    isCameraOn: boolean;
  };
  messages: Message[];
}

export interface PlatformTheme {
  platformId: string;
  colorScheme: ColorSchemeMode;
  osVariant: OsPlatformVariant;
  uiVersion?: 'ios_modern' | 'android_modern' | 'android_classic';
  bubbleStyle:
  | 'native'
  | 'sms_green'
  | 'imessage_blue'
  | 'gradient_ig'
  | 'whatsapp_classic'
  | 'whatsapp_modern_pill'
  | 'whatsapp_high_contrast';
  accentColorHex?: string;
  wallpaper: {
    kind: 'default_pattern' | 'solid' | 'gradient' | 'image';
    value: string;
  };
  statusBar: {
    visible: boolean;
    timeLabel: string;
    batteryPercent: number;
    isCharging: boolean;
    wifiBars: 0 | 1 | 2 | 3;
    signalBars: 0 | 1 | 2 | 3 | 4;
    carrierLabel?: string;
    notchStyle: 'dynamic_island' | 'notch' | 'punch_hole' | 'none';
  };
  typography: {
    fontScale: number;
    use24HourClock: boolean;
    locale: string;
    direction: 'ltr' | 'rtl';
  };
  safetyBadge: {
    enabled: boolean;
    labelText: string;
  };
}

export interface ExportSettings {
  format: ExportFormat;
  scaleFactor: 1 | 2 | 3;
  deviceFrame: DeviceFramePreset;
  backgroundMode: 'platform' | 'transparent' | 'solid';
  captureScope: 'viewport' | 'full_conversation';
  printFriendlyMonochrome: boolean;
  useCustomDimensions?: boolean;
  customWidthPx?: number;
  customHeightPx?: number;
}

export interface TimelineStep {
  id: string;
  messageId: string;
  startAtMs: number;
  typingDurationMs: number;
  soundEffect: 'none' | 'send_pop' | 'receive_pop';
}

export interface AnimationTimeline {
  enabled: boolean;
  playbackMode: 'timeline_video' | 'prop_tap_to_advance';
  defaultMessageDelayMs: number;
  defaultTypingDurationMs: number;
  loopPlayback: boolean;
  steps: TimelineStep[];
  videoOptions?: {
    aspectRatio: '9:16' | '4:5' | '1:1';
    backgroundCss: string;
    showKeyboard: boolean;
    simulateVoicePlayback: boolean;
    perMessageDelays: Record<string, number>;
  };
}

export type TemplateCategory =
  | 'funny'
  | 'relationship'
  | 'friendship'
  | 'marketing'
  | 'customer_support'
  | 'product_promotion'
  | 'giveaway'
  | 'delivery_story'
  | 'educational';

export interface Template {
  id: string;
  slug: string;
  title: string;
  category: TemplateCategory;
  description: string;
  isCustom?: boolean;
  supportedArchetypes: ArchetypeKind[];
  roles: Array<{
    roleKey: string;
    defaultName: string;
    isSelf: boolean;
    verifiedBadge?: VerificationBadgeType;
  }>;
  scriptMessages: Array<{
    roleKey: string;
    type: MessageType;
    text: string;
    timestampLabel: string;
    readStatus?: ReadReceiptStatus;
  }>;
}

export interface Project {
  id: string;
  schemaVersion: number;
  title: string;
  platformId: string;
  archetype: ArchetypeKind;
  conversations: Conversation[];
  activeConversationId: string;
  cast: Participant[];
  theme: PlatformTheme;
  exportSettings: ExportSettings;
  timeline: AnimationTimeline;
  createdAt: string;
  updatedAt: string;
}

export type GeneratorCategory =
  | 'messaging'
  | 'social_post'
  | 'story_profile'
  | 'phone_mockup';

export interface PlatformCapabilities {
  archetype: ArchetypeKind;
  supportsGroupChat: boolean;
  supportsDarkMode: boolean;
  supportsOsSwitch: boolean;
  supportsReadReceipts: boolean;
  supportsTypingIndicator: boolean;
  supportsReactions: boolean;
  supportsStatusBar: boolean;
  supportedMessageTypes: MessageType[];
}

export interface GeneratorManifest {
  id: string;
  slug: string;
  routeSlug: string;
  routePath: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: GeneratorCategory;
  platformFamily: 'WhatsApp' | 'Instagram' | 'Apple' | 'Google' | 'Telegram' | 'Discord' | 'Phone UI';
  popular?: boolean;
  recentlyAdded?: boolean;
  accentGradient: string;
  badgeColor: string;
  capabilities: PlatformCapabilities;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  editorBadge?: string;
}
