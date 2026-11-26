'use client';

import React from 'react';
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronLeft,
  FileText,
  MapPin,
  MoreVertical,
  Music,
  Paperclip,
  Phone,
  Pin,
  Play,
  Search,
  Send,
  Smile,
  Video,
} from 'lucide-react';
import type { PlatformRendererProps } from '@/platforms/whatsapp-chat/Renderer';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { MessageActions } from '@/components/engine';
import { cn } from '@/lib/utils';
import type { Participant } from '@/core/types';

const TELEGRAM_SENDER_COLORS = [
  '#3390EC', // Telegram Classic Blue
  '#4EA646', // Telegram Green
  '#E56B24', // Telegram Orange
  '#9A56E2', // Telegram Purple
  '#DE4848', // Telegram Red
  '#2AABEE', // Telegram Cyan
  '#CC8200', // Telegram Amber
];

function getTelegramSenderColor(id: string, name?: string): string {
  const str = name || id;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % TELEGRAM_SENDER_COLORS.length;
  return TELEGRAM_SENDER_COLORS[idx];
}

export function TelegramChatRenderer({
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
  const dark = theme.colorScheme === 'dark' || theme.colorScheme === 'dim';
  const isGroup =
    conversation.mode === 'group' ||
    Boolean(conversation.groupMeta?.groupName) ||
    conversation.participantIds.length > 2;

  const otherParticipant =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const headerTitle = isGroup
    ? conversation.groupMeta?.groupName || conversation.title || 'Telegram Group'
    : otherParticipant?.displayName || 'Contact';

  const memberCount =
    conversation.groupMeta?.memberCountOverride ?? conversation.participantIds.length;

  const headerSubtitle = isTypingPreview
    ? 'typing...'
    : isGroup
      ? conversation.headerState.telegramMembersCountLabel || `${memberCount} members, 3 online`
      : conversation.headerState.statusText || 'online';

  const messages = conversation.messages.slice(0, visibleMessageCount);
  const msgById = Object.fromEntries(conversation.messages.map((m) => [m.id, m]));

  const showPinnedBar =
    conversation.headerState.showPinnedBar !== false &&
    Boolean(conversation.headerState.pinnedBarText);

  const pinnedBarTitle = conversation.headerState.pinnedBarTitle || 'Pinned Message';
  const pinnedBarText =
    conversation.headerState.pinnedBarText ||
    'Release candidate build #304 ready for QA';

  // Palette mappings
  const isAndroid = theme.deviceType === 'android' || theme.osVariant === 'android';
  const headerBg = dark
    ? isAndroid
      ? 'bg-[#17212B] text-white'
      : 'bg-[#1C1C1E]/90 text-white backdrop-blur-md border-b border-white/10'
    : isAndroid
      ? 'bg-[#517DA2] text-white'
      : 'bg-[#F8F9FA]/90 text-slate-950 backdrop-blur-md border-b border-slate-200/80';
  const pinnedBarBg = dark
    ? 'bg-[#1E2C3A] border-[#2B3B4C] text-slate-200'
    : 'bg-[#F4F4F5] border-black/5 text-slate-800';

  const avatarNode = (
    <div className="relative shrink-0">
      {isGroup ? (
        conversation.groupMeta?.groupAvatarDataUrl ? (
          <img
            src={conversation.groupMeta.groupAvatarDataUrl}
            alt={headerTitle}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#3390EC] to-[#2AABEE] text-sm font-bold text-white shadow-xs">
            {headerTitle.slice(0, 2).toUpperCase()}
          </div>
        )
      ) : otherParticipant?.avatarDataUrl ? (
        <img
          src={otherParticipant.avatarDataUrl}
          alt={headerTitle}
          className="h-9 w-9 rounded-full object-cover"
        />
      ) : (
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-xs"
          style={{
            backgroundColor:
              otherParticipant?.avatarFallbackColor ||
              getTelegramSenderColor(otherParticipant?.id || 'contact', headerTitle),
          }}
        >
          {headerTitle.slice(0, 1).toUpperCase()}
        </div>
      )}
    </div>
  );

  return (
    <div
      data-testid="renderer-telegram-chat"
      data-device-type={isAndroid ? 'android' : 'iphone'}
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[600px] flex-1 flex-col font-sans select-none',
        dark
          ? 'telegram-wallpaper-dark text-slate-100'
          : 'telegram-wallpaper-light text-slate-900'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      {/* 1. Status Bar */}
      <StatusBar
        statusBar={theme.statusBar}
        osVariant={isAndroid ? 'android' : 'ios'}
        darkBg={dark || isAndroid}
        className={cn(
          dark
            ? isAndroid
              ? 'bg-[#17212B] text-white'
              : 'bg-[#1C1C1E]/90 text-white'
            : isAndroid
              ? 'bg-[#517DA2] text-white'
              : 'bg-[#F8F9FA]/90 text-slate-950'
        )}
      />

      {/* 2. Telegram Header (iOS: < Back left, Title centered, Avatar right | Android: <- + Avatar + Title left) */}
      {isAndroid ? (
        <div
          data-testid="telegram-header"
          className={cn('flex items-center justify-between px-3 py-2 transition-colors', headerBg)}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              className="-ml-1 rounded-full p-1 text-white/90 transition-colors hover:text-white"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {avatarNode}

            <div className="flex min-w-0 flex-col leading-tight">
              <div className="flex items-center gap-1.5">
                <span
                  data-testid="telegram-title"
                  className="truncate text-[15px] font-semibold tracking-tight text-white"
                >
                  {headerTitle}
                </span>
                {otherParticipant?.verifiedBadge && otherParticipant.verifiedBadge !== 'none' && (
                  <span
                    title="Verified Account"
                    className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#3390EC]"
                  >
                    ✓
                  </span>
                )}
              </div>
              <span
                data-testid="telegram-subtitle"
                className={cn(
                  'truncate text-[12px]',
                  headerSubtitle === 'online' || isTypingPreview
                    ? 'font-medium text-[#87D4FF]'
                    : 'text-white/75'
                )}
              >
                {headerSubtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/90">
            {!isGroup && (
              <button
                type="button"
                className="rounded-full p-1 transition-colors hover:text-white"
                aria-label="Voice Call"
              >
                <Phone className="h-4 w-4" />
              </button>
            )}
            {!isGroup && (
              <button
                type="button"
                className="rounded-full p-1 transition-colors hover:text-white"
                aria-label="Video Call"
              >
                <Video className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              className="rounded-full p-1 transition-colors hover:text-white"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full p-1 transition-colors hover:text-white"
              aria-label="More Options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="telegram-header"
          className={cn('flex items-center justify-between px-3 py-2 transition-colors', headerBg)}
        >
          <button
            type="button"
            className="flex items-center gap-0.5 text-[14px] font-medium text-[#007AFF]"
            aria-label="Back"
          >
            <ChevronLeft className="-ml-1 h-5 w-5 stroke-[2.3]" />
            <span>Chats</span>
          </button>

          <div className="flex min-w-0 max-w-[56%] flex-col items-center text-center leading-tight">
            <div className="flex items-center gap-1">
              <span
                data-testid="telegram-title"
                className="truncate text-[15px] font-semibold tracking-tight"
              >
                {headerTitle}
              </span>
              {otherParticipant?.verifiedBadge && otherParticipant.verifiedBadge !== 'none' && (
                <span
                  title="Verified Account"
                  className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#3390EC] text-[9px] font-bold text-white"
                >
                  ✓
                </span>
              )}
            </div>
            <span
              data-testid="telegram-subtitle"
              className={cn(
                'truncate text-[11px]',
                headerSubtitle === 'online' || isTypingPreview
                  ? 'font-medium text-[#007AFF]'
                  : 'opacity-60'
              )}
            >
              {headerSubtitle}
            </span>
          </div>

          <div className="flex items-center gap-2">{avatarNode}</div>
        </div>
      )}

      {/* 3. Telegram Pinned Message Bar */}
      {showPinnedBar && (
        <div
          data-testid="telegram-pinned-bar"
          className={cn(
            'flex items-center justify-between px-3 py-1.5 border-b backdrop-blur-xs transition-colors',
            pinnedBarBg
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-[3px] h-7 bg-[#3390EC] rounded-full shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-[#3390EC] flex items-center gap-1">
                <Pin className="h-3 w-3 inline rotate-45" /> {pinnedBarTitle}
              </span>
              <span className="text-[12px] truncate opacity-90 leading-tight">
                {pinnedBarText}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="p-1 opacity-60 hover:opacity-100 rounded-full shrink-0 transition-opacity"
            aria-label="View Pinned Message"
          >
            <Pin className="h-3.5 w-3.5 rotate-45" />
          </button>
        </div>
      )}

      {/* 4. Messages Canvas */}
      <div className="flex-1 space-y-2 px-3 py-3 overflow-y-auto">
        {messages.map((m) => {
          // Date Separator
          if (m.type === 'date_separator') {
            return (
              <div
                key={m.id}
                data-testid="telegram-date-separator"
                className="flex justify-center my-2"
              >
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/30 dark:bg-black/50 text-white backdrop-blur-xs shadow-xs">
                  {m.text || m.timestampLabel || 'Today'}
                </span>
              </div>
            );
          }

          // System notification (group join, pinned message, admin changes)
          if (m.type === 'system') {
            return (
              <div
                key={m.id}
                data-testid="telegram-system-message"
                className="flex justify-center my-2 text-center"
              >
                <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-black/30 dark:bg-black/50 text-white backdrop-blur-xs shadow-xs max-w-[85%] leading-snug">
                  {m.text}
                </span>
              </div>
            );
          }

          const isSelf = m.senderId === conversation.selfParticipantId;
          const sender: Participant | undefined = participantsById[m.senderId];
          const isSelected = selectedMessageId === m.id;
          const replyTarget = m.replyToMessageId ? msgById[m.replyToMessageId] : undefined;
          const replySender = replyTarget ? participantsById[replyTarget.senderId] : undefined;
          const senderColor = getTelegramSenderColor(
            sender?.id || 'contact',
            sender?.displayName || 'User'
          );

          const hasSticker = m.type === 'sticker' || m.attachments.some((a) => a.kind === 'sticker');
          const stickerAttachment = m.attachments.find((a) => a.kind === 'sticker');

          return (
            <div
              key={m.id}
              className={cn(
                'group relative flex flex-col',
                isSelf ? 'items-end' : 'items-start'
              )}
            >
              {/* Context Actions */}
              <MessageActions
                visible={isSelected}
                onDuplicate={() => onDuplicateMessage?.(m.id)}
                onSwitchSender={() => onSwitchSender?.(m.id)}
                onDelete={() => onDeleteMessage?.(m.id)}
              />

              <div className="flex items-end gap-1.5 max-w-[86%] sm:max-w-[78%]">
                {/* Group Sender Avatar (Incoming only) */}
                {isGroup && !isSelf && (
                  <div className="shrink-0 mb-0.5">
                    {sender?.avatarDataUrl ? (
                      <img
                        src={sender.avatarDataUrl}
                        alt={sender.displayName}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center font-bold text-white text-[11px] shadow-xs"
                        style={{
                          backgroundColor: sender?.avatarFallbackColor || senderColor,
                        }}
                      >
                        {(sender?.displayName || 'U').slice(0, 1).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                {/* Sticker vs Standard Bubble */}
                {hasSticker ? (
                  <div
                    data-testid="telegram-sticker"
                    onClick={() => onSelectMessage(m.id)}
                    className={cn(
                      'cursor-pointer transition-transform hover:scale-105 p-1',
                      isSelected && 'ring-2 ring-[#3390EC] rounded-xl'
                    )}
                  >
                    {stickerAttachment?.previewDataUrl ? (
                      <img
                        src={stickerAttachment.previewDataUrl}
                        alt="Sticker"
                        className="w-32 h-32 object-contain filter drop-shadow-md"
                      />
                    ) : (
                      <div className="text-6xl p-2 select-none filter drop-shadow-md">
                        {stickerAttachment?.caption || m.text || '🎉'}
                      </div>
                    )}
                    {/* Timestamp for sticker */}
                    <div className="flex justify-end pr-1 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-black/40 text-white backdrop-blur-xs">
                        {m.timestampLabel}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => onSelectMessage(m.id)}
                    className={cn(
                      'relative px-3 py-1.5 cursor-pointer shadow-xs transition-shadow',
                      // Telegram signature rounded corner tails
                      isSelf
                        ? dark
                          ? 'rounded-2xl rounded-br-[4px] bg-[#2B5278] text-white'
                          : 'rounded-2xl rounded-br-[4px] bg-[#EEFFDE] text-[#000000]'
                        : dark
                          ? 'rounded-2xl rounded-bl-[4px] bg-[#182533] text-[#F1F5F9]'
                          : 'rounded-2xl rounded-bl-[4px] bg-white text-[#000000]',
                      isSelected && 'ring-2 ring-[#3390EC]'
                    )}
                  >
                    {/* Forwarded Header */}
                    {m.forwardedLabel && m.forwardedLabel !== 'none' && (
                      <div
                        data-testid="telegram-forwarded-label"
                        className="mb-1 text-[11px] text-[#3390EC] font-medium italic flex items-center gap-1"
                      >
                        <span>Forwarded from {sender?.displayName || 'User'}</span>
                      </div>
                    )}

                    {/* Group Sender Name & Admin Badge */}
                    {isGroup && !isSelf && (
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="text-[12px] font-semibold leading-tight"
                          style={{ color: senderColor }}
                        >
                          {sender?.displayName || 'Contact'}
                        </span>
                        {sender?.isAdmin && (
                          <span className="text-[9px] uppercase tracking-wider font-bold px-1 py-0.2 rounded bg-black/10 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                            admin
                          </span>
                        )}
                      </div>
                    )}

                    {/* Reply Quote Block */}
                    {replyTarget && (
                      <div
                        data-testid="telegram-reply-quote"
                        className={cn(
                          'flex items-center gap-2 px-2 py-1 mb-1.5 rounded border-l-[3px] text-xs',
                          'border-[#3390EC]',
                          dark ? 'bg-black/20' : 'bg-black/5'
                        )}
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-[11px] text-[#3390EC] leading-tight">
                            {replySender?.displayName ||
                              (replyTarget.senderId === conversation.selfParticipantId
                                ? 'You'
                                : 'Contact')}
                          </span>
                          <span className="truncate opacity-80 text-[11px] leading-tight">
                            {replyTarget.text || 'Attachment'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Attachments */}
                    {m.attachments.map((att) => {
                      // Voice note
                      if (att.kind === 'voice_note') {
                        const dur = att.durationSeconds ?? 18;
                        const mins = Math.floor(dur / 60);
                        const secs = dur % 60;
                        const durStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
                        return (
                          <div
                            key={att.id}
                            data-testid="telegram-voice-note"
                            className="flex items-center gap-2.5 py-1 min-w-[210px]"
                          >
                            <button
                              type="button"
                              className="w-9 h-9 rounded-full bg-[#3390EC] text-white flex items-center justify-center shrink-0 shadow-xs hover:opacity-95 transition-opacity"
                              aria-label="Play Voice Note"
                            >
                              <Play className="h-4 w-4 fill-white ml-0.5" />
                            </button>
                            <div className="flex-1 flex flex-col justify-center">
                              {/* Waveform */}
                              <div className="flex items-center gap-[2px] h-5">
                                {(
                                  att.voiceNoteMeta?.waveformPeaks || [
                                    0.4, 0.7, 0.5, 0.9, 0.65, 0.4, 0.85, 0.6, 0.5, 0.95, 0.7,
                                    0.45, 0.8, 0.55, 0.35, 0.6, 0.75, 0.5,
                                  ]
                                ).map((peak, idx) => (
                                  <div
                                    key={idx}
                                    className="w-[3px] rounded-full bg-[#3390EC]"
                                    style={{
                                      height: `${Math.max(4, peak * 20)}px`,
                                      opacity: idx < 6 ? 1 : 0.4,
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] opacity-75 mt-0.5">{durStr}</span>
                            </div>
                          </div>
                        );
                      }

                      // Audio / Music Track
                      if (att.kind === 'audio') {
                        return (
                          <div
                            key={att.id}
                            data-testid="telegram-audio-card"
                            className="flex items-center gap-2.5 py-1 min-w-[220px]"
                          >
                            <div className="w-9 h-9 rounded-full bg-[#3390EC] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Music className="h-4 w-4" />
                            </div>
                            <div className="flex-1 flex flex-col min-w-0">
                              <span className="text-[12px] font-semibold truncate leading-tight">
                                {att.audioMeta?.trackTitle || att.fileName || 'Audio Track.mp3'}
                              </span>
                              <span className="text-[11px] opacity-75 truncate leading-tight">
                                {att.audioMeta?.artistName || 'Audio Recording'} • 2:45
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Document PDF / File
                      if (att.kind === 'document') {
                        return (
                          <div
                            key={att.id}
                            data-testid="telegram-document-card"
                            className="flex items-center gap-2.5 py-1 min-w-[220px]"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#3390EC] text-white flex items-center justify-center shrink-0 shadow-xs">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 flex flex-col min-w-0">
                              <span className="text-[12px] font-semibold truncate leading-tight">
                                {att.fileName || 'Document.pdf'}
                              </span>
                              <span className="text-[11px] opacity-70 leading-tight">
                                {att.fileSizeBytes
                                  ? `${(att.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
                                  : '2.4 MB'}{' '}
                                • PDF
                              </span>
                            </div>
                          </div>
                        );
                      }

                      // Image Attachment
                      if (att.kind === 'image') {
                        return (
                          <div key={att.id} className="my-1 rounded-xl overflow-hidden max-w-[280px]">
                            {att.previewDataUrl ? (
                              <img
                                src={att.previewDataUrl}
                                alt="Shared photo"
                                className="w-full h-auto max-h-[260px] object-cover rounded-xl"
                              />
                            ) : (
                              <div className="w-full h-40 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium text-xs">
                                Photo Attachment
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Video Preview
                      if (att.kind === 'video_preview') {
                        return (
                          <div
                            key={att.id}
                            className="relative my-1 rounded-xl overflow-hidden max-w-[280px]"
                          >
                            {att.previewDataUrl ? (
                              <img
                                src={att.previewDataUrl}
                                alt="Video preview"
                                className="w-full h-auto max-h-[260px] object-cover rounded-xl"
                              />
                            ) : (
                              <div className="w-full h-40 bg-gradient-to-tr from-slate-700 to-slate-900 rounded-xl flex items-center justify-center">
                                <div className="w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                                  <Play className="h-5 w-5 fill-white ml-0.5" />
                                </div>
                              </div>
                            )}
                            <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
                              {att.durationSeconds ? `0:${att.durationSeconds}` : '0:35'}
                            </span>
                          </div>
                        );
                      }

                      // Link Preview Card
                      if (att.kind === 'link_preview') {
                        return (
                          <div
                            key={att.id}
                            data-testid="telegram-link-preview"
                            className={cn(
                              'my-1 p-2 rounded border-l-[3px] border-[#3390EC]',
                              dark ? 'bg-black/20' : 'bg-black/5'
                            )}
                          >
                            <span className="text-[10px] uppercase font-bold text-[#3390EC] block">
                              {att.linkPreviewMeta?.domain || 't.me'}
                            </span>
                            <span className="text-[12px] font-semibold block leading-tight mt-0.5">
                              {att.linkPreviewMeta?.title || 'ChatForge Studio Documentation'}
                            </span>
                            <span className="text-[11px] opacity-75 line-clamp-2 leading-tight mt-0.5">
                              {att.linkPreviewMeta?.description ||
                                'The modern open-source conversation mockup creator.'}
                            </span>
                          </div>
                        );
                      }

                      // Location Message
                      if (att.kind === 'location') {
                        return (
                          <div
                            key={att.id}
                            data-testid="telegram-location-card"
                            className="my-1 rounded-xl overflow-hidden border border-black/5 max-w-[240px]"
                          >
                            <div className="h-24 bg-gradient-to-br from-emerald-100 to-sky-200 dark:from-emerald-950 dark:to-sky-900 flex items-center justify-center relative">
                              <MapPin className="h-7 w-7 text-red-500 fill-red-500 filter drop-shadow-md" />
                            </div>
                            <div className="p-2 bg-white/50 dark:bg-black/20">
                              <span className="text-[12px] font-semibold block truncate">
                                {att.locationMeta?.placeName || 'Live Location'}
                              </span>
                              <span className="text-[10px] opacity-70 block truncate">
                                {att.locationMeta?.address || 'San Francisco, CA'}
                              </span>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}

                    {/* Text Content */}
                    {m.text && (
                      <p className="text-[14px] leading-[1.35] whitespace-pre-wrap break-words pr-2">
                        {m.text}
                      </p>
                    )}

                    {/* Timestamp, Edited Label & Read Receipt */}
                    <div className="flex items-center justify-end gap-1 mt-0.5 -mr-1 float-right clear-both select-none">
                      {m.isEdited && (
                        <span
                          data-testid="telegram-edited-label"
                          className="text-[10px] opacity-70 mr-0.5"
                        >
                          edited
                        </span>
                      )}
                      <span className="text-[10px] opacity-70 tracking-tight">
                        {m.timestampLabel}
                      </span>
                      {isSelf && m.readReceipt && m.readReceipt.status !== 'none' && (
                        <span data-testid="telegram-read-receipt" className="inline-flex items-center">
                          {m.readReceipt.status === 'read' ? (
                            <CheckCheck className="h-3.5 w-3.5 text-[#3390EC]" />
                          ) : (
                            <Check className="h-3.5 w-3.5 text-[#3390EC]" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Reactions Pill */}
              {m.reactions && m.reactions.length > 0 && (
                <div
                  data-testid="telegram-reactions"
                  className={cn(
                    'flex items-center gap-1 -mt-1.5 z-10 px-2 py-0.5 rounded-full text-xs shadow-xs border transition-transform',
                    dark
                      ? 'bg-[#1E2C3A] border-white/10 text-white'
                      : 'bg-white border-black/10 text-slate-900',
                    isSelf ? 'mr-3 self-end' : 'ml-10 self-start'
                  )}
                >
                  {m.reactions.map((r, i) => (
                    <span key={i} className="flex items-center gap-0.5 text-[11px] font-medium">
                      <span>{r.emoji}</span>
                      {r.count > 1 && <span className="opacity-80">{r.count}</span>}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* 5. Telegram Typing Indicator */}
        {isTypingPreview && (
          <div
            data-testid="telegram-typing-indicator"
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-2xl rounded-bl-[4px] w-fit shadow-xs',
              dark ? 'bg-[#182533] text-slate-300' : 'bg-white text-slate-500'
            )}
          >
            <div className="w-2 h-2 rounded-full bg-[#3390EC] animate-bounce" />
            <div
              className="w-2 h-2 rounded-full bg-[#3390EC] animate-bounce"
              style={{ animationDelay: '0.15s' }}
            />
            <div
              className="w-2 h-2 rounded-full bg-[#3390EC] animate-bounce"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
        )}
      </div>

      {/* 6. Message Composer */}
      <div
        data-testid="telegram-message-composer"
        className={cn(
          'flex items-center gap-2 px-3 py-2 transition-colors border-t border-black/5 dark:border-white/5',
          dark ? 'bg-[#17212B]' : 'bg-white'
        )}
      >
        <button
          type="button"
          className="p-1.5 text-slate-500 hover:text-[#3390EC] rounded-full transition-colors"
          aria-label="Attach File"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <div
          className={cn(
            'flex-1 flex items-center px-3 py-1.5 rounded-full text-sm',
            dark ? 'bg-[#242F3D] text-white' : 'bg-[#F4F4F5] text-slate-900'
          )}
        >
          <span className="opacity-50 select-none">Message</span>
        </div>

        <button
          type="button"
          className="p-1.5 text-slate-500 hover:text-[#3390EC] rounded-full transition-colors"
          aria-label="Add Emoji or Sticker"
        >
          <Smile className="h-5 w-5" />
        </button>

        <button
          type="button"
          className="w-8 h-8 rounded-full bg-[#3390EC] text-white flex items-center justify-center hover:opacity-95 shadow-xs transition-opacity"
          aria-label="Send Message"
        >
          <Send className="h-4 w-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
