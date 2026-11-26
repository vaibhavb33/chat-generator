'use client';

import React from 'react';
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Lock,
  MapPin,
  Mic,
  MoreVertical,
  Phone,
  Play,
  Plus,
  Search,
  Send,
  Smile,
  Sparkles,
  User,
  Video,
} from 'lucide-react';
import type { PlatformRendererProps } from '@/platforms/whatsapp-chat/Renderer';
import { MessageActions, TypingIndicator } from '@/components/engine';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { ParticipantAvatar } from '@/components/engine/ParticipantAvatar';
import { cn } from '@/lib/utils';

export function AndroidMessagesRenderer({
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
  const profile = conversation.headerState?.androidProfile || 'google_messages';
  const isSmsMode = profile === 'classic_sms' || conversation.headerState?.isRcsMode === false;
  const isOneUi = profile === 'samsung_oneui';

  const other =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const messages = conversation.messages.slice(0, visibleMessageCount);
  const simLabel = conversation.headerState?.simSlotLabel || 'SIM 1';

  // Subtitle resolution
  let headerSubtitle = 'RCS chat';
  if (isTypingPreview) {
    headerSubtitle = 'Typing...';
  } else if (isSmsMode) {
    headerSubtitle = `Texting with ${other?.displayName || 'Contact'} (${simLabel})`;
  } else if (conversation.headerState?.serviceSubtitle) {
    headerSubtitle = conversation.headerState.serviceSubtitle;
  } else if (isOneUi) {
    headerSubtitle = 'Online';
  }

  // Material You / One UI / SMS Color Palette
  const bgMain = dark
    ? isOneUi
      ? 'bg-[#181920] text-[#E3E2E6]'
      : 'bg-[#121318] text-[#E3E2E6]'
    : isOneUi
      ? 'bg-[#F4F5F8] text-[#1A1C1E]'
      : 'bg-[#FDFBFF] text-[#1A1C1E]';

  const headerBg = dark
    ? isOneUi
      ? 'bg-[#1F2028] text-white border-b border-white/5'
      : 'bg-[#1D1F27] text-white border-b border-white/5'
    : isOneUi
      ? 'bg-[#FFFFFF] text-[#1A1C1E] border-b border-slate-200/80 shadow-2xs'
      : 'bg-[#EFF3F9] text-[#1A1C1E] border-b border-slate-200/60';

  const outgoingBg = isSmsMode
    ? 'bg-[#00838F] text-white'
    : isOneUi
      ? 'bg-[#2A87FF] text-white'
      : dark
        ? 'bg-[#A8C7FA] text-[#062E6F]'
        : 'bg-[#0B57D0] text-white';

  const incomingBg = dark
    ? isOneUi
      ? 'bg-[#2C2D35] text-[#E3E2E6]'
      : 'bg-[#24262F] text-[#E3E2E6]'
    : isOneUi
      ? 'bg-[#FFFFFF] text-[#1A1C1E] shadow-2xs'
      : 'bg-[#E8EDF5] text-[#1A1C1E]';

  const composerPlaceholder = isSmsMode
    ? `Text message • ${simLabel}`
    : isOneUi
      ? 'Enter message'
      : 'RCS message';

  return (
    <div
      data-testid="renderer-android-messages"
      dir={theme.typography.direction}
      className={cn('flex min-h-[580px] flex-col font-sans select-none', bgMain)}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      {/* 1. Android Status Bar (with Punch Hole Camera) */}
      <StatusBar
        statusBar={{
          ...theme.statusBar,
          notchStyle: theme.statusBar.notchStyle || 'punch_hole',
        }}
        osVariant="android"
        darkBg={dark}
        className={cn(
          dark ? 'bg-[#121318] text-white' : 'bg-[#EFF3F9] text-black'
        )}
      />

      {/* 2. Android Contact Header */}
      <div
        data-testid="android-messages-header"
        className={cn('flex items-center justify-between px-3 py-2.5 transition-colors', headerBg)}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Material Navigation Arrow (NOT iOS chevron) */}
          <button
            type="button"
            aria-label="Back"
            className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* Contact Avatar */}
          <ParticipantAvatar participant={other} size="sm" />

          {/* Name & Subtitle */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14.5px] font-medium leading-tight text-current">
              {other?.displayName ?? 'Contact'}
            </p>
            <p className="truncate text-[11px] opacity-70 leading-none mt-0.5">
              {headerSubtitle}
            </p>
          </div>
        </div>

        {/* Right Android Action Icons */}
        <div className="flex items-center gap-1.5 opacity-85">
          <button
            type="button"
            aria-label="Video call"
            className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Video className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            aria-label="Voice call"
            className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Phone className="h-4.5 w-4.5" />
          </button>
          {conversation.headerState?.showSearchAction !== false && (
            <button
              type="button"
              aria-label="Search conversation"
              className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
          )}
          <button
            type="button"
            aria-label="More options"
            className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* 3. Messages Container */}
      <div className="flex-1 space-y-2 px-3 py-3 overflow-y-auto">
        {/* End-to-end Encryption Banner for RCS mode */}
        {!isSmsMode && (
          <div
            data-testid="rcs-encryption-notice"
            className="flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium opacity-65 select-none"
          >
            <Lock className="h-3.5 w-3.5 text-[#0B57D0] dark:text-[#A8C7FA]" />
            <span>RCS chat with {other?.displayName ?? 'Contact'}</span>
          </div>
        )}

        {isSmsMode && (
          <div
            data-testid="sms-notice"
            className="flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium opacity-65 select-none"
          >
            <span className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[9.5px] font-bold">
              SMS
            </span>
            <span>Texting with {other?.displayName ?? 'Contact'} ({simLabel})</span>
          </div>
        )}

        {messages.map((m, idx) => {
          if (m.type === 'date_separator') {
            return (
              <div key={m.id} className="py-2 text-center">
                <span className="rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-[10.5px] font-medium opacity-75 select-none">
                  {m.text || 'Today • 10:00 AM'}
                </span>
              </div>
            );
          }

          if (m.type === 'system') {
            return (
              <div key={m.id} className="py-1 text-center">
                <span className="rounded-lg bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-[11px] opacity-75 select-none">
                  {m.text}
                </span>
              </div>
            );
          }

          const isSelf = m.senderId === conversation.selfParticipantId;
          const isSelected = selectedMessageId === m.id;

          // Message clustering for corner shape
          const nextMsg = messages[idx + 1];
          const isLastInRun =
            !nextMsg ||
            nextMsg.senderId !== m.senderId ||
            nextMsg.type === 'date_separator' ||
            nextMsg.type === 'system';

          const bubbleRadius = isSelf
            ? isLastInRun
              ? isOneUi
                ? 'rounded-[18px] rounded-br-[4px]'
                : 'rounded-[20px] rounded-br-[4px]'
              : 'rounded-[20px]'
            : isLastInRun
              ? isOneUi
                ? 'rounded-[18px] rounded-bl-[4px]'
                : 'rounded-[20px] rounded-bl-[4px]'
              : 'rounded-[20px]';

          const att = m.attachments?.[0];
          const hasImage = m.type === 'image' || att?.kind === 'image';
          const hasVideo = m.type === 'video_preview' || att?.kind === 'video_preview';
          const hasVoice = m.type === 'voice_note' || att?.kind === 'voice_note';
          const hasLocation = m.type === 'location' || att?.kind === 'location';
          const hasContact = m.type === 'contact_card' || att?.kind === 'contact_card';
          const hasLink = m.type === 'link_preview' || att?.kind === 'link_preview';
          const isSticker = m.type === 'sticker' || att?.kind === 'sticker';

          // Reply target
          const replyTarget = m.replyToMessageId
            ? conversation.messages.find((x) => x.id === m.replyToMessageId)
            : undefined;
          const replySender = replyTarget
            ? participantsById[replyTarget.senderId]
            : undefined;

          return (
            <div
              key={m.id}
              className={cn('flex flex-col', isSelf ? 'items-end' : 'items-start')}
            >
              {/* Message Actions on selection */}
              <MessageActions
                visible={isSelected}
                onDuplicate={() => onDuplicateMessage?.(m.id)}
                onSwitchSender={() => onSwitchSender?.(m.id)}
                onDelete={() => onDeleteMessage?.(m.id)}
              />

              {/* Message Bubble */}
              <div
                onClick={() => onSelectMessage(m.id)}
                className={cn(
                  'relative max-w-[78%] transition-all cursor-pointer',
                  isSticker
                    ? 'p-1'
                    : hasImage || hasVideo
                      ? 'rounded-[18px] overflow-hidden'
                      : cn('px-3.5 py-2.5 text-[14px] leading-snug', bubbleRadius, isSelf ? outgoingBg : incomingBg),
                  isSelected && 'ring-2 ring-[#0B57D0] ring-offset-1'
                )}
              >
                {/* Reply Quote Badge */}
                {replyTarget && (
                  <div
                    className={cn(
                      'mb-1.5 rounded-lg border-l-[3px] border-current px-2 py-1 text-[11px] opacity-85 select-none',
                      isSelf ? 'bg-black/10' : 'bg-black/5 dark:bg-white/10'
                    )}
                  >
                    <span className="font-bold block text-[10.5px]">
                      {replySender?.displayName || 'Member'}
                    </span>
                    <span className="truncate block opacity-80 text-[10.5px]">
                      {replyTarget.text || 'Message'}
                    </span>
                  </div>
                )}

                {/* Content Renderers */}
                {isSticker ? (
                  <div className="text-4xl py-1 select-none">{m.text || '🎉'}</div>
                ) : hasImage ? (
                  <div className="overflow-hidden rounded-[16px]">
                    <img
                      src={att?.previewDataUrl || '/avatar-placeholder.png'}
                      alt={m.text || 'Photo attachment'}
                      className="max-h-60 w-auto object-cover rounded-[16px]"
                    />
                    {m.text && (
                      <p className="mt-1 px-2.5 py-1 text-xs font-medium text-white bg-black/60 rounded-b-[16px]">
                        {m.text}
                      </p>
                    )}
                  </div>
                ) : hasVideo ? (
                  <div className="relative overflow-hidden rounded-[16px] bg-slate-900 w-56 aspect-[4/3] flex items-center justify-center">
                    <div className="h-11 w-11 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg">
                      <Play className="h-5 w-5 fill-white text-white ml-0.5" />
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] text-white font-medium">
                      0:20
                    </div>
                  </div>
                ) : hasVoice ? (
                  <div className="flex items-center gap-2.5 py-0.5 min-w-[200px]">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        isSelf
                          ? dark
                            ? 'bg-[#062E6F] text-[#A8C7FA]'
                            : 'bg-white text-[#0B57D0]'
                          : 'bg-[#0B57D0] text-white'
                      )}
                    >
                      <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    </div>

                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex h-5 items-center gap-[2px]">
                        {[0.2, 0.5, 0.8, 0.4, 0.9, 0.7, 0.35, 0.6, 0.85, 0.5, 0.3, 0.7].map(
                          (peak, i) => (
                            <span
                              key={i}
                              className={cn(
                                'w-[2.5px] rounded-full',
                                isSelf
                                  ? dark
                                    ? i < 7
                                      ? 'bg-[#062E6F]'
                                      : 'bg-[#062E6F]/40'
                                    : i < 7
                                      ? 'bg-white'
                                      : 'bg-white/40'
                                  : dark
                                    ? i < 7
                                      ? 'bg-[#A8C7FA]'
                                      : 'bg-[#A8C7FA]/30'
                                    : i < 7
                                      ? 'bg-[#0B57D0]'
                                      : 'bg-[#0B57D0]/30'
                              )}
                              style={{ height: `${Math.round(peak * 18)}px` }}
                            />
                          )
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] opacity-75">
                        <span>0:12</span>
                        <Mic className="h-3 w-3 opacity-60" />
                      </div>
                    </div>
                  </div>
                ) : hasLocation ? (
                  <div className="w-56 overflow-hidden rounded-[14px] bg-white text-black shadow-xs dark:bg-[#1E1E24] dark:text-white">
                    <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700">
                      <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-white/90 dark:bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-slate-800 dark:text-slate-200">
                        <MapPin className="h-3 w-3 text-red-500" />
                        Google Maps
                      </div>
                      <MapPin className="h-7 w-7 text-rose-500 drop-shadow-md" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[12.5px] font-bold truncate">
                        {att?.locationMeta?.placeName || m.text || 'San Francisco, CA'}
                      </p>
                      <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                        {att?.locationMeta?.address || 'California Street, SF'}
                      </p>
                    </div>
                  </div>
                ) : hasContact ? (
                  <div
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-[14px] min-w-[190px]',
                      isSelf ? 'bg-black/10' : 'bg-black/5 dark:bg-white/10'
                    )}
                  >
                    <div className="h-9 w-9 rounded-full bg-[#0B57D0]/20 text-[#0B57D0] flex items-center justify-center shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-bold truncate">
                        {att?.contactCardMeta?.fullName || m.text || 'Maya Lin'}
                      </p>
                      <p className="text-[10px] opacity-75">
                        {att?.contactCardMeta?.phoneOrHandle || '+1 (415) 555-0194'}
                      </p>
                    </div>
                  </div>
                ) : hasLink ? (
                  <div className="w-56 overflow-hidden rounded-[14px] bg-black/5 dark:bg-white/10">
                    <div className="h-20 bg-gradient-to-br from-blue-500/20 to-sky-400/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-[#0B57D0]" />
                    </div>
                    <div className="p-2 text-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        {att?.linkPreviewMeta?.domain || 'google.com'}
                      </span>
                      <p className="font-semibold text-[12px] truncate mt-0.5">
                        {att?.linkPreviewMeta?.title || m.text || 'Google Pixel Launch'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                )}

                {/* Footer Row: Timestamp + RCS/SMS checkmark */}
                <div
                  className={cn(
                    'mt-1 flex items-center justify-end gap-1 text-[10px] select-none',
                    isSelf ? 'opacity-85' : 'opacity-65'
                  )}
                >
                  <span>{m.timestampLabel || '10:00 AM'}</span>
                  {isSelf && (
                    <span className="flex items-center ml-0.5">
                      {m.readReceipt?.status === 'read' ? (
                        <CheckCheck className="h-3.5 w-3.5 stroke-[2.5]" aria-label="Read" />
                      ) : m.readReceipt?.status === 'delivered' ? (
                        <CheckCheck className="h-3.5 w-3.5 opacity-70" aria-label="Delivered" />
                      ) : (
                        <Check className="h-3.5 w-3.5 opacity-60" aria-label="Sent" />
                      )}
                    </span>
                  )}
                </div>

                {/* Material 3 Emoji Reaction Badge */}
                {m.reactions && m.reactions.length > 0 && (
                  <div
                    className={cn(
                      'absolute -bottom-2.5 flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold shadow-xs z-10 select-none',
                      isSelf ? 'right-2' : 'left-2',
                      dark
                        ? 'border-slate-700 bg-[#1D1F27] text-white'
                        : 'border-slate-200 bg-white text-slate-900'
                    )}
                  >
                    {m.reactions.map((r) => (
                      <span key={r.emoji} className="flex items-center gap-0.5">
                        <span>{r.emoji}</span>
                        {r.count > 1 && <span className="text-[9px] opacity-75">{r.count}</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTypingPreview && (
          <div className="flex items-start">
            <TypingIndicator
              darkMode={dark}
              bubbleClassName={
                dark ? 'bg-[#24262F] text-slate-300' : 'bg-[#E8EDF5] text-slate-600'
              }
            />
          </div>
        )}
      </div>

      {/* 4. Android Pill Message Composer */}
      <div
        className={cn(
          'flex items-center gap-2 border-t px-3 py-2.5 select-none',
          dark ? 'border-white/10 bg-[#121318]' : 'border-slate-200 bg-[#FDFBFF]'
        )}
      >
        {/* Attachment + action */}
        <button
          type="button"
          aria-label="Add attachment"
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
            dark ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5 text-slate-700'
          )}
        >
          <Plus className="h-5 w-5" />
        </button>

        {/* Pill input container */}
        <div
          className={cn(
            'flex flex-1 items-center justify-between rounded-full px-3.5 py-2 text-[14px] transition-colors',
            dark
              ? 'bg-[#1E2028] text-slate-200 border border-white/5'
              : 'bg-[#EFF3F9] text-slate-700 border border-slate-200/50'
          )}
        >
          <span className="truncate opacity-75">{composerPlaceholder}</span>

          <div className="flex items-center gap-2 opacity-65">
            <Smile className="h-4.5 w-4.5" />
            <ImageIcon className="h-4.5 w-4.5" />
          </div>
        </div>

        {/* Mic or Send button */}
        <button
          type="button"
          aria-label="Send message"
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90',
            isSmsMode ? 'bg-[#00838F]' : isOneUi ? 'bg-[#2A87FF]' : 'bg-[#0B57D0]'
          )}
        >
          <Send className="h-4 w-4 fill-current -rotate-45 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
