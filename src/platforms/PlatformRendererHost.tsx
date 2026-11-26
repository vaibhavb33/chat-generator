'use client';

import React from 'react';
import {
  Check,
  Eye,
  MessageSquarePlus,
  Pencil,
  RotateCcw,
  Smartphone,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeviceFrame } from '@/components/engine';
import { WhatsAppChatRenderer } from '@/platforms/whatsapp-chat/Renderer';
import { WhatsAppChatListRenderer } from '@/platforms/whatsapp-chat/WhatsAppChatListRenderer';
import { WhatsAppGroupChatRenderer } from '@/platforms/whatsapp-group-chat/Renderer';
import { InstagramDmRenderer } from '@/platforms/instagram-dm/Renderer';
import { IMessageRenderer } from '@/platforms/imessage/Renderer';
import { AndroidMessagesRenderer } from '@/platforms/android-messages/Renderer';
import { TelegramChatRenderer } from '@/platforms/telegram-chat/Renderer';
import { TelegramChatListRenderer } from '@/platforms/telegram-chat/TelegramChatListRenderer';
import { DiscordChatRenderer } from '@/platforms/discord-chat/Renderer';
import { InstagramStoryRenderer } from '@/platforms/instagram-story/Renderer';
import { InstagramPostRenderer } from '@/platforms/instagram-post/Renderer';
import { FakeCallScreenRenderer } from '@/platforms/fake-call-screen/Renderer';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import type { ScreenViewMode } from '@/core/types';
import { cn } from '@/lib/utils';

export function PlatformRendererHost({
  exportRef,
  onRequestOpenEdit,
}: {
  exportRef: React.RefObject<HTMLDivElement | null>;
  onRequestOpenEdit?: () => void;
}) {
  const project = useStudioStore((s) => s.project);
  const ui = useStudioStore((s) => s.ui);
  const setSelectedMessageId = useStudioStore((s) => s.setSelectedMessageId);
  const setSelectedElement = useStudioStore((s) => s.setSelectedElement);
  const setScreenViewMode = useStudioStore((s) => s.setScreenViewMode);
  const setPreviewZoom = useStudioStore((s) => s.setPreviewZoom);
  const setEditorOpen = useStudioStore((s) => s.setEditorOpen);
  const setDeviceFrame = useStudioStore((s) => s.setDeviceFrame);
  const duplicateMessage = useStudioStore((s) => s.duplicateMessage);
  const switchMessageSender = useStudioStore((s) => s.switchMessageSender);
  const deleteMessage = useStudioStore((s) => s.deleteMessage);
  const updateCallMeta = useStudioStore((s) => s.updateCallMeta);
  const resetToSeed = useStudioStore((s) => s.resetToSeed);

  const conversation = getActiveConversation(project);
  const participantsById = Object.fromEntries(project.cast.map((p) => [p.id, p]));

  const isEmptyChat =
    project.archetype === 'chat_thread' &&
    conversation.messages.length === 0 &&
    conversation.headerState.screenViewMode !== 'chat_list';

  const activeDevice =
    project.theme.deviceType ??
    (project.theme.osVariant === 'android' ? 'android' : 'iphone');
  const darkBg =
    project.theme.colorScheme === 'dark' || project.theme.colorScheme === 'dim';
  const viewMode = conversation.headerState.screenViewMode;

  const isDiscordDesktop =
    project.platformId === 'discord-chat' &&
    (conversation.headerState.discordLayout ?? 'desktop_server') === 'desktop_server';

  const viewTabs: Array<{ id: ScreenViewMode; label: string }> =
    project.platformId === 'whatsapp-chat'
      ? [
          { id: 'chat_thread', label: 'Chat View' },
          { id: 'chat_list', label: 'Chat List' },
        ]
      : project.platformId === 'whatsapp-group-chat'
        ? [
            { id: 'chat_thread', label: 'Group View' },
            { id: 'chat_list', label: 'Chat List' },
          ]
        : project.platformId === 'telegram-chat'
          ? [
              { id: 'chat_thread', label: 'Chat / Group' },
              { id: 'chat_list', label: 'Chat List' },
            ]
          : project.platformId === 'instagram-post'
            ? [
                { id: 'home_feed', label: 'Home Feed' },
                { id: 'post', label: 'Post Card' },
              ]
            : [];

  const handleOpenEdit = () => {
    setEditorOpen(true);
    onRequestOpenEdit?.();
  };

  const sharedChatProps = {
    conversation,
    participantsById,
    theme: project.theme,
    visibleMessageCount: ui.timelineVisibleCount,
    selectedMessageId: ui.selectedMessageId,
    isTypingPreview: ui.isTypingPreview,
    onSelectMessage: (id: string) => {
      const next = ui.selectedMessageId === id ? null : id;
      setSelectedMessageId(next);
      if (next) {
        setSelectedElement({
          kind: 'message',
          targetId: id,
          label: 'Message Bubble',
        });
        onRequestOpenEdit?.();
      }
    },
    onDuplicateMessage: (id: string) => duplicateMessage(id),
    onSwitchSender: (id: string) => switchMessageSender(id),
    onDeleteMessage: (id: string) => deleteMessage(id),
  };

  const renderPlatform = () => {
    if (isEmptyChat) {
      return (
        <div
          data-testid="empty-canvas-state"
          className="flex min-h-[540px] flex-1 flex-col items-center justify-center gap-4 bg-white p-8 text-center dark:bg-slate-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <MessageSquarePlus className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Your conversation is empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add a message from the editor, import a script, or load sample dialogue.
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" onClick={resetToSeed}>
            <RotateCcw className="h-3.5 w-3.5" />
            Load Sample Conversation
          </Button>
        </div>
      );
    }

    switch (project.platformId) {
      case 'whatsapp-chat':
        if (viewMode === 'chat_list') {
          return (
            <WhatsAppChatListRenderer
              conversation={conversation}
              participantsById={participantsById}
              theme={project.theme}
              onSelectElement={(el) => {
                setSelectedElement(el);
                onRequestOpenEdit?.();
              }}
              onOpenChatThread={() => setScreenViewMode('chat_thread')}
            />
          );
        }
        return <WhatsAppChatRenderer {...sharedChatProps} />;
      case 'whatsapp-group-chat':
        if (viewMode === 'chat_list') {
          return (
            <WhatsAppChatListRenderer
              conversation={conversation}
              participantsById={participantsById}
              theme={project.theme}
              onSelectElement={(el) => {
                setSelectedElement(el);
                onRequestOpenEdit?.();
              }}
              onOpenChatThread={() => setScreenViewMode('chat_thread')}
            />
          );
        }
        return <WhatsAppGroupChatRenderer {...sharedChatProps} />;
      case 'instagram-dm':
        return <InstagramDmRenderer {...sharedChatProps} />;
      case 'imessage':
        return <IMessageRenderer {...sharedChatProps} />;
      case 'android-messages':
        return <AndroidMessagesRenderer {...sharedChatProps} />;
      case 'telegram-chat':
        if (viewMode === 'chat_list') {
          return (
            <TelegramChatListRenderer
              conversation={conversation}
              participantsById={participantsById}
              theme={project.theme}
              onSelectElement={(el) => {
                setSelectedElement(el);
                onRequestOpenEdit?.();
              }}
              onOpenChatThread={() => setScreenViewMode('chat_thread')}
            />
          );
        }
        return <TelegramChatRenderer {...sharedChatProps} />;
      case 'discord-chat':
        return <DiscordChatRenderer {...sharedChatProps} />;
      case 'instagram-story':
        return (
          <InstagramStoryRenderer
            conversation={conversation}
            participantsById={participantsById}
            theme={project.theme}
          />
        );
      case 'instagram-post':
        return (
          <InstagramPostRenderer
            conversation={conversation}
            participantsById={participantsById}
            theme={project.theme}
          />
        );
      case 'fake-call-screen':
        return (
          <FakeCallScreenRenderer
            key={`${conversation.callMeta?.direction}-${conversation.callMeta?.durationSeconds}`}
            conversation={conversation}
            participantsById={participantsById}
            theme={project.theme}
            onUpdateCallMeta={updateCallMeta}
          />
        );
      default:
        return <WhatsAppChatRenderer {...sharedChatProps} />;
    }
  };

  const showKeyboardOverlay =
    ui.isTimelineOpen && (project.timeline.videoOptions?.showKeyboard ?? false);
  const hasBezel = project.exportSettings.deviceFrame !== 'none';

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Phase 3 & 4: Preview Action Bar (Screen View Mode Tabs + Visible Edit Button + Controlled Zoom + Bezel Toggle) */}
      <div
        data-export-ignore="true"
        className="flex w-full max-w-[460px] flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200/90 bg-white/90 px-3 py-1.5 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90"
      >
        <div className="flex flex-wrap items-center gap-1">
          {viewTabs.length > 0 && (
            <div
              role="tablist"
              aria-label="App screen view mode"
              className="inline-flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800"
            >
              {viewTabs.map((t) => {
                const active = (viewMode ?? viewTabs[0].id) === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    data-testid={`screen-view-tab-${t.id}`}
                    onClick={() => setScreenViewMode(t.id)}
                    className={cn(
                      'rounded-md px-2 py-1 text-[11px] font-semibold transition-all cursor-pointer',
                      active
                        ? 'bg-white text-slate-950 shadow-2xs dark:bg-slate-950 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}

          {ui.selectedElement && (
            <span
              data-testid="selected-element-badge"
              className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300"
            >
              <Check className="h-3 w-3" />
              Editing: {ui.selectedElement.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Desktop Zoom Controls */}
          <div className="hidden items-center gap-0.5 rounded-lg border border-slate-200 px-1 py-0.5 sm:inline-flex dark:border-slate-700">
            <button
              type="button"
              aria-label="Zoom out preview"
              onClick={() => setPreviewZoom(Math.max(0.8, Number((ui.previewZoom - 0.1).toFixed(2))))}
              className="rounded p-0.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-[34px] text-center text-[10px] font-semibold tabular-nums text-slate-700 dark:text-slate-300">
              {Math.round(ui.previewZoom * 100)}%
            </span>
            <button
              type="button"
              aria-label="Zoom in preview"
              onClick={() => setPreviewZoom(Math.min(1.15, Number((ui.previewZoom + 0.1).toFixed(2))))}
              className="rounded p-0.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            data-testid="preview-bezel-toggle"
            aria-pressed={hasBezel}
            onClick={() =>
              setDeviceFrame(
                hasBezel
                  ? 'none'
                  : activeDevice === 'android'
                    ? 'pixel_9'
                    : 'iphone_16_pro'
              )
            }
            className={cn(
              'hidden items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium sm:inline-flex cursor-pointer',
              hasBezel
                ? 'border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
            )}
          >
            <Smartphone className="h-3 w-3" />
            <span>Frame</span>
          </button>

          {/* Visible Edit Action directly in Preview */}
          <Button
            type="button"
            size="sm"
            variant={ui.previewMode || !ui.editorOpen ? 'gradient' : 'outline'}
            data-testid="preview-edit-button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                handleOpenEdit();
                return;
              }
              if (ui.previewMode || !ui.editorOpen) {
                handleOpenEdit();
              } else {
                setEditorOpen(false);
              }
            }}
          >
            {ui.previewMode || !ui.editorOpen ? (
              <>
                <Pencil className="h-3.5 w-3.5" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Live Scaled Device Surface */}
      <div
        className="flex w-full justify-center transition-transform duration-150"
        style={{
          transform: ui.previewZoom !== 1 ? `scale(${ui.previewZoom})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        <div
          ref={exportRef}
          data-testid="mockup-export-surface"
          className={cn(
            'inline-flex w-full justify-center rounded-3xl p-1 sm:p-2 transition-all',
            isDiscordDesktop ? 'max-w-[780px]' : 'max-w-[440px]'
          )}
          style={
            ui.isTimelineOpen && project.timeline.videoOptions?.backgroundCss
              ? { background: project.timeline.videoOptions.backgroundCss }
              : undefined
          }
        >
          <DeviceFrame
            frame={
              isDiscordDesktop
                ? 'browser_window'
                : project.exportSettings.deviceFrame
            }
            deviceType={activeDevice}
            osVariant={activeDevice === 'android' ? 'android' : 'ios'}
            darkBg={darkBg}
            hideBottomIndicator={isDiscordDesktop}
            safetyBadge={project.theme.safetyBadge}
          >
            {renderPlatform()}
            {showKeyboardOverlay && (
              <div
                data-testid="simulated-keyboard-overlay"
                className="border-t border-slate-300 bg-slate-200 p-2 dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="grid grid-cols-9 gap-1">
                  {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O'].map((k) => (
                    <span
                      key={k}
                      className="flex h-7 items-center justify-center rounded bg-white text-[10px] font-semibold text-slate-800 shadow-2xs dark:bg-slate-700 dark:text-slate-100"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <div className="mt-1.5 flex justify-center">
                  <span className="flex h-6 w-36 items-center justify-center rounded bg-white text-[10px] text-slate-500 shadow-2xs dark:bg-slate-700 dark:text-slate-300">
                    space
                  </span>
                </div>
              </div>
            )}
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}
