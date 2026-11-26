'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Camera,
  Copy,
  ImagePlus,
  Plus,
  Sparkles,
  Trash2,
  UserPlus,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives';
import { GENERATOR_MAP } from '@/core/registry/generators';
import { validateImageFileUpload } from '@/core/security/validation';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import { WhatsAppGroupEditor } from '@/components/studio/WhatsAppGroupEditor';
import { InstagramDmEditor } from '@/components/studio/InstagramDmEditor';
import { InstagramStoryEditor } from '@/components/studio/InstagramStoryEditor';
import { InstagramPostEditor } from '@/components/studio/InstagramPostEditor';
import { ImessageEditor } from '@/components/studio/ImessageEditor';
import type { MessageType, ReadReceiptStatus, VerificationBadgeType } from '@/core/types';
import { cn } from '@/lib/utils';

export function LeftEditorPanel({
  onOpenScriptImport,
  onRequestClearAll,
}: {
  onOpenScriptImport: () => void;
  onRequestClearAll: () => void;
}) {
  const project = useStudioStore((s) => s.project);
  const ui = useStudioStore((s) => s.ui);
  const addMessage = useStudioStore((s) => s.addMessage);
  const updateMessage = useStudioStore((s) => s.updateMessage);
  const duplicateMessage = useStudioStore((s) => s.duplicateMessage);
  const switchMessageSender = useStudioStore((s) => s.switchMessageSender);
  const deleteMessage = useStudioStore((s) => s.deleteMessage);
  const moveMessage = useStudioStore((s) => s.moveMessage);
  const toggleMessageReaction = useStudioStore((s) => s.toggleMessageReaction);
  const upsertParticipant = useStudioStore((s) => s.upsertParticipant);
  const deleteParticipant = useStudioStore((s) => s.deleteParticipant);
  const setSelfParticipant = useStudioStore((s) => s.setSelfParticipant);
  const updateGroupMeta = useStudioStore((s) => s.updateGroupMeta);
  const updatePostMeta = useStudioStore((s) => s.updatePostMeta);
  const updateStorySlide = useStudioStore((s) => s.updateStorySlide);
  const setActiveStorySlide = useStudioStore((s) => s.setActiveStorySlide);
  const updateCallMeta = useStudioStore((s) => s.updateCallMeta);
  const setActiveTab = useStudioStore((s) => s.setActiveTab);

  const conv = getActiveConversation(project);
  const manifest = GENERATOR_MAP[project.platformId];

  const [composerText, setComposerText] = useState('');
  const [composerSenderId, setComposerSenderId] = useState(conv.selfParticipantId);
  const [composerType, setComposerType] = useState<MessageType>('text');
  const [composerTime, setComposerTime] = useState('9:42 AM');
  const [composerReceipt, setComposerReceipt] = useState<ReadReceiptStatus>('read');
  const [composerForwarded, setComposerForwarded] = useState<
    'none' | 'forwarded' | 'frequently_forwarded'
  >('none');
  const [composerReplyToId, setComposerReplyToId] = useState<string>('');
  const [composerCallOutcome, setComposerCallOutcome] = useState<
    'answered' | 'missed' | 'declined'
  >('missed');
  const [composerCallMedia, setComposerCallMedia] = useState<'voice' | 'video'>('voice');
  const [newMemberName, setNewMemberName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const effectiveSenderId = project.cast.some((p) => p.id === composerSenderId)
    ? composerSenderId
    : conv.selfParticipantId;

  if (project.platformId === 'whatsapp-group-chat') {
    return (
      <WhatsAppGroupEditor
        onOpenScriptImport={onOpenScriptImport}
        onRequestClearAll={onRequestClearAll}
      />
    );
  }

  if (project.platformId === 'instagram-dm') {
    return (
      <InstagramDmEditor
        onOpenScriptImport={onOpenScriptImport}
        onRequestClearAll={onRequestClearAll}
      />
    );
  }

  if (project.platformId === 'instagram-story') {
    return (
      <InstagramStoryEditor
        onOpenScriptImport={onOpenScriptImport}
        onRequestClearAll={onRequestClearAll}
      />
    );
  }

  if (project.platformId === 'instagram-post') {
    return (
      <InstagramPostEditor
        onOpenScriptImport={onOpenScriptImport}
        onRequestClearAll={onRequestClearAll}
      />
    );
  }

  if (project.platformId === 'imessage') {
    return (
      <ImessageEditor
        onOpenScriptImport={onOpenScriptImport}
        onRequestClearAll={onRequestClearAll}
      />
    );
  }

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && composerType === 'text') return;
    const defaultTextByType: Partial<Record<MessageType, string>> = {
      unread_divider: '1 UNREAD MESSAGE',
      date_separator: 'Today',
      sticker: '🎉',
      audio: 'Studio-Voice-Mix.mp3',
      video_preview: 'Quick studio clip preview',
    };
    addMessage({
      senderId: effectiveSenderId,
      type: composerType,
      text:
        composerText.trim() ||
        defaultTextByType[composerType] ||
        `${composerType.replace('_', ' ')} attachment`,
      timestampLabel: composerTime.trim() || '9:42 AM',
      readStatus: composerReceipt,
      forwardedLabel: composerForwarded,
      replyToMessageId: composerReplyToId || undefined,
      callOutcome: composerCallOutcome,
      callMedia: composerCallMedia,
    });
    setComposerText('');
    setComposerReplyToId('');
    setComposerForwarded('none');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      addMessage({
        senderId: effectiveSenderId,
        type: 'image',
        text: composerText.trim(),
        timestampLabel: composerTime.trim() || '9:42 AM',
        imageDataUrl: safeDataUrl,
      });
      setComposerText('');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid image upload.');
    }
  };

  const handleParticipantAvatarUpload = async (
    participant: (typeof project.cast)[number],
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      upsertParticipant({ ...participant, avatarDataUrl: safeDataUrl });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid avatar upload.');
    }
  };

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const colors = ['#4F46E5', '#059669', '#2563EB', '#DB2777', '#D97706'];
    upsertParticipant({
      id: `part_${Date.now()}`,
      displayName: newMemberName.trim(),
      handle: `@${newMemberName.trim().toLowerCase().replace(/\s+/g, '')}`,
      avatarFallbackColor: colors[project.cast.length % colors.length],
      nameColorHex: colors[project.cast.length % colors.length],
      verifiedBadge: 'none',
    });
    setNewMemberName('');
  };

  const activeTabValue =
    ui.activeTab === 'participants' ? 'participants' : 'messages';

  return (
    <div className="flex h-full flex-col">
      <Tabs
        value={activeTabValue}
        onValueChange={(v) => setActiveTab(v as 'messages' | 'participants')}
        className="flex h-full flex-col"
      >
        <div className="border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              data-testid="platform-editor-badge"
              className="truncate text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400"
            >
              {manifest?.editorBadge ?? manifest?.name ?? 'Platform Editor'}
            </span>
          </div>
          <TabsList className="w-full">
            <TabsTrigger value="messages">
              {project.archetype === 'ephemeral_story'
                ? 'Story Slides'
                : project.archetype === 'social_post'
                  ? 'Post & Caption'
                  : project.archetype === 'call_screen'
                    ? 'Call Controls'
                    : 'Messages'}
            </TabsTrigger>
            <TabsTrigger value="participants">
              <Users className="mr-1.5 h-3.5 w-3.5" />
              People ({project.cast.length})
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

        {/* TAB 1: CONTENT / MESSAGES */}
        <TabsContent value="messages" className="flex-1 space-y-4 overflow-y-auto p-3.5">
          {project.archetype === 'ephemeral_story' && conv.storyMeta && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Active Slide ({conv.storyMeta.activeSlideIndex + 1}/
                  {conv.storyMeta.slides.length})
                </span>
                <div className="flex gap-1">
                  {conv.storyMeta.slides.map((s, idx) => (
                    <Button
                      key={s.id}
                      type="button"
                      size="sm"
                      variant={
                        conv.storyMeta?.activeSlideIndex === idx ? 'default' : 'outline'
                      }
                      onClick={() => setActiveStorySlide(idx)}
                    >
                      Slide {idx + 1}
                    </Button>
                  ))}
                </div>
              </div>
              {(() => {
                const active =
                  conv.storyMeta.slides[conv.storyMeta.activeSlideIndex] ??
                  conv.storyMeta.slides[0];
                return (
                  <div className="space-y-2.5">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Headline Text
                      <Textarea
                        className="mt-1"
                        value={active.headlineText}
                        onChange={(e) =>
                          updateStorySlide(conv.storyMeta!.activeSlideIndex, {
                            headlineText: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Subtitle
                      <Input
                        className="mt-1"
                        value={active.subText ?? ''}
                        onChange={(e) =>
                          updateStorySlide(conv.storyMeta!.activeSlideIndex, {
                            subText: e.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                      Poll Question
                      <Input
                        className="mt-1"
                        value={active.pollQuestion ?? ''}
                        onChange={(e) =>
                          updateStorySlide(conv.storyMeta!.activeSlideIndex, {
                            pollQuestion: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                );
              })()}
            </div>
          )}

          {project.archetype === 'social_post' && conv.postMeta && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Location Tag
                <Input
                  className="mt-1"
                  value={conv.postMeta.locationLabel ?? ''}
                  onChange={(e) => updatePostMeta({ locationLabel: e.target.value })}
                />
              </label>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Post Caption
                <Textarea
                  className="mt-1"
                  value={conv.postMeta.caption}
                  onChange={(e) => updatePostMeta({ caption: e.target.value })}
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Likes
                  <Input
                    type="number"
                    className="mt-1"
                    value={conv.postMeta.likeCount}
                    onChange={(e) =>
                      updatePostMeta({ likeCount: Number(e.target.value) || 0 })
                    }
                  />
                </label>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Aspect Ratio
                  <select
                    value={conv.postMeta.aspectRatio}
                    onChange={(e) =>
                      updatePostMeta({
                        aspectRatio: e.target.value as '1:1' | '4:5',
                      })
                    }
                    className="mt-1 flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="4:5">4:5 Portrait</option>
                    <option value="1:1">1:1 Square</option>
                  </select>
                </label>
              </div>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium dark:border-slate-800">
                <span>Simulate &ldquo;...more&rdquo; truncation</span>
                <input
                  type="checkbox"
                  checked={conv.postMeta.simulateMoreCutoff}
                  onChange={(e) =>
                    updatePostMeta({ simulateMoreCutoff: e.target.checked })
                  }
                />
              </label>
            </div>
          )}

          {project.archetype === 'call_screen' && conv.callMeta && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Call Platform Skin
                <select
                  value={conv.callMeta.callPlatform}
                  onChange={(e) =>
                    updateCallMeta({
                      callPlatform: e.target.value as NonNullable<
                        typeof conv.callMeta
                      >['callPlatform'],
                    })
                  }
                  className="mt-1 flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="whatsapp-voice">WhatsApp Voice Call</option>
                  <option value="whatsapp-video">WhatsApp Video Call</option>
                  <option value="ios-phone">iPhone Call</option>
                  <option value="facetime">FaceTime</option>
                  <option value="instagram-video">Instagram Video Call</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Call State
                <select
                  value={conv.callMeta.direction}
                  onChange={(e) =>
                    updateCallMeta({
                      direction: e.target.value as 'incoming' | 'outgoing' | 'active',
                    })
                  }
                  className="mt-1 flex h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="incoming">Incoming Ringing</option>
                  <option value="outgoing">Outgoing Calling</option>
                  <option value="active">Active Connected Timer</option>
                </select>
              </label>

              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Header Subtitle
                <Input
                  className="mt-1"
                  value={conv.callMeta.callStateLabel}
                  onChange={(e) => updateCallMeta({ callStateLabel: e.target.value })}
                />
              </label>
            </div>
          )}

          {/* Chat Thread Controls */}
          {project.archetype === 'chat_thread' && (
            <>
              {conv.groupMeta && (
                <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-900/60">
                  <label className="block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Group / Channel Name
                    <Input
                      className="mt-1 h-8 bg-white dark:bg-slate-950"
                      value={conv.groupMeta.groupName}
                      onChange={(e) => updateGroupMeta({ groupName: e.target.value })}
                    />
                  </label>
                </div>
              )}

              {/* Quick Composer */}
              <form
                onSubmit={handleAddMessage}
                className="space-y-2.5 rounded-xl border border-indigo-200/80 bg-indigo-50/40 p-3 dark:border-indigo-900/60 dark:bg-indigo-950/20"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Add Message
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onOpenScriptImport}
                    className="h-7 px-2 text-[11px] text-indigo-700 dark:text-indigo-300"
                  >
                    <Sparkles className="h-3 w-3" />
                    Paste Script
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Message sender"
                    value={effectiveSenderId}
                    onChange={(e) => setComposerSenderId(e.target.value)}
                    className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                  >
                    {project.cast.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.displayName} {p.id === conv.selfParticipantId ? '(You)' : ''}
                      </option>
                    ))}
                  </select>

                  <select
                    aria-label="Message type"
                    value={composerType}
                    onChange={(e) => setComposerType(e.target.value as MessageType)}
                    className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-700 dark:bg-slate-900"
                  >
                    {(manifest?.capabilities.supportedMessageTypes ?? ['text']).map(
                      (t) => (
                        <option key={t} value={t}>
                          {t.replace('_', ' ')}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <Textarea
                  aria-label="Message text"
                  placeholder={
                    composerType === 'unread_divider'
                      ? '1 UNREAD MESSAGE'
                      : composerType === 'date_separator'
                        ? 'Yesterday / November 25'
                        : 'Type dialogue or caption (Enter for line breaks)...'
                  }
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  className="min-h-[66px] bg-white text-xs dark:bg-slate-950"
                />

                <div className="flex flex-wrap items-center gap-1">
                  <span className="mr-1 text-[10px] font-medium text-slate-500">
                    Quick emoji:
                  </span>
                  {['😊', '😂', '❤️', '👍', '🔥', '🎉', '🙏', '👀'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      aria-label={`Insert emoji ${em}`}
                      onClick={() => setComposerText((prev) => `${prev}${em}`)}
                      className="rounded px-1.5 py-0.5 text-xs hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    aria-label="Message timestamp"
                    value={composerTime}
                    onChange={(e) => setComposerTime(e.target.value)}
                    placeholder="9:42 AM"
                    className="h-8 bg-white text-xs dark:bg-slate-950"
                  />
                  <select
                    aria-label="Read receipt status"
                    value={composerReceipt}
                    onChange={(e) =>
                      setComposerReceipt(e.target.value as ReadReceiptStatus)
                    }
                    className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="read">Read (Blue)</option>
                    <option value="delivered">Delivered</option>
                    <option value="sent">Sent</option>
                    <option value="none">No Receipt</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Forwarded status"
                    value={composerForwarded}
                    onChange={(e) =>
                      setComposerForwarded(
                        e.target.value as 'none' | 'forwarded' | 'frequently_forwarded'
                      )
                    }
                    className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="none">Not Forwarded</option>
                    <option value="forwarded">Forwarded</option>
                    <option value="frequently_forwarded">Forwarded Many Times</option>
                  </select>
                  {conv.messages.some((m) => m.senderId !== 'system') && (
                    <select
                      aria-label="Reply to message"
                      value={composerReplyToId}
                      onChange={(e) => setComposerReplyToId(e.target.value)}
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="">No reply quote</option>
                      {conv.messages
                        .filter((m) => m.senderId !== 'system' && m.text)
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            Reply to: {(m.text ?? '').slice(0, 28)}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                {composerType === 'call_event' && (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      aria-label="Call outcome"
                      value={composerCallOutcome}
                      onChange={(e) =>
                        setComposerCallOutcome(
                          e.target.value as 'answered' | 'missed' | 'declined'
                        )
                      }
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="missed">Missed Call</option>
                      <option value="answered">Answered Call</option>
                      <option value="declined">Declined Call</option>
                    </select>
                    <select
                      aria-label="Call media type"
                      value={composerCallMedia}
                      onChange={(e) =>
                        setComposerCallMedia(e.target.value as 'voice' | 'video')
                      }
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="voice">Voice Call</option>
                      <option value="video">Video Call</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    size="sm"
                    className="flex-1"
                    data-testid="add-message-btn"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add to Chat
                  </Button>
                  <label
                    title="Attach image"
                    className="inline-flex h-8 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </form>

              {/* Message List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Timeline ({conv.messages.length} items)
                  </span>
                  {conv.messages.length > 0 && (
                    <button
                      type="button"
                      onClick={onRequestClearAll}
                      className="text-[11px] font-medium text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {conv.messages.map((m, idx) => {
                  const sender = project.cast.find((p) => p.id === m.senderId);
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        'rounded-xl border p-2.5 text-xs transition-colors',
                        ui.selectedMessageId === m.id
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                          {m.senderId === 'system'
                            ? 'System'
                            : sender?.displayName ?? 'Sender'}{' '}
                          <span className="font-normal text-slate-400">
                            • {m.type}
                          </span>
                        </span>
                        <div className="flex items-center gap-0.5">
                          {m.senderId !== 'system' && (
                            <button
                              type="button"
                              onClick={() => switchMessageSender(m.id)}
                              title="Switch sender"
                              aria-label="Switch sender"
                              className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            >
                              <ArrowLeftRight className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => duplicateMessage(m.id)}
                            title="Duplicate message"
                            aria-label="Duplicate message"
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMessage(m.id, 'up')}
                            disabled={idx === 0}
                            aria-label="Move message up"
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveMessage(m.id, 'down')}
                            disabled={idx === conv.messages.length - 1}
                            aria-label="Move message down"
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMessage(m.id)}
                            aria-label="Delete message"
                            className="rounded p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={1}
                        aria-label="Edit message content"
                        value={m.text ?? ''}
                        onChange={(e) =>
                          updateMessage(m.id, { text: e.target.value })
                        }
                        className="mt-1.5 w-full resize-y rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                      />

                      {m.senderId !== 'system' && (
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-0.5">
                            {['❤️', '😂', '😮', '👍', '🔥'].map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => toggleMessageReaction(m.id, emoji)}
                                className={cn(
                                  'rounded px-1 py-0.5 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
                                  m.reactions.some((r) => r.emoji === emoji) &&
                                    'bg-indigo-100 dark:bg-indigo-900/60'
                                )}
                              >
                                {emoji}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                updateMessage(m.id, {
                                  forwardedLabel:
                                    m.forwardedLabel === 'forwarded' ? 'none' : 'forwarded',
                                })
                              }
                              aria-label="Toggle forwarded badge"
                              className={cn(
                                'ml-1 rounded border px-1.5 py-0.5 text-[10px] font-medium cursor-pointer',
                                m.forwardedLabel && m.forwardedLabel !== 'none'
                                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                                  : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700'
                              )}
                            >
                              Fwd
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <select
                              aria-label="Receipt status for message"
                              value={m.readReceipt.status}
                              onChange={(e) =>
                                updateMessage(m.id, {
                                  readReceipt: {
                                    ...m.readReceipt,
                                    status: e.target.value as ReadReceiptStatus,
                                  },
                                })
                              }
                              className="h-6 rounded border border-slate-200 bg-slate-50 px-1 text-[10px] dark:border-slate-700 dark:bg-slate-950"
                            >
                              <option value="read">Read</option>
                              <option value="delivered">Delivered</option>
                              <option value="sent">Sent</option>
                              <option value="none">None</option>
                            </select>
                            <input
                              type="text"
                              aria-label="Edit message timestamp"
                              value={m.timestampLabel}
                              onChange={(e) =>
                                updateMessage(m.id, { timestampLabel: e.target.value })
                              }
                              className="w-16 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-right text-[11px] dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </TabsContent>

        {/* TAB 2: PARTICIPANTS / CAST */}
        <TabsContent value="participants" className="flex-1 space-y-3 overflow-y-auto p-3.5">
          <form onSubmit={handleAddParticipant} className="flex gap-2">
            <Input
              aria-label="New participant name"
              placeholder="Add participant name..."
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="h-8 text-xs"
            />
            <Button type="submit" size="sm" variant="outline">
              <UserPlus className="h-3.5 w-3.5" />
            </Button>
          </form>

          <div className="space-y-2.5">
            {project.cast.map((p) => {
              const isSelf = p.id === conv.selfParticipantId;
              return (
                <div
                  key={p.id}
                  className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {p.avatarDataUrl ? (
                        <img
                          src={p.avatarDataUrl}
                          alt={p.displayName}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: p.avatarFallbackColor }}
                        >
                          {p.displayName.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="text-xs font-semibold">
                        {isSelf ? 'Outgoing Side (You)' : 'Incoming Participant'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <label
                        title="Upload profile photo"
                        className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-slate-200 px-2 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
                      >
                        <Camera className="h-3 w-3" />
                        <span>Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          aria-label={`Upload photo for ${p.displayName}`}
                          onChange={(e) => handleParticipantAvatarUpload(p, e)}
                          className="sr-only"
                        />
                      </label>
                      {!isSelf && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => setSelfParticipant(p.id)}
                        >
                          Make You
                        </Button>
                      )}
                      {!isSelf && project.cast.length > 2 && (
                        <button
                          type="button"
                          onClick={() => deleteParticipant(p.id)}
                          aria-label={`Remove ${p.displayName}`}
                          className="rounded p-1 text-rose-500 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      aria-label={`Display name for ${p.displayName}`}
                      value={p.displayName}
                      onChange={(e) =>
                        upsertParticipant({ ...p, displayName: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                    <select
                      aria-label={`Verification badge for ${p.displayName}`}
                      value={p.verifiedBadge}
                      onChange={(e) =>
                        upsertParticipant({
                          ...p,
                          verifiedBadge: e.target.value as VerificationBadgeType,
                        })
                      }
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                    >
                      <option value="none">No Badge</option>
                      <option value="blue">Blue Verified</option>
                      <option value="business_green">Green Business</option>
                      <option value="bot">BOT / APP</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
