import { BUILTIN_TEMPLATES } from '@/core/engine/templateLibrary';
import type {
  Conversation,
  Participant,
  PlatformTheme,
  Project,
} from '@/core/types';
import { GENERATOR_MAP } from '@/core/registry/generators';

function nowIso(): string {
  return new Date().toISOString();
}

export function createDefaultTheme(platformId: string): PlatformTheme {
  const isDiscord = platformId === 'discord-chat';
  return {
    platformId,
    colorScheme: isDiscord ? 'dark' : 'light',
    osVariant: platformId === 'android-messages' ? 'android' : 'ios',
    uiVersion: platformId === 'android-messages' ? 'android_modern' : 'ios_modern',
    bubbleStyle: platformId === 'imessage' ? 'imessage_blue' : 'native',
    accentColorHex: platformId === 'instagram-dm' ? '#7C3AED' : '#4F46E5',
    wallpaper: {
      kind: 'default_pattern',
      value: '#ECE5DD',
    },
    statusBar: {
      visible: platformId !== 'discord-chat' && platformId !== 'instagram-post',
      timeLabel: '9:41',
      batteryPercent: 86,
      isCharging: false,
      wifiBars: 3,
      signalBars: 4,
      carrierLabel: '5G',
      notchStyle: platformId === 'android-messages' ? 'punch_hole' : 'dynamic_island',
    },
    typography: {
      fontScale: 1,
      use24HourClock: false,
      locale: 'en-US',
      direction: 'ltr',
    },
    safetyBadge: {
      enabled: false,
      labelText: 'Simulated Mockup • Created with ChatForge',
    },
  };
}

export function createSeedProject(platformId: string): Project {
  const manifest = GENERATOR_MAP[platformId] ?? GENERATOR_MAP['whatsapp-chat'];
  const id = `proj_${manifest.id}_default`;
  const selfId = 'part_self';
  const otherId = 'part_alex';
  const thirdId = 'part_sam';
  const fourthId = 'part_taylor';

  const baseCast: Participant[] = [
    {
      id: selfId,
      displayName: 'You',
      handle: '@you.studio',
      avatarFallbackColor: '#4F46E5',
      nameColorHex: '#4F46E5',
      verifiedBadge: 'none',
      isSelfDefault: true,
      isAdmin: manifest.id === 'whatsapp-group-chat',
      isGroupCreator: manifest.id === 'whatsapp-group-chat',
    },
    {
      id: otherId,
      displayName: 'Maya Lin',
      handle: '@mayalin.creates',
      phoneOrEmail: '+1 (415) 555-0194',
      avatarFallbackColor: '#7C3AED',
      nameColorHex: '#059669',
      roleLabel: manifest.id === 'discord-chat' ? 'Moderator' : 'Admin',
      verifiedBadge:
        manifest.id === 'instagram-post' ||
        manifest.id === 'instagram-dm' ||
        manifest.id === 'instagram-story'
          ? 'blue'
          : 'none',
      bioStatus: 'online',
      isAdmin: manifest.id === 'whatsapp-group-chat',
    },
    {
      id: thirdId,
      displayName: 'Daniel Ortiz',
      handle: '@daniel.agency',
      avatarFallbackColor: '#2563EB',
      nameColorHex: '#2563EB',
      roleLabel: manifest.id === 'discord-chat' ? 'Design Lead' : undefined,
      verifiedBadge: 'none',
    },
    {
      id: fourthId,
      displayName: 'ChatBot Helper',
      handle: '@helper_bot',
      avatarFallbackColor: '#0EA5E9',
      nameColorHex: '#D97706',
      roleLabel: 'BOT',
      verifiedBadge: manifest.id === 'discord-chat' ? 'bot' : 'none',
    },
  ];

  const isGroup =
    manifest.id === 'whatsapp-group-chat' || manifest.id === 'discord-chat';

  const conversation: Conversation = {
    id: 'conv_main',
    title: manifest.name,
    platformId: manifest.id,
    mode:
      manifest.capabilities.archetype === 'ephemeral_story'
        ? 'story'
        : manifest.capabilities.archetype === 'social_post'
          ? 'post'
          : manifest.capabilities.archetype === 'call_screen'
            ? 'call'
            : isGroup
              ? 'group'
              : 'direct',
    participantIds: isGroup ? [selfId, otherId, thirdId, fourthId] : [selfId, otherId],
    selfParticipantId: selfId,
    groupMeta: isGroup
      ? {
          groupName:
            manifest.id === 'discord-chat' ? '#launch-weekend' : 'Weekend Shoot Crew 🎬',
          groupDescription:
            manifest.id === 'whatsapp-group-chat'
              ? 'Campaign shoot schedule, creative reviews & export approvals.'
              : undefined,
          pinnedMessageId: manifest.id === 'whatsapp-group-chat' ? 'msg_g_1' : undefined,
          memberCountOverride: 14,
          showSenderNamesInBubbles: true,
          showSenderAvatarsInBubbles: true,
        }
      : undefined,
    headerState: {
      statusText:
        manifest.id === 'whatsapp-group-chat'
          ? 'Maya, Daniel, You, +11 more'
          : manifest.id === 'discord-chat'
            ? '48 online • Launch planning channel'
            : 'online',
      typingParticipantIds: [],
      isEncryptedNoticeVisible: manifest.id === 'whatsapp-chat',
      isVanishMode: false,
      channelName: 'launch-weekend',
    },
    storyMeta:
      manifest.capabilities.archetype === 'ephemeral_story'
        ? {
            slides: [
              {
                id: 'slide_1',
                backgroundCss:
                  'linear-gradient(155deg, #4F46E5 0%, #7C3AED 48%, #EC4899 100%)',
                headlineText: 'Launching our new creator studio tonight ✨',
                subText: 'Zero watermarks. Crisp HD exports.',
                postedAtLabel: '2h',
                pollQuestion: 'Which mockup do you use most?',
                pollOptions: ['WhatsApp / iMessage', 'Instagram DM / Story'],
                musicLabel: 'Midnight Synth • Studio Mix',
                elements: [
                  {
                    id: 'el_mention_1',
                    type: 'mention',
                    mentionHandle: '@mayalin.creates',
                    x: 50,
                    y: 22,
                    scale: 1,
                  },
                  {
                    id: 'el_loc_1',
                    type: 'location',
                    locationName: 'Shibuya, Tokyo',
                    x: 26,
                    y: 29,
                    scale: 1,
                  },
                  {
                    id: 'el_tag_1',
                    type: 'hashtag',
                    hashtagText: '#CreatorTools',
                    x: 74,
                    y: 29,
                    scale: 1,
                  },
                  {
                    id: 'el_poll_1',
                    type: 'poll',
                    pollQuestion: 'Which mockup do you use most?',
                    pollOption1: 'WhatsApp / iMessage',
                    pollOption2: 'Instagram DM / Story',
                    pollVotes1: 68,
                    pollVotes2: 32,
                    x: 50,
                    y: 55,
                    scale: 1,
                  },
                  {
                    id: 'el_link_1',
                    type: 'link',
                    linkUrl: 'https://chatforge.dev/mockups',
                    linkText: 'chatforge.dev/mockups',
                    x: 50,
                    y: 74,
                    scale: 1,
                  },
                ],
              },
              {
                id: 'slide_2',
                backgroundCss:
                  'linear-gradient(155deg, #1E1B4B 0%, #312E81 55%, #2563EB 100%)',
                headlineText: 'Drop your feedback below 👇',
                subText: 'Swipe up or tap the poll to vote',
                postedAtLabel: '1h',
                elements: [
                  {
                    id: 'el_q_1',
                    type: 'question',
                    questionPrompt: 'Ask me anything about our 2026 launch!',
                    x: 50,
                    y: 30,
                    scale: 1,
                  },
                  {
                    id: 'el_slider_1',
                    type: 'emoji_slider',
                    sliderEmoji: '🔥',
                    sliderValue: 88,
                    sliderQuestion: 'How hyped are you for dark mode?',
                    x: 50,
                    y: 54,
                    scale: 1,
                  },
                  {
                    id: 'el_cd_1',
                    type: 'countdown',
                    countdownName: 'Major Release Drop',
                    countdownTarget: '02d 14h 35m',
                    x: 50,
                    y: 74,
                    scale: 1,
                  },
                ],
              },
            ],
            activeSlideIndex: 0,
            viewerCount: 1428,
          }
        : undefined,
    postMeta:
      manifest.capabilities.archetype === 'social_post'
        ? {
            locationLabel: 'San Francisco, California',
            aspectRatio: '4:5',
            caption:
              'Just wrapped our biggest creator workflow upgrade yet! Swipe through how teams draft, preview, and ship mobile-first stories in under 60 seconds without opening a single heavy PSD template. #CreatorTools #MockupDesign #UIUX',
            imageGradient:
              'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 35%, #DDD6FE 70%, #DBEAFE 100%)',
            carouselImages: [
              {
                id: 'c_slide_1',
                imageGradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 35%, #DDD6FE 70%, #DBEAFE 100%)',
                alt: 'Creator workflow hero preview',
              },
              {
                id: 'c_slide_2',
                imageGradient: 'linear-gradient(135deg, #FDF4FF 0%, #F5D0FE 40%, #A855F7 80%, #6366F1 100%)',
                alt: 'Instant export without watermarks',
              },
              {
                id: 'c_slide_3',
                imageGradient: 'linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 40%, #059669 80%, #064E3B 100%)',
                alt: 'Multi-platform live preview',
              },
            ],
            activeCarouselIndex: 0,
            simulateMoreCutoff: true,
            likeCount: 2841,
            commentCount: 94,
            shareCount: 312,
            isLikedBySelf: true,
            isBookmarkedBySelf: false,
            isSponsored: false,
            objectFit: 'cover',
            musicTrack: 'Creator Flow',
            musicArtist: 'ChatForge Sound',
            taggedAccounts: ['@daniel.agency', '@you.studio'],
            showTags: false,
            postTimestampLabel: '2 HOURS AGO',
            likedByUsername: 'daniel.agency',
            hasStoryRing: true,
          }
        : undefined,
    callMeta:
      manifest.capabilities.archetype === 'call_screen'
        ? {
            callPlatform: 'whatsapp-voice',
            direction: 'incoming',
            callStateLabel: 'WhatsApp voice call',
            durationSeconds: 74,
            isMuted: false,
            isSpeakerOn: true,
            isCameraOn: false,
          }
        : undefined,
    messages: buildSeedMessages(manifest.id, selfId, otherId, thirdId, fourthId),
  };

  const ts = nowIso();
  return {
    id,
    schemaVersion: 1,
    title: `${manifest.shortName} Draft`,
    platformId: manifest.id,
    archetype: manifest.capabilities.archetype,
    conversations: [conversation],
    activeConversationId: conversation.id,
    cast: baseCast,
    theme: createDefaultTheme(manifest.id),
    exportSettings: {
      format: 'png',
      scaleFactor: 2,
      deviceFrame: manifest.id === 'discord-chat' || manifest.id === 'instagram-post' ? 'none' : 'iphone_16_pro',
      backgroundMode: 'platform',
      captureScope: 'full_conversation',
      printFriendlyMonochrome: false,
      useCustomDimensions: false,
      customWidthPx: 1080,
      customHeightPx: 1350,
    },
    timeline: {
      enabled: true,
      playbackMode: 'timeline_video',
      defaultMessageDelayMs: 900,
      defaultTypingDurationMs: 650,
      loopPlayback: false,
      steps: [],
      videoOptions: {
        aspectRatio: '9:16',
        backgroundCss: 'linear-gradient(135deg, #0f172a 0%, #312e81 55%, #1e1b4b 100%)',
        showKeyboard: false,
        simulateVoicePlayback: true,
        perMessageDelays: {},
      },
    },
    createdAt: ts,
    updatedAt: ts,
  };
}

function buildSeedMessages(
  platformId: string,
  selfId: string,
  otherId: string,
  thirdId: string,
  fourthId: string
): Conversation['messages'] {
  if (platformId === 'fake-call-screen') {
    return [];
  }

  if (platformId === 'instagram-dm') {
    return [
      {
        id: 'ig_date_1',
        senderId: 'system',
        type: 'date_separator' as const,
        text: 'Today',
        timestampLabel: '',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'none' as const },
      },
      {
        id: 'ig_1',
        senderId: otherId,
        type: 'text' as const,
        text: 'Hey! Loved your latest Reel 🔥 Can we collab?',
        timestampLabel: '9:38 AM',
        attachments: [],
        reactions: [{ emoji: '❤️', participantIds: [selfId], count: 1 }],
        readReceipt: { status: 'read' as const },
      },
      {
        id: 'ig_2',
        senderId: selfId,
        type: 'text' as const,
        text: 'Absolutely! Let\'s do a DM series together 🤝',
        timestampLabel: '9:39 AM',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'read' as const, readAtLabel: '9:39 AM' },
      },
      {
        id: 'ig_3',
        senderId: otherId,
        type: 'shared_post' as const,
        text: '',
        timestampLabel: '9:40 AM',
        attachments: [
          {
            id: 'att_sp_1',
            kind: 'shared_post' as const,
            sharedPostMeta: {
              authorHandle: '@mayalin.creates',
              captionSnippet: 'Behind the scenes of our biggest drop yet 🎬',
              isReel: true,
            },
          },
        ],
        reactions: [],
        readReceipt: { status: 'read' as const },
      },
      {
        id: 'ig_4',
        senderId: selfId,
        type: 'voice_note' as const,
        text: 'Sent you a voice note!',
        timestampLabel: '9:41 AM',
        attachments: [
          {
            id: 'att_vn_ig',
            kind: 'voice_note' as const,
            durationSeconds: 11,
            voiceNoteMeta: {
              waveformPeaks: [0.3, 0.6, 0.85, 0.5, 0.9, 0.7, 0.4, 0.65, 0.95, 0.55, 0.3,
                0.75, 0.9, 0.5, 0.35, 0.7, 0.85, 0.6, 0.4, 0.65],
              playbackSpeed: '1x' as const,
              isListened: false,
            },
          },
        ],
        reactions: [],
        readReceipt: { status: 'read' as const, readAtLabel: '9:41 AM' },
      },
      {
        id: 'ig_5',
        senderId: otherId,
        type: 'story_reply' as const,
        text: 'Okay this story is EVERYTHING 😍',
        timestampLabel: '9:42 AM',
        attachments: [
          {
            id: 'att_sr_1',
            kind: 'story_reply' as const,
            storyReplyMeta: {
              authorHandle: '@you.studio',
              storyLabel: 'New creator tool drop ✨',
              storyGradient: 'linear-gradient(155deg,#4F46E5,#A855F7,#EC4899)',
            },
          },
        ],
        reactions: [{ emoji: '😍', participantIds: [selfId], count: 1 }],
        readReceipt: { status: 'read' as const },
      },
      {
        id: 'ig_6',
        senderId: selfId,
        type: 'text' as const,
        text: 'Thanks! Dropping the full tutorial tomorrow 🚀',
        timestampLabel: '9:43 AM',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'delivered' as const },
      },
    ];
  }

  if (platformId === 'instagram-post') {
    return [
      {
        id: 'msg_post_c1',
        senderId: thirdId,
        type: 'text',
        text: 'The "...more" cutoff preview saved our campaign hook 🙌',
        timestampLabel: '24m',
        isPinned: true,
        commentLikes: 14,
        attachments: [],
        reactions: [{ emoji: '❤️', participantIds: [otherId], count: 14 }],
        readReceipt: { status: 'none' },
      },
      {
        id: 'msg_post_c1_reply',
        senderId: otherId,
        type: 'text',
        text: 'Glad it helped! We made sure the character threshold is exact 🎯',
        timestampLabel: '18m',
        replyToMessageId: 'msg_post_c1',
        commentLikes: 5,
        attachments: [],
        reactions: [{ emoji: '❤️', participantIds: [thirdId], count: 5 }],
        readReceipt: { status: 'none' },
      },
      {
        id: 'msg_post_c2',
        senderId: selfId,
        type: 'text',
        text: 'Exported the 4:5 preview in seconds — zero watermark!',
        timestampLabel: '12m',
        commentLikes: 6,
        attachments: [],
        reactions: [{ emoji: '🔥', participantIds: [thirdId], count: 6 }],
        readReceipt: { status: 'none' },
      },
    ];
  }

  if (platformId === 'imessage') {
    return [
      {
        id: 'msg_im_date',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today 9:41 AM',
        timestampLabel: '',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'none' },
      },
      {
        id: 'msg_im_1',
        senderId: otherId,
        type: 'text',
        text: 'Hey! Did you check out the new iOS 18 design drop?',
        timestampLabel: '9:38 AM',
        attachments: [],
        reactions: [{ emoji: '❤️', participantIds: [selfId], count: 1 }],
        readReceipt: { status: 'read' },
      },
      {
        id: 'msg_im_2',
        senderId: selfId,
        type: 'text',
        text: 'Yeah, the iMessage Tapbacks and effects look incredible 🚀',
        timestampLabel: '9:39 AM',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'read', readAtLabel: '9:39 AM' },
      },
      {
        id: 'msg_im_3',
        senderId: otherId,
        type: 'voice_note',
        text: 'Voice note preview',
        timestampLabel: '9:40 AM',
        attachments: [
          {
            id: 'att_vn_im',
            kind: 'voice_note',
            durationSeconds: 14,
            voiceNoteMeta: {
              waveformPeaks: [0.2, 0.5, 0.8, 0.4, 0.9, 0.7, 0.3, 0.6, 0.95, 0.5, 0.3, 0.7, 0.85, 0.4],
              playbackSpeed: '1x',
              isListened: false,
            },
          },
        ],
        reactions: [],
        readReceipt: { status: 'read' },
      },
      {
        id: 'msg_im_4',
        senderId: selfId,
        type: 'text',
        text: 'Meeting at Apple Park at noon! See you there 🎉',
        timestampLabel: '9:42 AM',
        replyToMessageId: 'msg_im_1',
        messageEffect: 'confetti',
        attachments: [],
        reactions: [{ emoji: '‼️', participantIds: [otherId], count: 1 }],
        readReceipt: { status: 'delivered' },
      },
    ];
  }

  if (platformId === 'android-messages') {
    return [
      {
        id: 'msg_am_date',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today • 10:00 AM',
        timestampLabel: '',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'none' },
      },
      {
        id: 'msg_am_1',
        senderId: otherId,
        type: 'text',
        text: 'Hey! Are you using the new Google Messages RCS features?',
        timestampLabel: '10:00 AM',
        attachments: [],
        reactions: [{ emoji: '👍', participantIds: [selfId], count: 1 }],
        readReceipt: { status: 'read' },
      },
      {
        id: 'msg_am_2',
        senderId: selfId,
        type: 'text',
        text: 'Yes! The Material You dynamic theme and high-res photo sharing work so smoothly 🚀',
        timestampLabel: '10:02 AM',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'read', readAtLabel: '10:02 AM' },
      },
      {
        id: 'msg_am_3',
        senderId: otherId,
        type: 'voice_note',
        text: 'Audio message (0:12)',
        timestampLabel: '10:03 AM',
        attachments: [
          {
            id: 'att_vn_am',
            kind: 'voice_note',
            durationSeconds: 12,
            voiceNoteMeta: {
              waveformPeaks: [0.3, 0.6, 0.8, 0.5, 0.9, 0.7, 0.4, 0.65, 0.85, 0.5, 0.3, 0.7, 0.4],
              playbackSpeed: '1x',
              isListened: false,
            },
          },
        ],
        reactions: [],
        readReceipt: { status: 'read' },
      },
      {
        id: 'msg_am_4',
        senderId: selfId,
        type: 'text',
        text: 'Just sent the project proposal over to the team!',
        timestampLabel: '10:05 AM',
        replyToMessageId: 'msg_am_1',
        attachments: [],
        reactions: [{ emoji: '❤️', participantIds: [otherId], count: 1 }],
        readReceipt: { status: 'delivered' },
      },
    ];
  }

  if (platformId === 'whatsapp-group-chat' || platformId === 'discord-chat') {
    return [
      {
        id: 'msg_g_date',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today',
        timestampLabel: '',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'none' },
      },
      {
        id: 'msg_g_1',
        senderId: otherId,
        type: 'text',
        text: 'Team, final thumbnail & chat scene needs to go out before 5 PM!',
        timestampLabel: '2:14 PM',
        attachments: [],
        reactions: [{ emoji: '🔥', participantIds: [selfId, thirdId], count: 2 }],
        readReceipt: { status: 'read' },
      },
      {
        id: 'msg_g_2',
        senderId: thirdId,
        type: 'text',
        text: 'Just updated the dark mode contrast and verified all checkmarks.',
        timestampLabel: '2:15 PM',
        replyToMessageId: 'msg_g_1',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'read' },
      },
      {
        id: 'msg_g_3',
        senderId: fourthId,
        type: 'text',
        text: 'Build #402 passed all visual regression checks at 360px and 1440px.',
        timestampLabel: '2:16 PM',
        attachments: [],
        reactions: [{ emoji: '✅', participantIds: [otherId], count: 3 }],
        readReceipt: { status: 'read' },
      },
      {
        id: 'msg_g_4',
        senderId: selfId,
        type: 'text',
        text: 'Awesome — exporting the clean 2x PNG right now!',
        timestampLabel: '2:17 PM',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'read', readAtLabel: '2:17 PM' },
      },
    ];
  }

  return [
    {
      id: 'msg_date_1',
      senderId: 'system',
      type: 'date_separator',
      text: 'Today',
      timestampLabel: '',
      attachments: [],
      reactions: [],
      readReceipt: { status: 'none' },
    },
    {
      id: 'msg_1',
      senderId: otherId,
      type: 'text',
      text: 'Hey! Did you get the studio mockup ready for tomorrow’s reel?',
      timestampLabel: '9:38 AM',
      attachments: [],
      reactions: [],
      readReceipt: { status: 'read' },
    },
    {
      id: 'msg_2',
      senderId: selfId,
      type: 'text',
      text: 'Almost done — switching it to dark mode and exporting without any watermarks.',
      timestampLabel: '9:39 AM',
      attachments: [],
      reactions: [{ emoji: '❤️', participantIds: [otherId], count: 1 }],
      readReceipt: { status: 'read', readAtLabel: '9:39 AM' },
    },
    {
      id: 'msg_3',
      senderId: otherId,
      type: 'voice_note',
      text: 'Quick voice note with feedback!',
      timestampLabel: '9:40 AM',
      attachments: [
        {
          id: 'att_vn_1',
          kind: 'voice_note',
          durationSeconds: 14,
          voiceNoteMeta: {
            waveformPeaks: [
              0.25, 0.55, 0.85, 0.45, 0.9, 0.7, 0.35, 0.65, 0.95, 0.6, 0.4,
              0.75, 0.85, 0.5, 0.3, 0.7, 0.9, 0.55, 0.4, 0.65, 0.35, 0.25,
            ],
            playbackSpeed: '1x',
            isListened: true,
          },
        },
      ],
      reactions: [],
      readReceipt: { status: 'read' },
    },
    {
      id: 'msg_4',
      senderId: selfId,
      type: 'text',
      text: 'Perfect, sending the high-res export in 3... 2... 1 🚀',
      timestampLabel: '9:41 AM',
      attachments: [],
      reactions: [],
      readReceipt: { status: 'delivered' },
    },
  ];
}

export const STARTER_TEMPLATES = BUILTIN_TEMPLATES;
