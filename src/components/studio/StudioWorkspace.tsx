'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Palette,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { StudioTopBar } from '@/components/studio/StudioTopBar';
import { LeftEditorPanel } from '@/components/studio/LeftEditorPanel';
import { RightAppearancePanel } from '@/components/studio/RightAppearancePanel';
import { StudioFooterBar } from '@/components/studio/StudioFooterBar';
import { VideoTimelineBar } from '@/components/studio/VideoTimelineBar';
import { PlatformRendererHost } from '@/platforms/PlatformRendererHost';

const ExportModal = dynamic(
  () => import('@/components/studio/StudioModals').then((m) => m.ExportModal),
  { ssr: false }
);
const ScriptImportModal = dynamic(
  () => import('@/components/studio/StudioModals').then((m) => m.ScriptImportModal),
  { ssr: false }
);
const TemplatePickerModal = dynamic(
  () => import('@/components/studio/StudioModals').then((m) => m.TemplatePickerModal),
  { ssr: false }
);
const ProjectsModal = dynamic(
  () => import('@/components/studio/StudioModals').then((m) => m.ProjectsModal),
  { ssr: false }
);
const ConfirmClearModal = dynamic(
  () => import('@/components/studio/StudioModals').then((m) => m.ConfirmClearModal),
  { ssr: false }
);
const PremiumUpgradeModal = dynamic(
  () =>
    import('@/components/studio/PremiumUpgradeModal').then(
      (m) => m.PremiumUpgradeModal
    ),
  { ssr: false }
);

import {
  exportProjectJsonBundle,
  parseImportedProjectJson,
} from '@/core/export/exportEngine';
import { BUILTIN_TEMPLATES } from '@/core/engine/templateLibrary';
import { MAX_JSON_IMPORT_BYTES } from '@/core/security/validation';
import { useStudioStore } from '@/core/store/useStudioStore';
import { cn } from '@/lib/utils';

export function StudioWorkspace({ platformId }: { platformId: string }) {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template');
  const applyTemplate = useStudioStore((s) => s.applyTemplate);
  const initPlatform = useStudioStore((s) => s.initPlatform);
  const project = useStudioStore((s) => s.project);
  const isHydrating = useStudioStore((s) => s.isHydrating);
  const errorMessage = useStudioStore((s) => s.errorMessage);
  const clearError = useStudioStore((s) => s.clearError);
  const clearAllMessages = useStudioStore((s) => s.clearAllMessages);
  const loadProject = useStudioStore((s) => s.loadProject);
  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const setEditorOpen = useStudioStore((s) => s.setEditorOpen);
  const ui = useStudioStore((s) => s.ui);

  const exportRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelsRef = useRef<HTMLElement | null>(null);
  const desktopPanelsRef = useRef<HTMLElement | null>(null);

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [scriptModalOpen, setScriptModalOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [mobilePanelMode, setMobilePanelMode] = useState<'content' | 'style' | 'closed'>('content');

  useEffect(() => {
    let active = true;
    void initPlatform(platformId).then(() => {
      if (!active || !templateParam) return;
      const tpl = BUILTIN_TEMPLATES.find((t) => t.id === templateParam);
      if (tpl) {
        applyTemplate(tpl);
      }
    });
    return () => {
      active = false;
    };
  }, [platformId, templateParam, initPlatform, applyTemplate]);

  // Global keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (isInput) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  // Focus appropriate panel when user clicks elements in preview or clicks Edit
  const focusEditor = () => {
    setEditorOpen(true);
    const kind = useStudioStore.getState().ui.selectedElement?.kind;
    if (kind === 'wallpaper' || kind === 'status_bar') {
      setMobilePanelMode('style');
    } else if (mobilePanelMode === 'closed') {
      setMobilePanelMode('content');
    }
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      mobilePanelsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleToggleEdit = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (mobilePanelMode === 'closed') {
        setEditorOpen(true);
        setMobilePanelMode('content');
        mobilePanelsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        setMobilePanelMode('closed');
        setEditorOpen(false);
      }
      return;
    }
    setEditorOpen(!ui.editorOpen || ui.previewMode);
  };

  const handleImportJsonFile = async (file: File) => {
    setImportError(null);
    try {
      if (file.size > MAX_JSON_IMPORT_BYTES) {
        throw new Error('Project file exceeds 2 MB limit.');
      }
      const raw = await file.text();
      const parsed = parseImportedProjectJson(raw);
      loadProject(parsed);
    } catch (err) {
      setImportError(
        err instanceof Error ? err.message : 'Unable to parse project file.'
      );
    }
  };

  const activeError = errorMessage || importError;
  const showDesktopSidebars = ui.editorOpen && !ui.previewMode;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <StudioTopBar
        onOpenExport={() => setExportModalOpen(true)}
        onOpenTemplates={() => setTemplatesModalOpen(true)}
        onOpenProjects={() => setProjectsModalOpen(true)}
      />

      {activeError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-2 border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-800 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{activeError}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearError();
              setImportError(null);
            }}
            aria-label="Dismiss error"
            className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/50 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Responsive Workspace (Preview always stays visible & interactive) */}
      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[330px_1fr_300px] xl:grid-cols-[350px_1fr_320px]">
        {/* DESKTOP LEFT PANEL */}
        {showDesktopSidebars && (
          <aside
            ref={desktopPanelsRef}
            className="hidden border-r border-slate-200 bg-white lg:block lg:h-[calc(100vh-8rem)] lg:overflow-hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <LeftEditorPanel
              onOpenScriptImport={() => setScriptModalOpen(true)}
              onRequestClearAll={() => setConfirmClearOpen(true)}
            />
          </aside>
        )}

        {/* CENTER LIVE FULL-SCREEN DEVICE PREVIEW STAGE */}
        <main
          className={cn(
            'studio-dot-grid flex flex-col items-center justify-start overflow-y-auto px-2 py-4 sm:px-6 lg:py-6',
            !showDesktopSidebars && 'lg:col-span-3'
          )}
        >
          {isHydrating ? (
            <div
              data-testid="studio-loading-skeleton"
              className="h-[640px] w-full max-w-[393px] animate-pulse rounded-[38px] border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/60"
            />
          ) : (
            <PlatformRendererHost
              exportRef={exportRef}
              onRequestOpenEdit={focusEditor}
            />
          )}
        </main>

        {/* DESKTOP RIGHT PANEL */}
        {showDesktopSidebars && (
          <aside className="hidden border-l border-slate-200 bg-white lg:block lg:h-[calc(100vh-8rem)] lg:overflow-y-auto dark:border-slate-800 dark:bg-slate-950">
            <RightAppearancePanel
              onExportJson={() => exportProjectJsonBundle(project)}
              onImportJsonFile={(f) => void handleImportJsonFile(f)}
            />
          </aside>
        )}

        {/* MOBILE EXPANDABLE EDITING PANEL (Below Preview, above sticky 3-action footer) */}
        <section
          ref={mobilePanelsRef}
          aria-label="Mobile editing panels"
          className="border-t border-slate-200 bg-white pb-[calc(1rem+env(safe-area-inset-bottom))] lg:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={mobilePanelMode === 'content' ? 'default' : 'ghost'}
                onClick={() => setMobilePanelMode('content')}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Edit Content
              </Button>
              <Button
                type="button"
                size="sm"
                variant={mobilePanelMode === 'style' ? 'default' : 'ghost'}
                onClick={() => setMobilePanelMode('style')}
              >
                <Palette className="h-3.5 w-3.5" />
                Style &amp; Frame
              </Button>
            </div>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() =>
                setMobilePanelMode((m) => (m === 'closed' ? 'content' : 'closed'))
              }
              aria-label="Toggle mobile editor drawer"
            >
              {mobilePanelMode === 'closed' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {mobilePanelMode === 'content' && (
            <LeftEditorPanel
              onOpenScriptImport={() => setScriptModalOpen(true)}
              onRequestClearAll={() => setConfirmClearOpen(true)}
            />
          )}
          {mobilePanelMode === 'style' && (
            <RightAppearancePanel
              onExportJson={() => exportProjectJsonBundle(project)}
              onImportJsonFile={(f) => void handleImportJsonFile(f)}
            />
          )}
        </section>
      </div>

      {/* Bottom Video Mode Timeline */}
      <VideoTimelineBar />

      {/* Phase 5: Sticky Responsive Footer with EXACTLY THREE PRIMARY ACTIONS (Edit, Download, Save Chat) */}
      <StudioFooterBar
        onToggleEdit={handleToggleEdit}
        onOpenDownload={() => setExportModalOpen(true)}
        onOpenSavedProjects={() => setProjectsModalOpen(true)}
      />

      {/* Modals */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        exportRef={exportRef}
      />
      <ScriptImportModal
        open={scriptModalOpen}
        onOpenChange={setScriptModalOpen}
      />
      <TemplatePickerModal
        open={templatesModalOpen}
        onOpenChange={setTemplatesModalOpen}
      />
      <ProjectsModal
        open={projectsModalOpen}
        onOpenChange={setProjectsModalOpen}
      />
      <ConfirmClearModal
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        onConfirm={clearAllMessages}
      />
      <PremiumUpgradeModal />
    </div>
  );
}
