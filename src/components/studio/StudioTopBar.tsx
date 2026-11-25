'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  Film,
  FolderOpen,
  Layers,
  Loader2,
  Monitor,
  Redo2,
  Save,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/primitives';
import { GENERATOR_MANIFESTS } from '@/core/registry/generators';
import { useStudioStore } from '@/core/store/useStudioStore';
import type { DeviceFramePreset } from '@/core/types';
import { cn } from '@/lib/utils';

export function StudioTopBar({
  onOpenExport,
  onOpenTemplates,
  onOpenProjects,
}: {
  onOpenExport: () => void;
  onOpenTemplates: () => void;
  onOpenProjects: () => void;
}) {
  const project = useStudioStore((s) => s.project);
  const pastCount = useStudioStore((s) => s.past.length);
  const futureCount = useStudioStore((s) => s.future.length);
  const saveStatus = useStudioStore((s) => s.saveStatus);
  const ui = useStudioStore((s) => s.ui);

  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const saveNow = useStudioStore((s) => s.saveNow);
  const switchPlatformInPlace = useStudioStore((s) => s.switchPlatformInPlace);
  const setDeviceFrame = useStudioStore((s) => s.setDeviceFrame);
  const setPreviewMode = useStudioStore((s) => s.setPreviewMode);
  const setTimelineOpen = useStudioStore((s) => s.setTimelineOpen);
  const setProjectTitle = useStudioStore((s) => s.setProjectTitle);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex h-14 items-center justify-between gap-2 px-3 sm:px-4">
        {/* Left: Brand + Platform Selector + Title */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-2xs"
            title="Back to ChatForge Home"
            aria-label="Back to ChatForge Home"
          >
            <Layers className="h-4 w-4" />
          </Link>

          <select
            aria-label="Select generator platform"
            value={project.platformId}
            onChange={(e) => switchPlatformInPlace(e.target.value)}
            className="h-8 max-w-[140px] truncate rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:max-w-[190px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {GENERATOR_MANIFESTS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.shortName}
              </option>
            ))}
          </select>

          <input
            type="text"
            aria-label="Project title"
            value={project.title}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="hidden h-8 w-36 rounded-lg border border-transparent bg-transparent px-2 text-xs font-medium text-slate-700 hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none md:block lg:w-44 dark:text-slate-200 dark:hover:border-slate-700 dark:focus:bg-slate-900"
          />

          {/* Live Save Status Pill */}
          <div
            data-testid="save-status-pill"
            role="status"
            aria-live="polite"
            className={cn(
              'hidden items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium xl:inline-flex',
              saveStatus === 'saved' &&
                'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300',
              saveStatus === 'unsaved' &&
                'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300',
              saveStatus === 'saving' &&
                'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300',
              saveStatus === 'error' &&
                'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300'
            )}
          >
            {saveStatus === 'saved' && <CheckCircle2 className="h-3 w-3" />}
            {saveStatus === 'saving' && <Loader2 className="h-3 w-3 animate-spin" />}
            {(saveStatus === 'unsaved' || saveStatus === 'error') && (
              <AlertCircle className="h-3 w-3" />
            )}
            <span>
              {saveStatus === 'saved'
                ? 'Saved locally'
                : saveStatus === 'saving'
                  ? 'Saving...'
                  : saveStatus === 'error'
                    ? 'Save error'
                    : 'Unsaved changes'}
            </span>
          </div>
        </div>

        {/* Right: Undo/Redo, Save, Device, Preview, Timeline, Export */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={undo}
                disabled={pastCount === 0}
                aria-label="Undo"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (Cmd+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={redo}
                disabled={futureCount === 0}
                aria-label="Redo"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (Cmd+Shift+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => void saveNow()}
                aria-label="Save project locally"
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save Draft to Browser</TooltipContent>
          </Tooltip>

          <div className="hidden items-center gap-1 md:flex">
            <select
              aria-label="Device frame preset"
              value={project.exportSettings.deviceFrame}
              onChange={(e) => setDeviceFrame(e.target.value as DeviceFramePreset)}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="iphone_16_pro">iPhone Frame</option>
              <option value="pixel_9">Android Frame</option>
              <option value="browser_window">Browser Frame</option>
              <option value="none">No Frame</option>
            </select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenProjects}
              className="hidden lg:inline-flex"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Projects
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenTemplates}
              className="hidden lg:inline-flex"
            >
              Templates
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={ui.isTimelineOpen ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setTimelineOpen(!ui.isTimelineOpen)}
                  aria-pressed={ui.isTimelineOpen}
                >
                  <Film className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">Video</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Animated Video Timeline</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={ui.previewMode ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewMode(!ui.previewMode)}
                  aria-pressed={ui.previewMode}
                >
                  {ui.previewMode ? (
                    <Monitor className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  <span className="hidden xl:inline">
                    {ui.previewMode ? 'Edit' : 'Preview'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Clean Preview Mode</TooltipContent>
            </Tooltip>
          </div>

          <Button
            type="button"
            variant="gradient"
            size="sm"
            onClick={onOpenExport}
            data-testid="top-export-button"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
