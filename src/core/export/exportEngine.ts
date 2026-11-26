import { toCanvas, toJpeg, toPng } from 'html-to-image';
import { escapeHtml, sanitizeImportedProject } from '@/core/security/validation';
import type { ExportSettings, Project } from '@/core/types';

export interface ExportOutput {
  filename: string;
  mimeType: string;
  dataUrl?: string;
  textContent?: string;
  widthPx: number;
  heightPx: number;
}

function sanitizeFileBase(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'chatforge-mockup'
  );
}

/**
 * Ensures all web fonts and rendered images inside the target surface
 * have completely decoded before snapshot rendering runs.
 */
async function waitForAssetsReady(element: HTMLElement): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness rejection in constrained headless environments
    }
  }

  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === 'function') {
          try {
            await img.decode();
          } catch {
            // Continue even if decode rejects on data URLs
          }
        }
        return;
      }
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, 1500);
      });
    })
  );
}

function dataUrlToBlob(dataUrl: string): Blob | null {
  if (!dataUrl.startsWith('data:')) return null;
  const commaIdx = dataUrl.indexOf(',');
  if (commaIdx === -1) return null;
  const header = dataUrl.slice(5, commaIdx);
  const body = dataUrl.slice(commaIdx + 1);
  const mime = header.split(';')[0] || 'application/octet-stream';
  if (header.includes(';base64')) {
    const binary = atob(body);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  }
  return new Blob([decodeURIComponent(body)], { type: mime });
}

export function triggerBrowserDownload(urlOrBlob: string | Blob, filename: string): void {
  if (typeof document === 'undefined') return;
  const link = document.createElement('a');
  let objectUrlToRevoke: string | null = null;
  const blob =
    typeof urlOrBlob === 'string' && typeof URL.createObjectURL === 'function'
      ? dataUrlToBlob(urlOrBlob)
      : urlOrBlob instanceof Blob
        ? urlOrBlob
        : null;

  if (blob && typeof URL.createObjectURL === 'function') {
    objectUrlToRevoke = URL.createObjectURL(blob);
    link.href = objectUrlToRevoke;
  } else if (typeof urlOrBlob === 'string') {
    link.href = urlOrBlob;
  } else {
    return;
  }

  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    link.remove();
    if (objectUrlToRevoke) {
      URL.revokeObjectURL(objectUrlToRevoke);
    }
  }, 10000);
}

function resizeCanvasWithBackdrop(
  source: HTMLCanvasElement,
  targetW: number,
  targetH: number,
  transparent: boolean,
  backdropColor: string
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext('2d');
  if (!ctx) return source;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (!transparent) {
    ctx.fillStyle = backdropColor;
    ctx.fillRect(0, 0, targetW, targetH);
  }

  const scale = Math.min((targetW * 0.92) / source.width, (targetH * 0.92) / source.height);
  const drawW = source.width * scale;
  const drawH = source.height * scale;
  const dx = (targetW - drawW) / 2;
  const dy = (targetH - drawH) / 2;
  ctx.drawImage(source, dx, dy, drawW, drawH);
  return out;
}

function resolveLogicalDimensions(element: HTMLElement): { width: number; height: number } {
  const offsetW = element.offsetWidth;
  const offsetH = element.offsetHeight;
  if (offsetW > 0 && offsetH > 0) {
    return { width: offsetW, height: offsetH };
  }
  const rect = element.getBoundingClientRect();
  return {
    width: Math.max(1, Math.round(rect.width)),
    height: Math.max(1, Math.round(rect.height)),
  };
}

function resolveAspectDimensions(
  aspectRatioPreset: ExportSettings['aspectRatioPreset'],
  logicalSize: { width: number; height: number },
  scaleFactor: 1 | 2 | 3
): { width: number; height: number } | null {
  if (!aspectRatioPreset || aspectRatioPreset === 'device') return null;
  const baseW = Math.max(Math.round(logicalSize.width), 393) * scaleFactor;
  if (aspectRatioPreset === '9:16') return { width: baseW, height: Math.round((baseW * 16) / 9) };
  if (aspectRatioPreset === '4:5') return { width: baseW, height: Math.round((baseW * 5) / 4) };
  if (aspectRatioPreset === '1:1') return { width: baseW, height: baseW };
  return null;
}

export async function exportMockupElement(
  element: HTMLElement,
  settings: ExportSettings,
  projectTitle: string,
  colorScheme: 'light' | 'dark' | 'dim' = 'light'
): Promise<ExportOutput> {
  await waitForAssetsReady(element);

  const baseName = sanitizeFileBase(projectTitle);
  // Use unscaled layout dimensions so previewZoom CSS transforms never crop or distort exports
  const logicalSize = resolveLogicalDimensions(element);
  const isTransparent =
    settings.backgroundMode === 'transparent' && settings.format !== 'jpeg';
  const quality = Math.max(0.5, Math.min(1, settings.quality ?? 0.92));
  const darkSurface = colorScheme === 'dark' || colorScheme === 'dim';
  const solidBg =
    settings.backgroundMode === 'solid'
      ? darkSurface
        ? '#090d16'
        : '#f8fafc'
      : darkSurface
        ? '#000000'
        : '#ffffff';

  const captureWidth = Math.max(1, Math.round(logicalSize.width));
  const captureHeight =
    settings.captureScope === 'full_conversation'
      ? Math.max(Math.round(logicalSize.height), element.scrollHeight)
      : Math.max(1, Math.round(logicalSize.height));

  const commonOptions = {
    pixelRatio: settings.scaleFactor,
    cacheBust: true,
    width: captureWidth,
    height: captureHeight,
    backgroundColor: isTransparent ? undefined : solidBg,
    style: {
      transform: 'none',
      margin: '0',
    },
    filter: (node: HTMLElement) => !node?.dataset?.exportIgnore,
  };

  const aspectTarget = resolveAspectDimensions(
    settings.aspectRatioPreset,
    logicalSize,
    settings.scaleFactor
  );
  const targetDims =
    settings.useCustomDimensions && settings.customWidthPx && settings.customHeightPx
      ? { width: settings.customWidthPx, height: settings.customHeightPx }
      : aspectTarget;

  if (targetDims) {
    const rawCanvas = await toCanvas(element, commonOptions);
    const sized = resizeCanvasWithBackdrop(
      rawCanvas,
      targetDims.width,
      targetDims.height,
      isTransparent,
      solidBg
    );
    const mime =
      settings.format === 'jpeg'
        ? 'image/jpeg'
        : settings.format === 'webp'
          ? 'image/webp'
          : 'image/png';
    const ext =
      settings.format === 'jpeg'
        ? 'jpg'
        : settings.format === 'webp'
          ? 'webp'
          : 'png';
    const dataUrl = sized.toDataURL(mime, quality);
    const filename = `${baseName}-${targetDims.width}x${targetDims.height}.${ext}`;
    triggerBrowserDownload(dataUrl, filename);
    return {
      filename,
      mimeType: mime,
      dataUrl,
      widthPx: targetDims.width,
      heightPx: targetDims.height,
    };
  }

  const widthPx = Math.max(1, Math.round(captureWidth * settings.scaleFactor));
  const heightPx = Math.max(1, Math.round(captureHeight * settings.scaleFactor));

  if (settings.format === 'webp') {
    const canvas = await toCanvas(element, commonOptions);
    const dataUrl = canvas.toDataURL('image/webp', quality);
    const encodedAsWebp = dataUrl.startsWith('data:image/webp');
    const filename = `${baseName}-${settings.scaleFactor}x.${encodedAsWebp ? 'webp' : 'png'}`;
    triggerBrowserDownload(dataUrl, filename);
    return {
      filename,
      mimeType: encodedAsWebp ? 'image/webp' : 'image/png',
      dataUrl,
      widthPx,
      heightPx,
    };
  }

  if (settings.format === 'jpeg') {
    const dataUrl = await toJpeg(element, {
      ...commonOptions,
      backgroundColor: solidBg,
      quality,
    });
    const filename = `${baseName}-${settings.scaleFactor}x.jpg`;
    triggerBrowserDownload(dataUrl, filename);
    return { filename, mimeType: 'image/jpeg', dataUrl, widthPx, heightPx };
  }

  const dataUrl = await toPng(element, commonOptions);
  const filename = `${baseName}-${settings.scaleFactor}x.png`;
  triggerBrowserDownload(dataUrl, filename);
  return { filename, mimeType: 'image/png', dataUrl, widthPx, heightPx };
}

export function exportProjectJsonBundle(project: Project): ExportOutput {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const filename = `${sanitizeFileBase(project.title)}.chatforge.json`;
  triggerBrowserDownload(blob, filename);
  return {
    filename,
    mimeType: 'application/json',
    textContent: json,
    widthPx: 0,
    heightPx: 0,
  };
}

export function exportSemanticHtmlSnippet(project: Project): ExportOutput {
  const conv =
    project.conversations.find((c) => c.id === project.activeConversationId) ??
    project.conversations[0];
  const participantMap = new Map(project.cast.map((p) => [p.id, p]));

  const rows = (conv?.messages ?? [])
    .map((m) => {
      const sender = escapeHtml(participantMap.get(m.senderId)?.displayName ?? m.senderId);
      const escaped = escapeHtml(m.text ?? '');
      const escapedTime = escapeHtml(m.timestampLabel ?? '');
      if (m.type === 'system' || m.type === 'date_separator') {
        return `  <p class="cf-system">${escaped}</p>`;
      }
      const side = m.senderId === conv?.selfParticipantId ? 'cf-self' : 'cf-other';
      return `  <div class="cf-msg ${side}"><strong>${sender}</strong>: <span>${escaped}</span> <time>${escapedTime}</time></div>`;
    })
    .join('\n');

  const html = `<section class="cf-transcript" aria-label="${escapeHtml(project.title)}">\n${rows}\n</section>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const filename = `${sanitizeFileBase(project.title)}.html`;
  triggerBrowserDownload(blob, filename);
  return {
    filename,
    mimeType: 'text/html',
    textContent: html,
    widthPx: 0,
    heightPx: 0,
  };
}

export function parseImportedProjectJson(rawText: string): Project {
  return sanitizeImportedProject(rawText);
}
