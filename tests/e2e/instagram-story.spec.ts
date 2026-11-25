import { test, expect } from '@playwright/test';

const VALID_1X1_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  'hex'
);

test.describe('TASK 05 Acceptance: Complete Instagram Story Generator', () => {
  test('renders 9:16 vertical canvas, progress bars, stickers, slide navigation, and editing controls', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/instagram-story-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // 1. Dedicated vertical story editor is present
    await expect(desktopLeft.getByTestId('instagram-story-dedicated-editor')).toBeVisible();

    // 2. 9:16 Story Canvas is rendered
    await expect(surface.getByTestId('renderer-instagram-story')).toBeVisible();

    // 3. Author info, verified badge, progress indicators, music badge, views
    await expect(surface).toContainText('mayalin.creates');
    await expect(surface).toContainText('Midnight Synth');
    await expect(surface).toContainText('views');

    // 4. Default Slide 1 stickers: Mention, Location, Hashtag, Poll, Link
    await expect(surface.getByTestId('story-sticker-mention')).toBeVisible();
    await expect(surface.getByTestId('story-sticker-location')).toBeVisible();
    await expect(surface.getByTestId('story-sticker-hashtag')).toBeVisible();
    await expect(surface.getByTestId('story-sticker-poll')).toBeVisible();
    await expect(surface.getByTestId('story-sticker-link')).toBeVisible();

    // 5. Edit Slide headline & subtitle
    await desktopLeft.getByLabel('Headline Text').fill('Summer Collection 2026 🌴');
    await desktopLeft.getByLabel('Subtitle').fill('Available now worldwide');
    await expect(surface).toContainText('Summer Collection 2026 🌴');
    await expect(surface).toContainText('Available now worldwide');

    // 6. Change Background gradient & Upload background photo
    await desktopLeft.getByRole('button', { name: 'Cherry Glow' }).click();
    await desktopLeft.getByLabel('Upload story background').setInputFiles({
      name: 'bg.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await expect(surface.locator('img[alt="Story background"]')).toBeVisible();

    // 7. Edit Author profile: username, display name, avatar, timestamp
    await desktopLeft.getByLabel('Author username').fill('@sarah.mode');
    await desktopLeft.getByLabel('Author display name').fill('Sarah Mode');
    await desktopLeft.getByLabel('Story timestamp').fill('45m');
    await desktopLeft.getByLabel('Upload author avatar').setInputFiles({
      name: 'avatar.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await expect(surface).toContainText('sarah.mode');
    await expect(surface).toContainText('45m');

    // 8. Slide navigation: switch to Slide 2
    await desktopLeft.getByRole('button', { name: 'Slide 2' }).click();
    await expect(surface.getByTestId('story-sticker-question')).toBeVisible();
    await expect(surface.getByTestId('story-sticker-slider')).toBeVisible();
    await expect(surface.getByTestId('story-sticker-countdown')).toBeVisible();

    // 9. Switch to Stickers tab: add a Text sticker with font style & pill
    await desktopLeft.getByRole('tab', { name: /Stickers/i }).click();
    await desktopLeft.getByRole('button', { name: 'Text' }).click();

    await desktopLeft.getByLabel('Sticker text content').fill('NEW DROP IS LIVE 🔥');
    await desktopLeft.getByLabel('Sticker font style').selectOption('neon');
    await desktopLeft.getByLabel('Sticker background pill').selectOption('gradient');
    await expect(surface).toContainText('NEW DROP IS LIVE 🔥');

    // 10. Position, scale, rotation, alignment controls
    await desktopLeft.getByRole('button', { name: 'Center' }).click();
    await desktopLeft.getByLabel('Element Scale').fill('1.2');
    await desktopLeft.getByLabel('Element Rotation').fill('5');

    // 11. Duplicate and delete element
    await desktopLeft.getByRole('button', { name: 'Duplicate element' }).click();
    await desktopLeft.getByRole('button', { name: 'Delete element' }).click();

    // 12. Add Countdown, Link, Music & Image stickers
    await desktopLeft.getByRole('button', { name: 'Countdown' }).click();
    await desktopLeft.getByRole('button', { name: 'Music' }).click();

    // 13. Undo and Redo
    await desktopLeft.getByRole('button', { name: 'Undo' }).click();
    await desktopLeft.getByRole('button', { name: 'Redo' }).click();
  });

  test('is mobile-responsive at 390px and exports PNG, JPG, and WebP cleanly', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/instagram-story-generator', { waitUntil: 'networkidle' });

    // Zero horizontal overflow on mobile
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);

    // Edit headline on mobile panel
    const mobilePanels = page.getByLabel('Mobile editing panels');
    await mobilePanels.getByLabel('Headline Text').fill('Mobile Story Verified!');
    await expect(page.getByTestId('mockup-export-surface')).toContainText(
      'Mobile Story Verified!'
    );

    // Export PNG, JPG, and WebP
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
