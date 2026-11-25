'use client';

import React from 'react';
import { ArrowLeft, Lock, MoreVertical, Phone, Video } from 'lucide-react';
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
  const other =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const messages = conversation.messages.slice(0, visibleMessageCount);

  return (
    <div
      data-testid="renderer-android-messages"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[540px] flex-col',
        dark ? 'bg-[#121318] text-[#E3E2E6]' : 'bg-[#FDFBFF] text-[#1A1C1E]'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      <ChatHeader
        title={other?.displayName ?? 'Contact'}
        subtitle={isTypingPreview ? 'Typing...' : 'RCS chat'}
        participant={other}
        theme={{
          ...theme,
          osVariant: theme.osVariant === 'generic_filmsafe' ? 'generic_filmsafe' : 'android',
        }}
        darkBg={dark}
        showVerified={false}
        className={cn(
          dark ? 'bg-[#1D1F27] text-white' : 'bg-[#EFF3F9] text-[#1A1C1E]'
        )}
        leftSlot={<ArrowLeft className="h-4 w-4 shrink-0" />}
        rightSlot={
          <>
            <Video className="h-4 w-4" />
            <Phone className="h-4 w-4" />
            <MoreVertical className="h-4 w-4" />
          </>
        }
      />

      <div className="flex-1 space-y-2.5 px-3 py-3.5">
        <div className="flex items-center justify-center gap-1 py-1 text-[10.5px] opacity-60">
          <Lock className="h-3 w-3" />
          <span>RCS chat with {other?.displayName ?? 'Contact'}</span>
        </div>

        {messages.map((m) => {
          if (m.type === 'date_separator' || m.type === 'system') {
            return <ChatTimestamp key={m.id} text={m.text} variant="plain" />;
          }
          const isSelf = m.senderId === conversation.selfParticipantId;
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
                showGroupAvatar={!isSelf}
                bubbleClass={
                  isSelf
                    ? dark
                      ? 'rounded-[20px] rounded-br-sm bg-[#0842A0] text-[#D3E3FD]'
                      : 'rounded-[20px] rounded-br-sm bg-[#0B57D0] text-white'
                    : dark
                      ? 'rounded-[20px] rounded-bl-sm bg-[#24262F] text-[#E3E2E6]'
                      : 'rounded-[20px] rounded-bl-sm bg-[#ECEFF6] text-[#1A1C1E]'
                }
                footerClass={isSelf ? 'text-white/80' : 'opacity-65'}
                receiptVariant="android"
                voiceAccentClass="bg-[#0B57D0]"
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
            bubbleClassName={dark ? 'bg-[#24262F] text-slate-300' : 'bg-[#ECEFF6] text-slate-500'}
          />
        )}
      </div>

      <MessageInput
        placeholder="RCS message"
        darkMode={dark}
        leadingPlus
        useSendIcon
        actionButtonClass="bg-[#0B57D0]"
        containerClassName={dark ? 'bg-[#121318]' : 'bg-[#FDFBFF]'}
      />
    </div>
  );
}
