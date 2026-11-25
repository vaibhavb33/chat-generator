'use client';

import React from 'react';
import { Gift, Hash, MoreVertical, Plus, Smile, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PlatformRendererProps } from '@/platforms/whatsapp-chat/Renderer';
import {
  ChatTimestamp,
  DocumentMessage,
  ImageMessage,
  MessageActions,
  MessageReaction,
  ParticipantAvatar,
  TypingIndicator,
  VerifiedIcon,
} from '@/components/engine';
import { cn } from '@/lib/utils';

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
  const dark = theme.colorScheme === 'dark' || theme.colorScheme === 'dim';
  const messages = conversation.messages.slice(0, visibleMessageCount);
  const msgById = Object.fromEntries(conversation.messages.map((m) => [m.id, m]));
  const channelName =
    conversation.groupMeta?.groupName?.replace(/^#/, '') ||
    conversation.headerState.channelName ||
    'launch-weekend';

  return (
    <div
      data-testid="renderer-discord-chat"
      dir={theme.typography.direction}
      className={cn(
        'flex min-h-[540px] flex-col',
        dark ? 'bg-[#313338] text-[#DBDEE1]' : 'bg-white text-slate-900'
      )}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      <div
        className={cn(
          'flex items-center justify-between border-b px-4 py-3',
          dark ? 'border-[#1E1F22] bg-[#2B2D31]' : 'border-slate-200 bg-slate-50'
        )}
      >
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold leading-tight">{channelName}</p>
            <p className="text-[11px] opacity-65">
              {conversation.headerState.statusText || '48 online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 opacity-75">
          <Users className="h-4 w-4" />
          <MoreVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="flex-1 space-y-3 px-3.5 py-4">
        {messages.map((m) => {
          if (m.type === 'date_separator' || m.type === 'system') {
            return <ChatTimestamp key={m.id} text={m.text} variant="divider" />;
          }
          const sender = participantsById[m.senderId];
          const replyTarget = m.replyToMessageId ? msgById[m.replyToMessageId] : undefined;
          const isSelected = selectedMessageId === m.id;
          const att = m.attachments[0];

          return (
            <div key={m.id} className="space-y-1">
              <MessageActions
                visible={isSelected}
                onDuplicate={() => onDuplicateMessage?.(m.id)}
                onSwitchSender={() => onSwitchSender?.(m.id)}
                onDelete={() => onDeleteMessage?.(m.id)}
              />
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16 }}
                onClick={() => onSelectMessage(m.id)}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1 transition-colors',
                  isSelected && 'ring-2 ring-indigo-500',
                  dark ? 'hover:bg-white/5' : 'hover:bg-slate-100/80'
                )}
              >
                <ParticipantAvatar participant={sender} size="sm" />
                <div className="min-w-0 flex-1">
                  {replyTarget && (
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] opacity-70">
                      <span className="h-3 w-3 rounded-tl border-l-2 border-t-2 border-slate-400" />
                      <span className="font-semibold">
                        @{participantsById[replyTarget.senderId]?.displayName ?? 'member'}
                      </span>
                      <span className="truncate">{replyTarget.text}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: sender?.nameColorHex || (dark ? '#F2F3F5' : '#1E293B') }}
                    >
                      {sender?.displayName ?? 'Member'}
                    </span>
                    <VerifiedIcon type={sender?.verifiedBadge} />
                    <span className="text-[10px] opacity-55">{m.timestampLabel}</span>
                  </div>

                  {att?.kind === 'image' || att?.kind === 'gif' ? (
                    <div className="mt-1">
                      <ImageMessage attachment={att} caption={m.text} />
                    </div>
                  ) : att?.kind === 'document' ? (
                    <div className="mt-1">
                      <DocumentMessage attachment={att} darkMode={dark} />
                    </div>
                  ) : (
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-[13.5px] leading-snug">
                      {m.text}
                    </p>
                  )}

                  <MessageReaction
                    reactions={m.reactions}
                    variant="discord_pills"
                    darkMode={dark}
                  />
                </div>
              </motion.div>
            </div>
          );
        })}

        {isTypingPreview && (
          <TypingIndicator
            label="Maya is typing..."
            darkMode={dark}
            bubbleClassName={dark ? 'bg-[#383A40] text-slate-200' : 'bg-slate-100 text-slate-600'}
          />
        )}
      </div>

      <div className="p-3">
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs opacity-80',
            dark ? 'bg-[#383A40] text-[#B5BAC1]' : 'bg-slate-100 text-slate-600'
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate">Message #{channelName}</span>
          <Gift className="h-4 w-4 shrink-0" />
          <Smile className="h-4 w-4 shrink-0" />
        </div>
      </div>
    </div>
  );
}
