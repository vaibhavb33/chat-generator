'use client';

import React from 'react';
import { ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import type { PlatformRendererProps } from '@/platforms/whatsapp-chat/Renderer';
import {
  ChatHeader,
  ChatTimestamp,
  MessageActions,
  MessageBubble,
  MessageInput,
  TypingIndicator,
} from '@/components/engine';
import { cn } from '@/lib/utils';

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
  const other =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const messages = conversation.messages.slice(0, visibleMessageCount);
  const msgById = Object.fromEntries(conversation.messages.map((m) => [m.id, m]));

  return (
    <div
      data-testid="renderer-telegram-chat"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[540px] flex-col',
        dark ? 'telegram-wallpaper-dark text-slate-100' : 'telegram-wallpaper-light text-slate-900'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      <ChatHeader
        title={other?.displayName ?? 'Contact'}
        subtitle={
          isTypingPreview
            ? 'typing...'
            : conversation.headerState.statusText || 'last seen recently'
        }
        participant={other}
        theme={theme}
        darkBg={true}
        className={dark ? 'bg-[#17212B] text-white' : 'bg-[#517DA2] text-white'}
        leftSlot={<ArrowLeft className="h-4 w-4 shrink-0" />}
        rightSlot={
          <>
            <Phone className="h-4 w-4" />
            <Video className="h-4 w-4" />
            <MoreVertical className="h-4 w-4" />
          </>
        }
      />

      <div className="flex-1 space-y-2.5 px-3 py-3.5">
        {messages.map((m) => {
          if (m.type === 'date_separator' || m.type === 'system') {
            return <ChatTimestamp key={m.id} text={m.text} darkMode={dark} />;
          }
          const isSelf = m.senderId === conversation.selfParticipantId;
          const replyTarget = m.replyToMessageId ? msgById[m.replyToMessageId] : undefined;
          const isSelected = selectedMessageId === m.id;

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
                replyTarget={replyTarget}
                replySender={replyTarget ? participantsById[replyTarget.senderId] : undefined}
                bubbleClass={
                  isSelf
                    ? dark
                      ? 'rounded-2xl rounded-br-xs bg-[#2B5278] text-white'
                      : 'rounded-2xl rounded-br-xs bg-[#EEFFDE] text-slate-900'
                    : dark
                      ? 'rounded-2xl rounded-bl-xs bg-[#182533] text-slate-100'
                      : 'rounded-2xl rounded-bl-xs bg-white text-slate-900'
                }
                receiptVariant="telegram"
                voiceAccentClass="bg-[#3390EC]"
                darkMode={dark}
                selected={isSelected}
                onSelect={() => onSelectMessage(m.id)}
              />
            </div>
          );
        })}

        {isTypingPreview && (
          <TypingIndicator
            darkMode={dark}
            bubbleClassName={dark ? 'bg-[#182533] text-slate-300' : 'bg-white text-slate-500'}
          />
        )}
      </div>

      <MessageInput
        placeholder="Message"
        darkMode={dark}
        actionButtonClass="bg-[#3390EC]"
        containerClassName={dark ? 'bg-[#17212B]' : 'bg-white'}
      />
    </div>
  );
}
