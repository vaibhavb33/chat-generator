'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Crown,
  Download,
  Loader2,
  Lock,
  Pause,
  Play,
  RotateCcw,
  StepForward,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBillingStore } from '@/core/billing/entitlements';
import {
  detectVideoCapabilities,
  exportAnimatedChatVideo,
  type VideoExportResult,
} from '@/core/export/videoExporter';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';

export function VideoTimelineBar() {
  const project = useStudioStore((s) => s.project);
  const ui = useStudioStore((s) => s.ui);
  const playTimeline = useStudioStore((s) => s.playTimeline);
  const pauseTimeline = useStudioStore((s) => s.pauseTimeline);
  const resetTimeline = useStudioStore((s) => s.resetTimeline);
  const stepTimelineForward = useStudioStore((s) => s.stepTimelineForward);
  const setTimelineDelayMs = useStudioStore((s) => s.setTimelineDelayMs);
  const setTypingPreview = useStudioStore((s) => s.setTypingPreview);
  const updateVideoOptions = useStudioStore((s) => s.updateVideoOptions);

  const hasFeatureAccess = useBillingStore((s) => s.hasFeatureAccess);
  const openUpgradeModal = useBillingStore((s) => s.openUpgradeModal);

  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [videoResult, setVideoResult] = useState<VideoExportResult | null>(null);

  const conv = getActiveConversation(project);
  const total = Math.max(1, conv.messages.length);
  const visible = Math.min(ui.timelineVisibleCount, total);
  const videoOpts = project.timeline.videoOptions;

  const caps = useMemo(() => detectVideoCapabilities(), []);

  useEffect(() => {
    if (!ui.isPlayingTimeline) return;
    const timer = setInterval(() => {
      stepTimelineForward();
    }, project.timeline.defaultMessageDelayMs);
    return () => clearInterval(timer);
  }, [ui.isPlayingTimeline, project.timeline.defaultMessageDelayMs, stepTimelineForward]);

  if (!ui.isTimelineOpen) return null;

  const handleVideoExport = async () => {
    if (!hasFeatureAccess('video_export')) {
      openUpgradeModal('video_export');
      return;
    }
    setIsExportingVideo(true);
    setExportProgress(0);
    setVideoResult(null);
    try {
      const res = await exportAnimatedChatVideo(project, (pct) => setExportProgress(pct));
      setVideoResult(res);
    } finally {
      setIsExportingVideo(false);
    }
  };

  return (
    <div
      data-testid="video-timeline-bar"
      className="border-t border-slate-200 bg-white px-4 py-3 pb-20 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={ui.isPlayingTimeline ? 'secondary' : 'gradient'}
            onClick={ui.isPlayingTimeline ? pauseTimeline : playTimeline}
          >
            {ui.isPlayingTimeline ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Play Story
              </>
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={stepTimelineForward}
            aria-label="Step forward one message"
          >
            <StepForward className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={resetTimeline}
            aria-label="Reset timeline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Step {visible} / {total}
          </span>
        </div>

        {/* Scrubber Track */}
        <div className="hidden min-w-[140px] flex-1 items-center gap-1.5 xl:flex">
          {conv.messages.map((m, i) => (
            <div
              key={m.id}
              className={`h-2 flex-1 rounded-full transition-colors ${
                i < visible ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
              }`}
              title={m.text || m.type}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <label className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <span>Ratio:</span>
            <select
              aria-label="Video aspect ratio"
              value={videoOpts?.aspectRatio ?? '9:16'}
              onChange={(e) =>
                updateVideoOptions({
                  aspectRatio: e.target.value as '9:16' | '4:5' | '1:1',
                })
              }
              className="h-7 rounded border border-slate-200 bg-white px-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="9:16">9:16 Reels/Shorts</option>
              <option value="4:5">4:5 Feed</option>
              <option value="1:1">1:1 Square</option>
            </select>
          </label>

          <label className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <span>Quality:</span>
            <select
              aria-label="Video resolution"
              value={videoOpts?.resolution ?? '1080p'}
              onChange={(e) => {
                const res = e.target.value as '720p' | '1080p' | '4k';
                if (res === '4k' && !hasFeatureAccess('video_4k_export')) {
                  openUpgradeModal('video_4k_export');
                  return;
                }
                updateVideoOptions({ resolution: res });
              }}
              className="h-7 rounded border border-slate-200 bg-white px-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="720p">720p HD</option>
              <option value="1080p" disabled={!caps.supports1080p}>
                1080p Full HD
              </option>
              <option value="4k" disabled={!caps.supports4K}>
                {caps.supports4K ? '4K Ultra HD (Pro)' : '4K (Unsupported on device)'}
              </option>
            </select>
          </label>

          <label className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <span>FPS:</span>
            <select
              aria-label="Video frame rate"
              value={videoOpts?.fps ?? 30}
              onChange={(e) => {
                const fps = Number(e.target.value) as 30 | 60;
                if (fps === 60 && !hasFeatureAccess('video_60fps_export')) {
                  openUpgradeModal('video_60fps_export');
                  return;
                }
                updateVideoOptions({ fps });
              }}
              className="h-7 rounded border border-slate-200 bg-white px-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <option value={30}>30 FPS</option>
              <option value={60} disabled={!caps.supports60Fps}>
                {caps.supports60Fps ? '60 FPS (Pro)' : '60 FPS (Unsupported)'}
              </option>
            </select>
          </label>

          <label className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={videoOpts?.showKeyboard ?? false}
              onChange={(e) => updateVideoOptions({ showKeyboard: e.target.checked })}
            />
            Keyboard
          </label>

          <label className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={ui.isTypingPreview}
              onChange={(e) => setTypingPreview(e.target.checked)}
            />
            Typing
          </label>

          <label className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <span>Pace:</span>
            <select
              aria-label="Timeline message pacing"
              value={project.timeline.defaultMessageDelayMs}
              onChange={(e) => setTimelineDelayMs(Number(e.target.value))}
              className="h-7 rounded border border-slate-200 bg-white px-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <option value={500}>Fast (0.5s)</option>
              <option value={900}>Natural (0.9s)</option>
              <option value={1500}>Slow (1.5s)</option>
            </select>
          </label>

          <Button
            type="button"
            size="sm"
            variant="gradient"
            onClick={() => void handleVideoExport()}
            disabled={isExportingVideo}
            data-testid="export-video-btn"
          >
            {isExportingVideo ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Rendering {exportProgress}%
              </>
            ) : !hasFeatureAccess('video_export') ? (
              <>
                <Lock className="h-3.5 w-3.5" />
                Export Video
                <Crown className="h-3 w-3 text-amber-300" />
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Export Video
              </>
            )}
          </Button>
        </div>
      </div>

      {caps.reasonIfLimited && (
        <p className="mt-1.5 text-[11px] text-amber-700 dark:text-amber-300">
          {caps.reasonIfLimited}
        </p>
      )}

      {videoResult && (
        <div
          data-testid="video-export-success"
          role="status"
          className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          Exported <strong>{videoResult.filename}</strong> ({videoResult.widthPx}×
          {videoResult.heightPx}px @ {videoResult.fps}fps via {videoResult.method})
        </div>
      )}
    </div>
  );
}
