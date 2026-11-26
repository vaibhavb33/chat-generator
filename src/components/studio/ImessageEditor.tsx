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
  UserPlus,
  Users,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives';
import { GENERATOR_MAP } from '@/core/registry/generators';
import { validateImageFileUpload } from '@/core/security/validation';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import type {
  Message,
  MessageType,
  Participant,
  ReadReceiptStatus,
} from '@/core/types';
import { cn } from '@/lib/utils';

const TAPBACK_EMOJIS = ['❤️', '👍', '👎', '😆', '‼️', '❓'];

const MESSAGE_EFFECTS: Array<{ id: Message['messageEffect']; label: string }> = [
  { id: 'none', label: 'None' },
  { id: 'invisible_ink', label: 'Invisible Ink' },
  { id: 'gentle', label: 'Gentle effect' },
  { id: 'loud', label: 'Loud effect' },
  { id: 'slam', label: 'Slam' },
  { id: 'echo', label: 'Echo' },
  { id: 'confetti', label: 'Confetti' },
  { id: 'lasers', label: 'Lasers' },
  { id: 'balloons', label: 'Balloons' },
];

export interface ImessageTemplateDef {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  bubbleStyle: 'imessage_blue' | 'sms_green';
  isGroup: boolean;
  groupName?: string;
  contact: {
    displayName: string;
    avatarColor: string;
  };
  messages: Array<{
    id: string;
    senderId: 'self' | 'contact' | 'member2' | 'member3' | 'system';
    type: MessageType;
    text: string;
    timestampLabel: string;
    readReceipt?: ReadReceiptStatus;
    reactions?: Array<{ emoji: string; count: number }>;
    messageEffect?: Message['messageEffect'];
    replyToId?: string;
    locationMeta?: { placeName: string; address: string };
    linkPreviewMeta?: { domain: string; title: string; url: string };
    contactCardMeta?: { fullName: string; phoneOrHandle: string };
  }>;
}

const IMESSAGE_TEMPLATES: ImessageTemplateDef[] = [
  {
    id: 'casual_catchup',
    name: 'Casual Catchup (1-on-1)',
    tagline: 'Blue bubbles, voice memo, photo share, Heart Tapback & Read receipt',
    badge: '1-on-1 • iMessage',
    bubbleStyle: 'imessage_blue',
    isGroup: false,
    contact: {
      displayName: 'Sarah Chen',
      avatarColor: '#007AFF',
    },
    messages: [
      {
        id: 'tpl_cc_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today 9:41 AM',
        timestampLabel: '9:41 AM',
      },
      {
        id: 'tpl_cc_2',
        senderId: 'contact',
        type: 'text',
        text: 'Hey! Are you free for coffee later? I found the coziest new spot downtown ☕️',
        timestampLabel: '9:38 AM',
        reactions: [{ emoji: '❤️', count: 1 }],
      },
      {
        id: 'tpl_cc_3',
        senderId: 'self',
        type: 'text',
        text: 'Yes absolutely! Just finishing up some mockups now. Send me the location!',
        timestampLabel: '9:39 AM',
        readReceipt: 'read',
      },
      {
        id: 'tpl_cc_4',
        senderId: 'contact',
        type: 'voice_note',
        text: 'Voice Memo (0:14)',
        timestampLabel: '9:40 AM',
      },
      {
        id: 'tpl_cc_5',
        senderId: 'self',
        type: 'text',
        text: 'Perfect, see you at 10:15! 🎉',
        timestampLabel: '9:42 AM',
        readReceipt: 'read',
        messageEffect: 'confetti',
      },
    ],
  },
  {
    id: 'group_dinner',
    name: 'Group Dinner Plans',
    tagline: 'Multi-participant group chat with Apple Maps location pin and replies',
    badge: 'Group Chat',
    bubbleStyle: 'imessage_blue',
    isGroup: true,
    groupName: 'Dinner Crew 🍕',
    contact: {
      displayName: 'Dinner Crew',
      avatarColor: '#FF9500',
    },
    messages: [
      {
        id: 'tpl_gd_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Yesterday 7:15 PM',
        timestampLabel: '7:15 PM',
      },
      {
        id: 'tpl_gd_2',
        senderId: 'member2',
        type: 'text',
        text: 'Where are we going for Friday dinner? Pizza or Thai food?',
        timestampLabel: '7:16 PM',
      },
      {
        id: 'tpl_gd_3',
        senderId: 'member3',
        type: 'text',
        text: 'Pizza for sure!! Lucia Pizzeria has tables open at 7:30.',
        timestampLabel: '7:18 PM',
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 'tpl_gd_4',
        senderId: 'member3',
        type: 'location',
        text: 'Lucia Pizzeria & Osteria',
        timestampLabel: '7:19 PM',
        locationMeta: {
          placeName: 'Lucia Pizzeria & Osteria',
          address: '428 Columbus Ave, San Francisco, CA',
        },
      },
      {
        id: 'tpl_gd_5',
        senderId: 'self',
        type: 'text',
        text: 'Booked table for 4! See everyone there 🍕',
        timestampLabel: '7:22 PM',
        readReceipt: 'read',
        reactions: [{ emoji: '‼️', count: 1 }],
      },
    ],
  },
  {
    id: 'green_sms_delivery',
    name: 'SMS Package Delivery',
    tagline: 'Green SMS bubbles, shipment tracking preview, and verification notification',
    badge: 'Green SMS',
    bubbleStyle: 'sms_green',
    isGroup: false,
    contact: {
      displayName: 'Express Courier',
      avatarColor: '#34C759',
    },
    messages: [
      {
        id: 'tpl_sd_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today 8:30 AM',
        timestampLabel: '8:30 AM',
      },
      {
        id: 'tpl_sd_2',
        senderId: 'contact',
        type: 'text',
        text: 'Your package #EXP-8892 is out for delivery today with courier David.',
        timestampLabel: '8:30 AM',
      },
      {
        id: 'tpl_sd_3',
        senderId: 'contact',
        type: 'link_preview',
        text: 'Live Delivery Map & Pin',
        timestampLabel: '8:31 AM',
        linkPreviewMeta: {
          domain: 'courier-track.com',
          title: 'Track Delivery Live • Arriving in 25 mins',
          url: 'https://courier-track.com/exp-8892',
        },
      },
      {
        id: 'tpl_sd_4',
        senderId: 'self',
        type: 'text',
        text: 'Please leave the parcel by the front door behind the planter. Thanks!',
        timestampLabel: '8:35 AM',
        readReceipt: 'delivered',
      },
    ],
  },
  {
    id: 'birthday_celebration',
    name: 'Birthday Celebration & Effects',
    tagline: 'Sent with Confetti effect, Heart and Exclamation Tapbacks',
    badge: 'Effects • Animation',
    bubbleStyle: 'imessage_blue',
    isGroup: false,
    contact: {
      displayName: 'Emma Watson',
      avatarColor: '#AF52DE',
    },
    messages: [
      {
        id: 'tpl_bc_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today 12:00 AM',
        timestampLabel: '12:00 AM',
      },
      {
        id: 'tpl_bc_2',
        senderId: 'contact',
        type: 'text',
        text: 'HAPPY BIRTHDAY TO MY FAVORITE HUMAN! 🎂🎉 Hope this year brings you so much joy!',
        timestampLabel: '12:00 AM',
        reactions: [{ emoji: '❤️', count: 1 }],
      },
      {
        id: 'tpl_bc_3',
        senderId: 'self',
        type: 'text',
        text: 'THANK YOU SO MUCH EMMA!! ❤️ That means the world to me!',
        timestampLabel: '12:05 AM',
        readReceipt: 'read',
        messageEffect: 'confetti',
        reactions: [{ emoji: '‼️', count: 1 }],
      },
    ],
  },
  {
    id: 'creative_collab',
    name: 'Creative Studio Collab',
    tagline: 'Video preview, vCard contact card sharing, and voice note review',
    badge: 'Work & Media',
    bubbleStyle: 'imessage_blue',
    isGroup: false,
    contact: {
      displayName: 'Marcus (Art Director)',
      avatarColor: '#5856D6',
    },
    messages: [
      {
        id: 'tpl_collab_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today 2:15 PM',
        timestampLabel: '2:15 PM',
      },
      {
        id: 'tpl_collab_2',
        senderId: 'contact',
        type: 'text',
        text: 'Here is the first cut of the product teaser video. Let me know your thoughts on the color grade:',
        timestampLabel: '2:16 PM',
      },
      {
        id: 'tpl_collab_3',
        senderId: 'contact',
        type: 'video_preview',
        text: 'Studio Teaser Render v2.mp4',
        timestampLabel: '2:17 PM',
      },
      {
        id: 'tpl_collab_4',
        senderId: 'self',
        type: 'text',
        text: 'The contrast on the product shots looks unbelievable 🔥 Sending you our 3D animator’s contact:',
        timestampLabel: '2:20 PM',
        readReceipt: 'read',
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 'tpl_collab_5',
        senderId: 'self',
        type: 'contact_card',
        text: 'Maya Lin',
        timestampLabel: '2:21 PM',
        contactCardMeta: {
          fullName: 'Maya Lin',
          phoneOrHandle: '+1 (415) 882-9014',
        },
        readReceipt: 'read',
      },
    ],
  },
  {
    id: 'urgent_update',
    name: 'Urgent Flight & Travel',
    tagline: 'Sent with Slam, Apple Maps location share, and Double Exclamation Tapbacks',
    badge: 'Urgent & Travel',
    bubbleStyle: 'imessage_blue',
    isGroup: false,
    contact: {
      displayName: 'David Miller',
      avatarColor: '#007AFF',
    },
    messages: [
      {
        id: 'tpl_uu_1',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today 4:45 PM',
        timestampLabel: '4:45 PM',
      },
      {
        id: 'tpl_uu_2',
        senderId: 'contact',
        type: 'text',
        text: 'Gate changed to B22! Boarding starts in 10 minutes!! ✈️',
        timestampLabel: '4:46 PM',
        messageEffect: 'slam',
        reactions: [{ emoji: '‼️', count: 1 }],
      },
      {
        id: 'tpl_uu_3',
        senderId: 'self',
        type: 'text',
        text: 'Running through security right now, just cleared TSA PreCheck!',
        timestampLabel: '4:48 PM',
        readReceipt: 'read',
      },
      {
        id: 'tpl_uu_4',
        senderId: 'contact',
        type: 'location',
        text: 'Terminal 2, Gate B22',
        timestampLabel: '4:50 PM',
        locationMeta: {
          placeName: 'SFO Terminal 2 Gate B22',
          address: 'San Francisco International Airport',
        },
      },
    ],
  },
];

export function ImessageEditor({
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
  const deleteParticipant = useStudioStore((s) => s.deleteParticipant);
  const updateHeaderState = useStudioStore((s) => s.updateHeaderState);
  const updateGroupMeta = useStudioStore((s) => s.updateGroupMeta);
  const updateTheme = useStudioStore((s) => s.updateTheme);
  const updateStatusBar = useStudioStore((s) => s.updateStatusBar);
  const setTypingPreview = useStudioStore((s) => s.setTypingPreview);

  const conv = getActiveConversation(project);
  const manifest = GENERATOR_MAP[project.platformId];

  const [activeTab, setActiveTab] = useState<'messages' | 'participants' | 'style' | 'templates'>('messages');

  // Composer Form States
  const [composerText, setComposerText] = useState('');
  const [composerSenderId, setComposerSenderId] = useState(conv.selfParticipantId);
  const [composerType, setComposerType] = useState<MessageType>('text');
  const [composerTime, setComposerTime] = useState('9:42 AM');
  const [composerReceipt, setComposerReceipt] = useState<ReadReceiptStatus>('read');
  const [composerEffect, setComposerEffect] = useState<Message['messageEffect']>('none');
  const [composerReplyToId, setComposerReplyToId] = useState('');
  const [composerReaction, setComposerReaction] = useState<string>('');

  // Attachment specific metadata
  const [locationName, setLocationName] = useState('Apple Park');
  const [locationAddress, setLocationAddress] = useState('1 Apple Park Way, Cupertino, CA');
  const [contactName, setContactName] = useState('Alex Rivera');
  const [contactPhone, setContactPhone] = useState('+1 (415) 555-0194');
  const [linkTitle, setLinkTitle] = useState('Apple Special Event');
  const [linkDomain, setLinkDomain] = useState('apple.com');

  const [newMemberName, setNewMemberName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isGroupMode = Boolean(conv.groupMeta?.groupName);
  const isDark = project.theme.colorScheme === 'dark';
  const isSmsGreen = project.theme.bubbleStyle === 'sms_green';

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
      date_separator: 'Today 9:41 AM',
      voice_note: 'Voice message',
      video_preview: 'Video Clip Preview',
      location: locationName.trim() || 'Shared Location',
      contact_card: contactName.trim() || 'Contact Card',
      link_preview: linkTitle.trim() || 'Link Preview',
      sticker: '🎉',
      system: 'Location sharing started',
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
      timestampLabel: composerTime.trim() || '9:42 AM',
      readStatus: composerReceipt,
      replyToMessageId: composerReplyToId || undefined,
      messageEffect: composerEffect !== 'none' ? composerEffect : undefined,
      reactions: reactionsList,
      locationPlace: composerType === 'location' ? locationName : undefined,
      locationAddress: composerType === 'location' ? locationAddress : undefined,
      contactName: composerType === 'contact_card' ? contactName : undefined,
      contactPhone: composerType === 'contact_card' ? contactPhone : undefined,
      linkTitle: composerType === 'link_preview' ? linkTitle : undefined,
      linkDomain: composerType === 'link_preview' ? linkDomain : undefined,
      linkUrl: composerType === 'link_preview' ? `https://${linkDomain.trim() || 'apple.com'}` : undefined,
    });

    setComposerText('');
    setComposerReplyToId('');
    setComposerEffect('none');
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
        timestampLabel: composerTime.trim() || '9:42 AM',
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

  // Add Participant Handler
  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const colors = ['#007AFF', '#34C759', '#AF52DE', '#FF9500', '#5856D6', '#FF2D55'];
    upsertParticipant({
      id: `part_${Date.now()}`,
      displayName: newMemberName.trim(),
      avatarFallbackColor: colors[project.cast.length % colors.length],
      nameColorHex: colors[project.cast.length % colors.length],
      verifiedBadge: 'none',
    });
    setNewMemberName('');
  };

  // Toggle Group mode
  const handleToggleGroupMode = (enableGroup: boolean) => {
    if (enableGroup) {
      updateGroupMeta({
        groupName: 'Dinner Crew 🍕',
      });
      // Ensure at least 3 participants exist for realism
      if (project.cast.length < 3) {
        upsertParticipant({
          id: 'part_alex',
          displayName: 'Alex M.',
          avatarFallbackColor: '#FF9500',
          verifiedBadge: 'none',
        });
      }
    } else {
      updateGroupMeta({
        groupName: '',
      });
    }
  };

  // Apply Pre-made Template
  const handleApplyTemplate = (tpl: ImessageTemplateDef) => {
    // 1. Update bubble style and group mode
    updateTheme({
      bubbleStyle: tpl.bubbleStyle,
    });

    if (tpl.isGroup) {
      updateGroupMeta({
        groupName: tpl.groupName || 'Group Chat',
      });
    } else {
      updateGroupMeta({
        groupName: '',
      });
      if (otherParticipant) {
        upsertParticipant({
          ...otherParticipant,
          displayName: tpl.contact.displayName,
          avatarFallbackColor: tpl.contact.avatarColor,
          avatarDataUrl: undefined,
        });
      }
    }

    // 2. Clear current messages
    conv.messages.forEach((m) => deleteMessage(m.id));

    // 3. Setup participants map
    const selfId = conv.selfParticipantId;
    let member2 = project.cast.find((p) => p.id !== selfId);
    let member3 = project.cast.filter((p) => p.id !== selfId)[1];

    if (!member2) {
      member2 = {
        id: 'member_2',
        displayName: 'Marcus B.',
        avatarFallbackColor: '#007AFF',
        verifiedBadge: 'none',
      };
      upsertParticipant(member2);
    }
    if (!member3 && tpl.isGroup) {
      member3 = {
        id: 'member_3',
        displayName: 'Chloe T.',
        avatarFallbackColor: '#AF52DE',
        verifiedBadge: 'none',
      };
      upsertParticipant(member3);
    }

    // 4. Add template messages
    tpl.messages.forEach((msg) => {
      let resolvedSenderId = selfId;
      if (msg.senderId === 'contact') {
        resolvedSenderId = member2?.id || selfId;
      } else if (msg.senderId === 'member2') {
        resolvedSenderId = member2?.id || selfId;
      } else if (msg.senderId === 'member3') {
        resolvedSenderId = member3?.id || member2?.id || selfId;
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
        messageEffect: msg.messageEffect,
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
        contactName: msg.contactCardMeta?.fullName,
      });
    });

    setActiveTab('messages');
  };

  return (
    <div
      data-testid="imessage-dedicated-editor"
      className="flex h-full flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800"
    >
      {/* Editor Top Bar with Badge & Undo/Redo */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="flex items-center gap-2">
          <span
            data-testid="platform-editor-badge"
            className="text-xs font-bold uppercase tracking-wider text-[#007AFF] flex items-center gap-1.5"
          >
            <Smartphone className="h-4 w-4" />
            {manifest?.editorBadge ?? 'iPhone Messages Studio'}
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
          setActiveTab(v as 'messages' | 'participants' | 'style' | 'templates')
        }
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-3 pt-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <TabsList className="grid grid-cols-4 h-8 p-0.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-md text-[11px]">
            <TabsTrigger value="messages" className="rounded-sm py-1 font-medium">
              Messages
            </TabsTrigger>
            <TabsTrigger value="participants" className="rounded-sm py-1 font-medium">
              Contact & Group
            </TabsTrigger>
            <TabsTrigger value="style" className="rounded-sm py-1 font-medium">
              Status & Style
            </TabsTrigger>
            <TabsTrigger value="templates" className="rounded-sm py-1 font-medium">
              Templates
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── TAB 1: MESSAGES ── */}
        <TabsContent value="messages" className="flex-1 overflow-y-auto p-3.5 space-y-4 m-0">
          {/* Quick Message Composer Form */}
          <form
            onSubmit={handleAddMessage}
            className="space-y-3 rounded-xl border border-blue-200/80 bg-blue-50/40 p-3 dark:border-blue-900/60 dark:bg-blue-950/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5 text-[#007AFF]" /> Add iMessage
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {isSmsGreen ? 'Green SMS Bubble' : 'Blue iMessage Bubble'}
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
                  <option value="voice_note">Voice Memo (Waveform)</option>
                  <option value="location">Apple Maps Location</option>
                  <option value="contact_card">vCard Contact Card</option>
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
                    ? 'Today 9:41 AM'
                    : composerType === 'location'
                      ? 'Place title (e.g. Apple Park)'
                      : 'Type dialogue or caption (Enter for line breaks)...'
                }
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                className="mt-1 min-h-[64px] bg-white text-xs dark:bg-slate-950"
              />
            </label>

            {/* Specific fields for Attachment types */}
            {composerType === 'location' && (
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Location Place Name
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Apple Park"
                  />
                </label>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Address
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="1 Apple Park Way"
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
                    placeholder="Alex Rivera"
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
                    placeholder="Apple Special Event"
                  />
                </label>
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Website Domain
                  <Input
                    className="mt-1 h-7 text-xs bg-white dark:bg-slate-950"
                    value={linkDomain}
                    onChange={(e) => setLinkDomain(e.target.value)}
                    placeholder="apple.com"
                  />
                </label>
              </div>
            )}

            {/* Tapback reaction picker */}
            <div>
              <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                Attach iOS Tapback Reaction
              </span>
              <div className="flex items-center gap-1.5">
                {TAPBACK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() =>
                      setComposerReaction((prev) => (prev === emoji ? '' : emoji))
                    }
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center text-xs transition-all border cursor-pointer',
                      composerReaction === emoji
                        ? 'border-[#007AFF] bg-[#007AFF] text-white scale-110 shadow-xs'
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

            {/* Message Effect & Status Row */}
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Message Effect (Bubble / Screen)
                <select
                  aria-label="Message effect"
                  value={composerEffect}
                  onChange={(e) =>
                    setComposerEffect(e.target.value as Message['messageEffect'])
                  }
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                >
                  {MESSAGE_EFFECTS.map((eff) => (
                    <option key={eff.id} value={eff.id}>
                      {eff.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Read Status / Receipt
                <select
                  aria-label="Read receipt status"
                  value={composerReceipt}
                  onChange={(e) =>
                    setComposerReceipt(e.target.value as ReadReceiptStatus)
                  }
                  className="mt-1 h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="read">Read (shows &ldquo;Read 9:42 AM&rdquo;)</option>
                  <option value="delivered">Delivered (shows &ldquo;Delivered&rdquo;)</option>
                  <option value="sent">Sent (no receipt label)</option>
                  <option value="none">None</option>
                </select>
              </label>
            </div>

            {/* Timestamp & Reply Target Row */}
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Timestamp Label
                <Input
                  aria-label="Message timestamp"
                  value={composerTime}
                  onChange={(e) => setComposerTime(e.target.value)}
                  placeholder="9:42 AM"
                  className="mt-1 h-8 bg-white text-xs dark:bg-slate-950"
                />
              </label>

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
                        {m.text?.slice(0, 24)}...
                      </option>
                    ))}
                </select>
              </label>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                className="flex-1 bg-[#007AFF] hover:bg-[#0062cc] text-white"
                data-testid="add-message-btn"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add to iMessage Thread
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
              className="h-4 w-4 rounded accent-[#007AFF] cursor-pointer"
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
                      ? 'border-[#007AFF] bg-blue-50/30 dark:bg-blue-950/20'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  )}
                >
                  {/* Message Item Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className={cn(
                          'inline-block h-2 w-2 rounded-full',
                          isSelf ? 'bg-[#007AFF]' : 'bg-slate-400'
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
                          title="Switch sender (Left/Right)"
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

                  {/* Inline Message Edit */}
                  <Textarea
                    rows={1}
                    aria-label="Edit message content"
                    value={m.text ?? ''}
                    onChange={(e) => updateMessage(m.id, { text: e.target.value })}
                    className="min-h-[38px] text-xs bg-slate-50 dark:bg-slate-950"
                  />

                  {/* Tapbacks & Receipts controls for message */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    {/* Quick Tapback Reactions on existing message */}
                    <div className="flex items-center gap-1">
                      {TAPBACK_EMOJIS.map((emoji) => {
                        const hasReacted = m.reactions?.some((r) => r.emoji === emoji);
                        return (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleMessageReaction(m.id, emoji)}
                            className={cn(
                              'h-5 w-5 rounded-full flex items-center justify-center text-[10px] cursor-pointer transition-all',
                              hasReacted
                                ? 'bg-[#007AFF] text-white scale-110'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300'
                            )}
                          >
                            {emoji}
                          </button>
                        );
                      })}
                    </div>

                    {/* Receipt Status & Timestamp */}
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
                          <option value="read">Read</option>
                          <option value="delivered">Delivered</option>
                          <option value="sent">Sent</option>
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

        {/* ── TAB 2: CONTACT & GROUP ── */}
        <TabsContent value="participants" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Mode Selector: 1-on-1 vs Group Chat */}
          <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Conversation Type
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleToggleGroupMode(false)}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  !isGroupMode
                    ? 'border-[#007AFF] bg-[#007AFF] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <User className="h-3.5 w-3.5" /> 1-on-1 iMessage
              </button>

              <button
                type="button"
                data-testid="imessage-group-mode-toggle"
                onClick={() => handleToggleGroupMode(true)}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  isGroupMode
                    ? 'border-[#007AFF] bg-[#007AFF] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <Users className="h-3.5 w-3.5" /> Group iMessage
              </button>
            </div>
          </div>

          {/* 1-on-1 Contact Settings */}
          {!isGroupMode && otherParticipant && (
            <div className="space-y-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#007AFF]" /> Contact Customization
              </span>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Contact Name
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  value={otherParticipant.displayName}
                  onChange={(e) =>
                    upsertParticipant({ ...otherParticipant, displayName: e.target.value })
                  }
                />
              </label>

              {/* Avatar Upload */}
              <div>
                <span className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Contact Profile Photo
                </span>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xs overflow-hidden"
                    style={{
                      backgroundColor: otherParticipant.avatarFallbackColor || '#007AFF',
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

              {/* Back Button Label */}
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Back Button Label
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  value={conv.headerState?.backButtonLabel || 'Messages'}
                  onChange={(e) =>
                    updateHeaderState({ backButtonLabel: e.target.value })
                  }
                  placeholder="Messages (or e.g. 12)"
                />
              </label>

              {/* Service Subtitle */}
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Service Subtitle (Under Contact Name)
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  value={
                    conv.headerState?.serviceSubtitle ??
                    (isSmsGreen ? 'Text Message • SMS' : 'iMessage')
                  }
                  onChange={(e) =>
                    updateHeaderState({ serviceSubtitle: e.target.value })
                  }
                  placeholder="iMessage or Text Message • SMS"
                />
              </label>
            </div>
          )}

          {/* Group Settings */}
          {isGroupMode && (
            <div className="space-y-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#007AFF]" /> Group Details
              </span>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Group Name
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  value={conv.groupMeta?.groupName || 'Dinner Crew 🍕'}
                  onChange={(e) => updateGroupMeta({ groupName: e.target.value })}
                />
              </label>

              {/* Add New Participant */}
              <form onSubmit={handleAddParticipant} className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 block">
                  Add Member to Group
                </span>
                <div className="flex gap-2">
                  <Input
                    className="h-8 text-xs bg-white dark:bg-slate-950"
                    placeholder="Participant name..."
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="h-8 bg-[#007AFF] text-white">
                    <UserPlus className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
              </form>

              {/* Participants List */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Group Members ({project.cast.length})
                </span>
                {project.cast.map((p) => {
                  const isYou = p.id === conv.selfParticipantId;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: p.avatarFallbackColor || '#007AFF' }}
                        >
                          {p.displayName[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">
                            {p.displayName} {isYou && '(You)'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isYou && (
                          <button
                            type="button"
                            onClick={() => deleteParticipant(p.id)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FaceTime Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-[#007AFF]" /> Show FaceTime Video Icon in Header
            </span>
            <input
              type="checkbox"
              checked={conv.headerState?.showFaceTimeAction !== false}
              onChange={(e) =>
                updateHeaderState({ showFaceTimeAction: e.target.checked })
              }
              className="h-4 w-4 rounded accent-[#007AFF] cursor-pointer"
            />
          </div>
        </TabsContent>

        {/* ── TAB 3: STATUS BAR & IPHONE STYLE ── */}
        <TabsContent value="style" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Bubble Color Style: Blue vs Green */}
          <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Bubble Color Style
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="style-bubble-blue"
                onClick={() => updateTheme({ bubbleStyle: 'imessage_blue' })}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold border transition-all cursor-pointer',
                  !isSmsGreen
                    ? 'border-[#007AFF] bg-[#007AFF] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                iMessage (Blue)
              </button>
              <button
                type="button"
                data-testid="style-bubble-green"
                onClick={() => updateTheme({ bubbleStyle: 'sms_green' })}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold border transition-all cursor-pointer',
                  isSmsGreen
                    ? 'border-[#34C759] bg-[#34C759] text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                SMS (Green)
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
                    ? 'border-[#007AFF] bg-[#007AFF] text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <Sun className="h-3.5 w-3.5" /> iOS Light Mode
              </button>
              <button
                type="button"
                onClick={() => updateTheme({ colorScheme: 'dark' })}
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  isDark
                    ? 'border-[#007AFF] bg-[#007AFF] text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                <Moon className="h-3.5 w-3.5" /> OLED Dark Mode
              </button>
            </div>
          </div>

          {/* iPhone Notch Style: Dynamic Island vs Classic Notch */}
          <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              iPhone Hardware Notch
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-testid="notch-dynamic-island"
                onClick={() =>
                  updateStatusBar({ notchStyle: 'dynamic_island' })
                }
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  project.theme.statusBar.notchStyle === 'dynamic_island'
                    ? 'border-[#007AFF] bg-[#007AFF] text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                Dynamic Island
              </button>
              <button
                type="button"
                data-testid="notch-classic"
                onClick={() =>
                  updateStatusBar({ notchStyle: 'none' })
                }
                className={cn(
                  'flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold border transition-all cursor-pointer',
                  project.theme.statusBar.notchStyle !== 'dynamic_island'
                    ? 'border-[#007AFF] bg-[#007AFF] text-white'
                    : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                )}
              >
                Clean Header
              </button>
            </div>
          </div>

          {/* Status Bar Elements */}
          <div className="space-y-3 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              Status Bar Indicators
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
                  className="mt-3 w-full accent-[#007AFF] cursor-pointer"
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
                  <option value="4">4 Bars (Full)</option>
                  <option value="3">3 Bars</option>
                  <option value="2">2 Bars</option>
                  <option value="1">1 Bar</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Carrier Name
                <Input
                  className="mt-1 bg-white dark:bg-slate-950"
                  placeholder="e.g. Verizon"
                  value={project.theme.statusBar.carrierLabel ?? ''}
                  onChange={(e) => updateStatusBar({ carrierLabel: e.target.value })}
                />
              </label>
            </div>
          </div>

          {/* Font Sizing */}
          <div className="space-y-2 rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              iMessage Text Scale
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
                      ? 'border-[#007AFF] bg-[#007AFF] text-white'
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
              <Sparkles className="h-3.5 w-3.5 text-[#007AFF]" /> One-Click iMessage Presets
            </h3>
            <p className="text-[10px] text-slate-500">
              Instant realistic iPhone mockups with Tapbacks, voice memos, effects, and receipts.
            </p>
          </div>

          <div className="space-y-2.5">
            {IMESSAGE_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-2 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF]">
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
                    className="h-7 text-xs font-medium cursor-pointer bg-[#007AFF] hover:bg-[#0062cc] text-white"
                  >
                    Apply Preset
                  </Button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tpl.tagline}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span>Contact: {tpl.contact.displayName}</span>
                  <span>•</span>
                  <span>Style: {tpl.bubbleStyle === 'imessage_blue' ? 'Blue' : 'Green SMS'}</span>
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
