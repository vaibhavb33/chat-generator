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

export function WhatsAppGroupChatRenderer({
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
  const messages = conversation.messages.slice(0, visibleMessageCount);
  const msgById = Object.fromEntries(conversation.messages.map((m) => [m.id, m]));

  const memberNames = conversation.participantIds
    .map((id) => participantsById[id]?.displayName)
    .filter(Boolean)
    .join(', ');

  const groupPseudoParticipant = {
    id: 'group_icon',
    displayName: conversation.groupMeta?.groupName ?? 'Group Chat',
    avatarFallbackColor: '#008069',
    verifiedBadge: 'none' as const,
  };

  return (
    <div
      data-testid="renderer-whatsapp-group-chat"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[540px] flex-col',
        dark ? 'whatsapp-wallpaper-dark text-slate-100' : 'whatsapp-wallpaper-light text-slate-900'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      <ChatHeader
        title={conversation.groupMeta?.groupName ?? 'Group Chat'}
        subtitle={
          isTypingPreview
            ? 'Maya is typing...'
            : conversation.headerState.statusText || memberNames
        }
        participant={groupPseudoParticipant}
        theme={theme}
        darkBg={dark || isAndroid}
        showVerified={false}
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
        {messages.map((m, idx) => {
          if (m.type === 'date_separator' || m.type === 'system') {
            return <ChatTimestamp key={m.id} text={m.text} darkMode={dark} />;
          }
          const isSelf = m.senderId === conversation.selfParticipantId;
          const prev = messages[idx - 1];
          const showSender = !isSelf && (!prev || prev.senderId !== m.senderId || prev.type === 'date_separator');
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
                showGroupSender={showSender}
                showGroupAvatar={true}
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
            label="Maya is typing..."
            darkMode={dark}
            bubbleClassName={dark ? 'bg-[#202C33] text-slate-300' : 'bg-white text-slate-500'}
          />
        )}
      </div>

      <MessageInput
        placeholder="Message group"
        darkMode={dark}
        actionButtonClass="bg-[#00A884]"
      />
    </div>
  );
}
