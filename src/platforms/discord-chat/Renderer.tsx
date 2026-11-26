'use client';

import React from 'react';
import {
  Bell,
  Check,
  ChevronDown,
  Compass,
  FileText,
  Gift,
  Hash,
  HelpCircle,
  Inbox,
  Mic,
  Pin,
  Plus,
  Search,
  Settings,
  Smile,
  Users,
  Volume2,
  Headphones,
  Sparkles,
} from 'lucide-react';
import type { PlatformRendererProps } from '@/platforms/whatsapp-chat/Renderer';
import { MessageActions } from '@/components/engine';
import { cn } from '@/lib/utils';
import type { Participant } from '@/core/types';

// Discord Status Dot Component
function StatusDot({ status }: { status?: 'online' | 'idle' | 'dnd' | 'offline' }) {
  if (status === 'idle') {
    return (
      <span
        title="Idle"
        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2B2D31] flex items-center justify-center"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEE75C] clip-path-moon" />
      </span>
    );
  }
  if (status === 'dnd') {
    return (
      <span
        title="Do Not Disturb"
        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2B2D31] flex items-center justify-center"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#ED4245] flex items-center justify-center">
          <span className="w-1.5 h-0.5 bg-[#2B2D31] rounded-full" />
        </span>
      </span>
    );
  }
  if (status === 'offline') {
    return (
      <span
        title="Offline"
        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2B2D31] flex items-center justify-center"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#80848E] flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-[#2B2D31] rounded-full" />
        </span>
      </span>
    );
  }
  // Default online
  return (
    <span
      title="Online"
      className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#2B2D31] flex items-center justify-center"
    >
      <span className="w-2.5 h-2.5 rounded-full bg-[#23A55A]" />
    </span>
  );
}

// Text Highlighter for Discord Mentions and Code blocks
function renderDiscordContent(text: string) {
  if (!text) return null;

  // Split on code blocks ```code```
  const codeBlockRegex = /```([a-zA-Z]*)\n?([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderFormattedText(text.slice(lastIndex, match.index)));
    }
    const lang = match[1] || 'code';
    const code = match[2].trim();
    parts.push(
      <div
        key={`code_${match.index}`}
        data-testid="discord-code-block"
        className="my-1.5 rounded-md border border-[#2B2D31] bg-[#1E1F22] p-2.5 font-mono text-[12px] text-[#DBDEE1] overflow-x-auto shadow-2xs"
      >
        {lang && (
          <div className="mb-1 text-[10px] uppercase font-bold text-[#949BA4] select-none">
            {lang}
          </div>
        )}
        <pre className="whitespace-pre-wrap break-all leading-relaxed">{code}</pre>
      </div>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(renderFormattedText(text.slice(lastIndex)));
  }

  return parts;
}

function renderFormattedText(str: string): React.ReactNode {
  // Highlight @mentions and #channels
  const mentionRegex = /(@[a-zA-Z0-9_.-]+|#[a-zA-Z0-9_.-]+)/g;
  const tokens = str.split(mentionRegex);

  return (
    <span key={str}>
      {tokens.map((token, i) => {
        if (token.startsWith('@')) {
          return (
            <span
              key={i}
              data-testid="discord-mention"
              className="rounded bg-[#5865F2]/20 px-1 py-0.5 font-medium text-[#C9CDFB] hover:bg-[#5865F2]/30 cursor-pointer transition-colors"
            >
              {token}
            </span>
          );
        }
        if (token.startsWith('#')) {
          return (
            <span
              key={i}
              className="rounded bg-[#5865F2]/15 px-1 py-0.5 font-medium text-[#C9CDFB] hover:bg-[#5865F2]/25 cursor-pointer transition-colors"
            >
              {token}
            </span>
          );
        }
        return token;
      })}
    </span>
  );
}

export function DiscordChatRenderer({
  conversation,
  participantsById,
  theme,
  visibleMessageCount,
  selectedMessageId,
  isTypingPreview,
  onSelectMessage,
  onDuplicateMessage,
  onSwitchSender,
  onDeleteMessage,
}: PlatformRendererProps) {
  const dark = theme.colorScheme !== 'light';
  const layout = conversation.headerState.discordLayout || 'desktop_server';
  const isMobile = layout === 'mobile_chat';
  const isDM = layout === 'direct_message';

  const serverName = conversation.headerState.serverName || 'ChatForge Community';
  const channelName =
    conversation.headerState.channelName ||
    conversation.groupMeta?.groupName?.replace(/^#/, '') ||
    'launch-weekend';
  const channelTopic =
    conversation.headerState.channelTopic ||
    'Official discussion, release updates & community roadmap';

  const messages = conversation.messages.slice(0, visibleMessageCount);
  const msgById = Object.fromEntries(conversation.messages.map((m) => [m.id, m]));

  const showServerRail =
    !isMobile && (conversation.headerState.showServerSidebar ?? true);
  const showChannelSidebar =
    !isMobile && (conversation.headerState.showChannelSidebar ?? true);
  const showMemberList =
    !isMobile && (conversation.headerState.showMemberList ?? true);

  // Cast array
  const participants = conversation.participantIds
    .map((id) => participantsById[id])
    .filter(Boolean) as Participant[];

  const selfParticipant =
    participantsById[conversation.selfParticipantId] || participants[0];

  return (
    <div
      data-testid="renderer-discord-chat"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[580px] w-full font-sans select-none overflow-hidden rounded-xl shadow-lg border border-black/10',
        dark ? 'bg-[#313338] text-[#DBDEE1]' : 'bg-white text-slate-800'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      {/* 1. Server Icon Rail (Desktop only) */}
      {showServerRail && (
        <div
          data-testid="discord-server-rail"
          className="w-[72px] shrink-0 bg-[#1E1F22] py-3 flex flex-col items-center gap-2 border-r border-[#17181B]"
        >
          {/* Discord Home Pill */}
          <div className="relative group flex items-center justify-center w-full">
            <div className="w-12 h-12 rounded-[24px] group-hover:rounded-[16px] bg-[#5865F2] text-white flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>

          <div className="w-8 h-[2px] bg-[#35363C] rounded-full my-0.5" />

          {/* Active Server Icon */}
          <div className="relative group flex items-center justify-center w-full">
            {/* White pill indicator */}
            <div className="absolute left-0 w-1 h-10 bg-white rounded-r-full" />
            {conversation.headerState.serverIconDataUrl ? (
              <img
                src={conversation.headerState.serverIconDataUrl}
                alt={serverName}
                className="w-12 h-12 rounded-[16px] object-cover cursor-pointer shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-tr from-[#5865F2] to-[#7983F5] text-white font-bold flex items-center justify-center text-sm cursor-pointer shadow-md">
                {serverName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* Add Server & Explore */}
          <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-[#23A55A] text-[#23A55A] hover:text-white flex items-center justify-center cursor-pointer transition-all duration-200">
            <Plus className="h-6 w-6" />
          </div>
          <div className="w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] hover:bg-[#5865F2] text-[#DBDEE1] hover:text-white flex items-center justify-center cursor-pointer transition-all duration-200">
            <Compass className="h-5 w-5" />
          </div>
        </div>
      )}

      {/* 2. Channel Sidebar (Desktop only) */}
      {showChannelSidebar && (
        <div
          data-testid="discord-channel-sidebar"
          className="w-60 shrink-0 bg-[#2B2D31] flex flex-col border-r border-[#1E1F22] select-none"
        >
          {/* Server Header Dropdown */}
          <div className="h-12 border-b border-[#1E1F22] px-4 flex items-center justify-between font-bold text-[15px] text-white hover:bg-white/5 cursor-pointer transition-colors">
            <span className="truncate">{serverName}</span>
            <ChevronDown className="h-4 w-4 opacity-75 shrink-0" />
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
            {/* Text Channels Category */}
            <div>
              <div className="flex items-center justify-between px-2 text-[11px] font-bold text-[#949BA4] uppercase tracking-wider mb-1">
                <span>Text Channels</span>
                <Plus className="h-3.5 w-3.5 hover:text-white cursor-pointer" />
              </div>
              <div className="space-y-0.5">
                {['announcements', channelName, 'general', 'showcase'].map((ch, idx) => {
                  const isActive = ch === channelName;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors',
                        isActive
                          ? 'bg-[#35373C] text-white font-medium'
                          : 'text-[#949BA4] hover:bg-white/5 hover:text-[#DBDEE1]'
                      )}
                    >
                      <Hash className="h-4 w-4 shrink-0 text-[#80848E]" />
                      <span className="truncate">{ch}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Voice Channels Category */}
            <div>
              <div className="flex items-center justify-between px-2 text-[11px] font-bold text-[#949BA4] uppercase tracking-wider mb-1">
                <span>Voice Channels</span>
                <Plus className="h-3.5 w-3.5 hover:text-white cursor-pointer" />
              </div>
              <div className="space-y-0.5">
                {['General Voice', 'Dev Sync'].map((vc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[#949BA4] hover:bg-white/5 hover:text-[#DBDEE1] cursor-pointer"
                  >
                    <Volume2 className="h-4 w-4 shrink-0 text-[#80848E]" />
                    <span className="truncate">{vc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Mini-Profile Footer */}
          <div className="h-[52px] bg-[#232428] px-2 flex items-center justify-between border-t border-[#1E1F22]">
            <div className="flex items-center gap-2 min-w-0 flex-1 hover:bg-white/5 p-1 rounded-md cursor-pointer">
              <div className="relative shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs"
                  style={{ backgroundColor: selfParticipant?.avatarFallbackColor || '#5865F2' }}
                >
                  {selfParticipant?.displayName.slice(0, 1).toUpperCase() || 'U'}
                </div>
                <StatusDot status={selfParticipant?.statusIndicator || 'online'} />
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-xs font-semibold text-white truncate">
                  {selfParticipant?.displayName || 'You'}
                </p>
                <p className="text-[10px] text-[#949BA4] truncate">
                  {selfParticipant?.handle || 'online'}
                </p>
              </div>
            </div>
            <div className="flex items-center text-[#B5BAC1]">
              <button
                type="button"
                className="p-1.5 hover:text-white rounded hover:bg-white/5 transition-colors"
                aria-label="Mute"
              >
                <Mic className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:text-white rounded hover:bg-white/5 transition-colors"
                aria-label="Deafen"
              >
                <Headphones className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:text-white rounded hover:bg-white/5 transition-colors"
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Chat View */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#313338]">
        {/* Channel Top Header */}
        <div
          data-testid="discord-channel-header"
          className="h-12 border-b border-[#1F2023] px-4 flex items-center justify-between shrink-0 shadow-xs"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-3">
            {isDM ? (
              <span className="font-bold text-white text-[15px] flex items-center gap-1.5">
                <span className="text-[#80848E]">@</span> {conversation.title || 'Direct Message'}
              </span>
            ) : (
              <>
                <Hash className="h-6 w-6 text-[#80848E] shrink-0" />
                <span
                  data-testid="discord-channel-name"
                  className="font-bold text-white text-[15px] shrink-0"
                >
                  {channelName}
                </span>
                <span className="w-[1px] h-4 bg-[#4E5058] mx-1 shrink-0" />
                <span
                  data-testid="discord-channel-topic"
                  className="text-xs text-[#949BA4] inline-block shrink-0 max-w-[260px] truncate"
                >
                  {channelTopic}
                </span>
              </>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-3 text-[#B5BAC1]">
            <button
              type="button"
              className="p-1 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-1 hover:text-white transition-colors"
              aria-label="Pinned Messages"
            >
              <Pin className="h-4 w-4" />
            </button>
            {!isMobile && (
              <button
                type="button"
                className="p-1 hover:text-white transition-colors"
                aria-label="Toggle Member List"
              >
                <Users className="h-4 w-4" />
              </button>
            )}
            <div className="relative hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search"
                readOnly
                className="w-36 h-6 px-2 pr-6 rounded bg-[#1E1F22] text-xs text-[#DBDEE1] placeholder-[#949BA4] border-0 outline-hidden select-none"
              />
              <Search className="h-3.5 w-3.5 text-[#949BA4] absolute right-1.5 pointer-events-none" />
            </div>
            <button
              type="button"
              className="p-1 hover:text-white transition-colors"
              aria-label="Inbox"
            >
              <Inbox className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-1 hover:text-white transition-colors"
              aria-label="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Feed Canvas */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m) => {
            // System Notification (Welcome, Boost, etc.)
            if (m.type === 'system') {
              return (
                <div
                  key={m.id}
                  data-testid="discord-system-message"
                  className="flex items-center gap-2.5 py-1 text-sm text-[#949BA4] pl-2 border-l-2 border-[#5865F2]"
                >
                  <span className="text-amber-400 font-bold">→</span>
                  <span className="leading-snug">{m.text}</span>
                  <span className="text-[11px] opacity-60 ml-auto shrink-0">
                    {m.timestampLabel}
                  </span>
                </div>
              );
            }

            if (m.type === 'date_separator') {
              return (
                <div key={m.id} className="relative flex items-center justify-center my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#3F4147]" />
                  </div>
                  <span className="relative px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#313338] text-[#949BA4]">
                    {m.text || 'Today'}
                  </span>
                </div>
              );
            }

            const sender = participantsById[m.senderId];
            const isSelected = selectedMessageId === m.id;
            const replyTarget = m.replyToMessageId ? msgById[m.replyToMessageId] : undefined;
            const replySender = replyTarget ? participantsById[replyTarget.senderId] : undefined;
            const isBot = sender?.roleLabel === 'BOT' || sender?.verifiedBadge === 'bot';

            return (
              <div
                key={m.id}
                className={cn(
                  'group relative -mx-4 px-4 py-1 hover:bg-[#2E3035] transition-colors',
                  isSelected && 'bg-[#2E3035] ring-1 ring-[#5865F2]'
                )}
              >
                {/* Context Menu Actions */}
                <MessageActions
                  visible={isSelected}
                  onDuplicate={() => onDuplicateMessage?.(m.id)}
                  onSwitchSender={() => onSwitchSender?.(m.id)}
                  onDelete={() => onDeleteMessage?.(m.id)}
                />

                {/* Reply Spine Indicator */}
                {replyTarget && (
                  <div
                    data-testid="discord-reply-spine"
                    className="flex items-center gap-1.5 text-xs text-[#B5BAC1] mb-1 pl-7 relative"
                  >
                    <div className="absolute left-2.5 top-2 w-3.5 h-3 border-l-2 border-t-2 border-[#4E5058] rounded-tl" />
                    <div className="w-4 h-4 rounded-full bg-[#5865F2] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
                      {(replySender?.displayName || 'U').slice(0, 1)}
                    </div>
                    <span
                      className="font-semibold text-xs hover:underline cursor-pointer"
                      style={{ color: replySender?.nameColorHex || '#F2F3F5' }}
                    >
                      @{replySender?.displayName || 'member'}
                    </span>
                    <span className="truncate opacity-75 max-w-[320px]">
                      {replyTarget.text || 'Attachment'}
                    </span>
                  </div>
                )}

                <div
                  onClick={() => onSelectMessage(m.id)}
                  className="flex items-start gap-4 cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    {sender?.avatarDataUrl ? (
                      <img
                        src={sender.avatarDataUrl}
                        alt={sender.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-xs"
                        style={{
                          backgroundColor: sender?.avatarFallbackColor || '#5865F2',
                        }}
                      >
                        {(sender?.displayName || 'U').slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <StatusDot status={sender?.statusIndicator || 'online'} />
                  </div>

                  {/* Header Row & Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap leading-none mb-1">
                      {/* Display Name with Role Color */}
                      <span
                        data-testid="discord-author-name"
                        className="font-medium text-[15px] hover:underline cursor-pointer tracking-tight"
                        style={{ color: sender?.nameColorHex || '#F2F3F5' }}
                      >
                        {sender?.displayName || 'Member'}
                      </span>

                      {/* APP / BOT Badge */}
                      {isBot && (
                        <span
                          data-testid="discord-bot-badge"
                          className="px-1 py-0.5 rounded bg-[#5865F2] text-white font-bold text-[10px] flex items-center gap-0.5 leading-none select-none"
                        >
                          <Check className="h-2.5 w-2.5 stroke-[3]" /> BOT
                        </span>
                      )}

                      {/* Role Badge */}
                      {sender?.roleLabel && !isBot && (
                        <span
                          data-testid="discord-role-badge"
                          className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white/10 text-[#DBDEE1]"
                        >
                          {sender.roleLabel}
                        </span>
                      )}

                      {/* Timestamp */}
                      <span className="text-[11px] text-[#949BA4] ml-1 select-none">
                        {m.timestampLabel}
                      </span>
                    </div>

                    {/* Message Text with Mentions & Code Blocks */}
                    {m.text && (
                      <div className="text-[14.5px] leading-relaxed text-[#DBDEE1] whitespace-pre-wrap break-words">
                        {renderDiscordContent(m.text)}
                        {m.isEdited && (
                          <span
                            data-testid="discord-edited-label"
                            className="text-[10px] text-[#949BA4] ml-1.5 select-none"
                          >
                            (edited)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Attachments: Embeds, Photos, Videos */}
                    {m.attachments.map((att) => {
                      // Discord Rich Embed
                      if (att.discordEmbedMeta) {
                        const embed = att.discordEmbedMeta;
                        return (
                          <div
                            key={att.id}
                            data-testid="discord-embed"
                            className="my-2 max-w-[520px] rounded-r-md border border-[#2B2D31] bg-[#2B2D31]/80 p-3.5 shadow-sm text-xs space-y-2 border-l-4"
                            style={{ borderLeftColor: embed.colorHex || '#5865F2' }}
                          >
                            {embed.authorName && (
                              <div className="flex items-center gap-2">
                                {embed.authorAvatarUrl && (
                                  <img
                                    src={embed.authorAvatarUrl}
                                    alt={embed.authorName}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                )}
                                <span className="font-semibold text-white text-[12px]">
                                  {embed.authorName}
                                </span>
                              </div>
                            )}

                            <h4 className="font-bold text-white text-[14px] leading-snug hover:underline cursor-pointer">
                              {embed.title}
                            </h4>

                            <p className="text-[#DBDEE1] text-[13px] leading-relaxed whitespace-pre-wrap">
                              {embed.description}
                            </p>

                            {/* Embed Fields */}
                            {embed.fields && embed.fields.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
                                {embed.fields.map((f, idx) => (
                                  <div key={idx} className="min-w-0">
                                    <span className="font-bold text-[11px] text-[#949BA4] block uppercase">
                                      {f.name}
                                    </span>
                                    <span className="text-[12px] font-medium text-white block mt-0.5">
                                      {f.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {embed.footerText && (
                              <div className="text-[11px] text-[#949BA4] pt-1">
                                {embed.footerText}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Photo Attachment
                      if (att.kind === 'image') {
                        return (
                          <div
                            key={att.id}
                            className="my-1.5 rounded-lg overflow-hidden max-w-[420px]"
                          >
                            {att.previewDataUrl ? (
                              <img
                                src={att.previewDataUrl}
                                alt="Discord image attachment"
                                className="w-full h-auto max-h-[300px] object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-full h-44 bg-gradient-to-tr from-[#5865F2] to-[#7983F5] rounded-lg flex items-center justify-center text-white font-medium text-xs">
                                Image Attachment
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Document File Card
                      if (att.kind === 'document') {
                        return (
                          <div
                            key={att.id}
                            className="my-1.5 flex items-center gap-3 p-3 rounded-lg border border-[#2B2D31] bg-[#2B2D31] max-w-[340px]"
                          >
                            <FileText className="h-8 w-8 text-[#5865F2] shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-white text-xs block truncate hover:underline cursor-pointer">
                                {att.fileName || 'document.pdf'}
                              </span>
                              <span className="text-[11px] text-[#949BA4] block">
                                {att.fileSizeBytes
                                  ? `${(att.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
                                  : '1.8 MB'}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}

                    {/* Reaction Counter Pills */}
                    {m.reactions && m.reactions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {m.reactions.map((r, idx) => (
                          <div
                            key={idx}
                            data-testid="discord-reaction-pill"
                            className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#3F4147] bg-[#2B2D31] hover:bg-[#35373C] cursor-pointer transition-colors text-xs select-none"
                          >
                            <span className="text-sm">{r.emoji}</span>
                            <span className="text-[11px] font-semibold text-[#DBDEE1]">
                              {r.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTypingPreview && (
            <div
              data-testid="discord-typing-indicator"
              className="flex items-center gap-1.5 text-xs text-[#949BA4] py-1 select-none"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#949BA4] animate-bounce" />
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#949BA4] animate-bounce"
                style={{ animationDelay: '0.15s' }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-[#949BA4] animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
              <span className="font-semibold text-white ml-1">Several people</span> are typing...
            </div>
          )}
        </div>

        {/* Bottom Message Input Bar */}
        <div
          data-testid="discord-composer"
          className="px-4 pb-4 pt-1 shrink-0 select-none"
        >
          <div className="h-11 rounded-lg bg-[#383A40] px-4 flex items-center justify-between text-[#B5BAC1]">
            <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
              <button
                type="button"
                className="w-6 h-6 rounded-full bg-[#4E5058] hover:bg-[#6D6F78] text-white flex items-center justify-center shrink-0 transition-colors"
                aria-label="Add Attachment"
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="text-[14px] text-[#949BA4] truncate">
                Message #{channelName}
              </span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                className="hover:text-white transition-colors"
                aria-label="Send Gift"
              >
                <Gift className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="hover:text-white text-xs font-bold px-1 rounded hover:bg-white/10"
                aria-label="GIF"
              >
                GIF
              </button>
              <button
                type="button"
                className="hover:text-white transition-colors"
                aria-label="Add Emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Member List Sidebar (Desktop only) */}
      {showMemberList && (
        <div
          data-testid="discord-member-list"
          className="w-60 shrink-0 bg-[#2B2D31] flex flex-col border-l border-[#1E1F22] px-3 py-4 overflow-y-auto select-none"
        >
          {/* Online Role Category */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-[#949BA4] uppercase tracking-wider block mb-2 px-1">
              Online — {participants.length}
            </span>
            <div className="space-y-1">
              {participants.map((part) => (
                <div
                  key={part.id}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="relative shrink-0">
                    {part.avatarDataUrl ? (
                      <img
                        src={part.avatarDataUrl}
                        alt={part.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs"
                        style={{ backgroundColor: part.avatarFallbackColor || '#5865F2' }}
                      >
                        {part.displayName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <StatusDot status={part.statusIndicator || 'online'} />
                  </div>
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="flex items-center gap-1">
                      <span
                        className="text-xs font-semibold truncate"
                        style={{ color: part.nameColorHex || '#F2F3F5' }}
                      >
                        {part.displayName}
                      </span>
                      {part.verifiedBadge === 'bot' && (
                        <span className="px-1 py-0.2 rounded bg-[#5865F2] text-white font-bold text-[8px] leading-none">
                          BOT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#949BA4] block truncate">
                      {part.customStatus || part.roleLabel || 'Exploring ChatForge'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
