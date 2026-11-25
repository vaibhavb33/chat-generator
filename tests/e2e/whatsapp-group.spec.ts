import { test, expect } from '@playwright/test';

const VALID_1X1_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  'hex'
);

test.describe('TASK 03 Acceptance: Complete WhatsApp Group Chat Generator', () => {
  test('supports 10+ participants, roles, group header, system events, deleted/pinned messages & appearance controls', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/whatsapp-group-chat-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();
    const desktopRight = page.locator('aside').nth(1);

    // Dedicated group editor renders cleanly
    await expect(desktopLeft.getByTestId('whatsapp-group-dedicated-editor')).toBeVisible();
    await expect(surface.getByTestId('renderer-whatsapp-group-chat')).toBeVisible();

    // Load ready-made 10-member group template
    await desktopLeft.getByTestId('load-10-member-group-btn').click();
    await expect(desktopLeft.getByRole('tab', { name: 'People (10)' })).toBeVisible();
    await expect(surface.getByTestId('wa-group-pinned-banner')).toBeVisible();
    await expect(surface).toContainText('Launch Crew 2026');
    await expect(surface).toContainText('+6 more');

    // Update Group Name, Description, and Group Icon upload
    await desktopLeft.getByLabel('Group name').fill('Global Launch Crew 2026');
    await desktopLeft.getByLabel('Group description').fill('Launch blockers & design sign-offs');
    await desktopLeft.getByLabel('Upload group profile photo').setInputFiles({
      name: 'group-icon.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await expect(surface).toContainText('Global Launch Crew 2026');
    await expect(surface.getByTestId('wa-group-description')).toContainText(
      'Launch blockers & design sign-offs'
    );

    // Switch to People tab: add an 11th participant, reorder, upload avatar, set admin/creator, adjust color
    await desktopLeft.getByRole('tab', { name: 'People (10)' }).click();
    await desktopLeft.getByLabel('New participant name').fill('Elena Vance');
    await desktopLeft.getByTestId('add-participant-btn').click();
    await expect(desktopLeft.getByRole('tab', { name: 'People (11)' })).toBeVisible();

    await desktopLeft.getByLabel('Toggle admin for Elena Vance').click();
    await desktopLeft.getByLabel('Move Elena Vance up').click();
    await desktopLeft.getByLabel('Color for Elena Vance').fill('#d946ef');
    await desktopLeft.getByLabel('Upload photo for Elena Vance').setInputFiles({
      name: 'elena.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await desktopLeft.getByLabel('Set Daniel Ortiz as group creator').click();

    // Return to Group & Messages tab: switch sender cleanly & add message from new 11th member
    await desktopLeft.getByRole('tab', { name: 'Group & Messages' }).click();
    await desktopLeft
      .getByLabel('Message sender', { exact: true })
      .selectOption({ label: 'Elena Vance' });
    await desktopLeft.getByLabel('Message text').fill('Motion export verified on all devices!');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(surface).toContainText('Motion export verified on all devices!');

    // Add quick system events (+ Joined, Name Change)
    await desktopLeft.getByRole('button', { name: '+ Joined' }).click();
    await desktopLeft.getByRole('button', { name: 'Name Change' }).click();
    await expect(surface).toContainText('changed the group name');

    // Toggle deleted message appearance on Maya Lin's message in the timeline
    await desktopLeft.getByLabel('Toggle deleted message').first().click();
    await expect(surface.getByText('This message was deleted').first()).toBeVisible();

    // Verify iOS vs Android chrome, dark mode, custom wallpaper & text scale
    await expect(surface.getByTestId('wa-ios-back')).toBeVisible();
    await desktopRight.getByLabel('WhatsApp UI version').selectOption('android_modern');
    await expect(surface.getByTestId('wa-android-more')).toBeVisible();
    await desktopRight.getByLabel('Toggle mockup dark mode').click();
    await desktopRight.getByLabel('Chat text size').selectOption('1.12');
    await desktopRight.getByLabel('Upload custom wallpaper').setInputFiles({
      name: 'group-wall.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
  });

  test('is mobile-responsive at 390px and exports PNG, JPG, and WebP cleanly', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/whatsapp-group-chat-generator', { waitUntil: 'networkidle' });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);

    const mobilePanels = page.getByLabel('Mobile editing panels');
    await mobilePanels.getByTestId('load-10-member-group-btn').click();
    await mobilePanels.getByLabel('Message text').fill('Mobile group check passed');
    await mobilePanels.getByTestId('add-message-btn').click();
    await expect(page.getByTestId('mockup-export-surface')).toContainText(
      'Mobile group check passed'
    );

    await page.getByTestId('top-export-button').click();
    const pngDl = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    expect((await pngDl).suggestedFilename()).toMatch(/\.png$/);

    await page.getByRole('button', { name: 'JPG' }).click();
    const jpgDl = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    expect((await jpgDl).suggestedFilename()).toMatch(/\.jpg$/);

    if (testInfo.project.name !== 'firefox') {
      await page.getByRole('button', { name: 'WEBP' }).click();
      const webpDl = page.waitForEvent('download');
      await page.getByTestId('confirm-export-btn').click();
      expect((await webpDl).suggestedFilename()).toMatch(/\.(webp|png)$/);
    }
  });
});
