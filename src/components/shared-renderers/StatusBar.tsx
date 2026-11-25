import React from 'react';
import { Wifi } from 'lucide-react';
import type { PlatformTheme } from '@/core/types';
import { cn } from '@/lib/utils';

export function StatusBar({
  statusBar,
  osVariant,
  darkBg,
  className,
}: {
  statusBar: PlatformTheme['statusBar'];
  osVariant: PlatformTheme['osVariant'];
  darkBg?: boolean;
  className?: string;
}) {
  if (!statusBar.visible) return null;

  const textColor = darkBg ? 'text-white' : 'text-slate-900';

  if (osVariant === 'generic_filmsafe') {
    return (
      <div
        className={cn(
          'flex h-7 items-center justify-between px-4 text-[11px] font-medium opacity-75',
          textColor,
          className
        )}
      >
        <span>{statusBar.timeLabel}</span>
        <span>{statusBar.batteryPercent}%</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex h-10 items-center justify-between px-5 text-[12px] font-semibold tracking-tight select-none',
        textColor,
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <span>{statusBar.timeLabel}</span>
      </div>

      {osVariant === 'ios' && statusBar.notchStyle === 'dynamic_island' && (
        <div
          aria-hidden="true"
          className="h-[20px] w-[78px] rounded-full bg-black shadow-inner"
        />
      )}

      {osVariant === 'android' && statusBar.notchStyle === 'punch_hole' && (
        <div
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full bg-black/90"
        />
      )}

      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[1.5px]" aria-hidden="true">
          {[1, 2, 3, 4].map((bar) => (
            <span
              key={bar}
              className={cn(
                'w-[2.5px] rounded-xs',
                bar <= statusBar.signalBars ? 'bg-current' : 'bg-current opacity-25'
              )}
              style={{ height: `${4 + bar * 2}px` }}
            />
          ))}
        </div>
        {statusBar.carrierLabel && (
          <span className="text-[10px] font-bold">{statusBar.carrierLabel}</span>
        )}
        <Wifi className={cn('h-3.5 w-3.5', statusBar.wifiBars === 0 && 'opacity-30')} />
        <div className="flex items-center gap-1">
          <div className="relative flex h-3 w-5 items-center rounded-[3px] border border-current p-[1.5px]">
            <div
              className={cn(
                'h-full rounded-[1px]',
                statusBar.batteryPercent <= 20 ? 'bg-red-500' : 'bg-current'
              )}
              style={{ width: `${Math.max(8, Math.min(100, statusBar.batteryPercent))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
