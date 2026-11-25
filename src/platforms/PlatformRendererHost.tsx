'use client';

import React from 'react';
import { MessageSquarePlus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeviceFrame } from '@/components/engine';
import { WhatsAppChatRenderer } from '@/platforms/whatsapp-chat/Renderer';
import { WhatsAppGroupChatRenderer } from '@/platforms/whatsapp-group-chat/Renderer';
import { InstagramDmRenderer } from '@/platforms/instagram-dm/Renderer';
import { IMessageRenderer } from '@/platforms/imessage/Renderer';
import { AndroidMessagesRenderer } from '@/platforms/android-messages/Renderer';
import { TelegramChatRenderer } from '@/platforms/telegram-chat/Renderer';
import { DiscordChatRenderer } from '@/platforms/discord-chat/Renderer';
import { InstagramStoryRenderer } from '@/platforms/instagram-story/Renderer';
import { InstagramPostRenderer } from '@/platforms/instagram-post/Renderer';
import { FakeCallScreenRenderer } from '@/platforms/fake-call-screen/Renderer';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';

export function PlatformRendererHost({
  exportRef,
}: {
  exportRef: React.RefObject<HTMLDivElement | null>;
}) {
  const project = useStudioStore((s) => s.project);
  const ui = useStudioStore((s) => s.ui);
  const setSelectedMessageId = useStudioStore((s) => s.setSelectedMessageId);
  const duplicateMessage = useStudioStore((s) => s.duplicateMessage);
  const switchMessageSender = useStudioStore((s) => s.switchMessageSender);
  const deleteMessage = useStudioStore((s) => s.deleteMessage);
  const updateCallMeta = useStudioStore((s) => s.updateCallMeta);
  const resetToSeed = useStudioStore((s) => s.resetToSeed);

  const conversation = getActiveConversation(project);
  const participantsById = Object.fromEntries(project.cast.map((p) => [p.id, p]));

  const isEmptyChat =
    project.archetype === 'chat_thread' && conversation.messages.length === 0;

  const sharedChatProps = {
    conversation,
    participantsById,
    theme: project.theme,
    visibleMessageCount: ui.timelineVisibleCount,
    selectedMessageId: ui.selectedMessageId,
    isTypingPreview: ui.isTypingPreview,
    onSelectMessage: (id: string) =>
      setSelectedMessageId(ui.selectedMessageId === id ? null : id),
    onDuplicateMessage: (id: string) => duplicateMessage(id),
    onSwitchSender: (id: string) => switchMessageSender(id),
    onDeleteMessage: (id: string) => deleteMessage(id),
  };

  const renderPlatform = () => {
    if (isEmptyChat) {
      return (
        <div
          data-testid="empty-canvas-state"
          className="flex min-h-[460px] flex-col items-center justify-center gap-4 bg-white p-8 text-center dark:bg-slate-900"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <MessageSquarePlus className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Your conversation is empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Add a message from the left editor, import a script, or load sample dialogue.
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
        return <WhatsAppChatRenderer {...sharedChatProps} />;
      case 'whatsapp-group-chat':
        return <WhatsAppGroupChatRenderer {...sharedChatProps} />;
      case 'instagram-dm':
        return <InstagramDmRenderer {...sharedChatProps} />;
      case 'imessage':
        return <IMessageRenderer {...sharedChatProps} />;
      case 'android-messages':
        return <AndroidMessagesRenderer {...sharedChatProps} />;
      case 'telegram-chat':
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

  return (
    <div
      ref={exportRef}
      data-testid="mockup-export-surface"
      className="inline-block w-full max-w-[440px] rounded-3xl p-2 transition-all"
      style={
        ui.isTimelineOpen && project.timeline.videoOptions?.backgroundCss
          ? { background: project.timeline.videoOptions.backgroundCss }
          : undefined
      }
    >
      <DeviceFrame
        frame={project.exportSettings.deviceFrame}
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
  );
}
