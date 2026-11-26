'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Mic,
  Play,
  Plus,
  Send,
  Sparkles,
  User,
  Video,
} from 'lucide-react';
import type { PlatformRendererProps } from '@/platforms/whatsapp-chat/Renderer';
import { MessageActions, TypingIndicator } from '@/components/engine';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { ParticipantAvatar } from '@/components/engine/ParticipantAvatar';
import { cn } from '@/lib/utils';

const EFFECT_LABELS: Record<string, string> = {
  invisible_ink: 'Invisible Ink',
  gentle: 'Gentle effect',
  loud: 'Loud effect',
  slam: 'Slam',
  echo: 'Echo',
  confetti: 'Confetti',
  lasers: 'Lasers',
  balloons: 'Balloons',
};

export function IMessageRenderer({
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
  const isSmsGreen = theme.bubbleStyle === 'sms_green';
  const isGroup = Boolean(conversation.groupMeta?.groupName);

  const other =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const messages = conversation.messages.slice(0, visibleMessageCount);
  const lastOutgoingIdx = [...messages]
    .reverse()
    .findIndex((m) => m.senderId === conversation.selfParticipantId);
  const actualLastOutgoingIdx =
    lastOutgoingIdx === -1 ? -1 : messages.length - 1 - lastOutgoingIdx;

  const backLabel = conversation.headerState?.backButtonLabel || 'Messages';
  const headerTitle = isGroup
    ? conversation.groupMeta?.groupName || 'Group Chat'
    : other?.displayName || 'Sarah Chen';
  const headerSubtitle = isSmsGreen
    ? 'Text Message • SMS'
    : conversation.headerState?.serviceSubtitle ||
      (isGroup ? `${conversation.participantIds.length} People` : 'iMessage');

  return (
    <div
      data-testid="renderer-imessage"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[580px] flex-col font-sans select-none',
        dark ? 'bg-[#000000] text-white' : 'bg-[#FFFFFF] text-black'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      {/* 1. iOS Status Bar */}
      <StatusBar
        statusBar={theme.statusBar}
        osVariant={theme.osVariant || 'ios'}
        darkBg={dark}
        className={cn(
          dark ? 'bg-[#121214]/95 text-white' : 'bg-[#F9F9FB]/95 text-black'
        )}
      />

      {/* 2. iOS Authentic Chat Header */}
      <div
        className={cn(
          'relative flex items-center justify-between border-b px-3 py-2 select-none backdrop-blur-md',
          dark
            ? 'border-white/10 bg-[#121214]/90 text-white'
            : 'border-slate-200/80 bg-[#F9F9FB]/90 text-black'
        )}
      >
        {/* Left: Back button with Chevron & Label */}
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center text-[15px] font-normal text-[#007AFF] hover:opacity-75 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5] -ml-1.5" />
            <span className="font-normal text-[15px] leading-none">{backLabel}</span>
          </button>
        </div>

        {/* Center: Avatar + Name + Subtitle */}
        <div className="flex flex-col items-center max-w-[50%]">
          {isGroup ? (
            <div className="relative flex items-center justify-center">
              {conversation.participantIds.slice(0, 2).map((pid, i) => {
                const p = participantsById[pid];
                return (
                  <div
                    key={pid}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 overflow-hidden flex items-center justify-center text-xs font-bold text-white shadow-xs',
                      dark ? 'border-[#121214]' : 'border-[#F9F9FB]',
                      i > 0 && '-ml-3.5'
                    )}
                    style={{ backgroundColor: p?.avatarFallbackColor || '#007AFF' }}
                  >
                    {p?.avatarDataUrl ? (
                      <img
                        src={p.avatarDataUrl}
                        alt={p.displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{(p?.displayName || 'G')[0]}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <ParticipantAvatar participant={other} size="sm" />
          )}

          <div className="mt-1 flex items-center gap-0.5">
            <span className="truncate text-[13px] font-semibold leading-tight">
              {headerTitle}
            </span>
            <ChevronRight className="h-3 w-3 opacity-30 stroke-[2]" />
          </div>

          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal leading-none mt-0.5">
            {headerSubtitle}
          </span>
        </div>

        {/* Right: FaceTime Action */}
        <div className="flex items-center gap-3">
          {conversation.headerState?.showFaceTimeAction !== false && (
            <button
              type="button"
              aria-label="FaceTime Video Call"
              className="text-[#007AFF] hover:opacity-75 transition-opacity"
            >
              <Video className="h-5 w-5 stroke-[2]" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Message Thread Container */}
      <div className="flex-1 space-y-1.5 px-3 py-3 overflow-y-auto">
        {messages.map((m, idx) => {
          // Date Separator or System Notification
          if (m.type === 'date_separator') {
            return (
              <div key={m.id} className="py-2.5 text-center">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 select-none">
                  {m.text || 'Today 9:41 AM'}
                </span>
              </div>
            );
          }

          if (m.type === 'system') {
            return (
              <div key={m.id} className="py-1.5 text-center">
                <span className="rounded-full px-3 py-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 select-none">
                  {m.text}
                </span>
              </div>
            );
          }

          const isSelf = m.senderId === conversation.selfParticipantId;
          const sender = participantsById[m.senderId];
          const isSelected = selectedMessageId === m.id;
          const showReceipt = isSelf && idx === actualLastOutgoingIdx;

          // Message clustering: check if last in run from this sender
          const nextMsg = messages[idx + 1];
          const isLastInRun =
            !nextMsg ||
            nextMsg.senderId !== m.senderId ||
            nextMsg.type === 'date_separator' ||
            nextMsg.type === 'system';

          // Group sender header: show sender name if group mode and first in run
          const prevMsg = messages[idx - 1];
          const isFirstInRun =
            !prevMsg ||
            prevMsg.senderId !== m.senderId ||
            prevMsg.type === 'date_separator' ||
            prevMsg.type === 'system';
          const showGroupSenderName = isGroup && !isSelf && isFirstInRun && sender;

          // Reply target
          const replyTarget = m.replyToMessageId
            ? conversation.messages.find((x) => x.id === m.replyToMessageId)
            : undefined;
          const replySender = replyTarget
            ? participantsById[replyTarget.senderId]
            : undefined;

          // Bubble styling
          const bubbleShape = isSelf
            ? isLastInRun
              ? 'rounded-[18px] rounded-br-[4px]'
              : 'rounded-[18px]'
            : isLastInRun
              ? 'rounded-[18px] rounded-bl-[4px]'
              : 'rounded-[18px]';

          const bubbleColors = isSelf
            ? isSmsGreen
              ? 'bg-[#34C759] text-white shadow-xs'
              : 'bg-[#007AFF] text-white shadow-xs'
            : dark
              ? 'bg-[#262629] text-white shadow-xs'
              : 'bg-[#E9E9EB] text-black shadow-xs';

          const att = m.attachments?.[0];
          const hasImage = m.type === 'image' || att?.kind === 'image';
          const hasVideo = m.type === 'video_preview' || att?.kind === 'video_preview';
          const hasVoice = m.type === 'voice_note' || att?.kind === 'voice_note';
          const hasLocation = m.type === 'location' || att?.kind === 'location';
          const hasContact = m.type === 'contact_card' || att?.kind === 'contact_card';
          const hasLink = m.type === 'link_preview' || att?.kind === 'link_preview';
          const isSticker = m.type === 'sticker' || att?.kind === 'sticker';

          return (
            <div
              key={m.id}
              className={cn('flex flex-col', isSelf ? 'items-end' : 'items-start')}
            >
              {/* Group sender displayName */}
              {showGroupSenderName && (
                <div className="mb-0.5 pl-3 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  {sender.displayName}
                </div>
              )}

              {/* Message Actions Popup on selection */}
              <MessageActions
                visible={isSelected}
                onDuplicate={() => onDuplicateMessage?.(m.id)}
                onSwitchSender={() => onSwitchSender?.(m.id)}
                onDelete={() => onDeleteMessage?.(m.id)}
              />

              {/* Main Bubble Wrapper */}
              <div
                onClick={() => onSelectMessage(m.id)}
                className={cn(
                  'relative max-w-[76%] transition-all cursor-pointer',
                  isSticker
                    ? 'p-1'
                    : hasImage || hasVideo
                      ? 'rounded-[18px] overflow-hidden'
                      : cn('px-3.5 py-2 text-[15px] leading-snug', bubbleShape, bubbleColors),
                  isSelected && 'ring-2 ring-[#007AFF] ring-offset-2'
                )}
              >
                {/* Reply Quote Preview */}
                {replyTarget && (
                  <div
                    className={cn(
                      'mb-1.5 rounded-xl px-2.5 py-1 text-xs select-none',
                      isSelf
                        ? 'bg-black/15 text-white/90'
                        : dark
                          ? 'bg-white/10 text-white/90'
                          : 'bg-black/5 text-black/80'
                    )}
                  >
                    <span className="font-semibold block text-[11px]">
                      {replySender?.displayName || 'Member'}
                    </span>
                    <span className="truncate block opacity-85 text-[11px]">
                      {replyTarget.text || 'Message'}
                    </span>
                  </div>
                )}

                {/* Content Renderers */}
                {isSticker ? (
                  <div className="text-5xl py-1 select-none leading-none">
                    {m.text || '🎉'}
                  </div>
                ) : hasImage ? (
                  <div className="overflow-hidden rounded-[16px]">
                    <img
                      src={att?.previewDataUrl || '/avatar-placeholder.png'}
                      alt={m.text || 'Photo attachment'}
                      className="max-h-60 w-auto object-cover rounded-[16px]"
                    />
                    {m.text && (
                      <p className="mt-1 px-2 py-1 text-sm font-medium text-white bg-black/60 rounded-b-[16px]">
                        {m.text}
                      </p>
                    )}
                  </div>
                ) : hasVideo ? (
                  <div className="relative overflow-hidden rounded-[16px] bg-slate-900 w-56 aspect-[4/3] flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg">
                      <Play className="h-6 w-6 fill-white text-white ml-1" />
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white font-medium">
                      0:24
                    </div>
                  </div>
                ) : hasVoice ? (
                  <div className="flex items-center gap-3 py-0.5 min-w-[210px]">
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                        isSelf
                          ? 'bg-white text-[#007AFF]'
                          : 'bg-[#007AFF] text-white'
                      )}
                    >
                      <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                    </div>

                    {/* iOS Waveform */}
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex h-5 items-center gap-[2.5px]">
                        {[0.3, 0.7, 0.45, 0.9, 0.6, 0.35, 0.8, 0.5, 0.7, 0.4, 0.85, 0.6, 0.3, 0.75].map(
                          (peak, i) => (
                            <span
                              key={i}
                              className={cn(
                                'w-[2px] rounded-full',
                                isSelf
                                  ? i < 8
                                    ? 'bg-white'
                                    : 'bg-white/40'
                                  : i < 8
                                    ? dark
                                      ? 'bg-white'
                                      : 'bg-black'
                                    : dark
                                      ? 'bg-white/30'
                                      : 'bg-black/30'
                              )}
                              style={{ height: `${Math.round(peak * 18)}px` }}
                            />
                          )
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] opacity-80">
                        <span>0:14</span>
                        <Mic className="h-3 w-3 opacity-60" />
                      </div>
                    </div>

                    {/* iOS "Keep" button */}
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#007AFF] px-1 hover:underline select-none"
                    >
                      Keep
                    </button>
                  </div>
                ) : hasLocation ? (
                  <div className="w-56 overflow-hidden rounded-[14px] bg-white text-black shadow-xs dark:bg-[#1E1E20] dark:text-white">
                    {/* Maps mockup preview */}
                    <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700">
                      <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-white/80 dark:bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-slate-700 dark:text-slate-300 backdrop-blur-xs">
                        <Compass className="h-3 w-3 text-red-500" />
                        Apple Maps
                      </div>
                      <MapPin className="h-8 w-8 text-rose-500 drop-shadow-md" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-[13px] font-semibold truncate">
                        {att?.locationMeta?.placeName || m.text || 'Apple Park'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {att?.locationMeta?.address || '1 Apple Park Way, Cupertino, CA'}
                      </p>
                    </div>
                  </div>
                ) : hasContact ? (
                  <div
                    className={cn(
                      'flex items-center gap-3 p-2.5 rounded-[14px] min-w-[200px]',
                      isSelf ? 'bg-black/10' : dark ? 'bg-white/10' : 'bg-black/5'
                    )}
                  >
                    <div className="h-9 w-9 rounded-full bg-[#007AFF]/20 text-[#007AFF] flex items-center justify-center shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold truncate">
                        {att?.contactCardMeta?.fullName || m.text || 'Alex Rivera'}
                      </p>
                      <p className="text-[10px] opacity-75">
                        {att?.contactCardMeta?.phoneOrHandle || 'Contact Card'}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-40 shrink-0" />
                  </div>
                ) : hasLink ? (
                  <div className="w-56 overflow-hidden rounded-[14px] bg-black/5 dark:bg-white/10">
                    <div className="h-24 bg-gradient-to-br from-sky-400/20 to-indigo-500/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-[#007AFF]" />
                    </div>
                    <div className="p-2 text-xs">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        {att?.linkPreviewMeta?.domain || 'apple.com'}
                      </span>
                      <p className="font-semibold text-[12px] truncate mt-0.5">
                        {att?.linkPreviewMeta?.title || m.text || 'Apple Event'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                )}

                {/* Tapback Reactions Badge */}
                {m.reactions && m.reactions.length > 0 && (
                  <div
                    className={cn(
                      'absolute -top-3.5 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[12px] shadow-sm ring-2 z-10 select-none',
                      isSelf
                        ? 'left-1 bg-[#007AFF] text-white ring-white dark:ring-[#000000]'
                        : dark
                          ? 'right-1 bg-[#3A3A3C] text-white ring-[#000000]'
                          : 'right-1 bg-white text-black ring-[#F2F2F7]'
                    )}
                  >
                    {m.reactions.map((r) => (
                      <span key={r.emoji}>{r.emoji}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Message Effect status (e.g. "Sent with Confetti") */}
              {m.messageEffect && m.messageEffect !== 'none' && (
                <div className="mt-0.5 px-1 text-[10px] text-slate-400 dark:text-slate-500 select-none">
                  Sent with {EFFECT_LABELS[m.messageEffect] || m.messageEffect}
                </div>
              )}

              {/* Read / Delivered Receipts on Outgoing Messages */}
              {showReceipt && (
                <div className="mt-0.5 pr-1 text-right text-[11px] font-medium text-slate-400 dark:text-slate-500 select-none">
                  {m.readReceipt?.status === 'read' ? (
                    <span>Read {m.timestampLabel}</span>
                  ) : m.readReceipt?.status === 'delivered' ? (
                    <span>Delivered</span>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTypingPreview && (
          <div className="flex items-start">
            <TypingIndicator
              darkMode={dark}
              bubbleClassName={
                dark ? 'bg-[#262629] text-slate-300' : 'bg-[#E9E9EB] text-slate-500'
              }
            />
          </div>
        )}
      </div>

      {/* 4. iOS Authentic Message Composer Bar */}
      <div
        className={cn(
          'flex items-center gap-2 border-t px-3 py-2.5 select-none',
          dark ? 'border-white/10 bg-[#000000]' : 'border-slate-200/80 bg-[#FFFFFF]'
        )}
      >
        {/* Plus (+) action button */}
        <button
          type="button"
          aria-label="Add media"
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white font-bold transition-opacity hover:opacity-80',
            dark ? 'bg-[#2C2C2E] text-slate-300' : 'bg-[#8E8E93] text-white'
          )}
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
        </button>

        {/* Input pill */}
        <div
          className={cn(
            'flex flex-1 items-center justify-between rounded-full border px-3.5 py-1.5 text-[14px]',
            dark
              ? 'border-white/10 bg-[#1C1C1E] text-slate-300'
              : 'border-slate-200 bg-[#F2F2F7] text-slate-500'
          )}
        >
          <span>{isSmsGreen ? 'Text Message' : 'iMessage'}</span>
          <Mic className="h-4 w-4 opacity-50" />
        </div>

        {/* Upward arrow send circle button */}
        <button
          type="button"
          aria-label="Send message"
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-80',
            isSmsGreen ? 'bg-[#34C759]' : 'bg-[#007AFF]'
          )}
        >
          <Send className="h-3.5 w-3.5 fill-current -rotate-45 ml-0.5" />
        </button>
      </div>
    </div>
  );
}