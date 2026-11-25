'use client';

import React from 'react';
import { ChevronLeft, Video } from 'lucide-react';
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
      data-testid="renderer-imessage"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[540px] flex-col',
        dark ? 'bg-[#000000] text-white' : 'bg-white text-slate-900'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      <ChatHeader
        title={other?.displayName ?? 'Contact'}
        subtitle={isSmsGreen ? 'Text Message • SMS' : 'iMessage'}
        participant={other}
        theme={theme}
        darkBg={dark}
        centered
        showVerified={false}
        className={cn(
          'border-b',
          dark ? 'border-white/10 bg-[#121214]/95 text-white' : 'border-slate-200/80 bg-[#F9F9FB]/95 text-slate-900'
        )}
        leftSlot={
          <span className="flex items-center text-xs font-medium text-[#007AFF]">
            <ChevronLeft className="h-5 w-5" />
          </span>
        }
        rightSlot={<Video className="h-4 w-4 text-[#007AFF]" />}
      />

      <div className="flex-1 space-y-2.5 px-3 py-3.5">
        {messages.map((m, idx) => {
          if (m.type === 'date_separator' || m.type === 'system') {
            return <ChatTimestamp key={m.id} text={m.text} variant="plain" />;
          }
          const isSelf = m.senderId === conversation.selfParticipantId;
          const isSelected = selectedMessageId === m.id;
          const showReceipt = isSelf && idx === actualLastOutgoingIdx;

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
                showInlineReceipt={false}
                reactionVariant="tapback"
                bubbleClass={
                  isSelf
                    ? isSmsGreen
                      ? 'rounded-[20px] rounded-br-xs bg-[#34C759] text-white'
                      : 'rounded-[20px] rounded-br-xs bg-[#007AFF] text-white'
                    : dark
                      ? 'rounded-[20px] rounded-bl-xs bg-[#262629] text-white'
                      : 'rounded-[20px] rounded-bl-xs bg-[#E9E9EB] text-slate-900'
                }
                voiceAccentClass="bg-white/25"
                darkMode={dark}
                selected={isSelected}
                onSelect={() => onSelectMessage(m.id)}
              />
              {showReceipt && (
                <div className="mt-0.5 pr-1">
                  <ReadReceipt
                    status={m.readReceipt.status}
                    variant="imessage"
                    readAtLabel={m.timestampLabel}
                  />
                </div>
              )}
            </div>
          );
        })}

        {isTypingPreview && (
          <TypingIndicator
            darkMode={dark}
            bubbleClassName={dark ? 'bg-[#262629] text-slate-300' : 'bg-[#E9E9EB] text-slate-500'}
          />
        )}
      </div>

      <MessageInput
        placeholder={isSmsGreen ? 'Text Message' : 'iMessage'}
        darkMode={dark}
        leadingPlus
        useSendIcon
        actionButtonClass={isSmsGreen ? 'bg-[#34C759]' : 'bg-[#007AFF]'}
        containerClassName={dark ? 'bg-black border-t border-white/10' : 'bg-white'}
      />
    </div>
  );
}
