'use client';

import React from 'react';
import { PhoneStatusBar } from '@/components/engine/PhoneStatusBar';
import { ParticipantAvatar, VerifiedIcon } from '@/components/engine/ParticipantAvatar';
import type { Participant, PlatformTheme } from '@/core/types';
import { cn } from '@/lib/utils';

export interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  participant?: Participant;
  theme: PlatformTheme;
  darkBg?: boolean;
  showOnlineDot?: boolean;
  showVerified?: boolean;
  centered?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ChatHeader({
  title,
  subtitle,
  participant,
  theme,
  darkBg,
  showOnlineDot = false,
  showVerified = true,
  centered = false,
  leftSlot,
  rightSlot,
  className,
  style,
}: ChatHeaderProps) {
  return (
    <div className={cn('select-none', className)} style={style}>
      <PhoneStatusBar
        statusBar={theme.statusBar}
        osVariant={theme.osVariant}
        darkBg={darkBg}
      />

      {centered ? (
        <div className="relative flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-1">{leftSlot}</div>
          <div className="flex flex-col items-center">
            <ParticipantAvatar participant={participant} size="sm" />
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[12px] font-semibold leading-none">{title}</span>
              {showVerified && <VerifiedIcon type={participant?.verifiedBadge} />}
            </div>
            {subtitle && (
              <span className="mt-0.5 text-[10px] opacity-60">{subtitle}</span>
            )}
          </div>
          <div className="flex items-center gap-2">{rightSlot}</div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            {leftSlot}
            <ParticipantAvatar
              participant={participant}
              size="sm"
              onlineDot={showOnlineDot}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate text-[14px] font-semibold leading-tight">
                  {title}
                </p>
                {showVerified && <VerifiedIcon type={participant?.verifiedBadge} />}
              </div>
              {subtitle && (
                <p className="truncate text-[11px] opacity-75">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 opacity-90">{rightSlot}</div>
        </div>
      )}
    </div>
  );
}
