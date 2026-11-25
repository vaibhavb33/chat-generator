'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <WifiOff className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
          You&apos;re offline
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          This route hasn&apos;t been cached yet, but your drafts are safely stored in local
          IndexedDB and the core WhatsApp editor remains available offline.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="gradient" size="sm">
            <Link href="/generators/whatsapp-chat">Open Offline Editor</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
          </Button>
        </div>
      </div>
    </div>
  );
}
