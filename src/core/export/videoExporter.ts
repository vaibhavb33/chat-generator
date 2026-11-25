import type { Conversation, Message, Participant, Project } from '@/core/types';
import { triggerBrowserDownload } from '@/core/export/exportEngine';
import { escapeHtml } from '@/core/security/validation';

export interface VideoExportResult {
  filename: string;
  mimeType: string;
  method: 'mediarecorder_mp4' | 'mediarecorder_webm' | 'animated_html_fallback';
  widthPx: number;
  heightPx: number;
  durationMs: number;
}

export function getVideoDimensions(aspectRatio: '9:16' | '4:5' | '1:1'): {
  width: number;
  height: number;
} {
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
  const dark = project.theme.colorScheme === 'dark';
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

  // Inner Phone Card
  const cardW = Math.min(width - 48, 390);
  const cardH = Math.min(height - 56, 720);
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 28);
  ctx.clip();

  ctx.fillStyle = dark ? '#0B141A' : '#EFEAE2';
  ctx.fillRect(cardX, cardY, cardW, cardH);

  // Header
  const headerH = 64;
  ctx.fillStyle = dark ? '#1F2C34' : '#008069';
  ctx.fillRect(cardX, cardY, cardW, headerH);

  const other =
    conv.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conv.selfParticipantId) ?? project.cast[0];
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(
    conv.groupMeta?.groupName || other?.displayName || 'ChatForge',
    cardX + 20,
    cardY + 30
  );
  ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(
    showTyping ? 'typing...' : conv.headerState.statusText || 'online',
    cardX + 20,
    cardY + 48
  );

  // Messages + auto-scroll from bottom
  const kbH = showKeyboard && showTyping ? 130 : 0;
  const feedTop = cardY + headerH + 12;
  const feedBottom = cardY + cardH - 52 - kbH;
  const feedH = feedBottom - feedTop;

  const visibleMessages: Message[] = conv.messages.slice(0, visibleCount);
  ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';

  const renderedBlocks = visibleMessages.map((m) => {
    const lines = wrapLines(ctx, m.text || `[${m.type}]`, cardW * 0.68);
    const blockH = m.type === 'date_separator' ? 28 : Math.max(42, lines.length * 18 + 26);
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
      ctx.fillStyle = dark ? '#1e293b' : '#ffffff';
      drawRoundedRect(ctx, cardX + cardW / 2 - 44, y, 88, 22, 8);
      ctx.fill();
      ctx.fillStyle = dark ? '#cbd5e1' : '#475569';
      ctx.font = '11px sans-serif';
      ctx.fillText((m.text || '').slice(0, 12), cardX + cardW / 2 - 18, y + 15);
      y += blockH + 10;
      continue;
    }

    const isSelf = m.senderId === conv.selfParticipantId;
    const bubbleW = Math.min(cardW * 0.74, 260);
    const bx = isSelf ? cardX + cardW - bubbleW - 14 : cardX + 14;

    ctx.fillStyle = isSelf
      ? dark
        ? '#005C4B'
        : '#D9FDD3'
      : dark
        ? '#202C33'
        : '#FFFFFF';
    drawRoundedRect(ctx, bx, y, bubbleW, blockH, 14);
    ctx.fill();

    ctx.fillStyle = dark || isSelf ? (dark ? '#ffffff' : '#0f172a') : '#0f172a';
    if (m.type === 'voice_note') {
      const bars = 16;
      for (let i = 0; i < bars; i++) {
        const active = i / bars <= voiceProgress;
        ctx.fillStyle = active ? '#00A884' : 'rgba(100,116,139,0.45)';
        ctx.fillRect(bx + 14 + i * 12, y + 14, 6, 14);
      }
    } else {
      ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
      lines.forEach((ln, li) => {
        ctx.fillText(ln, bx + 12, y + 20 + li * 18);
      });
    }

    ctx.font = '10px sans-serif';
    ctx.fillStyle = 'rgba(100,116,139,0.85)';
    ctx.fillText(m.timestampLabel, bx + bubbleW - 56, y + blockH - 8);
    y += blockH + 10;
  }

  if (showTyping) {
    ctx.fillStyle = dark ? '#202C33' : '#ffffff';
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
    ctx.fillStyle = dark ? '#1f2937' : '#d1d5db';
    ctx.fillRect(cardX, cardY + cardH - kbH, cardW, kbH);
    ctx.fillStyle = dark ? '#374151' : '#ffffff';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        drawRoundedRect(ctx, cardX + 14 + c * 46, cardY + cardH - kbH + 14 + r * 36, 38, 28, 6);
        ctx.fill();
      }
    }
  }

  // Disclosure Badge
  if (project.theme.safetyBadge.enabled) {
    ctx.fillStyle = 'rgba(15,23,42,0.9)';
    ctx.fillRect(cardX, cardY + cardH - 22, cardW, 22);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '10px sans-serif';
    ctx.fillText(project.theme.safetyBadge.labelText, cardX + 24, cardY + cardH - 8);
  }

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
    backgroundCss: 'linear-gradient(135deg, #0f172a 0%, #312e81 55%, #1e1b4b 100%)',
    showKeyboard: false,
    simulateVoicePlayback: true,
    perMessageDelays: {},
  };

  const { width, height } = getVideoDimensions(videoOpts.aspectRatio);
  const { mimeType, extension } = negotiateVideoMimeType();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Graceful fallback if Canvas stream / MediaRecorder is unavailable
  if (!ctx || !mimeType || typeof canvas.captureStream !== 'function') {
    const htmlFallback = `<!doctype html><html><body style="font-family:sans-serif;background:#0f172a;color:#fff;padding:24px;"><h2>${escapeHtml(project.title)} — Animated Preview</h2>${conv.messages
      .map((m) => `<p><strong>${escapeHtml(participantsById[m.senderId]?.displayName || 'System')}:</strong> ${escapeHtml(m.text || m.type)}</p>`)
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
      durationMs: 0,
    };
  }

  const stream = canvas.captureStream(30);
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
  const stepMs = Math.min(350, Math.max(140, Math.round(project.timeline.defaultMessageDelayMs / 3)));

  for (let i = 1; i <= msgCount; i++) {
    const msg = conv.messages[i - 1];
    const isIncoming = msg && msg.senderId !== conv.selfParticipantId && msg.senderId !== 'system';

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
    durationMs: msgCount * stepMs,
  };
}
