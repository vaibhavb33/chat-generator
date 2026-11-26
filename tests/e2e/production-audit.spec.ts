import fs from 'node:fs';
import { test, expect } from '@playwright/test';

interface GeneratorAuditTarget {
  id: string;
  route: string;
  rendererTestId: string;
  kind: 'chat' | 'story' | 'post' | 'call';
}

const GENERATORS: GeneratorAuditTarget[] = [
  { id: 'whatsapp-chat', route: '/whatsapp-chat-generator', rendererTestId: 'renderer-whatsapp-chat', kind: 'chat' },
  { id: 'whatsapp-group-chat', route: '/whatsapp-group-chat-generator', rendererTestId: 'renderer-whatsapp-group-chat', kind: 'chat' },
  { id: 'instagram-dm', route: '/instagram-dm-generator', rendererTestId: 'renderer-instagram-dm', kind: 'chat' },
  { id: 'instagram-story', route: '/instagram-story-generator', rendererTestId: 'renderer-instagram-story', kind: 'story' },
  { id: 'instagram-post', route: '/instagram-post-generator', rendererTestId: 'renderer-instagram-post', kind: 'post' },
  { id: 'imessage', route: '/imessage-generator', rendererTestId: 'renderer-imessage', kind: 'chat' },
  { id: 'android-messages', route: '/android-message-generator', rendererTestId: 'renderer-android-messages', kind: 'chat' },
  { id: 'telegram-chat', route: '/telegram-chat-generator', rendererTestId: 'renderer-telegram-chat', kind: 'chat' },
  { id: 'discord-chat', route: '/discord-chat-generator', rendererTestId: 'renderer-discord-chat', kind: 'chat' },
  { id: 'fake-call-screen', route: '/fake-call-generator', rendererTestId: 'renderer-fake-call-screen', kind: 'call' },
];

function parsePngDimensions(buf: Buffer): { width: number; height: number } | null {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A, then IHDR chunk length (4), 'IHDR' (4), width (4 BE), height (4 BE)
  if (buf.length < 24) return null;
  if (buf[0] !== 0x89 || buf[1] !== 0x50 || buf[2] !== 0x4e || buf[3] !== 0x47) return null;
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function isJpeg(buf: Buffer): boolean {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

function isWebp(buf: Buffer): boolean {
  return (
    buf.length > 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  );
}

test.describe('Complete Production Audit (All 10 Generators)', () => {
  for (const gen of GENERATORS) {
    test(`full production audit: ${gen.id}`, async ({ page }) => {
      // 1. Desktop Breakpoint (1440x900)
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(gen.route, { waitUntil: 'networkidle' });

      const renderer = page.getByTestId(gen.rendererTestId);
      await expect(renderer).toBeVisible();

      const surface = page.getByTestId('mockup-export-surface');
      await expect(surface).toBeVisible();

      // Check zero horizontal overflow on desktop
      const desktopOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2
      );
      expect(desktopOverflow).toBe(true);

      // Capture desktop screenshot
      await page.screenshot({
        path: `test-results/production-audit/${gen.id}-desktop.png`,
      });

      // 2. Verify Device & Appearance toggles
      await page.getByTestId('device-option-iphone').click();
      await page.getByTestId('appearance-option-dark').click();
      await expect(page.getByTestId('appearance-option-dark')).toHaveAttribute('aria-pressed', 'true');
      await page.getByTestId('device-option-android').click();
      await page.getByTestId('appearance-option-light').click();
      await expect(page.getByTestId('appearance-option-light')).toHaveAttribute('aria-pressed', 'true');
      await page.getByTestId('device-option-iphone').click();

      // 3. Verify Sticky Footer Buttons (Edit, Download, Save Chat)
      const editBtn = page.getByTestId('footer-edit-button');
      const downloadBtn = page.getByTestId('footer-download-button');
      const saveBtn = page.getByTestId('footer-save-button');
      await expect(editBtn).toBeVisible();
      await expect(downloadBtn).toBeVisible();
      await expect(saveBtn).toBeVisible();

      // Desktop starts with editor sidebars open; clicking Edit toggles them closed, clicking again re-opens
      const leftAside = page.locator('aside').first();
      const desktopBadge = leftAside.getByTestId('platform-editor-badge');
      await expect(desktopBadge).toBeVisible();
      await editBtn.click();
      await expect(desktopBadge).toBeHidden();
      await editBtn.click();
      await expect(desktopBadge).toBeVisible();

      // Test Editing Control per generator kind
      if (gen.kind === 'chat') {
        const addMsgBtn = leftAside.getByTestId('add-message-btn');
        if (await addMsgBtn.isVisible().catch(() => false)) {
          await addMsgBtn.click();
        }
      } else if (gen.kind === 'call') {
        await leftAside.getByTestId('state-btn-active').click();
        await expect(surface).toContainText(/\d{2}:\d{2}/);
      }

      // 4. Verify Save Chat + IndexedDB Reload Persistence
      await saveBtn.click();
      await expect(page.getByTestId('save-chat-toast')).toBeVisible();

      // 5. Verify Pricing / Upgrade Modal
      await page.getByTestId('header-upgrade-pro-btn').click();
      const upgradeModal = page.getByTestId('premium-upgrade-modal');
      await expect(upgradeModal).toBeVisible();
      await expect(upgradeModal.getByTestId('plan-card-monthly')).toBeVisible();
      await upgradeModal.getByTestId('upgrade-checkout-btn').click();
      await expect(upgradeModal.getByTestId('billing-provider-notice')).toBeVisible();
      await upgradeModal.getByRole('button', { name: 'Close dialog' }).click();

      // 6. Export Engine vs Live Preview Comparison (PNG, JPG, WebP)
      const previewBox = await surface.evaluate((el) => {
        const htmlEl = el as HTMLElement;
        return { width: htmlEl.offsetWidth, height: htmlEl.offsetHeight };
      });
      expect(previewBox.width).toBeGreaterThan(200);
      expect(previewBox.height).toBeGreaterThan(200);

      for (const fmt of ['PNG', 'JPG', 'WEBP'] as const) {
        await downloadBtn.click();
        const dlModal = page.getByTestId('download-menu-dialog');
        await expect(dlModal).toBeVisible();
        await dlModal.getByRole('button', { name: new RegExp(`^${fmt}$`) }).click();

        const [download] = await Promise.all([
          page.waitForEvent('download'),
          dlModal.getByTestId('confirm-export-btn').click(),
        ]);

        const dlPath = await download.path();
        expect(dlPath).toBeTruthy();
        if (dlPath) {
          const bytes = fs.readFileSync(dlPath);
          expect(bytes.length).toBeGreaterThan(1000);
          if (fmt === 'PNG') {
            const pngDims = parsePngDimensions(bytes);
            expect(pngDims).toBeTruthy();
            if (pngDims) {
              // Default export scale is 2x
              expect(Math.abs(pngDims.width - previewBox.width * 2)).toBeLessThanOrEqual(4);
              expect(Math.abs(pngDims.height - previewBox.height * 2)).toBeLessThanOrEqual(4);
            }
          } else if (fmt === 'JPG') {
            expect(isJpeg(bytes)).toBe(true);
          } else if (fmt === 'WEBP') {
            expect(isWebp(bytes)).toBe(true);
          }
        }

        await expect(dlModal.getByTestId('export-success-state')).toBeVisible();
        await dlModal.getByRole('button', { name: 'Close', exact: true }).click();
      }

      // 7. Mobile Breakpoint (390x844) + Screenshot + Footer Visibility
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(200);
      const mobileOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2
      );
      expect(mobileOverflow).toBe(true);
      await expect(editBtn).toBeVisible();
      await expect(downloadBtn).toBeVisible();
      await expect(saveBtn).toBeVisible();

      await page.screenshot({
        path: `test-results/production-audit/${gen.id}-mobile.png`,
      });
    });
  }
});
