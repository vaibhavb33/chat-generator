'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  Film,
  FolderOpen,
  Layers,
  Loader2,
  Moon,
  Redo2,
  Smartphone,
  Sun,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/primitives';
import { useBillingStore } from '@/core/billing/entitlements';
import { GENERATOR_MANIFESTS, GENERATOR_MAP } from '@/core/registry/generators';
import { useStudioStore } from '@/core/store/useStudioStore';
import type { DeviceType } from '@/core/types';
import { cn } from '@/lib/utils';

export function StudioTopBar({
  onOpenTemplates,
  onOpenProjects,
}: {
  onOpenExport?: () => void;
  onOpenTemplates: () => void;
  onOpenProjects: () => void;
}) {
  const router = useRouter();
  const project = useStudioStore((s) => s.project);
  const pastCount = useStudioStore((s) => s.past.length);
  const futureCount = useStudioStore((s) => s.future.length);
  const saveStatus = useStudioStore((s) => s.saveStatus);
  const ui = useStudioStore((s) => s.ui);

  const undo = useStudioStore((s) => s.undo);
  const redo = useStudioStore((s) => s.redo);
  const setDeviceType = useStudioStore((s) => s.setDeviceType);
  const setAppearance = useStudioStore((s) => s.setAppearance);
  const setTimelineOpen = useStudioStore((s) => s.setTimelineOpen);
  const setProjectTitle = useStudioStore((s) => s.setProjectTitle);

  const activePlan = useBillingStore((s) => s.activePlan);
  const openUpgradeModal = useBillingStore((s) => s.openUpgradeModal);

  const activeDevice: DeviceType =
    project.theme.deviceType ??
    (project.theme.osVariant === 'android' ? 'android' : 'iphone');
  const activeAppearance: 'dark' | 'light' =
    project.theme.colorScheme === 'dark' || project.theme.colorScheme === 'dim'
      ? 'dark'
      : 'light';

  return (
    <header
      data-testid="studio-editor-header"
      className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95"
    >
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 px-3 py-1.5 sm:px-4">
        {/* Left: Brand + App Switcher + Title + Save Pill */}
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-2xs"
            title="Back to ChatForge Home"
            aria-label="Back to ChatForge Home"
          >
            <Layers className="h-4 w-4" />
          </Link>

          <select
            aria-label="Quick switch generator"
            value={project.platformId}
            onChange={(e) => {
              const target = GENERATOR_MAP[e.target.value];
              if (target) router.push(target.routePath);
            }}
            className="h-8 max-w-[132px] truncate rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:max-w-[175px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
            className="hidden h-8 w-36 rounded-lg border border-transparent bg-transparent px-2 text-xs font-medium text-slate-700 hover:border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none xl:block dark:text-slate-200 dark:hover:border-slate-700 dark:focus:bg-slate-900"
          />

          <div
            data-testid="save-status-pill"
            role="status"
            aria-live="polite"
            className={cn(
              'hidden items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium 2xl:inline-flex',
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
                    : 'Unsaved'}
            </span>
          </div>
        </div>

        {/* Center: Clean 2-Option Device Selector + 2-Option Appearance Selector */}
        <div className="flex items-center gap-2">
          {/* ONLY TWO DEVICE OPTIONS: iPhone & Android */}
          <div
            data-testid="device-selector"
            role="group"
            aria-label="Device selector"
            className="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-slate-100/90 p-0.5 dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              data-testid="device-option-iphone"
              aria-pressed={activeDevice === 'iphone'}
              onClick={() => setDeviceType('iphone')}
              className={cn(
                'inline-flex h-7 items-center gap-1 rounded-[10px] px-2.5 text-xs font-semibold transition-all cursor-pointer',
                activeDevice === 'iphone'
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <Smartphone className="h-3 w-3" />
              <span>iPhone</span>
            </button>
            <button
              type="button"
              data-testid="device-option-android"
              aria-pressed={activeDevice === 'android'}
              onClick={() => setDeviceType('android')}
              className={cn(
                'inline-flex h-7 items-center gap-1 rounded-[10px] px-2.5 text-xs font-semibold transition-all cursor-pointer',
                activeDevice === 'android'
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <Smartphone className="h-3 w-3" />
              <span>Android</span>
            </button>
          </div>

          {/* ONLY TWO APPEARANCE OPTIONS: Dark & Light */}
          <div
            data-testid="appearance-selector"
            role="group"
            aria-label="Appearance selector"
            className="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-slate-100/90 p-0.5 dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              data-testid="appearance-option-dark"
              aria-pressed={activeAppearance === 'dark'}
              onClick={() => setAppearance('dark')}
              className={cn(
                'inline-flex h-7 items-center gap-1 rounded-[10px] px-2.5 text-xs font-semibold transition-all cursor-pointer',
                activeAppearance === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs dark:bg-indigo-600'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <Moon className="h-3 w-3" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              data-testid="appearance-option-light"
              aria-pressed={activeAppearance === 'light'}
              onClick={() => setAppearance('light')}
              className={cn(
                'inline-flex h-7 items-center gap-1 rounded-[10px] px-2.5 text-xs font-semibold transition-all cursor-pointer',
                activeAppearance === 'light'
                  ? 'bg-white text-slate-950 shadow-xs dark:bg-slate-200 dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              <Sun className="h-3 w-3" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Right: Minimal Utility Controls (Undo, Redo, Templates, Projects, Video, Pro) */}
        <div className="flex items-center gap-1">
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

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenProjects}
            className="hidden md:inline-flex"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Projects</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenTemplates}
            className="hidden sm:inline-flex"
          >
            <span>Templates</span>
          </Button>

          <Button
            type="button"
            variant={ui.isTimelineOpen ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setTimelineOpen(!ui.isTimelineOpen)}
            aria-pressed={ui.isTimelineOpen}
            className="hidden md:inline-flex"
          >
            <Film className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Video</span>
          </Button>

          {activePlan === 'free' && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              data-testid="header-upgrade-pro-btn"
              onClick={() => openUpgradeModal('video_export')}
              className="border-amber-300/80 bg-amber-50/70 text-amber-800 hover:bg-amber-100 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300"
            >
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span>Pro</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
