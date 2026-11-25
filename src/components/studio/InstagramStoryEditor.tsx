'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  Copy,
  Flame,
  Globe,
  HelpCircle,
  ImagePlus,
  MapPin,
  Music2,
  Plus,
  RotateCw,
  Sparkles,
  Trash2,
  Type,
  Undo2,
  Redo2,
  AtSign,
  Hash,
  BarChart2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives';
import { GENERATOR_MAP } from '@/core/registry/generators';
import { validateImageFileUpload } from '@/core/security/validation';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import type {
  StoryElement,
  StoryFontStyle,
  StoryStickerType,
  VerificationBadgeType,
} from '@/core/types';
import { cn } from '@/lib/utils';

const GRADIENT_PRESETS = [
  {
    name: 'Instagram Sunset',
    value: 'linear-gradient(155deg, #4F46E5 0%, #7C3AED 48%, #EC4899 100%)',
    bg: 'from-indigo-600 via-purple-600 to-pink-500',
  },
  {
    name: 'Midnight Neon',
    value: 'linear-gradient(155deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)',
    bg: 'from-slate-900 via-indigo-950 to-indigo-900',
  },
  {
    name: 'Cherry Glow',
    value: 'linear-gradient(155deg, #881337 0%, #e11d48 50%, #fb7185 100%)',
    bg: 'from-rose-900 via-rose-600 to-rose-400',
  },
  {
    name: 'Cyberpunk Cyan',
    value: 'linear-gradient(155deg, #0f172a 0%, #0369a1 50%, #06b6d4 100%)',
    bg: 'from-slate-900 via-sky-700 to-cyan-500',
  },
  {
    name: 'Emerald Aurora',
    value: 'linear-gradient(155deg, #064e3b 0%, #059669 50%, #10b981 100%)',
    bg: 'from-emerald-900 via-emerald-600 to-emerald-500',
  },
  {
    name: 'Clean Charcoal',
    value: 'linear-gradient(155deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
    bg: 'from-zinc-900 via-zinc-800 to-zinc-700',
  },
];

let elementCounter = 0;
function createStoryElementId(): string {
  elementCounter += 1;
  return `el_story_${elementCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

export function InstagramStoryEditor({
  onOpenScriptImport,
  onRequestClearAll,
}: {
  onOpenScriptImport: () => void;
  onRequestClearAll: () => void;
}) {
  const project = useStudioStore((s) => s.project);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const canUndo = useStudioStore((s) => s.past.length > 0);
  const canRedo = useStudioStore((s) => s.future.length > 0);

  const conv = getActiveConversation(project);
  const manifest = GENERATOR_MAP[project.platformId];
  const story = conv.storyMeta;
  const slides = story?.slides ?? [];
  const activeIdx = story?.activeSlideIndex ?? 0;
  const activeSlide = slides[activeIdx] ?? slides[0];

  const setActiveStorySlide = useStudioStore((s) => s.setActiveStorySlide);
  const updateStorySlide = useStudioStore((s) => s.updateStorySlide);
  const addStorySlide = useStudioStore((s) => s.addStorySlide);
  const deleteStorySlide = useStudioStore((s) => s.deleteStorySlide);

  const addStoryElement = useStudioStore((s) => s.addStoryElement);
  const updateStoryElement = useStudioStore((s) => s.updateStoryElement);
  const deleteStoryElement = useStudioStore((s) => s.deleteStoryElement);
  const duplicateStoryElement = useStudioStore((s) => s.duplicateStoryElement);
  const reorderStoryElement = useStudioStore((s) => s.reorderStoryElement);
  const updateStoryMeta = useStudioStore((s) => s.updateStoryMeta);
  const upsertParticipant = useStudioStore((s) => s.upsertParticipant);

  const selectedElementId = useStudioStore((s) => s.ui.selectedMessageId);
  const setSelectedElementId = useStudioStore((s) => s.setSelectedMessageId);

  const [activeTab, setActiveTabState] = useState<'story' | 'stickers'>('story');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const author =
    project.cast.find((p) => p.id !== conv.selfParticipantId) ?? project.cast[0];

  const selectedElement = (activeSlide?.elements ?? []).find(
    (el) => el.id === selectedElementId
  );

  // Background Image Upload
  const handleBgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      updateStorySlide(activeIdx, { imageDataUrl: safeDataUrl });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid image upload.');
    }
  };

  // Sticker Image Upload
  const handleStickerImageUpload = async (
    elementId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      updateStoryElement(activeIdx, elementId, { imageUrl: safeDataUrl });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid sticker image.');
    }
  };

  // Author Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !author) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      upsertParticipant({ ...author, avatarDataUrl: safeDataUrl });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid avatar upload.');
    }
  };

  // Quick add sticker helper
  const handleAddSticker = (type: StoryStickerType) => {
    const newId = createStoryElementId();
    let newEl: StoryElement = {
      id: newId,
      type,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
    };

    switch (type) {
      case 'mention':
        newEl = { ...newEl, mentionHandle: '@creator', y: 40 };
        break;
      case 'location':
        newEl = { ...newEl, locationName: 'Tokyo, Japan', y: 45 };
        break;
      case 'hashtag':
        newEl = { ...newEl, hashtagText: '#Trending', y: 45 };
        break;
      case 'poll':
        newEl = {
          ...newEl,
          pollQuestion: 'Which design do you prefer?',
          pollOption1: 'Dark Mode',
          pollOption2: 'Light Mode',
          pollVotes1: 75,
          pollVotes2: 25,
          y: 55,
        };
        break;
      case 'question':
        newEl = { ...newEl, questionPrompt: 'Ask me anything!', y: 50 };
        break;
      case 'emoji_slider':
        newEl = {
          ...newEl,
          sliderQuestion: 'How excited are you?',
          sliderEmoji: '😍',
          sliderValue: 85,
          y: 55,
        };
        break;
      case 'countdown':
        newEl = {
          ...newEl,
          countdownName: 'Product Launch',
          countdownTarget: '01d 12h 45m',
          y: 60,
        };
        break;
      case 'link':
        newEl = {
          ...newEl,
          linkUrl: 'https://chatforge.dev',
          linkText: 'chatforge.dev ↗',
          y: 70,
        };
        break;
      case 'music':
        newEl = {
          ...newEl,
          musicTrack: 'Midnight Vibe',
          musicArtist: 'Synth Wave',
          y: 35,
        };
        break;
      case 'image_overlay':
        newEl = { ...newEl, y: 50 };
        break;
      case 'text':
      default:
        newEl = {
          ...newEl,
          text: 'Tap to edit text',
          fontStyle: 'classic',
          color: '#ffffff',
          bgColor: 'black',
          y: 30,
        };
        break;
    }

    addStoryElement(activeIdx, newEl);
    setSelectedElementId(newId);
    setActiveTabState('stickers');
  };

  return (
    <div
      data-testid="instagram-story-dedicated-editor"
      className="flex h-full flex-col bg-slate-50 dark:bg-slate-950"
    >
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTabState(v as 'story' | 'stickers')}
        className="flex h-full flex-col"
      >
        {/* Header bar */}
        <div className="border-b border-slate-200 px-3.5 py-2.5 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              data-testid="platform-editor-badge"
              className="truncate text-[11px] font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400"
            >
              {manifest?.editorBadge ?? '9:16 Story Frame Studio'}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Undo"
                className="h-7 w-7 p-0"
              >
                <Undo2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Redo"
                className="h-7 w-7 p-0"
              >
                <Redo2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <TabsList className="w-full">
            <TabsTrigger value="story">Story & Media</TabsTrigger>
            <TabsTrigger value="stickers">
              Stickers ({activeSlide?.elements?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          {uploadError && (
            <div
              role="alert"
              data-testid="upload-validation-error"
              className="mt-2 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              {uploadError}
            </div>
          )}
        </div>

        {/* TAB 1: STORY & MEDIA */}
        <TabsContent value="story" className="flex-1 space-y-4 overflow-y-auto p-3.5">
          {/* Slide Manager */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Story Slides ({activeIdx + 1}/{slides.length})
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onOpenScriptImport}
                  className="h-7 px-2 text-[11px] text-pink-700 dark:text-pink-300"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Script
                </Button>
                <button
                  type="button"
                  onClick={onRequestClearAll}
                  className="cursor-pointer text-[11px] font-medium text-rose-600 hover:underline"
                >
                  Clear all
                </button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addStorySlide}
                  className="h-7 px-2 text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Slide
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {slides.map((s, idx) => (
                <div key={s.id} className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    size="sm"
                    variant={idx === activeIdx ? 'default' : 'outline'}
                    onClick={() => setActiveStorySlide(idx)}
                    className="h-7 px-2.5 text-xs"
                  >
                    Slide {idx + 1}
                  </Button>
                  {slides.length > 1 && idx === activeIdx && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteStorySlide(idx)}
                      title="Delete this slide"
                      className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Headline & Subtitle (Fully preserves existing test contracts) */}
          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Slide Typography
            </span>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              Headline Text
              <Textarea
                aria-label="Headline Text"
                className="mt-1 min-h-[56px] text-xs"
                value={activeSlide?.headlineText ?? ''}
                onChange={(e) =>
                  updateStorySlide(activeIdx, { headlineText: e.target.value })
                }
                placeholder="Launching tonight ✨"
              />
            </label>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              Subtitle
              <Input
                aria-label="Subtitle"
                className="mt-1 h-8 text-xs"
                value={activeSlide?.subText ?? ''}
                onChange={(e) =>
                  updateStorySlide(activeIdx, { subText: e.target.value })
                }
                placeholder="Zero watermarks. Crisp HD exports."
              />
            </label>
          </div>

          {/* Background Gradient & Photo */}
          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Background Style
              </span>
              {activeSlide?.imageDataUrl && (
                <button
                  type="button"
                  onClick={() => updateStorySlide(activeIdx, { imageDataUrl: undefined })}
                  className="text-[11px] font-medium text-rose-600 hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Gradient Swatches */}
            <div className="grid grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() =>
                    updateStorySlide(activeIdx, {
                      backgroundCss: g.value,
                      imageDataUrl: undefined,
                    })
                  }
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg border p-1.5 text-center transition-all cursor-pointer',
                    activeSlide?.backgroundCss === g.value && !activeSlide?.imageDataUrl
                      ? 'border-pink-500 ring-2 ring-pink-400'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                  )}
                >
                  <div
                    className={cn('h-8 w-full rounded-md bg-gradient-to-br', g.bg)}
                  />
                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400 truncate w-full">
                    {g.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Upload Background Photo */}
            <div className="pt-1">
              <label className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <ImagePlus className="h-4 w-4" />
                <span>Upload Background Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload story background"
                  onChange={handleBgImageUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Author & Profile Settings */}
          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Story Author Profile
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Username (@handle)
                <Input
                  aria-label="Author username"
                  className="mt-1 h-8 text-xs"
                  value={author?.handle ?? ''}
                  onChange={(e) =>
                    author && upsertParticipant({ ...author, handle: e.target.value })
                  }
                  placeholder="@mayalin.creates"
                />
              </label>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Display Name
                <Input
                  aria-label="Author display name"
                  className="mt-1 h-8 text-xs"
                  value={author?.displayName ?? ''}
                  onChange={(e) =>
                    author &&
                    upsertParticipant({ ...author, displayName: e.target.value })
                  }
                  placeholder="Maya Lin"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Story Timestamp
                <Input
                  aria-label="Story timestamp"
                  className="mt-1 h-8 text-xs"
                  value={activeSlide?.postedAtLabel ?? '2h'}
                  onChange={(e) =>
                    updateStorySlide(activeIdx, { postedAtLabel: e.target.value })
                  }
                  placeholder="2h"
                />
              </label>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Verified Badge
                <select
                  aria-label="Author verified badge"
                  value={author?.verifiedBadge ?? 'blue'}
                  onChange={(e) =>
                    author &&
                    upsertParticipant({
                      ...author,
                      verifiedBadge: e.target.value as VerificationBadgeType,
                    })
                  }
                  className="mt-1 flex h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="blue">Blue Verified ✓</option>
                  <option value="none">No Badge</option>
                </select>
              </label>
            </div>

            <div className="pt-1">
              <label className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Camera className="h-3.5 w-3.5" />
                <span>Upload Author Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload author avatar"
                  onChange={handleAvatarUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {/* Music & Views */}
          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Story Badges & Metrics
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Music Label
                <Input
                  aria-label="Music label"
                  className="mt-1 h-8 text-xs"
                  value={activeSlide?.musicLabel ?? ''}
                  onChange={(e) =>
                    updateStorySlide(activeIdx, { musicLabel: e.target.value })
                  }
                  placeholder="Midnight Synth • Studio Mix"
                />
              </label>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Viewer Count
                <Input
                  type="number"
                  aria-label="Viewer count"
                  className="mt-1 h-8 text-xs"
                  value={story?.viewerCount ?? 1428}
                  onChange={(e) =>
                    updateStoryMeta({ viewerCount: Number(e.target.value) || 0 })
                  }
                />
              </label>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: STICKERS & CANVAS ELEMENTS */}
        <TabsContent value="stickers" className="flex-1 space-y-4 overflow-y-auto p-3.5">
          {/* Quick Add Buttons */}
          <div className="space-y-2 rounded-xl border border-pink-200/80 bg-pink-50/40 p-3 dark:border-pink-900/60 dark:bg-pink-950/20">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Add Instagram Sticker
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('text')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <Type className="mr-1.5 h-3.5 w-3.5 text-pink-600" /> Text
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('mention')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <AtSign className="mr-1.5 h-3.5 w-3.5 text-purple-600" /> Mention
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('location')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-rose-500" /> Location
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('hashtag')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <Hash className="mr-1.5 h-3.5 w-3.5 text-indigo-600" /> Hashtag
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('poll')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <BarChart2 className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> Poll
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('question')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-amber-500" /> Question
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('emoji_slider')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <Flame className="mr-1.5 h-3.5 w-3.5 text-orange-500" /> Slider
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('countdown')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <Calendar className="mr-1.5 h-3.5 w-3.5 text-pink-500" /> Countdown
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('link')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <Globe className="mr-1.5 h-3.5 w-3.5 text-blue-500" /> Link
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('music')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <Music2 className="mr-1.5 h-3.5 w-3.5 text-purple-500" /> Music
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddSticker('image_overlay')}
                className="h-8 justify-start px-2 text-[11px]"
              >
                <ImagePlus className="mr-1.5 h-3.5 w-3.5 text-teal-600" /> Image
              </Button>
            </div>
          </div>

          {/* Active Element Inspector */}
          {selectedElement ? (
            <div className="space-y-3 rounded-xl border border-indigo-200 bg-white p-3.5 dark:border-indigo-900/60 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Selected: {selectedElement.type.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => reorderStoryElement(activeIdx, selectedElement.id, 'up')}
                    aria-label="Bring forward"
                    title="Bring forward"
                    className="h-7 w-7 p-0"
                  >
                    <ArrowUp className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => reorderStoryElement(activeIdx, selectedElement.id, 'down')}
                    aria-label="Send backward"
                    title="Send backward"
                    className="h-7 w-7 p-0"
                  >
                    <ArrowDown className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => duplicateStoryElement(activeIdx, selectedElement.id)}
                    aria-label="Duplicate element"
                    title="Duplicate element"
                    className="h-7 w-7 p-0"
                  >
                    <Copy className="h-3.5 w-3.5 text-slate-500" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteStoryElement(activeIdx, selectedElement.id)}
                    aria-label="Delete element"
                    title="Delete element"
                    className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Dynamic Inputs per Sticker Type */}
              {selectedElement.type === 'text' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Text Content
                    <Input
                      aria-label="Sticker text content"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.text ?? ''}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          text: e.target.value,
                        })
                      }
                      placeholder="Type sticker text..."
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Font Style
                      <select
                        aria-label="Sticker font style"
                        value={selectedElement.fontStyle ?? 'classic'}
                        onChange={(e) =>
                          updateStoryElement(activeIdx, selectedElement.id, {
                            fontStyle: e.target.value as StoryFontStyle,
                          })
                        }
                        className="mt-1 flex h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                      >
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                        <option value="neon">Neon</option>
                        <option value="typewriter">Typewriter</option>
                        <option value="strong">Strong</option>
                      </select>
                    </label>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Background Pill
                      <select
                        aria-label="Sticker background pill"
                        value={selectedElement.bgColor ?? 'black'}
                        onChange={(e) =>
                          updateStoryElement(activeIdx, selectedElement.id, {
                            bgColor: e.target.value,
                          })
                        }
                        className="mt-1 flex h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                      >
                        <option value="black">Black Pill</option>
                        <option value="white">White Pill</option>
                        <option value="gradient">Gradient Pill</option>
                        <option value="transparent">None (Transparent)</option>
                      </select>
                    </label>
                  </div>
                </div>
              )}

              {selectedElement.type === 'mention' && (
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Mention Handle
                  <Input
                    aria-label="Mention handle"
                    className="mt-1 h-8 text-xs"
                    value={selectedElement.mentionHandle ?? ''}
                    onChange={(e) =>
                      updateStoryElement(activeIdx, selectedElement.id, {
                        mentionHandle: e.target.value,
                      })
                    }
                    placeholder="@username"
                  />
                </label>
              )}

              {selectedElement.type === 'location' && (
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Location Name
                  <Input
                    aria-label="Location name"
                    className="mt-1 h-8 text-xs"
                    value={selectedElement.locationName ?? ''}
                    onChange={(e) =>
                      updateStoryElement(activeIdx, selectedElement.id, {
                        locationName: e.target.value,
                      })
                    }
                    placeholder="Location"
                  />
                </label>
              )}

              {selectedElement.type === 'hashtag' && (
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Hashtag
                  <Input
                    aria-label="Hashtag text"
                    className="mt-1 h-8 text-xs"
                    value={selectedElement.hashtagText ?? ''}
                    onChange={(e) =>
                      updateStoryElement(activeIdx, selectedElement.id, {
                        hashtagText: e.target.value,
                      })
                    }
                    placeholder="#trending"
                  />
                </label>
              )}

              {selectedElement.type === 'poll' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Poll Question
                    <Input
                      aria-label="Poll question"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.pollQuestion ?? ''}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          pollQuestion: e.target.value,
                        })
                      }
                      placeholder="Which do you like?"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Option 1
                      <Input
                        aria-label="Poll option 1"
                        className="mt-1 h-8 text-xs"
                        value={selectedElement.pollOption1 ?? 'Yes'}
                        onChange={(e) =>
                          updateStoryElement(activeIdx, selectedElement.id, {
                            pollOption1: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Option 2
                      <Input
                        aria-label="Poll option 2"
                        className="mt-1 h-8 text-xs"
                        value={selectedElement.pollOption2 ?? 'No'}
                        onChange={(e) =>
                          updateStoryElement(activeIdx, selectedElement.id, {
                            pollOption2: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Votes 1
                      <Input
                        type="number"
                        aria-label="Poll votes 1"
                        className="mt-1 h-8 text-xs"
                        value={selectedElement.pollVotes1 ?? 75}
                        onChange={(e) =>
                          updateStoryElement(activeIdx, selectedElement.id, {
                            pollVotes1: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Votes 2
                      <Input
                        type="number"
                        aria-label="Poll votes 2"
                        className="mt-1 h-8 text-xs"
                        value={selectedElement.pollVotes2 ?? 25}
                        onChange={(e) =>
                          updateStoryElement(activeIdx, selectedElement.id, {
                            pollVotes2: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              )}

              {selectedElement.type === 'question' && (
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Question Prompt
                  <Input
                    aria-label="Question prompt"
                    className="mt-1 h-8 text-xs"
                    value={selectedElement.questionPrompt ?? ''}
                    onChange={(e) =>
                      updateStoryElement(activeIdx, selectedElement.id, {
                        questionPrompt: e.target.value,
                      })
                    }
                    placeholder="Ask me a question"
                  />
                </label>
              )}

              {selectedElement.type === 'emoji_slider' && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Prompt Question
                    <Input
                      aria-label="Slider question"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.sliderQuestion ?? ''}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          sliderQuestion: e.target.value,
                        })
                      }
                      placeholder="How hyped are you?"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Slider Emoji
                      <Input
                        aria-label="Slider emoji"
                        className="mt-1 h-8 text-xs"
                        value={selectedElement.sliderEmoji ?? '🔥'}
                        onChange={(e) =>
                          updateStoryElement(activeIdx, selectedElement.id, {
                            sliderEmoji: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Value ({selectedElement.sliderValue ?? 85}%)
                      <input
                        type="range"
                        min="0"
                        max="100"
                        aria-label="Slider percentage value"
                        className="mt-2 w-full"
                        value={selectedElement.sliderValue ?? 85}
                        onChange={(e) =>
                          updateStoryElement(activeIdx, selectedElement.id, {
                            sliderValue: Number(e.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              )}

              {selectedElement.type === 'countdown' && (
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Event Name
                    <Input
                      aria-label="Countdown name"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.countdownName ?? ''}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          countdownName: e.target.value,
                        })
                      }
                      placeholder="Launch Party"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Target Time
                    <Input
                      aria-label="Countdown target"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.countdownTarget ?? '02 : 14 : 35'}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          countdownTarget: e.target.value,
                        })
                      }
                      placeholder="02 : 14 : 35"
                    />
                  </label>
                </div>
              )}

              {selectedElement.type === 'link' && (
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Link URL
                    <Input
                      aria-label="Link sticker URL"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.linkUrl ?? ''}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          linkUrl: e.target.value,
                        })
                      }
                      placeholder="https://chatforge.dev"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Sticker Text
                    <Input
                      aria-label="Link sticker text"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.linkText ?? ''}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          linkText: e.target.value,
                        })
                      }
                      placeholder="chatforge.dev ↗"
                    />
                  </label>
                </div>
              )}

              {selectedElement.type === 'music' && (
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Track Title
                    <Input
                      aria-label="Music sticker track"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.musicTrack ?? ''}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          musicTrack: e.target.value,
                        })
                      }
                      placeholder="Song Title"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                    Artist Name
                    <Input
                      aria-label="Music sticker artist"
                      className="mt-1 h-8 text-xs"
                      value={selectedElement.musicArtist ?? ''}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          musicArtist: e.target.value,
                        })
                      }
                      placeholder="Artist"
                    />
                  </label>
                </div>
              )}

              {selectedElement.type === 'image_overlay' && (
                <div>
                  <label className="flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <ImagePlus className="h-3.5 w-3.5" />
                    <span>Upload Sticker Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      aria-label="Upload sticker image"
                      onChange={(e) => handleStickerImageUpload(selectedElement.id, e)}
                      className="sr-only"
                    />
                  </label>
                </div>
              )}

              {/* Geometry: Positioning, Scale & Rotation */}
              <div className="space-y-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500">
                      Position X ({selectedElement.x}%)
                    </span>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      aria-label="Element Position X"
                      value={selectedElement.x}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          x: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">
                      Position Y ({selectedElement.y}%)
                    </span>
                    <input
                      type="range"
                      min="12"
                      max="88"
                      aria-label="Element Position Y"
                      value={selectedElement.y}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          y: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500">
                      Scale ({selectedElement.scale ?? 1}x)
                    </span>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      aria-label="Element Scale"
                      value={selectedElement.scale ?? 1}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          scale: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">
                      Rotation ({selectedElement.rotation ?? 0}°)
                    </span>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      aria-label="Element Rotation"
                      value={selectedElement.rotation ?? 0}
                      onChange={(e) =>
                        updateStoryElement(activeIdx, selectedElement.id, {
                          rotation: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Alignment Quick Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-medium text-slate-500">Align:</span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStoryElement(activeIdx, selectedElement.id, { x: 25 })
                      }
                      className="h-6 px-2 text-[10px]"
                    >
                      Left
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStoryElement(activeIdx, selectedElement.id, { x: 50 })
                      }
                      className="h-6 px-2 text-[10px]"
                    >
                      Center
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStoryElement(activeIdx, selectedElement.id, { x: 75 })
                      }
                      className="h-6 px-2 text-[10px]"
                    >
                      Right
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        updateStoryElement(activeIdx, selectedElement.id, { rotation: 0 })
                      }
                      className="h-6 px-1.5 text-[10px] text-slate-500"
                    >
                      <RotateCw className="h-3 w-3" /> 0°
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500 dark:border-slate-800">
              Tap a sticker on the canvas or click one of the add buttons above to edit its position and content.
            </div>
          )}

          {/* List of Stickers on Active Slide */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Stickers on this slide ({activeSlide?.elements?.length ?? 0})
            </span>
            <div className="space-y-1">
              {(activeSlide?.elements ?? []).map((el) => (
                <div
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-xs transition-colors cursor-pointer',
                    selectedElementId === el.id
                      ? 'border-pink-500 bg-pink-50/70 dark:bg-pink-950/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                  )}
                >
                  <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                    <span className="capitalize text-slate-500">{el.type.replace('_', ' ')}:</span>{' '}
                    {el.text ||
                      el.mentionHandle ||
                      el.locationName ||
                      el.hashtagText ||
                      el.pollQuestion ||
                      el.linkText ||
                      el.countdownName ||
                      'Sticker'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStoryElement(activeIdx, el.id);
                      }}
                      aria-label="Delete sticker"
                      className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
