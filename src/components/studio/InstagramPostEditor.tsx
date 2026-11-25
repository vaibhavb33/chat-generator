'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Camera,
  Heart,
  ImagePlus,
  Layers,
  MessageSquare,
  Music2,
  Pin,
  Plus,
  Redo2,
  Reply,
  Sparkles,
  Trash2,
  Undo2,
  Upload,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives';
import { validateImageFileUpload } from '@/core/security/validation';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import type {
  Conversation,
  PostCarouselSlide,
  VerificationBadgeType,
} from '@/core/types';
import { cn } from '@/lib/utils';

let postElementCounter = 0;
function createPostSlideId(): string {
  postElementCounter += 1;
  return `slide_${Date.now()}_${postElementCounter}`;
}

function createCommentId(): string {
  postElementCounter += 1;
  return `c_${Date.now()}_${postElementCounter}`;
}

const GRADIENT_PRESETS = [
  {
    name: 'Instagram Sunset',
    value: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 40%, #EC4899 75%, #F43F5E 100%)',
    bg: 'from-indigo-600 via-purple-600 to-pink-500',
  },
  {
    name: 'Midnight Dark',
    value: 'linear-gradient(135deg, #09090B 0%, #18181B 50%, #27272A 100%)',
    bg: 'from-zinc-950 via-zinc-900 to-zinc-800',
  },
  {
    name: 'Ocean Cyan',
    value: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 50%, #3B82F6 100%)',
    bg: 'from-sky-600 via-cyan-500 to-blue-500',
  },
  {
    name: 'Emerald Luxury',
    value: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%)',
    bg: 'from-emerald-900 via-emerald-700 to-emerald-500',
  },
  {
    name: 'Rose Gold',
    value: 'linear-gradient(135deg, #881337 0%, #E11D48 45%, #FDA4AF 100%)',
    bg: 'from-rose-900 via-rose-600 to-rose-300',
  },
  {
    name: 'Warm Amber',
    value: 'linear-gradient(135deg, #78350F 0%, #D97706 50%, #FDE68A 100%)',
    bg: 'from-amber-900 via-amber-600 to-amber-200',
  },
];

interface PostTemplateDef {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  author: {
    displayName: string;
    handle: string;
    verifiedBadge: VerificationBadgeType;
    avatarColor: string;
  };
  postMeta: Partial<NonNullable<Conversation['postMeta']>>;
  comments: Array<{
    id: string;
    sender: {
      displayName: string;
      handle: string;
      avatarColor: string;
      verifiedBadge: VerificationBadgeType;
    };
    text: string;
    timestampLabel: string;
    commentLikes?: number;
    replyToId?: string;
    isPinned?: boolean;
  }>;
}

const POST_TEMPLATES: PostTemplateDef[] = [
  {
    id: 'business_promo',
    name: 'Business Promotion',
    tagline: 'Brand spring sale, discount code, carousel offers & product benefits',
    badge: 'E-Commerce / Brand',
    author: {
      displayName: 'Lumina Botanicals',
      handle: '@lumina.skincare',
      verifiedBadge: 'blue',
      avatarColor: '#EC4899',
    },
    postMeta: {
      locationLabel: 'SoHo, New York',
      aspectRatio: '4:5',
      caption:
        '✨ Flash Spring Sale! Take 30% off our award-winning Botanical Dew Serum collection this weekend only with code DEW30 at checkout. Tap the link in bio to shop before stock runs out! 🌸🌿 #LuminaGlow #CleanBeauty #SpringSale #SkincareRoutine #SerumDrop',
      likeCount: 18420,
      likedByUsername: 'alex_beauty',
      commentCount: 342,
      shareCount: 915,
      isLikedBySelf: true,
      isBookmarkedBySelf: true,
      isSponsored: true,
      musicTrack: 'Dewy Morning Vibe',
      musicArtist: 'Lumina Sound',
      taggedAccounts: ['@sephora', '@ulta'],
      postTimestampLabel: '3 HOURS AGO',
      carouselImages: [
        {
          id: 'slide_bp_1',
          imageGradient: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #F472B6 100%)',
          alt: 'Botanical Dew Serum Collection Hero',
        },
        {
          id: 'slide_bp_2',
          imageGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #93C5FD 100%)',
          alt: 'Clinical Trials & Hydration Metrics',
        },
        {
          id: 'slide_bp_3',
          imageGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 50%, #6EE7B7 100%)',
          alt: 'Bundle & 30% Off Checkout Code',
        },
      ],
      activeCarouselIndex: 0,
    },
    comments: [
      {
        id: 'c_bp_1',
        sender: {
          displayName: 'Sam Glow',
          handle: '@glow_with_sam',
          avatarColor: '#8B5CF6',
          verifiedBadge: 'none',
        },
        text: 'Already placed my order for 2 bottles! Best serum hands down 💖',
        timestampLabel: '2h',
        commentLikes: 42,
      },
      {
        id: 'c_bp_2',
        sender: {
          displayName: 'Lumina Botanicals',
          handle: '@lumina.skincare',
          avatarColor: '#EC4899',
          verifiedBadge: 'blue',
        },
        text: '@glow_with_sam Thank you Sam! Can’t wait for you to try the fresh batch ✨',
        timestampLabel: '1h',
        commentLikes: 18,
        replyToId: 'c_bp_1',
      },
      {
        id: 'c_bp_3',
        sender: {
          displayName: 'Dr. Claire Derm',
          handle: '@derm_dr_claire',
          avatarColor: '#10B981',
          verifiedBadge: 'blue',
        },
        text: 'Formulation is gentle and non-comedogenic! Big fan 👏',
        timestampLabel: '2h',
        commentLikes: 89,
        isPinned: true,
      },
    ],
  },
  {
    id: 'influencer_post',
    name: 'Influencer Lifestyle',
    tagline: 'Aesthetic creator portrait, tagged brands & high engagement',
    badge: 'Creator / Lifestyle',
    author: {
      displayName: 'Maya Lin',
      handle: '@mayalin.creates',
      verifiedBadge: 'blue',
      avatarColor: '#7C3AED',
    },
    postMeta: {
      locationLabel: 'Amalfi Coast, Italy',
      aspectRatio: '4:5',
      caption:
        'Golden hour in Positano hits differently when the espresso is this good ☕️🍋 Can’t believe this trip is almost over! Wearing @solis.apparel linen set (gifted). Save this spot for your next European summer itinerary 📌 #AmalfiCoast #PositanoVibes #TravelCreator #SummerInItaly #OutfitInspo',
      likeCount: 48920,
      likedByUsername: 'daniel.agency',
      commentCount: 618,
      shareCount: 2430,
      isLikedBySelf: true,
      isBookmarkedBySelf: false,
      isSponsored: false,
      musicTrack: 'Run Your Mouth',
      musicArtist: 'The Marías',
      taggedAccounts: ['@solis.apparel', '@amalfi.hotels'],
      postTimestampLabel: '4 HOURS AGO',
      carouselImages: [
        {
          id: 'slide_inf_1',
          imageGradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 40%, #F59E0B 80%, #B45309 100%)',
          alt: 'Positano Cliffside Sunset',
        },
        {
          id: 'slide_inf_2',
          imageGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #D97706 100%)',
          alt: 'Morning Espresso Detail',
        },
        {
          id: 'slide_inf_3',
          imageGradient: 'linear-gradient(135deg, #FDF4FF 0%, #F5D0FE 50%, #C084FC 100%)',
          alt: 'Sunset Terrace Panorama',
        },
      ],
      activeCarouselIndex: 0,
    },
    comments: [
      {
        id: 'c_inf_1',
        sender: {
          displayName: 'Daniel Ortiz',
          handle: '@daniel.agency',
          avatarColor: '#2563EB',
          verifiedBadge: 'none',
        },
        text: 'These colors are unreal Maya! What lens are you shooting on? 🔥',
        timestampLabel: '4h',
        commentLikes: 134,
      },
      {
        id: 'c_inf_2',
        sender: {
          displayName: 'Charlotte Vibe',
          handle: '@charlotte_vibe',
          avatarColor: '#F43F5E',
          verifiedBadge: 'none',
        },
        text: 'The linen set is stunning on you!! Adding this to my moodboard 😍',
        timestampLabel: '3h',
        commentLikes: 68,
      },
    ],
  },
  {
    id: 'travel_post',
    name: 'Travel Photography',
    tagline: 'Scenic destination shot, sunrise location & travel recommendations',
    badge: 'Travel / Culture',
    author: {
      displayName: 'Julian Cole',
      handle: '@wanderlust_nomad',
      verifiedBadge: 'blue',
      avatarColor: '#059669',
    },
    postMeta: {
      locationLabel: 'Kyoto, Japan',
      aspectRatio: '1:1',
      caption:
        'Lost in the bamboo groves of Arashiyama at 6:00 AM before the crowds arrived 🎋 There’s a quiet stillness here in Kyoto that slows down time. Swipe for temple rain details and tea house moments 🍵🇯🇵 Which photo is your favorite: 1, 2, or 3? #VisitJapan #KyotoDiaries #Arashiyama #TravelPhotography #JapanTravel',
      likeCount: 32740,
      likedByUsername: 'tokyo_wander',
      commentCount: 492,
      shareCount: 1850,
      isLikedBySelf: true,
      isBookmarkedBySelf: true,
      isSponsored: false,
      musicTrack: "One Summer's Day",
      musicArtist: 'Joe Hisaishi',
      taggedAccounts: ['@japan.travel', '@kyototourism'],
      postTimestampLabel: '6 HOURS AGO',
      carouselImages: [
        {
          id: 'slide_tr_1',
          imageGradient: 'linear-gradient(135deg, #ECFDF5 0%, #A7F3D0 40%, #059669 80%, #064E3B 100%)',
          alt: 'Arashiyama Bamboo Grove at Dawn',
        },
        {
          id: 'slide_tr_2',
          imageGradient: 'linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 50%, #475569 100%)',
          alt: 'Rain over Temple Shingles',
        },
        {
          id: 'slide_tr_3',
          imageGradient: 'linear-gradient(135deg, #FEFCE8 0%, #FEF08A 50%, #84CC16 100%)',
          alt: 'Matcha Tea Ceremony',
        },
      ],
      activeCarouselIndex: 0,
    },
    comments: [
      {
        id: 'c_tr_1',
        sender: {
          displayName: 'Tokyo Wanderer',
          handle: '@tokyo_wander',
          avatarColor: '#3B82F6',
          verifiedBadge: 'none',
        },
        text: 'Morning light at Arashiyama is magical! Slide 2 is breathtaking ⛩️',
        timestampLabel: '5h',
        commentLikes: 92,
        isPinned: true,
      },
      {
        id: 'c_tr_2',
        sender: {
          displayName: 'Elena Roams',
          handle: '@elena.roams',
          avatarColor: '#EC4899',
          verifiedBadge: 'none',
        },
        text: 'Did you need a permit or reservation to get there so early?',
        timestampLabel: '4h',
        commentLikes: 14,
      },
      {
        id: 'c_tr_3',
        sender: {
          displayName: 'Julian Cole',
          handle: '@wanderlust_nomad',
          avatarColor: '#059669',
          verifiedBadge: 'blue',
        },
        text: '@elena.roams No permit needed! Just wake up early to beat the tour buses 🙌',
        timestampLabel: '3h',
        commentLikes: 31,
        replyToId: 'c_tr_2',
      },
    ],
  },
  {
    id: 'product_launch',
    name: 'Tech Product Launch',
    tagline: 'Hardware debut, acoustic breakdown, specs & pre-order CTA',
    badge: 'Tech / Innovation',
    author: {
      displayName: 'Apex Acoustic Labs',
      handle: '@apex.audio',
      verifiedBadge: 'blue',
      avatarColor: '#0F172A',
    },
    postMeta: {
      locationLabel: 'Silicon Valley, California',
      aspectRatio: '4:5',
      caption:
        'Say hello to Pulse Pro Wireless. 40 hours of studio-grade acoustic clarity, adaptive noise cancellation, and ultra-low latency spatial sound. Designed from recycled aluminum with zero compromises. Pre-orders open now at apex.audio/pulse with early bird pricing through Friday 🎧⚡️ #ApexPulse #Audiophile #HeadphoneDrop #SpatialAudio #TechLaunch',
      likeCount: 21890,
      likedByUsername: 'techreview_central',
      commentCount: 524,
      shareCount: 3110,
      isLikedBySelf: true,
      isBookmarkedBySelf: true,
      isSponsored: false,
      musicTrack: 'Sound Lab Session',
      musicArtist: 'Apex Audio',
      taggedAccounts: ['@mkbhd', '@theverge'],
      postTimestampLabel: '1 DAY AGO',
      carouselImages: [
        {
          id: 'slide_pl_1',
          imageGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
          alt: 'Pulse Pro Wireless Headphones Matte Black',
        },
        {
          id: 'slide_pl_2',
          imageGradient: 'linear-gradient(135deg, #18181B 0%, #27272A 50%, #6366F1 100%)',
          alt: '40mm Beryllium Driver Cutaway',
        },
        {
          id: 'slide_pl_3',
          imageGradient: 'linear-gradient(135deg, #0B132B 0%, #1C2541 50%, #3A86FF 100%)',
          alt: 'Acoustic Curve & Battery Specs',
        },
      ],
      activeCarouselIndex: 0,
    },
    comments: [
      {
        id: 'c_pl_1',
        sender: {
          displayName: 'Tech Review Central',
          handle: '@techreview_central',
          avatarColor: '#3B82F6',
          verifiedBadge: 'blue',
        },
        text: 'Review unit arrived today, mic test coming tomorrow!',
        timestampLabel: '18h',
        commentLikes: 210,
        isPinned: true,
      },
      {
        id: 'c_pl_2',
        sender: {
          displayName: 'Jay Audiophile',
          handle: '@audiophile_jay',
          avatarColor: '#F59E0B',
          verifiedBadge: 'none',
        },
        text: 'Does it support LDAC and aptX Lossless?',
        timestampLabel: '16h',
        commentLikes: 145,
      },
    ],
  },
  {
    id: 'educational_post',
    name: 'Educational UI Guide',
    tagline: '5 layout mistakes teardown, carousel slides & bookmark hook',
    badge: 'Design / Education',
    author: {
      displayName: 'UX Vault • Design Tips',
      handle: '@ux_designer_vault',
      verifiedBadge: 'blue',
      avatarColor: '#4338CA',
    },
    postMeta: {
      locationLabel: 'Design Systems Community',
      aspectRatio: '1:1',
      caption:
        '5 visual hierarchy mistakes you’re probably making in your landing page designs (and how to fix them today) 📐 swipe through for before/after layout teardowns. Save this guide for your next client UI audit! Which one do you see most often? 👇 #UIUX #UXDesign #WebDesign #DesignSystem #FigmaTips #VisualHierarchy',
      likeCount: 41200,
      likedByUsername: 'figma_fanatics',
      commentCount: 388,
      shareCount: 8750,
      isLikedBySelf: true,
      isBookmarkedBySelf: true,
      isSponsored: false,
      taggedAccounts: ['@figma', '@dribbble'],
      postTimestampLabel: '12 HOURS AGO',
      carouselImages: [
        {
          id: 'slide_edu_1',
          imageGradient: 'linear-gradient(135deg, #312E81 0%, #4338CA 50%, #6366F1 100%)',
          alt: 'Slide 1: 5 Visual Hierarchy Mistakes in UI',
        },
        {
          id: 'slide_edu_2',
          imageGradient: 'linear-gradient(135deg, #1E1B4B 0%, #3730A3 50%, #4F46E5 100%)',
          alt: 'Slide 2: Mistake 1 - Low Contrast Headers',
        },
        {
          id: 'slide_edu_3',
          imageGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0EA5E9 100%)',
          alt: 'Slide 3: Mistake 2 - Crowded Whitespace',
        },
        {
          id: 'slide_edu_4',
          imageGradient: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #10B981 100%)',
          alt: 'Slide 4: Mistake 3 - Competing CTAs',
        },
      ],
      activeCarouselIndex: 0,
    },
    comments: [
      {
        id: 'c_edu_1',
        sender: {
          displayName: 'Sarah Designs',
          handle: '@sarah_designs',
          avatarColor: '#EC4899',
          verifiedBadge: 'none',
        },
        text: 'Tip #3 is what 90% of our enterprise clients get wrong! Great breakdown 👏',
        timestampLabel: '8h',
        commentLikes: 167,
        isPinned: true,
      },
      {
        id: 'c_edu_2',
        sender: {
          displayName: 'Junior UI Coder',
          handle: '@junior_ui_coder',
          avatarColor: '#10B981',
          verifiedBadge: 'none',
        },
        text: 'Bookmarked! This is clearer than my entire bootcamp lecture.',
        timestampLabel: '6h',
        commentLikes: 84,
      },
    ],
  },
  {
    id: 'giveaway_post',
    name: 'Giveaway Alert',
    tagline: 'High viral activity, entry rules, friends tagged & warning pinned',
    badge: 'Contest / Viral',
    author: {
      displayName: 'Gadget Giveaways Official',
      handle: '@gadget.giveaways',
      verifiedBadge: 'blue',
      avatarColor: '#7E22CE',
    },
    postMeta: {
      locationLabel: 'Global • Worldwide Entry',
      aspectRatio: '4:5',
      caption:
        '🎉 MEGA CREATOR GIVEAWAY 🎉 We’re teaming up with our partners to give away a brand new Studio Creator Kit (Value $2,500+) to ONE lucky winner! Includes 4K Camera, Studio Mic, Ring Light, and Portable SSD!\n\n👇 HOW TO ENTER:\n1. Follow @gadget.giveaways and @apex.audio\n2. LIKE and SAVE this post\n3. Tag 2 creator friends in the comments (unlimited entries!)\n\nBonus: Share to your story for 5 extra entries!\nWinner announced live this Sunday at 6 PM EST. Good luck! 🍀 #Giveaway #CreatorKit #TechGiveaway #FreeStuff #ContentCreator #GiveawayAlert',
      likeCount: 75400,
      likedByUsername: 'creative_minds',
      commentCount: 3410,
      shareCount: 9800,
      isLikedBySelf: true,
      isBookmarkedBySelf: true,
      isSponsored: false,
      musicTrack: 'Giveaway Anthem',
      musicArtist: 'Upbeat Sound',
      taggedAccounts: ['@apex.audio', '@canonusa'],
      postTimestampLabel: '2 DAYS AGO',
      carouselImages: [
        {
          id: 'slide_ga_1',
          imageGradient: 'linear-gradient(135deg, #581C87 0%, #7E22CE 40%, #EAB308 100%)',
          alt: 'Mega Creator Giveaway 2500 Value Banner',
        },
        {
          id: 'slide_ga_2',
          imageGradient: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #F59E0B 100%)',
          alt: 'Included Gear and Accessories Breakdown',
        },
      ],
      activeCarouselIndex: 0,
    },
    comments: [
      {
        id: 'c_ga_pin',
        sender: {
          displayName: 'Gadget Giveaways Official',
          handle: '@gadget.giveaways',
          avatarColor: '#7E22CE',
          verifiedBadge: 'blue',
        },
        text: '⚠️ Beware of impostor accounts! We will NEVER ask for payment info or DM you from another handle.',
        timestampLabel: '2d',
        commentLikes: 890,
        isPinned: true,
      },
      {
        id: 'c_ga_1',
        sender: {
          displayName: 'Alex Create',
          handle: '@alex.create',
          avatarColor: '#3B82F6',
          verifiedBadge: 'none',
        },
        text: '@jordan_films @maria_shots We need this kit for our short film!! 🎥🤞',
        timestampLabel: '1h',
        commentLikes: 312,
      },
      {
        id: 'c_ga_2',
        sender: {
          displayName: 'Jordan Films',
          handle: '@jordan_films',
          avatarColor: '#F59E0B',
          verifiedBadge: 'none',
        },
        text: '@alex.create Bro if we win this our production value goes 10x 😂🔥',
        timestampLabel: '45m',
        commentLikes: 145,
        replyToId: 'c_ga_1',
      },
    ],
  },
];

export function InstagramPostEditor({
  onOpenScriptImport,
  onRequestClearAll,
}: {
  onOpenScriptImport: () => void;
  onRequestClearAll: () => void;
}) {
  const project = useStudioStore((s) => s.project);
  const conv = getActiveConversation(project);
  const post = conv.postMeta;

  const updatePostMeta = useStudioStore((s) => s.updatePostMeta);
  const addPostCarouselSlide = useStudioStore((s) => s.addPostCarouselSlide);
  const deletePostCarouselSlide = useStudioStore((s) => s.deletePostCarouselSlide);
  const updatePostCarouselSlide = useStudioStore((s) => s.updatePostCarouselSlide);
  const setActivePostCarouselSlide = useStudioStore((s) => s.setActivePostCarouselSlide);
  const reorderPostCarouselSlide = useStudioStore((s) => s.reorderPostCarouselSlide);
  const toggleCommentPin = useStudioStore((s) => s.toggleCommentPin);
  const upsertParticipant = useStudioStore((s) => s.upsertParticipant);
  const addMessage = useStudioStore((s) => s.addMessage);
  const updateMessage = useStudioStore((s) => s.updateMessage);
  const deleteMessage = useStudioStore((s) => s.deleteMessage);
  const moveMessage = useStudioStore((s) => s.moveMessage);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);

  const [activeTab, setActiveTab] = useState<'content' | 'engagement' | 'comments' | 'templates'>('content');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // New comment composer state
  const [commentText, setCommentText] = useState('');
  const [commenterSenderId, setCommenterSenderId] = useState<string>(project.cast[1]?.id || project.cast[0]?.id || '');
  const [commentTimestamp, setCommentTimestamp] = useState('1h');
  const [commentLikes, setCommentLikes] = useState('0');
  const [commentReplyToId, setCommentReplyToId] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState('');

  // Author resolution
  const author =
    conv.participantIds
      .map((id) => project.cast.find((p) => p.id === id))
      .find((p) => p && p.id !== conv.selfParticipantId) ??
    project.cast[0];

  const carousel = post?.carouselImages ?? [];
  const activeSlideIdx = post?.activeCarouselIndex ?? 0;

  // Image upload handler
  const handleImageUpload = async (file: File, slideIdx?: number) => {
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      if (slideIdx !== undefined && carousel[slideIdx]) {
        updatePostCarouselSlide(slideIdx, { imageDataUrl: safeDataUrl });
      } else {
        updatePostMeta({ imageDataUrl: safeDataUrl });
        if (carousel.length > 0) {
          updatePostCarouselSlide(activeSlideIdx, { imageDataUrl: safeDataUrl });
        }
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid image upload.');
    }
  };

  // Author avatar upload
  const handleAvatarUpload = async (file: File) => {
    if (!author) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      upsertParticipant({
        ...author,
        avatarDataUrl: safeDataUrl,
      });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid avatar upload.');
    }
  };

  // Add a new comment
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newId = createCommentId();
    addMessage({
      id: newId,
      senderId: commenterSenderId || author?.id || conv.selfParticipantId,
      type: 'text',
      text: commentText.trim(),
      timestampLabel: commentTimestamp.trim() || '1h',
      replyToMessageId: commentReplyToId ? commentReplyToId : undefined,
      commentLikes: parseInt(commentLikes, 10) || 0,
      reactions:
        parseInt(commentLikes, 10) > 0
          ? [{ emoji: '❤️', participantIds: [author?.id || 'p1'], count: parseInt(commentLikes, 10) }]
          : [],
      readStatus: 'none',
    });
    setCommentText('');
    setCommentReplyToId('');
  };

  // Add tagged account
  const handleAddTaggedAccount = () => {
    if (!newTagInput.trim()) return;
    const formatted = newTagInput.startsWith('@') ? newTagInput.trim() : `@${newTagInput.trim()}`;
    const currentTags = post?.taggedAccounts ?? [];
    if (!currentTags.includes(formatted)) {
      updatePostMeta({ taggedAccounts: [...currentTags, formatted] });
    }
    setNewTagInput('');
  };

  // Remove tagged account
  const handleRemoveTaggedAccount = (tagToRemove: string) => {
    const currentTags = post?.taggedAccounts ?? [];
    updatePostMeta({ taggedAccounts: currentTags.filter((t) => t !== tagToRemove) });
  };

  // Apply template
  const handleApplyTemplate = (tpl: PostTemplateDef) => {
    // 1. Update author participant
    if (author) {
      upsertParticipant({
        ...author,
        displayName: tpl.author.displayName,
        handle: tpl.author.handle,
        verifiedBadge: tpl.author.verifiedBadge,
        avatarFallbackColor: tpl.author.avatarColor,
        avatarDataUrl: undefined,
      });
    }

    // 2. Clear current messages and load template comments
    conv.messages.forEach((m) => deleteMessage(m.id));

    // Register commenters if not existing
    tpl.comments.forEach((c) => {
      let commenter = project.cast.find((p) => p.handle === c.sender.handle);
      if (!commenter) {
        commenter = {
          id: `user_${c.sender.handle.replace(/[^a-zA-Z0-9]/g, '')}`,
          displayName: c.sender.displayName,
          handle: c.sender.handle,
          verifiedBadge: c.sender.verifiedBadge,
          avatarFallbackColor: c.sender.avatarColor,
        };
        upsertParticipant(commenter);
      }
      addMessage({
        id: c.id,
        senderId: commenter.id,
        type: 'text',
        text: c.text,
        timestampLabel: c.timestampLabel,
        replyToMessageId: c.replyToId,
        isPinned: c.isPinned,
        commentLikes: c.commentLikes || 0,
        reactions: c.commentLikes ? [{ emoji: '❤️', participantIds: [commenter.id], count: c.commentLikes }] : [],
        readStatus: 'none',
      });
    });

    // 3. Update postMeta
    updatePostMeta({
      ...tpl.postMeta,
      imageDataUrl: undefined,
    });
  };

  return (
    <div
      data-testid="instagram-post-dedicated-editor"
      className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
    >
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h2
              data-testid="platform-editor-badge"
              className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100"
            >
              Feed & Caption Cutoff Studio
            </h2>
            <p className="text-[10px] text-slate-500">Instagram post mockup & comments editor</p>
          </div>
        </div>

        {/* Global Toolbar (Undo, Redo, Script, Clear) */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo edit"
            className="h-7 w-7 p-0 cursor-pointer"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo edit"
            className="h-7 w-7 p-0 cursor-pointer"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onOpenScriptImport}
            className="h-7 px-2 text-[11px] font-medium cursor-pointer"
          >
            Script
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRequestClearAll}
            className="h-7 px-2 text-[11px] font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
          >
            Clear
          </Button>
        </div>
      </div>

      {uploadError && (
        <div className="mx-4 mt-2 rounded bg-rose-50 p-2 text-xs text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          {uploadError}
        </div>
      )}

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'content' | 'engagement' | 'comments' | 'templates')}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-4 pt-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <TabsList className="grid grid-cols-4 h-8 p-0.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-md text-[11px]">
            <TabsTrigger value="content" className="rounded-sm py-1 font-medium">
              Post & Media
            </TabsTrigger>
            <TabsTrigger value="engagement" className="rounded-sm py-1 font-medium">
              Caption
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-sm py-1 font-medium">
              Comments ({conv.messages.length})
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-sm py-1 font-medium">
              Templates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. Post & Media Content Tab */}
        <TabsContent value="content" className="flex-1 overflow-y-auto p-4 space-y-5 m-0">
          {/* Post Author Customization */}
          <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-purple-600" /> Post Author
              </span>
              <label className="text-[10px] text-purple-600 dark:text-purple-400 font-medium cursor-pointer hover:underline">
                Upload Avatar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAvatarUpload(f);
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Username / Handle</label>
                <Input
                  value={author?.handle ?? ''}
                  onChange={(e) => {
                    if (author) upsertParticipant({ ...author, handle: e.target.value });
                  }}
                  placeholder="@creator.studio"
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500">Display Name</label>
                <Input
                  value={author?.displayName ?? ''}
                  onChange={(e) => {
                    if (author) upsertParticipant({ ...author, displayName: e.target.value });
                  }}
                  placeholder="Maya Lin"
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Verified Badge</label>
                <select
                  value={author?.verifiedBadge ?? 'none'}
                  onChange={(e) => {
                    if (author) {
                      upsertParticipant({
                        ...author,
                        verifiedBadge: e.target.value as VerificationBadgeType,
                      });
                    }
                  }}
                  className="mt-1 w-full h-8 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-xs font-medium"
                >
                  <option value="none">No badge</option>
                  <option value="blue">Blue Verified</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-500">Story Ring Border</label>
                <button
                  type="button"
                  onClick={() => updatePostMeta({ hasStoryRing: !(post?.hasStoryRing ?? true) })}
                  className={cn(
                    'mt-1 w-full h-8 rounded-md border text-xs font-medium transition-colors cursor-pointer',
                    (post?.hasStoryRing ?? true)
                      ? 'border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800'
                      : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                  )}
                >
                  {(post?.hasStoryRing ?? true) ? 'Active Story Ring' : 'No Story Ring'}
                </button>
              </div>
            </div>

            {/* Location Tag */}
            <div className="pt-1">
              <label htmlFor="location-tag-input" className="text-[10px] font-medium text-slate-500">
                Location Tag
              </label>
              <Input
                id="location-tag-input"
                aria-label="Location Tag"
                value={post?.locationLabel ?? ''}
                onChange={(e) => updatePostMeta({ locationLabel: e.target.value })}
                placeholder="e.g. San Francisco, California"
                className="h-8 text-xs font-medium mt-1"
              />
            </div>
          </div>

          {/* Media Format & Aspect Ratio */}
          <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-600" /> Canvas Dimensions & Fit
            </span>

            {/* Aspect Ratio Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => updatePostMeta({ aspectRatio: '4:5' })}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all cursor-pointer',
                  (post?.aspectRatio ?? '4:5') === '4:5'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                <span className="text-xs">4:5</span>
                <span className="text-[10px] opacity-70">Portrait (Feed)</span>
              </button>
              <button
                type="button"
                onClick={() => updatePostMeta({ aspectRatio: '1:1' })}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all cursor-pointer',
                  post?.aspectRatio === '1:1'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                <span className="text-xs">1:1</span>
                <span className="text-[10px] opacity-70">Square</span>
              </button>
              <button
                type="button"
                onClick={() => updatePostMeta({ aspectRatio: '16:9' })}
                className={cn(
                  'flex flex-col items-center justify-center p-2 rounded-md border text-center transition-all cursor-pointer',
                  post?.aspectRatio === '16:9'
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                )}
              >
                <span className="text-xs">16:9</span>
                <span className="text-[10px] opacity-70">Landscape</span>
              </button>
            </div>

            {/* Object Fit & Sponsored */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Image Fit</label>
                <select
                  value={post?.objectFit ?? 'cover'}
                  onChange={(e) => updatePostMeta({ objectFit: e.target.value as 'cover' | 'contain' })}
                  className="mt-1 w-full h-8 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-xs font-medium"
                >
                  <option value="cover">Cover (Fill canvas)</option>
                  <option value="contain">Contain (Full image)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500">Post Type</label>
                <button
                  type="button"
                  onClick={() => updatePostMeta({ isSponsored: !post?.isSponsored })}
                  className={cn(
                    'mt-1 w-full h-8 rounded-md border text-xs font-medium transition-colors cursor-pointer',
                    post?.isSponsored
                      ? 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                  )}
                >
                  {post?.isSponsored ? 'Sponsored Ad' : 'Organic Post'}
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Slide Manager */}
          <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ImagePlus className="h-3.5 w-3.5 text-pink-600" />
                Carousel Slides ({carousel.length})
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const newSlide: PostCarouselSlide = {
                    id: createPostSlideId(),
                    imageGradient: GRADIENT_PRESETS[(carousel.length + 1) % GRADIENT_PRESETS.length].value,
                    alt: `Slide ${carousel.length + 1}`,
                  };
                  addPostCarouselSlide(newSlide);
                }}
                className="h-7 text-xs gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Slide
              </Button>
            </div>

            {/* Slide thumbnails list */}
            {carousel.length > 0 ? (
              <div className="space-y-2">
                {carousel.map((slide, idx) => (
                  <div
                    key={slide.id}
                    onClick={() => setActivePostCarouselSlide(idx)}
                    className={cn(
                      'flex items-center justify-between p-2 rounded-md border text-xs transition-all cursor-pointer',
                      idx === activeSlideIdx
                        ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-7 w-7 rounded border border-slate-300 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                        style={{ background: slide.imageGradient || '#3B82F6' }}
                      >
                        {slide.imageDataUrl ? (
                          <img src={slide.imageDataUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">Slide {idx + 1}</p>
                        <p className="text-[10px] opacity-60 truncate">{slide.alt || 'Visual slide'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <label className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">
                        <Upload className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleImageUpload(f, idx);
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => reorderPostCarouselSlide(idx, 'up')}
                        disabled={idx === 0}
                        aria-label="Move slide up"
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderPostCarouselSlide(idx, 'down')}
                        disabled={idx === carousel.length - 1}
                        aria-label="Move slide down"
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      {carousel.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deletePostCarouselSlide(idx)}
                          aria-label="Delete slide"
                          className="p-1 hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40 rounded cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-md">
                <p className="text-xs text-slate-500">Single image post</p>
                <label className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-purple-600 text-white text-xs font-medium cursor-pointer hover:bg-purple-700 shadow-xs">
                  <Camera className="h-3.5 w-3.5" /> Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f);
                    }}
                  />
                </label>
              </div>
            )}

            {/* Gradient Presets for Active Slide */}
            <div className="pt-2">
              <label className="text-[10px] font-medium text-slate-500 block mb-1.5">
                Background Presets for Active Slide
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      if (carousel.length > 0) {
                        updatePostCarouselSlide(activeSlideIdx, {
                          imageGradient: preset.value,
                          imageDataUrl: undefined,
                        });
                      } else {
                        updatePostMeta({ imageGradient: preset.value, imageDataUrl: undefined });
                      }
                    }}
                    className="h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 px-2 text-[10px] text-white font-medium shadow-2xs hover:opacity-90 transition-opacity cursor-pointer truncate"
                    style={{ background: preset.value }}
                  >
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audio / Music & Tagged Accounts */}
          <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Music2 className="h-3.5 w-3.5 text-cyan-600" /> Audio & Tagged Accounts
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Track Name</label>
                <Input
                  value={post?.musicTrack ?? ''}
                  onChange={(e) => updatePostMeta({ musicTrack: e.target.value })}
                  placeholder="e.g. Cruel Summer"
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500">Artist Name</label>
                <Input
                  value={post?.musicArtist ?? ''}
                  onChange={(e) => updatePostMeta({ musicArtist: e.target.value })}
                  placeholder="e.g. Taylor Swift"
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
            </div>

            {/* Tagged Accounts */}
            <div className="pt-2">
              <label className="text-[10px] font-medium text-slate-500 block mb-1">
                Tagged Accounts on Media
              </label>
              <div className="flex gap-2">
                <Input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTaggedAccount();
                    }
                  }}
                  placeholder="@brand_handle"
                  className="h-8 text-xs font-medium"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddTaggedAccount}
                  className="h-8 text-xs cursor-pointer"
                >
                  Add Tag
                </Button>
              </div>

              {post?.taggedAccounts && post.taggedAccounts.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {post.taggedAccounts.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[11px] font-semibold text-slate-800 dark:text-slate-200"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTaggedAccount(t)}
                        className="hover:text-rose-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* 2. Caption & Engagement Tab */}
        <TabsContent value="engagement" className="flex-1 overflow-y-auto p-4 space-y-5 m-0">
          {/* Caption Editor */}
          <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-blue-600" /> Post Caption
              </span>
              <span className="text-[10px] text-slate-500">
                {(post?.caption ?? '').length} characters
              </span>
            </div>

            <Textarea
              value={post?.caption ?? ''}
              onChange={(e) => updatePostMeta({ caption: e.target.value })}
              placeholder="Write your post caption, hooks, and hashtags..."
              rows={5}
              className="text-xs font-medium leading-relaxed resize-none"
            />

            {/* Truncation Simulation Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Simulate &quot;...more&quot; Cutoff Fold
                </p>
                <p className="text-[10px] text-slate-500">
                  Verify whether your hook sits above the mobile truncation fold (~96 chars)
                </p>
              </div>
              <button
                type="button"
                onClick={() => updatePostMeta({ simulateMoreCutoff: !post?.simulateMoreCutoff })}
                className={cn(
                  'h-6 w-11 rounded-full p-0.5 transition-colors cursor-pointer',
                  (post?.simulateMoreCutoff ?? true) ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                )}
              >
                <div
                  className={cn(
                    'h-5 w-5 rounded-full bg-white shadow-xs transition-transform',
                    (post?.simulateMoreCutoff ?? true) ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>

          {/* Engagement Counters */}
          <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-rose-500" /> Engagement Metrics
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Total Likes</label>
                <Input
                  type="number"
                  value={post?.likeCount ?? 2841}
                  onChange={(e) => updatePostMeta({ likeCount: parseInt(e.target.value, 10) || 0 })}
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500">Liked by User Handle</label>
                <Input
                  value={post?.likedByUsername ?? ''}
                  onChange={(e) => updatePostMeta({ likedByUsername: e.target.value })}
                  placeholder="e.g. daniel.agency"
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Comment Count Display</label>
                <Input
                  type="number"
                  value={post?.commentCount ?? conv.messages.length}
                  onChange={(e) => updatePostMeta({ commentCount: parseInt(e.target.value, 10) || 0 })}
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-slate-500">Shares / Saves Count</label>
                <Input
                  type="number"
                  value={post?.shareCount ?? 312}
                  onChange={(e) => updatePostMeta({ shareCount: parseInt(e.target.value, 10) || 0 })}
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
            </div>

            {/* Interaction States */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => updatePostMeta({ isLikedBySelf: !post?.isLikedBySelf })}
                className={cn(
                  'h-8 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer',
                  post?.isLikedBySelf
                    ? 'border-rose-300 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                <Heart className={cn('h-3.5 w-3.5', post?.isLikedBySelf && 'fill-rose-500 text-rose-500')} />
                {post?.isLikedBySelf ? 'Liked by You' : 'Unliked'}
              </button>

              <button
                type="button"
                onClick={() => updatePostMeta({ isBookmarkedBySelf: !post?.isBookmarkedBySelf })}
                className={cn(
                  'h-8 rounded-md border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer',
                  post?.isBookmarkedBySelf
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                )}
              >
                {post?.isBookmarkedBySelf ? 'Saved in Collection' : 'Unsaved'}
              </button>
            </div>

            {/* Post Timestamp */}
            <div className="pt-2">
              <label className="text-[10px] font-medium text-slate-500">Post Timestamp Label</label>
              <Input
                value={post?.postTimestampLabel ?? '2 HOURS AGO'}
                onChange={(e) => updatePostMeta({ postTimestampLabel: e.target.value })}
                placeholder="e.g. 2 HOURS AGO or NOVEMBER 25"
                className="h-8 text-xs font-medium mt-1"
              />
            </div>
          </div>
        </TabsContent>

        {/* 3. Dedicated Comments Editor Tab */}
        <TabsContent value="comments" className="flex-1 overflow-y-auto p-4 space-y-5 m-0">
          {/* Add New Comment */}
          <div className="space-y-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-emerald-600" /> Add New Comment
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Commenter</label>
                <select
                  value={commenterSenderId}
                  onChange={(e) => setCommenterSenderId(e.target.value)}
                  className="mt-1 w-full h-8 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-xs font-medium"
                >
                  {project.cast.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.handle || p.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-500">Timestamp</label>
                <Input
                  value={commentTimestamp}
                  onChange={(e) => setCommentTimestamp(e.target.value)}
                  placeholder="e.g. 24m or 2h"
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>
            </div>

            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write comment text with @mentions and #hashtags..."
              rows={2}
              className="text-xs font-medium leading-relaxed resize-none"
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-medium text-slate-500">Likes Count</label>
                <Input
                  type="number"
                  value={commentLikes}
                  onChange={(e) => setCommentLikes(e.target.value)}
                  placeholder="0"
                  className="h-8 text-xs font-medium mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-slate-500">Reply To (Optional)</label>
                <select
                  value={commentReplyToId}
                  onChange={(e) => setCommentReplyToId(e.target.value)}
                  className="mt-1 w-full h-8 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 text-xs font-medium truncate"
                >
                  <option value="">Root comment (None)</option>
                  {conv.messages
                    .filter((m) => !m.replyToMessageId)
                    .map((m) => {
                      const sender = project.cast.find((p) => p.id === m.senderId);
                      return (
                        <option key={m.id} value={m.id}>
                          {sender?.handle || sender?.displayName || 'User'}: {m.text?.slice(0, 20)}...
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <Button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="w-full h-8 text-xs font-medium gap-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Post Comment
            </Button>
          </div>

          {/* Comments List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Existing Comments ({conv.messages.length})</span>
            </span>

            {conv.messages.map((m, idx) => {
              const sender = project.cast.find((p) => p.id === m.senderId);
              const isReply = !!m.replyToMessageId;

              return (
                <div
                  key={m.id}
                  className={cn(
                    'p-2.5 rounded-lg border text-xs space-y-2 transition-all',
                    isReply
                      ? 'ml-4 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                      {isReply && <Reply className="h-3 w-3 text-indigo-500 rotate-180 shrink-0" />}
                      <span>{sender?.handle || sender?.displayName || 'user'}</span>
                      {m.isPinned && (
                        <span className="text-[10px] text-amber-500 flex items-center gap-0.5">
                          <Pin className="h-2.5 w-2.5 fill-amber-500" /> Pinned
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleCommentPin(m.id)}
                        aria-label="Toggle pin comment"
                        className={cn(
                          'p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
                          m.isPinned ? 'text-amber-500' : 'text-slate-400'
                        )}
                      >
                        <Pin className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMessage(m.id, 'up')}
                        disabled={idx === 0}
                        aria-label="Move comment up"
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMessage(m.id, 'down')}
                        disabled={idx === conv.messages.length - 1}
                        aria-label="Move comment down"
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMessage(m.id)}
                        aria-label="Delete comment"
                        className="p-1 rounded hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Comment Text Input */}
                  <Input
                    value={m.text ?? ''}
                    onChange={(e) => updateMessage(m.id, { text: e.target.value })}
                    className="h-7 text-xs font-normal"
                  />

                  {/* Timestamp & Likes row */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <span>Time:</span>
                      <input
                        value={m.timestampLabel}
                        onChange={(e) => updateMessage(m.id, { timestampLabel: e.target.value })}
                        className="w-14 h-5 px-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent text-[10px]"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Likes:</span>
                      <input
                        type="number"
                        value={m.commentLikes ?? (m.reactions[0]?.count || 0)}
                        onChange={(e) => {
                          const count = parseInt(e.target.value, 10) || 0;
                          updateMessage(m.id, {
                            commentLikes: count,
                            reactions: count > 0 ? [{ emoji: '❤️', participantIds: [sender?.id || 'p1'], count }] : [],
                          });
                        }}
                        className="w-14 h-5 px-1 rounded border border-slate-200 dark:border-slate-800 bg-transparent text-[10px]"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* 4. One-Click Templates Tab */}
        <TabsContent value="templates" className="flex-1 overflow-y-auto p-4 space-y-3 m-0">
          <div className="mb-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Instant Post Presets
            </h3>
            <p className="text-[10px] text-slate-500">
              One-click complete templates with authors, captions, carousels, and comments.
            </p>
          </div>

          <div className="space-y-2.5">
            {POST_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {tpl.badge}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {tpl.name}
                    </h4>
                  </div>
                  <Button
                    size="sm"
                    data-testid={`apply-template-${tpl.id}`}
                    onClick={() => handleApplyTemplate(tpl)}
                    className="h-7 text-xs font-medium cursor-pointer bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Apply Preset
                  </Button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tpl.tagline}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span>Author: {tpl.author.handle}</span>
                  <span>•</span>
                  <span>Ratio: {tpl.postMeta.aspectRatio}</span>
                  <span>•</span>
                  <span>Comments: {tpl.comments.length}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
