'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Camera,
  Copy,
  ImagePlus,
  Moon,
  Plus,
  Redo2,
  Send,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  Undo2,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives';
import { GENERATOR_MAP } from '@/core/registry/generators';
import { validateImageFileUpload } from '@/core/security/validation';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import type {
  MessageType,
  Participant,
  ReadReceiptStatus,
} from '@/core/types';
import { cn } from '@/lib/utils';

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '🎉'];

export interface AndroidTemplateDef {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  profile: 'google_messages' | 'samsung_oneui' | 'classic_sms';
  isRcsMode: boolean;
  contact: {
    displayName: string;
    avatarColor: string;
  };
  messages: Array<{
    id: string;
    senderId: 'self' | 'contact' | 'system';
    type: MessageType;
    text: string;
    timestampLabel: string;
    readReceipt?: ReadReceiptStatus;
    reactions?: Array<{ emoji: string; count: number }>;
    replyToId?: string;
    locationMeta?: { placeName: string; address: string };
    linkPreviewMeta?: { domain: string; title: string; url: string };
    contactCardMeta?: { fullName: string; phoneOrHandle: string };
  }>;
}

const ANDROID_TEMPLATES: AndroidTemplateDef[] = [
  {
    id: 'google_pixel_rcs',
    name: 'Google Pixel RCS Chat',
    tagline: 'Material You dynamic styling, end-to-end encryption banner, voice note & read checkmarks',
    badge: 'Pixel • RCS',
    profile: 'google_messages',
    isRcsMode: true,
    contact: {
      displayName: 'Maya Lin',
      avatarColor: '#0B57D0',
    },
    messages: [
      {
        id: 'tpl_am_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today • 10:00 AM',
        timestampLabel: '10:00 AM',
      },
      {
        id: 'tpl_am_2',
        senderId: 'contact',
        type: 'text',
        text: 'Hey! Are you using the new Google Messages RCS features?',
        timestampLabel: '10:00 AM',
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 'tpl_am_3',
        senderId: 'self',
        type: 'text',
        text: 'Yes! The Material You dynamic theme and high-res photo sharing work so smoothly 🚀',
        timestampLabel: '10:02 AM',
        readReceipt: 'read',
      },
      {
        id: 'tpl_am_4',
        senderId: 'contact',
        type: 'voice_note',
        text: 'Audio message (0:12)',
        timestampLabel: '10:03 AM',
      },
      {
        id: 'tpl_am_5',
        senderId: 'self',
        type: 'text',
        text: 'Just sent the project proposal over to the team!',
        timestampLabel: '10:05 AM',
        readReceipt: 'read',
        reactions: [{ emoji: '❤️', count: 1 }],
      },
    ],
  },
  {
    id: 'samsung_oneui',
    name: 'Samsung One UI Messages',
    tagline: 'Samsung One UI 6 visual profile, rounded bubbles, and Google Maps pin share',
    badge: 'Galaxy • One UI',
    profile: 'samsung_oneui',
    isRcsMode: true,
    contact: {
      displayName: 'Daniel Kim',
      avatarColor: '#2A87FF',
    },
    messages: [
      {
        id: 'tpl_so_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today • 12:30 PM',
        timestampLabel: '12:30 PM',
      },
      {
        id: 'tpl_so_2',
        senderId: 'contact',
        type: 'text',
        text: 'Hey! Are we meeting at the coffee roastery or the studio first?',
        timestampLabel: '12:31 PM',
      },
      {
        id: 'tpl_so_3',
        senderId: 'self',
        type: 'text',
        text: 'Let’s meet at the roastery! Here is the exact location pin:',
        timestampLabel: '12:33 PM',
        readReceipt: 'read',
      },
      {
        id: 'tpl_so_4',
        senderId: 'self',
        type: 'location',
        text: 'Sightglass Coffee Roastery',
        timestampLabel: '12:34 PM',
        locationMeta: {
          placeName: 'Sightglass Coffee Roastery',
          address: '270 7th St, San Francisco, CA',
        },
        readReceipt: 'read',
        reactions: [{ emoji: '☕️', count: 1 }],
      },
    ],
  },
  {
    id: 'classic_sms_delivery',
    name: 'Classic SMS Package Notice',
    tagline: 'SMS/MMS mode, SIM 1 badge indicator, carrier notice, and delivery link preview',
    badge: 'Classic SMS',
    profile: 'classic_sms',
    isRcsMode: false,
    contact: {
      displayName: 'Apex Logistics',
      avatarColor: '#00838F',
    },
    messages: [
      {
        id: 'tpl_cs_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today • 8:15 AM',
        timestampLabel: '8:15 AM',
      },
      {
        id: 'tpl_cs_2',
        senderId: 'contact',
        type: 'text',
        text: 'Apex Courier: Your parcel #APX-4491 is scheduled for delivery today between 1 PM and 3 PM.',
        timestampLabel: '8:15 AM',
      },
      {
        id: 'tpl_cs_3',
        senderId: 'contact',
        type: 'link_preview',
        text: 'Live Shipment Tracking Portal',
        timestampLabel: '8:16 AM',
        linkPreviewMeta: {
          domain: 'apex-courier.com',
          title: 'Track Delivery Live • Out for Delivery',
          url: 'https://apex-courier.com/track/4491',
        },
      },
      {
        id: 'tpl_cs_4',
        senderId: 'self',
        type: 'text',
        text: 'Received! Gate code is #4402 if needed.',
        timestampLabel: '8:20 AM',
        readReceipt: 'delivered',
      },
    ],
  },
  {
    id: 'work_team_collab',
    name: 'Work & Creative Collab',
    tagline: 'Video clip preview, contact card sharing, and double checkmarks',
    badge: 'Media & Work',
    profile: 'google_messages',
    isRcsMode: true,
    contact: {
      displayName: 'Elena Rostova',
      avatarColor: '#7C3AED',
    },
    messages: [
      {
        id: 'tpl_wc_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today • 3:45 PM',
        timestampLabel: '3:45 PM',
      },
      {
        id: 'tpl_wc_2',
        senderId: 'contact',
        type: 'text',
        text: 'Rendered the final product animation clip. Check out the 60fps preview:',
        timestampLabel: '3:46 PM',
      },
      {
        id: 'tpl_wc_3',
        senderId: 'contact',
        type: 'video_preview',
        text: 'Product Demo Clip v4.mp4',
        timestampLabel: '3:47 PM',
      },
      {
        id: 'tpl_wc_4',
        senderId: 'self',
        type: 'text',
        text: 'Looks phenomenal! Sharing our lead sound engineer’s vCard below:',
        timestampLabel: '3:50 PM',
        readReceipt: 'read',
        reactions: [{ emoji: '🔥', count: 1 }],
      },
      {
        id: 'tpl_wc_5',
        senderId: 'self',
        type: 'contact_card',
        text: 'Liam Vance',
        timestampLabel: '3:51 PM',
        contactCardMeta: {
          fullName: 'Liam Vance (Audio Lead)',
          phoneOrHandle: '+1 (415) 555-8821',
        },
        readReceipt: 'read',
      },
    ],
  },
  {
    id: 'weekend_hangout',
    name: 'Weekend Hangout Plans',
    tagline: 'Reply quote previews, voice note feedback, and thumbs up reactions',
    badge: 'Casual • Chat',
    profile: 'google_messages',
    isRcsMode: true,
    contact: {
      displayName: 'Jordan Miller',
      avatarColor: '#059669',
    },
    messages: [
      {
        id: 'tpl_wh_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Yesterday • 6:20 PM',
        timestampLabel: '6:20 PM',
      },
      {
        id: 'tpl_wh_2',
        senderId: 'contact',
        type: 'text',
        text: 'Are we still on for the weekend hike at Muir Woods?',
        timestampLabel: '6:21 PM',
      },
      {
        id: 'tpl_wh_3',
        senderId: 'self',
        type: 'text',
        text: '100%! Weather forecast says clear skies and 68 degrees ☀️',
        timestampLabel: '6:23 PM',
        readReceipt: 'read',
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 'tpl_wh_4',
        senderId: 'contact',
        type: 'voice_note',
        text: 'Voice note (0:12)',
        timestampLabel: '6:24 PM',
      },
    ],
  },
  {
    id: 'urgent_flight_update',
    name: 'Flight & Travel Alert',
    tagline: 'Airport terminal location sharing, gate change notice, and delivered receipts',
    badge: 'Travel Alert',
    profile: 'google_messages',
    isRcsMode: true,
    contact: {
      displayName: 'Airline Travel Desk',
      avatarColor: '#0B57D0',
    },
    messages: [
      {
        id: 'tpl_fa_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today • 5:10 PM',
        timestampLabel: '5:10 PM',
      },
      {
        id: 'tpl_fa_2',
        senderId: 'contact',
        type: 'text',
        text: 'FLIGHT UPDATE: Flight #UA-882 to Chicago O’Hare now boarding at Gate F14.',
        timestampLabel: '5:10 PM',
      },
      {
        id: 'tpl_fa_3',
        senderId: 'contact',
        type: 'location',
        text: 'SFO Terminal 3 Gate F14',
        timestampLabel: '5:11 PM',
        locationMeta: {
          placeName: 'SFO Terminal 3 Gate F14',
          address: 'San Francisco International Airport',
        },
      },
      {
        id: 'tpl_fa_4',
        senderId: 'self',
        type: 'text',
        text: 'Confirmed, at the gate now!',
        timestampLabel: '5:15 PM',
        readReceipt: 'delivered',
      },
    ],
  },
];

export function AndroidMessagesEditor({
  onOpenScriptImport,
  onRequestClearAll,
}: {
  onOpenScriptImport: () => void;
  onRequestClearAll: () => void;
}) {
  const project = useStudioStore((s) => s.project);
  const ui = useStudioStore((s) => s.ui);
  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);

  const addMessage = useStudioStore((s) => s.addMessage);
  const updateMessage = useStudioStore((s) => s.updateMessage);
  const duplicateMessage = useStudioStore((s) => s.duplicateMessage);
  const switchMessageSender = useStudioStore((s) => s.switchMessageSender);
  const deleteMessage = useStudioStore((s) => s.deleteMessage);
  const moveMessage = useStudioStore((s) => s.moveMessage);
  const toggleMessageReaction = useStudioStore((s) => s.toggleMessageReaction);
  const upsertParticipant = useStudioStore((s) => s.upsertParticipant);
  const updateHeaderState = useStudioStore((s) => s.updateHeaderState);
  const updateTheme = useStudioStore((s) => s.updateTheme);
  const updateStatusBar = useStudioStore((s) => s.updateStatusBar);
  const setTypingPreview = useStudioStore((s) => s.setTypingPreview);

  const conv = getActiveConversation(project);
  const manifest = GENERATOR_MAP[project.platformId];

  const [activeTab, setActiveTab] = useState<'messages' | 'profile' | 'device' | 'templates'>('messages');

  // Composer Form States
  const [composerText, setComposerText] = useState('');
  const [composerSenderId, setComposerSenderId] = useState(conv.selfParticipantId);
  const [composerType, setComposerType] = useState<MessageType>('text');
  const [composerTime, setComposerTime] = useState('10:00 AM');
  const [composerReceipt, setComposerReceipt] = useState<ReadReceiptStatus>('read');
  const [composerReplyToId, setComposerReplyToId] = useState('');
  const [composerReaction, setComposerReaction] = useState<string>('');

  // Attachment fields
  const [locationName, setLocationName] = useState('Googleplex');
  const [locationAddress, setLocationAddress] = useState('1600 Amphitheatre Pkwy, Mountain View, CA');
  const [contactName, setContactName] = useState('Maya Lin');
  const [contactPhone, setContactPhone] = useState('+1 (415) 555-0194');
  const [linkTitle, setLinkTitle] = useState('Google Pixel 9 Pro');
  const [linkDomain, setLinkDomain] = useState('store.google.com');

  const [uploadError, setUploadError] = useState<string | null>(null);

  const isDark = project.theme.colorScheme === 'dark';
  const profile = conv.headerState?.androidProfile || 'google_messages';
  const isRcsMode = conv.headerState?.isRcsMode !== false && profile !== 'classic_sms';
  const simSlotLabel = conv.headerState?.simSlotLabel || 'SIM 1';

  const otherParticipant =
    project.cast.find((p) => p.id !== conv.selfParticipantId) || project.cast[0];

  const effectiveSenderId = project.cast.some((p) => p.id === composerSenderId)
    ? composerSenderId
    : conv.selfParticipantId;

  // Add Message Handler
  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && composerType === 'text') return;

    const defaultTextByType: Partial<Record<MessageType, string>> = {
      date_separator: 'Today • 10:00 AM',
      voice_note: 'Voice message',
      video_preview: 'Video Clip Preview',
      location: locationName.trim() || 'Shared Location',
      contact_card: contactName.trim() || 'Contact Card',
      link_preview: linkTitle.trim() || 'Link Preview',
      sticker: '🎉',
      system: 'End-to-end encryption verified',
    };

    const textToAdd =
      composerText.trim() ||
      defaultTextByType[composerType] ||
      `${composerType.replace('_', ' ')} message`;

    const reactionsList = composerReaction
      ? [{ emoji: composerReaction, count: 1, participantIds: [effectiveSenderId] }]
      : undefined;

    addMessage({
      senderId: effectiveSenderId,
      type: composerType,
      text: textToAdd,
      timestampLabel: composerTime.trim() || '10:00 AM',
      readStatus: composerReceipt,
      replyToMessageId: composerReplyToId || undefined,
      reactions: reactionsList,
      locationPlace: composerType === 'location' ? locationName : undefined,
      locationAddress: composerType === 'location' ? locationAddress : undefined,
      contactName: composerType === 'contact_card' ? contactName : undefined,
      contactPhone: composerType === 'contact_card' ? contactPhone : undefined,
      linkTitle: composerType === 'link_preview' ? linkTitle : undefined,
      linkDomain: composerType === 'link_preview' ? linkDomain : undefined,
      linkUrl: composerType === 'link_preview' ? `https://${linkDomain.trim() || 'google.com'}` : undefined,
    });

    setComposerText('');
    setComposerReplyToId('');
    setComposerReaction('');
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      addMessage({
        senderId: effectiveSenderId,
        type: 'image',
        text: composerText.trim(),
        timestampLabel: composerTime.trim() || '10:00 AM',
        imageDataUrl: safeDataUrl,
        readStatus: composerReceipt,
      });
      setComposerText('');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid image upload.');
    }
  };

  // Participant Avatar Upload
  const handleParticipantAvatarUpload = async (
    participant: Participant,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      upsertParticipant({ ...participant, avatarDataUrl: safeDataUrl });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid avatar upload.');
    }
  };

  // Apply Pre-made Template
  const handleApplyTemplate = (tpl: AndroidTemplateDef) => {
    // 1. Update header state with profile and RCS mode
    updateHeaderState({
      androidProfile: tpl.profile,
      isRcsMode: tpl.isRcsMode,
    });

    if (otherParticipant) {
      upsertParticipant({
        ...otherParticipant,
        displayName: tpl.contact.displayName,
        avatarFallbackColor: tpl.contact.avatarColor,
        avatarDataUrl: undefined,
      });
    }

    // 2. Clear current messages
    conv.messages.forEach((m) => deleteMessage(m.id));

    // 3. Setup participants map
    const selfId = conv.selfParticipantId;
    let member2 = project.cast.find((p) => p.id !== selfId);
    if (!member2) {
      member2 = {
        id: 'member_2',
        displayName: tpl.contact.displayName,
        avatarFallbackColor: tpl.contact.avatarColor,
        verifiedBadge: 'none',
      };
      upsertParticipant(member2);
    }

    // 4. Add template messages
    tpl.messages.forEach((msg) => {
      let resolvedSenderId = selfId;
      if (msg.senderId === 'contact') {
        resolvedSenderId = member2?.id || selfId;
      } else if (msg.senderId === 'system') {
        resolvedSenderId = 'system';
      }

      addMessage({
        id: msg.id,
        senderId: resolvedSenderId,
        type: msg.type,
        text: msg.text,
        timestampLabel: msg.timestampLabel,
        readStatus: msg.readReceipt || 'none',
        reactions: msg.reactions
          ? msg.reactions.map((r) => ({
              emoji: r.emoji,
              count: r.count,
              participantIds: [resolvedSenderId],
            }))
          : undefined,
        locationPlace: msg.locationMeta?.placeName,
        locationAddress: msg.locationMeta?.address,
        linkTitle: msg.linkPreviewMeta?.title,
        linkDomain: msg.linkPreviewMeta?.domain,
        linkUrl: msg.linkPreviewMeta?.url,
        contactName: msg.contactCardMeta?.fullName,
        contactPhone: msg.contactCardMeta?.phoneOrHandle,
      });
    });

    setActiveTab('messages');
  };

  return (
    <div
      data-testid="android-messages-dedicated-editor"
      className="flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
    >
      {/* Editor Top Bar with Badge & Undo/Redo */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center gap-2">
          <span
            data-testid="platform-editor-badge"
            className="text-xs font-bold uppercase tracking-wider text-[#0B57D0] dark:text-[#A8C7FA] flex items-center gap-1.5"
          >
            <Smartphone className="h-4 w-4" />
            {manifest?.editorBadge ?? 'Material You RCS Studio'}
          </span>
        </div>

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
        <div
          role="alert"
          data-testid="upload-validation-error"
          className="mx-4 mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {uploadError}
        </div>
      )}

      {/* Editor Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as 'messages' | 'profile' | 'device' | 'templates')
        }
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-3 pt-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <TabsList className="grid grid-cols-4 h-8 p-0.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-md text-[11px]">
            <TabsTrigger value="messages" className="rounded-sm py-1 font-medium">
              Messages
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-sm py-1 font-medium">
              Profile & RCS
            </TabsTrigger>
            <TabsTrigger value="device" className="rounded-sm py-1 font-medium">
              Device & Status
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-sm py-1 font-medium">
              Presets
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── TAB 1: MESSAGES ── */}
        <TabsContent value="messages" className="flex-1 overflow-y-auto p-3.5 space-y-4 m-0">
          {/* Quick Message Composer Form */}
          <form
            onSubmit={handleAddMessage}
            className="space-y-3 rounded-xl border border-sky-200/80 bg-sky-50/40 p-3 dark:border-sky-900/60 dark:bg-sky-950/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5 text-[#0B57D0]" /> Add Android Message
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {isRcsMode ? 'RCS Encrypted Chat' : 'Classic SMS/MMS'}
              </span>
            </div>

            {/* Sender and Type Row */}
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Sender
                <select
                  aria-label="Message sender"
                  value={effectiveSenderId}
                  onChange={(e) => setComposerSenderId(e.target.value)}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                >
                  {project.cast.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.displayName} {p.id === conv.selfParticipantId ? '(You - Right)' : '(Left)'}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Message Type
                <select
                  aria-label="Message type"
                  value={composerType}
                  onChange={(e) => setComposerType(e.target.value as MessageType)}
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="text">Text Dialogue</option>
                  <option value="image">Photo Attachment</option>
                  <option value="video_preview">Video Clip Preview</option>
                  <option value="voice_note">Voice Message (Waveform)</option>
                  <option value="location">Google Maps Location</option>
                  <option value="contact_card">Contact Card (vCard)</option>
                  <option value="link_preview">Rich Link Preview</option>
                  <option value="date_separator">Date Separator</option>
                  <option value="system">System Notification</option>
                </select>
              </label>
            </div>

            {/* Message Text / Dialogue */}
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Message Content / Dialogue
              <Textarea
                aria-label="Message text"
                placeholder={
                  composerType === 'date_separator'
                    ? 'Today • 10:00 AM'
                    : composerType === 'location'
                      ? 'Place title (e.g. Googleplex)'
                      : 'Type dialogue or caption (Enter for line breaks)...'
                }
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                className="mt-1 min-h-[64px] bg-white text-xs dark:bg-slate-950"
              />
            </label>

            {/* Attachment Fields */}
            {composerType === 'location' && (
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Location Place Name
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Googleplex"
                  />
                </label>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Address
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="1600 Amphitheatre Pkwy"
                  />
                </label>
              </div>
            )}

            {composerType === 'contact_card' && (
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Contact Full Name
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Maya Lin"
                  />
                </label>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Phone / Subtitle
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (415) 555-0194"
                  />
                </label>
              </div>
            )}

            {composerType === 'link_preview' && (
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Page Title
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Google Pixel 9 Pro"
                  />
                </label>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Website Domain
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={linkDomain}
                    onChange={(e) => setLinkDomain(e.target.value)}
                    placeholder="store.google.com"
                  />
                </label>
              </div>
            )}

            {/* Emoji Reactions Picker */}
            <div>
              <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Attach Emoji Reaction
              </span>
              <div className="flex items-center gap-1.5">
                {EMOJI_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() =>
                      setComposerReaction((prev) => (prev === emoji ? '' : emoji))
                    }
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center text-xs transition-all border cursor-pointer',
                      composerReaction === emoji
                        ? 'border-[#0B57D0] bg-[#0B57D0] text-white scale-110 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
                    )}
                  >
                    {emoji}
                  </button>
                ))}
                {composerReaction && (
                  <button
                    type="button"
                    onClick={() => setComposerReaction('')}
                    className="text-[10px] text-slate-400 hover:text-rose-500 ml-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Read Status and Timestamp */}
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Delivery / Read Status
                <select
                  aria-label="Read receipt status"
                  value={composerReceipt}
                  onChange={(e) =>
                    setComposerReceipt(e.target.value as ReadReceiptStatus)
                  }
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="read">Read (Double Checkmarks ✓✓)</option>
                  <option value="delivered">Delivered (Double Checkmarks ✓✓)</option>
                  <option value="sent">Sent (Single Checkmark ✓)</option>
                  <option value="none">None</option>
                </select>
              </label>

              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Timestamp Label
                <Input
                  aria-label="Message timestamp"
                  value={composerTime}
                  onChange={(e) => setComposerTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="mt-1 h-8 bg-white text-xs dark:bg-slate-950"
                />
              </label>
            </div>

            {/* Reply Target */}
            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Reply to Message
              <select
                aria-label="Reply to message"
                value={composerReplyToId}
                onChange={(e) => setComposerReplyToId(e.target.value)}
                className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="">No reply quote</option>
                {conv.messages
                  .filter((m) => m.senderId !== 'system' && m.text)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.text?.slice(0, 26)}...
                    </option>
                  ))}
              </select>
            </label>

            {/* Buttons Row */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                className="flex-1 bg-[#0B57D0] hover:bg-[#0842a0] text-white"
                data-testid="add-message-btn"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add to Android Chat
              </Button>

              <label
                title="Attach image"
                className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <ImagePlus className="h-3.5 w-3.5 mr-1" />
                Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </form>

          {/* Typing Indicator Preview Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Show Typing Indicator (... in bubble)
            </span>
            <input
              type="checkbox"
              data-testid="toggle-typing-preview"
              checked={ui.isTypingPreview}
              onChange={(e) => setTypingPreview(e.target.checked)}
              className="h-4 w-4 rounded accent-[#0B57D0] cursor-pointer"
            />
          </div>

          {/* Message Timeline List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Timeline ({conv.messages.length} messages)
              </span>
              {conv.messages.length > 0 && (
                <button
                  type="button"
                  onClick={onRequestClearAll}
                  className="text-[11px] font-medium text-rose-600 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {conv.messages.map((m, idx) => {
              const sender = project.cast.find((p) => p.id === m.senderId);
              const isSelf = m.senderId === conv.selfParticipantId;

              return (
                <div
                  key={m.id}
                  className={cn(
                    'rounded-xl border p-2.5 text-xs transition-colors space-y-2',
                    ui.selectedMessageId === m.id
                      ? 'border-[#0B57D0] bg-blue-50/30 dark:bg-blue-950/20'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className={cn(
                          'inline-block h-2 w-2 rounded-full',
                          isSelf ? 'bg-[#0B57D0]' : 'bg-slate-400'
                        )}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {m.senderId === 'system'
                          ? 'System Event'
                          : isSelf
                            ? 'You (Outgoing)'
                            : sender?.displayName || 'Contact'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • {m.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      {m.senderId !== 'system' && (
                        <button
                          type="button"
                          onClick={() => switchMessageSender(m.id)}
                          title="Switch sender"
                          aria-label="Switch sender"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <ArrowLeftRight className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => duplicateMessage(m.id)}
                        title="Duplicate message"
                        aria-label="Duplicate message"
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMessage(m.id, 'up')}
                        disabled={idx === 0}
                        aria-label="Move message up"
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMessage(m.id, 'down')}
                        disabled={idx === conv.messages.length - 1}
                        aria-label="Move message down"
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMessage(m.id)}
                        aria-label="Delete message"
                        className="rounded p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <Textarea
                    rows={1}
                    aria-label="Edit message content"
                    value={m.text ?? ''}
                    onChange={(e) => updateMessage(m.id, { text: e.target.value })}
                    className="min-h-[38px] text-xs bg-slate-50 dark:bg-slate-950"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-1">
                      {EMOJI_REACTIONS.map((emoji) => {
                        const hasReacted = m.reactions?.some((r) => r.emoji === emoji);
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleMessageReaction(m.id, emoji)}
                            className={cn(
                              'h-5 w-5 rounded-full flex items-center justify-center text-[10px] cursor-pointer transition-all',
                              hasReacted
                                ? 'bg-[#0B57D0] text-white scale-110'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                            )}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isSelf && (
                        <select
                          aria-label="Receipt status for message"
                          value={m.readReceipt.status}
                          onChange={(e) =>
                            updateMessage(m.id, {
                              readReceipt: {
                                ...m.readReceipt,
                                status: e.target.value as ReadReceiptStatus,
                              },
                            })
                          }
                          className="h-6 rounded border border-slate-200 bg-slate-50 px-1 text-[10px] dark:border-slate-700 dark:bg-slate-950"
                        >
                          <option value="read">Read (✓✓)</option>
                          <option value="delivered">Delivered (✓✓)</option>
                          <option value="sent">Sent (✓)</option>
                          <option value="none">None</option>
                        </select>
                      )}

                      <Input
                        type="text"
                        aria-label="Edit message timestamp"
                        value={m.timestampLabel}
                        onChange={(e) =>
                          updateMessage(m.id, { timestampLabel: e.target.value })
                        }
                        className="h-6 w-16 px-1 text-[10px] text-right bg-slate-50 dark:bg-slate-950"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* ── TAB 2: PROFILE & RCS ── */}
        <TabsContent value="profile" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Visual Profile Selector */}
          <div className="space-y-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Android Visual Profile
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                data-testid="profile-google-messages"
                onClick={() =>
                  updateHeaderState({ androidProfile: 'google_messages', isRcsMode: true })
                }
                className={cn(
                  'flex items-center justify-between rounded-lg p-2.5 text-xs font-semibold border transition-all text-left cursor-pointer',
                  profile === 'google_messages'
                    ? 'border-[#0B57D0] bg-[#0B57D0] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <div>
                  <p className="font-bold">Google Messages (Material You / Pixel)</p>
                  <p className="text-[10px] opacity-80 mt-0.5">
                    Modern Pixel dynamic blue, end-to-end encryption banner, and pill composer.
                  </p>
                </div>
              </button>

              <button
                type="button"
                data-testid="profile-samsung-oneui"
                onClick={() =>
                  updateHeaderState({ androidProfile: 'samsung_oneui', isRcsMode: true })
                }
                className={cn(
                  'flex items-center justify-between rounded-lg p-2.5 text-xs font-semibold border transition-all text-left cursor-pointer',
                  profile === 'samsung_oneui'
                    ? 'border-[#2A87FF] bg-[#2A87FF] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <div>
                  <p className="font-bold">Samsung One UI Messages</p>
                  <p className="text-[10px] opacity-80 mt-0.5">
                    Galaxy S24 bubble styling, rounded card contours, and One UI action bar.
                  </p>
                </div>
              </button>

              <button
                type="button"
                data-testid="profile-classic-sms"
                onClick={() =>
                  updateHeaderState({ androidProfile: 'classic_sms', isRcsMode: false })
                }
                className={cn(
                  'flex items-center justify-between rounded-lg p-2.5 text-xs font-semibold border transition-all text-left cursor-pointer',
                  profile === 'classic_sms'
                    ? 'border-[#00838F] bg-[#00838F] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <div>
                  <p className="font-bold">Classic Android SMS / MMS</p>
                  <p className="text-[10px] opacity-80 mt-0.5">
                    Carrier text messaging with SIM badge, teal SMS bubble, and standard formatting.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* RCS vs SMS Mode Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                RCS Encrypted Chat Mode
              </span>
              <span className="text-[10px] text-slate-500">
                {isRcsMode ? 'Encrypted with delivery receipts' : 'Standard SMS carrier messaging'}
              </span>
            </div>
            <input
              type="checkbox"
              data-testid="toggle-rcs-mode"
              checked={isRcsMode}
              onChange={(e) => updateHeaderState({ isRcsMode: e.target.checked })}
              className="h-4 w-4 rounded accent-[#0B57D0] cursor-pointer"
            />
          </div>

          {/* SIM Card Slot */}
          <div className="space-y-2 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Active SIM Card Slot
            </span>
            <div className="grid grid-cols-2 gap-2">
              {['SIM 1', 'SIM 2'].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => updateHeaderState({ simSlotLabel: slot })}
                  className={cn(
                    'py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer',
                    simSlotLabel === slot
                      ? 'border-[#0B57D0] bg-[#0B57D0] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          {otherParticipant && (
            <div className="space-y-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#0B57D0]" /> Contact Details
              </span>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Display Name
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  value={otherParticipant.displayName}
                  onChange={(e) =>
                    upsertParticipant({ ...otherParticipant, displayName: e.target.value })
                  }
                />
              </label>

              <div>
                <span className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Profile Photo
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xs overflow-hidden"
                    style={{
                      backgroundColor: otherParticipant.avatarFallbackColor || '#0B57D0',
                    }}
                  >
                    {otherParticipant.avatarDataUrl ? (
                      <img
                        src={otherParticipant.avatarDataUrl}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{otherParticipant.displayName[0] || 'C'}</span>
                    )}
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <Camera className="h-3.5 w-3.5 mr-1" />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleParticipantAvatarUpload(otherParticipant, e)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Subtitle (e.g. RCS chat / Active now)
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  value={conv.headerState?.serviceSubtitle || ''}
                  onChange={(e) =>
                    updateHeaderState({ serviceSubtitle: e.target.value })
                  }
                  placeholder="Leave blank for automatic RCS status"
                />
              </label>
            </div>
          )}
        </TabsContent>

        {/* ── TAB 3: DEVICE & STATUS ── */}
        <TabsContent value="device" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Hardware Model: Pixel Punch Hole vs Notchless */}
          <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Android Camera Punch-Hole
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="notch-punch-hole"
                onClick={() =>
                  updateStatusBar({ notchStyle: 'punch_hole' })
                }
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  project.theme.statusBar.notchStyle === 'punch_hole'
                    ? 'border-[#0B57D0] bg-[#0B57D0] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                Center Punch-Hole (Pixel 9 / S24)
              </button>
              <button
                type="button"
                data-testid="notch-none"
                onClick={() =>
                  updateStatusBar({ notchStyle: 'none' })
                }
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  project.theme.statusBar.notchStyle === 'none'
                    ? 'border-[#0B57D0] bg-[#0B57D0] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                Clean Header (No Camera Cutout)
              </button>
            </div>
          </div>

          {/* Appearance: Light vs Dark */}
          <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Color Appearance
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateTheme({ colorScheme: 'light' })}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  !isDark
                    ? 'border-[#0B57D0] bg-[#0B57D0] text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <Sun className="h-3.5 w-3.5" /> Material Light
              </button>
              <button
                type="button"
                onClick={() => updateTheme({ colorScheme: 'dark' })}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  isDark
                    ? 'border-[#0B57D0] bg-[#0B57D0] text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <Moon className="h-3.5 w-3.5" /> Material Dark
              </button>
            </div>
          </div>

          {/* Status Bar Elements */}
          <div className="space-y-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Android Status Bar Indicators
            </span>

            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Clock Time
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  value={project.theme.statusBar.timeLabel}
                  onChange={(e) => updateStatusBar({ timeLabel: e.target.value })}
                />
              </label>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Battery % ({project.theme.statusBar.batteryPercent}%)
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={project.theme.statusBar.batteryPercent}
                  onChange={(e) =>
                    updateStatusBar({ batteryPercent: parseInt(e.target.value, 10) })
                  }
                  className="mt-3 w-full accent-[#0B57D0] cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Cellular Signal (1-4)
                <select
                  value={project.theme.statusBar.signalBars}
                  onChange={(e) =>
                    updateStatusBar({
                      signalBars: parseInt(e.target.value, 10) as 0 | 1 | 2 | 3 | 4,
                    })
                  }
                  className="mt-1 h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="4">4 Bars (Full 5G)</option>
                  <option value="3">3 Bars</option>
                  <option value="2">2 Bars</option>
                  <option value="1">1 Bar</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Network Type Label
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  placeholder="e.g. 5G or LTE"
                  value={project.theme.statusBar.carrierLabel ?? '5G'}
                  onChange={(e) => updateStatusBar({ carrierLabel: e.target.value })}
                />
              </label>
            </div>
          </div>

          {/* Font Sizing */}
          <div className="space-y-2 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Font Scale
            </span>
            <div className="flex items-center gap-2">
              {[0.9, 1.0, 1.1, 1.2].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() =>
                    updateTheme({
                      typography: { ...project.theme.typography, fontScale: scale },
                    })
                  }
                  className={cn(
                    'flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer',
                    project.theme.typography.fontScale === scale
                      ? 'border-[#0B57D0] bg-[#0B57D0] text-white'
                      : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  )}
                >
                  {scale === 0.9 ? 'Small' : scale === 1.0 ? 'Default' : scale === 1.1 ? 'Large' : 'XL'}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 4: TEMPLATES ── */}
        <TabsContent value="templates" className="flex-1 overflow-y-auto p-4 space-y-3 m-0">
          <div className="mb-2">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#0B57D0]" /> Instant Android Presets
            </h3>
            <p className="text-[10px] text-slate-500">
              One-click Google Messages, Samsung One UI, and Classic SMS mockups.
            </p>
          </div>

          <div className="space-y-2.5">
            {ANDROID_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B57D0] dark:text-[#A8C7FA]">
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
                    className="h-7 text-xs font-medium cursor-pointer bg-[#0B57D0] hover:bg-[#0842a0] text-white"
                  >
                    Apply Preset
                  </Button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tpl.tagline}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span>Profile: {tpl.profile === 'google_messages' ? 'Google Messages' : tpl.profile === 'samsung_oneui' ? 'Samsung One UI' : 'Classic SMS'}</span>
                  <span>•</span>
                  <span>Contact: {tpl.contact.displayName}</span>
                  <span>•</span>
                  <span>Messages: {tpl.messages.length}</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
