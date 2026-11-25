'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  Palette,
  SlidersHorizontal,
  Undo2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { StudioTopBar } from '@/components/studio/StudioTopBar';
import { LeftEditorPanel } from '@/components/studio/LeftEditorPanel';
import { RightAppearancePanel } from '@/components/studio/RightAppearancePanel';
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
  const pastCount = useStudioStore((s) => s.past.length);
  const ui = useStudioStore((s) => s.ui);

  const exportRef = useRef<HTMLDivElement | null>(null);

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

      {/* Main Responsive Workspace */}
      <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[330px_1fr_300px] xl:grid-cols-[350px_1fr_320px] lg:overflow-hidden">
        {/* DESKTOP LEFT PANEL */}
        {!ui.previewMode && (
          <aside className="hidden border-r border-slate-200 bg-white lg:block lg:h-[calc(100vh-3.5rem)] lg:overflow-hidden dark:border-slate-800 dark:bg-slate-950">
            <LeftEditorPanel
              onOpenScriptImport={() => setScriptModalOpen(true)}
              onRequestClearAll={() => setConfirmClearOpen(true)}
            />
          </aside>
        )}

        {/* CENTER LIVE PREVIEW STAGE (Preview-First on Mobile) */}
        <main
          className={cn(
            'studio-dot-grid flex flex-col items-center justify-start overflow-y-auto px-3 py-6 sm:px-6 lg:py-8',
            ui.previewMode && 'lg:col-span-3'
          )}
        >
          {isHydrating ? (
            <div
              data-testid="studio-loading-skeleton"
              className="h-[580px] w-full max-w-[390px] animate-pulse rounded-[38px] border border-slate-200 bg-white/80 p-6 dark:border-slate-800 dark:bg-slate-900/60"
            />
          ) : (
            <PlatformRendererHost exportRef={exportRef} />
          )}
        </main>

        {/* DESKTOP RIGHT PANEL */}
        {!ui.previewMode && (
          <aside className="hidden border-l border-slate-200 bg-white lg:block lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto dark:border-slate-800 dark:bg-slate-950">
            <RightAppearancePanel
              onExportJson={() => exportProjectJsonBundle(project)}
              onImportJsonFile={(f) => void handleImportJsonFile(f)}
            />
          </aside>
        )}

        {/* MOBILE EXPANDABLE EDITING DRAWER (Below Preview, above fixed export bar) */}
        <section
          aria-label="Mobile editing panels"
          className="border-t border-slate-200 bg-white pb-20 lg:hidden dark:border-slate-800 dark:bg-slate-950"
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
                Style & Frame
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

      {/* Mobile Fixed Export Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2 border-t border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={undo}
          disabled={pastCount === 0}
        >
          <Undo2 className="h-3.5 w-3.5" />
          Undo
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setTemplatesModalOpen(true)}
        >
          Templates
        </Button>
        <Button
          type="button"
          variant="gradient"
          size="sm"
          className="flex-1"
          onClick={() => setExportModalOpen(true)}
        >
          <Download className="h-3.5 w-3.5" />
          Export PNG
        </Button>
      </div>

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
    </div>
  );
}
