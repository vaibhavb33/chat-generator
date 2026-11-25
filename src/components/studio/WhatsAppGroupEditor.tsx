'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Ban,
  Camera,
  Copy,
  Crown,
  ImagePlus,
  Pin,
  Plus,
  Shield,
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
import type { MessageType, ReadReceiptStatus } from '@/core/types';
import { cn } from '@/lib/utils';

const GROUP_COLOR_PALETTE = [
  '#059669',
  '#2563EB',
  '#D97706',
  '#DB2777',
  '#7C3AED',
  '#0284C7',
  '#DC2626',
  '#0D9488',
  '#9333EA',
  '#4F46E5',
];

export function WhatsAppGroupEditor({
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
  const moveParticipant = useStudioStore((s) => s.moveParticipant);
  const toggleGroupAdmin = useStudioStore((s) => s.toggleGroupAdmin);
  const setGroupCreator = useStudioStore((s) => s.setGroupCreator);
  const setSelfParticipant = useStudioStore((s) => s.setSelfParticipant);
  const updateGroupMeta = useStudioStore((s) => s.updateGroupMeta);
  const loadTenMemberGroupDemo = useStudioStore((s) => s.loadTenMemberGroupDemo);
  const setActiveTab = useStudioStore((s) => s.setActiveTab);

  const conv = getActiveConversation(project);
  const manifest = GENERATOR_MAP[project.platformId];

  const [composerText, setComposerText] = useState('');
  const [composerSenderId, setComposerSenderId] = useState(
    project.cast[1]?.id ?? conv.selfParticipantId
  );
  const [composerType, setComposerType] = useState<MessageType>('text');
  const [composerTime, setComposerTime] = useState('2:20 PM');
  const [composerReceipt, setComposerReceipt] = useState<ReadReceiptStatus>('read');
  const [composerForwarded, setComposerForwarded] = useState<
    'none' | 'forwarded' | 'frequently_forwarded'
  >('none');
  const [composerReplyToId, setComposerReplyToId] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const effectiveSenderId = project.cast.some((p) => p.id === composerSenderId)
    ? composerSenderId
    : conv.selfParticipantId;

  const activeParticipant =
    project.cast.find((p) => p.id === effectiveSenderId) ?? project.cast[0];

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerText.trim() && composerType === 'text') return;
    const defaultTextByType: Partial<Record<MessageType, string>> = {
      unread_divider: '1 UNREAD MESSAGE',
      date_separator: 'Today',
      sticker: '🎉',
      audio: 'Group-Voice-Mix.mp3',
      video_preview: 'Group clip preview',
      poll: 'Which launch slot works best?',
    };
    addMessage({
      senderId: effectiveSenderId,
      type: composerType,
      text:
        composerText.trim() ||
        defaultTextByType[composerType] ||
        `${composerType.replace('_', ' ')} attachment`,
      timestampLabel: composerTime.trim() || '2:20 PM',
      readStatus: composerReceipt,
      forwardedLabel: composerForwarded,
      replyToMessageId: composerReplyToId || undefined,
    });
    setComposerText('');
    setComposerReplyToId('');
    setComposerForwarded('none');
  };

  const handleGroupAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError(null);
    try {
      const safeDataUrl = await validateImageFileUpload(file);
      updateGroupMeta({ groupAvatarDataUrl: safeDataUrl });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Invalid group avatar upload.');
    }
  };

  const handleImageAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        timestampLabel: composerTime.trim() || '2:20 PM',
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
    const color = GROUP_COLOR_PALETTE[project.cast.length % GROUP_COLOR_PALETTE.length];
    const id = `part_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`;
    upsertParticipant({
      id,
      displayName: newMemberName.trim(),
      handle: `@${newMemberName.trim().toLowerCase().replace(/\s+/g, '')}`,
      avatarFallbackColor: color,
      nameColorHex: color,
      verifiedBadge: 'none',
    });
    setNewMemberName('');
  };

  const insertSystemNotification = (text: string) => {
    addMessage({
      senderId: 'system',
      type: 'system',
      text,
      timestampLabel: '',
      readStatus: 'none',
    });
  };

  const activeTabValue = ui.activeTab === 'participants' ? 'participants' : 'messages';

  return (
    <div className="flex h-full flex-col" data-testid="whatsapp-group-dedicated-editor">
      <Tabs
        value={activeTabValue}
        onValueChange={(v) => setActiveTab(v as 'messages' | 'participants')}
        className="flex h-full flex-col"
      >
        <div className="border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span
              data-testid="platform-editor-badge"
              className="truncate text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
            >
              {manifest?.editorBadge ?? 'Multi-Speaker Group Studio'}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={loadTenMemberGroupDemo}
              data-testid="load-10-member-group-btn"
              className="h-6 px-2 text-[10px]"
            >
              10-Member Demo
            </Button>
          </div>
          <TabsList className="w-full">
            <TabsTrigger value="messages">Group &amp; Messages</TabsTrigger>
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

        {/* TAB 1: GROUP PROFILE, SYSTEM EVENTS & COMPOSER */}
        <TabsContent value="messages" className="flex-1 space-y-4 overflow-y-auto p-3.5">
          {/* Group Profile Card */}
          <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {conv.groupMeta?.groupAvatarDataUrl ? (
                  <img
                    src={conv.groupMeta.groupAvatarDataUrl}
                    alt={conv.groupMeta.groupName || 'Group icon'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {(conv.groupMeta?.groupName ?? 'GR').slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Group Profile
                </span>
              </div>
              <label className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <Camera className="h-3 w-3" />
                <span>Group Icon</span>
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload group profile photo"
                  onChange={handleGroupAvatarUpload}
                  className="sr-only"
                />
              </label>
            </div>

            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Group Name
              <Input
                aria-label="Group name"
                className="mt-1 h-8 bg-white text-xs dark:bg-slate-950"
                value={conv.groupMeta?.groupName ?? ''}
                onChange={(e) => updateGroupMeta({ groupName: e.target.value })}
              />
            </label>

            <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Group Description
              <Input
                aria-label="Group description"
                placeholder="Describe group purpose..."
                className="mt-1 h-8 bg-white text-xs dark:bg-slate-950"
                value={conv.groupMeta?.groupDescription ?? ''}
                onChange={(e) => updateGroupMeta({ groupDescription: e.target.value })}
              />
            </label>
          </div>

          {/* Group System Notifications Quick Actions */}
          <div className="space-y-1.5 rounded-xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Insert Group System Event ({activeParticipant?.displayName})
            </span>
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-6 px-2 text-[10px]"
                onClick={() =>
                  insertSystemNotification(
                    `${activeParticipant?.displayName ?? 'Member'} joined using this group's invite link`
                  )
                }
              >
                + Joined
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-6 px-2 text-[10px]"
                onClick={() =>
                  insertSystemNotification(`${activeParticipant?.displayName ?? 'Member'} left`)
                }
              >
                - Left
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-6 px-2 text-[10px]"
                onClick={() =>
                  insertSystemNotification(
                    `You promoted ${activeParticipant?.displayName ?? 'Member'} to admin`
                  )
                }
              >
                Make Admin
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-6 px-2 text-[10px]"
                onClick={() =>
                  insertSystemNotification(
                    `You changed the group name to "${conv.groupMeta?.groupName ?? 'Group Chat'}"`
                  )
                }
              >
                Name Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-6 px-2 text-[10px]"
                onClick={() => insertSystemNotification("You changed this group's icon")}
              >
                Icon Change
              </Button>
            </div>
          </div>

          {/* Group Composer */}
          <form
            onSubmit={handleAddMessage}
            className="space-y-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Add Group Message
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onOpenScriptImport}
                className="h-7 px-2 text-[11px] text-emerald-700 dark:text-emerald-300"
              >
                <Sparkles className="h-3 w-3" />
                Paste Script
              </Button>
            </div>

            {/* Color-coded participant quick pills */}
            <div className="flex flex-wrap gap-1">
              {project.cast.slice(0, 6).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setComposerSenderId(p.id)}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors cursor-pointer',
                    effectiveSenderId === p.id
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.nameColorHex || p.avatarFallbackColor }}
                  />
                  <span className="max-w-[70px] truncate">{p.displayName}</span>
                </button>
              ))}
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
                    {t.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              aria-label="Message text"
              placeholder="Write message, poll question, or system notice..."
              value={composerText}
              onChange={(e) => setComposerText(e.target.value)}
              className="min-h-[62px] bg-white text-xs dark:bg-slate-950"
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                aria-label="Message timestamp"
                value={composerTime}
                onChange={(e) => setComposerTime(e.target.value)}
                placeholder="2:20 PM"
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
                        Reply: {(m.text ?? '').slice(0, 26)}
                      </option>
                    ))}
                </select>
              )}
            </div>

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
                  onChange={handleImageAttachmentUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </form>

          {/* Group Message Timeline */}
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
              const isPinned = conv.groupMeta?.pinnedMessageId === m.id;
              return (
                <div
                  key={m.id}
                  className={cn(
                    'rounded-xl border p-2.5 text-xs transition-colors',
                    ui.selectedMessageId === m.id
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
                      : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            m.senderId === 'system'
                              ? '#94a3b8'
                              : sender?.nameColorHex || '#4F46E5',
                        }}
                      />
                      <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                        {m.senderId === 'system'
                          ? 'System'
                          : sender?.displayName ?? 'Member'}{' '}
                        <span className="font-normal text-slate-400">• {m.type}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {m.senderId !== 'system' && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateGroupMeta({
                                pinnedMessageId: isPinned ? undefined : m.id,
                              })
                            }
                            title={isPinned ? 'Unpin message' : 'Pin message'}
                            aria-label="Toggle pinned message"
                            className={cn(
                              'rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
                              isPinned ? 'text-emerald-600' : 'text-slate-400'
                            )}
                          >
                            <Pin className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateMessage(m.id, { isDeleted: !m.isDeleted })
                            }
                            title="Toggle deleted message appearance"
                            aria-label="Toggle deleted message"
                            className={cn(
                              'rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
                              m.isDeleted ? 'text-rose-500' : 'text-slate-400'
                            )}
                          >
                            <Ban className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => switchMessageSender(m.id)}
                            title="Switch sender"
                            aria-label="Switch sender"
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            <ArrowLeftRight className="h-3 w-3" />
                          </button>
                        </>
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
                    onChange={(e) => updateMessage(m.id, { text: e.target.value })}
                    className="mt-1.5 w-full resize-y rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950"
                  />

                  {m.senderId !== 'system' && (
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                      <select
                        aria-label="Change message sender"
                        value={m.senderId}
                        onChange={(e) =>
                          switchMessageSender(m.id, e.target.value)
                        }
                        className="h-6 max-w-[115px] truncate rounded border border-slate-200 bg-slate-50 px-1 text-[10px] dark:border-slate-700 dark:bg-slate-950"
                      >
                        {project.cast.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.displayName}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-0.5">
                        {['❤️', '😂', '😮', '👍', '🔥'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => toggleMessageReaction(m.id, emoji)}
                            className={cn(
                              'rounded px-1 py-0.5 text-[11px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
                              m.reactions.some((r) => r.emoji === emoji) &&
                                'bg-emerald-100 dark:bg-emerald-900/60'
                            )}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2: DEDICATED GROUP PARTICIPANTS PANEL */}
        <TabsContent value="participants" className="flex-1 space-y-3 overflow-y-auto p-3.5">
          <form onSubmit={handleAddParticipant} className="flex gap-2">
            <Input
              aria-label="New participant name"
              placeholder="Add group member name..."
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="h-8 text-xs"
            />
            <Button
              type="submit"
              size="sm"
              variant="gradient"
              data-testid="add-participant-btn"
            >
              <UserPlus className="mr-1 h-3.5 w-3.5" />
              Add Participant
            </Button>
          </form>

          <div className="space-y-2.5">
            {project.cast.map((p, idx) => {
              const isSelf = p.id === conv.selfParticipantId;
              return (
                <div
                  key={p.id}
                  data-testid={`participant-row-${p.id}`}
                  className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {p.avatarDataUrl ? (
                        <img
                          src={p.avatarDataUrl}
                          alt={p.displayName}
                          className="h-7 w-7 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: p.avatarFallbackColor }}
                        >
                          {p.displayName.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span
                        className="truncate text-xs font-bold"
                        style={{ color: p.nameColorHex || p.avatarFallbackColor }}
                      >
                        {p.displayName}
                      </span>
                      {p.isGroupCreator && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                          Creator
                        </span>
                      )}
                      {p.isAdmin && !p.isGroupCreator && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Admin
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveParticipant(p.id, 'up')}
                        disabled={idx === 0}
                        aria-label={`Move ${p.displayName} up`}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveParticipant(p.id, 'down')}
                        disabled={idx === project.cast.length - 1}
                        aria-label={`Move ${p.displayName} down`}
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
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

                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                      aria-label={`Display name for ${p.displayName}`}
                      value={p.displayName}
                      onChange={(e) =>
                        upsertParticipant({ ...p, displayName: e.target.value })
                      }
                      className="h-8 text-xs"
                    />
                    <label
                      title="Member bubble color"
                      className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] font-medium dark:border-slate-700"
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/10"
                        style={{ backgroundColor: p.nameColorHex || p.avatarFallbackColor }}
                      />
                      <input
                        type="color"
                        aria-label={`Color for ${p.displayName}`}
                        value={p.nameColorHex || p.avatarFallbackColor}
                        onChange={(e) =>
                          upsertParticipant({
                            ...p,
                            nameColorHex: e.target.value,
                            avatarFallbackColor: e.target.value,
                          })
                        }
                        className="sr-only"
                      />
                      Color
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <label className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-slate-200 px-2 text-[10px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200">
                      <Camera className="h-3 w-3" />
                      <span>Avatar</span>
                      <input
                        type="file"
                        accept="image/*"
                        aria-label={`Upload photo for ${p.displayName}`}
                        onChange={(e) => handleParticipantAvatarUpload(p, e)}
                        className="sr-only"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => toggleGroupAdmin(p.id)}
                      aria-label={`Toggle admin for ${p.displayName}`}
                      className={cn(
                        'inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[10px] font-medium cursor-pointer',
                        p.isAdmin
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                      )}
                    >
                      <Shield className="h-3 w-3" />
                      Admin
                    </button>

                    <button
                      type="button"
                      onClick={() => setGroupCreator(p.id)}
                      aria-label={`Set ${p.displayName} as group creator`}
                      className={cn(
                        'inline-flex h-7 items-center gap-1 rounded-md border px-2 text-[10px] font-medium cursor-pointer',
                        p.isGroupCreator
                          ? 'border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                      )}
                    >
                      <Crown className="h-3 w-3" />
                      Creator
                    </button>

                    {!isSelf && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[10px]"
                        onClick={() => setSelfParticipant(p.id)}
                      >
                        Make You
                      </Button>
                    )}
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
