'use client';

import React from 'react';
import {
  ArrowLeft,
  Camera,
  ChevronLeft,
  Lock,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Smile,
  Video,
} from 'lucide-react';
import type { Conversation, Participant, PlatformTheme } from '@/core/types';
import {
  ChatHeader,
  ChatTimestamp,
  MessageActions,
  MessageBubble,
  TypingIndicator,
} from '@/components/engine';
import { resolveWhatsAppVersionConfig } from '@/platforms/whatsapp-chat/versions';
import { cn } from '@/lib/utils';

export interface PlatformRendererProps {
  conversation: Conversation;
  participantsById: Record<string, Participant>;
  theme: PlatformTheme;
  visibleMessageCount: number;
  selectedMessageId: string | null;
  isTypingPreview: boolean;
  onSelectMessage: (id: string) => void;
  onDuplicateMessage?: (id: string) => void;
  onSwitchSender?: (id: string) => void;
  onDeleteMessage?: (id: string) => void;
}

export function WhatsAppChatRenderer({
  conversation,
  participantsById,
  theme,
  visibleMessageCount,
  selectedMessageId,
  isTypingPreview,
  onSelectMessage,
  onDuplicateMessage,
  onSwitchSender,
  onDeleteMessage,
}: PlatformRendererProps) {
  const dark = theme.colorScheme === 'dark' || theme.colorScheme === 'dim';
  const versionCfg = resolveWhatsAppVersionConfig(theme.uiVersion, theme.osVariant);
  const other =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const messages = conversation.messages.slice(0, visibleMessageCount);
  const msgById = Object.fromEntries(conversation.messages.map((m) => [m.id, m]));

  // Build authentic wallpaper layer from theme.wallpaper
  const isCustomImageWallpaper = theme.wallpaper.kind === 'image' && theme.wallpaper.value;
  const isSolidWallpaper = theme.wallpaper.kind === 'solid' && theme.wallpaper.value;
  const wallpaperStyle: React.CSSProperties = {
    fontSize: `${theme.typography.fontScale}rem`,
    ...(isCustomImageWallpaper
      ? {
        backgroundImage: `url(${theme.wallpaper.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
      : isSolidWallpaper
        ? {
          backgroundColor: dark ? '#0B141A' : theme.wallpaper.value,
        }
        : undefined),
  };

  const getBubbleStyleClass = (isSelf: boolean): string => {
    const isPill = theme.bubbleStyle === 'whatsapp_modern_pill';
    const isHighContrast = theme.bubbleStyle === 'whatsapp_high_contrast';
    const shape = isPill
      ? isSelf
        ? 'rounded-2xl rounded-tr-sm'
        : 'rounded-2xl rounded-tl-sm'
      : isSelf
        ? 'rounded-lg rounded-tr-xs'
        : 'rounded-lg rounded-tl-xs';

    if (isHighContrast) {
      return cn(
        shape,
        isSelf
          ? dark
            ? 'border border-emerald-400/30 bg-[#005C4B] text-white'
            : 'border border-emerald-700/20 bg-[#C7F9C1] text-slate-950'
          : dark
            ? 'border border-white/15 bg-[#1F2C34] text-white'
            : 'border border-slate-300 bg-white text-slate-950'
      );
    }

    return cn(
      shape,
      isSelf
        ? dark
          ? 'bg-[#005C4B] text-white'
          : 'bg-[#D9FDD3] text-slate-900'
        : dark
          ? 'bg-[#202C33] text-slate-100'
          : 'bg-white text-slate-900'
    );
  };

  const headerDarkBg = dark || versionCfg.darkBgOnLightHeader;

  return (
    <div
      data-testid="renderer-whatsapp-chat"
      data-whatsapp-version={versionCfg.id}
      dir={theme.typography.direction}
      className={cn(
        'relative flex min-h-[540px] flex-col',
        !isCustomImageWallpaper &&
        !isSolidWallpaper &&
        (dark ? 'whatsapp-wallpaper-dark' : 'whatsapp-wallpaper-light'),
        dark ? 'text-slate-100' : 'text-slate-900'
      )}
      style={wallpaperStyle}
    >
      {/* Dim overlay over custom uploaded image in Dark Mode for readability */}
      {isCustomImageWallpaper && dark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-black/55"
        />
      )}

      <ChatHeader
        title={other?.displayName ?? 'Contact'}
        subtitle={
          isTypingPreview
            ? 'typing...'
            : conversation.headerState.statusText || other?.bioStatus || 'online'
        }
        participant={other}
        theme={{ ...theme, osVariant: versionCfg.os }}
        darkBg={headerDarkBg}
        className={cn(
          'relative z-10',
          !dark && versionCfg.headerBorderLight
        )}
        style={{
          backgroundColor: dark ? versionCfg.headerBgDark : versionCfg.headerBgLight,
          color: dark ? versionCfg.headerTextDark : versionCfg.headerTextLight,
        }}
        leftSlot={
          versionCfg.backIconStyle === 'chevron' ? (
            <ChevronLeft
              data-testid="wa-ios-back"
              className="h-5 w-5 shrink-0 text-[#007AFF] dark:text-[#0A84FF]"
            />
          ) : (
            <ArrowLeft data-testid="wa-android-back" className="h-4 w-4 shrink-0" />
          )
        }
        rightSlot={
          <>
            <Video className="h-4 w-4" aria-hidden="true" />
            <Phone className="h-4 w-4" aria-hidden="true" />
            {versionCfg.showMoreOverflowIcon && (
              <MoreVertical
                data-testid="wa-android-more"
                className="h-4 w-4"
                aria-hidden="true"
              />
            )}
          </>
        }
      />

      <div className="relative z-10 flex-1 space-y-2.5 px-3 py-3.5">
        {conversation.headerState.isEncryptedNoticeVisible && (
          <div className="mx-auto max-w-[88%] rounded-lg bg-[#FFEECD] px-3 py-1.5 text-center text-[10.5px] leading-snug text-[#54656F] shadow-2xs dark:bg-[#182229] dark:text-[#FFD279]">
            <Lock className="mr-1 inline h-3 w-3 align-text-top" />
            Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.
          </div>
        )}

        {messages.map((m) => {
          if (m.type === 'unread_divider') {
            return (
              <div
                key={m.id}
                data-testid="wa-unread-divider"
                className="my-2 flex items-center justify-center rounded-lg bg-white/75 py-1 text-[10.5px] font-semibold uppercase tracking-wide text-[#54656F] shadow-2xs backdrop-blur-xs dark:bg-[#182229]/90 dark:text-[#8696A0]"
              >
                <span className="rounded-full bg-white px-3 py-0.5 shadow-2xs dark:bg-[#233138]">
                  {m.text || '1 UNREAD MESSAGE'}
                </span>
              </div>
            );
          }

          if (m.type === 'date_separator' || m.type === 'system') {
            return <ChatTimestamp key={m.id} text={m.text} darkMode={dark} />;
          }

          const isSelf = m.senderId === conversation.selfParticipantId;
          const replyTarget = m.replyToMessageId ? msgById[m.replyToMessageId] : undefined;
          const isSelected = selectedMessageId === m.id;

          return (
            <div key={m.id} className={cn('flex flex-col', isSelf ? 'items-end' : 'items-start')}>
              <MessageActions
                visible={isSelected}
                onDuplicate={() => onDuplicateMessage?.(m.id)}
                onSwitchSender={() => onSwitchSender?.(m.id)}
                onDelete={() => onDeleteMessage?.(m.id)}
              />
              <MessageBubble
                message={m}
                sender={participantsById[m.senderId]}
                isSelf={isSelf}
                replyTarget={replyTarget}
                replySender={replyTarget ? participantsById[replyTarget.senderId] : undefined}
                bubbleClass={getBubbleStyleClass(isSelf)}
                receiptVariant="whatsapp"
                voiceAccentClass={versionCfg.sendButtonClass}
                darkMode={dark}
                selected={isSelected}
                onSelect={() => onSelectMessage(m.id)}
              />
            </div>
          );
        })}

        {isTypingPreview && (
          <TypingIndicator
            darkMode={dark}
            bubbleClassName={dark ? 'bg-[#202C33] text-slate-300' : 'bg-white text-slate-500'}
          />
        )}
      </div>

      {/* Platform-authentic bottom WhatsApp Composer */}
      {versionCfg.composerStyle === 'ios_plus_bar' ? (
        <div
          data-testid="wa-ios-composer"
          className={cn(
            'relative z-10 flex items-center gap-2 border-t px-2.5 py-2 select-none',
            dark
              ? 'border-white/10 bg-[#1C1C1E] text-slate-200'
              : 'border-black/10 bg-[#F6F6F6] text-slate-700'
          )}
        >
          <Plus className="h-5 w-5 shrink-0 text-[#007AFF] dark:text-[#0A84FF]" />
          <div
            className={cn(
              'flex flex-1 items-center gap-2 rounded-full border px-3 py-1.5 text-xs',
              dark
                ? 'border-white/10 bg-[#2C2C2E] text-slate-300'
                : 'border-slate-300/80 bg-white text-slate-500'
            )}
          >
            <span className="flex-1 truncate opacity-75">Message</span>
            <Smile className="h-4 w-4 shrink-0 opacity-75" />
          </div>
          <Camera className="h-5 w-5 shrink-0 text-[#007AFF] dark:text-[#0A84FF]" />
          <Mic className="h-5 w-5 shrink-0 text-[#007AFF] dark:text-[#0A84FF]" />
        </div>
      ) : (
        <div
          data-testid="wa-android-composer"
          className={cn(
            'relative z-10 flex items-center gap-2 px-2.5 py-2 select-none',
            dark ? 'bg-black/35 text-slate-300' : 'bg-transparent text-slate-600'
          )}
        >
          <div
            className={cn(
              'flex flex-1 items-center gap-2 rounded-full px-3 py-1.5 text-xs shadow-2xs',
              dark ? 'bg-[#1F2C34] text-slate-300' : 'bg-white text-slate-500'
            )}
          >
            <Smile className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate opacity-80">Message</span>
            <Paperclip className="h-4 w-4 shrink-0" />
            <Camera className="h-4 w-4 shrink-0" />
          </div>
          <span
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-xs',
              versionCfg.sendButtonClass
            )}
          >
            <Mic className="h-4 w-4" />
          </span>
        </div>
      )}
    </div>
  );
}
