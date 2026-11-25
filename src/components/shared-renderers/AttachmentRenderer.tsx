import React from 'react';
import {
  FileText,
  MapPin,
  PhoneCall,
  Play,
  UserCheck,
  Mic,
} from 'lucide-react';
import type { Attachment, Message } from '@/core/types';
import { cn } from '@/lib/utils';

export function AttachmentRenderer({
  message,
  darkMode,
  accentClass = 'bg-indigo-500',
}: {
  message: Message;
  darkMode: boolean;
  accentClass?: string;
}) {
  const att: Attachment | undefined = message.attachments[0];

  if (message.type === 'call_event' && message.callEvent) {
    return (
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs',
          darkMode ? 'bg-white/10 text-slate-100' : 'bg-black/5 text-slate-800'
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
          <PhoneCall className="h-4 w-4" />
        </span>
        <div>
          <p className="font-semibold capitalize">
            {message.callEvent.outcome} {message.callEvent.media} call
          </p>
          {message.callEvent.durationLabel && (
            <p className="text-[11px] opacity-75">{message.callEvent.durationLabel}</p>
          )}
        </div>
      </div>
    );
  }

  if (message.type === 'poll' && message.pollData) {
    const totalVotes = Math.max(
      1,
      message.pollData.options.reduce((acc, o) => acc + o.voteCount, 0)
    );
    return (
      <div className="min-w-[210px] space-y-2 py-0.5">
        <p className="text-xs font-semibold">{message.pollData.question}</p>
        <div className="space-y-1.5">
          {message.pollData.options.map((opt) => {
            const pct = Math.round((opt.voteCount / totalVotes) * 100);
            return (
              <div key={opt.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium">{opt.label}</span>
                  <span className="opacity-75">{opt.voteCount}</span>
                </div>
                <div
                  className={cn(
                    'h-1.5 w-full overflow-hidden rounded-full',
                    darkMode ? 'bg-white/15' : 'bg-black/10'
                  )}
                >
                  <div
                    className={cn('h-full rounded-full', accentClass)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!att) return null;

  if (att.kind === 'voice_note') {
    const peaks = att.voiceNoteMeta?.waveformPeaks ?? [
      0.3, 0.7, 0.5, 0.9, 0.6, 0.4, 0.8, 0.5, 0.7, 0.3,
    ];
    const secs = att.durationSeconds ?? 12;
    const formatted = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
    return (
      <div className="flex min-w-[195px] items-center gap-2.5 py-0.5">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white',
            accentClass
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
                  'w-[2.5px] rounded-full',
                  i < peaks.length * 0.6
                    ? 'bg-current opacity-85'
                    : 'bg-current opacity-35'
                )}
                style={{ height: `${Math.max(4, Math.round(peak * 18))}px` }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] opacity-75">
            <span>{formatted}</span>
            <Mic className="h-3 w-3" />
          </div>
        </div>
      </div>
    );
  }

  if (att.kind === 'image' || att.kind === 'gif' || att.kind === 'video_preview') {
    return (
      <div className="space-y-1.5">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-blue-500/20">
          {att.previewDataUrl ? (
            <img
              src={att.previewDataUrl}
              alt={att.caption || 'Chat media'}
              className="max-h-48 w-full object-cover"
            />
          ) : (
            <div className="flex h-36 w-52 items-center justify-center text-xs font-medium opacity-75">
              {att.kind === 'gif' ? 'GIF Preview' : 'Media Attachment'}
            </div>
          )}
          {att.kind === 'gif' && (
            <span className="absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
              GIF
            </span>
          )}
          {att.kind === 'video_preview' && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white">
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </span>
            </span>
          )}
        </div>
        {message.text && <p className="text-[13px] leading-snug">{message.text}</p>}
      </div>
    );
  }

  if (att.kind === 'document') {
    return (
      <div
        className={cn(
          'flex min-w-[200px] items-center gap-2.5 rounded-xl p-2',
          darkMode ? 'bg-white/10' : 'bg-black/5'
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-500">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">
            {att.fileName || 'Document.pdf'}
          </p>
          <p className="text-[10px] opacity-75">
            {att.pageCount ?? 4} pages • PDF • 1.4 MB
          </p>
        </div>
      </div>
    );
  }

  if (att.kind === 'location') {
    return (
      <div className="w-52 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
        <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700">
          <MapPin className="h-7 w-7 text-rose-500 drop-shadow" />
        </div>
        <div className="p-2 text-xs">
          <p className="font-semibold">
            {att.locationMeta?.placeName ?? 'Shared Location'}
          </p>
          <p className="text-[10px] opacity-75">
            {att.locationMeta?.address ?? 'San Francisco, CA'}
          </p>
        </div>
      </div>
    );
  }

  if (att.kind === 'contact_card') {
    return (
      <div
        className={cn(
          'flex min-w-[195px] items-center gap-2.5 rounded-xl p-2.5',
          darkMode ? 'bg-white/10' : 'bg-black/5'
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-500">
          <UserCheck className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold">
            {att.contactCardMeta?.fullName ?? 'Contact'}
          </p>
          <p className="text-[10px] opacity-75">
            {att.contactCardMeta?.phoneOrHandle ?? '+1 (415) 555-0194'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
