import React from 'react';
import { BadgeCheck, Bot } from 'lucide-react';
import type { Participant } from '@/core/types';
import { cn } from '@/lib/utils';

export function AvatarBadge({
  participant,
  size = 'md',
  storyRing = false,
  onlineDot = false,
}: {
  participant?: Participant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  storyRing?: boolean;
  onlineDot?: boolean;
}) {
  const sizeMap = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-24 w-24 text-2xl',
  };

  const initials = (participant?.displayName ?? 'U')
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const inner = (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white select-none',
        sizeMap[size]
      )}
      style={{ backgroundColor: participant?.avatarFallbackColor ?? '#4F46E5' }}
    >
      {participant?.avatarDataUrl ? (
        <img
          src={participant.avatarDataUrl}
          alt={participant.displayName}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
      {onlineDot && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
      )}
    </div>
  );

  if (!storyRing) return inner;

  return (
    <div className="rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[2px]">
      <div className="rounded-full bg-white p-[1.5px] dark:bg-slate-950">{inner}</div>
    </div>
  );
}

export function VerifiedIcon({ type }: { type?: Participant['verifiedBadge'] }) {
  if (!type || type === 'none') return null;
  if (type === 'bot') {
    return (
      <span className="inline-flex items-center gap-0.5 rounded bg-indigo-500 px-1 py-0.2 text-[9px] font-bold uppercase tracking-wide text-white">
        <Bot className="h-2.5 w-2.5" /> APP
      </span>
    );
  }
  const color =
    type === 'business_green'
      ? 'text-emerald-500'
      : type === 'gold'
        ? 'text-amber-500'
        : 'text-sky-500';
  return <BadgeCheck className={cn('inline h-3.5 w-3.5 shrink-0', color)} />;
}
