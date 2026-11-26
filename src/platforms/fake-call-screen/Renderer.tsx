'use client';

import React, { useEffect, useState } from 'react';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  PhoneMissed,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Grid,
  UserPlus,
  Users,
  MessageSquare,
  Clock,
  Pause,
  Play,
  Disc,
  Shield,
  X,
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

  const [activeBonusSeconds, setActiveBonusSeconds] = useState(0);
  const [showKeypad, setShowKeypad] = useState(call?.isKeypadOpen ?? false);

  // Timer simulation for active call state
  useEffect(() => {
    if (call?.direction !== 'active') return;
    const timer = setInterval(() => {
      setActiveBonusSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [call?.direction]);

  const elapsed = (call?.durationSeconds ?? 74) + activeBonusSeconds;

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');
  const formattedDuration = `${mins}:${secs}`;

  const isIncoming = call?.direction === 'incoming';
  const isOutgoing = call?.direction === 'outgoing';
  const isActive = call?.direction === 'active';
  const isMissed = call?.direction === 'missed';

  const isAndroid = theme.deviceType
    ? theme.deviceType === 'android'
    : call?.deviceMode === 'android' ||
      theme.osVariant === 'android' ||
      call?.callPlatform === 'android-phone';
  const isLightMode = theme.colorScheme === 'light';

  const isWhatsApp =
    call?.callPlatform === 'whatsapp-voice' || call?.callPlatform === 'whatsapp-video';
  const isFaceTime = call?.callPlatform === 'facetime';

  // Background styling
  const bgStyle = call?.backgroundStyle ?? (isWhatsApp ? 'whatsapp-emerald' : 'dark-gradient');

  const callerName = caller?.displayName ?? 'Maya Lin';
  const phoneNumber = call?.phoneNumber || caller?.phoneOrEmail || '+1 (415) 555-0194';
  const callTypeLabel = call?.callTypeLabel || (isWhatsApp ? 'WhatsApp audio' : isFaceTime ? 'FaceTime Audio' : 'mobile');

  return (
    <div
      data-testid="renderer-fake-call-screen"
      data-device-type={isAndroid ? 'android' : 'iphone'}
      className={cn(
        'relative flex min-h-[680px] flex-1 flex-col justify-between overflow-hidden select-none transition-colors',
        isLightMode && (bgStyle === 'dark-gradient' || bgStyle === 'solid-slate')
          ? 'bg-gradient-to-b from-slate-100 via-white to-slate-200 text-slate-950'
          : 'text-white',
        !isLightMode && bgStyle === 'dark-gradient' && 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950',
        !isLightMode && bgStyle === 'solid-slate' && 'bg-slate-950',
        bgStyle === 'whatsapp-emerald' && 'bg-gradient-to-b from-[#0B141A] via-[#132A24] to-[#0B141A] text-white',
        bgStyle === 'blur-avatar' && 'bg-slate-950 text-white'
      )}
      style={
        bgStyle === 'custom-image' && call?.customBackgroundUrl
          ? {
              backgroundImage: `url(${call.customBackgroundUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Blurred background photo layer if blur-avatar is active */}
      {bgStyle === 'blur-avatar' && caller?.avatarDataUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30 filter blur-2xl scale-125"
          style={{ backgroundImage: `url(${caller.avatarDataUrl})` }}
        />
      )}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-0',
          isLightMode && (bgStyle === 'dark-gradient' || bgStyle === 'solid-slate')
            ? 'bg-transparent'
            : 'bg-black/35'
        )}
      />

      {/* Top Header & Status Bar */}
      <div className="relative z-10 w-full">
        <StatusBar
          statusBar={theme.statusBar}
          osVariant={isAndroid ? 'android' : 'ios'}
          darkBg={!(isLightMode && (bgStyle === 'dark-gradient' || bgStyle === 'solid-slate'))}
        />

        {/* WhatsApp Encrypted Call Header */}
        {isWhatsApp && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-emerald-400/90">
            <Shield className="h-3 w-3" />
            <span>End-to-end encrypted</span>
          </div>
        )}

        {/* Caller Info Header */}
        <div className="pt-6 px-4 text-center">
          {/* Subtitle / Call Type */}
          <p
            data-testid="call-subtitle-label"
            className="text-xs font-medium tracking-wide text-white/70 uppercase"
          >
            {isMissed
              ? 'Missed Call'
              : call?.callStateLabel || (isWhatsApp ? 'WhatsApp Voice Call' : isFaceTime ? 'FaceTime Audio' : callTypeLabel)}
          </p>

          {/* Caller Avatar */}
          <div className="mt-5 flex justify-center">
            <div className="relative">
              {isIncoming && (
                <>
                  <span className="absolute -inset-4 animate-ping rounded-full bg-emerald-500/20" />
                  <span className="absolute -inset-2 rounded-full bg-emerald-500/30" />
                </>
              )}
              {isOutgoing && (
                <span className="absolute -inset-3 animate-pulse rounded-full bg-blue-500/20" />
              )}
              {isMissed && (
                <span className="absolute -inset-2 rounded-full bg-rose-500/25" />
              )}
              <AvatarBadge participant={caller} size="xl" />
            </div>
          </div>

          {/* Caller Display Name */}
          <h3
            data-testid="call-display-name"
            className="mt-4 text-2xl font-bold tracking-tight text-white drop-shadow-sm"
          >
            {callerName}
          </h3>

          {/* Phone Number */}
          {phoneNumber && (
            <p
              data-testid="call-phone-number"
              className="mt-0.5 text-xs font-normal tracking-wide text-white/60"
            >
              {phoneNumber}
            </p>
          )}

          {/* Dynamic Status / Duration Text */}
          <p
            data-testid="call-status-indicator"
            className={cn(
              'mt-2 text-sm font-medium tracking-wide drop-shadow-sm',
              isIncoming && 'text-emerald-400',
              isOutgoing && 'text-blue-400',
              isActive && 'text-white/85 text-base font-semibold',
              isMissed && 'text-rose-400'
            )}
          >
            {isIncoming
              ? 'Incoming call...'
              : isOutgoing
                ? 'Calling...'
                : isActive
                  ? formattedDuration
                  : 'Missed Call'}
          </p>
        </div>
      </div>

      {/* Keypad Overlay Modal */}
      {showKeypad && (
        <div
          data-testid="call-keypad-overlay"
          className="relative z-20 mx-4 my-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl p-4 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Keypad
            </span>
            <button
              type="button"
              onClick={() => {
                setShowKeypad(false);
                onUpdateCallMeta({ isKeypadOpen: false });
              }}
              className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            {[
              { num: '1', sub: '' },
              { num: '2', sub: 'ABC' },
              { num: '3', sub: 'DEF' },
              { num: '4', sub: 'GHI' },
              { num: '5', sub: 'JKL' },
              { num: '6', sub: 'MNO' },
              { num: '7', sub: 'PQRS' },
              { num: '8', sub: 'TUV' },
              { num: '9', sub: 'WXYZ' },
              { num: '*', sub: '' },
              { num: '0', sub: '+' },
              { num: '#', sub: '' },
            ].map(({ num, sub }) => (
              <div
                key={num}
                className="flex flex-col items-center justify-center h-11 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors cursor-pointer"
              >
                <span className="text-base font-semibold leading-none">{num}</span>
                {sub && <span className="text-[9px] text-white/50 leading-none mt-0.5">{sub}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Call Action Controls */}
      <div className="relative z-10 w-full px-6 pb-8 pt-4">
        {/* State 1: Incoming Call */}
        {isIncoming && (
          <div className="space-y-6">
            {/* Quick reminder actions (iOS-style) */}
            {!isAndroid && (
              <div className="flex items-center justify-around px-4">
                <button
                  type="button"
                  className="flex flex-col items-center gap-1 text-white/75 hover:text-white transition-colors cursor-pointer"
                  onClick={() => onUpdateCallMeta({ callStateLabel: 'Reminder Set' })}
                >
                  <Clock className="h-5 w-5" />
                  <span className="text-[11px]">Remind Me</span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-center gap-1 text-white/75 hover:text-white transition-colors cursor-pointer"
                  onClick={() => onUpdateCallMeta({ callStateLabel: 'Message Sent' })}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-[11px]">Message</span>
                </button>
              </div>
            )}

            {/* Accept / Decline buttons */}
            <div className="flex items-center justify-around">
              {/* Decline Button */}
              <button
                type="button"
                data-testid="call-decline-button"
                onClick={() => onUpdateCallMeta({ direction: 'missed' })}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/30 group-hover:bg-rose-600 transition-colors">
                  <PhoneOff className="h-7 w-7 text-white" />
                </span>
                <span className="text-xs font-medium text-white/80">Decline</span>
              </button>

              {/* Accept Button */}
              <button
                type="button"
                data-testid="call-accept-button"
                onClick={() => onUpdateCallMeta({ direction: 'active' })}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 group-hover:bg-emerald-600 transition-colors">
                  <Phone className="h-7 w-7 text-white" />
                </span>
                <span className="text-xs font-medium text-white/80">Accept</span>
              </button>
            </div>
          </div>
        )}

        {/* State 2 & 3: Outgoing & Active (Ongoing) Call */}
        {(isActive || isOutgoing) && (
          <div className="space-y-6">
            {/* 2x3 Control Grid */}
            <div className="grid grid-cols-3 gap-y-5 gap-x-4 text-center">
              {/* Mute */}
              <button
                type="button"
                data-testid="call-btn-mute"
                onClick={() => onUpdateCallMeta({ isMuted: !call?.isMuted })}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <span
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md',
                    call?.isMuted
                      ? 'bg-white text-slate-900 shadow-white/20'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  )}
                >
                  {call?.isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </span>
                <span className="text-[11px] font-medium text-white/75">
                  {call?.isMuted ? 'unmute' : 'mute'}
                </span>
              </button>

              {/* Keypad */}
              <button
                type="button"
                data-testid="call-btn-keypad"
                onClick={() => {
                  const nextState = !showKeypad;
                  setShowKeypad(nextState);
                  onUpdateCallMeta({ isKeypadOpen: nextState });
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <span
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md',
                    showKeypad
                      ? 'bg-white text-slate-900 shadow-white/20'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  )}
                >
                  <Grid className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-medium text-white/75">keypad</span>
              </button>

              {/* Speaker */}
              <button
                type="button"
                data-testid="call-btn-speaker"
                onClick={() => onUpdateCallMeta({ isSpeakerOn: !call?.isSpeakerOn })}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <span
                  className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md',
                    call?.isSpeakerOn
                      ? 'bg-white text-slate-900 shadow-white/20'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  )}
                >
                  {call?.isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                </span>
                <span className="text-[11px] font-medium text-white/75">speaker</span>
              </button>

              {/* Add Call */}
              <button
                type="button"
                data-testid="call-btn-add-call"
                onClick={() => onUpdateCallMeta({ callStateLabel: 'Adding participant...' })}
                className="flex flex-col items-center gap-1.5 cursor-pointer group"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-all shadow-md">
                  <UserPlus className="h-6 w-6" />
                </span>
                <span className="text-[11px] font-medium text-white/75">add call</span>
              </button>

              {/* Video / FaceTime / Hold */}
              {isAndroid ? (
                <button
                  type="button"
                  data-testid="call-btn-hold"
                  onClick={() => onUpdateCallMeta({ isHold: !call?.isHold })}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md',
                      call?.isHold
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-white/15 text-white hover:bg-white/25'
                    )}
                  >
                    {call?.isHold ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                  </span>
                  <span className="text-[11px] font-medium text-white/75">
                    {call?.isHold ? 'resume' : 'hold'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="call-btn-video"
                  onClick={() => onUpdateCallMeta({ isCameraOn: !call?.isCameraOn })}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span
                    className={cn(
                      'flex h-14 w-14 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md',
                      call?.isCameraOn
                        ? 'bg-white text-slate-900 shadow-white/20'
                        : 'bg-white/15 text-white hover:bg-white/25'
                    )}
                  >
                    {call?.isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                  </span>
                  <span className="text-[11px] font-medium text-white/75">FaceTime</span>
                </button>
              )}

              {/* Contacts / Record */}
              {isAndroid ? (
                <button
                  type="button"
                  data-testid="call-btn-record"
                  className="flex flex-col items-center gap-1.5 cursor-pointer group text-white/80 hover:text-white"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-all shadow-md">
                    <Disc className="h-6 w-6" />
                  </span>
                  <span className="text-[11px] font-medium text-white/75">record</span>
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="call-btn-contacts"
                  className="flex flex-col items-center gap-1.5 cursor-pointer group text-white/80 hover:text-white"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-all shadow-md">
                    <Users className="h-6 w-6" />
                  </span>
                  <span className="text-[11px] font-medium text-white/75">contacts</span>
                </button>
              )}
            </div>

            {/* End Call Button */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                data-testid="call-end-button"
                onClick={() => onUpdateCallMeta({ direction: 'incoming' })}
                className="group flex flex-col items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                aria-label="End call"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/30 group-hover:bg-rose-600 transition-colors">
                  <PhoneOff className="h-7 w-7 text-white" />
                </span>
                <span className="text-xs font-medium text-white/80">End</span>
              </button>
            </div>
          </div>
        )}

        {/* State 4: Missed Call Screen */}
        {isMissed && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 text-center border border-white/10">
              <div className="flex justify-center mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20 text-rose-400">
                  <PhoneMissed className="h-5 w-5" />
                </div>
              </div>
              <p className="text-sm font-semibold text-white">Call was missed</p>
              <p className="text-xs text-white/60 mt-0.5">
                {callerName} tried calling {callTypeLabel}
              </p>
            </div>

            <div className="flex items-center justify-around">
              {/* Call Back Button */}
              <button
                type="button"
                data-testid="call-callback-button"
                onClick={() => onUpdateCallMeta({ direction: 'outgoing' })}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 group-hover:bg-emerald-600 transition-colors">
                  <Phone className="h-6 w-6 text-white" />
                </span>
                <span className="text-xs font-medium text-white/80">Call Back</span>
              </button>

              {/* Message Button */}
              <button
                type="button"
                data-testid="call-message-button"
                onClick={() => onUpdateCallMeta({ callStateLabel: 'Opened Messages' })}
                className="group flex flex-col items-center gap-2 cursor-pointer transition-transform active:scale-95"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 group-hover:bg-blue-600 transition-colors">
                  <MessageSquare className="h-6 w-6 text-white" />
                </span>
                <span className="text-xs font-medium text-white/80">Message</span>
              </button>
            </div>
          </div>
        )}

        {/* Optional Fictional Watermark Badge */}
        {call?.showFictionalBadge && (
          <div
            data-testid="fictional-mockup-watermark"
            className="mt-6 flex justify-center text-center"
          >
            <span className="inline-flex items-center rounded-full bg-black/40 px-3 py-1 text-[10px] font-medium tracking-wider uppercase text-white/60 border border-white/10 backdrop-blur-sm">
              Fictional Call Mockup • Created for Creative Content
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
