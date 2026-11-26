'use client';

import React from 'react';
import {
  Archive,
  Crosshair,
  MoreVertical,
  PenSquare,
  Phone,
  Pin,
  Search,
  Settings,
  User,
  Users,
  VolumeX,
} from 'lucide-react';
import type { ChatListRow, Conversation, EditableElementSelection, Participant, PlatformTheme } from '@/core/types';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { cn } from '@/lib/utils';

export function TelegramChatListRenderer({
  conversation,
  participantsById,
  theme,
  onSelectElement,
  onOpenChatThread,
}: {
  conversation: Conversation;
  participantsById: Record<string, Participant>;
  theme: PlatformTheme;
  onSelectElement?: (el: EditableElementSelection) => void;
  onOpenChatThread?: () => void;
}) {
  const dark = theme.colorScheme === 'dark' || theme.colorScheme === 'dim';
  const isAndroid = theme.deviceType === 'android' || theme.osVariant === 'android';
  const rows: ChatListRow[] = conversation.chatListItems ?? [];
  const selfUser = participantsById[conversation.selfParticipantId];

  return (
    <div
      data-testid="renderer-telegram-chat-list"
      dir={theme.typography.direction}
      className={cn(
        'relative flex min-h-[680px] flex-1 flex-col select-none',
        dark ? 'bg-[#000000] text-white' : 'bg-[#FFFFFF] text-slate-950',
        isAndroid && (dark ? 'bg-[#1D2733]' : 'bg-[#FFFFFF]')
      )}
    >
      <StatusBar
        statusBar={theme.statusBar}
        osVariant={isAndroid ? 'android' : 'ios'}
        darkBg={dark}
        onSelectStatusBar={() =>
          onSelectElement?.({ kind: 'status_bar', label: 'Status Bar' })
        }
      />

      {/* Top Header */}
      {isAndroid ? (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2.5',
            dark ? 'bg-[#1D2733] text-white' : 'bg-[#517DA2] text-white'
          )}
        >
          <span className="text-[19px] font-semibold tracking-tight">Telegram</span>
          <div className="flex items-center gap-3.5">
            <Search className="h-5 w-5" />
            <MoreVertical className="h-5 w-5" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2">
          <button
            type="button"
            className={cn(
              'rounded-full border px-3.5 py-1 text-[13px] font-medium backdrop-blur-md',
              dark
                ? 'border-white/15 bg-white/10 text-white'
                : 'border-black/10 bg-black/5 text-slate-900'
            )}
          >
            Edit
          </button>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <span className="h-6 w-6 rounded-full border-2 border-[#3390EC] bg-gradient-to-tr from-sky-500 to-indigo-600" />
              <span className="h-6 w-6 rounded-full border-2 border-[#3390EC] bg-gradient-to-tr from-emerald-500 to-teal-600" />
            </div>
            <h2 className="text-[18px] font-bold">Chats</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="New Story"
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md',
                dark
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-black/10 bg-black/5 text-slate-900'
              )}
            >
              <Crosshair className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Compose message"
              onClick={onOpenChatThread}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#007AFF] text-white shadow-xs"
            >
              <PenSquare className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search + Folder Tabs */}
      <div className="space-y-2 px-3 pb-2 pt-1">
        {!isAndroid && (
          <div
            className={cn(
              'flex h-9 items-center justify-center gap-1.5 rounded-full text-[13px]',
              dark ? 'bg-[#1C1C1E] text-slate-400' : 'bg-[#F0F2F5] text-slate-500'
            )}
          >
            <Search className="h-4 w-4 opacity-70" />
            <span>Search</span>
          </div>
        )}

        <div
          className={cn(
            'flex items-center gap-2 rounded-full px-1.5 py-1 text-[12px] font-semibold',
            dark ? 'bg-[#1C1C1E]/90' : 'bg-[#F0F2F5]'
          )}
        >
          <span
            className={cn(
              'rounded-full px-3 py-1',
              dark ? 'bg-white/15 text-white' : 'bg-white text-slate-900 shadow-2xs'
            )}
          >
            All
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 opacity-80">
            Work
            <span className="rounded-full bg-[#3390EC] px-1.5 py-0.2 text-[10px] text-white">
              4
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 opacity-80">
            Design
            <span className="rounded-full bg-[#3390EC] px-1.5 py-0.2 text-[10px] text-white">
              35
            </span>
          </span>
        </div>
      </div>

      {/* Chat List Rows */}
      <div className="flex-1 overflow-y-auto px-3 pb-24">
        {rows.map((row, idx) => {
          const hasUnread = (row.unreadCount ?? 0) > 0;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => {
                if (!row.isArchived && idx <= 1 && onOpenChatThread) {
                  onOpenChatThread();
                } else {
                  onSelectElement?.({
                    kind: 'chat_list_row',
                    targetId: row.id,
                    label: row.title,
                  });
                }
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl px-1.5 py-2 text-left transition-colors',
                dark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
              )}
            >
              {row.isArchived ? (
                <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-[#3390EC] text-white">
                  <Archive className="h-5 w-5" />
                </div>
              ) : row.avatarDataUrl ? (
                <img
                  src={row.avatarDataUrl}
                  alt={row.title}
                  className="h-[50px] w-[50px] shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: row.avatarColorHex }}
                >
                  {row.title.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1 border-b border-current/5 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="truncate text-[15px] font-semibold">
                      {row.title}
                    </span>
                    {row.isMuted && <VolumeX className="h-3.5 w-3.5 shrink-0 opacity-45" />}
                  </div>
                  {row.timeLabel && (
                    <span className="shrink-0 text-[12px] opacity-55">
                      {row.timeLabel}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p className="line-clamp-2 text-[13px] leading-snug opacity-65">
                    {row.previewText}
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {row.isPinned && !hasUnread && (
                      <Pin className="h-3.5 w-3.5 rotate-45 opacity-45" />
                    )}
                    {hasUnread && (
                      <span
                        className={cn(
                          'inline-flex min-w-[20px] items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold text-white',
                          row.isMuted || row.isArchived
                            ? 'bg-slate-500/80'
                            : 'bg-[#3390EC]'
                        )}
                      >
                        {row.unreadLabel ?? row.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Android v12.4.0 Floating Blue Compose FAB */}
      {isAndroid && (
        <div className="pointer-events-none absolute bottom-20 right-4">
          <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#3390EC] text-white shadow-lg">
            <PenSquare className="h-5 w-5" />
          </div>
        </div>
      )}

      {/* Bottom 4-Tab Bar: iPhone Liquid Glass Pill vs Android v12.4.0 Persistent Bar */}
      {isAndroid ? (
        <nav
          aria-label="Telegram Android navigation"
          className={cn(
            'absolute inset-x-0 bottom-0 flex h-[60px] items-center justify-around border-t px-2',
            dark
              ? 'border-white/10 bg-[#17212B] text-slate-300'
              : 'border-slate-200 bg-[#FFFFFF] text-slate-600'
          )}
        >
          <div className="flex flex-col items-center gap-0.5 text-[#3390EC]">
            <Users className="h-5 w-5" />
            <span className="text-[11px] font-semibold">Chats</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 opacity-75">
            <User className="h-5 w-5" />
            <span className="text-[11px]">Contacts</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 opacity-75">
            <Settings className="h-5 w-5" />
            <span className="text-[11px]">Settings</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 opacity-75">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ backgroundColor: selfUser?.avatarFallbackColor || '#4F46E5' }}
            >
              {(selfUser?.displayName || 'Y')[0]}
            </span>
            <span className="text-[11px]">Profile</span>
          </div>
        </nav>
      ) : (
        <div className="pointer-events-none absolute inset-x-3 bottom-3">
          <nav
            aria-label="Telegram iOS Liquid Glass navigation"
            className={cn(
              'flex h-[58px] items-center justify-around rounded-full border px-3 shadow-xl backdrop-blur-xl',
              dark
                ? 'border-white/15 bg-[#1C1C1E]/80 text-slate-200'
                : 'border-white/90 bg-white/80 text-slate-800'
            )}
          >
            <div className="flex flex-col items-center gap-0.5 opacity-80">
              <User className="h-4.5 w-4.5" />
              <span className="text-[10px]">Contacts</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 opacity-80">
              <Phone className="h-4.5 w-4.5" />
              <span className="text-[10px]">Calls</span>
            </div>
            <div
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-full px-4 py-1 text-[#007AFF]',
                dark ? 'bg-white/12' : 'bg-black/8'
              )}
            >
              <Users className="h-4.5 w-4.5" />
              <span className="text-[10px] font-semibold">Chats</span>
              <span className="absolute -right-1 -top-0.5 rounded-full bg-[#FF3B30] px-1.5 text-[9px] font-bold text-white">
                47
              </span>
            </div>
            <div className="relative flex flex-col items-center gap-0.5 opacity-85">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ backgroundColor: selfUser?.avatarFallbackColor || '#4F46E5' }}
              >
                {(selfUser?.displayName || 'Y')[0]}
              </span>
              <span className="text-[10px]">Settings</span>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
