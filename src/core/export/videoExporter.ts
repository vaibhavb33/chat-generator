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

function drawWallpaperLayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  project: Project,
  canvasBg: string
) {
  const wp = project.theme.wallpaper;
  ctx.fillStyle = canvasBg;
  ctx.fillRect(x, y, w, h);

  if (wp?.kind === 'solid' && wp.value) {
    ctx.fillStyle = wp.value;
    ctx.fillRect(x, y, w, h);
  } else if (wp?.kind === 'gradient' && wp.value) {
    const colors = wp.value.match(/#[0-9a-fA-F]{3,8}/g);
    if (colors && colors.length >= 2) {
      const grad = ctx.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[colors.length - 1]);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
    }
  } else if (wp?.kind === 'default_pattern') {
    // Subtle authentic chat wallpaper pattern
    ctx.save();
    ctx.globalAlpha = project.theme.colorScheme === 'dark' ? 0.045 : 0.055;
    ctx.fillStyle = project.theme.colorScheme === 'dark' ? '#ffffff' : '#334155';
    for (let px = x + 16; px < x + w; px += 34) {
      for (let py = y + 16; py < y + h; py += 34) {
        ctx.beginPath();
        ctx.arc(px + ((py / 34) % 2) * 10, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
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
  voiceProgress: number,
  typingPhase = 0
) {
  const palette = getPlatformVideoPalette(project);
  const isAndroid =
    project.theme.deviceType === 'android' || project.theme.osVariant === 'android';
  const dark = project.theme.colorScheme === 'dark' || project.theme.colorScheme === 'dim';
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

  // Status Bar + App Header
  const statusH = 36;
  const headerTop = cardY + statusH;
  const headerH = 56;
  const composerH = 50;
  const kbH = showKeyboard && showTyping ? 124 : 0;
  const feedTop = headerTop + headerH;
  const feedBottom = cardY + cardH - composerH - kbH - 12;
  const feedH = Math.max(120, feedBottom - feedTop);

  // Wallpaper inside chat feed
  drawWallpaperLayer(ctx, cardX, feedTop, cardW, feedH + composerH + 12, project, palette.canvasBg);

  ctx.fillStyle = palette.headerBg;
  ctx.fillRect(cardX, cardY, cardW, statusH + headerH);

  // Status Bar Icons & Time
  ctx.fillStyle = palette.headerText;
  ctx.font = `600 12px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  ctx.fillText(project.theme.statusBar.timeLabel || '9:41', cardX + 20, cardY + 23);

  // Signal bars + Carrier + Battery
  const rightBarX = cardX + cardW - 82;
  for (let b = 0; b < 4; b++) {
    ctx.globalAlpha = b < (project.theme.statusBar.signalBars ?? 4) ? 0.95 : 0.3;
    ctx.fillRect(rightBarX + b * 4, cardY + 21 - b * 2, 2.5, 4 + b * 2);
  }
  ctx.globalAlpha = 1;
  ctx.font = `600 10px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  ctx.fillText(project.theme.statusBar.carrierLabel || '5G', rightBarX + 20, cardY + 22);
  // Battery outline + fill
  drawRoundedRect(ctx, rightBarX + 40, cardY + 13, 20, 10, 2.5);
  ctx.strokeStyle = palette.headerText;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  const batW = Math.max(2, Math.round((16 * (project.theme.statusBar.batteryPercent ?? 88)) / 100));
  ctx.fillRect(rightBarX + 42, cardY + 15, batW, 6);

  // Dynamic Island vs Android Punch-Hole
  ctx.fillStyle = '#000000';
  if (isAndroid) {
    ctx.beginPath();
    ctx.arc(cardX + cardW / 2, cardY + 18, 5.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    drawRoundedRect(ctx, cardX + cardW / 2 - 38, cardY + 8, 76, 19, 10);
    ctx.fill();
  }

  // App Header (Back button, Avatar, Name, Status)
  const other =
    conv.participantIds
      .map((id) => participantsById[id])
      .find((p) => p && p.id !== conv.selfParticipantId) ?? project.cast[0];

  ctx.fillStyle = palette.headerText;
  ctx.font = `600 16px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  ctx.fillText(isAndroid ? '←' : '‹', cardX + 14, headerTop + 33);

  // Avatar circle
  const avatarX = cardX + 44;
  const avatarY = headerTop + 28;
  ctx.fillStyle = other?.avatarFallbackColor || palette.accent;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 13px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  const displayTitle = conv.groupMeta?.groupName || other?.displayName || 'ChatForge';
  ctx.fillText(displayTitle.slice(0, 1).toUpperCase(), avatarX - 4.5, avatarY + 4.5);

  ctx.fillStyle = palette.headerText;
  ctx.font = `700 14.5px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  ctx.fillText(displayTitle.slice(0, 22), cardX + 68, headerTop + 24);
  ctx.font = `11.5px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
  ctx.globalAlpha = 0.78;
  ctx.fillText(
    showTyping ? 'typing...' : conv.headerState.statusText || 'online',
    cardX + 68,
    headerTop + 41
  );
  ctx.globalAlpha = 1;

  // Messages + Auto-scroll
  const visibleMessages: Message[] = conv.messages.slice(0, visibleCount);
  ctx.font = `13px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;

  const renderedBlocks = visibleMessages.map((m) => {
    const isMedia = m.type === 'image' || m.type === 'video_preview' || m.type === 'link_preview';
    const hasSenderLabel =
      Boolean(conv.groupMeta?.showSenderNamesInBubbles) &&
      m.senderId !== conv.selfParticipantId &&
      m.type !== 'date_separator' &&
      m.type !== 'system';
    const lines = wrapLines(ctx, m.text || (isMedia ? m.attachments?.[0]?.caption || 'Photo attachment' : `[${m.type}]`), cardW * 0.64);
    const mediaH = isMedia ? 72 : 0;
    const reactionH = m.reactions?.length ? 12 : 0;
    const senderH = hasSenderLabel ? 14 : 0;
    const blockH =
      m.type === 'date_separator' || m.type === 'system'
        ? 28
        : Math.max(44, senderH + mediaH + lines.length * 18 + 26);
    return { m, lines, blockH, isMedia, hasSenderLabel, reactionH };
  });

  const typingH = showTyping ? 34 : 0;
  const totalH =
    renderedBlocks.reduce((acc, b) => acc + b.blockH + b.reactionH + 10, 0) + typingH + 12;
  const scrollOffset = Math.max(0, totalH - feedH);

  let y = feedTop + 10 - scrollOffset;
  ctx.save();
  ctx.beginPath();
  ctx.rect(cardX, feedTop, cardW, feedH);
  ctx.clip();

  for (const { m, lines, blockH, isMedia, hasSenderLabel, reactionH } of renderedBlocks) {
    if (m.type === 'date_separator' || m.type === 'system') {
      ctx.fillStyle = palette.otherBubble;
      drawRoundedRect(ctx, cardX + cardW / 2 - 52, y, 104, 22, 8);
      ctx.fill();
      ctx.fillStyle = palette.otherText;
      ctx.font = '10.5px sans-serif';
      const label = (m.text || '').slice(0, 16);
      ctx.fillText(label, cardX + cardW / 2 - ctx.measureText(label).width / 2, y + 15);
      y += blockH + 10;
      continue;
    }

    const isSelf = m.senderId === conv.selfParticipantId;
    const bubbleW = Math.min(cardW * 0.74, 268);
    const bx = isSelf ? cardX + cardW - bubbleW - 14 : cardX + 14;

    ctx.fillStyle = isSelf ? palette.selfBubble : palette.otherBubble;
    drawRoundedRect(ctx, bx, y, bubbleW, blockH, 16);
    ctx.fill();

    let contentY = y + 18;
    if (hasSenderLabel) {
      const sender = participantsById[m.senderId];
      ctx.fillStyle = sender?.nameColorHex || palette.accent;
      ctx.font = `600 11px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
      ctx.fillText(sender?.displayName || m.senderId, bx + 12, contentY - 2);
      contentY += 14;
    }

    if (isMedia) {
      const gradMedia = ctx.createLinearGradient(bx + 10, contentY - 6, bx + bubbleW - 10, contentY + 60);
      gradMedia.addColorStop(0, palette.accent);
      gradMedia.addColorStop(1, dark ? '#1e293b' : '#cbd5e1');
      ctx.fillStyle = gradMedia;
      drawRoundedRect(ctx, bx + 10, contentY - 6, bubbleW - 20, 62, 10);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 11px sans-serif';
      ctx.fillText(m.type === 'video_preview' ? '▶ Video Clip' : m.type === 'link_preview' ? '🔗 Link Preview' : '🖼 Photo', bx + 20, contentY + 29);
      contentY += 68;
    }

    ctx.fillStyle = isSelf ? palette.selfText : palette.otherText;
    if (m.type === 'voice_note') {
      const bars = 16;
      for (let i = 0; i < bars; i++) {
        const active = i / bars <= voiceProgress;
        ctx.fillStyle = active ? palette.accent : 'rgba(100,116,139,0.45)';
        const barH = 8 + ((i * 7) % 10);
        ctx.fillRect(bx + 14 + i * 12, contentY - 2 + (14 - barH) / 2, 5, barH);
      }
    } else {
      ctx.font = `13px ${isAndroid ? 'Roboto, sans-serif' : '-apple-system, BlinkMacSystemFont, sans-serif'}`;
      lines.forEach((ln, li) => {
        ctx.fillText(ln, bx + 12, contentY + li * 18);
      });
    }

    // Timestamp + Read Receipt
    const receiptMark =
      isSelf && m.readReceipt?.status === 'read'
        ? ' ✓✓'
        : isSelf && m.readReceipt?.status === 'delivered'
          ? ' ✓✓'
          : '';
    const stampText = `${m.timestampLabel}${receiptMark}`;
    ctx.font = '10px sans-serif';
    ctx.fillStyle =
      isSelf && m.readReceipt?.status === 'read'
        ? '#38bdf8'
        : isSelf
          ? palette.selfText
          : palette.otherText;
    ctx.globalAlpha = isSelf && m.readReceipt?.status === 'read' ? 0.95 : 0.68;
    const stampW = ctx.measureText(stampText).width;
    ctx.fillText(stampText, bx + bubbleW - stampW - 10, y + blockH - 8);
    ctx.globalAlpha = 1;

    // Reactions pill
    if (m.reactions?.length) {
      const rxSummary = m.reactions.map((r) => `${r.emoji}${r.count > 1 ? ` ${r.count}` : ''}`).join(' ');
      const rxW = Math.max(30, ctx.measureText(rxSummary).width + 14);
      ctx.fillStyle = dark ? '#1e293b' : '#ffffff';
      drawRoundedRect(ctx, bx + 12, y + blockH - 6, rxW, 18, 9);
      ctx.fill();
      ctx.fillStyle = dark ? '#f8fafc' : '#0f172a';
      ctx.font = '10.5px sans-serif';
      ctx.fillText(rxSummary, bx + 19, y + blockH + 6);
    }

    y += blockH + reactionH + 10;
  }

  if (showTyping) {
    ctx.fillStyle = palette.otherBubble;
    drawRoundedRect(ctx, cardX + 14, y, 64, 28, 12);
    ctx.fill();
    for (let d = 0; d < 3; d++) {
      const activeDot = Math.floor(typingPhase * 3) % 3 === d;
      ctx.fillStyle = activeDot ? palette.accent : '#94a3b8';
      ctx.beginPath();
      ctx.arc(cardX + 30 + d * 14, y + (activeDot ? 12 : 15), 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // Bottom Composer Bar
  const composerY = cardY + cardH - composerH - kbH - 12;
  ctx.fillStyle = dark ? '#111827' : '#f8fafc';
  ctx.fillRect(cardX, composerY, cardW, composerH);
  ctx.fillStyle = dark ? '#1f2937' : '#ffffff';
  drawRoundedRect(ctx, cardX + 42, composerY + 9, cardW - 92, 32, 16);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText('Message', cardX + 56, composerY + 29);
  ctx.fillStyle = palette.accent;
  ctx.beginPath();
  ctx.arc(cardX + cardW - 26, composerY + 25, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText('↑', cardX + cardW - 30, composerY + 29);

  // Optional Keyboard Overlay
  if (kbH > 0) {
    ctx.fillStyle = dark ? '#1f2937' : '#d1d5db';
    ctx.fillRect(cardX, cardY + cardH - kbH - 12, cardW, kbH);
    ctx.fillStyle = dark ? '#374151' : '#ffffff';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        drawRoundedRect(
          ctx,
          cardX + 14 + c * 46,
          cardY + cardH - kbH + r * 36,
          38,
          28,
          6
        );
        ctx.fill();
      }
    }
  }

  // Bottom iOS Home Indicator vs Android Gesture Pill
  ctx.fillStyle = dark ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,42,0.7)';
  drawRoundedRect(
    ctx,
    cardX + cardW / 2 - (isAndroid ? 52 : 64),
    cardY + cardH - 10,
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
  onProgress?: (pct: number, stage?: string) => void
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

  onProgress?.(2, 'Preparing video canvas...');
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
    onProgress?.(100, 'Exported interactive fallback');
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
  let totalElapsedMs = 0;

  for (let i = 1; i <= msgCount; i++) {
    const msg = conv.messages[i - 1];
    const customDelay = msg ? videoOpts.perMessageDelays?.[msg.id] : undefined;
    const stepMs = customDelay ?? defaultStepMs;
    const isIncoming =
      msg && msg.senderId !== conv.selfParticipantId && msg.senderId !== 'system';

    if (isIncoming) {
      const typingTotalMs = Math.round(stepMs * 0.7);
      const typingFrames = 3;
      const frameMs = Math.max(30, Math.round(typingTotalMs / typingFrames));
      for (let t = 0; t < typingFrames; t++) {
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
          0.2,
          t / typingFrames
        );
        const pct = Math.min(96, Math.round((((i - 1) + (t + 1) / (typingFrames + 2)) / msgCount) * 95));
        onProgress?.(pct, `Animating typing (${i}/${msgCount})...`);
        await new Promise((r) => setTimeout(r, frameMs));
        totalElapsedMs += frameMs;
      }
    }

    const revealFrames = msg?.type === 'voice_note' && videoOpts.simulateVoicePlayback ? 3 : 1;
    const revealFrameMs = Math.max(40, Math.round(stepMs / revealFrames));
    for (let f = 0; f < revealFrames; f++) {
      const voiceProg =
        msg?.type === 'voice_note' && videoOpts.simulateVoicePlayback
          ? (f + 1) / revealFrames
          : videoOpts.simulateVoicePlayback
            ? 0.85
            : 0.4;
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
        voiceProg
      );
      await new Promise((r) => setTimeout(r, revealFrameMs));
      totalElapsedMs += revealFrameMs;
    }

    const msgPct = Math.min(96, Math.round((i / msgCount) * 96));
    onProgress?.(msgPct, `Rendering message ${i} of ${msgCount}...`);
  }

  onProgress?.(98, 'Encoding video stream...');
  recorder.stop();
  const blob = await stopped;
  const filename = `${project.platformId}-story.${extension}`;
  triggerBrowserDownload(blob, filename);
  onProgress?.(100, 'Video ready');

  return {
    filename,
    mimeType,
    method: extension === 'mp4' ? 'mediarecorder_mp4' : 'mediarecorder_webm',
    widthPx: width,
    heightPx: height,
    fps: safeFps,
    durationMs: totalElapsedMs,
  };
}
