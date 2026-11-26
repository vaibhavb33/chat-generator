'use client';

import React, { useState } from 'react';
import {
  Phone,
  PhoneMissed,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Grid,
  Video,
  User,
  Smartphone,
  Sparkles,
  Undo2,
  Redo2,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';
import type { Conversation, Participant } from '@/core/types';

interface FakeCallEditorProps {
  onOpenScriptImport?: () => void;
  onRequestClearAll?: () => void;
}

export interface CallPresetDef {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  caller: {
    name: string;
    phone: string;
    avatarDataUrl?: string;
  };
  call: {
    direction: 'incoming' | 'outgoing' | 'active' | 'missed';
    callPlatform: 'ios-phone' | 'android-phone' | 'facetime' | 'whatsapp-voice' | 'whatsapp-video';
    deviceMode: 'ios' | 'android';
    callTypeLabel: string;
    callStateLabel: string;
    durationSeconds: number;
    backgroundStyle: 'dark-gradient' | 'blur-avatar' | 'whatsapp-emerald' | 'solid-slate';
    isMuted: boolean;
    isSpeakerOn: boolean;
    isCameraOn: boolean;
    showFictionalBadge: boolean;
  };
}

export const CALL_PRESETS: CallPresetDef[] = [
  {
    id: 'boss-urgent',
    name: 'Boss / Urgent Alert',
    tagline: 'Incoming high-priority call from leadership or client',
    badge: 'Urgent',
    caller: {
      name: 'Boss 👔',
      phone: '+1 (555) 019-2831',
      avatarDataUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    call: {
      direction: 'incoming',
      callPlatform: 'ios-phone',
      deviceMode: 'ios',
      callTypeLabel: 'Work Mobile',
      callStateLabel: 'Incoming call...',
      durationSeconds: 0,
      backgroundStyle: 'dark-gradient',
      isMuted: false,
      isSpeakerOn: false,
      isCameraOn: false,
      showFictionalBadge: false,
    },
  },
  {
    id: 'mom-incoming',
    name: 'Mom Calling',
    tagline: 'Heartwarming family check-in with blurred contact poster',
    badge: 'Personal',
    caller: {
      name: 'Mom ❤️',
      phone: '+1 (415) 890-1234',
      avatarDataUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    call: {
      direction: 'incoming',
      callPlatform: 'ios-phone',
      deviceMode: 'ios',
      callTypeLabel: 'mobile',
      callStateLabel: 'Incoming call...',
      durationSeconds: 0,
      backgroundStyle: 'blur-avatar',
      isMuted: false,
      isSpeakerOn: false,
      isCameraOn: false,
      showFictionalBadge: false,
    },
  },
  {
    id: 'active-support',
    name: 'Ongoing Tech Support',
    tagline: 'Active 08:35 consultation with speaker enabled',
    badge: 'Active Call',
    caller: {
      name: 'Apple Support',
      phone: '1-800-MY-APPLE',
      avatarDataUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    },
    call: {
      direction: 'active',
      callPlatform: 'ios-phone',
      deviceMode: 'ios',
      callTypeLabel: 'Toll-Free',
      callStateLabel: 'Active Call',
      durationSeconds: 515, // 08:35
      backgroundStyle: 'dark-gradient',
      isMuted: false,
      isSpeakerOn: true,
      isCameraOn: false,
      showFictionalBadge: false,
    },
  },
  {
    id: 'whatsapp-international',
    name: 'WhatsApp International',
    tagline: 'End-to-end encrypted international WhatsApp voice call',
    badge: 'WhatsApp',
    caller: {
      name: 'Sofia Alvarez 🇪🇸',
      phone: '+34 612 345 678',
      avatarDataUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    call: {
      direction: 'active',
      callPlatform: 'whatsapp-voice',
      deviceMode: 'ios',
      callTypeLabel: 'WhatsApp audio',
      callStateLabel: 'WhatsApp Voice Call',
      durationSeconds: 760, // 12:40
      backgroundStyle: 'whatsapp-emerald',
      isMuted: false,
      isSpeakerOn: false,
      isCameraOn: false,
      showFictionalBadge: false,
    },
  },
  {
    id: 'missed-landlord',
    name: 'Missed Call Panic',
    tagline: 'Realistic missed call notification mockup',
    badge: 'Missed',
    caller: {
      name: 'Landlord 🔑',
      phone: '+1 (212) 555-0144',
      avatarDataUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    call: {
      direction: 'missed',
      callPlatform: 'ios-phone',
      deviceMode: 'ios',
      callTypeLabel: 'mobile',
      callStateLabel: 'Missed Call',
      durationSeconds: 0,
      backgroundStyle: 'dark-gradient',
      isMuted: false,
      isSpeakerOn: false,
      isCameraOn: false,
      showFictionalBadge: true,
    },
  },
  {
    id: 'android-pixel-call',
    name: 'Google Pixel RCS Call',
    tagline: 'Android Material You incoming call screen',
    badge: 'Android',
    caller: {
      name: 'Detective Vance 🔍',
      phone: '+1 (312) 555-0189',
      avatarDataUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    call: {
      direction: 'incoming',
      callPlatform: 'android-phone',
      deviceMode: 'android',
      callTypeLabel: 'Calling via SIM 1',
      callStateLabel: 'Incoming call...',
      durationSeconds: 0,
      backgroundStyle: 'solid-slate',
      isMuted: false,
      isSpeakerOn: false,
      isCameraOn: false,
      showFictionalBadge: false,
    },
  },
];

export function FakeCallEditor({
  onOpenScriptImport,
  onRequestClearAll,
}: FakeCallEditorProps) {
  void onOpenScriptImport;
  void onRequestClearAll;
  const project = useStudioStore((s) => s.project);
  const conversation = getActiveConversation(project);
  const upsertParticipant = useStudioStore((s) => s.upsertParticipant);
  const updateCallMeta = useStudioStore((s) => s.updateCallMeta);
  const updateTheme = useStudioStore((s) => s.updateTheme);
  const updateStatusBar = useStudioStore((s) => s.updateStatusBar);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const pastCount = useStudioStore((s) => s.past.length);
  const futureCount = useStudioStore((s) => s.future.length);

  const [activeTab, setActiveTab] = useState<'call' | 'caller' | 'device' | 'presets'>('call');

  const call = conversation.callMeta;
  const caller: Participant | undefined =
    project.cast.find((p) => p.id !== conversation.selfParticipantId) || project.cast[0];

  // Duration in mm:ss
  const mins = Math.floor((call?.durationSeconds ?? 74) / 60);
  const secs = (call?.durationSeconds ?? 74) % 60;
  const [durationInput, setDurationInput] = useState(
    `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  );

  const handleDurationChange = (val: string) => {
    setDurationInput(val);
    const parts = val.split(':');
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10);
      const s = parseInt(parts[1], 10);
      if (!isNaN(m) && !isNaN(s)) {
        updateCallMeta({ durationSeconds: Math.max(0, m * 60 + s) });
      }
    } else {
      const totalSecs = parseInt(val, 10);
      if (!isNaN(totalSecs)) {
        updateCallMeta({ durationSeconds: Math.max(0, totalSecs) });
      }
    }
  };

  const handleApplyPreset = (preset: CallPresetDef) => {
    if (caller) {
      upsertParticipant({
        ...caller,
        displayName: preset.caller.name,
        phoneOrEmail: preset.caller.phone,
        avatarDataUrl: preset.caller.avatarDataUrl,
      });
    }

    updateTheme({
      osVariant: preset.call.deviceMode,
    });

    updateCallMeta({
      direction: preset.call.direction,
      callPlatform: preset.call.callPlatform,
      deviceMode: preset.call.deviceMode,
      callTypeLabel: preset.call.callTypeLabel,
      callStateLabel: preset.call.callStateLabel,
      durationSeconds: preset.call.durationSeconds,
      backgroundStyle: preset.call.backgroundStyle,
      isMuted: preset.call.isMuted,
      isSpeakerOn: preset.call.isSpeakerOn,
      isCameraOn: preset.call.isCameraOn,
      showFictionalBadge: preset.call.showFictionalBadge,
    });

    const m = Math.floor(preset.call.durationSeconds / 60);
    const s = preset.call.durationSeconds % 60;
    setDurationInput(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
  };

  return (
    <div
      data-testid="fake-call-dedicated-editor"
      className="flex h-full flex-col bg-white dark:bg-slate-950"
    >
      {/* Top Header & Editor Badge */}
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              data-testid="platform-editor-badge"
              className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 border border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800"
            >
              Voice & Video Call Studio
            </span>
            <span className="text-xs font-medium text-slate-500">
              Mockup Generator
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={pastCount === 0}
              className="h-8 w-8 p-0"
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={futureCount === 0}
              className="h-8 w-8 p-0"
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="border-b border-slate-200 px-4 dark:border-slate-800">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="call" className="text-xs">
              <Phone className="mr-1.5 h-3.5 w-3.5" />
              Call
            </TabsTrigger>
            <TabsTrigger value="caller" className="text-xs">
              <User className="mr-1.5 h-3.5 w-3.5" />
              Caller
            </TabsTrigger>
            <TabsTrigger value="device" className="text-xs">
              <Smartphone className="mr-1.5 h-3.5 w-3.5" />
              Device
            </TabsTrigger>
            <TabsTrigger value="presets" className="text-xs">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
              Presets
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* TAB 1: CALL STATE */}
          <TabsContent value="call" className="mt-0 space-y-5">
            {/* Call State Buttons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Call Screen State
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  {
                    id: 'incoming',
                    label: 'Incoming',
                    icon: Phone,
                    color: 'text-emerald-600',
                  },
                  {
                    id: 'outgoing',
                    label: 'Outgoing',
                    icon: Phone,
                    color: 'text-blue-600',
                  },
                  {
                    id: 'active',
                    label: 'Ongoing',
                    icon: Volume2,
                    color: 'text-violet-600',
                  },
                  {
                    id: 'missed',
                    label: 'Missed',
                    icon: PhoneMissed,
                    color: 'text-rose-600',
                  },
                ].map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    data-testid={`state-btn-${id}`}
                    onClick={() =>
                      updateCallMeta({
                        direction: id as 'incoming' | 'outgoing' | 'active' | 'missed',
                      })
                    }
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all cursor-pointer ${
                      call?.direction === id
                        ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Input & Call Duration */}
            {(call?.direction === 'active' || call?.direction === 'outgoing') && (
              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Call Duration (MM:SS)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {call?.durationSeconds ?? 74} seconds
                  </span>
                </div>
                <Input
                  data-testid="input-call-duration"
                  value={durationInput}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  placeholder="01:14"
                  className="font-mono text-center text-sm"
                />
              </div>
            )}

            {/* Call Type Label */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Call Type / Subtitle Label
              </label>
              <Input
                data-testid="input-call-type-label"
                value={call?.callTypeLabel ?? 'mobile'}
                onChange={(e) => updateCallMeta({ callTypeLabel: e.target.value })}
                placeholder="mobile, iPhone, WhatsApp audio..."
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['mobile', 'iPhone', 'FaceTime Audio', 'WhatsApp audio', 'Work', 'Home'].map(
                  (preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => updateCallMeta({ callTypeLabel: preset })}
                      className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
                    >
                      {preset}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* In-Call Action Toggles */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Active Button States
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={call?.isMuted ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCallMeta({ isMuted: !call?.isMuted })}
                  className="justify-start gap-2"
                >
                  {call?.isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span>Mute: {call?.isMuted ? 'ON' : 'OFF'}</span>
                </Button>

                <Button
                  type="button"
                  variant={call?.isSpeakerOn ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCallMeta({ isSpeakerOn: !call?.isSpeakerOn })}
                  className="justify-start gap-2"
                >
                  {call?.isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span>Speaker: {call?.isSpeakerOn ? 'ON' : 'OFF'}</span>
                </Button>

                <Button
                  type="button"
                  variant={call?.isKeypadOpen ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCallMeta({ isKeypadOpen: !call?.isKeypadOpen })}
                  className="justify-start gap-2"
                >
                  <Grid className="h-4 w-4" />
                  <span>Keypad: {call?.isKeypadOpen ? 'SHOW' : 'HIDE'}</span>
                </Button>

                <Button
                  type="button"
                  variant={call?.isCameraOn ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateCallMeta({ isCameraOn: !call?.isCameraOn })}
                  className="justify-start gap-2"
                >
                  <Video className="h-4 w-4" />
                  <span>FaceTime: {call?.isCameraOn ? 'ON' : 'OFF'}</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: CALLER DETAILS */}
          <TabsContent value="caller" className="mt-0 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Caller Contact Name
              </label>
              <Input
                data-testid="input-caller-name"
                value={caller?.displayName ?? 'Maya Lin'}
                onChange={(e) => {
                  if (caller) upsertParticipant({ ...caller, displayName: e.target.value });
                }}
                placeholder="e.g. Maya Lin, Mom ❤️, Boss"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <Input
                data-testid="input-caller-phone"
                value={call?.phoneNumber || caller?.phoneOrEmail || '+1 (415) 555-0194'}
                onChange={(e) => {
                  updateCallMeta({ phoneNumber: e.target.value });
                  if (caller) upsertParticipant({ ...caller, phoneOrEmail: e.target.value });
                }}
                placeholder="+1 (415) 555-0194 or Unknown"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Profile Avatar URL
              </label>
              <Input
                data-testid="input-caller-avatar"
                value={caller?.avatarDataUrl ?? ''}
                onChange={(e) => {
                  if (caller) upsertParticipant({ ...caller, avatarDataUrl: e.target.value });
                }}
                placeholder="https://... image URL"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  {
                    name: 'Woman',
                    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
                  },
                  {
                    name: 'Man',
                    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                  },
                  {
                    name: 'Abstract',
                    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
                  },
                ].map(({ name, url }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      if (caller) upsertParticipant({ ...caller, avatarDataUrl: url });
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                    <span>{name}</span>
                  </button>
                ))}
                {caller?.avatarDataUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (caller) upsertParticipant({ ...caller, avatarDataUrl: undefined });
                    }}
                    className="text-xs text-rose-500 hover:underline cursor-pointer"
                  >
                    Clear photo
                  </button>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: DEVICE & THEME */}
          <TabsContent value="device" className="mt-0 space-y-5">
            {/* Device Mode (iPhone vs Android) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Device Mockup Skin
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-testid="device-mode-ios"
                  onClick={() => {
                    updateTheme({ osVariant: 'ios' });
                    updateCallMeta({ deviceMode: 'ios', callPlatform: 'ios-phone' });
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all cursor-pointer ${
                    project.theme.osVariant === 'ios'
                      ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>iPhone (iOS)</span>
                </button>

                <button
                  type="button"
                  data-testid="device-mode-android"
                  onClick={() => {
                    updateTheme({ osVariant: 'android' });
                    updateCallMeta({ deviceMode: 'android', callPlatform: 'android-phone' });
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all cursor-pointer ${
                    project.theme.osVariant === 'android'
                      ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Android (Pixel)</span>
                </button>
              </div>
            </div>

            {/* Visual Platform Profiles */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Visual Platform Profile
              </label>
              <select
                data-testid="select-call-platform"
                value={call?.callPlatform ?? 'ios-phone'}
                onChange={(e) => {
                  const val = e.target.value as NonNullable<Conversation['callMeta']>['callPlatform'];
                  updateCallMeta({
                    callPlatform: val,
                    backgroundStyle:
                      val === 'whatsapp-voice' || val === 'whatsapp-video'
                        ? 'whatsapp-emerald'
                        : 'dark-gradient',
                  });
                }}
                className="mt-1 flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="ios-phone">iPhone Call App (iOS 17/18)</option>
                <option value="android-phone">Google Phone App (Material You)</option>
                <option value="whatsapp-voice">WhatsApp Voice Call (Encrypted)</option>
                <option value="facetime">FaceTime Audio Call</option>
              </select>
            </div>

            {/* Background Style */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Screen Background Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'dark-gradient', label: 'Dark Gradient' },
                  { id: 'blur-avatar', label: 'Blurred Poster' },
                  { id: 'whatsapp-emerald', label: 'WhatsApp Emerald' },
                  { id: 'solid-slate', label: 'Solid Slate' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    data-testid={`bg-style-${id}`}
                    onClick={() =>
                      updateCallMeta({
                        backgroundStyle: id as NonNullable<Conversation['callMeta']>['backgroundStyle'],
                      })
                    }
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all cursor-pointer ${
                      call?.backgroundStyle === id
                        ? 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Bar Controls */}
            <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status Bar Settings
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400">Time</label>
                  <Input
                    value={project.theme.statusBar.timeLabel}
                    onChange={(e) => updateStatusBar({ timeLabel: e.target.value })}
                    className="h-8 text-xs font-mono"
                    placeholder="9:41"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400">Battery %</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={project.theme.statusBar.batteryPercent}
                    onChange={(e) => updateStatusBar({ batteryPercent: parseInt(e.target.value, 10) || 100 })}
                    className="h-8 text-xs font-mono"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Fictional Disclaimer Watermark Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Fictional Mockup Badge
                </span>
                <p className="text-[11px] text-slate-500">
                  Adds subtle &ldquo;Fictional Call Mockup&rdquo; watermark
                </p>
              </div>
              <input
                type="checkbox"
                data-testid="toggle-fictional-watermark"
                checked={call?.showFictionalBadge ?? false}
                onChange={(e) => updateCallMeta({ showFictionalBadge: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>
          </TabsContent>

          {/* TAB 4: PRESETS */}
          <TabsContent value="presets" className="mt-0 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose a realistic call scenario to instantly set caller info, state, and styling:
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {CALL_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  data-testid={`preset-card-${preset.id}`}
                  onClick={() => handleApplyPreset(preset)}
                  className="group flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:border-violet-400 hover:shadow-md cursor-pointer dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-violet-600">
                      {preset.name}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {preset.tagline}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span>{preset.caller.name}</span>
                    <span>•</span>
                    <span>{preset.caller.phone}</span>
                    <span>•</span>
                    <span className="capitalize">{preset.call.direction}</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
