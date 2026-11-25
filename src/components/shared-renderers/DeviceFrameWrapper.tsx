import React from 'react';
import type { DeviceFramePreset } from '@/core/types';
import { cn } from '@/lib/utils';

export function DeviceFrameWrapper({
  frame,
  safetyBadge,
  children,
}: {
  frame: DeviceFramePreset;
  safetyBadge?: { enabled: boolean; labelText: string };
  children: React.ReactNode;
}) {
  const badgeNode = safetyBadge?.enabled ? (
    <div className="border-t border-slate-200/70 bg-slate-900/90 px-3 py-1 text-center text-[10px] font-medium tracking-wide text-slate-200">
      {safetyBadge.labelText}
    </div>
  ) : null;

  if (frame === 'none' || frame === 'transparent_card') {
    return (
      <div
        className={cn(
          'w-full max-w-[390px] overflow-hidden rounded-2xl border border-slate-200/80 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.18)] dark:border-slate-800',
          frame === 'transparent_card' && 'bg-transparent'
        )}
      >
        {children}
        {badgeNode}
      </div>
    );
  }

  if (frame === 'browser_window') {
    return (
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-[0_20px_50px_-15px_rgba(15,23,42,0.22)] dark:border-slate-700 dark:bg-slate-900">
        <div className="flex h-8 items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 dark:border-slate-800 dark:bg-slate-800">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 flex-1 rounded bg-white/80 px-2 py-0.5 text-[10px] text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
            web.chatforge.studio
          </span>
        </div>
        {children}
        {badgeNode}
      </div>
    );
  }

  const isPixel = frame === 'pixel_9';

  return (
    <div
      className={cn(
        'w-full max-w-[392px] bg-slate-950 p-[10px] shadow-[0_25px_55px_-12px_rgba(15,23,42,0.34)] ring-1 ring-slate-800',
        isPixel ? 'rounded-[36px]' : 'rounded-[46px]'
      )}
    >
      <div
        className={cn(
          'overflow-hidden bg-white dark:bg-slate-950',
          isPixel ? 'rounded-[28px]' : 'rounded-[38px]'
        )}
      >
        {children}
        {badgeNode}
      </div>
    </div>
  );
}
