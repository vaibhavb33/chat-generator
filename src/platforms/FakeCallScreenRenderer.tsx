'use client';

import React, { useEffect, useState } from 'react';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { Conversation, Participant, PlatformTheme } from '@/core/types';
import { StatusBar } from '@/components/shared-renderers/StatusBar';
import { AvatarBadge } from '@/components/shared-renderers/AvatarBadge';
import { cn } from '@/lib/utils';

export function FakeCallScreenRenderer({
  conversation,
  participantsById,
  theme,
  onUpdateCallMeta,
}: {
  conversation: Conversation;
  participantsById: Record<string, Participant>;
  theme: PlatformTheme;
  onUpdateCallMeta: (patch: Partial<NonNullable<Conversation['callMeta']>>) => void;
}) {
  const call = conversation.callMeta;
  const caller =
    conversation.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conversation.selfParticipantId) ??
    Object.values(participantsById)[0];

  const [elapsed, setElapsed] = useState(call?.durationSeconds ?? 74);

  useEffect(() => {
    if (call?.direction !== 'active') return;
    const timer = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [call?.direction]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

  const isIncoming = call?.direction === 'incoming';
  const bgGradient =
    call?.callPlatform === 'whatsapp-voice' || call?.callPlatform === 'whatsapp-video'
      ? 'from-[#0B141A] via-[#132A24] to-[#0B141A]'
      : call?.callPlatform === 'instagram-video'
        ? 'from-[#1E1B4B] via-[#4C1D95] to-[#1E1B4B]'
        : 'from-slate-900 via-indigo-950 to-slate-950';

  return (
    <div
      className={cn(
        'flex min-h-[590px] flex-col justify-between bg-gradient-to-b text-white',
        bgGradient
      )}
    >
      <div>
        <StatusBar
          statusBar={theme.statusBar}
          osVariant={theme.osVariant}
          darkBg
        />
        <div className="pt-10 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-white/70">
            {call?.callStateLabel || 'Voice Call'}
          </p>
          <div className="mt-6 flex justify-center">
            <div className="relative">
              {isIncoming && (
                <span className="absolute -inset-3 animate-ping rounded-full bg-white/15" />
              )}
              <AvatarBadge participant={caller} size="xl" />
            </div>
          </div>
          <h3 className="mt-5 text-2xl font-bold tracking-tight">
            {caller?.displayName ?? 'Maya Lin'}
          </h3>
          <p className="mt-1 text-sm text-white/75">
            {isIncoming
              ? 'Incoming call...'
              : call?.direction === 'outgoing'
                ? 'Calling...'
                : `${mins}:${secs}`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 pb-10">
        {isIncoming ? (
          <div className="flex items-center justify-around">
            <button
              type="button"
              onClick={() => onUpdateCallMeta({ direction: 'outgoing' })}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 shadow-lg hover:bg-rose-600">
                <PhoneOff className="h-6 w-6" />
              </span>
              <span className="text-xs text-white/80">Decline</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateCallMeta({ direction: 'active' })}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg hover:bg-emerald-600">
                <Phone className="h-6 w-6" />
              </span>
              <span className="text-xs text-white/80">Accept</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <button
                type="button"
                onClick={() => onUpdateCallMeta({ isSpeakerOn: !call?.isSpeakerOn })}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <span
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                    call?.isSpeakerOn ? 'bg-white text-slate-900' : 'bg-white/15 text-white'
                  )}
                >
                  {call?.isSpeakerOn ? (
                    <Volume2 className="h-5 w-5" />
                  ) : (
                    <VolumeX className="h-5 w-5" />
                  )}
                </span>
                <span className="text-[11px] text-white/75">Speaker</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateCallMeta({ isCameraOn: !call?.isCameraOn })}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <span
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                    call?.isCameraOn ? 'bg-white text-slate-900' : 'bg-white/15 text-white'
                  )}
                >
                  {call?.isCameraOn ? (
                    <Video className="h-5 w-5" />
                  ) : (
                    <VideoOff className="h-5 w-5" />
                  )}
                </span>
                <span className="text-[11px] text-white/75">Video</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateCallMeta({ isMuted: !call?.isMuted })}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <span
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full transition-colors',
                    call?.isMuted ? 'bg-white text-slate-900' : 'bg-white/15 text-white'
                  )}
                >
                  {call?.isMuted ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </span>
                <span className="text-[11px] text-white/75">Mute</span>
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => onUpdateCallMeta({ direction: 'incoming' })}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500 shadow-lg hover:bg-rose-600 cursor-pointer"
                aria-label="Reset call to incoming"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
