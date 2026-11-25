'use client';

import React from 'react';
import { Mic, Play } from 'lucide-react';
import type { Attachment } from '@/core/types';
import { cn } from '@/lib/utils';

export function VoiceMessage({
  attachment,
  accentClass = 'bg-indigo-500',
  isSimulatingPlayback = false,
}: {
  attachment?: Attachment;
  accentClass?: string;
  isSimulatingPlayback?: boolean;
}) {
  const peaks = attachment?.voiceNoteMeta?.waveformPeaks ?? [
    0.3, 0.7, 0.5, 0.9, 0.6, 0.4, 0.8, 0.5, 0.7, 0.3, 0.65, 0.85,
  ];
  const secs = attachment?.durationSeconds ?? 12;
  const formatted = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div className="flex min-w-[195px] items-center gap-2.5 py-0.5">
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform',
          accentClass,
          isSimulatingPlayback && 'scale-105 ring-2 ring-white/50'
        )}
      >
        <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex h-5 items-center gap-[2px]">
          {peaks.map((peak, i) => (
            <span
              key={i}
              className={cn(
                'w-[2.5px] rounded-full transition-all duration-300',
                isSimulatingPlayback
                  ? 'animate-pulse bg-current opacity-95'
                  : i < peaks.length * 0.6
                    ? 'bg-current opacity-85'
                    : 'bg-current opacity-35'
              )}
              style={{
                height: `${Math.max(4, Math.round(peak * 18))}px`,
                animationDelay: isSimulatingPlayback ? `${i * 55}ms` : undefined,
              }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] opacity-75">
          <span>{isSimulatingPlayback ? 'Playing...' : formatted}</span>
          <Mic className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
