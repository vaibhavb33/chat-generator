import React from 'react';
import type { DeviceFramePreset, DeviceType, OsPlatformVariant } from '@/core/types';
import { SystemBottomIndicator } from '@/components/shared-renderers/StatusBar';
import { cn } from '@/lib/utils';

export function DeviceFrameWrapper({
  frame,
  deviceType,
  osVariant,
  darkBg,
  hideBottomIndicator = false,
  safetyBadge,
  children,
}: {
  frame: DeviceFramePreset;
  deviceType?: DeviceType;
  osVariant?: OsPlatformVariant;
  darkBg?: boolean;
  hideBottomIndicator?: boolean;
  safetyBadge?: { enabled: boolean; labelText: string };
  children: React.ReactNode;
}) {
  const effectiveDevice: DeviceType =
    deviceType ?? (osVariant === 'android' || frame === 'pixel_9' ? 'android' : 'iphone');
  const effectiveOs: OsPlatformVariant =
    osVariant ?? (effectiveDevice === 'android' ? 'android' : 'ios');
  const isAndroid = effectiveDevice === 'android';

  const badgeNode = safetyBadge?.enabled ? (
    <div className="border-t border-slate-200/70 bg-slate-900/90 px-3 py-1 text-center text-[10px] font-medium tracking-wide text-slate-200">
      {safetyBadge.labelText}
    </div>
  ) : null;

  // Desktop Browser Window mode (used only when explicitly selected in Discord desktop mode)
  if (frame === 'browser_window') {
    return (
      <div className="w-full max-w-[780px] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.22)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex h-8 items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 dark:border-slate-800 dark:bg-slate-800">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 flex-1 rounded bg-white/80 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
            discord.com/channels
          </span>
        </div>
        {children}
        {badgeNode}
      </div>
    );
  }

  // Screen-only / edge-to-edge capture container (clean proportions: 393x852 iPhone vs 412x915 Android)
  if (frame === 'none' || frame === 'transparent_card') {
    return (
      <div
        data-device-viewport={effectiveDevice}
        style={{
          fontFamily: isAndroid
            ? '"Roboto", "Google Sans Text", system-ui, sans-serif'
            : '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
        }}
        className={cn(
          'relative flex w-full flex-col overflow-hidden border border-slate-200/80 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.18)] dark:border-slate-800',
          isAndroid
            ? 'max-w-[404px] rounded-[24px]'
            : 'max-w-[393px] rounded-[34px]',
          frame === 'transparent_card' && 'bg-transparent'
        )}
      >
        <div className="flex flex-1 flex-col">{children}</div>
        {!hideBottomIndicator && (
          <div className={cn(darkBg ? 'bg-black' : 'bg-white')}>
            <SystemBottomIndicator osVariant={effectiveOs} darkBg={darkBg} />
          </div>
        )}
        {badgeNode}
      </div>
    );
  }

  // Authentic Mobile Screen Frame:
  // - On mobile (<640px), avoids unnecessary thick phone bezels so screen uses width cleanly
  // - On desktop (>=640px), shows precision iPhone (393px, 44px radius) vs Android (404px, 32px radius) proportions
  return (
    <div
      data-device-viewport={effectiveDevice}
      style={{
        fontFamily: isAndroid
          ? '"Roboto", "Google Sans Text", system-ui, sans-serif'
          : '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
      }}
      className={cn(
        'w-full transition-all duration-200 sm:bg-slate-950 sm:p-[9px] sm:shadow-[0_25px_55px_-12px_rgba(15,23,42,0.34)] sm:ring-1 sm:ring-slate-800',
        isAndroid
          ? 'max-w-[404px] rounded-[24px] sm:rounded-[34px]'
          : 'max-w-[393px] rounded-[30px] sm:rounded-[46px]'
      )}
    >
      <div
        className={cn(
          'relative flex flex-col overflow-hidden',
          darkBg ? 'bg-black' : 'bg-white',
          isAndroid
            ? 'min-h-[700px] rounded-[24px] sm:rounded-[26px]'
            : 'min-h-[680px] rounded-[30px] sm:rounded-[38px]'
        )}
      >
        <div className="flex flex-1 flex-col">{children}</div>
        {!hideBottomIndicator && (
          <div className={cn('shrink-0', darkBg ? 'bg-black' : 'bg-white')}>
            <SystemBottomIndicator osVariant={effectiveOs} darkBg={darkBg} />
          </div>
        )}
        {badgeNode}
      </div>
    </div>
  );
}
