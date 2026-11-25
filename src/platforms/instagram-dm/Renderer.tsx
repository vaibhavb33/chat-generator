'use client';

import React from 'react';
import { ArrowLeft, Info, Phone, Video } from 'lucide-react';
import type { PlatformRendererProps } from '@/platforms/whatsapp-chat/Renderer';
import {
  ChatHeader,
  ChatTimestamp,
  MessageActions,
  MessageBubble,
  MessageInput,
  ReadReceipt,
  TypingIndicator,
} from '@/components/engine';
import { cn } from '@/lib/utils';

export function InstagramDmRenderer({
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

  return (
    <div
      data-testid="renderer-instagram-dm"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[540px] flex-col',
        dark ? 'bg-black text-white' : 'bg-white text-slate-900'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      <ChatHeader
        title={other?.displayName ?? 'Creator'}
        subtitle={
          isTypingPreview
            ? 'Typing...'
            : other?.handle || conversation.headerState.statusText || 'Active now'
        }
        participant={other}
        theme={theme}
        darkBg={dark}
        showOnlineDot
        className={cn(
          'border-b',
          dark ? 'border-white/10 bg-black text-white' : 'border-slate-200/80 bg-white text-slate-900'
        )}
        leftSlot={<ArrowLeft className="h-4 w-4 shrink-0" />}
        rightSlot={
          <>
            <Phone className="h-4 w-4" />
            <Video className="h-4 w-4" />
            <Info className="h-4 w-4" />
          </>
        }
      />

      <div className="flex-1 space-y-2.5 px-3 py-3.5">
        {messages.map((m, idx) => {
          if (m.type === 'date_separator' || m.type === 'system') {
            return <ChatTimestamp key={m.id} text={m.text} variant="plain" />;
          }
          const isSelf = m.senderId === conversation.selfParticipantId;
          const isSelected = selectedMessageId === m.id;
          const showSeen = isSelf && idx === actualLastOutgoingIdx;

          return (
            <div key={m.id} className={cn('flex flex-col', isSelf ? 'items-end' : 'items-start')}>
              <MessageActions
                visible={isSelected}
                onDuplicate={() => onDuplicateMessage?.(m.id)}
                onSwitchSender={() => onSwitchSender?.(m.id)}
                onDelete={() => onDeleteMessage?.(m.id)}
              />
              <MessageBubble
                message={m}
                sender={participantsById[m.senderId]}
                isSelf={isSelf}
                showGroupAvatar={!isSelf}
                showInlineReceipt={false}
                bubbleClass={
                  isSelf
                    ? 'rounded-[22px] bg-gradient-to-br from-[#6366F1] via-[#7C3AED] to-[#A855F7] text-white'
                    : dark
                      ? 'rounded-[22px] bg-[#262626] text-white'
                      : 'rounded-[22px] bg-[#EFEFEF] text-slate-900'
                }
                voiceAccentClass="bg-white/25"
                darkMode={dark}
                selected={isSelected}
                onSelect={() => onSelectMessage(m.id)}
              />
              {showSeen && (
                <div className="mt-0.5 pr-1">
                  <ReadReceipt status={m.readReceipt.status} variant="instagram" />
                </div>
              )}
            </div>
          );
        })}

        {isTypingPreview && (
          <TypingIndicator
            darkMode={dark}
            bubbleClassName={dark ? 'bg-[#262626] text-slate-300' : 'bg-[#EFEFEF] text-slate-500'}
          />
        )}
      </div>

      <MessageInput
        placeholder="Message..."
        darkMode={dark}
        actionButtonClass="bg-gradient-to-r from-[#6366F1] to-[#A855F7]"
        containerClassName={dark ? 'bg-black border-t border-white/10' : 'bg-white'}
      />
    </div>
  );
}
