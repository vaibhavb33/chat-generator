'use client';

import React, { useState } from 'react';
import { BookmarkCheck, Check, Download, FolderOpen, Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudioStore } from '@/core/store/useStudioStore';
import { cn } from '@/lib/utils';

export function StudioFooterBar({
  onToggleEdit,
  onOpenDownload,
  onOpenSavedProjects,
}: {
  onToggleEdit: () => void;
  onOpenDownload: () => void;
  onOpenSavedProjects: () => void;
}) {
  const ui = useStudioStore((s) => s.ui);
  const saveStatus = useStudioStore((s) => s.saveStatus);
  const saveNow = useStudioStore((s) => s.saveNow);
  const [justSavedToast, setJustSavedToast] = useState(false);

  const handleSaveChat = async () => {
    setJustSavedToast(false);
    await saveNow();
    if (useStudioStore.getState().saveStatus === 'saved') {
      setJustSavedToast(true);
      setTimeout(() => setJustSavedToast(false), 3000);
    }
  };

  return (
    <footer
      data-testid="studio-sticky-footer"
      aria-label="Primary studio actions"
      className="sticky bottom-0 z-30 mt-auto shrink-0 border-t border-slate-200/90 bg-white/95 px-3 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95"
    >
      {/* Post-save status confirmation banner (only shown AFTER IndexedDB persistence succeeds) */}
      {justSavedToast && (
        <div
          data-testid="save-chat-toast"
          role="status"
          className="mx-auto mb-2 flex max-w-xl items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/70 dark:text-emerald-200"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Chat saved locally in your browser
          </span>
          <button
            type="button"
            onClick={onOpenSavedProjects}
            className="inline-flex items-center gap-1 font-semibold underline hover:opacity-80 cursor-pointer"
          >
            <FolderOpen className="h-3 w-3" />
            Saved Library
          </button>
        </div>
      )}

      {/* EXACTLY THREE PRIMARY ACTIONS: EDIT, DOWNLOAD, SAVE CHAT */}
      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-2 sm:gap-3">
        {/* 1. EDIT */}
        <Button
          type="button"
          size="sm"
          variant={ui.editorOpen && !ui.previewMode ? 'default' : 'outline'}
          data-testid="footer-edit-button"
          onClick={onToggleEdit}
          className={cn(
            'h-10 w-full rounded-xl font-semibold',
            ui.editorOpen &&
              !ui.previewMode &&
              'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950'
          )}
        >
          <Pencil className="h-4 w-4" />
          <span>Edit</span>
        </Button>

        {/* 2. DOWNLOAD */}
        <Button
          type="button"
          size="sm"
          variant="gradient"
          data-testid="footer-download-button"
          onClick={onOpenDownload}
          className="h-10 w-full rounded-xl font-semibold shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </Button>

        {/* 3. SAVE CHAT */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-testid="footer-save-button"
          disabled={saveStatus === 'saving'}
          onClick={() => void handleSaveChat()}
          className="h-10 w-full rounded-xl font-semibold"
        >
          {saveStatus === 'saving' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookmarkCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          )}
          <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Chat'}</span>
        </Button>
      </div>
    </footer>
  );
}
