import { test, expect } from '@playwright/test';

test.describe('TASK 10 Acceptance: Discord Chat Generator (/discord-chat-generator)', () => {
  test('renders authentic Discord desktop server layout with channel header, code block, embed, and reactions', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/discord-chat-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // 1. Dedicated editor badge and container
    await expect(desktopLeft.getByTestId('discord-dedicated-editor')).toBeVisible();
    await expect(desktopLeft.getByTestId('platform-editor-badge')).toContainText(
      'Discord Channel Studio'
    );
    await expect(surface.getByTestId('renderer-discord-chat')).toBeVisible();

    // 2. Server Rail, Channel Sidebar, and Channel Header
    await expect(surface.getByTestId('discord-server-rail')).toBeVisible();
    await expect(surface.getByTestId('discord-channel-sidebar')).toBeVisible();
    await expect(surface.getByTestId('discord-channel-header')).toBeVisible();
    await expect(surface.getByTestId('discord-channel-name')).toBeVisible();
    await expect(surface.getByTestId('discord-channel-topic')).toBeAttached();

    // 3. Rich Discord Embed Card
    await expect(surface.getByTestId('discord-embed').first()).toBeVisible();

    // 4. Code Block
    await expect(surface.getByTestId('discord-code-block').first()).toBeVisible();

    // 5. Discord Mention
    await expect(surface.getByTestId('discord-mention').first()).toBeVisible();

    // 6. Reply Spine Indicator
    await expect(surface.getByTestId('discord-reply-spine').first()).toBeVisible();

    // 7. Reaction Counter Pills
    await expect(surface.getByTestId('discord-reaction-pill').first()).toBeVisible();

    // 8. Member List Sidebar
    await expect(surface.getByTestId('discord-member-list')).toBeVisible();

    // 9. Composer
    await expect(surface.getByTestId('discord-composer')).toBeVisible();
  });

  test('supports preset scenario switching and mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/discord-chat-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // Switch to Presets tab
    await desktopLeft.getByRole('tab', { name: 'Presets' }).click();

    // Load Gaming Guild Raid Tactics
    await page.getByTestId('apply-template-guild_raid_tactics').click();
    await expect(surface.getByTestId('discord-channel-name')).toContainText('raid-tactics');

    // Load Open Source Dev Community
    await page.getByTestId('apply-template-open_source_dev').click();
    await expect(surface.getByTestId('discord-code-block')).toBeVisible();
    await expect(surface.getByTestId('discord-system-message')).toBeVisible();

    // Load Mobile Chat Layout preset
    await page.getByTestId('apply-template-mobile_chat_view').click();
    // On mobile layout, desktop sidebars are hidden
    await expect(surface.getByTestId('discord-server-rail')).not.toBeVisible();
    await expect(surface.getByTestId('discord-member-list')).not.toBeVisible();
  });

  test('responsive mobile preview at 390px viewport and export actions', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/discord-chat-generator', { waitUntil: 'domcontentloaded' });

    const surface = page.getByTestId('mockup-export-surface');
    await expect(surface).toBeVisible();
    await expect(surface.getByTestId('renderer-discord-chat')).toBeVisible();
    await expect(surface.getByTestId('discord-channel-header')).toBeVisible();

    // Test Export Modal Trigger
    const exportButton = page.getByTestId('footer-download-button');
    if (await exportButton.isVisible()) {
      await exportButton.click();
      await expect(page.getByTestId('confirm-export-btn')).toBeVisible();
    }
  });
});
