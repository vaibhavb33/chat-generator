'use client';

import React, { useRef, useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  Heart,
  HelpCircle,
  MapPin,
  Music2,
  Send,
  X,
} from 'lucide-react';
import type { Conversation, Participant, PlatformTheme, StoryElement } from '@/core/types';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { AvatarBadge, VerifiedIcon } from '@/components/shared-renderers/AvatarBadge';
import { cn } from '@/lib/utils';
import { useStudioStore } from '@/core/store/useStudioStore';

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

  const setActiveStorySlide = useStudioStore((s) => s.setActiveStorySlide);
  const updateStoryElement = useStudioStore((s) => s.updateStoryElement);
  const selectedElementId = useStudioStore((s) => s.ui.selectedMessageId);
  const setSelectedElementId = useStudioStore((s) => s.setSelectedMessageId);

  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; elX: number; elY: number } | null>(null);

  const author =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx > 0) {
      setActiveStorySlide(activeIdx - 1);
    }
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx < slides.length - 1) {
      setActiveStorySlide(activeIdx + 1);
    }
  };

  // Drag handling
  const handlePointerDown = (e: React.PointerEvent, element: StoryElement) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
    setDraggingId(element.id);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      elX: element.x,
      elY: element.y,
    });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !dragStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaXPercent = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaYPercent = ((e.clientY - dragStart.y) / rect.height) * 100;

    const newX = Math.max(5, Math.min(95, Math.round(dragStart.elX + deltaXPercent)));
    const newY = Math.max(12, Math.min(88, Math.round(dragStart.elY + deltaYPercent)));

    updateStoryElement(activeIdx, draggingId, { x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setDraggingId(null);
    setDragStart(null);
  };

  // Render individual sticker elements
  const renderElement = (el: StoryElement) => {
    const isSelected = selectedElementId === el.id;

    let content: React.ReactNode = null;

    switch (el.type) {
      case 'mention':
        content = (
          <div
            data-testid="story-sticker-mention"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-md backdrop-blur-md"
          >
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {el.mentionHandle || '@username'}
            </span>
          </div>
        );
        break;

      case 'location':
        content = (
          <div
            data-testid="story-sticker-location"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md backdrop-blur-md"
          >
            <MapPin className="h-3.5 w-3.5 text-rose-500" />
            <span>{el.locationName || 'Location'}</span>
          </div>
        );
        break;

      case 'hashtag':
        content = (
          <div
            data-testid="story-sticker-hashtag"
            className="inline-flex items-center gap-1 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-md backdrop-blur-md"
          >
            <span className="text-indigo-600">#</span>
            <span>{(el.hashtagText || 'hashtag').replace(/^#/, '')}</span>
          </div>
        );
        break;

      case 'poll': {
        const v1 = el.pollVotes1 ?? 68;
        const v2 = el.pollVotes2 ?? 32;
        const total = v1 + v2 || 1;
        const pct1 = Math.round((v1 / total) * 100);
        const pct2 = 100 - pct1;
        content = (
          <div
            data-testid="story-sticker-poll"
            className="w-[230px] overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl"
          >
            <div className="bg-slate-900 px-3 py-2 text-center text-xs font-bold text-white">
              {el.pollQuestion || el.text || 'Poll question?'}
            </div>
            <div className="divide-y divide-slate-100 text-xs font-semibold">
              <div className="relative flex items-center justify-between overflow-hidden px-3 py-2.5">
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-50"
                  style={{ width: `${pct1}%` }}
                />
                <span className="relative z-10">{el.pollOption1 || 'Yes'}</span>
                <span className="relative z-10 text-indigo-600">{pct1}%</span>
              </div>
              <div className="relative flex items-center justify-between overflow-hidden px-3 py-2.5">
                <div
                  className="absolute inset-y-0 left-0 bg-slate-50"
                  style={{ width: `${pct2}%` }}
                />
                <span className="relative z-10">{el.pollOption2 || 'No'}</span>
                <span className="relative z-10 text-slate-500">{pct2}%</span>
              </div>
            </div>
          </div>
        );
        break;
      }

      case 'question':
        content = (
          <div
            data-testid="story-sticker-question"
            className="w-[240px] overflow-hidden rounded-2xl bg-white p-3.5 text-center text-slate-900 shadow-xl"
          >
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white">
              <HelpCircle className="h-4 w-4" />
            </div>
            <p className="text-xs font-bold leading-snug">
              {el.questionPrompt || el.text || 'Ask me a question'}
            </p>
            <div className="mt-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-[11px] text-slate-400">
              Type something...
            </div>
          </div>
        );
        break;

      case 'emoji_slider': {
        const sliderVal = Math.max(0, Math.min(100, el.sliderValue ?? 80));
        const emoji = el.sliderEmoji || '🔥';
        content = (
          <div
            data-testid="story-sticker-slider"
            className="w-[230px] rounded-2xl bg-white p-3 text-center text-slate-900 shadow-xl"
          >
            <p className="mb-2 text-xs font-bold leading-tight">
              {el.sliderQuestion || el.text || 'How hyped are you?'}
            </p>
            <div className="relative flex h-8 items-center px-1">
              <div className="h-2 w-full rounded-full bg-gradient-to-r from-amber-300 via-pink-500 to-purple-600" />
              <div
                className="absolute text-xl transition-all"
                style={{ left: `calc(${sliderVal}% - 12px)` }}
              >
                {emoji}
              </div>
            </div>
          </div>
        );
        break;
      }

      case 'countdown':
        content = (
          <div
            data-testid="story-sticker-countdown"
            className="w-[220px] rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-3 text-center text-white shadow-xl"
          >
            <div className="mb-1 flex items-center justify-center gap-1 text-[10px] font-semibold tracking-wider text-pink-300 uppercase">
              <Calendar className="h-3 w-3" />
              <span>{el.countdownName || el.text || 'Launch Countdown'}</span>
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5 font-mono text-sm font-bold tracking-widest">
              <span className="rounded bg-black/40 px-1.5 py-0.5">
                {el.countdownTarget || '02 : 14 : 35'}
              </span>
            </div>
          </div>
        );
        break;

      case 'link':
        content = (
          <div
            data-testid="story-sticker-link"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 shadow-md backdrop-blur-md"
          >
            <Globe className="h-3.5 w-3.5 text-indigo-600" />
            <span className="max-w-[150px] truncate">
              {el.linkText || (el.linkUrl ? el.linkUrl.replace(/^https?:\/\//, '') : 'chatforge.dev')}
            </span>
            <span className="text-[11px] text-slate-400">↗</span>
          </div>
        );
        break;

      case 'music':
        content = (
          <div
            data-testid="story-sticker-music"
            className="inline-flex items-center gap-2 rounded-2xl bg-black/60 px-3.5 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 text-white animate-spin">
              <Music2 className="h-3 w-3" />
            </div>
            <div className="text-left">
              <p className="max-w-[130px] truncate text-[11px] font-bold">
                {el.musicTrack || el.text || 'Midnight Synth'}
              </p>
              <p className="max-w-[130px] truncate text-[9px] text-white/70">
                {el.musicArtist || 'Studio Mix'}
              </p>
            </div>
          </div>
        );
        break;

      case 'image_overlay':
        content = (
          <div data-testid="story-sticker-image" className="overflow-hidden rounded-xl shadow-lg">
            {el.imageUrl ? (
              <img
                src={el.imageUrl}
                alt="Story overlay"
                className="h-24 w-24 object-cover rounded-xl"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center bg-white/20 text-2xl">
                🖼️
              </div>
            )}
          </div>
        );
        break;

      case 'text':
      default: {
        const fontClass =
          el.fontStyle === 'modern'
            ? 'font-sans font-extrabold uppercase tracking-widest text-lg'
            : el.fontStyle === 'neon'
              ? 'font-serif italic font-bold tracking-wide text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]'
              : el.fontStyle === 'typewriter'
                ? 'font-mono font-semibold tracking-tight text-sm'
                : el.fontStyle === 'strong'
                  ? 'font-black uppercase tracking-tighter text-2xl drop-shadow-md'
                  : 'font-sans font-bold text-base';

        const bgClass =
          el.bgColor === 'black'
            ? 'bg-black/80 text-white px-3 py-1.5 rounded-lg'
            : el.bgColor === 'white'
              ? 'bg-white text-slate-900 px-3 py-1.5 rounded-lg'
              : el.bgColor === 'gradient'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-lg'
                : '';

        content = (
          <div
            data-testid="story-sticker-text"
            className={cn(fontClass, bgClass, 'inline-block text-center select-none')}
            style={{ color: el.color || undefined }}
          >
            {el.text || 'Add text'}
          </div>
        );
        break;
      }
    }

    return (
      <div
        key={el.id}
        onPointerDown={(e) => handlePointerDown(e, el)}
        className={cn(
          'absolute cursor-grab active:cursor-grabbing transition-transform',
          isSelected && 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-transparent rounded-lg'
        )}
        style={{
          left: `${el.x}%`,
          top: `${el.y}%`,
          transform: `translate(-50%, -50%) scale(${el.scale ?? 1}) rotate(${el.rotation ?? 0}deg)`,
          zIndex: el.zIndex ?? (isSelected ? 40 : 20),
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      data-testid="renderer-instagram-story"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative flex aspect-[9/16] w-full min-h-[640px] max-w-[420px] mx-auto flex-col justify-between overflow-hidden rounded-[32px] text-white select-none shadow-2xl"
      style={{
        background:
          activeSlide?.backgroundCss ||
          'linear-gradient(155deg, #4F46E5 0%, #7C3AED 50%, #EC4899 100%)',
      }}
    >
      {/* Background Image if uploaded */}
      {activeSlide?.imageDataUrl && (
        <img
          src={activeSlide.imageDataUrl}
          alt="Story background"
          className="absolute inset-0 h-full w-full object-cover -z-10"
        />
      )}

      {/* TOP HEADER & NAVIGATION */}
      <div className="relative z-30 pt-1">
        <StatusBar statusBar={theme.statusBar} osVariant={theme.osVariant} darkBg />

        {/* Progress Bars (Segmented by slide) */}
        <div className="flex gap-1.5 px-3 pt-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStorySlide(idx)}
              title={`Switch to slide ${idx + 1}`}
              className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35 cursor-pointer"
            >
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: idx <= activeIdx ? '100%' : '0%' }}
              />
            </button>
          ))}
        </div>

        {/* Author Row */}
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <AvatarBadge participant={author} size="sm" />
            <div className="flex items-center gap-1 text-xs font-bold leading-tight">
              <span>{author?.handle?.replace(/^@/, '') || author?.displayName || 'creator'}</span>
              <VerifiedIcon type={author?.verifiedBadge} />
              <span className="ml-1 font-normal opacity-70">
                {activeSlide?.postedAtLabel || '2h'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <button
              type="button"
              onClick={handlePrevSlide}
              disabled={activeIdx === 0}
              className="rounded-full p-1 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
              title="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextSlide}
              disabled={activeIdx === slides.length - 1}
              className="rounded-full p-1 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
              title="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <X className="h-5 w-5 opacity-80" />
          </div>
        </div>

        {/* Music badge if set */}
        {activeSlide?.musicLabel && (
          <div className="mx-4 mt-0.5 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium backdrop-blur-sm">
            <Music2 className="h-3 w-3 text-pink-400" />
            <span>{activeSlide.musicLabel}</span>
          </div>
        )}
      </div>

      {/* CENTER STORY CANVAS: Headline text & arbitrary sticker elements */}
      <div className="relative flex-1">
        {/* Default headline text if provided */}
        {activeSlide?.headlineText && (
          <div className="pointer-events-none absolute inset-x-4 top-[15%] text-center">
            <h3 className="text-2xl font-black leading-tight drop-shadow-md">
              {activeSlide.headlineText}
            </h3>
            {activeSlide.subText && (
              <p className="mt-1 text-sm font-semibold text-white/90 drop-shadow-sm">
                {activeSlide.subText}
              </p>
            )}
          </div>
        )}

        {/* Render all custom stickers/elements */}
        {(activeSlide?.elements ?? []).map((el) => renderElement(el))}
      </div>

      {/* BOTTOM VIEWER & REPLY BAR */}
      <div className="relative z-30 space-y-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3.5 pb-4 pt-6">
        <div className="flex items-center justify-between text-xs font-semibold text-white/90">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-pink-400" />
            <span>{(story?.viewerCount ?? 1428).toLocaleString()} views</span>
          </div>
          <span className="text-[11px] font-normal opacity-80">
            Seen by {author?.displayName || 'friends'} & others
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center rounded-full border border-white/40 bg-black/30 px-4 py-2 text-xs text-white/80 backdrop-blur-xs">
            Send message
          </div>
          <Heart className="h-5 w-5 text-white/90 hover:text-red-500 cursor-pointer" />
          <Send className="h-5 w-5 text-white/90 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
