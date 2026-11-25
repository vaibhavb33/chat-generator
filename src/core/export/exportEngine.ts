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
  transparent: boolean
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext('2d');
  if (!ctx) return source;

  if (!transparent) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, targetW, targetH);
  }

  const scale = Math.min((targetW * 0.9) / source.width, (targetH * 0.9) / source.height);
  const drawW = source.width * scale;
  const drawH = source.height * scale;
  const dx = (targetW - drawW) / 2;
  const dy = (targetH - drawH) / 2;
  ctx.drawImage(source, dx, dy, drawW, drawH);
  return out;
}

export async function exportMockupElement(
  element: HTMLElement,
  settings: ExportSettings,
  projectTitle: string
): Promise<ExportOutput> {
  const baseName = sanitizeFileBase(projectTitle);
  const rect = element.getBoundingClientRect();
  const isTransparent = settings.backgroundMode === 'transparent' && settings.format !== 'jpeg';

  const commonOptions = {
    pixelRatio: settings.scaleFactor,
    cacheBust: true,
    backgroundColor: isTransparent ? undefined : '#ffffff',
    filter: (node: HTMLElement) => !node?.dataset?.exportIgnore,
  };

  if (settings.useCustomDimensions && settings.customWidthPx && settings.customHeightPx) {
    const rawCanvas = await toCanvas(element, commonOptions);
    const sized = resizeCanvasWithBackdrop(
      rawCanvas,
      settings.customWidthPx,
      settings.customHeightPx,
      isTransparent
    );
    const mime =
      settings.format === 'jpeg'
        ? 'image/jpeg'
        : settings.format === 'webp'
          ? 'image/webp'
          : 'image/png';
    const ext = settings.format === 'jpeg' ? 'jpg' : settings.format === 'webp' ? 'webp' : 'png';
    const dataUrl = sized.toDataURL(mime, 0.92);
    const filename = `${baseName}-${settings.customWidthPx}x${settings.customHeightPx}.${ext}`;
    triggerBrowserDownload(dataUrl, filename);
    return {
      filename,
      mimeType: mime,
      dataUrl,
      widthPx: settings.customWidthPx,
      heightPx: settings.customHeightPx,
    };
  }

  const widthPx = Math.max(1, Math.round(rect.width * settings.scaleFactor));
  const heightPx = Math.max(1, Math.round(rect.height * settings.scaleFactor));

  if (settings.format === 'webp') {
    const canvas = await toCanvas(element, commonOptions);
    const dataUrl = canvas.toDataURL('image/webp', 0.92);
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
      backgroundColor: '#ffffff',
      quality: 0.92,
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
