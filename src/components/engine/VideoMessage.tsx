import React from 'react';
import { Play } from 'lucide-react';
import type { Attachment } from '@/core/types';

export function VideoMessage({
  attachment,
  caption,
}: {
  attachment?: Attachment;
  caption?: string;
}) {
  const secs = attachment?.durationSeconds ?? 18;
  const formatted = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
  return (
    <div className="space-y-1.5">
      <div className="relative flex h-36 w-52 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-900 text-white">
        {attachment?.previewDataUrl && (
          <img
            src={attachment.previewDataUrl}
            alt="Video thumbnail"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
        )}
        <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-xs">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </span>
        <span className="absolute bottom-2 left-2 z-10 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold">
          {formatted}
        </span>
      </div>
      {caption && <p className="text-[13px] leading-snug">{caption}</p>}
    </div>
  );
}
