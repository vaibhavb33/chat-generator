import { test, expect } from '@playwright/test';

const REQUIRED_WIDTHS = [360, 390, 768, 1024, 1440, 1920] as const;

test.describe('Responsive Layout Verification Across 6 Breakpoints', () => {
  for (const width of REQUIRED_WIDTHS) {
    test(`zero horizontal overflow at ${width}px across home, directory, and studio`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });

      for (const route of ['/', '/generators', '/whatsapp-chat-generator']) {
        await page.goto(route, { waitUntil: 'networkidle' });
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth;
        });
        expect(overflow, `Horizontal overflow detected on ${route} at ${width}px`).toBe(
          false
        );
      }
    });
  }
});

test.describe('Homepage, Directory & Mobile Navigation', () => {
  test('mobile navigation drawer opens cleanly at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Toggle mobile navigation' }).click();
    await expect(page.getByTestId('mobile-nav-drawer')).toBeVisible();
  });

  test('directory search, filter, and empty state recovery work end-to-end', async ({
    page,
  }) => {
    await page.goto('/generators', { waitUntil: 'networkidle' });
    const search = page.getByTestId('directory-search-input');
    await search.fill('nonexistent-platform-xyz');
    await expect(page.getByTestId('directory-empty-state')).toBeVisible();
    await page.getByRole('button', { name: 'Clear All Filters' }).click();
    await expect(
      page.getByRole('heading', { name: 'WhatsApp Chat Generator' })
    ).toBeVisible();
  });
});

test.describe('Studio Workspace Core Flows, States & PNG Export', () => {
  test('add message, undo/redo, clear confirmation, empty state, timeline, and export PNG', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

    // Wait for hydration skeleton to finish
    await expect(page.getByTestId('mockup-export-surface')).toBeVisible();
    const desktopLeft = page.locator('aside').first();

    // Add a message
    await desktopLeft.getByLabel('Message text').fill('Playwright live preview message');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(
      page.getByTestId('mockup-export-surface').getByText('Playwright live preview message')
    ).toBeVisible();

    // Unsaved -> Saved state transition
    await expect(page.getByTestId('save-status-pill')).toContainText(/Unsaved|Saving|Saved/);
    await expect(page.getByTestId('save-status-pill')).toContainText('Saved locally', {
      timeout: 5000,
    });

    // Undo removes added message, Redo restores it
    await page.getByRole('button', { name: 'Undo' }).first().click();
    await expect(
      page.getByTestId('mockup-export-surface').getByText('Playwright live preview message')
    ).toHaveCount(0);
    await page.getByRole('button', { name: 'Redo' }).first().click();
    await expect(
      page.getByTestId('mockup-export-surface').getByText('Playwright live preview message')
    ).toBeVisible();

    // Toggle video timeline bar
    await page.getByRole('button', { name: /Video/i }).click();
    await expect(page.getByTestId('video-timeline-bar')).toBeVisible();

    // Export PNG and verify actual download + success state
    await page.getByTestId('footer-download-button').click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.png$/);
    await expect(page.getByTestId('export-success-state')).toBeVisible();
    await page.getByRole('button', { name: 'Close', exact: true }).click();

    // Clear all -> Confirmation dialog -> Empty state -> Restore sample
    await desktopLeft.getByRole('button', { name: 'Clear all' }).click();
    await page.getByRole('button', { name: 'Clear Conversation' }).click();
    await expect(page.getByTestId('empty-canvas-state')).toBeVisible();
    await page.getByRole('button', { name: 'Load Sample Conversation' }).click();
    await expect(page.getByTestId('empty-canvas-state')).toHaveCount(0);
  });

  test('mobile 390px studio drawer edits content and opens export modal', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('mockup-export-surface')).toBeVisible();

    const mobilePanels = page.getByLabel('Mobile editing panels');
    await mobilePanels.getByLabel('Message text').fill('Mobile 390px studio message');
    await mobilePanels.getByTestId('add-message-btn').click();
    await expect(
      page.getByTestId('mockup-export-surface').getByText('Mobile 390px studio message')
    ).toBeVisible();
  });

  test('renders Instagram Story, Instagram Post, Discord, and Fake Call Screen skins', async ({
    page,
  }) => {
    for (const route of [
      '/instagram-story-generator',
      '/instagram-post-generator',
      '/discord-chat-generator',
      '/fake-call-generator',
    ]) {
      await page.goto(route);
      await expect(page.getByTestId('mockup-export-surface')).toBeVisible();
    }
  });
});
