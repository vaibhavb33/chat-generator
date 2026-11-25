'use client';

import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import type { ReadReceiptStatus } from '@/core/types';
import { cn } from '@/lib/utils';

export function ReadReceipt({
  status,
  variant = 'whatsapp',
  readAtLabel,
  className,
}: {
  status: ReadReceiptStatus;
  variant?: 'whatsapp' | 'telegram' | 'imessage' | 'instagram' | 'android';
  readAtLabel?: string;
  className?: string;
}) {
  if (status === 'none') return null;

  if (variant === 'imessage') {
    if (status === 'read') {
      return (
        <span className={cn('text-[10px] font-medium text-slate-500 dark:text-slate-400', className)}>
          Read{readAtLabel ? ` ${readAtLabel}` : ''}
        </span>
      );
    }
    if (status === 'delivered') {
      return (
        <span className={cn('text-[10px] font-medium text-slate-500 dark:text-slate-400', className)}>
          Delivered
        </span>
      );
    }
    return null;
  }

  if (variant === 'instagram') {
    if (status === 'read') {
      return (
        <span className={cn('text-[10px] font-medium text-slate-500 dark:text-slate-400', className)}>
          Seen
        </span>
      );
    }
    return null;
  }

  if (status === 'sent') {
    return <Check className={cn('h-3.5 w-3.5 opacity-60', className)} aria-label="Sent" />;
  }
  if (status === 'delivered') {
    return (
      <CheckCheck
        className={cn('h-3.5 w-3.5 opacity-60', className)}
        aria-label="Delivered"
      />
    );
  }
  if (status === 'read') {
    const color =
      variant === 'telegram'
        ? 'text-emerald-500'
        : variant === 'android'
          ? 'text-blue-200'
          : 'text-sky-500';
    return (
      <CheckCheck
        className={cn('h-3.5 w-3.5', color, className)}
        aria-label="Read"
      />
    );
  }
  return null;
}
