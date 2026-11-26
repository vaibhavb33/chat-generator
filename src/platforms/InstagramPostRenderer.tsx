'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Heart,
  Home,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Pin,
  Play,
  Plus,
  Search,
  Send,
  Tag,
  Volume2,
} from 'lucide-react';
import type { Conversation, Message, Participant, PlatformTheme } from '@/core/types';
import { AvatarBadge, VerifiedIcon } from '@/components/shared-renderers/AvatarBadge';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { useStudioStore } from '@/core/store/useStudioStore';
import { cn } from '@/lib/utils';

function renderFormattedText(text: string) {
  const parts = text.split(/(#[a-zA-Z0-9_]+|@[a-zA-Z0-9_.]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('#') || part.startsWith('@')) {
      return (
        <span
          key={i}
          className="text-sky-600 dark:text-sky-400 font-medium hover:underline cursor-pointer"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

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
  const updatePostMeta = useStudioStore((s) => s.updatePostMeta);
  const toggleCommentLike = useStudioStore((s) => s.toggleCommentLike);

  const [expandedCaption, setExpandedCaption] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [localActiveSlide, setLocalActiveSlide] = useState(0);
  const [showTagsOverlay, setShowTagsOverlay] = useState(false);

  const author =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const handle = author?.handle?.replace(/^@/, '') || 'creator.studio';
  const caption = post?.caption ?? '';
  const shouldTruncate = (post?.simulateMoreCutoff ?? true) && !expandedCaption && caption.length > 96;
  const visibleCaption = shouldTruncate ? `${caption.slice(0, 96).trimEnd()}...` : caption;

  const carousel = post?.carouselImages ?? [];
  const hasCarousel = carousel.length > 1;
  const activeSlideIndex = post?.activeCarouselIndex ?? localActiveSlide;
  const currentSlide = carousel[activeSlideIndex] ?? carousel[0];

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = Math.max(0, activeSlideIndex - 1);
    setLocalActiveSlide(nextIdx);
    if (updatePostMeta) updatePostMeta({ activeCarouselIndex: nextIdx });
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = Math.min(carousel.length - 1, activeSlideIndex + 1);
    setLocalActiveSlide(nextIdx);
    if (updatePostMeta) updatePostMeta({ activeCarouselIndex: nextIdx });
  };

  const handleToggleLike = () => {
    if (updatePostMeta && post) {
      const nextLiked = !post.isLikedBySelf;
      updatePostMeta({
        isLikedBySelf: nextLiked,
        likeCount: nextLiked ? post.likeCount + 1 : Math.max(0, post.likeCount - 1),
      });
    }
  };

  const handleToggleBookmark = () => {
    if (updatePostMeta && post) {
      updatePostMeta({ isBookmarkedBySelf: !post.isBookmarkedBySelf });
    }
  };

  // Separate root comments and replies
  const messages = conversation.messages;
  const rootComments = messages.filter((m) => !m.replyToMessageId);
  const repliesByParentId: Record<string, Message[]> = {};
  messages.forEach((m) => {
    if (m.replyToMessageId) {
      if (!repliesByParentId[m.replyToMessageId]) {
        repliesByParentId[m.replyToMessageId] = [];
      }
      repliesByParentId[m.replyToMessageId].push(m);
    }
  });

  const displayedRootComments = showAllComments ? rootComments : rootComments.slice(0, 3);

  // Aspect ratio class
  const aspectRatioClass =
    post?.aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : post?.aspectRatio === '1:1'
        ? 'aspect-square'
        : 'aspect-[4/5]';

  const isAndroid = theme.deviceType === 'android' || theme.osVariant === 'android';
  const showHomeShell = conversation.headerState?.screenViewMode !== 'post';
  const showStoriesStrip =
    showHomeShell && (conversation.headerState?.showHomeFeedStories ?? true);
  const selfUser = participantsById[conversation.selfParticipantId];
  const otherContacts = Object.values(participantsById).filter(
    (p) => p.id !== conversation.selfParticipantId
  );

  return (
    <div
      data-testid="renderer-instagram-post"
      className={cn(
        'relative flex w-full flex-col select-none transition-colors duration-200',
        dark ? 'bg-black text-white' : 'bg-white text-slate-900'
      )}
    >
      {showHomeShell && (
        <>
          <StatusBar
            statusBar={theme.statusBar}
            osVariant={isAndroid ? 'android' : 'ios'}
            darkBg={dark}
          />
          {/* Top Instagram Home Header matching IMG_5414.PNG (+ left, Instagram ⌄ center, Heart right) */}
          <div className="flex items-center justify-between px-4 py-2">
            <Plus className="h-6 w-6 stroke-[2]" />
            <div className="flex items-center gap-1">
              <span
                className="text-[22px] font-bold tracking-tight"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' }}
              >
                Instagram
              </span>
              <ChevronDown className="h-4 w-4 opacity-80" />
            </div>
            <div className="relative">
              <Heart className="h-6 w-6 stroke-[2]" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
            </div>
          </div>

          {/* Horizontal Stories Tray matching IMG_5414.PNG */}
          {showStoriesStrip && (
            <div
              data-testid="instagram-stories-tray"
              className="flex items-center gap-3 overflow-x-auto border-b border-current/10 px-3.5 pb-3 pt-1"
            >
              <div className="flex shrink-0 flex-col items-center gap-1">
                <div className="relative">
                  <AvatarBadge participant={selfUser ?? author} size="md" />
                  <span
                    className={cn(
                      'absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white text-black',
                      dark ? 'border-black' : 'border-white bg-slate-900 text-white'
                    )}
                  >
                    <Plus className="h-3 w-3 stroke-[3]" />
                  </span>
                </div>
                <span className="max-w-[64px] truncate text-[10px] opacity-75">
                  Your story
                </span>
              </div>

              {(otherContacts.length > 0 ? otherContacts : [author]).map((p) => (
                <div key={p.id} className="flex shrink-0 flex-col items-center gap-1">
                  <div className="rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2.5px]">
                    <div className={cn('rounded-full p-[2px]', dark ? 'bg-black' : 'bg-white')}>
                      <AvatarBadge participant={p} size="md" />
                    </div>
                  </div>
                  <span className="max-w-[66px] truncate text-[10px] opacity-85">
                    {(p.handle || p.displayName).replace(/^@/, '')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 1. Post Header */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'relative rounded-full transition-transform',
              (post?.hasStoryRing ?? true) &&
                'p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600'
            )}
          >
            <div className={cn('rounded-full', (post?.hasStoryRing ?? true) && (dark ? 'bg-black p-[1.5px]' : 'bg-white p-[1.5px]'))}>
              <AvatarBadge participant={author} size="sm" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold leading-tight">
              <span className="hover:opacity-80 cursor-pointer">{handle}</span>
              <VerifiedIcon type={author?.verifiedBadge} />
              {post?.isSponsored && (
                <span className="text-[10px] font-normal opacity-60 ml-0.5">• Sponsored</span>
              )}
            </div>
            {post?.locationLabel && (
              <p
                data-testid="post-location-label"
                className="text-[11px] font-normal opacity-75 leading-tight hover:underline cursor-pointer"
              >
                {post.locationLabel}
              </p>
            )}
            {post?.musicTrack && !post?.locationLabel && (
              <p className="flex items-center gap-1 text-[10px] opacity-75 leading-tight">
                <Music2 className="h-2.5 w-2.5" />
                <span>
                  {post.musicArtist ? `${post.musicArtist} • ` : ''}
                  {post.musicTrack}
                </span>
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label="More post options"
          className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4 opacity-75" />
        </button>
      </div>

      {/* 2. Media Area (Single, Carousel, or Video) */}
      <div
        data-testid="post-media-container"
        className={cn(
          'relative flex w-full items-center justify-center overflow-hidden bg-slate-950 group',
          aspectRatioClass
        )}
        style={{
          background:
            currentSlide?.imageGradient ||
            post?.imageGradient ||
            'linear-gradient(135deg, #18181B 0%, #27272A 50%, #3F3F46 100%)',
        }}
      >
        {/* Media Content */}
        {currentSlide?.imageDataUrl || post?.imageDataUrl ? (
          <img
            src={currentSlide?.imageDataUrl || post?.imageDataUrl}
            alt={currentSlide?.alt || 'Post visual'}
            className={cn(
              'h-full w-full',
              post?.objectFit === 'contain' ? 'object-contain' : 'object-cover'
            )}
          />
        ) : (
          <div className="max-w-[280px] rounded-2xl border border-white/20 bg-black/40 p-5 text-center text-white shadow-xl backdrop-blur-md">
            <span className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {hasCarousel ? `Slide ${activeSlideIndex + 1} of ${carousel.length}` : 'Preview Visual'}
            </span>
            <p className="mt-2 text-sm font-bold leading-snug">
              {currentSlide?.alt || 'High-Resolution Mockup Creative'}
            </p>
            <p className="mt-1 text-[11px] text-white/70">
              Upload custom photography or switch to 1:1, 4:5 or 16:9
            </p>
          </div>
        )}

        {/* Carousel Slide Counter Badge */}
        {hasCarousel && (
          <div
            data-testid="carousel-counter-badge"
            className="absolute top-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white shadow-md backdrop-blur-xs tracking-wider"
          >
            {activeSlideIndex + 1}/{carousel.length}
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {hasCarousel && activeSlideIndex > 0 && (
          <button
            type="button"
            data-testid="carousel-prev-btn"
            onClick={handlePrevSlide}
            aria-label="Previous carousel image"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/75 p-1.5 text-white shadow-md transition-all backdrop-blur-xs cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {hasCarousel && activeSlideIndex < carousel.length - 1 && (
          <button
            type="button"
            data-testid="carousel-next-btn"
            onClick={handleNextSlide}
            aria-label="Next carousel image"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/75 p-1.5 text-white shadow-md transition-all backdrop-blur-xs cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Video Overlay Indicator */}
        {post?.isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rounded-full bg-black/50 p-3.5 text-white backdrop-blur-xs shadow-lg">
              <Play className="h-6 w-6 fill-white" />
            </div>
            {post.videoDurationLabel && (
              <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                {post.videoDurationLabel}
              </span>
            )}
          </div>
        )}

        {/* Tagged Accounts Indicator / Button */}
        {post?.taggedAccounts && post.taggedAccounts.length > 0 && (
          <button
            type="button"
            data-testid="toggle-tags-btn"
            onClick={() => setShowTagsOverlay(!showTagsOverlay)}
            aria-label="View tagged accounts"
            className="absolute bottom-3 left-3 rounded-full bg-black/65 p-1.5 text-white shadow-md backdrop-blur-xs hover:bg-black/80 transition-colors cursor-pointer"
          >
            <Tag className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Tagged Accounts Tooltip Badges */}
        {(showTagsOverlay || post?.showTags) && post?.taggedAccounts && post.taggedAccounts.length > 0 && (
          <div
            data-testid="tagged-accounts-overlay"
            className="absolute inset-0 pointer-events-none p-6 flex flex-wrap items-center justify-center gap-3 bg-black/20 backdrop-blur-[1px]"
          >
            {post.taggedAccounts.map((account, idx) => (
              <div
                key={idx}
                className="relative rounded-md bg-black/85 px-2.5 py-1 text-xs font-semibold text-white shadow-xl flex items-center gap-1 border border-white/10 animate-fade-in"
              >
                <span>{account}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Action Bar */}
      <div className="px-3.5 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              data-testid="post-like-button"
              onClick={handleToggleLike}
              aria-label="Like post"
              className="transition-transform active:scale-125 cursor-pointer"
            >
              <Heart
                className={cn(
                  'h-6 w-6 transition-colors',
                  post?.isLikedBySelf
                    ? 'fill-rose-500 text-rose-500'
                    : dark
                      ? 'text-white hover:text-slate-300'
                      : 'text-slate-900 hover:text-slate-600'
                )}
              />
            </button>
            <button
              type="button"
              data-testid="post-comment-button"
              onClick={() => setShowAllComments(!showAllComments)}
              aria-label="View or write comments"
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
            <button
              type="button"
              data-testid="post-share-button"
              aria-label="Share post"
              className="cursor-pointer hover:opacity-75 transition-opacity"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>

          {/* Carousel Pagination Dots */}
          {hasCarousel && (
            <div data-testid="carousel-dots-pagination" className="flex items-center gap-1">
              {carousel.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'rounded-full transition-all duration-200',
                    idx === activeSlideIndex
                      ? 'h-1.5 w-1.5 bg-sky-500'
                      : 'h-1 w-1 bg-slate-400 opacity-50'
                  )}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            data-testid="post-bookmark-button"
            onClick={handleToggleBookmark}
            aria-label="Bookmark post"
            className="cursor-pointer hover:opacity-75 transition-opacity"
          >
            <Bookmark
              className={cn(
                'h-6 w-6 transition-colors',
                post?.isBookmarkedBySelf && 'fill-current'
              )}
            />
          </button>
        </div>

        {/* Like Count */}
        <div className="mt-2 text-xs font-semibold">
          {post?.likedByUsername ? (
            <p>
              Liked by <span className="font-bold hover:underline cursor-pointer">{post.likedByUsername}</span> and{' '}
              <span>{(post?.likeCount ? post.likeCount - 1 : 2840).toLocaleString()} others</span>
            </p>
          ) : (
            <p>{(post?.likeCount ?? 2841).toLocaleString()} likes</p>
          )}
        </div>

        {/* Caption */}
        <div className="mt-1.5 text-xs leading-relaxed break-words">
          <span className="mr-1.5 font-bold hover:underline cursor-pointer">{handle}</span>
          <span className="whitespace-pre-line">{renderFormattedText(visibleCaption)}</span>
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

        {/* Music Tag in Feed */}
        {post?.musicTrack && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] opacity-75">
            <Volume2 className="h-3 w-3" />
            <span className="font-medium">
              {post.musicArtist ? `${post.musicArtist} • ` : ''}
              {post.musicTrack}
            </span>
          </div>
        )}

        {/* 4. Comments Section */}
        {rootComments.length > 0 && (
          <div className="mt-2 space-y-1.5 pt-1">
            {rootComments.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllComments(!showAllComments)}
                className="text-[11px] font-normal opacity-60 hover:opacity-100 transition-opacity cursor-pointer block text-left"
              >
                {showAllComments
                  ? 'Hide comments'
                  : `View all ${post?.commentCount ?? messages.length} comments`}
              </button>
            )}

            {displayedRootComments.map((comment) => {
              const commenter = participantsById[comment.senderId];
              const commenterHandle = commenter?.handle?.replace(/^@/, '') || commenter?.displayName || 'user';
              const replies = repliesByParentId[comment.id] ?? [];
              const commentLikes = comment.commentLikes ?? (comment.reactions.find((r) => r.emoji === '❤️')?.count || 0);
              const isLiked = comment.reactions.some((r) => r.emoji === '❤️');

              return (
                <div key={comment.id} data-testid={`comment-row-${comment.id}`} className="space-y-1">
                  <div className="flex items-start justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="mt-0.5 shrink-0">
                        <AvatarBadge participant={commenter} size="xs" />
                      </div>
                      <div className="leading-snug break-words">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-semibold mr-1 hover:underline cursor-pointer">
                            {commenterHandle}
                          </span>
                          <VerifiedIcon type={commenter?.verifiedBadge} />
                          {comment.isPinned && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-500 font-medium">
                              <Pin className="h-2.5 w-2.5 fill-amber-500" /> Pinned
                            </span>
                          )}
                        </div>
                        <span className="opacity-90">{renderFormattedText(comment.text || '')}</span>
                        <div className="mt-1 flex items-center gap-3 text-[10px] opacity-60">
                          <span>{comment.timestampLabel || '1h'}</span>
                          {commentLikes > 0 && (
                            <span>{commentLikes} {commentLikes === 1 ? 'like' : 'likes'}</span>
                          )}
                          <button
                            type="button"
                            className="font-semibold hover:opacity-100 cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCommentLike && toggleCommentLike(comment.id)}
                      aria-label="Like comment"
                      className="p-1 hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
                    >
                      <Heart
                        className={cn(
                          'h-3.5 w-3.5',
                          isLiked ? 'fill-rose-500 text-rose-500' : 'opacity-50'
                        )}
                      />
                    </button>
                  </div>

                  {/* Threaded Replies */}
                  {replies.length > 0 && (
                    <div className="ml-7 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800 pl-2.5 mt-1">
                      {replies.map((reply) => {
                        const replyAuthor = participantsById[reply.senderId];
                        const replyHandle = replyAuthor?.handle?.replace(/^@/, '') || replyAuthor?.displayName || 'user';
                        return (
                          <div key={reply.id} className="flex items-start justify-between gap-2 text-xs">
                            <div className="flex items-start gap-2 min-w-0">
                              <div className="mt-0.5 shrink-0">
                                <AvatarBadge participant={replyAuthor} size="xs" />
                              </div>
                              <div className="leading-snug break-words">
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold hover:underline cursor-pointer">
                                    {replyHandle}
                                  </span>
                                  <VerifiedIcon type={replyAuthor?.verifiedBadge} />
                                </div>
                                <span className="opacity-90">{renderFormattedText(reply.text || '')}</span>
                                <div className="mt-1 flex items-center gap-3 text-[10px] opacity-60">
                                  <span>{reply.timestampLabel || '30m'}</span>
                                  <button
                                    type="button"
                                    className="font-semibold hover:opacity-100 cursor-pointer"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 5. Post Timestamp & Translation */}
        <div className="mt-2.5 mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider opacity-50">
          <span data-testid="post-timestamp-label">{post?.postTimestampLabel || '2 HOURS AGO'}</span>
          <button type="button" className="font-semibold hover:underline cursor-pointer">
            See translation
          </button>
        </div>
      </div>

      {/* Bottom 5-Tab Navigation Bar: Home -> Reels -> DMs -> Search -> Profile */}
      {showHomeShell &&
        (isAndroid ? (
          <nav
            aria-label="Instagram Android navigation"
            className={cn(
              'mt-auto flex h-12 items-center justify-around border-t px-2',
              dark ? 'border-white/10 bg-black text-white' : 'border-slate-200 bg-white text-slate-900'
            )}
          >
            <Home className="h-5 w-5 fill-current" />
            <Clapperboard className="h-5 w-5 opacity-75" />
            <div className="relative">
              <Send className="h-5 w-5 opacity-80" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-rose-500" />
            </div>
            <Search className="h-5 w-5 opacity-75" />
            <AvatarBadge participant={selfUser ?? author} size="xs" />
          </nav>
        ) : (
          <div className="mt-auto px-3 pb-2 pt-1">
            <nav
              aria-label="Instagram iOS Liquid Glass navigation"
              className={cn(
                'flex h-12 items-center justify-around rounded-full border px-3 shadow-lg backdrop-blur-xl',
                dark
                  ? 'border-white/15 bg-[#1C1C1E]/85 text-white'
                  : 'border-white/90 bg-white/85 text-slate-900'
              )}
            >
              <Home className="h-5 w-5 fill-current" />
              <Clapperboard className="h-5 w-5 opacity-80" />
              <div className="relative">
                <Send className="h-5 w-5 opacity-85" />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-rose-500" />
              </div>
              <Search className="h-5 w-5 opacity-80" />
              <AvatarBadge participant={selfUser ?? author} size="xs" />
            </nav>
          </div>
        ))}
    </div>
  );
}
