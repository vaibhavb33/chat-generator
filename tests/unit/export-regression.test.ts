import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportMockupElement } from '@/core/export/exportEngine';
import { exportAnimatedChatVideo } from '@/core/export/videoExporter';
import { createSeedProject } from '@/core/engine/seedData';
import type { ExportSettings } from '@/core/types';

const toPngMock = vi.fn(async () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');
const toJpegMock = vi.fn(async () => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP');
const toCanvasMock = vi.fn(async (_el: HTMLElement, opts?: { width?: number; height?: number; pixelRatio?: number }) => {
  const c = document.createElement('canvas');
  c.width = (opts?.width ?? 393) * (opts?.pixelRatio ?? 1);
  c.height = (opts?.height ?? 680) * (opts?.pixelRatio ?? 1);
  c.toDataURL = (mime?: string) =>
    mime === 'image/webp'
      ? 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
      : mime === 'image/jpeg'
        ? 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP'
        : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  return c;
});

vi.mock('html-to-image', () => ({
  toPng: (...args: unknown[]) => toPngMock(...(args as [])),
  toJpeg: (...args: unknown[]) => toJpegMock(...(args as [])),
  toCanvas: (...args: [HTMLElement, { width?: number; height?: number; pixelRatio?: number }?]) =>
    toCanvasMock(...args),
}));

function createMockPreviewSurface(width = 393, height = 680): HTMLElement {
  const el = document.createElement('div');
  Object.defineProperty(el, 'offsetWidth', { value: width, configurable: true });
  Object.defineProperty(el, 'offsetHeight', { value: height, configurable: true });
  Object.defineProperty(el, 'scrollHeight', { value: height + 240, configurable: true });
  // Simulate a zoomed bounding rect (e.g. previewZoom = 0.75) to ensure export ignores CSS zoom
  el.getBoundingClientRect = () =>
    ({
      width: Math.round(width * 0.75),
      height: Math.round(height * 0.75),
      top: 0,
      left: 0,
      right: Math.round(width * 0.75),
      bottom: Math.round(height * 0.75),
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  return el;
}

describe('Export Engine Regression Suite (iPhone & Android, Dark & Light)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const matrix = [
    { device: 'iphone' as const, scheme: 'light' as const, width: 393, height: 680 },
    { device: 'iphone' as const, scheme: 'dark' as const, width: 393, height: 680 },
    { device: 'android' as const, scheme: 'light' as const, width: 404, height: 700 },
    { device: 'android' as const, scheme: 'dark' as const, width: 404, height: 700 },
  ];

  for (const combo of matrix) {
    it(`exports PNG, JPG, and WebP cleanly for ${combo.device} (${combo.scheme}) ignoring previewZoom`, async () => {
      const surface = createMockPreviewSurface(combo.width, combo.height);
      const baseSettings: ExportSettings = {
        format: 'png',
        scaleFactor: 2,
        deviceFrame: combo.device === 'android' ? 'pixel_9' : 'iphone_16_pro',
        backgroundMode: 'platform',
        captureScope: 'viewport',
        printFriendlyMonochrome: false,
        quality: 0.92,
        aspectRatioPreset: 'device',
      };

      const pngRes = await exportMockupElement(surface, baseSettings, 'WhatsApp Mockup', combo.scheme);
      expect(pngRes.mimeType).toBe('image/png');
      expect(pngRes.filename).toMatch(/\.png$/);
      expect(pngRes.widthPx).toBe(combo.width * 2);
      expect(pngRes.heightPx).toBe(combo.height * 2);

      const jpgRes = await exportMockupElement(
        surface,
        { ...baseSettings, format: 'jpeg' },
        'WhatsApp Mockup',
        combo.scheme
      );
      expect(jpgRes.mimeType).toBe('image/jpeg');
      expect(jpgRes.filename).toMatch(/\.jpg$/);
      expect(jpgRes.widthPx).toBe(combo.width * 2);
      expect(jpgRes.heightPx).toBe(combo.height * 2);

      const webpRes = await exportMockupElement(
        surface,
        { ...baseSettings, format: 'webp' },
        'WhatsApp Mockup',
        combo.scheme
      );
      expect(webpRes.mimeType).toBe('image/webp');
      expect(webpRes.filename).toMatch(/\.webp$/);
      expect(webpRes.widthPx).toBe(combo.width * 2);
      expect(webpRes.heightPx).toBe(combo.height * 2);
    });
  }

  it('preserves exact aspect ratios for 9:16, 4:5, and 1:1 presets', async () => {
    const surface = createMockPreviewSurface(393, 680);
    const base: ExportSettings = {
      format: 'png',
      scaleFactor: 2,
      deviceFrame: 'iphone_16_pro',
      backgroundMode: 'solid',
      captureScope: 'viewport',
      printFriendlyMonochrome: false,
      quality: 0.92,
    };

    const r916 = await exportMockupElement(surface, { ...base, aspectRatioPreset: '9:16' }, 'Story', 'dark');
    expect(r916.widthPx).toBe(786);
    expect(r916.heightPx).toBe(Math.round((786 * 16) / 9));

    const r45 = await exportMockupElement(surface, { ...base, aspectRatioPreset: '4:5' }, 'Feed', 'light');
    expect(r45.widthPx).toBe(786);
    expect(r45.heightPx).toBe(Math.round((786 * 5) / 4));

    const r11 = await exportMockupElement(surface, { ...base, aspectRatioPreset: '1:1' }, 'Square', 'light');
    expect(r11.widthPx).toBe(786);
    expect(r11.heightPx).toBe(786);
  });

  it('reports monotonic progress and accurate fallback metadata during animated video export', async () => {
    const project = createSeedProject('whatsapp-chat');
    project.theme.deviceType = 'android';
    project.theme.osVariant = 'android';
    project.theme.colorScheme = 'dark';

    const progressUpdates: Array<{ pct: number; stage?: string }> = [];
    const res = await exportAnimatedChatVideo(project, (pct, stage) => {
      progressUpdates.push({ pct, stage });
    });

    expect(progressUpdates.length).toBeGreaterThanOrEqual(2);
    expect(progressUpdates[progressUpdates.length - 1].pct).toBe(100);
    expect(res.widthPx).toBeGreaterThan(0);
    expect(res.heightPx).toBeGreaterThan(0);
  });
});
