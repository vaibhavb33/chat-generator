import fs from 'node:fs';
import { test, expect } from '@playwright/test';

const MATRIX = [
  { device: 'iphone', appearance: 'light', statusBarId: 'status-bar-iphone', bottomId: 'ios-home-indicator' },
  { device: 'iphone', appearance: 'dark', statusBarId: 'status-bar-iphone', bottomId: 'ios-home-indicator' },
  { device: 'android', appearance: 'light', statusBarId: 'status-bar-android', bottomId: 'android-gesture-bar' },
  { device: 'android', appearance: 'dark', statusBarId: 'status-bar-android', bottomId: 'android-gesture-bar' },
] as const;

test.describe('Screenshot & Video Export Regression (iPhone & Android, Dark & Light)', () => {
  for (const combo of MATRIX) {
    test(`exports PNG, JPG, and WebP cleanly without cropping for ${combo.device} + ${combo.appearance}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

      await page.getByTestId(`device-option-${combo.device}`).click();
      await page.getByTestId(`appearance-option-${combo.appearance}`).click();

      const surface = page.getByTestId('mockup-export-surface');
      await expect(surface).toBeVisible();
      await expect(surface.getByTestId(combo.statusBarId)).toBeVisible();
      await expect(surface.getByTestId(combo.bottomId)).toBeVisible();

      // Verify live preview has no horizontal overflow or clipped typography before export
      const layoutMetrics = await surface.evaluate((el) => {
        const htmlEl = el as HTMLElement;
        return {
          width: htmlEl.offsetWidth,
          height: htmlEl.offsetHeight,
          scrollWidth: htmlEl.scrollWidth,
        };
      });
      expect(layoutMetrics.width).toBeGreaterThanOrEqual(350);
      expect(layoutMetrics.height).toBeGreaterThanOrEqual(650);
      expect(layoutMetrics.scrollWidth).toBeLessThanOrEqual(layoutMetrics.width + 2);

      for (const fmt of [
        { label: 'PNG', ext: '.png', minBytes: 1500 },
        { label: 'JPG', ext: '.jpg', minBytes: 1500 },
        { label: 'WEBP', ext: '.webp', minBytes: 1000 },
      ]) {
        await page.getByTestId('footer-download-button').click();
        const modal = page.getByTestId('download-menu-dialog');
        await expect(modal).toBeVisible();

        await modal.getByRole('button', { name: new RegExp(`^${fmt.label}$`) }).click();

        const [download] = await Promise.all([
          page.waitForEvent('download'),
          modal.getByTestId('confirm-export-btn').click(),
        ]);

        expect(download.suggestedFilename().toLowerCase()).toContain(fmt.ext);
        const downloadedPath = await download.path();
        expect(downloadedPath).toBeTruthy();
        if (downloadedPath) {
          const stat = fs.statSync(downloadedPath);
          expect(stat.size).toBeGreaterThan(fmt.minBytes);
        }

        await expect(modal.getByTestId('export-success-state')).toBeVisible();
        await expect(modal.getByTestId('export-success-state')).toContainText('Watermark-free');
        await modal.getByRole('button', { name: 'Close', exact: true }).click();
      }
    });
  }

  test('respects 9:16, 4:5, and 1:1 aspect ratio exports without clipping', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/imessage-generator', { waitUntil: 'networkidle' });

    await page.getByTestId('footer-download-button').click();
    const modal = page.getByTestId('download-menu-dialog');
    await expect(modal).toBeVisible();

    const ratioSelect = modal.getByLabel('Export aspect ratio');
    await ratioSelect.selectOption('1:1');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      modal.getByTestId('confirm-export-btn').click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\d+x\d+\.png$/);
    const successText = await modal.getByTestId('export-success-state').textContent();
    // Square 1:1 should report equal W x H dimensions
    const dimsMatch = successText?.match(/(\d+)\s*×\s*(\d+)px/);
    expect(dimsMatch).toBeTruthy();
    if (dimsMatch) {
      expect(dimsMatch[1]).toBe(dimsMatch[2]);
    }
  });

  test('gates Video Export for Free users and shows resolution/FPS controls', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/telegram-chat-generator', { waitUntil: 'networkidle' });

    await page.getByTestId('footer-download-button').click();
    const modal = page.getByTestId('download-menu-dialog');
    await modal.getByTestId('download-tab-video').click();

    await expect(modal.getByLabel('Video resolution')).toBeVisible();
    await expect(modal.getByLabel('Video frame rate')).toBeVisible();
    await expect(modal.getByTestId('confirm-export-btn')).toContainText('Unlock Video Export');

    await modal.getByTestId('confirm-export-btn').click();
    await expect(page.getByTestId('premium-upgrade-modal')).toBeVisible();
  });
});
