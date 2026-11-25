'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ban, CornerUpRight, Headphones, Play, Sparkles, UserCheck } from 'lucide-react';
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

function getReplyFallbackLabel(replyTarget: Message): string {
  if (replyTarget.text?.trim()) return replyTarget.text;
  switch (replyTarget.type) {
    case 'image':
      return 'Photo';
    case 'video_preview':
      return 'Video';
    case 'voice_note':
      return 'Voice message';
    case 'audio':
      return 'Audio';
    case 'document':
      return replyTarget.attachments[0]?.fileName || 'Document';
    case 'location':
      return replyTarget.attachments[0]?.locationMeta?.placeName || 'Location';
    case 'contact_card':
      return replyTarget.attachments[0]?.contactCardMeta?.fullName || 'Contact card';
    case 'sticker':
      return 'Sticker';
    default:
      return 'Attachment';
  }
}

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
  const isSticker = message.type === 'sticker' || att?.kind === 'sticker';

  const renderBody = () => {
    if (message.isDeleted) {
      return (
        <p className="flex items-center gap-1.5 text-[0.82em] italic opacity-65">
          <Ban className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{isSelf ? 'You deleted this message' : 'This message was deleted'}</span>
        </p>
      );
    }
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
    if (message.type === 'audio' || att?.kind === 'audio') {
      const secs = att?.durationSeconds ?? 38;
      const formatted = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
      return (
        <div className="flex min-w-[205px] items-center gap-2.5 py-0.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
            <Headphones className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-xs font-semibold">
              {att?.audioMeta?.trackTitle || message.text || 'Audio-Track.mp3'}
            </p>
            <div className="flex items-center gap-2 text-[10px] opacity-75">
              <Play className="h-2.5 w-2.5 fill-current" />
              <div className="h-1 flex-1 rounded-full bg-current/25">
                <div className="h-full w-2/5 rounded-full bg-current" />
              </div>
              <span>{formatted}</span>
            </div>
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
            <p className="whitespace-pre-wrap break-words text-[0.845em] leading-[1.38]">
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
    if (isSticker) {
      const stickerText = (message.text || att?.caption || '🎉').trim();
      const isEmojiShort = stickerText.length <= 6;
      return (
        <div className="flex flex-col items-center py-1">
          {isEmojiShort ? (
            <span className="text-5xl leading-none select-none">{stickerText}</span>
          ) : (
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-400/15 px-3 py-2 text-base font-bold">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span>{stickerText}</span>
            </div>
          )}
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
      <p className="whitespace-pre-wrap break-words text-[0.845em] leading-[1.38]">
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
          isSticker ? 'bg-transparent! shadow-none! px-1.5 py-1' : bubbleClass,
          selected && 'ring-2 ring-indigo-500 ring-offset-1'
        )}
      >
        {message.forwardedLabel && message.forwardedLabel !== 'none' && (
          <div className="mb-0.5 flex items-center gap-1 text-[10.5px] italic opacity-70">
            <CornerUpRight className="h-3 w-3 shrink-0" />
            <span>
              {message.forwardedLabel === 'frequently_forwarded'
                ? 'Forwarded many times'
                : 'Forwarded'}
            </span>
          </div>
        )}

        {showGroupSender && sender && (
          <div className="mb-0.5 flex items-center justify-between gap-2">
            <p
              className="truncate text-[11px] font-bold"
              style={{ color: sender.nameColorHex || '#4F46E5' }}
            >
              {sender.displayName}
            </p>
            {(sender.isGroupCreator || sender.isAdmin) && (
              <span className="shrink-0 text-[9.5px] font-medium opacity-60">
                {sender.isGroupCreator ? '~ Creator' : '~ Admin'}
              </span>
            )}
          </div>
        )}

        {replyTarget && (
          <div
            className={cn(
              'mb-1.5 rounded-lg border-l-[3px] px-2 py-1 text-[11px]',
              darkMode ? 'border-emerald-400 bg-black/25' : 'border-emerald-600 bg-black/5'
            )}
          >
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">
              {replySender?.displayName ?? 'Member'}
            </p>
            <p className="truncate opacity-80">{getReplyFallbackLabel(replyTarget)}</p>
          </div>
        )}

        {renderBody()}

        {showInlineReceipt && (
          <div
            className={cn(
              'mt-1 flex items-center justify-end gap-1 text-[10px]',
              isSticker
                ? 'rounded-full bg-black/45 px-2 py-0.5 text-white!'
                : (footerClass ?? 'opacity-65')
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
