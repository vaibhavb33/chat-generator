'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function TypingIndicator({
  label,
  darkMode = false,
  bubbleClassName,
}: {
  label?: string;
  darkMode?: boolean;
  bubbleClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2 pt-1" role="status" aria-label="Typing indicator">
      <div
        className={cn(
          'inline-flex items-center gap-1 rounded-2xl px-3.5 py-2.5 shadow-2xs',
          bubbleClassName ??
            (darkMode ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-500')
        )}
      >
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.25s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.12s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
      </div>
      {label && <span className="text-[11px] opacity-65">{label}</span>}
    </div>
  );
}
