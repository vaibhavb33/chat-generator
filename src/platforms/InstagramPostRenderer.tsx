'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from 'lucide-react';
import type { Conversation, Participant, PlatformTheme } from '@/core/types';
import { AvatarBadge, VerifiedIcon } from '@/components/shared-renderers/AvatarBadge';
import { cn } from '@/lib/utils';

export function InstagramPostRenderer({
  conversation,
  participantsById,
  theme,
}: {
  conversation: Conversation;
  participantsById: Record<string, Participant>;
  theme: PlatformTheme;
}) {
  const dark = theme.colorScheme === 'dark' || theme.colorScheme === 'dim';
  const post = conversation.postMeta;
  const [expandedCaption, setExpandedCaption] = useState(false);

  const author =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const handle = author?.handle?.replace(/^@/, '') || 'creator.studio';
  const caption = post?.caption ?? '';
  const shouldTruncate = (post?.simulateMoreCutoff ?? true) && !expandedCaption && caption.length > 96;
  const visibleCaption = shouldTruncate ? `${caption.slice(0, 96).trimEnd()}...` : caption;

  return (
    <div
      className={cn(
        'flex flex-col',
        dark ? 'bg-black text-white' : 'bg-white text-slate-900'
      )}
    >
      {/* Post Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <AvatarBadge participant={author} size="sm" storyRing />
          <div>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <span>{handle}</span>
              <VerifiedIcon type={author?.verifiedBadge} />
            </div>
            {post?.locationLabel && (
              <p className="text-[11px] opacity-70">{post.locationLabel}</p>
            )}
          </div>
        </div>
        <MoreHorizontal className="h-4 w-4 opacity-75" />
      </div>

      {/* Media Area */}
      <div
        className={cn(
          'relative flex w-full items-center justify-center overflow-hidden',
          post?.aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-square'
        )}
        style={{
          background:
            post?.imageGradient ||
            'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 45%, #DDD6FE 100%)',
        }}
      >
        {post?.imageDataUrl ? (
          <img
            src={post.imageDataUrl}
            alt="Post visual"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="max-w-[260px] rounded-2xl border border-indigo-200/70 bg-white/90 p-5 text-center text-slate-900 shadow-lg backdrop-blur-xs">
            <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Preview Card
            </span>
            <p className="mt-2 text-base font-bold leading-snug">
              Design clean social campaigns without PSD bloat
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Upload any custom creative in the Post tab
            </p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="space-y-2 px-3.5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart
              className={cn(
                'h-5 w-5',
                post?.isLikedBySelf && 'fill-rose-500 text-rose-500'
              )}
            />
            <MessageCircle className="h-5 w-5" />
            <Send className="h-5 w-5" />
          </div>
          <Bookmark className={cn('h-5 w-5', post?.isBookmarkedBySelf && 'fill-current')} />
        </div>

        <p className="text-xs font-semibold">
          {(post?.likeCount ?? 2841).toLocaleString()} likes
        </p>

        <div className="text-xs leading-relaxed">
          <span className="mr-1.5 font-semibold">{handle}</span>
          <span>{visibleCaption}</span>
          {shouldTruncate && (
            <button
              type="button"
              onClick={() => setExpandedCaption(true)}
              className="ml-1 font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 cursor-pointer"
            >
              more
            </button>
          )}
        </div>

        {conversation.messages.length > 0 && (
          <div className="space-y-1 pt-1">
            <p className="text-[11px] opacity-60">
              View all {post?.commentCount ?? conversation.messages.length} comments
            </p>
            {conversation.messages.slice(0, 2).map((c) => {
              const commenter = participantsById[c.senderId];
              return (
                <p key={c.id} className="text-xs">
                  <span className="mr-1.5 font-semibold">
                    {commenter?.handle?.replace(/^@/, '') || commenter?.displayName || 'user'}
                  </span>
                  <span className="opacity-90">{c.text}</span>
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
