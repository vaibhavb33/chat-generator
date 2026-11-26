'use client';

import React from 'react';
import {
  Camera,
  CircleDashed,
  MessageCircle,
  MoreHorizontal,
  MoreVertical,
  Phone,
  Pin,
  Plus,
  Search,
  SquarePen,
  Users,
} from 'lucide-react';
import type { ChatListRow, Conversation, EditableElementSelection, Participant, PlatformTheme } from '@/core/types';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { cn } from '@/lib/utils';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function WhatsAppChatListRenderer({
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
  const totalUnread = rows.reduce((sum, r) => sum + (r.unreadCount ?? 0), 0);

  return (
    <div
      data-testid="renderer-whatsapp-chat-list"
      dir={theme.typography.direction}
      className={cn(
        'relative flex min-h-[680px] flex-1 flex-col select-none',
        dark ? 'bg-[#000000] text-white' : 'bg-[#FFFFFF] text-slate-950',
        isAndroid && (dark ? 'bg-[#0B141A]' : 'bg-[#FFFFFF]')
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

      {/* Top App Header */}
      {isAndroid ? (
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2.5',
            dark ? 'text-white' : 'text-slate-900'
          )}
        >
          <span
            className={cn(
              'text-[22px] font-bold tracking-tight',
              dark ? 'text-white' : 'text-[#1DAA61]'
            )}
          >
            WhatsApp
          </span>
          <div className="flex items-center gap-4 opacity-85">
            <Camera className="h-5 w-5" />
            <MoreVertical className="h-5 w-5" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="More options"
              onClick={() => onSelectElement?.({ kind: 'navigation', label: 'Header Controls' })}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md',
                dark
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-black/10 bg-black/5 text-slate-900'
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <h2 className="text-[20px] font-bold tracking-tight">Chats</h2>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 items-center gap-2.5 rounded-full border px-2.5 backdrop-blur-md',
                dark
                  ? 'border-white/15 bg-white/10 text-white'
                  : 'border-black/10 bg-black/5 text-slate-900'
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/15 text-[11px] font-bold">
                ₹
              </span>
              <Camera className="h-4 w-4" />
            </div>
            <button
              type="button"
              aria-label="New chat"
              onClick={onOpenChatThread}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-slate-950 shadow-xs"
            >
              <Plus className="h-5 w-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar & Android Filter Chips */}
      <div className="px-4 pb-2">
        <div
          className={cn(
            'flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px]',
            dark
              ? 'bg-[#1C1C1E] text-slate-400'
              : 'bg-[#F0F2F5] text-slate-500'
          )}
        >
          <Search className="h-4 w-4 shrink-0 opacity-70" />
          <span>Ask Meta AI or Search</span>
        </div>

        {isAndroid && (
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[12px] font-medium">
            {['All', 'Unread', 'Favorites', 'Groups'].map((chip, idx) => (
              <span
                key={chip}
                className={cn(
                  'rounded-full px-3 py-1',
                  idx === 0
                    ? dark
                      ? 'bg-[#103529] text-[#25D366]'
                      : 'bg-[#D9FDD3] text-[#006B47]'
                    : dark
                      ? 'bg-[#202C33] text-slate-300'
                      : 'bg-[#F0F2F5] text-slate-600'
                )}
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable Chat List Rows */}
      <div className="flex-1 divide-y divide-transparent overflow-y-auto px-3 pb-24">
        {rows.map((row, idx) => {
          const hasUnread = (row.unreadCount ?? 0) > 0;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => {
                if (idx === 0 && onOpenChatThread) {
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
                'flex w-full items-center gap-3 rounded-2xl px-1.5 py-2.5 text-left transition-colors',
                dark ? 'hover:bg-white/5' : 'hover:bg-slate-50'
              )}
            >
              {/* Avatar / Stacked Community Card */}
              {row.isCommunity ? (
                <div className="relative flex h-[50px] w-[50px] shrink-0 items-center justify-center">
                  <div
                    className={cn(
                      'absolute -left-1 top-1.5 h-9 w-9 -rotate-6 rounded-xl',
                      dark ? 'bg-slate-700' : 'bg-slate-300'
                    )}
                  />
                  <div
                    className="relative flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-xs"
                    style={{ backgroundColor: row.avatarColorHex }}
                  >
                    {row.title.slice(0, 2).toUpperCase()}
                  </div>
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
                  {getInitials(row.title)}
                </div>
              )}

              {/* Content */}
              <div className="min-w-0 flex-1 border-b border-current/5 pb-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[15px] font-semibold">
                    {row.title}
                  </span>
                  <span
                    className={cn(
                      'shrink-0 text-[12px]',
                      hasUnread
                        ? 'font-semibold text-[#25D366]'
                        : dark
                          ? 'text-slate-400'
                          : 'text-slate-500'
                    )}
                  >
                    {row.timeLabel}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <p
                    className={cn(
                      'line-clamp-2 text-[13px] leading-snug',
                      dark ? 'text-slate-400' : 'text-slate-600'
                    )}
                  >
                    {row.previewText}
                  </p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {row.isPinned && !hasUnread && (
                      <Pin className="h-3.5 w-3.5 rotate-45 opacity-45" />
                    )}
                    {hasUnread && (
                      <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-[#25D366] px-1.5 py-0.5 text-[11px] font-bold text-slate-950">
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

      {/* Floating Meta AI Button + Android FAB */}
      <div
        className={cn(
          'pointer-events-none absolute right-4 flex flex-col items-end gap-2.5',
          isAndroid ? 'bottom-[74px]' : 'bottom-[86px]'
        )}
      >
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full shadow-lg',
            dark ? 'bg-[#1F2C34]' : 'bg-white ring-1 ring-slate-200'
          )}
        >
          <span className="h-6 w-6 rounded-full border-[3px] border-transparent bg-gradient-to-tr from-sky-400 via-indigo-500 to-fuchsia-500 bg-clip-border p-0.5">
            <span
              className={cn(
                'block h-full w-full rounded-full',
                dark ? 'bg-[#1F2C34]' : 'bg-white'
              )}
            />
          </span>
        </div>

        {isAndroid && (
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#1DAA61] text-white shadow-lg">
            <SquarePen className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Bottom Navigation: iPhone Liquid Glass Pill vs Android Material 3 Dock */}
      {isAndroid ? (
        <nav
          aria-label="WhatsApp Android navigation"
          className={cn(
            'absolute inset-x-0 bottom-0 flex h-[64px] items-center justify-around border-t px-2',
            dark
              ? 'border-white/10 bg-[#0B141A] text-slate-300'
              : 'border-slate-200 bg-[#FFFFFF] text-slate-700'
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'relative flex h-7 w-14 items-center justify-center rounded-full',
                dark ? 'bg-[#103529] text-[#25D366]' : 'bg-[#D9FDD3] text-[#006B47]'
              )}
            >
              <MessageCircle className="h-4.5 w-4.5 fill-current" />
              {totalUnread > 0 && (
                <span className="absolute -top-1 right-2 rounded-full bg-[#25D366] px-1 text-[9px] font-bold text-slate-950">
                  {totalUnread}
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold">Chats</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-75">
            <CircleDashed className="h-5 w-5" />
            <span className="text-[11px]">Updates</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-75">
            <Users className="h-5 w-5" />
            <span className="text-[11px]">Communities</span>
          </div>
          <div className="flex flex-col items-center gap-1 opacity-75">
            <Phone className="h-5 w-5" />
            <span className="text-[11px]">Calls</span>
          </div>
        </nav>
      ) : (
        <div className="pointer-events-none absolute inset-x-3 bottom-3">
          <nav
            aria-label="WhatsApp iOS Liquid Glass navigation"
            className={cn(
              'flex h-[58px] items-center justify-around rounded-full border px-2 shadow-xl backdrop-blur-xl',
              dark
                ? 'border-white/15 bg-[#1C1C1E]/80 text-slate-200'
                : 'border-white/90 bg-white/80 text-slate-800'
            )}
          >
            <div className="flex flex-col items-center gap-0.5 opacity-80">
              <CircleDashed className="h-4.5 w-4.5" />
              <span className="text-[10px]">Updates</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 opacity-80">
              <Phone className="h-4.5 w-4.5" />
              <span className="text-[10px]">Calls</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 opacity-80">
              <Users className="h-4.5 w-4.5" />
              <span className="text-[10px]">Communities</span>
            </div>
            <div
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-full px-3.5 py-1',
                dark ? 'bg-white/12 text-white' : 'bg-black/8 text-slate-950'
              )}
            >
              <MessageCircle className="h-4.5 w-4.5 fill-current" />
              <span className="text-[10px] font-semibold">Chats</span>
              {totalUnread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 rounded-full bg-[#25D366] px-1.5 text-[9px] font-bold text-slate-950">
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-0.5 opacity-85">
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ backgroundColor: selfUser?.avatarFallbackColor || '#4F46E5' }}
              >
                {(selfUser?.displayName || 'Y')[0]}
              </span>
              <span className="text-[10px]">You</span>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
