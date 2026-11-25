import { GENERATOR_MAP } from '@/core/registry/generators';
import type { Project } from '@/core/types';

export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_JSON_IMPORT_BYTES = 2 * 1024 * 1024; // 2 MB

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

const SAFE_DATA_IMAGE_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[a-z0-9+/=\s]+$/i;

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isSafeImageDataUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return SAFE_DATA_IMAGE_RE.test(value.trim());
}

async function readFileHeaderBytes(blob: Blob): Promise<Uint8Array> {
  if (typeof blob.arrayBuffer === 'function') {
    return new Uint8Array(await blob.arrayBuffer());
  }
  return await new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Unable to inspect image header bytes.'));
      }
    };
    reader.onerror = () => reject(new Error('Unable to inspect image header bytes.'));
    reader.readAsArrayBuffer(blob);
  });
}

export async function validateImageFileUpload(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error(
      `Unsupported image format "${file.type || 'unknown'}". Allowed formats: PNG, JPG, WebP, or GIF.`
    );
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_UPLOAD_BYTES) {
    throw new Error(
      `Image file size must be under ${Math.round(MAX_IMAGE_UPLOAD_BYTES / (1024 * 1024))} MB.`
    );
  }

  // Verify magic bytes for PNG, JPEG, GIF, and WebP (RIFF....WEBP)
  const header = await readFileHeaderBytes(file.slice(0, 12));
  const isPng =
    header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
  const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
  const isGif = header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46;
  const isWebp =
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50;

  if (!isPng && !isJpeg && !isGif && !isWebp) {
    throw new Error('File content does not match a valid PNG, JPG, GIF, or WebP image.');
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string' && isSafeImageDataUrl(reader.result)) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read validated image payload.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

export function sanitizeImportedProject(rawText: string): Project {
  if (rawText.length > MAX_JSON_IMPORT_BYTES) {
    throw new Error('Project file exceeds the 2 MB import size limit.');
  }

  const parsed = JSON.parse(rawText, (key, val) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return undefined;
    }
    return val;
  }) as Partial<Project>;

  if (
    !parsed ||
    typeof parsed !== 'object' ||
    typeof parsed.platformId !== 'string' ||
    !(parsed.platformId in GENERATOR_MAP) ||
    !Array.isArray(parsed.conversations) ||
    parsed.conversations.length === 0 ||
    !Array.isArray(parsed.cast)
  ) {
    throw new Error(
      'Invalid .chatforge.json bundle: missing valid platformId, conversations, or cast.'
    );
  }

  // Strip any unsafe image URLs inside imported participants or attachments
  parsed.cast = parsed.cast.map((p) => ({
    ...p,
    avatarDataUrl: isSafeImageDataUrl(p.avatarDataUrl) ? p.avatarDataUrl : undefined,
  }));

  parsed.conversations = parsed.conversations.map((conv) => ({
    ...conv,
    postMeta: conv.postMeta
      ? {
          ...conv.postMeta,
          imageDataUrl: isSafeImageDataUrl(conv.postMeta.imageDataUrl)
            ? conv.postMeta.imageDataUrl
            : undefined,
        }
      : undefined,
    messages: Array.isArray(conv.messages)
      ? conv.messages.map((msg) => ({
          ...msg,
          attachments: Array.isArray(msg.attachments)
            ? msg.attachments.map((att) => ({
                ...att,
                previewDataUrl: isSafeImageDataUrl(att.previewDataUrl)
                  ? att.previewDataUrl
                  : undefined,
              }))
            : [],
        }))
      : [],
  }));

  return parsed as Project;
}
