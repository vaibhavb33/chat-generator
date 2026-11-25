'use client';

import React from 'react';
import { Eye, Heart, Music2, Send, X } from 'lucide-react';
import type { Conversation, Participant, PlatformTheme } from '@/core/types';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { AvatarBadge, VerifiedIcon } from '@/components/shared-renderers/AvatarBadge';

export function InstagramStoryRenderer({
  conversation,
  participantsById,
  theme,
}: {
  conversation: Conversation;
  participantsById: Record<string, Participant>;
  theme: PlatformTheme;
}) {
  const story = conversation.storyMeta;
  const slides = story?.slides ?? [];
  const activeIdx = story?.activeSlideIndex ?? 0;
  const activeSlide = slides[activeIdx] ?? slides[0];

  const author =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  return (
    <div
      className="relative flex min-h-[600px] flex-col justify-between overflow-hidden text-white"
      style={{
        background:
          activeSlide?.backgroundCss ||
          'linear-gradient(155deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
      }}
    >
      <div>
        <StatusBar
          statusBar={theme.statusBar}
          osVariant={theme.osVariant}
          darkBg
        />

        {/* Progress Bars */}
        <div className="flex gap-1 px-3 pt-1">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <div
                className="h-full bg-white"
                style={{ width: idx <= activeIdx ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Author Row */}
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <AvatarBadge participant={author} size="sm" />
            <div className="flex items-center gap-1 text-xs font-semibold">
              <span>{author?.handle?.replace(/^@/, '') || author?.displayName || 'creator'}</span>
              <VerifiedIcon type={author?.verifiedBadge} />
              <span className="ml-1 font-normal opacity-75">
                {activeSlide?.postedAtLabel || '2h'}
              </span>
            </div>
          </div>
          <X className="h-5 w-5 opacity-90" />
        </div>

        {activeSlide?.musicLabel && (
          <div className="mx-4 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1 text-[11px] font-medium backdrop-blur-xs">
            <Music2 className="h-3 w-3" />
            <span>{activeSlide.musicLabel}</span>
          </div>
        )}
      </div>

      {/* Center Story Content & Interactive Poll */}
      <div className="space-y-5 px-6 py-8 text-center">
        <h3 className="text-2xl font-bold leading-tight drop-shadow-sm">
          {activeSlide?.headlineText || 'Launching tonight ✨'}
        </h3>
        {activeSlide?.subText && (
          <p className="text-sm font-medium text-white/90">{activeSlide.subText}</p>
        )}

        {activeSlide?.pollQuestion && activeSlide.pollOptions && (
          <div className="mx-auto max-w-[260px] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-lg">
            <div className="bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
              {activeSlide.pollQuestion}
            </div>
            <div className="divide-y divide-slate-200 text-xs font-semibold">
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span>{activeSlide.pollOptions[0]}</span>
                <span className="text-indigo-600">68%</span>
              </div>
              <div className="flex items-center justify-between px-3.5 py-2.5">
                <span>{activeSlide.pollOptions[1]}</span>
                <span className="text-slate-500">32%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Viewer / Reply Bar */}
      <div className="space-y-2.5 bg-gradient-to-t from-black/60 to-transparent px-3.5 pb-4 pt-6">
        <div className="flex items-center justify-between text-xs font-medium text-white/90">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            <span>{(story?.viewerCount ?? 1428).toLocaleString()} views</span>
          </div>
          <span className="text-[11px] opacity-80">Seen by Maya & others</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-full border border-white/45 px-4 py-2 text-xs text-white/80">
            Send message
          </div>
          <Heart className="h-5 w-5" />
          <Send className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
