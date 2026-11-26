import { test, expect } from '@playwright/test';

test.describe('TASK 09 Acceptance: Telegram Chat Generator (/telegram-chat-generator)', () => {
  test('renders authentic Telegram UI with pinned bar, header, voice note, document, receipts, and reactions', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/telegram-chat-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // 1. Dedicated editor badge and container
    await expect(desktopLeft.getByTestId('telegram-dedicated-editor')).toBeVisible();
    await expect(desktopLeft.getByTestId('platform-editor-badge')).toContainText(
      'Telegram Messenger Studio'
    );
    await expect(surface.getByTestId('renderer-telegram-chat')).toBeVisible();

    // 2. Telegram Header & Actions
    const header = surface.getByTestId('telegram-header');
    await expect(header).toBeVisible();
    await expect(surface.getByTestId('telegram-title')).toBeVisible();
    await expect(surface.getByTestId('telegram-subtitle')).toBeVisible();

    // 3. Telegram Pinned Message Bar
    await expect(surface.getByTestId('telegram-pinned-bar')).toBeVisible();
    await expect(surface.getByTestId('telegram-pinned-bar')).toContainText('Pinned Message');

    // 4. Voice Note Waveform & Document Card
    await expect(surface.getByTestId('telegram-voice-note')).toBeVisible();
    await expect(surface.getByTestId('telegram-document-card')).toBeVisible();

    // 5. Edited Label & Read Receipts (✓✓)
    await expect(surface.getByTestId('telegram-edited-label')).toBeVisible();
    await expect(surface.getByTestId('telegram-read-receipt').first()).toBeVisible();

    // 6. Floating Reactions Pill
    await expect(surface.getByTestId('telegram-reactions').first()).toBeVisible();

    // 7. Message Composer
    await expect(surface.getByTestId('telegram-message-composer')).toBeVisible();
  });

  test('supports group mode with multi-participant avatars, sender names, admin badges, and preset switching', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/telegram-chat-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // Switch to Presets tab
    await desktopLeft.getByRole('tab', { name: 'Presets' }).click();

    // Load Tech Community Supergroup scenario
    await page.getByTestId('apply-template-tech_supergroup').click();

    // Verify Group layout
    await expect(surface.getByTestId('telegram-title')).toContainText('ChatForge Devs & Creators');
    await expect(surface.getByTestId('telegram-subtitle')).toContainText('1,420 members, 84 online');
    await expect(surface.getByTestId('telegram-pinned-bar')).toContainText('Pinned Announcement');
    await expect(surface.getByTestId('telegram-document-card')).toBeVisible();

    // Load Secret Encrypted Chat scenario with stickers
    await page.getByTestId('apply-template-secret_encrypted_chat').click();
    await expect(surface.getByTestId('telegram-title')).toContainText('Daniel Vance');
    await expect(surface.getByTestId('telegram-sticker')).toBeVisible();
  });

  test('responsive mobile preview at 390px viewport and export actions', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/telegram-chat-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    await expect(surface).toBeVisible();
    await expect(surface.getByTestId('renderer-telegram-chat')).toBeVisible();
    await expect(surface.getByTestId('telegram-header')).toBeVisible();

    // Test Export Modal Trigger
    const exportButton = page.getByTestId('footer-download-button');
    if (await exportButton.isVisible()) {
      await exportButton.click();
      await expect(page.getByTestId('confirm-export-btn')).toBeVisible();
    }
  });
});
