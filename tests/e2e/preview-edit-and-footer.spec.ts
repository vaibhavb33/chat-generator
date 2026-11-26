import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, isMobileLayout: true },
  { name: 'tablet', width: 768, height: 1024, isMobileLayout: true },
  { name: 'desktop', width: 1440, height: 900, isMobileLayout: false },
] as const;

test.describe('Preview Edit Action & 3-Button Responsive Footer', () => {
  for (const vp of VIEWPORTS) {
    test(`${vp.name} (${vp.width}x${vp.height}): Edit, Download & Save Chat are visible, non-overlapping & preserve state`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

      const footer = page.getByTestId('studio-sticky-footer');
      await expect(footer).toBeVisible();

      // Strictly 3 primary buttons in the footer
      await expect(footer.locator('button')).toHaveCount(3);
      const editBtn = footer.getByTestId('footer-edit-button');
      const downloadBtn = footer.getByTestId('footer-download-button');
      const saveBtn = footer.getByTestId('footer-save-button');

      await expect(editBtn).toBeVisible();
      await expect(downloadBtn).toBeVisible();
      await expect(saveBtn).toBeVisible();

      // Verify all 3 footer buttons sit within viewport and do not overlap each other
      const boxes = await Promise.all([
        editBtn.boundingBox(),
        downloadBtn.boundingBox(),
        saveBtn.boundingBox(),
      ]);
      for (const box of boxes) {
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width);
        expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height);
      }
      expect(boxes[0]!.x + boxes[0]!.width).toBeLessThanOrEqual(boxes[1]!.x + 1);
      expect(boxes[1]!.x + boxes[1]!.width).toBeLessThanOrEqual(boxes[2]!.x + 1);

      // Zero horizontal overflow
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(hasOverflow).toBe(false);

      // Edit content & verify preview state persists when toggling Edit / Preview
      const uniqueMsg = `Footer QA ${vp.name} message`;
      const editorScope = vp.isMobileLayout
        ? page.getByLabel('Mobile editing panels')
        : page.locator('aside').first();

      await editorScope.getByLabel('Message text').fill(uniqueMsg);
      await editorScope.getByTestId('add-message-btn').click();
      await expect(
        page.getByTestId('mockup-export-surface').getByText(uniqueMsg)
      ).toBeVisible();

      if (vp.isMobileLayout) {
        // Toggle mobile drawer closed -> open via footer Edit button, then via preview Edit button
        await editBtn.click();
        await expect(editorScope.getByLabel('Message text')).toHaveCount(0);
        await expect(
          page.getByTestId('mockup-export-surface').getByText(uniqueMsg)
        ).toBeVisible();

        await page.getByTestId('preview-edit-button').click();
        await expect(editorScope.getByLabel('Message text')).toBeVisible();
        await expect(
          page.getByTestId('mockup-export-surface').getByText(uniqueMsg)
        ).toBeVisible();
      } else {
        // Toggle desktop panels off -> on via preview Edit button & footer Edit button
        await page.getByTestId('preview-edit-button').click();
        await expect(page.locator('aside')).toHaveCount(0);
        await expect(
          page.getByTestId('mockup-export-surface').getByText(uniqueMsg)
        ).toBeVisible();

        await editBtn.click();
        await expect(page.locator('aside')).toHaveCount(2);
        await expect(
          page.getByTestId('mockup-export-surface').getByText(uniqueMsg)
        ).toBeVisible();
      }

      // Download opens both Image & Video export options and exports PNG
      await downloadBtn.click();
      const dialog = page.getByTestId('download-menu-dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'PNG', exact: true })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'JPG', exact: true })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'WEBP', exact: true })).toBeVisible();
      await expect(dialog.getByTestId('download-tab-video')).toBeVisible();

      const dlPromise = page.waitForEvent('download');
      await dialog.getByTestId('confirm-export-btn').click();
      expect((await dlPromise).suggestedFilename()).toMatch(/\.png$/);
      await dialog.getByRole('button', { name: 'Close', exact: true }).click();

      // Save Chat saves to IndexedDB and restores after browser refresh
      await saveBtn.click();
      await expect(page.getByTestId('save-chat-toast')).toBeVisible();

      await page.reload({ waitUntil: 'networkidle' });
      await expect(
        page.getByTestId('mockup-export-surface').getByText(uniqueMsg)
      ).toBeVisible();
    });
  }
});
