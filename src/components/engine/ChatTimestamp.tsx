import React from 'react';
import { cn } from '@/lib/utils';

export function ChatTimestamp({
  text,
  variant = 'pill',
  darkMode = false,
  className,
}: {
  text?: string;
  variant?: 'pill' | 'plain' | 'divider';
  darkMode?: boolean;
  className?: string;
}) {
  if (!text) return null;

  if (variant === 'divider') {
    return (
      <div className={cn('flex items-center gap-2 py-1.5 text-[11px] opacity-65', className)}>
        <span className="h-px flex-1 bg-current opacity-20" />
        <span className="font-semibold">{text}</span>
        <span className="h-px flex-1 bg-current opacity-20" />
      </div>
    );
  }

  if (variant === 'plain') {
    return (
      <div className={cn('py-1 text-center text-[11px] font-medium opacity-60', className)}>
        {text}
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center py-1', className)}>
      <span
        className={cn(
          'rounded-lg px-2.5 py-0.5 text-[11px] font-medium shadow-2xs',
          darkMode
            ? 'bg-slate-800/90 text-slate-300'
            : 'bg-white/85 text-slate-600'
        )}
      >
        {text}
      </span>
    </div>
  );
}
