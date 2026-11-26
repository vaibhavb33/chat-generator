'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Copy,
  FileText,
  Mic,
  Moon,
  Pin,
  Plus,
  Redo2,
  Send,
  Sparkles,
  Sun,
  Trash2,
  Undo2,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import type {
  Message,
  MessageType,
  Participant,
  Reaction,
  ReadReceiptStatus,
} from '@/core/types';
import { cn } from '@/lib/utils';

const EMOJI_REACTIONS = ['👍', '❤️', '🔥', '🎉', '😂', '👏', '🚀', '💯'];

export interface TelegramTemplateDef {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  mode: 'direct' | 'group';
  header: {
    title: string;
    statusText: string;
    membersLabel?: string;
    pinnedBarTitle?: string;
    pinnedBarText?: string;
    showPinnedBar?: boolean;
  };
  messages: Array<{
    id: string;
    senderId: 'self' | 'contact' | 'participant_3' | 'system';
    type: MessageType;
    text: string;
    timestampLabel: string;
    readReceipt?: ReadReceiptStatus;
    isEdited?: boolean;
    reactions?: Array<{ emoji: string; count: number }>;
    replyToId?: string;
    forwardedLabel?: 'none' | 'forwarded';
    docFileName?: string;
    voiceDurationSeconds?: number;
    locationPlace?: string;
    linkUrl?: string;
    linkDomain?: string;
    linkTitle?: string;
    stickerEmoji?: string;
  }>;
}

const TELEGRAM_TEMPLATES: TelegramTemplateDef[] = [
  {
    id: 'tech_supergroup',
    name: 'Tech Community Supergroup',
    tagline: 'Multi-member group chat, admin tag, pinned release checklist, PDF specs & reactions',
    badge: 'Group • Pinned Bar',
    mode: 'group',
    header: {
      title: 'ChatForge Devs & Creators',
      statusText: '1,420 members, 84 online',
      membersLabel: '1,420 members, 84 online',
      pinnedBarTitle: 'Pinned Announcement',
      pinnedBarText: '🚀 Release candidate build #304 ready for QA testing',
      showPinnedBar: true,
    },
    messages: [
      {
        id: 'tpl_tg_date',
        senderId: 'system',
        type: 'date_separator',
        text: 'November 26',
        timestampLabel: '',
      },
      {
        id: 'tpl_tg_sys_pin',
        senderId: 'system',
        type: 'system',
        text: 'Alex pinned "🚀 Release candidate build #304 ready for QA testing"',
        timestampLabel: '10:00 AM',
      },
      {
        id: 'tpl_tg_1',
        senderId: 'contact',
        type: 'text',
        text: 'Morning team! Just pushed the latest client-side build with zero watermark exports 🚀',
        timestampLabel: '10:01 AM',
        reactions: [
          { emoji: '🔥', count: 4 },
          { emoji: '🚀', count: 2 },
        ],
      },
      {
        id: 'tpl_tg_2',
        senderId: 'participant_3',
        type: 'document',
        text: 'Architecture_Spec_v3.pdf',
        docFileName: 'Architecture_Spec_v3.pdf',
        timestampLabel: '10:03 AM',
      },
      {
        id: 'tpl_tg_3',
        senderId: 'self',
        type: 'text',
        text: 'Verified all responsive viewports at 390px. Ready for the public release!',
        timestampLabel: '10:05 AM',
        isEdited: true,
        replyToId: 'tpl_tg_1',
        readReceipt: 'read',
        reactions: [{ emoji: '👍', count: 3 }],
      },
    ],
  },
  {
    id: 'crypto_signals',
    name: 'Crypto & Market Signals',
    tagline: 'Pinned signal alert, chart link preview, edited timestamp & high-engagement reactions',
    badge: 'Channel • Signals',
    mode: 'group',
    header: {
      title: 'Alpha Crypto Signals 📊',
      statusText: '28,950 subscribers',
      membersLabel: '28,950 subscribers',
      pinnedBarTitle: 'Pinned Signal #84',
      pinnedBarText: '⚡️ Breakout Alert: Resistance broken at $64,200',
      showPinnedBar: true,
    },
    messages: [
      {
        id: 'tpl_sig_date',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today',
        timestampLabel: '',
      },
      {
        id: 'tpl_sig_1',
        senderId: 'contact',
        type: 'link_preview',
        text: 'Massive volume surge detected on the 4H timeframe. Key target levels updated.',
        linkUrl: 'https://tradingview.com/chart/BTCUSDT',
        linkDomain: 'tradingview.com',
        linkTitle: 'BTC/USDT Breakout Analysis',
        timestampLabel: '11:15 AM',
        reactions: [
          { emoji: '🔥', count: 18 },
          { emoji: '💯', count: 12 },
        ],
      },
      {
        id: 'tpl_sig_2',
        senderId: 'contact',
        type: 'text',
        text: 'Stop loss moved to breakeven. Take profits locked at TP-1 and TP-2 🎯',
        timestampLabel: '11:20 AM',
        isEdited: true,
        reactions: [{ emoji: '👏', count: 14 }],
      },
    ],
  },
  {
    id: 'creative_studio_dm',
    name: 'Creative Studio 1-on-1 DM',
    tagline: 'Direct chat with voice memo waveform, design PDF attachment, read double checkmarks & online status',
    badge: 'DM • Voice & PDF',
    mode: 'direct',
    header: {
      title: 'Maya Lin',
      statusText: 'online',
      pinnedBarTitle: 'Pinned Note',
      pinnedBarText: 'Final client presentation deadline: 5 PM EST',
      showPinnedBar: true,
    },
    messages: [
      {
        id: 'tpl_dm_1',
        senderId: 'contact',
        type: 'voice_note',
        text: 'Voice note (0:24)',
        voiceDurationSeconds: 24,
        timestampLabel: '2:14 PM',
      },
      {
        id: 'tpl_dm_2',
        senderId: 'contact',
        type: 'document',
        text: 'Brand_Identity_Guidelines.pdf',
        docFileName: 'Brand_Identity_Guidelines.pdf',
        timestampLabel: '2:15 PM',
        reactions: [{ emoji: '❤️', count: 1 }],
      },
      {
        id: 'tpl_dm_3',
        senderId: 'self',
        type: 'text',
        text: 'Listening right now! The color palette and logo spacing look immaculate ✨',
        timestampLabel: '2:16 PM',
        replyToId: 'tpl_dm_1',
        readReceipt: 'read',
        reactions: [{ emoji: '👍', count: 1 }],
      },
    ],
  },
  {
    id: 'secret_encrypted_chat',
    name: 'Secret Encrypted Chat',
    tagline: 'Private 1-on-1 discussion with sticker reactions and verified contact badge',
    badge: 'Secret • Stickers',
    mode: 'direct',
    header: {
      title: 'Daniel Vance',
      statusText: 'online',
      showPinnedBar: false,
    },
    messages: [
      {
        id: 'tpl_sec_date',
        senderId: 'system',
        type: 'date_separator',
        text: 'Today',
        timestampLabel: '',
      },
      {
        id: 'tpl_sec_1',
        senderId: 'contact',
        type: 'text',
        text: 'Hey! Did you get a chance to test the offline mockups generator?',
        timestampLabel: '4:10 PM',
      },
      {
        id: 'tpl_sec_2',
        senderId: 'self',
        type: 'sticker',
        text: '🎉',
        stickerEmoji: '🎉',
        timestampLabel: '4:12 PM',
      },
      {
        id: 'tpl_sec_3',
        senderId: 'self',
        type: 'text',
        text: 'Works completely in-browser without sending any assets over the network 🛡️',
        timestampLabel: '4:13 PM',
        readReceipt: 'read',
        reactions: [{ emoji: '🔥', count: 2 }],
      },
    ],
  },
  {
    id: 'roadtrip_crew',
    name: 'Roadtrip Travel Crew',
    tagline: 'Group adventure planning with location sharing map card, system notification & photos',
    badge: 'Group • Location',
    mode: 'group',
    header: {
      title: 'Pacific Coast Roadtrip 🚐',
      statusText: '6 members, 2 online',
      membersLabel: '6 members, 2 online',
      pinnedBarTitle: 'Campsite Coordinates',
      pinnedBarText: 'Big Sur State Park Campsite #14 • Check-in 3 PM',
      showPinnedBar: true,
    },
    messages: [
      {
        id: 'tpl_rt_sys',
        senderId: 'system',
        type: 'system',
        text: 'Taylor joined the group via invite link',
        timestampLabel: '1:00 PM',
      },
      {
        id: 'tpl_rt_1',
        senderId: 'contact',
        type: 'location',
        text: 'Big Sur Campground & Cabins',
        locationPlace: 'Big Sur Campground & Cabins',
        timestampLabel: '1:15 PM',
        reactions: [{ emoji: '❤️', count: 3 }],
      },
      {
        id: 'tpl_rt_2',
        senderId: 'self',
        type: 'text',
        text: 'Just loaded the van with supplies. See everyone at the trailhead by 2:30 PM! 🌲',
        timestampLabel: '1:20 PM',
        readReceipt: 'read',
        reactions: [{ emoji: '🎉', count: 2 }],
      },
    ],
  },
  {
    id: 'podcast_audio',
    name: 'Podcast & Audio Episode',
    tagline: 'Audio music track card, voice memo snippets, quote replies and celebration emojis',
    badge: 'Audio • Voice',
    mode: 'direct',
    header: {
      title: 'Soundstage Podcast Producer',
      statusText: 'last seen recently',
      pinnedBarTitle: 'Episode Master Track',
      pinnedBarText: 'Ep. 42 Final Mixdown (48kHz 24-bit WAV)',
      showPinnedBar: true,
    },
    messages: [
      {
        id: 'tpl_pod_1',
        senderId: 'contact',
        type: 'audio',
        text: 'Episode_42_Master_v2.mp3',
        docFileName: 'Episode_42_Master_v2.mp3',
        timestampLabel: '6:30 PM',
      },
      {
        id: 'tpl_pod_2',
        senderId: 'self',
        type: 'voice_note',
        text: 'Feedback on intro transition (0:18)',
        voiceDurationSeconds: 18,
        timestampLabel: '6:35 PM',
        readReceipt: 'read',
      },
      {
        id: 'tpl_pod_3',
        senderId: 'contact',
        type: 'text',
        text: 'Applied the high-pass filter tweak you suggested. Sounds crystal clear!',
        timestampLabel: '6:38 PM',
        replyToId: 'tpl_pod_2',
        reactions: [{ emoji: '💯', count: 1 }],
      },
    ],
  },
];

export function TelegramEditor({
  onOpenScriptImport,
  onRequestClearAll,
}: {
  onOpenScriptImport: () => void;
  onRequestClearAll: () => void;
}) {
  const project = useStudioStore((s) => s.project);
  const theme = project.theme;
  const addMessage = useStudioStore((s) => s.addMessage);
  const updateMessage = useStudioStore((s) => s.updateMessage);
  const duplicateMessage = useStudioStore((s) => s.duplicateMessage);
  const switchMessageSender = useStudioStore((s) => s.switchMessageSender);
  const deleteMessage = useStudioStore((s) => s.deleteMessage);
  const moveMessage = useStudioStore((s) => s.moveMessage);
  const toggleMessageReaction = useStudioStore((s) => s.toggleMessageReaction);
  const upsertParticipant = useStudioStore((s) => s.upsertParticipant);
  const updateGroupMeta = useStudioStore((s) => s.updateGroupMeta);
  const updateHeaderState = useStudioStore((s) => s.updateHeaderState);
  const updateTheme = useStudioStore((s) => s.updateTheme);
  const setTypingPreview = useStudioStore((s) => s.setTypingPreview);
  const isTypingPreview = useStudioStore((s) => s.ui.isTypingPreview);

  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);

  const conv = getActiveConversation(project);
  const isGroup =
    conv.mode === 'group' ||
    Boolean(conv.groupMeta?.groupName) ||
    conv.participantIds.length > 2;

  // Active contact (for direct chat)
  const otherPart =
    conv.participantIds
      .map((id: string) => project.cast.find((p: Participant) => p.id === id))
      .find((p: Participant | undefined) => p && p.id !== conv.selfParticipantId) ?? project.cast[1] ?? project.cast[0];

  // Composer state
  const [composerSenderRole, setComposerSenderRole] = useState<'self' | 'contact' | 'participant_3' | 'system'>('self');
  const [composerType, setComposerType] = useState<MessageType>('text');
  const [composerText, setComposerText] = useState('');
  const [composerTime, setComposerTime] = useState('10:42 AM');
  const [composerReceipt, setComposerReceipt] = useState<ReadReceiptStatus>('read');
  const [composerIsEdited, setComposerIsEdited] = useState(false);
  const [composerForwarded, setComposerForwarded] = useState<'none' | 'forwarded'>('none');
  const [composerReplyToId, setComposerReplyToId] = useState('');
  const [composerDocName, setComposerDocName] = useState('Specification_v2.pdf');
  const [composerVoiceDuration, setComposerVoiceDuration] = useState(24);
  const [composerLocationPlace, setComposerLocationPlace] = useState('Market Street Studio');
  const [composerLinkUrl, setComposerLinkUrl] = useState('https://chatforge.dev');
  const [composerStickerEmoji] = useState('🎉');
  const [composerImageDataUrl, setComposerImageDataUrl] = useState('');

  // Tab
  const [activeTab, setActiveTab] = useState<'messages' | 'chat_group' | 'appearance' | 'presets'>('messages');

  // Handle Quick Add Message
  const handleAddMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let senderId: string;
    if (composerSenderRole === 'system') {
      senderId = 'system';
    } else if (composerSenderRole === 'self') {
      senderId = conv.selfParticipantId;
    } else if (composerSenderRole === 'participant_3') {
      const part3 = conv.participantIds
        .map((id: string) => project.cast.find((p: Participant) => p.id === id))
        .find((p: Participant | undefined) => p && p.id !== conv.selfParticipantId && p.id !== otherPart?.id);
      senderId = part3?.id || otherPart?.id || conv.selfParticipantId;
    } else {
      senderId = otherPart?.id || 'part_alex';
    }

    addMessage({
      senderId,
      type: composerType,
      text: composerText || (composerType === 'voice_note' ? 'Voice message' : composerType === 'sticker' ? composerStickerEmoji : ''),
      timestampLabel: composerTime,
      readStatus: composerReceipt,
      forwardedLabel: composerForwarded,
      replyToMessageId: composerReplyToId || undefined,
      docFileName: composerDocName,
      voiceDurationSeconds: composerVoiceDuration,
      locationPlace: composerLocationPlace,
      linkUrl: composerLinkUrl,
      imageDataUrl: composerImageDataUrl || undefined,
    });

    // If edited is selected
    if (composerIsEdited) {
      setTimeout(() => {
        const latest = conv.messages[conv.messages.length - 1];
        if (latest) {
          updateMessage(latest.id, { isEdited: true });
        }
      }, 50);
    }

    setComposerText('');
    setComposerIsEdited(false);
    setComposerReplyToId('');
  };

  // Image Upload Helper
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setComposerImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply Template
  const handleApplyTemplate = (tpl: TelegramTemplateDef) => {
    // 1. Group / Direct Mode & Header
    if (tpl.mode === 'group') {
      updateGroupMeta({
        groupName: tpl.header.title,
        showSenderNamesInBubbles: true,
        showSenderAvatarsInBubbles: true,
      });
      updateHeaderState({
        telegramMembersCountLabel: tpl.header.membersLabel || '1,420 members, 84 online',
        pinnedBarTitle: tpl.header.pinnedBarTitle,
        pinnedBarText: tpl.header.pinnedBarText,
        showPinnedBar: tpl.header.showPinnedBar,
      });
    } else {
      updateGroupMeta({
        groupName: '',
      });
      if (otherPart) {
        upsertParticipant({
          ...otherPart,
          displayName: tpl.header.title,
        });
      }
      updateHeaderState({
        statusText: tpl.header.statusText,
        pinnedBarTitle: tpl.header.pinnedBarTitle,
        pinnedBarText: tpl.header.pinnedBarText,
        showPinnedBar: tpl.header.showPinnedBar,
      });
    }

    // 2. Clear current messages & seed with template messages
    conv.messages.forEach((m) => deleteMessage(m.id));

    const selfId = conv.selfParticipantId;
    const contactId = otherPart?.id || 'part_alex';
    const participant3Id =
      conv.participantIds.find((id: string) => id !== selfId && id !== contactId) || 'part_sam';

    tpl.messages.forEach((m) => {
      let senderId: string;
      if (m.senderId === 'system') senderId = 'system';
      else if (m.senderId === 'self') senderId = selfId;
      else if (m.senderId === 'participant_3') senderId = participant3Id;
      else senderId = contactId;

      addMessage({
        id: m.id,
        senderId,
        type: m.type,
        text: m.text,
        timestampLabel: m.timestampLabel,
        readStatus: m.readReceipt || 'read',
        forwardedLabel: m.forwardedLabel || 'none',
        replyToMessageId: m.replyToId,
        docFileName: m.docFileName,
        voiceDurationSeconds: m.voiceDurationSeconds,
        locationPlace: m.locationPlace,
        linkUrl: m.linkUrl,
      });

      if (m.isEdited) {
        setTimeout(() => updateMessage(m.id, { isEdited: true }), 20);
      }
      if (m.reactions && m.reactions.length > 0) {
        setTimeout(
          () =>
            updateMessage(m.id, {
              reactions: m.reactions?.map((r) => ({
                emoji: r.emoji,
                participantIds: [selfId],
                count: r.count,
              })) || [],
            }),
          20
        );
      }
    });
  };

  return (
    <aside
      data-testid="telegram-dedicated-editor"
      className="flex h-full w-full flex-col border-r border-border bg-card/60 backdrop-blur-md"
    >
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3390EC]/15 text-[#3390EC]">
            <Send className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                data-testid="platform-editor-badge"
                className="rounded-full bg-[#3390EC]/15 px-2 py-0.5 text-[11px] font-semibold text-[#3390EC]"
              >
                Telegram Messenger Studio
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isGroup ? 'Group / Channel Mode' : 'Direct Conversation Mode'}
            </p>
          </div>
        </div>

        {/* Undo/Redo & Clear Actions */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            title="Undo"
            className="h-8 w-8"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            title="Redo"
            className="h-8 w-8"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRequestClearAll}
            className="h-8 text-xs text-destructive hover:bg-destructive/10"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* 2. Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'messages' | 'chat_group' | 'appearance' | 'presets')}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-4 pt-3 border-b border-border/50">
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="messages" className="text-xs">
              Messages
            </TabsTrigger>
            <TabsTrigger value="chat_group" className="text-xs">
              Chat & Group
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs">
              Theme
            </TabsTrigger>
            <TabsTrigger value="presets" className="text-xs">
              Presets
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB 1: MESSAGES ================= */}
        <TabsContent value="messages" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Quick Add Message Form */}
          <form
            onSubmit={handleAddMessageSubmit}
            className="rounded-xl border border-border bg-background/50 p-3 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-[#3390EC]" /> Add Message
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onOpenScriptImport}
                  className="h-7 text-xs text-[#3390EC] hover:bg-[#3390EC]/10"
                >
                  <Sparkles className="h-3 w-3 mr-1" /> AI Script
                </Button>
              </div>
            </div>

            {/* Sender & Type Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Sender
                </label>
                <select
                  value={composerSenderRole}
                  onChange={(e) =>
                    setComposerSenderRole(
                      e.target.value as 'self' | 'contact' | 'participant_3' | 'system'
                    )
                  }
                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="self">You (Outgoing)</option>
                  <option value="contact">{otherPart?.displayName || 'Contact (Incoming)'}</option>
                  {isGroup && <option value="participant_3">Group Member (3rd)</option>}
                  <option value="system">System Notification</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Message Type
                </label>
                <select
                  value={composerType}
                  onChange={(e) => setComposerType(e.target.value as MessageType)}
                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="text">Text Message</option>
                  <option value="voice_note">Voice Note (Audio)</option>
                  <option value="audio">Music / Audio Track</option>
                  <option value="document">Document (PDF)</option>
                  <option value="image">Photo Attachment</option>
                  <option value="video_preview">Video Preview</option>
                  <option value="link_preview">Link Preview</option>
                  <option value="sticker">Sticker / Emoji</option>
                  <option value="location">Map Location</option>
                  <option value="date_separator">Date Divider</option>
                </select>
              </div>
            </div>

            {/* Content / Textarea */}
            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                {composerType === 'voice_note'
                  ? 'Voice Caption / Transcript'
                  : composerType === 'document'
                    ? 'File Description / Caption'
                    : composerType === 'sticker'
                      ? 'Sticker Emoji'
                      : 'Message Text'}
              </label>
              <Textarea
                rows={2}
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder={
                  composerType === 'voice_note'
                    ? 'Voice memo note...'
                    : composerType === 'sticker'
                      ? '🎉'
                      : 'Type a realistic Telegram message...'
                }
                className="text-xs resize-none"
              />
            </div>

            {/* Type Specific Fields */}
            {composerType === 'voice_note' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Duration (seconds)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={360}
                    value={composerVoiceDuration}
                    onChange={(e) => setComposerVoiceDuration(Number(e.target.value))}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-5 text-xs text-muted-foreground">
                  <Mic className="h-4 w-4 text-[#3390EC]" /> Dynamic Waveform
                </div>
              </div>
            )}

            {composerType === 'document' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    File Name
                  </label>
                  <Input
                    value={composerDocName}
                    onChange={(e) => setComposerDocName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-5 text-xs text-muted-foreground">
                  <FileText className="h-4 w-4 text-[#3390EC]" /> PDF • 2.4 MB
                </div>
              </div>
            )}

            {composerType === 'link_preview' && (
              <div className="space-y-2">
                <div>
                  <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Preview Link URL
                  </label>
                  <Input
                    value={composerLinkUrl}
                    onChange={(e) => setComposerLinkUrl(e.target.value)}
                    placeholder="https://t.me/chatforge"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}

            {composerType === 'location' && (
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Place / Venue Name
                </label>
                <Input
                  value={composerLocationPlace}
                  onChange={(e) => setComposerLocationPlace(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            )}

            {(composerType === 'image' || composerType === 'video_preview') && (
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Upload Media
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="text-xs file:mr-2 file:h-7 file:px-2 file:rounded file:border-0 file:bg-[#3390EC] file:text-white"
                />
              </div>
            )}

            {/* Time, Receipts & Flags */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Time
                </label>
                <Input
                  value={composerTime}
                  onChange={(e) => setComposerTime(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Receipt
                </label>
                <select
                  value={composerReceipt}
                  onChange={(e) => setComposerReceipt(e.target.value as ReadReceiptStatus)}
                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="read">Read (✓✓)</option>
                  <option value="delivered">Delivered (✓)</option>
                  <option value="sent">Sent (✓)</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Forwarded
                </label>
                <select
                  value={composerForwarded}
                  onChange={(e) => setComposerForwarded(e.target.value as 'none' | 'forwarded')}
                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="none">Normal</option>
                  <option value="forwarded">Forwarded</option>
                </select>
              </div>
            </div>

            {/* Edited & Reply-To Row */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={composerIsEdited}
                  onChange={(e) => setComposerIsEdited(e.target.checked)}
                  className="rounded border-input text-[#3390EC] focus:ring-[#3390EC]"
                />
                Mark as &quot;edited&quot;
              </label>

              {conv.messages.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground">Reply to:</span>
                  <select
                    value={composerReplyToId}
                    onChange={(e) => setComposerReplyToId(e.target.value)}
                    className="h-7 text-xs px-1.5 rounded border border-input bg-background max-w-[120px]"
                  >
                    <option value="">None</option>
                    {conv.messages
                      .filter((m: Message) => m.type !== 'date_separator' && m.type !== 'system')
                      .map((m: Message) => (
                        <option key={m.id} value={m.id}>
                          {m.text?.slice(0, 18) || m.type}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              className="w-full h-8 bg-[#3390EC] hover:bg-[#2AABEE] text-white text-xs font-semibold"
            >
              Add to Telegram Chat
            </Button>
          </form>

          {/* Timeline Messages List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Conversation Timeline ({conv.messages.length})
              </span>
            </div>

            <div className="space-y-1.5">
              {conv.messages.map((m: Message, index: number) => {
                const isSelf = m.senderId === conv.selfParticipantId;
                const sender = project.cast.find((p) => p.id === m.senderId);

                return (
                  <div
                    key={m.id}
                    className="group flex items-center justify-between gap-2 p-2 rounded-lg border border-border bg-card hover:border-[#3390EC]/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-[10px] font-semibold px-1.5 py-0.2 rounded',
                            m.type === 'system' || m.type === 'date_separator'
                              ? 'bg-amber-500/15 text-amber-500'
                              : isSelf
                                ? 'bg-[#3390EC]/15 text-[#3390EC]'
                                : 'bg-emerald-500/15 text-emerald-600'
                          )}
                        >
                          {m.type === 'system'
                            ? 'SYSTEM'
                            : m.type === 'date_separator'
                              ? 'DATE'
                              : isSelf
                                ? 'YOU'
                                : sender?.displayName || 'CONTACT'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{m.timestampLabel}</span>
                        {m.isEdited && (
                          <span className="text-[9px] text-[#3390EC] font-semibold">edited</span>
                        )}
                        {m.forwardedLabel && m.forwardedLabel !== 'none' && (
                          <span className="text-[9px] text-cyan-600">fwd</span>
                        )}
                      </div>
                      <p className="text-xs text-foreground truncate mt-0.5">
                        {m.text || `[${m.type}]`}
                      </p>

                      {/* Quick Reactions Bar */}
                      <div className="flex items-center gap-1 mt-1">
                        {EMOJI_REACTIONS.slice(0, 4).map((emoji) => {
                          const hasReacted = m.reactions?.some((r: Reaction) => r.emoji === emoji);
                          return (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => toggleMessageReaction(m.id, emoji)}
                              className={cn(
                                'h-5 px-1 rounded text-[11px] flex items-center gap-0.5 border',
                                hasReacted
                                  ? 'border-[#3390EC] bg-[#3390EC]/15 text-[#3390EC]'
                                  : 'border-transparent hover:bg-muted text-muted-foreground'
                              )}
                            >
                              <span>{emoji}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        disabled={index === 0}
                        onClick={() => moveMessage(m.id, 'up')}
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        disabled={index === conv.messages.length - 1}
                        onClick={() => moveMessage(m.id, 'down')}
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      {m.type !== 'system' && m.type !== 'date_separator' && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => switchMessageSender(m.id)}
                          title="Switch Sender"
                        >
                          <ArrowLeftRight className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => duplicateMessage(m.id)}
                        title="Duplicate"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => deleteMessage(m.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 2: CHAT & GROUP ================= */}
        <TabsContent value="chat_group" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Chat Mode Toggle */}
          <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
            <label className="text-xs font-semibold text-foreground block">
              Chat Conversation Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={!isGroup ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateGroupMeta({ groupName: '' })}
                className={cn(!isGroup && 'bg-[#3390EC] hover:bg-[#2AABEE] text-white', 'text-xs')}
              >
                <User className="h-3.5 w-3.5 mr-1.5" /> Direct (1-on-1)
              </Button>
              <Button
                type="button"
                variant={isGroup ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  updateGroupMeta({
                    groupName: conv.groupMeta?.groupName || 'Telegram Supergroup',
                    showSenderNamesInBubbles: true,
                    showSenderAvatarsInBubbles: true,
                  })
                }
                className={cn(isGroup && 'bg-[#3390EC] hover:bg-[#2AABEE] text-white', 'text-xs')}
              >
                <Users className="h-3.5 w-3.5 mr-1.5" /> Group / Channel
              </Button>
            </div>
          </div>

          {/* Group Details vs Direct Contact Details */}
          {isGroup ? (
            <div className="rounded-xl border border-border bg-background/50 p-3 space-y-3">
              <span className="text-xs font-semibold text-foreground block">
                Group & Community Details
              </span>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Group / Channel Name
                </label>
                <Input
                  value={conv.groupMeta?.groupName || ''}
                  onChange={(e) => updateGroupMeta({ groupName: e.target.value })}
                  placeholder="ChatForge Devs & Creators"
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Members & Online Count Subtitle
                </label>
                <Input
                  value={conv.headerState.telegramMembersCountLabel || ''}
                  onChange={(e) =>
                    updateHeaderState({ telegramMembersCountLabel: e.target.value })
                  }
                  placeholder="1,420 members, 84 online"
                  className="h-8 text-xs"
                />
              </div>

              {/* Group Participants Management */}
              <div className="pt-2 border-t border-border/60">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Group Members ({project.cast.length})
                </span>
                <div className="space-y-1.5">
                  {project.cast.map((part) => (
                    <div
                      key={part.id}
                      className="flex items-center justify-between p-2 rounded-md border border-border bg-card text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-white text-[10px]"
                          style={{ backgroundColor: part.avatarFallbackColor }}
                        >
                          {part.displayName.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground">{part.displayName}</span>
                        {part.isAdmin && (
                          <span className="text-[9px] font-bold text-[#3390EC] bg-[#3390EC]/15 px-1 py-0.2 rounded">
                            ADMIN
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            upsertParticipant({
                              ...part,
                              isAdmin: !part.isAdmin,
                            })
                          }
                          className={cn(
                            'text-[10px] px-1.5 py-0.5 rounded border transition-colors',
                            part.isAdmin
                              ? 'border-[#3390EC] text-[#3390EC] bg-[#3390EC]/10'
                              : 'border-input text-muted-foreground hover:bg-muted'
                          )}
                        >
                          {part.isAdmin ? 'Demote' : 'Make Admin'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-background/50 p-3 space-y-3">
              <span className="text-xs font-semibold text-foreground block">
                Contact Profile Customization
              </span>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Contact Display Name
                </label>
                <Input
                  value={otherPart?.displayName || ''}
                  onChange={(e) =>
                    otherPart &&
                    upsertParticipant({
                      ...otherPart,
                      displayName: e.target.value,
                    })
                  }
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Online / Last Seen Status
                </label>
                <Input
                  value={conv.headerState.statusText || 'online'}
                  onChange={(e) => updateHeaderState({ statusText: e.target.value })}
                  placeholder="online or last seen recently"
                  className="h-8 text-xs"
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                  {['online', 'last seen recently', 'last seen 5m ago'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => updateHeaderState({ statusText: preset })}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground pt-1">
                  <input
                    type="checkbox"
                    checked={otherPart?.verifiedBadge === 'blue'}
                    onChange={(e) =>
                      otherPart &&
                      upsertParticipant({
                        ...otherPart,
                        verifiedBadge: e.target.checked ? 'blue' : 'none',
                      })
                    }
                    className="rounded border-input text-[#3390EC] focus:ring-[#3390EC]"
                  />
                  Telegram Verified Badge (Blue Star)
                </label>
              </div>
            </div>
          )}

          {/* Pinned Message Bar Settings */}
          <div className="rounded-xl border border-border bg-background/50 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Pin className="h-3.5 w-3.5 text-[#3390EC]" /> Pinned Message Bar
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={conv.headerState.showPinnedBar !== false}
                  onChange={(e) => updateHeaderState({ showPinnedBar: e.target.checked })}
                  className="rounded border-input text-[#3390EC] focus:ring-[#3390EC]"
                />
                Visible
              </label>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Pinned Title
              </label>
              <Input
                value={conv.headerState.pinnedBarTitle || 'Pinned Message'}
                onChange={(e) => updateHeaderState({ pinnedBarTitle: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Pinned Message Preview Text
              </label>
              <Input
                value={conv.headerState.pinnedBarText || ''}
                onChange={(e) => updateHeaderState({ pinnedBarText: e.target.value })}
                placeholder="Release candidate build #304 ready for QA"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </TabsContent>

        {/* ================= TAB 3: THEME & STATUS ================= */}
        <TabsContent value="appearance" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Light / Dark Mode Toggle */}
          <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
            <span className="text-xs font-semibold text-foreground block">
              Color Scheme & Theme
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={theme.colorScheme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateTheme({ colorScheme: 'light' })}
                className={cn(theme.colorScheme === 'light' && 'bg-[#3390EC] hover:bg-[#2AABEE] text-white', 'text-xs')}
              >
                <Sun className="h-3.5 w-3.5 mr-1.5" /> Telegram Light (Blue)
              </Button>
              <Button
                type="button"
                variant={theme.colorScheme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateTheme({ colorScheme: 'dark' })}
                className={cn(theme.colorScheme === 'dark' && 'bg-[#3390EC] hover:bg-[#2AABEE] text-white', 'text-xs')}
              >
                <Moon className="h-3.5 w-3.5 mr-1.5" /> Telegram Night (Dark)
              </Button>
            </div>
          </div>

          {/* Typing Indicator Preview */}
          <div className="rounded-xl border border-border bg-background/50 p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Typing Indicator Bubble
              </span>
              <p className="text-[11px] text-muted-foreground">
                Show animated &quot;typing...&quot; bubble in live preview
              </p>
            </div>
            <input
              type="checkbox"
              checked={isTypingPreview}
              onChange={(e) => setTypingPreview(e.target.checked)}
              className="rounded border-input text-[#3390EC] focus:ring-[#3390EC] h-4 w-4"
            />
          </div>

          {/* Status Bar Settings */}
          <div className="rounded-xl border border-border bg-background/50 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground block">
                Phone Status Bar
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={theme.statusBar.visible}
                  onChange={(e) =>
                    updateTheme({
                      statusBar: { ...theme.statusBar, visible: e.target.checked },
                    })
                  }
                  className="rounded border-input text-[#3390EC] focus:ring-[#3390EC]"
                />
                Show
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Time Label
                </label>
                <Input
                  value={theme.statusBar.timeLabel}
                  onChange={(e) =>
                    updateTheme({
                      statusBar: { ...theme.statusBar, timeLabel: e.target.value },
                    })
                  }
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Battery %
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={theme.statusBar.batteryPercent}
                  onChange={(e) =>
                    updateTheme({
                      statusBar: {
                        ...theme.statusBar,
                        batteryPercent: Number(e.target.value),
                      },
                    })
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Font Scale */}
          <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Font Scaling</span>
              <span className="text-xs font-mono text-muted-foreground">
                {theme.typography.fontScale}x
              </span>
            </div>
            <input
              type="range"
              min={0.8}
              max={1.3}
              step={0.05}
              value={theme.typography.fontScale}
              onChange={(e) =>
                updateTheme({
                  typography: {
                    ...theme.typography,
                    fontScale: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-[#3390EC]"
            />
          </div>
        </TabsContent>

        {/* ================= TAB 4: PRESETS ================= */}
        <TabsContent value="presets" className="flex-1 overflow-y-auto p-4 space-y-3 m-0">
          <div>
            <span className="text-xs font-semibold text-foreground block">
              Instant Telegram Scenarios
            </span>
            <p className="text-[11px] text-muted-foreground">
              One-click realistic presets configured with authentic Telegram features
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {TELEGRAM_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-xl border border-border bg-card hover:border-[#3390EC] transition-all shadow-xs flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">{tpl.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#3390EC]/15 text-[#3390EC]">
                      {tpl.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {tpl.tagline}
                  </p>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  data-testid={`apply-template-${tpl.id}`}
                  onClick={() => handleApplyTemplate(tpl)}
                  className="h-7 text-xs border-[#3390EC]/40 hover:bg-[#3390EC] hover:text-white transition-colors"
                >
                  Load Scenario
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
