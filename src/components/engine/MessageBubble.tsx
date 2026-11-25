'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, UserCheck } from 'lucide-react';
import type { Message, Participant } from '@/core/types';
import { ParticipantAvatar } from '@/components/engine/ParticipantAvatar';
import { MessageReaction } from '@/components/engine/MessageReaction';
import { ReadReceipt } from '@/components/engine/ReadReceipt';
import { VoiceMessage } from '@/components/engine/VoiceMessage';
import { ImageMessage } from '@/components/engine/ImageMessage';
import { VideoMessage } from '@/components/engine/VideoMessage';
import { DocumentMessage } from '@/components/engine/DocumentMessage';
import { LocationMessage } from '@/components/engine/LocationMessage';
import { CallEvent } from '@/components/engine/CallEvent';
import { cn } from '@/lib/utils';

export function MessageBubble({
  message,
  sender,
  isSelf,
  showGroupSender,
  showGroupAvatar,
  replyTarget,
  replySender,
  bubbleClass,
  footerClass,
  receiptVariant = 'whatsapp',
  reactionVariant = 'floating',
  showInlineReceipt = true,
  voiceAccentClass,
  darkMode = false,
  selected = false,
  onSelect,
}: {
  message: Message;
  sender?: Participant;
  isSelf: boolean;
  showGroupSender?: boolean;
  showGroupAvatar?: boolean;
  replyTarget?: Message;
  replySender?: Participant;
  bubbleClass: string;
  footerClass?: string;
  receiptVariant?: 'whatsapp' | 'telegram' | 'imessage' | 'instagram' | 'android';
  reactionVariant?: 'floating' | 'tapback' | 'discord_pills';
  showInlineReceipt?: boolean;
  voiceAccentClass?: string;
  darkMode?: boolean;
  selected?: boolean;
  onSelect: () => void;
}) {
  const att = message.attachments[0];

  const renderBody = () => {
    if (message.type === 'call_event') {
      return <CallEvent message={message} darkMode={darkMode || isSelf} />;
    }
    if (message.type === 'poll' && message.pollData) {
      const totalVotes = Math.max(
        1,
        message.pollData.options.reduce((a, b) => a + b.voteCount, 0)
      );
      return (
        <div className="min-w-[205px] space-y-2 py-0.5">
          <p className="text-xs font-semibold">{message.pollData.question}</p>
          <div className="space-y-1.5">
            {message.pollData.options.map((opt) => {
              const pct = Math.round((opt.voteCount / totalVotes) * 100);
              return (
                <div key={opt.id} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium">{opt.label}</span>
                    <span className="opacity-75">{opt.voteCount}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/15 dark:bg-white/15">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    if (message.type === 'voice_note' || att?.kind === 'voice_note') {
      return (
        <VoiceMessage
          attachment={att}
          accentClass={voiceAccentClass}
          isSimulatingPlayback={selected}
        />
      );
    }
    if (message.type === 'story_reply' || att?.kind === 'story_reply') {
      const sr = att?.storyReplyMeta;
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/20 p-2 text-[11px]">
            <div
              className="h-10 w-7 shrink-0 rounded-md"
              style={{
                background:
                  sr?.storyGradient || 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              }}
            />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold opacity-75">
                {sr?.storyLabel || `Replied to ${sr?.authorHandle || 'story'}`}
              </p>
              <p className="truncate font-medium">Story preview</p>
            </div>
          </div>
          {message.text && (
            <p className="whitespace-pre-wrap break-words text-[13.5px] leading-[1.38]">
              {message.text}
            </p>
          )}
        </div>
      );
    }
    if (message.type === 'shared_post' || att?.kind === 'shared_post') {
      const sp = att?.sharedPostMeta;
      return (
        <div className="w-52 overflow-hidden rounded-xl border border-black/10 bg-white/10">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold">
            <span className="h-4 w-4 rounded-full bg-gradient-to-tr from-amber-400 to-fuchsia-600" />
            <span className="truncate">{sp?.authorHandle || '@creator.studio'}</span>
          </div>
          <div className="flex h-24 items-center justify-center bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 text-xs font-semibold">
            {sp?.isReel ? 'Shared Reel ▶' : 'Shared Post'}
          </div>
          <div className="px-2.5 py-2 text-[11px]">
            <p className="line-clamp-2 opacity-90">
              {sp?.captionSnippet || message.text || 'Check out this post!'}
            </p>
          </div>
        </div>
      );
    }
    if (message.type === 'image' || message.type === 'gif' || att?.kind === 'image' || att?.kind === 'gif') {
      return <ImageMessage attachment={att} caption={message.text} />;
    }
    if (message.type === 'video_preview' || att?.kind === 'video_preview') {
      return <VideoMessage attachment={att} caption={message.text} />;
    }
    if (message.type === 'document' || att?.kind === 'document') {
      return <DocumentMessage attachment={att} darkMode={darkMode || isSelf} />;
    }
    if (message.type === 'location' || att?.kind === 'location') {
      return <LocationMessage attachment={att} />;
    }
    if (message.type === 'sticker' || att?.kind === 'sticker') {
      return (
        <div className="flex items-center gap-1.5 py-1 text-base font-bold">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span>{message.text || 'Sticker'}</span>
        </div>
      );
    }
    if (message.type === 'contact_card' || att?.kind === 'contact_card') {
      return (
        <div
          className={cn(
            'flex min-w-[195px] items-center gap-2.5 rounded-xl p-2',
            darkMode || isSelf ? 'bg-white/10' : 'bg-black/5'
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-500">
            <UserCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">
              {att?.contactCardMeta?.fullName ?? message.text ?? 'Contact'}
            </p>
            <p className="text-[10px] opacity-75">
              {att?.contactCardMeta?.phoneOrHandle ?? '+1 (415) 555-0194'}
            </p>
          </div>
        </div>
      );
    }
    return (
      <p className="whitespace-pre-wrap break-words text-[13.5px] leading-[1.38]">
        {message.text}
      </p>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16 }}
      onClick={onSelect}
      className={cn(
        'flex cursor-pointer items-end gap-1.5',
        isSelf ? 'justify-end' : 'justify-start'
      )}
    >
      {showGroupAvatar && !isSelf && (
        <div className="mb-1 shrink-0">
          <ParticipantAvatar participant={sender} size="xs" />
        </div>
      )}

      <div
        className={cn(
          'relative max-w-[78%] rounded-2xl px-3 py-2 shadow-2xs transition-shadow',
          bubbleClass,
          selected && 'ring-2 ring-indigo-500 ring-offset-1'
        )}
      >
        {showGroupSender && sender && (
          <p
            className="mb-0.5 text-[11px] font-bold"
            style={{ color: sender.nameColorHex || '#4F46E5' }}
          >
            {sender.displayName}
          </p>
        )}

        {replyTarget && (
          <div
            className={cn(
              'mb-1.5 rounded-lg border-l-2 px-2 py-1 text-[11px]',
              darkMode ? 'border-emerald-400 bg-black/25' : 'border-indigo-500 bg-black/5'
            )}
          >
            <p className="font-semibold">{replySender?.displayName ?? 'Member'}</p>
            <p className="truncate opacity-80">{replyTarget.text}</p>
          </div>
        )}

        {renderBody()}

        {showInlineReceipt && (
          <div
            className={cn(
              'mt-1 flex items-center justify-end gap-1 text-[10px]',
              footerClass ?? 'opacity-65'
            )}
          >
            <span>{message.timestampLabel}</span>
            {isSelf && (
              <ReadReceipt
                status={message.readReceipt.status}
                variant={receiptVariant}
              />
            )}
          </div>
        )}

        <MessageReaction
          reactions={message.reactions}
          variant={reactionVariant}
          isSelf={isSelf}
          darkMode={darkMode}
        />
      </div>
    </motion.div>
  );
}
