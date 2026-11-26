'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Cloud,
  Copy,
  Crown,
  Download,
  FileCode2,
  Film,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  Loader2,
  Lock,
  Pencil,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { useBillingStore } from '@/core/billing/entitlements';
import {
  BUILTIN_TEMPLATES,
  TEMPLATE_CATEGORY_LABELS,
} from '@/core/engine/templateLibrary';
import {
  exportMockupElement,
  exportProjectJsonBundle,
  exportSemanticHtmlSnippet,
  type ExportOutput,
} from '@/core/export/exportEngine';
import {
  detectVideoCapabilities,
  exportAnimatedChatVideo,
} from '@/core/export/videoExporter';
import { useStudioStore } from '@/core/store/useStudioStore';
import type { TemplateCategory } from '@/core/types';

export function ExportModal({
  open,
  onOpenChange,
  exportRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportRef: React.RefObject<HTMLDivElement | null>;
}) {
  const project = useStudioStore((s) => s.project);
  const setExportFormat = useStudioStore((s) => s.setExportFormat);
  const setExportScale = useStudioStore((s) => s.setExportScale);
  const setExportQuality = useStudioStore((s) => s.setExportQuality);
  const setExportAspectRatio = useStudioStore((s) => s.setExportAspectRatio);
  const setBackgroundMode = useStudioStore((s) => s.setBackgroundMode);
  const setCustomDimensions = useStudioStore((s) => s.setCustomDimensions);
  const setSafetyBadge = useStudioStore((s) => s.setSafetyBadge);
  const updateVideoOptions = useStudioStore((s) => s.updateVideoOptions);
  const setTimelineDelayMs = useStudioStore((s) => s.setTimelineDelayMs);

  const hasFeatureAccess = useBillingStore((s) => s.hasFeatureAccess);
  const openUpgradeModal = useBillingStore((s) => s.openUpgradeModal);

  const [exportTab, setExportTab] = useState<'image' | 'video'>('image');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<ExportOutput | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const caps = useMemo(() => detectVideoCapabilities(), []);
  const qualityPct = Math.round((project.exportSettings.quality ?? 0.92) * 100);
  const activeDevice =
    project.theme.deviceType ??
    (project.theme.osVariant === 'android' ? 'android' : 'iphone');

  const handleRunExport = async () => {
    setExportError(null);
    setExportSuccess(null);
    setIsExporting(true);
    try {
      if (exportTab === 'video') {
        if (!hasFeatureAccess('video_export')) {
          setIsExporting(false);
          onOpenChange(false);
          openUpgradeModal('video_export');
          return;
        }
        const vidRes = await exportAnimatedChatVideo(project);
        setExportSuccess({
          filename: vidRes.filename,
          mimeType: vidRes.mimeType,
          widthPx: vidRes.widthPx,
          heightPx: vidRes.heightPx,
        });
      } else if (project.exportSettings.format === 'html_css') {
        const res = exportSemanticHtmlSnippet(project);
        setExportSuccess(res);
      } else {
        if (!exportRef.current) {
          throw new Error('Preview surface is not ready yet.');
        }
        const res = await exportMockupElement(
          exportRef.current,
          project.exportSettings,
          project.title,
          project.theme.colorScheme
        );
        setExportSuccess(res);
      }
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : 'Export failed. Please try again.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="download-menu-dialog"
        className="max-h-[90vh] max-w-lg overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Download Mockup (Zero Watermark)</DialogTitle>
          <DialogDescription>
            Rendered locally in your browser. Free PNG &amp; JPG exports include zero watermarks.
          </DialogDescription>
        </DialogHeader>

        {/* Image Export vs Video Export Tabs */}
        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setExportTab('image')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold cursor-pointer ${
              exportTab === 'image'
                ? 'bg-white text-slate-950 shadow-2xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            Image Export
          </button>
          <button
            type="button"
            data-testid="download-tab-video"
            onClick={() => setExportTab('video')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold cursor-pointer ${
              exportTab === 'video'
                ? 'bg-white text-slate-950 shadow-2xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Film className="h-3.5 w-3.5" />
            Video Export
            {!hasFeatureAccess('video_export') && (
              <Crown className="h-3 w-3 text-amber-500" />
            )}
          </button>
        </div>

        {/* Preview Before Export Summary */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] dark:border-slate-800 dark:bg-slate-900/70">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {project.title}
            </p>
            <p className="text-slate-500">
              {activeDevice === 'iphone' ? 'iPhone (iOS 26)' : 'Android (Material 3)'} •{' '}
              {project.theme.colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            Preview Ready
          </span>
        </div>

        {exportTab === 'image' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {(['png', 'jpeg', 'webp', 'html_css'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                    project.exportSettings.format === fmt
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
                  }`}
                >
                  {fmt === 'html_css' ? 'HTML' : fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}
                </button>
              ))}
            </div>

            {project.exportSettings.format !== 'html_css' && (
              <>
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Resolution Scale
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as const).map((scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => {
                          if (scale === 3 && !hasFeatureAccess('advanced_rendering')) {
                            onOpenChange(false);
                            openUpgradeModal('advanced_rendering');
                            return;
                          }
                          setExportScale(scale);
                        }}
                        className={`rounded-lg border py-1.5 text-xs font-semibold cursor-pointer ${
                          project.exportSettings.scaleFactor === scale
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {scale}x {scale === 2 ? '(Retina)' : scale === 3 ? '(Pro 3x)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="space-y-1">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      Aspect Ratio
                    </span>
                    <select
                      aria-label="Export aspect ratio"
                      value={project.exportSettings.aspectRatioPreset ?? 'device'}
                      onChange={(e) =>
                        setExportAspectRatio(
                          e.target.value as 'device' | '9:16' | '4:5' | '1:1'
                        )
                      }
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="device">Device Screen Ratio</option>
                      <option value="9:16">9:16 Story / Reel</option>
                      <option value="4:5">4:5 Social Post</option>
                      <option value="1:1">1:1 Square</option>
                    </select>
                  </label>

                  <label className="space-y-1">
                    <span className="font-medium text-slate-600 dark:text-slate-400">
                      Background
                    </span>
                    <select
                      aria-label="Export background"
                      value={project.exportSettings.backgroundMode}
                      onChange={(e) =>
                        setBackgroundMode(
                          e.target.value as 'platform' | 'transparent' | 'solid'
                        )
                      }
                      className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 dark:border-slate-700 dark:bg-slate-900"
                    >
                      <option value="platform">Match App Theme</option>
                      <option
                        value="transparent"
                        disabled={project.exportSettings.format === 'jpeg'}
                      >
                        Transparent BG
                      </option>
                      <option value="solid">Studio Solid Canvas</option>
                    </select>
                  </label>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>Export Quality</span>
                    <span className="font-semibold">{qualityPct}%</span>
                  </div>
                  <input
                    type="range"
                    aria-label="Export quality"
                    min={60}
                    max={100}
                    value={qualityPct}
                    onChange={(e) => setExportQuality(Number(e.target.value) / 100)}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-2 rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={project.exportSettings.useCustomDimensions ?? false}
                        onChange={(e) =>
                          setCustomDimensions(
                            e.target.checked,
                            project.exportSettings.customWidthPx,
                            project.exportSettings.customHeightPx
                          )
                        }
                      />
                      Custom Output Dimensions (px)
                    </label>
                    <label className="flex items-center gap-1.5 font-medium">
                      <input
                        type="checkbox"
                        checked={project.theme.safetyBadge.enabled}
                        onChange={(e) => setSafetyBadge(e.target.checked)}
                      />
                      Mockup Disclosure
                    </label>
                  </div>

                  {project.exportSettings.useCustomDimensions && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Input
                        type="number"
                        aria-label="Custom width px"
                        value={project.exportSettings.customWidthPx ?? 1080}
                        onChange={(e) =>
                          setCustomDimensions(
                            true,
                            Math.max(200, Number(e.target.value) || 1080),
                            project.exportSettings.customHeightPx
                          )
                        }
                        className="h-8 text-xs"
                      />
                      <Input
                        type="number"
                        aria-label="Custom height px"
                        value={project.exportSettings.customHeightPx ?? 1350}
                        onChange={(e) =>
                          setCustomDimensions(
                            true,
                            project.exportSettings.customWidthPx,
                            Math.max(200, Number(e.target.value) || 1350)
                          )
                        }
                        className="h-8 text-xs"
                      />
                    </div>
                  )}
                </div>

                {/* Pro Export Pack Shortcuts */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    data-testid="pro-carousel-export-btn"
                    onClick={() => {
                      if (!hasFeatureAccess('carousel_export')) {
                        onOpenChange(false);
                        openUpgradeModal('carousel_export');
                        return;
                      }
                      void handleRunExport();
                    }}
                    className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/50 px-3 py-2 text-[11px] font-semibold text-amber-900 hover:bg-amber-100/70 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      Carousel Set
                    </span>
                    {!hasFeatureAccess('carousel_export') && (
                      <Lock className="h-3 w-3 opacity-70" />
                    )}
                  </button>
                  <button
                    type="button"
                    data-testid="pro-batch-export-btn"
                    onClick={() => {
                      if (!hasFeatureAccess('batch_png_export')) {
                        onOpenChange(false);
                        openUpgradeModal('batch_png_export');
                        return;
                      }
                      void handleRunExport();
                    }}
                    className="flex items-center justify-between rounded-xl border border-amber-200/80 bg-amber-50/50 px-3 py-2 text-[11px] font-semibold text-amber-900 hover:bg-amber-100/70 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Download className="h-3.5 w-3.5" />
                      Batch PNG ZIP
                    </span>
                    {!hasFeatureAccess('batch_png_export') && (
                      <Lock className="h-3 w-3 opacity-70" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-900/60 dark:bg-indigo-950/40">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-950 dark:text-indigo-200">
                  Animated Story Video ({caps.extension.toUpperCase()})
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <Crown className="h-3 w-3" /> Pro
                </span>
              </div>
              <p className="mt-1 text-[11px] text-indigo-900/80 dark:text-indigo-200/80">
                Includes message-by-message typing bubbles, voice waveform playback, read receipts, and smooth auto-scroll.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  Video Aspect Ratio
                </span>
                <select
                  value={project.timeline.videoOptions?.aspectRatio ?? '9:16'}
                  onChange={(e) =>
                    updateVideoOptions({
                      aspectRatio: e.target.value as '9:16' | '4:5' | '1:1',
                    })
                  }
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value="9:16">9:16 Reels / Shorts</option>
                  <option value="4:5">4:5 Social Feed</option>
                  <option value="1:1">1:1 Square</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  Animation Pacing
                </span>
                <select
                  value={project.timeline.defaultMessageDelayMs}
                  onChange={(e) => setTimelineDelayMs(Number(e.target.value))}
                  className="h-8 w-full rounded-lg border border-slate-200 bg-white px-2 dark:border-slate-700 dark:bg-slate-900"
                >
                  <option value={500}>Fast (0.5s / msg)</option>
                  <option value={900}>Natural (0.9s / msg)</option>
                  <option value={1500}>Slow (1.5s / msg)</option>
                </select>
              </label>
            </div>

            {caps.reasonIfLimited && (
              <p className="rounded-lg bg-amber-50 p-2 text-[11px] text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                {caps.reasonIfLimited}
              </p>
            )}
          </div>
        )}

        {exportError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {exportError}
          </div>
        )}

        {exportSuccess && (
          <div
            data-testid="export-success-state"
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Exported {exportSuccess.filename}</p>
              <p className="opacity-80">
                {exportSuccess.widthPx > 0
                  ? `${exportSuccess.widthPx} × ${exportSuccess.heightPx}px • Watermark-free`
                  : 'Semantic HTML transcript downloaded'}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            type="button"
            variant="gradient"
            onClick={handleRunExport}
            disabled={isExporting}
            data-testid="confirm-export-btn"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Rendering...
              </>
            ) : exportTab === 'video' ? (
              hasFeatureAccess('video_export') ? (
                <>
                  <Film className="h-4 w-4" /> Export Video
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Unlock Video Export (Pro)
                </>
              )
            ) : project.exportSettings.format === 'html_css' ? (
              <>
                <FileCode2 className="h-4 w-4" /> Download HTML
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download{' '}
                {project.exportSettings.format === 'jpeg'
                  ? 'JPG'
                  : project.exportSettings.format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ScriptImportModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const importScreenplay = useStudioStore((s) => s.importScreenplay);
  const [scriptText, setScriptText] = useState(
    'You: Wait, did you export the mockup already?\nMaya: Just finished! Check the link preview.\nMaya [voice 0:14]: Quick feedback note\n[system]: Daniel joined the conversation'
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleImport = () => {
    const res = importScreenplay(scriptText);
    if (res.importedCount === 0) {
      setFeedback(res.warnings[0] ?? 'No valid dialogue lines detected.');
      return;
    }
    setFeedback(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Paste Screenplay Script</DialogTitle>
          <DialogDescription>
            Format each line as &ldquo;Name: Message&rdquo;, &ldquo;Name [voice 0:14]: note&rdquo;, or &ldquo;[system]: Notice&rdquo;.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          className="min-h-[160px] font-mono text-xs"
        />
        {feedback && (
          <p role="alert" className="text-xs font-medium text-rose-600">
            {feedback}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="gradient" onClick={handleImport}>
            <Sparkles className="h-4 w-4" /> Build Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TemplatePickerModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const customTemplates = useStudioStore((s) => s.customTemplates);
  const applyTemplate = useStudioStore((s) => s.applyTemplate);
  const saveCurrentAsTemplate = useStudioStore((s) => s.saveCurrentAsTemplate);
  const duplicateTemplate = useStudioStore((s) => s.duplicateTemplate);
  const updateCustomTemplate = useStudioStore((s) => s.updateCustomTemplate);
  const deleteCustomTemplate = useStudioStore((s) => s.deleteCustomTemplate);
  const resetToSeed = useStudioStore((s) => s.resetToSeed);

  const [categoryFilter, setCategoryFilter] = useState<'all' | TemplateCategory>('all');
  const [newTplTitle, setNewTplTitle] = useState('');
  const [newTplCategory, setNewTplCategory] = useState<TemplateCategory>('marketing');

  const allTemplates = [...customTemplates, ...BUILTIN_TEMPLATES];
  const visible = allTemplates.filter(
    (t) => categoryFilter === 'all' || t.category === categoryFilter
  );

  const handleSaveCurrent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTplTitle.trim()) return;
    await saveCurrentAsTemplate(
      newTplTitle,
      newTplCategory,
      'Custom template saved from active conversation'
    );
    setNewTplTitle('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Template Library (9 Categories + Custom)</DialogTitle>
          <DialogDescription>
            Load fictional conversation templates, duplicate them, or save your current conversation as a reusable template.
          </DialogDescription>
        </DialogHeader>

        {/* Save current conversation as template */}
        <form
          onSubmit={(e) => void handleSaveCurrent(e)}
          className="flex flex-col gap-2 rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 sm:flex-row dark:border-indigo-900 dark:bg-indigo-950/20"
        >
          <Input
            placeholder="Save current chat as template..."
            value={newTplTitle}
            onChange={(e) => setNewTplTitle(e.target.value)}
            className="h-8 flex-1 bg-white text-xs dark:bg-slate-950"
          />
          <select
            aria-label="New template category"
            value={newTplCategory}
            onChange={(e) => setNewTplCategory(e.target.value as TemplateCategory)}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
          >
            {Object.entries(TEMPLATE_CATEGORY_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
          <Button type="submit" size="sm" variant="gradient">
            <Plus className="h-3.5 w-3.5" /> Save Template
          </Button>
        </form>

        {/* Category Filter */}
        <div className="flex items-center justify-between gap-2">
          <select
            aria-label="Filter templates by category"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as 'all' | TemplateCategory)
            }
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="all">All 9 Categories ({allTemplates.length})</option>
            {Object.entries(TEMPLATE_CATEGORY_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {visible.map((tpl) => (
            <div
              key={tpl.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {TEMPLATE_CATEGORY_LABELS[tpl.category]}
                  </span>
                  {tpl.isCustom && (
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                      Custom
                    </span>
                  )}
                </div>

                {tpl.isCustom ? (
                  <Input
                    value={tpl.title}
                    onChange={(e) =>
                      void updateCustomTemplate({ ...tpl, title: e.target.value })
                    }
                    className="mt-1.5 h-7 text-xs font-semibold"
                  />
                ) : (
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {tpl.title}
                  </p>
                )}

                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                  {tpl.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    applyTemplate(tpl);
                    onOpenChange(false);
                  }}
                >
                  Apply
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  title="Duplicate template"
                  aria-label={`Duplicate ${tpl.title}`}
                  onClick={() => void duplicateTemplate(tpl)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                {tpl.isCustom && (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Delete ${tpl.title}`}
                    onClick={() => void deleteCustomTemplate(tpl.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              resetToSeed();
              onOpenChange(false);
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset to Default Template
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const project = useStudioStore((s) => s.project);
  const savedProjects = useStudioStore((s) => s.savedProjects);
  const duplicateCurrentProject = useStudioStore((s) => s.duplicateCurrentProject);
  const renameSavedProject = useStudioStore((s) => s.renameSavedProject);
  const restoreProjectById = useStudioStore((s) => s.restoreProjectById);
  const deleteSavedProject = useStudioStore((s) => s.deleteSavedProject);

  const openUpgradeModal = useBillingStore((s) => s.openUpgradeModal);
  const hasFeatureAccess = useBillingStore((s) => s.hasFeatureAccess);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Chats &amp; Project Library</DialogTitle>
          <DialogDescription>
            Restore, duplicate, rename, or export your IndexedDB saved projects.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
              Active: {project.title}
            </p>
            <p className="text-[11px] text-slate-500">
              {project.platformId} • {project.theme.deviceType === 'android' ? 'Android' : 'iPhone'} (
              {project.theme.colorScheme})
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => exportProjectJsonBundle(project)}
            >
              Export .JSON
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void duplicateCurrentProject()}
            >
              <Copy className="h-3.5 w-3.5" /> Duplicate Project
            </Button>
          </div>
        </div>

        {/* Pro Sync & Reusable Characters Quick Triggers */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            data-testid="pro-cloud-sync-btn"
            onClick={() => {
              if (!hasFeatureAccess('cloud_project_management')) {
                onOpenChange(false);
                openUpgradeModal('cloud_project_management');
              }
            }}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Cloud className="h-3.5 w-3.5 text-indigo-500" />
              Cloud Sync Library
            </span>
            {hasFeatureAccess('cloud_project_management') ? (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                PRO
              </span>
            ) : (
              <Crown className="h-3 w-3 text-amber-500" />
            )}
          </button>
          <button
            type="button"
            data-testid="pro-character-lib-btn"
            onClick={() => {
              if (!hasFeatureAccess('reusable_character_library')) {
                onOpenChange(false);
                openUpgradeModal('reusable_character_library');
              }
            }}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-indigo-500" />
              Character Library
            </span>
            {hasFeatureAccess('reusable_character_library') ? (
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                PRO
              </span>
            ) : (
              <Crown className="h-3 w-3 text-amber-500" />
            )}
          </button>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {savedProjects.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-500">
              No saved projects in IndexedDB yet. Click Save Chat to persist your draft.
            </p>
          ) : (
            savedProjects.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 p-2.5 text-xs dark:border-slate-800"
              >
                <div className="min-w-0 flex-1">
                  {renamingId === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        value={renameDraft}
                        aria-label={`Rename ${item.title}`}
                        onChange={(e) => setRenameDraft(e.target.value)}
                        className="h-7 text-xs"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          void renameSavedProject(item.id, renameDraft);
                          setRenamingId(null);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.platformId} • {new Date(item.updatedAt).toLocaleTimeString()}
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      void restoreProjectById(item.id);
                      onOpenChange(false);
                    }}
                  >
                    <FolderOpen className="h-3 w-3" /> Open
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setRenamingId(item.id);
                      setRenameDraft(item.title);
                    }}
                    aria-label={`Rename ${item.title}`}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {item.id !== project.id &&
                    (confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            void deleteSavedProject(item.id);
                            setConfirmDeleteId(null);
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        aria-label={`Delete ${item.title}`}
                        className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmClearModal({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear all messages?</DialogTitle>
          <DialogDescription>
            This empties the active conversation thread. You can still press Undo (Cmd+Z) to restore them.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Clear Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
