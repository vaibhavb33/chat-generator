import React from 'react';
import type { OsPlatformVariant, PlatformTheme } from '@/core/types';
import { cn } from '@/lib/utils';

export function StatusBar({
  statusBar,
  osVariant,
  darkBg,
  className,
  onSelectStatusBar,
}: {
  statusBar: PlatformTheme['statusBar'];
  osVariant: PlatformTheme['osVariant'];
  darkBg?: boolean;
  className?: string;
  onSelectStatusBar?: () => void;
}) {
  if (!statusBar.visible) return null;

  const textColor = darkBg ? 'text-white' : 'text-slate-950';
  const isAndroid = osVariant === 'android';

  if (osVariant === 'generic_filmsafe') {
    return (
      <div
        onClick={onSelectStatusBar}
        data-testid="status-bar-generic"
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

  // Android 16 Material 3 Expressive Status Bar
  if (isAndroid) {
    const pct = Math.max(5, Math.min(100, statusBar.batteryPercent));
    const batteryBg = statusBar.isCharging
      ? 'bg-emerald-500 text-slate-950'
      : pct <= 20
        ? 'bg-red-500 text-white'
        : darkBg
          ? 'bg-white/90 text-slate-950'
          : 'bg-slate-900 text-white';

    return (
      <div
        onClick={onSelectStatusBar}
        data-testid="status-bar-android"
        style={{ fontFamily: '"Roboto", "Google Sans Text", system-ui, sans-serif' }}
        className={cn(
          'relative flex h-9 shrink-0 items-center justify-between px-4 text-[12px] font-medium tracking-normal select-none',
          textColor,
          className
        )}
      >
        {/* Left: Android clock + subtle status dot */}
        <div className="flex items-center gap-1.5">
          <span className="tabular-nums font-medium">{statusBar.timeLabel}</span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-current opacity-50"
          />
        </div>

        {/* Center: Circular Punch-Hole Front Camera */}
        {statusBar.notchStyle !== 'none' && (
          <div
            aria-hidden="true"
            className="h-3.5 w-3.5 rounded-full bg-black/90 ring-1 ring-black/20"
          />
        )}

        {/* Right: 5G + Triangular Cellular + Wi-Fi + M3 Expressive Horizontal Battery Pill */}
        <div className="flex items-center gap-1.5">
          {statusBar.carrierLabel && (
            <span className="text-[10px] font-bold tracking-tight opacity-90">
              {statusBar.carrierLabel}
            </span>
          )}
          {/* Android Wi-Fi */}
          <svg
            width="14"
            height="11"
            viewBox="0 0 16 12"
            fill="none"
            className={cn(statusBar.wifiBars === 0 && 'opacity-25')}
            aria-hidden="true"
          >
            <path
              d="M8 9.8a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"
              fill="currentColor"
            />
            <path
              d="M4.6 7.8a4.9 4.9 0 016.8 0M2 5.2a8.5 8.5 0 0112 0"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {/* Android Cellular Triangle */}
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 11L11 1V11H1Z" fill="currentColor" opacity="0.25" />
            <path
              d={
                statusBar.signalBars >= 4
                  ? 'M1 11L11 1V11H1Z'
                  : statusBar.signalBars === 3
                    ? 'M1 11L9 3V11H1Z'
                    : statusBar.signalBars === 2
                      ? 'M1 11L7 5V11H1Z'
                      : 'M1 11L4.5 7.5V11H1Z'
              }
              fill="currentColor"
            />
          </svg>
          {/* Android 16 Horizontal Rounded Battery Pill with Inline % */}
          <div className="flex items-center gap-0.5">
            <div
              className={cn(
                'relative flex h-[13px] min-w-[24px] items-center justify-center rounded-[4px] px-1 text-[9px] font-extrabold leading-none tabular-nums',
                batteryBg
              )}
            >
              {pct}
            </div>
            <span className="h-[5px] w-[1.5px] rounded-r-xs bg-current opacity-65" />
          </div>
        </div>
      </div>
    );
  }

  // iPhone (iOS 26) Status Bar — Verified directly against IMG_5413 / IMG_5414 / IMG_5415
  const pct = Math.max(5, Math.min(100, statusBar.batteryPercent));
  const iosBatteryFill = statusBar.isCharging
    ? '#34C759'
    : pct <= 20
      ? '#FF3B30'
      : pct <= 60
        ? '#FACC15' // Authentic Low-Power / Gold Pill seen in IMG_5413-5415
        : darkBg
          ? '#FFFFFF'
          : '#0F172A';
  const iosBatteryText =
    iosBatteryFill === '#FFFFFF'
      ? 'text-slate-950'
      : iosBatteryFill === '#0F172A'
        ? 'text-white'
        : 'text-slate-950';

  return (
    <div
      onClick={onSelectStatusBar}
      data-testid="status-bar-iphone"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
      }}
      className={cn(
        'relative flex h-11 shrink-0 items-center justify-between px-5 text-[13px] font-semibold tracking-tight select-none',
        textColor,
        className
      )}
    >
      {/* Left: Time + Focus/Silent glyph */}
      <div className="flex items-center gap-1">
        <span className="tabular-nums font-semibold tracking-[-0.02em]">
          {statusBar.timeLabel}
        </span>
      </div>

      {/* Center: iPhone Dynamic Island Pill */}
      {statusBar.notchStyle !== 'none' && (
        <div
          aria-hidden="true"
          className="h-[22px] w-[86px] rounded-full bg-black shadow-inner ring-1 ring-white/5"
        />
      )}

      {/* Right: Cellular Bars + Wi-Fi + iOS Numeric Battery Pill */}
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

        <svg
          width="14"
          height="11"
          viewBox="0 0 16 12"
          fill="none"
          className={cn(statusBar.wifiBars === 0 && 'opacity-25')}
          aria-hidden="true"
        >
          <path
            d="M8 9.8a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"
            fill="currentColor"
          />
          <path
            d="M4.6 7.8a4.9 4.9 0 016.8 0M2 5.2a8.5 8.5 0 0112 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex items-center gap-[1.5px]">
          <div
            className="relative flex h-[13px] w-[26px] items-center justify-center overflow-hidden rounded-[4px] border border-current/35 bg-current/15"
            title={`Battery ${pct}%`}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-[2.5px]"
              style={{ width: `${pct}%`, backgroundColor: iosBatteryFill }}
            />
            <span
              className={cn(
                'relative z-10 text-[9px] font-bold leading-none tabular-nums',
                pct >= 45 ? iosBatteryText : darkBg ? 'text-white' : 'text-slate-900'
              )}
            >
              {pct}
            </span>
          </div>
          <span className="h-[4.5px] w-[1.5px] rounded-r-xs bg-current opacity-45" />
        </div>
      </div>
    </div>
  );
}

export function SystemBottomIndicator({
  osVariant,
  darkBg,
  className,
}: {
  osVariant: OsPlatformVariant;
  darkBg?: boolean;
  className?: string;
}) {
  if (osVariant === 'desktop' || osVariant === 'generic_filmsafe') return null;
  const isAndroid = osVariant === 'android';

  return (
    <div
      aria-hidden="true"
      data-testid={isAndroid ? 'android-gesture-bar' : 'ios-home-indicator'}
      className={cn(
        'flex shrink-0 items-center justify-center',
        isAndroid ? 'h-4' : 'h-5',
        darkBg ? 'bg-transparent' : 'bg-transparent',
        className
      )}
    >
      <span
        className={cn(
          'rounded-full transition-colors',
          isAndroid ? 'h-[3.5px] w-[108px]' : 'h-[4.5px] w-[134px]',
          darkBg ? 'bg-white/80' : 'bg-slate-900/80'
        )}
      />
    </div>
  );
}
