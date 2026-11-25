'use client';

import React, { useEffect, useState } from 'react';
import { Download, Loader2, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportAnimatedChatVideo, type VideoExportResult } from '@/core/export/videoExporter';
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

  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [videoResult, setVideoResult] = useState<VideoExportResult | null>(null);

  const conv = getActiveConversation(project);
  const total = Math.max(1, conv.messages.length);
  const visible = Math.min(ui.timelineVisibleCount, total);
  const videoOpts = project.timeline.videoOptions;

  useEffect(() => {
    if (!ui.isPlayingTimeline) return;
    const timer = setInterval(() => {
      stepTimelineForward();
    }, project.timeline.defaultMessageDelayMs);
    return () => clearInterval(timer);
  }, [ui.isPlayingTimeline, project.timeline.defaultMessageDelayMs, stepTimelineForward]);

  if (!ui.isTimelineOpen) return null;

  const handleVideoExport = async () => {
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
      className="border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
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
        <div className="hidden min-w-[160px] flex-1 items-center gap-1.5 xl:flex">
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

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
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
              <option value="9:16">9:16 Reels/TikTok</option>
              <option value="4:5">4:5 Feed</option>
              <option value="1:1">1:1 Square</option>
            </select>
          </label>

          <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span>Backdrop:</span>
            <select
              aria-label="Video background style"
              value={videoOpts?.backgroundCss ?? 'indigo'}
              onChange={(e) => updateVideoOptions({ backgroundCss: e.target.value })}
              className="h-7 rounded border border-slate-200 bg-white px-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="linear-gradient(135deg, #0f172a 0%, #312e81 55%, #1e1b4b 100%)">
                Midnight Studio
              </option>
              <option value="linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)">
                Creator Sunset
              </option>
              <option value="linear-gradient(135deg, #4f46e5 0%, #1d4ed8 100%)">
                Electric Blue
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

          <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
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
            ) : (
              <>
                <Download className="h-3.5 w-3.5" /> Export Video
              </>
            )}
          </Button>
        </div>
      </div>

      {videoResult && (
        <div
          data-testid="video-export-success"
          role="status"
          className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          Exported <strong>{videoResult.filename}</strong> ({videoResult.widthPx}×
          {videoResult.heightPx}px via {videoResult.method})
        </div>
      )}
    </div>
  );
}
