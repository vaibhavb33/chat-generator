import React from 'react';
import { FileText } from 'lucide-react';
import type { Attachment } from '@/core/types';
import { cn } from '@/lib/utils';

export function DocumentMessage({
  attachment,
  darkMode = false,
}: {
  attachment?: Attachment;
  darkMode?: boolean;
}) {
  const sizeMb = attachment?.fileSizeBytes
    ? `${(attachment.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB`
    : '1.4 MB';

  return (
    <div
      className={cn(
        'flex min-w-[205px] items-center gap-2.5 rounded-xl p-2',
        darkMode ? 'bg-white/10' : 'bg-black/5'
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">
          {attachment?.fileName || 'Document.pdf'}
        </p>
        <p className="text-[10px] opacity-75">
          {attachment?.pageCount ?? 4} pages • PDF • {sizeMb}
        </p>
      </div>
    </div>
  );
}
