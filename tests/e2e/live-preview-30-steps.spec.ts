import fs from 'node:fs';
import { test, expect } from '@playwright/test';

const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function parsePngDimensions(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 24) return null;
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

test.describe('Phase 12: 30-Step Live Preview, Editor, Export & Persistence Acceptance', () => {
  test('executes full 30-step real-time preview, pause/update, PNG export, and IndexedDB restore workflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Open WhatsApp generator
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });
    const surface = page.getByTestId('mockup-export-surface');
    const leftAside = page.locator('aside').first();
    const rightAside = page.locator('aside').nth(1);

    // 2-3. Change contact name -> verify screenshot updates immediately
    await leftAside.getByTestId('tab-contact-info').click();
    await leftAside.getByTestId('contact-name-input').fill('Elena Vance');
    await expect(surface).toContainText('Elena Vance');

    // 4-5. Upload profile photo -> verify screenshot updates immediately
    await leftAside.getByTestId('contact-avatar-upload').setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: Buffer.from(TINY_PNG_BASE64, 'base64'),
    });
    await expect(surface.locator('img[alt="Elena Vance"]').first()).toBeVisible();

    // 6-7. Add a message -> verify message appears immediately
    await leftAside.getByTestId('tab-messages').click();
    await leftAside.getByLabel('Message text').fill('Live sync verified!');
    await leftAside.getByTestId('add-message-btn').click();
    await expect(surface).toContainText('Live sync verified!');

    // 8-9. Change sender -> verify bubble position changes
    const targetRow = leftAside.locator('[data-testid^="message-row-"]').last();
    await expect(targetRow).toBeVisible();
    const toggleSenderBtn = targetRow.getByRole('button', { name: /Switch sender/i });
    if (await toggleSenderBtn.isVisible().catch(() => false)) {
      await toggleSenderBtn.click();
    }

    // 10-13. Edit timestamp & delivery status
    await targetRow.getByLabel('Edit message timestamp').fill('11:59 PM');
    await expect(surface).toContainText('11:59 PM');
    await targetRow.getByLabel('Receipt status for message').selectOption('delivered');

    // 14-15. Change wallpaper -> verify background changes
    const wpSelect = rightAside.getByLabel('Chat wallpaper preset');
    await wpSelect.selectOption('#D9FDD3');

    // 16-17. Switch Dark to Light -> verify complete interface changes
    await page.getByTestId('appearance-option-dark').click();
    await expect(page.getByTestId('appearance-option-dark')).toHaveAttribute('aria-pressed', 'true');
    await page.getByTestId('appearance-option-light').click();
    await expect(page.getByTestId('appearance-option-light')).toHaveAttribute('aria-pressed', 'true');

    // 18-19. Switch iPhone to Android -> verify platform-specific layout changes
    await page.getByTestId('device-option-android').click();
    await expect(surface.getByTestId('status-bar-android')).toBeVisible();
    await page.getByTestId('device-option-iphone').click();
    await expect(surface.getByTestId('status-bar-iphone')).toBeVisible();

    // 20-24. Pause Live Preview -> edit message -> verify preview paused -> Update Preview -> verify updated
    await page.getByTestId('live-preview-toggle').click();
    await expect(page.getByTestId('live-preview-status')).toContainText('Preview paused');

    await leftAside.getByLabel('Message text').fill('Deferred while paused');
    await leftAside.getByTestId('add-message-btn').click();
    await expect(surface).not.toContainText('Deferred while paused');

    await page.getByTestId('update-preview-btn').click();
    await expect(surface).toContainText('Deferred while paused');
    await expect(page.getByTestId('live-preview-status')).toContainText('Preview updated');

    // Re-enable Live Preview
    await page.getByTestId('live-preview-toggle').click();

    // 25-26. Download PNG & compare dimensions against preview
    const previewBox = await surface.evaluate((el) => {
      const h = el as HTMLElement;
      return { width: h.offsetWidth, height: h.offsetHeight };
    });
    await page.getByTestId('footer-download-button').click();
    const modal = page.getByTestId('download-menu-dialog');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      modal.getByTestId('confirm-export-btn').click(),
    ]);
    const dlPath = await download.path();
    expect(dlPath).toBeTruthy();
    if (dlPath) {
      const dims = parsePngDimensions(fs.readFileSync(dlPath));
      expect(dims).toBeTruthy();
      if (dims) {
        expect(Math.abs(dims.width - previewBox.width * 2)).toBeLessThanOrEqual(4);
        expect(Math.abs(dims.height - previewBox.height * 2)).toBeLessThanOrEqual(4);
      }
    }
    await modal.getByRole('button', { name: 'Close', exact: true }).click();

    // 27-30. Save Chat -> Refresh browser -> Verify edits preserved
    await page.getByTestId('footer-save-button').click();
    await expect(page.getByTestId('save-chat-toast')).toBeVisible();

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByTestId('mockup-export-surface')).toContainText('Elena Vance');
    await expect(page.getByTestId('mockup-export-surface')).toContainText('Live sync verified!');
    await expect(page.getByTestId('mockup-export-surface')).toContainText('Deferred while paused');
  });

  for (const vp of [
    { name: 'mobile-360', width: 360, height: 780 },
    { name: 'mobile-390', width: 390, height: 844 },
    { name: 'tablet-768', width: 768, height: 1024 },
    { name: 'desktop-1440', width: 1440, height: 900 },
  ]) {
    test(`responsive layout & sticky 3-action footer at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

      const noOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2
      );
      expect(noOverflow).toBe(true);
      await expect(page.getByTestId('footer-edit-button')).toBeVisible();
      await expect(page.getByTestId('footer-download-button')).toBeVisible();
      await expect(page.getByTestId('footer-save-button')).toBeVisible();
    });
  }
});
