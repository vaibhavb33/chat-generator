'use client';

import React from 'react';
import { ArrowLeft, Lock, MoreVertical, Phone, Video } from 'lucide-react';
import type { Conversation, Participant, PlatformTheme } from '@/core/types';
import {
  ChatHeader,
  ChatTimestamp,
  MessageActions,
  MessageBubble,
  MessageInput,
  TypingIndicator,
} from '@/components/engine';
import { cn } from '@/lib/utils';

export interface PlatformRendererProps {
  conversation: Conversation;
  participantsById: Record<string, Participant>;
  theme: PlatformTheme;
  visibleMessageCount: number;
  selectedMessageId: string | null;
  isTypingPreview: boolean;
  onSelectMessage: (id: string) => void;
  onDuplicateMessage?: (id: string) => void;
  onSwitchSender?: (id: string) => void;
  onDeleteMessage?: (id: string) => void;
}

export function WhatsAppChatRenderer({
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
  const isAndroid = theme.osVariant === 'android';
  const other =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const messages = conversation.messages.slice(0, visibleMessageCount);
  const msgById = Object.fromEntries(conversation.messages.map((m) => [m.id, m]));

  return (
    <div
      data-testid="renderer-whatsapp-chat"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[540px] flex-col',
        dark ? 'whatsapp-wallpaper-dark text-slate-100' : 'whatsapp-wallpaper-light text-slate-900'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      <ChatHeader
        title={other?.displayName ?? 'Contact'}
        subtitle={isTypingPreview ? 'typing...' : conversation.headerState.statusText || 'online'}
        participant={other}
        theme={theme}
        darkBg={dark || isAndroid}
        className={
          dark
            ? 'bg-[#1F2C34] text-white'
            : isAndroid
              ? 'bg-[#008069] text-white'
              : 'border-b border-slate-200/80 bg-[#F6F6F6] text-slate-900'
        }
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
        {conversation.headerState.isEncryptedNoticeVisible && (
          <div className="mx-auto max-w-[88%] rounded-lg bg-[#FFEECD] px-3 py-1.5 text-center text-[10.5px] leading-snug text-[#54656F] shadow-2xs dark:bg-[#182229] dark:text-[#FFD279]">
            <Lock className="mr-1 inline h-3 w-3 align-text-top" />
            Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
          </div>
        )}

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
                      ? 'rounded-tr-xs bg-[#005C4B] text-white'
                      : 'rounded-tr-xs bg-[#D9FDD3] text-slate-900'
                    : dark
                      ? 'rounded-tl-xs bg-[#202C33] text-slate-100'
                      : 'rounded-tl-xs bg-white text-slate-900'
                }
                receiptVariant="whatsapp"
                voiceAccentClass="bg-[#00A884]"
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
            bubbleClassName={dark ? 'bg-[#202C33] text-slate-300' : 'bg-white text-slate-500'}
          />
        )}
      </div>

      <MessageInput
        placeholder="Message"
        darkMode={dark}
        actionButtonClass="bg-[#00A884]"
      />
    </div>
  );
}
