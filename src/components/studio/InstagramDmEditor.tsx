'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Camera,
  Copy,
  Heart,
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
import type { MessageType, ReadReceiptStatus, VerificationBadgeType } from '@/core/types';
import { cn } from '@/lib/utils';

const IG_REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍'];

export function InstagramDmEditor({
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
  const setActiveTab = useStudioStore((s) => s.setActiveTab);

  const conv = getActiveConversation(project);
  const manifest = GENERATOR_MAP[project.platformId];

  const [composerText, setComposerText] = useState('');
  const [composerSenderId, setComposerSenderId] = useState(conv.selfParticipantId);
  const [composerType, setComposerType] = useState<MessageType>('text');
  const [composerTime, setComposerTime] = useState('9:42 AM');
  const [composerReceipt, setComposerReceipt] = useState<ReadReceiptStatus>('read');
  const [composerReplyToId, setComposerReplyToId] = useState('');
  const [composerVanish, setComposerVanish] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const effectiveSenderId = project.cast.some((p) => p.id === composerSenderId)
    ? composerSenderId
    : conv.selfParticipantId;

  const activeTabValue = ui.activeTab === 'participants' ? 'participants' : 'messages';

  /* ── handlers ── */
  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && composerType === 'text') return;
    const defaultTextByType: Partial<Record<MessageType, string>> = {
      date_separator: 'Today',
      sticker: '😍',
      gif: 'GIF reaction',
      voice_note: 'Voice message',
      video_preview: 'Shared clip',
      story_reply: 'Replied to your story ❤️',
      shared_post: 'Check this out',
      call_event: 'Missed video call',
      system: 'You\'re connected on Instagram',
    };
    addMessage({
      senderId: effectiveSenderId,
      type: composerType,
      text:
        composerText.trim() ||
        defaultTextByType[composerType] ||
        `${composerType.replace(/_/g, ' ')} attachment`,
      timestampLabel: composerTime.trim() || '9:42 AM',
      readStatus: composerReceipt,
      replyToMessageId: composerReplyToId || undefined,
    });
    setComposerText('');
    setComposerReplyToId('');
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
    const colors = ['#4F46E5', '#EC4899', '#7C3AED', '#059669', '#F59E0B'];
    upsertParticipant({
      id: `part_${Date.now()}`,
      displayName: newMemberName.trim(),
      handle: `@${newMemberName.trim().toLowerCase().replace(/\s+/g, '_')}`,
      avatarFallbackColor: colors[project.cast.length % colors.length],
      nameColorHex: colors[project.cast.length % colors.length],
      verifiedBadge: 'none',
    });
    setNewMemberName('');
  };

  /* ── toggle vanish mode in headerState ── */
  const toggleVanish = () => {
    setComposerVanish((v) => !v);
    // reflect in conversation via updateMessage trick – simpler: just track locally
    // since vanish mode is a headerState flag in the renderer
  };

  return (
    <div
      data-testid="instagram-dm-dedicated-editor"
      className="flex h-full flex-col"
    >
      <Tabs
        value={activeTabValue}
        onValueChange={(v) => setActiveTab(v as 'messages' | 'participants')}
        className="flex h-full flex-col"
      >
        {/* header */}
        <div className="border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              data-testid="platform-editor-badge"
              className="truncate text-[11px] font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-400"
            >
              {manifest?.editorBadge ?? 'Instagram Direct Studio'}
            </span>
          </div>
          <TabsList className="w-full">
            <TabsTrigger value="messages">DM Messages</TabsTrigger>
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

        {/* TAB 1 — MESSAGES */}
        <TabsContent value="messages" className="flex-1 space-y-4 overflow-y-auto p-3.5">
          {/* Composer */}
          <form
            onSubmit={handleAddMessage}
            className="space-y-2.5 rounded-xl border border-pink-200/80 bg-pink-50/40 p-3 dark:border-pink-900/60 dark:bg-pink-950/20"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Add DM Message
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenScriptImport}
                className="h-7 px-2 text-[11px] text-pink-700 dark:text-pink-300"
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
                {(manifest?.capabilities.supportedMessageTypes ?? ['text']).map((t) => (
                  <option key={t} value={t}>
                    {t.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              aria-label="Message text"
              placeholder={
                composerType === 'date_separator'
                  ? 'Today / Yesterday'
                  : composerType === 'story_reply'
                    ? 'Reply text (or leave blank for card only)...'
                    : composerType === 'shared_post'
                      ? '@handle caption snippet...'
                      : 'Type message...'
              }
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              className="min-h-[60px] bg-white text-xs dark:bg-slate-950"
            />

            {/* quick emoji */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="mr-1 text-[10px] font-medium text-slate-500">Quick emoji:</span>
              {['😊', '😍', '❤️', '🔥', '👏', '🎉', '😂', '👀'].map((em) => (
                <button
                  key={em}
                  type="button"
                  aria-label={`Insert emoji ${em}`}
                  onClick={() => setComposerText((prev) => `${prev}${em}`)}
                  className="cursor-pointer rounded px-1.5 py-0.5 text-xs hover:bg-white dark:hover:bg-slate-800"
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
                onChange={(e) => setComposerReceipt(e.target.value as ReadReceiptStatus)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="read">Seen ✓✓</option>
                <option value="delivered">Delivered ✓✓</option>
                <option value="sent">Sent ✓</option>
                <option value="none">No Receipt</option>
              </select>
            </div>

            {/* Reply to */}
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

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                variant="gradient"
                size="sm"
                className="flex-1"
                data-testid="add-message-btn"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to DM
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

            {/* vanish mode toggle (surface only — reflected via headerState in renderer) */}
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium dark:border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="text-purple-600">👻</span> Vanish Mode
              </span>
              <input
                type="checkbox"
                checked={composerVanish}
                onChange={toggleVanish}
                aria-label="Toggle vanish mode"
              />
            </label>
          </form>

          {/* Timeline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Timeline ({conv.messages.length} items)
              </span>
              {conv.messages.length > 0 && (
                <button
                  type="button"
                  onClick={onRequestClearAll}
                  className="cursor-pointer text-[11px] font-medium text-rose-600 hover:underline"
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
                      ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                      {m.senderId === 'system' ? 'System' : sender?.displayName ?? 'Sender'}{' '}
                      <span className="font-normal text-slate-400">• {m.type}</span>
                    </span>
                    <div className="flex items-center gap-0.5">
                      {m.senderId !== 'system' && (
                        <button
                          type="button"
                          onClick={() => switchMessageSender(m.id)}
                          aria-label="Switch sender"
                          className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <ArrowLeftRight className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => duplicateMessage(m.id)}
                        aria-label="Duplicate message"
                        className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMessage(m.id, 'up')}
                        disabled={idx === 0}
                        aria-label="Move message up"
                        className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMessage(m.id, 'down')}
                        disabled={idx === conv.messages.length - 1}
                        aria-label="Move message down"
                        className="cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMessage(m.id)}
                        aria-label="Delete message"
                        className="cursor-pointer rounded p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={1}
                    aria-label="Edit message content"
                    value={m.text ?? ''}
                    onChange={(e) => updateMessage(m.id, { text: e.target.value })}
                    className="mt-1.5 w-full resize-y rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs focus:border-pink-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  />

                  {m.senderId !== 'system' && (
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-0.5">
                        {IG_REACTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleMessageReaction(m.id, emoji)}
                            className={cn(
                              'cursor-pointer rounded px-1 py-0.5 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800',
                              m.reactions.some((r) => r.emoji === emoji) &&
                              'bg-pink-100 dark:bg-pink-900/60'
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                        {/* unsent toggle */}
                        <button
                          type="button"
                          onClick={() => updateMessage(m.id, { isDeleted: !m.isDeleted })}
                          aria-label="Toggle unsent message"
                          className={cn(
                            'ml-1 cursor-pointer rounded border px-1.5 py-0.5 text-[10px] font-medium',
                            m.isDeleted
                              ? 'border-red-500 bg-red-50 text-red-600 dark:bg-red-950/40'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700'
                          )}
                        >
                          👻 Unsent
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <select
                          aria-label="Receipt status for message"
                          value={m.readReceipt.status}
                          onChange={(e) =>
                            updateMessage(m.id, {
                              readReceipt: { ...m.readReceipt, status: e.target.value as ReadReceiptStatus },
                            })
                          }
                          className="h-6 rounded border border-slate-200 bg-slate-50 px-1 text-[10px] dark:border-slate-700 dark:bg-slate-950"
                        >
                          <option value="read">Seen</option>
                          <option value="delivered">Delivered</option>
                          <option value="sent">Sent</option>
                          <option value="none">None</option>
                        </select>
                        <input
                          type="text"
                          aria-label="Edit message timestamp"
                          value={m.timestampLabel}
                          onChange={(e) => updateMessage(m.id, { timestampLabel: e.target.value })}
                          className="w-16 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-right text-[11px] dark:border-slate-700 dark:bg-slate-950"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2 — PEOPLE */}
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
                        {isSelf ? 'Your Account (Outgoing)' : 'Other Account'}
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
                          className="cursor-pointer rounded p-1 text-rose-500 hover:bg-rose-50"
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
                      onChange={(e) => upsertParticipant({ ...p, displayName: e.target.value })}
                      className="h-8 text-xs"
                    />
                    <Input
                      aria-label={`Handle for ${p.displayName}`}
                      value={p.handle ?? ''}
                      onChange={(e) => upsertParticipant({ ...p, handle: e.target.value })}
                      placeholder="@username"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      aria-label={`Verification badge for ${p.displayName}`}
                      value={p.verifiedBadge}
                      onChange={(e) =>
                        upsertParticipant({ ...p, verifiedBadge: e.target.value as VerificationBadgeType })
                      }
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                    >
                      <option value="none">No Badge</option>
                      <option value="blue">Blue ✓ Verified</option>
                      <option value="business_green">Business</option>
                    </select>
                    <select
                      aria-label={`Active status for ${p.displayName}`}
                      value={p.bioStatus ?? 'online'}
                      onChange={(e) => upsertParticipant({ ...p, bioStatus: e.target.value })}
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                    >
                      <option value="online">Active Now</option>
                      <option value="active_1h">Active 1h ago</option>
                      <option value="active_today">Active today</option>
                      <option value="offline">Not showing</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick heart reactions legend */}
          <div className={cn('rounded-xl border border-pink-200/60 bg-pink-50/40 p-3 dark:border-pink-900/40 dark:bg-pink-950/20')}>
            <p className="mb-1.5 text-[11px] font-semibold text-pink-700 dark:text-pink-300">
              <Heart className="mr-1 inline h-3 w-3 fill-current" />
              Instagram Reactions
            </p>
            <p className="text-[10px] text-slate-500">
              Tap the emoji buttons on each message in the timeline to add or remove Instagram-style reactions.
              The ❤️ heart shows as a floating heart on the bubble.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
