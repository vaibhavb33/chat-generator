'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Download, RefreshCw, Share, Wifi, WifiOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function subscribeOnlineStatus(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function PwaManager() {
  const isOnline = useSyncExternalStore(
    subscribeOnlineStatus,
    () => navigator.onLine,
    () => true
  );
  const [reconnectedNotice, setReconnectedNotice] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [showIosGuide, setShowIosGuide] = useState(() => {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    return isIos && !isStandalone;
  });
  const [updateWaiting, setUpdateWaiting] = useState<ServiceWorker | null>(null);
  const [manualUpdateBanner, setManualUpdateBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setReconnectedNotice(true);
      setTimeout(() => setReconnectedNotice(false), 3500);
    };
    const handleOffline = () => {
      setReconnectedNotice(false);
    };
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const handleSimulatedUpdate = () => setManualUpdateBanner(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('chatforge-sw-update-available', handleSimulatedUpdate);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          if (reg.waiting) {
            setUpdateWaiting(reg.waiting);
          }
          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.addEventListener('statechange', () => {
              if (
                installing.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setUpdateWaiting(installing);
              }
            });
          });
        })
        .catch(() => undefined);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('chatforge-sw-update-available', handleSimulatedUpdate);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const handleApplyUpdate = () => {
    if (updateWaiting) {
      updateWaiting.postMessage({ type: 'SKIP_WAITING' });
    }
    setManualUpdateBanner(false);
    window.location.reload();
  };

  return (
    <div className="pointer-events-none fixed bottom-16 right-3 z-40 flex flex-col items-end gap-2 sm:bottom-4 sm:right-4">
      {!isOnline && (
        <div
          data-testid="pwa-offline-banner"
          role="status"
          className="pointer-events-auto flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900 shadow-lg dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
        >
          <WifiOff className="h-3.5 w-3.5 shrink-0" />
          <span>Offline mode — edits &amp; PNG exports work locally</span>
        </div>
      )}

      {isOnline && reconnectedNotice && (
        <div
          data-testid="pwa-online-banner"
          role="status"
          className="pointer-events-auto flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800 shadow-lg dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
        >
          <Wifi className="h-3.5 w-3.5 shrink-0" />
          <span>Back online</span>
        </div>
      )}

      {(updateWaiting || manualUpdateBanner) && (
        <div
          data-testid="pwa-update-banner"
          role="status"
          className="pointer-events-auto flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-indigo-800 dark:bg-slate-900"
        >
          <span className="font-medium text-slate-800 dark:text-slate-100">
            Update available
          </span>
          <Button
            type="button"
            size="sm"
            variant="gradient"
            onClick={handleApplyUpdate}
            className="h-7 px-2.5 text-[11px]"
          >
            <RefreshCw className="h-3 w-3" /> Reload
          </Button>
        </div>
      )}

      {installPrompt && (
        <div
          data-testid="pwa-install-banner"
          className="pointer-events-auto flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="font-medium text-slate-800 dark:text-slate-100">
            Install ChatForge App
          </span>
          <Button
            type="button"
            size="sm"
            variant="gradient"
            onClick={() => void handleInstallClick()}
            className="h-7 px-2.5 text-[11px]"
          >
            <Download className="h-3 w-3" /> Install
          </Button>
          <button
            type="button"
            aria-label="Dismiss install prompt"
            onClick={() => setInstallPrompt(null)}
            className="rounded p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {showIosGuide && (
        <div className="pointer-events-auto flex max-w-xs items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <Share className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
          <span>Tap Share &rarr; &ldquo;Add to Home Screen&rdquo; to install</span>
          <button
            type="button"
            aria-label="Dismiss iOS install tip"
            onClick={() => setShowIosGuide(false)}
            className="rounded p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
