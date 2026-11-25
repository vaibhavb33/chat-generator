import React from 'react';
import { PhoneCall, Video } from 'lucide-react';
import type { Message } from '@/core/types';
import { cn } from '@/lib/utils';

export function CallEvent({
  message,
  darkMode = false,
}: {
  message: Message;
  darkMode?: boolean;
}) {
  const evt = message.callEvent ?? {
    media: 'voice',
    outcome: 'answered',
    durationLabel: '4 mins',
  };
  const isMissed = evt.outcome === 'missed' || evt.outcome === 'declined';

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs',
        darkMode ? 'bg-white/10 text-slate-100' : 'bg-black/5 text-slate-800'
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isMissed
            ? 'bg-rose-500/20 text-rose-500'
            : 'bg-emerald-500/20 text-emerald-500'
        )}
      >
        {evt.media === 'video' ? (
          <Video className="h-4 w-4" />
        ) : (
          <PhoneCall className="h-4 w-4" />
        )}
      </span>
      <div>
        <p className="font-semibold capitalize">
          {evt.outcome} {evt.media} call
        </p>
        {evt.durationLabel && (
          <p className="text-[11px] opacity-75">{evt.durationLabel}</p>
        )}
      </div>
    </div>
  );
}
