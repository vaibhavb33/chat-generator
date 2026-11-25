'use client';

import React from 'react';
import {
  ArrowLeft,
  Heart,
  Info,
  Mic,
  Phone,
  Play,
  Video,
} from 'lucide-react';
import type { PlatformRendererProps } from '@/platforms/whatsapp-chat/Renderer';
import {
  ChatTimestamp,
  MessageActions,
  MessageBubble,
  ReadReceipt,
  TypingIndicator,
} from '@/components/engine';
import { cn } from '@/lib/utils';
import type { Message, Participant } from '@/core/types';

/* ─────────────────────────── helpers ─────────────────────────── */

function IgStatusBar({ dark, timeLabel }: { dark: boolean; timeLabel: string }) {
  return (
    <div
      className={cn(
        'flex h-[44px] shrink-0 items-center justify-between px-6 text-[12px] font-semibold',
        dark ? 'bg-black text-white' : 'bg-white text-black'
      )}
    >
      <span>{timeLabel}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">●●●</span>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="4" width="3" height="8" rx="1" opacity="0.4" />
          <rect x="4" y="2.5" width="3" height="9.5" rx="1" opacity="0.6" />
          <rect x="8" y="1" width="3" height="11" rx="1" opacity="0.8" />
          <rect x="12" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0" y="1" width="22" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
          <rect x="22.5" y="3.5" width="2" height="5" rx="1" opacity="0.5" />
          <rect x="1.5" y="2.5" width="17" height="7" rx="1.5" />
        </svg>
      </div>
    </div>
  );
}

function VerifiedBadge({ type }: { type: string }) {
  if (type === 'blue') {
    return (
      <svg className="ml-0.5 inline-block h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#0095F6" />
        <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return null;
}

function AvatarCircle({
  participant,
  size = 'md',
}: {
  participant?: Participant;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims = { sm: 'h-8 w-8 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-16 w-16 text-xl' };
  if (participant?.avatarDataUrl) {
    return (
      <img
        src={participant.avatarDataUrl}
        alt={participant.displayName}
        className={cn('rounded-full object-cover shrink-0', dims[size])}
      />
    );
  }
  return (
    <span
      className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white', dims[size])}
      style={{ backgroundColor: participant?.avatarFallbackColor ?? '#7C3AED' }}
    >
      {(participant?.displayName ?? 'U').slice(0, 2).toUpperCase()}
    </span>
  );
}

/* ─── Shared post / Reel card ─── */
function IgSharedPost({
  dark,
  authorHandle,
  captionSnippet,
  isReel,
}: {
  dark: boolean;
  authorHandle: string;
  captionSnippet: string;
  isReel?: boolean;
}) {
  return (
    <div
      className={cn(
        'w-[220px] overflow-hidden rounded-2xl border',
        dark ? 'border-white/15 bg-[#1a1a1a]' : 'border-slate-200 bg-white'
      )}
    >
      <div
        className="flex h-[160px] items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#4F46E5,#A855F7,#EC4899)' }}
      >
        {isReel ? (
          <div className="flex flex-col items-center gap-1 text-white">
            <Play className="h-8 w-8 fill-white" />
            <span className="text-[11px] font-semibold">Reel</span>
          </div>
        ) : (
          <div className="h-full w-full opacity-80 flex items-center justify-center">
            <span className="text-3xl">🖼️</span>
          </div>
        )}
      </div>
      <div className={cn('px-3 py-2.5', dark ? 'text-white' : 'text-slate-900')}>
        <p className="text-[11px] font-semibold">{authorHandle}</p>
        <p className="mt-0.5 text-[11px] opacity-70 line-clamp-2">{captionSnippet}</p>
      </div>
    </div>
  );
}

/* ─── Story reply card ─── */
function IgStoryReply({
  dark,
  authorHandle,
  storyLabel,
  storyGradient,
}: {
  dark: boolean;
  authorHandle: string;
  storyLabel: string;
  storyGradient?: string;
}) {
  return (
    <div
      className={cn(
        'w-[200px] overflow-hidden rounded-2xl border',
        dark ? 'border-white/15' : 'border-slate-200'
      )}
    >
      <div
        className="flex h-[120px] items-end p-2.5"
        style={{
          background: storyGradient ?? 'linear-gradient(155deg,#4F46E5,#EC4899)',
        }}
      >
        <div className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white">
          {authorHandle}&apos;s story
        </div>
      </div>
      <div className={cn('px-3 py-2', dark ? 'bg-[#1a1a1a] text-white' : 'bg-white text-slate-900')}>
        <div className="flex items-center justify-between text-[11px] opacity-60">
          <span>Replied to your story</span>
          <span className="text-[10px] font-medium text-purple-400">Story preview</span>
        </div>
        <p className="text-[11px] font-medium line-clamp-1">{storyLabel}</p>
      </div>
    </div>
  );
}

/* ─── Voice note pill (Instagram style: dark rounded) ─── */
function IgVoicePill({
  dark,
  isSelf,
  durationSeconds,
  waveformPeaks,
}: {
  dark: boolean;
  isSelf: boolean;
  durationSeconds?: number;
  waveformPeaks: number[];
}) {
  const dur = durationSeconds ?? 0;
  const mins = Math.floor(dur / 60)
    .toString()
    .padStart(2, '0');
  const secs = (dur % 60).toString().padStart(2, '0');

  const bgClass = isSelf
    ? 'bg-gradient-to-br from-[#6366F1] via-[#7C3AED] to-[#A855F7]'
    : dark
      ? 'bg-[#262626]'
      : 'bg-[#EFEFEF]';

  const barColor = isSelf ? 'bg-white/70' : dark ? 'bg-white/50' : 'bg-slate-500/60';
  const playColor = isSelf ? 'text-white' : dark ? 'text-white' : 'text-slate-700';

  return (
    <div className={cn('flex w-[200px] items-center gap-2 rounded-full px-3 py-2.5', bgClass)}>
      <Play className={cn('h-4 w-4 shrink-0 fill-current', playColor)} />
      <div className="flex flex-1 items-end gap-[2px]">
        {waveformPeaks.slice(0, 20).map((peak, i) => (
          <div
            key={i}
            className={cn('w-[3px] rounded-full', barColor)}
            style={{ height: `${Math.max(4, peak * 24)}px` }}
          />
        ))}
      </div>
      <span className={cn('text-[10px] font-medium tabular-nums shrink-0', playColor)}>
        {mins}:{secs}
      </span>
    </div>
  );
}

/* ─── GIF bubble ─── */
function IgGifBubble({ dark }: { dark: boolean }) {
  return (
    <div
      className={cn(
        'flex h-[120px] w-[160px] items-center justify-center rounded-2xl border text-3xl',
        dark ? 'border-white/10 bg-[#1a1a1a]' : 'border-slate-200 bg-slate-100'
      )}
    >
      🎞️
      <span className={cn('ml-1 text-[11px] font-bold', dark ? 'text-white/60' : 'text-slate-500')}>
        GIF
      </span>
    </div>
  );
}

/* ─── Message unsent / disappear ─── */
function IgUnsentBubble({ dark, isSelf }: { dark: boolean; isSelf: boolean }) {
  const bubbleBase = isSelf
    ? 'bg-gradient-to-br from-[#6366F1] via-[#7C3AED] to-[#A855F7] text-white'
    : dark
      ? 'bg-[#262626] text-white'
      : 'bg-[#EFEFEF] text-slate-900';
  return (
    <div className={cn('rounded-[22px] px-4 py-2.5 italic opacity-60 text-sm', bubbleBase)}>
      Message was unsent
    </div>
  );
}

/* ─── Call event pill ─── */
function IgCallPill({
  dark,
  media,
  outcome,
  durationLabel,
}: {
  dark: boolean;
  media: 'voice' | 'video';
  outcome: 'answered' | 'missed' | 'declined' | 'cancelled';
  durationLabel?: string;
}) {
  const missed = outcome === 'missed' || outcome === 'declined';
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-2xl px-4 py-3',
        dark ? 'bg-[#1a1a1a] text-white' : 'bg-slate-100 text-slate-900'
      )}
    >
      {media === 'video' ? (
        <Video className={cn('h-5 w-5', missed ? 'text-red-500' : 'text-green-500')} />
      ) : (
        <Phone className={cn('h-5 w-5', missed ? 'text-red-500' : 'text-green-500')} />
      )}
      <div>
        <p className="text-[13px] font-semibold capitalize">
          {outcome} {media} call
        </p>
        {durationLabel && (
          <p className={cn('text-[11px]', dark ? 'text-white/50' : 'text-slate-500')}>
            {durationLabel}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Heart reaction (Instagram-specific) ─── */
function IgHeartReaction({ count, dark }: { count: number; dark: boolean }) {
  return (
    <div
      className={cn(
        'mt-0.5 flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        dark
          ? 'border-white/10 bg-[#1a1a1a] text-white'
          : 'border-slate-200 bg-white text-slate-700'
      )}
    >
      <Heart className="h-3 w-3 fill-red-500 text-red-500" />
      {count > 1 && <span>{count}</span>}
    </div>
  );
}

/* ─────────────────────────── main renderer ─────────────────────────── */

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

  /* ─ contact (non-self participant) ─ */
  const other =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const messages = conversation.messages.slice(0, visibleMessageCount);

  /* find last outgoing for seen indicator */
  const lastOutgoingIdx = [...messages]
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => m.senderId === conversation.selfParticipantId)
    .at(-1)?.i ?? -1;

  const statusText = isTypingPreview
    ? 'Typing...'
    : conversation.headerState.isVanishMode
      ? 'Vanish mode'
      : (other?.bioStatus ?? conversation.headerState.statusText ?? 'Active now');

  /* render a single message row */
  function renderMessage(m: Message, idx: number) {
    if (m.type === 'date_separator') {
      return (
        <ChatTimestamp key={m.id} text={m.text ?? ''} variant="pill" className={dark ? 'text-white/50' : 'text-slate-400'} />
      );
    }
    if (m.type === 'system') {
      return (
        <ChatTimestamp key={m.id} text={m.text ?? ''} variant="plain" className={dark ? 'text-white/40' : 'text-slate-400'} />
      );
    }

    const isSelf = m.senderId === conversation.selfParticipantId;
    const sender = participantsById[m.senderId];
    const isSelected = selectedMessageId === m.id;
    const showSeen = isSelf && idx === lastOutgoingIdx;
    const heartReaction = m.reactions.find((r) => r.emoji === '❤️' || r.emoji === '♥');
    const hasReactions = m.reactions.length > 0;

    /* special message types that bypass MessageBubble entirely */
    let specialContent: React.ReactNode = null;

    if (m.isDeleted) {
      specialContent = <IgUnsentBubble dark={dark} isSelf={isSelf} />;
    } else if (m.type === 'story_reply' && m.attachments[0]?.storyReplyMeta) {
      const meta = m.attachments[0].storyReplyMeta;
      specialContent = (
        <div className="flex flex-col gap-1.5">
          <IgStoryReply
            dark={dark}
            authorHandle={meta.authorHandle}
            storyLabel={meta.storyLabel}
            storyGradient={meta.storyGradient}
          />
          {m.text && (
            <div
              className={cn(
                'rounded-[22px] px-4 py-2.5 text-sm',
                isSelf
                  ? 'bg-gradient-to-br from-[#6366F1] via-[#7C3AED] to-[#A855F7] text-white'
                  : dark
                    ? 'bg-[#262626] text-white'
                    : 'bg-[#EFEFEF] text-slate-900'
              )}
            >
              {m.text}
            </div>
          )}
        </div>
      );
    } else if (m.type === 'shared_post' && m.attachments[0]?.sharedPostMeta) {
      const meta = m.attachments[0].sharedPostMeta;
      specialContent = (
        <IgSharedPost
          dark={dark}
          authorHandle={meta.authorHandle}
          captionSnippet={meta.captionSnippet}
          isReel={meta.isReel}
        />
      );
    } else if (m.type === 'gif') {
      specialContent = <IgGifBubble dark={dark} />;
    } else if (m.type === 'sticker') {
      specialContent = (
        <div className="text-5xl leading-none select-none" data-testid="ig-sticker">
          {m.text ?? '🎉'}
        </div>
      );
    } else if (m.type === 'voice_note' && m.attachments[0]?.voiceNoteMeta) {
      const meta = m.attachments[0].voiceNoteMeta;
      specialContent = (
        <IgVoicePill
          dark={dark}
          isSelf={isSelf}
          durationSeconds={m.attachments[0].durationSeconds}
          waveformPeaks={meta.waveformPeaks}
        />
      );
    } else if (m.type === 'call_event' && m.callEvent) {
      specialContent = (
        <IgCallPill
          dark={dark}
          media={m.callEvent.media}
          outcome={m.callEvent.outcome}
          durationLabel={m.callEvent.durationLabel}
        />
      );
    }

    const inlineBubbleClass = isSelf
      ? 'rounded-[22px] bg-gradient-to-br from-[#6366F1] via-[#7C3AED] to-[#A855F7] text-white'
      : dark
        ? 'rounded-[22px] bg-[#262626] text-white'
        : 'rounded-[22px] bg-[#EFEFEF] text-slate-900';

    return (
      <div
        key={m.id}
        className={cn('flex items-end gap-2', isSelf ? 'flex-row-reverse' : 'flex-row')}
      >
        {/* avatar on incoming side */}
        {!isSelf && (
          <AvatarCircle participant={sender} size="sm" />
        )}

        <div className={cn('flex max-w-[75%] flex-col', isSelf ? 'items-end' : 'items-start')}>
          <MessageActions
            visible={isSelected}
            onDuplicate={() => onDuplicateMessage?.(m.id)}
            onSwitchSender={() => onSwitchSender?.(m.id)}
            onDelete={() => onDeleteMessage?.(m.id)}
          />

          {/* reply quote if set */}
          {m.replyToMessageId && (() => {
            const quoted = messages.find((q) => q.id === m.replyToMessageId);
            if (!quoted) return null;
            return (
              <div
                className={cn(
                  'mb-1 max-w-[200px] rounded-xl border-l-2 border-indigo-400 px-2.5 py-1.5 text-[11px] opacity-70',
                  dark ? 'bg-white/8 text-white' : 'bg-slate-100 text-slate-700'
                )}
              >
                {quoted.text?.slice(0, 50) ?? '📎 Attachment'}
              </div>
            );
          })()}

          {specialContent ? (
            <div
              className="cursor-pointer"
              onClick={() => onSelectMessage(m.id)}
              data-testid={`ig-msg-${m.type}`}
            >
              {specialContent}
            </div>
          ) : (
            <MessageBubble
              message={m}
              sender={sender}
              isSelf={isSelf}
              showGroupAvatar={false}
              showInlineReceipt={false}
              bubbleClass={inlineBubbleClass}
              voiceAccentClass="bg-white/25"
              darkMode={dark}
              selected={isSelected}
              onSelect={() => onSelectMessage(m.id)}
            />
          )}

          {/* heart / emoji reaction (IG shows single floating heart or emoji) */}
          {hasReactions && (
            heartReaction
              ? <IgHeartReaction count={heartReaction.count} dark={dark} />
              : (
                <div className={cn('mt-0.5 flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-sm',
                  dark ? 'border-white/10 bg-[#1a1a1a] text-white' : 'border-slate-200 bg-white text-slate-700')}>
                  {m.reactions[0]?.emoji}
                  {(m.reactions[0]?.count ?? 1) > 1 && <span className="text-[11px] ml-0.5">{m.reactions[0]?.count}</span>}
                </div>
              )
          )}

          {/* seen pill under last outgoing */}
          {showSeen && (
            <div className={cn('mt-1 pr-0.5', isSelf ? 'self-end' : 'self-start')}>
              <ReadReceipt status={m.readReceipt.status} variant="instagram" />
            </div>
          )}

          {/* timestamp on tap / selected */}
          {isSelected && m.timestampLabel && (
            <span className={cn('mt-0.5 text-[10px]', dark ? 'text-white/40' : 'text-slate-400')}>
              {m.timestampLabel}
            </span>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────────────── JSX ─────────────────────────── */
  return (
    <div
      data-testid="renderer-instagram-dm"
      data-ig-dark={dark ? 'true' : 'false'}
      dir={theme.typography.direction}
      className={cn('flex min-h-[580px] flex-col', dark ? 'bg-black text-white' : 'bg-white text-slate-900')}
      style={{ fontSize: `${theme.typography.fontScale}rem` }}
    >
      {/* STATUS BAR */}
      {theme.statusBar.visible && (
        <IgStatusBar dark={dark} timeLabel={theme.statusBar.timeLabel} />
      )}

      {/* HEADER */}
      <div
        data-testid="ig-dm-header"
        className={cn(
          'flex shrink-0 items-center gap-3 px-4 py-2.5',
          dark
            ? 'border-b border-white/10 bg-black'
            : 'border-b border-slate-200/80 bg-white'
        )}
      >
        <ArrowLeft className="h-5 w-5 shrink-0 cursor-pointer" />

        <div className="relative shrink-0">
          <AvatarCircle participant={other} size="md" />
          {/* active green dot */}
          {!isTypingPreview && (other?.bioStatus === 'online' || conversation.headerState.statusText === 'online') && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400 dark:border-black" />
          )}
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center gap-0.5 truncate">
            <span className="truncate text-[14px] font-semibold">{other?.displayName ?? 'User'}</span>
            {other?.verifiedBadge === 'blue' && <VerifiedBadge type="blue" />}
          </div>
          <span className={cn('truncate text-[12px]', dark ? 'text-white/50' : 'text-slate-500')}>
            {statusText}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Phone className="h-5 w-5 cursor-pointer" />
          <Video className="h-5 w-5 cursor-pointer" />
          <Info className="h-5 w-5 cursor-pointer" />
        </div>
      </div>

      {/* Vanish mode banner */}
      {conversation.headerState.isVanishMode && (
        <div
          data-testid="ig-vanish-banner"
          className="bg-gradient-to-r from-[#6366F1] to-[#A855F7] px-4 py-1.5 text-center text-[11px] font-semibold text-white"
        >
          Vanish Mode — Messages disappear after they&apos;re seen
        </div>
      )}

      {/* MESSAGE THREAD */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {/* Profile card at top of new DM thread */}
        {messages.length <= 10 && (
          <div className="flex flex-col items-center gap-2 pb-2 pt-4" data-testid="ig-profile-card">
            <AvatarCircle participant={other} size="lg" />
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-bold">{other?.displayName ?? 'User'}</span>
              {other?.verifiedBadge === 'blue' && <VerifiedBadge type="blue" />}
            </div>
            {other?.handle && (
              <span className={cn('text-[13px]', dark ? 'text-white/50' : 'text-slate-500')}>
                {other.handle} · Instagram
              </span>
            )}
            <div className={cn('rounded-xl border px-4 py-2 text-[13px] font-semibold', dark ? 'border-white/15 text-white' : 'border-slate-300 text-slate-800')}>
              View profile
            </div>
          </div>
        )}

        {messages.map((m, idx) => renderMessage(m, idx))}

        {isTypingPreview && (
          <div className="flex items-end gap-2">
            <AvatarCircle participant={other} size="sm" />
            <TypingIndicator
              darkMode={dark}
              bubbleClassName={dark ? 'bg-[#262626] rounded-[22px]' : 'bg-[#EFEFEF] rounded-[22px]'}
            />
          </div>
        )}
      </div>

      {/* INPUT BAR */}
      <div
        data-testid="ig-dm-composer"
        className={cn(
          'flex shrink-0 items-center gap-3 border-t px-4 py-3',
          dark ? 'border-white/10 bg-black' : 'border-slate-200/80 bg-white'
        )}
      >
        {/* camera */}
        <svg className={cn('h-7 w-7 shrink-0', dark ? 'text-white' : 'text-slate-700')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 7l-7-5-7 5H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z" />
          <circle cx="12" cy="13" r="4" />
        </svg>

        <div className={cn('flex flex-1 items-center rounded-full border px-4 py-2', dark ? 'border-white/15 text-white/40' : 'border-slate-300 text-slate-400')}>
          <span className="text-[13px]">Message...</span>
        </div>

        <Mic className={cn('h-5 w-5 shrink-0', dark ? 'text-white' : 'text-slate-700')} />

        {/* photo strip */}
        <svg className={cn('h-5 w-5 shrink-0', dark ? 'text-white' : 'text-slate-700')} viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="2" width="9" height="9" rx="2" />
          <rect x="13" y="2" width="9" height="9" rx="2" />
          <rect x="2" y="13" width="9" height="9" rx="2" />
          <rect x="13" y="13" width="9" height="9" rx="2" />
        </svg>

        {/* like heart */}
        <Heart className={cn('h-5 w-5 shrink-0', dark ? 'text-white' : 'text-slate-700')} />
      </div>
    </div>
  );
}
