import React from 'react';
import { ImageIcon } from 'lucide-react';
import type { Attachment } from '@/core/types';

export function ImageMessage({
  attachment,
  caption,
}: {
  attachment?: Attachment;
  caption?: string;
}) {
  const isGif = attachment?.kind === 'gif';
  return (
    <div className="space-y-1.5">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20">
        {attachment?.previewDataUrl ? (
          <img
            src={attachment.previewDataUrl}
            alt={caption || attachment.caption || 'Chat image'}
            className="max-h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-36 w-52 flex-col items-center justify-center gap-1.5 text-xs font-medium opacity-75">
            <ImageIcon className="h-6 w-6" />
            <span>{isGif ? 'Animated GIF Preview' : 'Photo Attachment'}</span>
          </div>
        )}
        {isGif && (
          <span className="absolute bottom-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white">
            GIF
          </span>
        )}
      </div>
      {caption && <p className="text-[13px] leading-snug">{caption}</p>}
    </div>
  );
}
