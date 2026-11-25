import React from 'react';
import { Camera, Mic, Paperclip, Plus, Send, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MessageInput({
  placeholder = 'Message',
  darkMode = false,
  actionButtonClass = 'bg-indigo-600',
  useSendIcon = false,
  leadingPlus = false,
  containerClassName,
}: {
  placeholder?: string;
  darkMode?: boolean;
  actionButtonClass?: string;
  useSendIcon?: boolean;
  leadingPlus?: boolean;
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2.5 select-none',
        darkMode
          ? 'bg-black/35 text-slate-300'
          : 'border-t border-black/5 bg-white/90 text-slate-500',
        containerClassName
      )}
    >
      {leadingPlus && (
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
            darkMode ? 'bg-white/15 text-slate-200' : 'bg-slate-200 text-slate-600'
          )}
        >
          <Plus className="h-4 w-4" />
        </span>
      )}
      <div
        className={cn(
          'flex flex-1 items-center gap-2 rounded-full px-3 py-1.5 text-xs',
          darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'
        )}
      >
        <Smile className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate opacity-80">{placeholder}</span>
        <Paperclip className="h-4 w-4 shrink-0" />
        <Camera className="h-4 w-4 shrink-0" />
      </div>
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white',
          actionButtonClass
        )}
      >
        {useSendIcon ? (
          <Send className="h-3.5 w-3.5" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </span>
    </div>
  );
}
