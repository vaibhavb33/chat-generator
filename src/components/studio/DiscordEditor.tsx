'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Code,
  Copy,
  Hash,
  Layout,
  Plus,
  Redo2,
  Smartphone,
  Sparkles,
  Trash2,
  Undo2,
  User,
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
} from '@/core/types';
import { cn } from '@/lib/utils';

const DISCORD_ROLE_COLORS = [
  { name: 'Blurple', hex: '#5865F2' },
  { name: 'Red Admin', hex: '#ED4245' },
  { name: 'Green Dev', hex: '#57F287' },
  { name: 'Yellow Gold', hex: '#FEE75C' },
  { name: 'Fuchsia VIP', hex: '#EB459E' },
  { name: 'Orange Mod', hex: '#E67E22' },
  { name: 'Cyan Staff', hex: '#26C6DA' },
  { name: 'White Member', hex: '#F2F3F5' },
];

const EMOJI_REACTIONS = ['🚀', '🔥', '🎉', '👍', '❤️', '💯', '👏', '😂'];

export interface DiscordTemplateDef {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  layout: 'desktop_server' | 'desktop_compact' | 'mobile_chat' | 'direct_message';
  serverName: string;
  channelName: string;
  channelTopic: string;
  messages: Array<{
    id: string;
    senderId: string;
    type: MessageType;
    text: string;
    timestampLabel: string;
    isEdited?: boolean;
    replyToId?: string;
    reactions?: Array<{ emoji: string; count: number }>;
    embed?: {
      title: string;
      description: string;
      colorHex?: string;
      authorName?: string;
      footerText?: string;
      fields?: Array<{ name: string; value: string; inline?: boolean }>;
    };
  }>;
}

const DISCORD_TEMPLATES: DiscordTemplateDef[] = [
  {
    id: 'developer_changelog',
    name: 'Developer Changelog & Release',
    tagline: 'Server channel with rich bot embed, code block CLI install, and rocket/flame reactions',
    badge: 'Embed • Code Block',
    layout: 'desktop_server',
    serverName: 'ChatForge Community',
    channelName: 'announcements',
    channelTopic: 'Official product updates and developer changelogs',
    messages: [
      {
        id: 'tpl_dc_1',
        senderId: 'part_alex',
        type: 'text',
        text: 'Attention @everyone! ChatForge Studio v2.5 is officially released 🚀',
        timestampLabel: 'Today at 10:02 AM',
        reactions: [
          { emoji: '🚀', count: 18 },
          { emoji: '🔥', count: 12 },
        ],
        embed: {
          title: 'ChatForge Studio v2.5 Release Notes',
          description:
            'Added dedicated Discord, Telegram, and Android generators with authentic layouts, role colors, and code blocks.',
          authorName: 'ChatForge Core Engineering',
          colorHex: '#5865F2',
          fields: [
            { name: 'Zero Watermarks', value: '100% Free HD Exports', inline: true },
            { name: 'Client-Side', value: 'Instant & Private', inline: true },
          ],
          footerText: 'ChatForge Bot • v2.5.0',
        },
      },
      {
        id: 'tpl_dc_2',
        senderId: 'part_self',
        type: 'text',
        text: 'Tested the upgrade locally with:\n```bash\nnpm install && npm run build\n```\nAll 36 dedicated route tests passed with zero errors! 🎉',
        timestampLabel: 'Today at 10:05 AM',
        replyToId: 'tpl_dc_1',
        reactions: [{ emoji: '🎉', count: 8 }],
      },
    ],
  },
  {
    id: 'guild_raid_tactics',
    name: 'Gaming Guild Raid Tactics',
    tagline: 'Multi-member gaming guild server with custom role colors, voice sync, and team banter',
    badge: 'Gaming • Roles',
    layout: 'desktop_server',
    serverName: 'Mythic Vanguard Guild',
    channelName: 'raid-tactics',
    channelTopic: 'Boss strategies, phase transitions, and consumable assignments',
    messages: [
      {
        id: 'tpl_rg_1',
        senderId: 'part_alex',
        type: 'text',
        text: 'Raid starts in 15 minutes! Please be in Voice Channel and bring your resistance potions ⚔️',
        timestampLabel: 'Today at 7:45 PM',
        reactions: [
          { emoji: '🔥', count: 14 },
          { emoji: '⚔️', count: 9 },
        ],
      },
      {
        id: 'tpl_rg_2',
        senderId: 'part_sam',
        type: 'text',
        text: 'Phase 2 positioning recap:\nTanks front left, ranged spread 10 yards out, healers watch the cleave.',
        timestampLabel: 'Today at 7:48 PM',
        replyToId: 'tpl_rg_1',
        isEdited: true,
        reactions: [{ emoji: '👍', count: 11 }],
      },
      {
        id: 'tpl_rg_3',
        senderId: 'part_self',
        type: 'text',
        text: 'Flasks and food buffs ready to distribute. Let us secure this realm first! 🛡️',
        timestampLabel: 'Today at 7:50 PM',
        reactions: [{ emoji: '💯', count: 7 }],
      },
    ],
  },
  {
    id: 'open_source_dev',
    name: 'Open Source Community Discussion',
    tagline: 'Community dev chat with TypeScript snippets, helpful dev tags, and system messages',
    badge: 'Dev • TypeScript',
    layout: 'desktop_server',
    serverName: 'Next.js Devs & Builders',
    channelName: 'general',
    channelTopic: 'General frontend architecture, React 19, and full-stack questions',
    messages: [
      {
        id: 'tpl_os_sys',
        senderId: 'system',
        type: 'system',
        text: 'Welcome @you.studio to Next.js Devs & Builders! Say hello 👋',
        timestampLabel: 'Today at 2:00 PM',
      },
      {
        id: 'tpl_os_1',
        senderId: 'part_sam',
        type: 'text',
        text: 'Quick question: what is the recommended way to test server actions in Next 15?',
        timestampLabel: 'Today at 2:05 PM',
      },
      {
        id: 'tpl_os_2',
        senderId: 'part_alex',
        type: 'text',
        text: 'Here is a clean pattern using Playwright e2e fixture:\n```typescript\nconst response = await page.request.post(\'/api/generate\', {\n  data: { platform: \'discord-chat\' }\n});\n```',
        timestampLabel: 'Today at 2:08 PM',
        replyToId: 'tpl_os_1',
        reactions: [{ emoji: '❤️', count: 5 }],
      },
    ],
  },
  {
    id: 'crypto_alpha_group',
    name: 'Crypto & Web3 Alpha Group',
    tagline: 'Server channel with trading alert embed, gold VIP roles, and pinned announcements',
    badge: 'Crypto • VIP',
    layout: 'desktop_server',
    serverName: 'Alpha Matrix Trading',
    channelName: 'market-alpha',
    channelTopic: 'Daily macro levels, orderflow analysis, and breakout setups',
    messages: [
      {
        id: 'tpl_ca_1',
        senderId: 'part_alex',
        type: 'text',
        text: '🚨 BREAKOUT ALERT: Key daily resistance level cleared with aggressive buy volume!',
        timestampLabel: 'Today at 1:15 PM',
        reactions: [
          { emoji: '🚀', count: 24 },
          { emoji: '🔥', count: 19 },
        ],
        embed: {
          title: 'BTC / USDT 4-Hour Trend Confirmation',
          description:
            'Confirmation candle closed above $65,400. Bullish continuation targets active.',
          authorName: 'Alpha Lead Analyst',
          colorHex: '#FEE75C',
          fields: [
            { name: 'Target 1', value: '$68,200', inline: true },
            { name: 'Invalidation', value: '$63,900', inline: true },
          ],
          footerText: 'Alpha Matrix Signals • 1:15 PM',
        },
      },
    ],
  },
  {
    id: 'direct_message_view',
    name: 'Direct Message 1-on-1',
    tagline: 'Private 1-on-1 Discord DM with call header and compact messaging stream',
    badge: 'DM • Private',
    layout: 'direct_message',
    serverName: 'Direct Message',
    channelName: 'Maya Lin',
    channelTopic: 'Direct Message Conversation',
    messages: [
      {
        id: 'tpl_dm_1',
        senderId: 'part_alex',
        type: 'text',
        text: 'Hey! Have you seen the new Discord generator updates yet?',
        timestampLabel: 'Today at 4:30 PM',
      },
      {
        id: 'tpl_dm_2',
        senderId: 'part_self',
        type: 'text',
        text: 'Yes! The custom server rail, channel tree, and rich embeds look 100% realistic.',
        timestampLabel: 'Today at 4:32 PM',
        isEdited: true,
        reactions: [{ emoji: '👍', count: 1 }],
      },
    ],
  },
  {
    id: 'mobile_chat_view',
    name: 'Mobile Discord Chat Layout',
    tagline: 'Simulate Discord mobile app view on a phone screen with mobile composer',
    badge: 'Mobile • Phone',
    layout: 'mobile_chat',
    serverName: 'ChatForge Mobile',
    channelName: 'general',
    channelTopic: 'Mobile community chat',
    messages: [
      {
        id: 'tpl_mob_1',
        senderId: 'part_alex',
        type: 'text',
        text: 'Testing Discord mobile view directly in the browser! 📱',
        timestampLabel: 'Today at 5:15 PM',
        reactions: [{ emoji: '🔥', count: 4 }],
      },
      {
        id: 'tpl_mob_2',
        senderId: 'part_self',
        type: 'text',
        text: 'The 390px viewport renders without horizontal scroll overflow.',
        timestampLabel: 'Today at 5:18 PM',
        replyToId: 'tpl_mob_1',
        reactions: [{ emoji: '✅', count: 2 }],
      },
    ],
  },
];

export function DiscordEditor({
  onOpenScriptImport,
  onRequestClearAll,
}: {
  onOpenScriptImport: () => void;
  onRequestClearAll: () => void;
}) {
  const project = useStudioStore((s) => s.project);
  const addMessage = useStudioStore((s) => s.addMessage);
  const updateMessage = useStudioStore((s) => s.updateMessage);
  const duplicateMessage = useStudioStore((s) => s.duplicateMessage);
  const switchMessageSender = useStudioStore((s) => s.switchMessageSender);
  const deleteMessage = useStudioStore((s) => s.deleteMessage);
  const moveMessage = useStudioStore((s) => s.moveMessage);
  const toggleMessageReaction = useStudioStore((s) => s.toggleMessageReaction);
  const upsertParticipant = useStudioStore((s) => s.upsertParticipant);
  const updateHeaderState = useStudioStore((s) => s.updateHeaderState);
  const updateGroupMeta = useStudioStore((s) => s.updateGroupMeta);
  const setTypingPreview = useStudioStore((s) => s.setTypingPreview);
  const isTypingPreview = useStudioStore((s) => s.ui.isTypingPreview);

  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);

  const conv = getActiveConversation(project);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'messages' | 'server' | 'members' | 'presets'>('messages');

  // Composer Form
  const [composerSenderId, setComposerSenderId] = useState(conv.selfParticipantId);
  const [composerType, setComposerType] = useState<MessageType>('text');
  const [composerText, setComposerText] = useState('');
  const [composerTime, setComposerTime] = useState('Today at 10:42 AM');
  const [composerIsEdited, setComposerIsEdited] = useState(false);
  const [composerReplyToId, setComposerReplyToId] = useState('');
  const [composerEmbedTitle, setComposerEmbedTitle] = useState('ChatForge Announcement');
  const [composerEmbedDesc, setComposerEmbedDesc] = useState('Official community update & roadmap features.');
  const [composerEmbedColor, setComposerEmbedColor] = useState('#5865F2');
  const [composerEmbedAuthor, setComposerEmbedAuthor] = useState('ChatForge Bot');
  const [composerEmbedFooter, setComposerEmbedFooter] = useState('Verified Bot');
  const [composerCodeLang, setComposerCodeLang] = useState('bash');
  const [composerCodeContent, setComposerCodeContent] = useState('npm install -g @chatforge/cli');

  // Handle Quick Add Message
  const handleAddMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let textToAdd = composerText.trim();
    if (composerType === 'system') {
      textToAdd = textToAdd || 'A wild member appeared!';
    } else if (composerCodeContent.trim() && composerType === 'text' && !textToAdd.includes('```')) {
      // If code was entered in code mode
    }

    const attachments: Message['attachments'] = [];

    // If embed
    if (composerEmbedTitle.trim() && (composerType === 'link_preview' || composerType === 'text' && composerEmbedDesc)) {
      attachments.push({
        id: 'att_embed_custom',
        kind: 'link_preview',
        discordEmbedMeta: {
          title: composerEmbedTitle,
          description: composerEmbedDesc,
          colorHex: composerEmbedColor,
          authorName: composerEmbedAuthor,
          footerText: composerEmbedFooter,
        },
      });
    }

    addMessage({
      senderId: composerSenderId,
      type: composerType,
      text: textToAdd || (composerType === 'system' ? 'A wild user appeared' : 'Awesome update!'),
      timestampLabel: composerTime,
      replyToMessageId: composerReplyToId || undefined,
    });

    if (composerIsEdited) {
      setTimeout(() => {
        const latest = conv.messages[conv.messages.length - 1];
        if (latest) updateMessage(latest.id, { isEdited: true });
      }, 50);
    }

    if (attachments.length > 0) {
      setTimeout(() => {
        const latest = conv.messages[conv.messages.length - 1];
        if (latest) updateMessage(latest.id, { attachments });
      }, 50);
    }

    setComposerText('');
    setComposerIsEdited(false);
    setComposerReplyToId('');
  };

  // Apply Template
  const handleApplyTemplate = (tpl: DiscordTemplateDef) => {
    updateHeaderState({
      discordLayout: tpl.layout,
      serverName: tpl.serverName,
      channelName: tpl.channelName,
      channelTopic: tpl.channelTopic,
    });
    updateGroupMeta({
      groupName: `#${tpl.channelName}`,
    });

    // Clear messages cleanly without infinite loop
    conv.messages.forEach((m) => deleteMessage(m.id));

    // Seed template messages
    tpl.messages.forEach((m) => {
      const attachments: Message['attachments'] = [];
      if (m.embed) {
        attachments.push({
          id: `att_${m.id}`,
          kind: 'link_preview',
          discordEmbedMeta: m.embed,
        });
      }

      addMessage({
        id: m.id,
        senderId: m.senderId === 'system' ? 'system' : m.senderId,
        type: m.type,
        text: m.text,
        timestampLabel: m.timestampLabel,
        replyToMessageId: m.replyToId,
      });

      if (m.isEdited) {
        setTimeout(() => updateMessage(m.id, { isEdited: true }), 20);
      }
      if (attachments.length > 0) {
        setTimeout(() => updateMessage(m.id, { attachments }), 20);
      }
      if (m.reactions && m.reactions.length > 0) {
        setTimeout(
          () =>
            updateMessage(m.id, {
              reactions: m.reactions?.map((r) => ({
                emoji: r.emoji,
                participantIds: [conv.selfParticipantId],
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
      data-testid="discord-dedicated-editor"
      className="flex h-full w-full flex-col border-r border-border bg-card/60 backdrop-blur-md select-none"
    >
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5865F2]/15 text-[#5865F2]">
            <Hash className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                data-testid="platform-editor-badge"
                className="rounded-full bg-[#5865F2]/15 px-2 py-0.5 text-[11px] font-semibold text-[#5865F2]"
              >
                Discord Channel Studio
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {conv.headerState.serverName || 'ChatForge Community'} • #{conv.headerState.channelName || 'general'}
            </p>
          </div>
        </div>

        {/* Undo/Redo & Clear */}
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
        onValueChange={(v) => setActiveTab(v as 'messages' | 'server' | 'members' | 'presets')}
        className="flex-1 flex flex-col min-h-0"
      >
        <div className="px-4 pt-3 border-b border-border/50">
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="messages" className="text-xs">
              Messages
            </TabsTrigger>
            <TabsTrigger value="server" className="text-xs">
              Server
            </TabsTrigger>
            <TabsTrigger value="members" className="text-xs">
              Members
            </TabsTrigger>
            <TabsTrigger value="presets" className="text-xs">
              Presets
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB 1: MESSAGES ================= */}
        <TabsContent value="messages" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Add Message Form */}
          <form
            onSubmit={handleAddMessageSubmit}
            className="rounded-xl border border-border bg-background/50 p-3 space-y-3 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-[#5865F2]" /> Post to Discord
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenScriptImport}
                className="h-7 text-xs text-[#5865F2] hover:bg-[#5865F2]/10"
              >
                <Sparkles className="h-3 w-3 mr-1" /> AI Script
              </Button>
            </div>

            {/* Sender & Type Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Author
                </label>
                <select
                  value={composerSenderId}
                  onChange={(e) => setComposerSenderId(e.target.value)}
                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  {project.cast.map((part) => (
                    <option key={part.id} value={part.id}>
                      {part.displayName} {part.roleLabel ? `[${part.roleLabel}]` : ''}
                    </option>
                  ))}
                  <option value="system">System Notification</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Type
                </label>
                <select
                  value={composerType}
                  onChange={(e) => setComposerType(e.target.value as MessageType)}
                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="text">Normal Message</option>
                  <option value="link_preview">Rich Embed Card</option>
                  <option value="image">Photo Attachment</option>
                  <option value="document">File Document</option>
                  <option value="system">System Welcome / Boost</option>
                  <option value="date_separator">Date Divider</option>
                </select>
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Message Content (Supports @mentions & ```code```)
                </label>
              </div>
              <Textarea
                aria-label="Message text"
                rows={3}
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Type message, e.g. Hey @everyone! Check out this code block..."
                className="text-xs resize-none"
              />
            </div>

            {/* Code Block Helper */}
            <div className="rounded-lg border border-border/80 bg-muted/40 p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                  <Code className="h-3 w-3 text-[#5865F2]" /> Quick Code Snippet
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setComposerText(
                      (prev) =>
                        `${prev ? prev + '\n' : ''}\`\`\`${composerCodeLang}\n${composerCodeContent}\n\`\`\``
                    )
                  }
                  className="text-[10px] px-2 py-0.5 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium"
                >
                  Insert into Text
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input
                    placeholder="Language, e.g. bash"
                    value={composerCodeLang}
                    onChange={(e) => setComposerCodeLang(e.target.value)}
                    className="h-7 text-[11px]"
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Code snippet..."
                    value={composerCodeContent}
                    onChange={(e) => setComposerCodeContent(e.target.value)}
                    className="h-7 text-[11px] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Rich Embed Fields */}
            {composerType === 'link_preview' && (
              <div className="rounded-lg border border-[#5865F2]/40 bg-[#5865F2]/5 p-2.5 space-y-2">
                <span className="text-[11px] font-bold text-[#5865F2] block uppercase tracking-wider">
                  Discord Rich Embed
                </span>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    Embed Title
                  </label>
                  <Input
                    value={composerEmbedTitle}
                    onChange={(e) => setComposerEmbedTitle(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    Embed Description
                  </label>
                  <Textarea
                    rows={2}
                    value={composerEmbedDesc}
                    onChange={(e) => setComposerEmbedDesc(e.target.value)}
                    className="text-xs resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    Embed Author Name
                  </label>
                  <Input
                    value={composerEmbedAuthor}
                    onChange={(e) => setComposerEmbedAuthor(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={composerEmbedColor}
                        onChange={(e) => setComposerEmbedColor(e.target.value)}
                        className="w-6 h-6 rounded border-0 cursor-pointer"
                      />
                      <span className="text-[11px] font-mono">{composerEmbedColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                      Footer Text
                    </label>
                    <Input
                      value={composerEmbedFooter}
                      onChange={(e) => setComposerEmbedFooter(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp & Reply-To Row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Timestamp
                </label>
                <Input
                  value={composerTime}
                  onChange={(e) => setComposerTime(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Reply to
                </label>
                <select
                  value={composerReplyToId}
                  onChange={(e) => setComposerReplyToId(e.target.value)}
                  className="w-full h-8 px-2 rounded-md border border-input bg-background text-xs"
                >
                  <option value="">None (Top level)</option>
                  {conv.messages
                    .filter((m: Message) => m.type !== 'system' && m.type !== 'date_separator')
                    .map((m: Message) => (
                      <option key={m.id} value={m.id}>
                        {m.text?.slice(0, 20) || m.type}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Edited Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={composerIsEdited}
                  onChange={(e) => setComposerIsEdited(e.target.checked)}
                  className="rounded border-input text-[#5865F2] focus:ring-[#5865F2]"
                />
                Mark as &quot;(edited)&quot;
              </label>
            </div>

            <Button
              type="submit"
              data-testid="add-message-btn"
              size="sm"
              className="w-full h-8 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold"
            >
              Post Message
            </Button>
          </form>

          {/* Timeline Messages List */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Channel Messages ({conv.messages.length})
            </span>

            <div className="space-y-1.5">
              {conv.messages.map((m: Message, index: number) => {
                const sender = project.cast.find((p: Participant) => p.id === m.senderId);

                return (
                  <div
                    key={m.id}
                    className="group flex items-center justify-between gap-2 p-2 rounded-lg border border-border bg-card hover:border-[#5865F2]/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[11px] font-semibold truncate"
                          style={{ color: sender?.nameColorHex || '#5865F2' }}
                        >
                          {m.type === 'system' ? 'SYSTEM' : sender?.displayName || 'User'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{m.timestampLabel}</span>
                        {m.isEdited && (
                          <span className="text-[9px] text-[#949BA4]">(edited)</span>
                        )}
                      </div>
                      <p className="text-xs text-foreground truncate mt-0.5">
                        {m.text || `[${m.type}]`}
                      </p>

                      {/* Quick Reactions */}
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
                                  ? 'border-[#5865F2] bg-[#5865F2]/20 text-[#5865F2]'
                                  : 'border-transparent hover:bg-muted text-muted-foreground'
                              )}
                            >
                              <span>{emoji}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
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
                      {m.type !== 'system' && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => switchMessageSender(m.id)}
                          title="Switch Sender"
                          aria-label="Switch sender"
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
                        aria-label="Duplicate message"
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

        {/* ================= TAB 2: SERVER & CHANNEL ================= */}
        <TabsContent value="server" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          {/* Discord Layout Mode */}
          <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
            <span className="text-xs font-semibold text-foreground block">
              Discord Interface Layout
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={
                  conv.headerState.discordLayout !== 'mobile_chat' &&
                  conv.headerState.discordLayout !== 'direct_message'
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() => updateHeaderState({ discordLayout: 'desktop_server' })}
                className={cn(
                  conv.headerState.discordLayout !== 'mobile_chat' &&
                    conv.headerState.discordLayout !== 'direct_message' &&
                    'bg-[#5865F2] hover:bg-[#4752C4] text-white',
                  'text-xs'
                )}
              >
                <Layout className="h-3.5 w-3.5 mr-1.5" /> Desktop Server
              </Button>
              <Button
                type="button"
                variant={
                  conv.headerState.discordLayout === 'mobile_chat' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => updateHeaderState({ discordLayout: 'mobile_chat' })}
                className={cn(
                  conv.headerState.discordLayout === 'mobile_chat' &&
                    'bg-[#5865F2] hover:bg-[#4752C4] text-white',
                  'text-xs'
                )}
              >
                <Smartphone className="h-3.5 w-3.5 mr-1.5" /> Mobile Chat
              </Button>
              <Button
                type="button"
                variant={
                  conv.headerState.discordLayout === 'direct_message' ? 'default' : 'outline'
                }
                size="sm"
                onClick={() => updateHeaderState({ discordLayout: 'direct_message' })}
                className={cn(
                  conv.headerState.discordLayout === 'direct_message' &&
                    'bg-[#5865F2] hover:bg-[#4752C4] text-white',
                  'text-xs'
                )}
              >
                <User className="h-3.5 w-3.5 mr-1.5" /> Direct Message
              </Button>
            </div>
          </div>

          {/* Server & Channel Details */}
          <div className="rounded-xl border border-border bg-background/50 p-3 space-y-3">
            <span className="text-xs font-semibold text-foreground block">
              Server & Channel Configuration
            </span>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Server Name
              </label>
              <Input
                value={conv.headerState.serverName || 'ChatForge Community'}
                onChange={(e) => updateHeaderState({ serverName: e.target.value })}
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Channel Name
                </label>
                <div className="relative">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                  <Input
                    value={conv.headerState.channelName || 'general'}
                    onChange={(e) => updateHeaderState({ channelName: e.target.value })}
                    className="h-8 text-xs pl-8 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Online Member Count
                </label>
                <Input
                  value={conv.headerState.onlineCountLabel || '48 Online'}
                  onChange={(e) => updateHeaderState({ onlineCountLabel: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                Channel Topic / Description
              </label>
              <Input
                value={conv.headerState.channelTopic || ''}
                onChange={(e) => updateHeaderState({ channelTopic: e.target.value })}
                placeholder="Official community discussion and roadmap"
                className="h-8 text-xs"
              />
            </div>
          </div>

          {/* Sidebars Visibility */}
          <div className="rounded-xl border border-border bg-background/50 p-3 space-y-2">
            <span className="text-xs font-semibold text-foreground block">
              Sidebar Panels (Desktop View)
            </span>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span>Left Server Icon Rail</span>
                <input
                  type="checkbox"
                  checked={conv.headerState.showServerSidebar ?? true}
                  onChange={(e) => updateHeaderState({ showServerSidebar: e.target.checked })}
                  className="rounded border-input text-[#5865F2] focus:ring-[#5865F2]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span>Channels Sidebar</span>
                <input
                  type="checkbox"
                  checked={conv.headerState.showChannelSidebar ?? true}
                  onChange={(e) => updateHeaderState({ showChannelSidebar: e.target.checked })}
                  className="rounded border-input text-[#5865F2] focus:ring-[#5865F2]"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span>Right Members List</span>
                <input
                  type="checkbox"
                  checked={conv.headerState.showMemberList ?? true}
                  onChange={(e) => updateHeaderState({ showMemberList: e.target.checked })}
                  className="rounded border-input text-[#5865F2] focus:ring-[#5865F2]"
                />
              </label>
            </div>
          </div>

          {/* Typing Preview */}
          <div className="rounded-xl border border-border bg-background/50 p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-foreground block">
                Typing Indicator
              </span>
              <p className="text-[11px] text-muted-foreground">
                Show &quot;Several people are typing...&quot; bar
              </p>
            </div>
            <input
              type="checkbox"
              checked={isTypingPreview}
              onChange={(e) => setTypingPreview(e.target.checked)}
              className="rounded border-input text-[#5865F2] focus:ring-[#5865F2] h-4 w-4"
            />
          </div>
        </TabsContent>

        {/* ================= TAB 3: MEMBERS & ROLES ================= */}
        <TabsContent value="members" className="flex-1 overflow-y-auto p-4 space-y-4 m-0">
          <div>
            <span className="text-xs font-semibold text-foreground block">
              Manage Server Members ({project.cast.length})
            </span>
            <p className="text-[11px] text-muted-foreground">
              Configure member display names, hex role colors, BOT tags, and status dots
            </p>
          </div>

          <div className="space-y-3">
            {project.cast.map((part: Participant) => (
              <div
                key={part.id}
                className="p-3 rounded-xl border border-border bg-card space-y-2.5 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs"
                      style={{ backgroundColor: part.avatarFallbackColor || '#5865F2' }}
                    >
                      {part.displayName.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <span
                        className="font-bold text-sm block leading-tight"
                        style={{ color: part.nameColorHex || '#F2F3F5' }}
                      >
                        {part.displayName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {part.handle || `@${part.displayName.toLowerCase().replace(/\s+/g, '')}`}
                      </span>
                    </div>
                  </div>

                  {part.verifiedBadge === 'bot' && (
                    <span className="px-1.5 py-0.5 rounded bg-[#5865F2] text-white font-bold text-[9px]">
                      BOT
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                    Embed Author Name
                  </label>
                  <Input
                    value={composerEmbedAuthor}
                    onChange={(e) => setComposerEmbedAuthor(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                      Display Name
                    </label>
                    <Input
                      value={part.displayName}
                      onChange={(e) =>
                        upsertParticipant({
                          ...part,
                          displayName: e.target.value,
                        })
                      }
                      className="h-7 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                      Role Title
                    </label>
                    <Input
                      value={part.roleLabel || ''}
                      onChange={(e) =>
                        upsertParticipant({
                          ...part,
                          roleLabel: e.target.value,
                        })
                      }
                      placeholder="Admin, Dev, VIP..."
                      className="h-7 text-xs"
                    />
                  </div>
                </div>

                {/* Role Color Picker */}
                <div>
                  <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                    Role Color
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {DISCORD_ROLE_COLORS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() =>
                          upsertParticipant({
                            ...part,
                            nameColorHex: col.hex,
                          })
                        }
                        title={col.name}
                        className={cn(
                          'w-5 h-5 rounded-full border transition-transform hover:scale-110',
                          part.nameColorHex === col.hex ? 'ring-2 ring-white scale-110' : 'border-black/20'
                        )}
                        style={{ backgroundColor: col.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Status Indicator & Bot Tag */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-0.5">
                      Online Status
                    </label>
                    <select
                      value={part.statusIndicator || 'online'}
                      onChange={(e) =>
                        upsertParticipant({
                          ...part,
                          statusIndicator:
                            e.target.value as 'online' | 'idle' | 'dnd' | 'offline',
                        })
                      }
                      className="w-full h-7 px-1.5 rounded border border-input bg-background text-[11px]"
                    >
                      <option value="online">Online (Green)</option>
                      <option value="idle">Idle (Yellow)</option>
                      <option value="dnd">Do Not Disturb (Red)</option>
                      <option value="offline">Invisible / Offline</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground">
                      <input
                        type="checkbox"
                        checked={part.verifiedBadge === 'bot'}
                        onChange={(e) =>
                          upsertParticipant({
                            ...part,
                            verifiedBadge: e.target.checked ? 'bot' : 'none',
                          })
                        }
                        className="rounded border-input text-[#5865F2] focus:ring-[#5865F2]"
                      />
                      APP / BOT Tag
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ================= TAB 4: PRESETS ================= */}
        <TabsContent value="presets" className="flex-1 overflow-y-auto p-4 space-y-3 m-0">
          <div>
            <span className="text-xs font-semibold text-foreground block">
              Instant Discord Scenarios
            </span>
            <p className="text-[11px] text-muted-foreground">
              One-click realistic Discord setups with accurate channels, embeds & roles
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {DISCORD_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-xl border border-border bg-card hover:border-[#5865F2] transition-all shadow-xs flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">{tpl.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5865F2]/15 text-[#5865F2]">
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
                  className="h-7 text-xs border-[#5865F2]/40 hover:bg-[#5865F2] hover:text-white transition-colors"
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
