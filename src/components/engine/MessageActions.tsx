'use client';

import React from 'react';
import { ArrowLeftRight, Copy, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MessageActions({
  visible,
  onDuplicate,
  onSwitchSender,
  onDelete,
}: {
  visible: boolean;
  onDuplicate: () => void;
  onSwitchSender: () => void;
  onDelete: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      data-export-ignore="true"
      className={cn(
        'mb-1 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-700 shadow-md dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onSwitchSender}
        title="Switch sender"
        aria-label="Quick switch sender"
        className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
      >
        <ArrowLeftRight className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={onDuplicate}
        title="Duplicate message"
        aria-label="Quick duplicate message"
        className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
      >
        <Copy className="h-3 w-3" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="Delete message"
        aria-label="Quick delete message"
        className="rounded p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}
