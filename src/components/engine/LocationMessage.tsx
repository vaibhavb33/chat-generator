import React from 'react';
import { MapPin } from 'lucide-react';
import type { Attachment } from '@/core/types';

export function LocationMessage({ attachment }: { attachment?: Attachment }) {
  return (
    <div className="w-52 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
      <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700">
        <MapPin className="h-7 w-7 text-rose-500 drop-shadow" />
      </div>
      <div className="p-2 text-xs">
        <p className="font-semibold">
          {attachment?.locationMeta?.placeName ?? 'Shared Location'}
        </p>
        <p className="text-[10px] opacity-75">
          {attachment?.locationMeta?.address ?? 'San Francisco, CA'}
        </p>
      </div>
    </div>
  );
}
