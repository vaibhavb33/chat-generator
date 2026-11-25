'use client';

import React from 'react';
import type { Reaction } from '@/core/types';
import { cn } from '@/lib/utils';

export function MessageReaction({
  reactions,
  variant = 'floating',
  isSelf = false,
  darkMode = false,
  onToggleReaction,
}: {
  reactions: Reaction[];
  variant?: 'floating' | 'tapback' | 'discord_pills';
  isSelf?: boolean;
  darkMode?: boolean;
  onToggleReaction?: (emoji: string) => void;
}) {
  if (reactions.length === 0) return null;

  if (variant === 'discord_pills') {
    return (
      <div className="mt-1.5 flex flex-wrap gap-1">
        {reactions.map((r) => (
          <button
            key={r.emoji}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleReaction?.(r.emoji);
            }}
            className={cn(
              'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer',
              darkMode
                ? 'border-indigo-400/40 bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            )}
          >
            <span>{r.emoji}</span>
            <span>{r.count}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'tapback') {
    return (
      <div
        className={cn(
          'absolute -top-2.5 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] shadow-sm ring-2',
          isSelf
            ? 'left-2 bg-[#007AFF] text-white ring-white dark:ring-[#0B0B0E]'
            : 'right-2 bg-slate-500 text-white ring-white dark:ring-[#0B0B0E]'
        )}
      >
        {reactions.map((r) => (
          <span key={r.emoji}>{r.emoji}</span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'absolute -bottom-2.5 flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] shadow-sm',
        isSelf ? 'left-2' : 'right-2',
        darkMode
          ? 'border-slate-700 bg-slate-800 text-white'
          : 'border-slate-200 bg-white text-slate-900'
      )}
    >
      {reactions.map((r) => (
        <span key={r.emoji}>
          {r.emoji}
          {r.count > 1 ? ` ${r.count}` : ''}
        </span>
      ))}
    </div>
  );
}
