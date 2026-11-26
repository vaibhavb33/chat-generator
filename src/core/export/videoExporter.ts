import type { Conversation, Message, Participant, Project } from '@/core/types';
import { triggerBrowserDownload } from '@/core/export/exportEngine';
import { escapeHtml } from '@/core/security/validation';

export interface VideoExportResult {
  filename: string;
  mimeType: string;
  method: 'mediarecorder_mp4' | 'mediarecorder_webm' | 'animated_html_fallback';
  widthPx: number;
  heightPx: number;
  fps: number;
  durationMs: number;
}

export interface VideoCapabilityReport {
  canRecordVideo: boolean;
  preferredMimeType: string | null;
  extension: 'mp4' | 'webm';
  supports1080p: boolean;
  supports4K: boolean;
  supports60Fps: boolean;
  reasonIfLimited?: string;
}

export function getVideoDimensions(
  aspectRatio: '9:16' | '4:5' | '1:1',
  resolution: '720p' | '1080p' | '4k' = '720p'
): {
  width: number;
  height: number;
} {
  if (resolution === '4k') {
    switch (aspectRatio) {
      case '9:16':
        return { width: 2160, height: 3840 };
      case '4:5':
        return { width: 2160, height: 2700 };
      case '1:1':
        return { width: 2160, height: 2160 };
    }
  }
  if (resolution === '1080p') {
    switch (aspectRatio) {
      case '9:16':
        return { width: 1080, height: 1920 };
      case '4:5':
        return { width: 1080, height: 1350 };
      case '1:1':
        return { width: 1080, height: 1080 };
    }
  }
  // Preserves compact default sizes for crisp unit assertions and fast previews
  switch (aspectRatio) {
    case '9:16':
      return { width: 540, height: 960 };
    case '4:5':
      return { width: 640, height: 800 };
    case '1:1':
      return { width: 720, height: 720 };
  }
}

export function negotiateVideoMimeType(): {
  mimeType: string | null;
  extension: 'mp4' | 'webm';
} {
  if (typeof MediaRecorder === 'undefined') {
    return { mimeType: null, extension: 'webm' };
  }
  const candidates: Array<{ mime: string; ext: 'mp4' | 'webm' }> = [
    { mime: 'video/mp4;codecs=avc1', ext: 'mp4' },
    { mime: 'video/mp4', ext: 'mp4' },
    { mime: 'video/webm;codecs=vp9', ext: 'webm' },
    { mime: 'video/webm;codecs=vp8', ext: 'webm' },
    { mime: 'video/webm', ext: 'webm' },
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c.mime)) {
      return { mimeType: c.mime, extension: c.ext };
    }
  }
  return { mimeType: null, extension: 'webm' };
}

/**
 * Empirically inspects browser canvas capture and encoder capabilities.
 * Never promises 4K or 60 FPS on browsers/devices that cannot reliably sustain them.
 */
export function detectVideoCapabilities(): VideoCapabilityReport {
  const { mimeType, extension } = negotiateVideoMimeType();
  const hasCanvasStream =
    typeof document !== 'undefined' &&
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof HTMLCanvasElement.prototype.captureStream === 'function';

  const canRecordVideo = Boolean(mimeType && hasCanvasStream);
  const cores =
    typeof navigator !== 'undefined' ? navigator.hardwareConcurrency ?? 2 : 2;
  const isMobileUa =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);

  const supports1080p = canRecordVideo;
  const supports4K = canRecordVideo && !isMobileUa && cores >= 4;
  const supports60Fps = canRecordVideo && !isMobileUa && cores >= 4;

  return {
    canRecordVideo,
    preferredMimeType: mimeType,
    extension,
    supports1080p,
    supports4K,
    supports60Fps,
    reasonIfLimited: !canRecordVideo
      ? 'This browser does not expose MediaRecorder canvas streaming; video downloads will fall back or require Chromium/Firefox.'
      : !supports4K
        ? '4K / 60 FPS export is disabled on this device profile to prevent encoder drops; 1080p @ 30 FPS is recommended.'
        : undefined,
  };
}

function getPlatformVideoPalette(project: Project) {
  const dark = project.theme.colorScheme === 'dark' || project.theme.colorScheme === 'dim';
  switch (project.platformId) {
    case 'imessage':
      return {
        canvasBg: dark ? '#000000' : '#FFFFFF',
        headerBg: dark ? '#121214' : '#F9F9FB',
        headerText: dark ? '#FFFFFF' : '#000000',
        selfBubble: dark ? '#0A84FF' : '#007AFF',
        selfText: '#FFFFFF',
        otherBubble: dark ? '#262629' : '#E9E9EB',
        otherText: dark ? '#FFFFFF' : '#000000',
        accent: '#007AFF',
      };
    case 'instagram-dm':
      return {
        canvasBg: dark ? '#000000' : '#FFFFFF',
        headerBg: dark ? '#000000' : '#FFFFFF',
        headerText: dark ? '#FFFFFF' : '#0F172A',
        selfBubble: '#7C3AED',
        selfText: '#FFFFFF',
        otherBubble: dark ? '#262626' : '#EFEFEF',
        otherText: dark ? '#FFFFFF' : '#0F172A',
        accent: '#833AB4',
      };
    case 'telegram-chat':
      return {
        canvasBg: dark ? '#0E1621' : '#DFEDDA',
        headerBg: dark ? '#17212B' : '#517DA2',
        headerText: '#FFFFFF',
        selfBubble: dark ? '#2B5278' : '#EEFFDE',
        selfText: dark ? '#FFFFFF' : '#0F172A',
        otherBubble: dark ? '#182533' : '#FFFFFF',
        otherText: dark ? '#FFFFFF' : '#0F172A',
        accent: '#3390EC',
      };
    case 'android-messages':
      return {
        canvasBg: dark ? '#121318' : '#FDFBFF',
        headerBg: dark ? '#1D1F27' : '#EFF3F9',
        headerText: dark ? '#FFFFFF' : '#1A1C1E',
        selfBubble: dark ? '#A8C7FA' : '#0B57D0',
        selfText: dark ? '#062E6F' : '#FFFFFF',
        otherBubble: dark ? '#24262F' : '#E8EDF5',
        otherText: dark ? '#E3E2E6' : '#1A1C1E',
        accent: '#0B57D0',
      };
    case 'discord-chat':
      return {
        canvasBg: dark ? '#313338' : '#FFFFFF',
        headerBg: dark ? '#2B2D31' : '#F8FAFC',
        headerText: dark ? '#FFFFFF' : '#0F172A',
        selfBubble: '#5865F2',
        selfText: '#FFFFFF',
        otherBubble: dark ? '#2B2D31' : '#F1F5F9',
        otherText: dark ? '#DBDEE1' : '#0F172A',
        accent: '#5865F2',
      };
    default:
      return {
        canvasBg: dark ? '#0B141A' : '#EFEAE2',
        headerBg: dark ? '#1F2C34' : '#008069',
        headerText: '#FFFFFF',
        selfBubble: dark ? '#005C4B' : '#D9FDD3',
        selfText: dark ? '#FFFFFF' : '#0F172A',
        otherBubble: dark ? '#202C33' : '#FFFFFF',
        otherText: dark ? '#FFFFFF' : '#0F172A',
        accent: '#1DAA61',
      };
  }
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.closePath();
}

function drawSceneFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  project: Project,
  conv: Conversation,
  participantsById: Record<string, Participant>,
  visibleCount: number,
  showTyping: boolean,
  showKeyboard: boolean,
  voiceProgress: number
) {
  const palette = getPlatformVideoPalette(project);
  const isAndroid =
    project.theme.deviceType === 'android' || project.theme.osVariant === 'android';
  const bgCss = project.timeline.videoOptions?.backgroundCss ?? '';

  // Outer Studio Background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  if (bgCss.includes('#0f172a')) {
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.55, '#312e81');
    grad.addColorStop(1, '#1e1b4b');
  } else if (bgCss.includes('#ec4899')) {
    grad.addColorStop(0, '#4f46e5');
    grad.addColorStop(1, '#ec4899');
  } else {
    grad.addColorStop(0, '#4f46e5');
    grad.addColorStop(1, '#1d4ed8');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Scaled Inner Device Screen preserving iPhone / Android Proportions
  const scale = width / 540;
  ctx.save();
  ctx.scale(scale, scale);
  const logicalW = 540;
  const logicalH = height / scale;

  const cardW = Math.min(logicalW - 48, 390);
  const cardH = Math.min(logicalH - 56, 740);
  const cardX = (logicalW - cardW) / 2;
  const cardY = (logicalH - cardH) / 2;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, isAndroid ? 24 : 34);
  ctx.clip();

  ctx.fillStyle = palette.canvasBg;
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Status Bar + Cutout
  const statusH = 34;
  ctx.fillStyle = palette.headerBg;
  ctx.fillRect(cardX, cardY, cardW, statusH + 56);

  ctx.fillStyle = palette.headerText;
  ctx.font = `600 12px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  ctx.fillText(project.theme.statusBar.timeLabel || '9:41', cardX + 20, cardY + 22);
  ctx.fillText(
    `${project.theme.statusBar.carrierLabel || '5G'}  ${project.theme.statusBar.batteryPercent}%`,
    cardX + cardW - 68,
    cardY + 22
  );

  // Dynamic Island vs Android Punch-Hole
  ctx.fillStyle = '#000000';
  if (isAndroid) {
    ctx.beginPath();
    ctx.arc(cardX + cardW / 2, cardY + 17, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    drawRoundedRect(ctx, cardX + cardW / 2 - 38, cardY + 8, 76, 19, 10);
    ctx.fill();
  }

  // App Header
  const headerTop = cardY + statusH;
  const headerH = 56;
  const other =
    conv.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conv.selfParticipantId) ?? project.cast[0];

  ctx.fillStyle = palette.headerText;
  ctx.font = `700 15px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  ctx.fillText(
    conv.groupMeta?.groupName || other?.displayName || 'ChatForge',
    cardX + 20,
    headerTop + 24
  );
  ctx.font = `12px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  ctx.globalAlpha = 0.78;
  ctx.fillText(
    showTyping ? 'typing...' : conv.headerState.statusText || 'online',
    cardX + 20,
    headerTop + 42
  );
  ctx.globalAlpha = 1;

  // Messages + Auto-scroll
  const kbH = showKeyboard && showTyping ? 130 : 0;
  const feedTop = headerTop + headerH + 12;
  const feedBottom = cardY + cardH - 36 - kbH;
  const feedH = feedBottom - feedTop;

  const visibleMessages: Message[] = conv.messages.slice(0, visibleCount);
  ctx.font = `13px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;

  const renderedBlocks = visibleMessages.map((m) => {
    const lines = wrapLines(ctx, m.text || `[${m.type}]`, cardW * 0.68);
    const blockH =
      m.type === 'date_separator' ? 28 : Math.max(44, lines.length * 18 + 26);
    return { m, lines, blockH };
  });

  const typingH = showTyping ? 34 : 0;
  const totalH = renderedBlocks.reduce((acc, b) => acc + b.blockH + 10, 0) + typingH;
  const scrollOffset = Math.max(0, totalH - feedH);

  let y = feedTop - scrollOffset;
  ctx.save();
  ctx.beginPath();
  ctx.rect(cardX, feedTop, cardW, feedH);
  ctx.clip();

  for (const { m, lines, blockH } of renderedBlocks) {
    if (m.type === 'date_separator' || m.type === 'system') {
      ctx.fillStyle = palette.otherBubble;
      drawRoundedRect(ctx, cardX + cardW / 2 - 44, y, 88, 22, 8);
      ctx.fill();
      ctx.fillStyle = palette.otherText;
      ctx.font = '11px sans-serif';
      ctx.fillText((m.text || '').slice(0, 12), cardX + cardW / 2 - 18, y + 15);
      y += blockH + 10;
      continue;
    }

    const isSelf = m.senderId === conv.selfParticipantId;
    const bubbleW = Math.min(cardW * 0.74, 260);
    const bx = isSelf ? cardX + cardW - bubbleW - 14 : cardX + 14;

    ctx.fillStyle = isSelf ? palette.selfBubble : palette.otherBubble;
    drawRoundedRect(ctx, bx, y, bubbleW, blockH, 16);
    ctx.fill();

    ctx.fillStyle = isSelf ? palette.selfText : palette.otherText;
    if (m.type === 'voice_note') {
      const bars = 16;
      for (let i = 0; i < bars; i++) {
        const active = i / bars <= voiceProgress;
        ctx.fillStyle = active ? palette.accent : 'rgba(100,116,139,0.45)';
        ctx.fillRect(bx + 14 + i * 12, y + 14, 6, 14);
      }
    } else {
      ctx.font = `13px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
      lines.forEach((ln, li) => {
        ctx.fillText(ln, bx + 12, y + 20 + li * 18);
      });
    }

    ctx.font = '10px sans-serif';
    ctx.globalAlpha = 0.7;
    ctx.fillText(
      `${m.timestampLabel}${isSelf && m.readReceipt?.status === 'read' ? ' ✓✓' : ''}`,
      bx + bubbleW - 64,
      y + blockH - 8
    );
    ctx.globalAlpha = 1;
    y += blockH + 10;
  }

  if (showTyping) {
    ctx.fillStyle = palette.otherBubble;
    drawRoundedRect(ctx, cardX + 14, y, 64, 28, 12);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cardX + 30, y + 14, 3, 0, Math.PI * 2);
    ctx.arc(cardX + 44, y + 14, 3, 0, Math.PI * 2);
    ctx.arc(cardX + 58, y + 14, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Optional Keyboard Overlay
  if (kbH > 0) {
    ctx.fillStyle = project.theme.colorScheme === 'dark' ? '#1f2937' : '#d1d5db';
    ctx.fillRect(cardX, cardY + cardH - kbH, cardW, kbH);
    ctx.fillStyle = project.theme.colorScheme === 'dark' ? '#374151' : '#ffffff';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        drawRoundedRect(
          ctx,
          cardX + 14 + c * 46,
          cardY + cardH - kbH + 14 + r * 36,
          38,
          28,
          6
        );
        ctx.fill();
      }
    }
  }

  // Bottom iOS Home Indicator vs Android Gesture Pill
  ctx.fillStyle = project.theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.7)';
  drawRoundedRect(
    ctx,
    cardX + cardW / 2 - (isAndroid ? 52 : 64),
    cardY + cardH - 12,
    isAndroid ? 104 : 128,
    4,
    2
  );
  ctx.fill();

  // Disclosure Badge
  if (project.theme.safetyBadge.enabled) {
    ctx.fillStyle = 'rgba(15,23,42,0.9)';
    ctx.fillRect(cardX, cardY + cardH - 22, cardW, 22);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px sans-serif';
    ctx.fillText(project.theme.safetyBadge.labelText, cardX + 24, cardY + cardH - 8);
  }

  ctx.restore();
  ctx.restore();
}

export async function exportAnimatedChatVideo(
  project: Project,
  onProgress?: (pct: number) => void
): Promise<VideoExportResult> {
  const conv =
    project.conversations.find((c) => c.id === project.activeConversationId) ??
    project.conversations[0];
  const participantsById = Object.fromEntries(project.cast.map((p) => [p.id, p]));
  const videoOpts = project.timeline.videoOptions ?? {
    aspectRatio: '9:16' as const,
    resolution: '1080p' as const,
    fps: 30 as const,
    backgroundCss: 'linear-gradient(135deg, #0f172a 0%, #312e81 55%, #1e1b4b 100%)',
    showKeyboard: false,
    simulateVoicePlayback: true,
    perMessageDelays: {},
  };

  const caps = detectVideoCapabilities();
  const safeResolution =
    videoOpts.resolution === '4k' && caps.supports4K
      ? '4k'
      : videoOpts.resolution === '1080p' && caps.supports1080p
        ? '1080p'
        : '720p';
  const safeFps = videoOpts.fps === 60 && caps.supports60Fps ? 60 : 30;

  const { width, height } = getVideoDimensions(videoOpts.aspectRatio, safeResolution);
  const { mimeType, extension } = negotiateVideoMimeType();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Graceful fallback if Canvas stream / MediaRecorder is unavailable
  if (!ctx || !mimeType || typeof canvas.captureStream !== 'function') {
    const htmlFallback = `<!doctype html><html><body style="font-family:sans-serif;background:#0f172a;color:#fff;padding:24px;"><h2>${escapeHtml(project.title)} — Animated Preview</h2>${conv.messages
      .map(
        (m) =>
          `<p><strong>${escapeHtml(participantsById[m.senderId]?.displayName || 'System')}:</strong> ${escapeHtml(m.text || m.type)}</p>`
      )
      .join('')}</body></html>`;
    const blob = new Blob([htmlFallback], { type: 'text/html' });
    const filename = `${project.platformId}-animated-story.html`;
    triggerBrowserDownload(blob, filename);
    return {
      filename,
      mimeType: 'text/html',
      method: 'animated_html_fallback',
      widthPx: width,
      heightPx: height,
      fps: 0,
      durationMs: 0,
    };
  }

  const stream = canvas.captureStream(safeFps);
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const stopped = new Promise<Blob>((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
  });

  recorder.start(100);
  const msgCount = Math.max(1, conv.messages.length);
  const defaultStepMs = Math.min(
    450,
    Math.max(140, Math.round(project.timeline.defaultMessageDelayMs / 3))
  );

  for (let i = 1; i <= msgCount; i++) {
    const msg = conv.messages[i - 1];
    const customDelay = msg ? videoOpts.perMessageDelays?.[msg.id] : undefined;
    const stepMs = customDelay ?? defaultStepMs;
    const isIncoming =
      msg && msg.senderId !== conv.selfParticipantId && msg.senderId !== 'system';

    if (isIncoming) {
      drawSceneFrame(
        ctx,
        width,
        height,
        project,
        conv,
        participantsById,
        i - 1,
        true,
        videoOpts.showKeyboard,
        0.2
      );
      await new Promise((r) => setTimeout(r, Math.round(stepMs * 0.7)));
    }

    drawSceneFrame(
      ctx,
      width,
      height,
      project,
      conv,
      participantsById,
      i,
      false,
      false,
      videoOpts.simulateVoicePlayback ? 0.85 : 0.4
    );
    onProgress?.(Math.round((i / msgCount) * 100));
    await new Promise((r) => setTimeout(r, stepMs));
  }

  recorder.stop();
  const blob = await stopped;
  const filename = `${project.platformId}-story.${extension}`;
  triggerBrowserDownload(blob, filename);

  return {
    filename,
    mimeType,
    method: extension === 'mp4' ? 'mediarecorder_mp4' : 'mediarecorder_webm',
    widthPx: width,
    heightPx: height,
    fps: safeFps,
    durationMs: msgCount * defaultStepMs,
  };
}
