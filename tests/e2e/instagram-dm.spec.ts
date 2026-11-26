import { test, expect } from '@playwright/test';

const VALID_1X1_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  'hex'
);

test.describe('TASK 04 Acceptance: Instagram DM Generator', () => {
  test('renders realistic IG DM UI with profile card, header, all message types, reactions, and appearance', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/instagram-dm-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();
    const desktopRight = page.locator('aside').nth(1);

    // Dedicated IG DM editor is present
    await expect(desktopLeft.getByTestId('instagram-dm-dedicated-editor')).toBeVisible();

    // Renderer with correct testid
    await expect(surface.getByTestId('renderer-instagram-dm')).toBeVisible();

    // Profile card shown for short conversations
    await expect(surface.getByTestId('ig-profile-card')).toBeVisible();

    // Header: avatar, name, call icons
    await expect(surface.getByTestId('ig-dm-header')).toBeVisible();
    await expect(surface).toContainText('Maya Lin');

    // Seed messages present: text, shared_post Reel, voice_note, story_reply
    await expect(surface).toContainText('Loved your latest Reel');
    await expect(surface).toContainText('Reel');
    await expect(surface).toContainText('Okay this story is EVERYTHING');

    // Add a plain text message
    await desktopLeft.getByLabel('Message text').fill('Studio mockup looks incredible!');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(surface).toContainText('Studio mockup looks incredible!');

    // Add an emoji
    await desktopLeft.getByLabel('Insert emoji 😍').click();
    await desktopLeft.getByLabel('Message text').fill('');
    await desktopLeft.getByLabel('Message text').fill('Great collab idea 🤝');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(surface).toContainText('Great collab idea');

    // Switch message type to gif
    await desktopLeft.getByLabel('Message type').selectOption('gif');
    await desktopLeft.getByTestId('add-message-btn').click();
    // GIF renders inside renderer
    await expect(surface.getByText('GIF')).toBeVisible();

    // Switch to sticker
    await desktopLeft.getByLabel('Message type').selectOption('sticker');
    await desktopLeft.getByLabel('Message text').fill('🎉');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(surface.getByTestId('ig-sticker').first()).toBeVisible();

    // Switch to voice_note
    await desktopLeft.getByLabel('Message type').selectOption('voice_note');
    await desktopLeft.getByTestId('add-message-btn').click();

    // Switch to story_reply
    await desktopLeft.getByLabel('Message type').selectOption('story_reply');
    await desktopLeft.getByLabel('Message text').fill('Your story was 🔥');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(surface.getByTestId('ig-msg-story_reply').first()).toBeVisible();

    // Switch to shared_post (Reel)
    await desktopLeft.getByLabel('Message type').selectOption('shared_post');
    await desktopLeft.getByLabel('Message text').fill('@creator Behind the scenes shoot');
    await desktopLeft.getByTestId('add-message-btn').click();

    // Switch to call_event
    await desktopLeft.getByLabel('Message type').selectOption('call_event');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(surface.getByTestId('ig-msg-call_event').first()).toBeVisible();

    // Add image attachment
    await desktopLeft.locator('input[type="file"][accept="image/*"]').first().setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await expect(surface.locator('img[alt="Chat image"]').first()).toBeAttached();

    // Toggle unsent on a timeline message
    await desktopLeft.getByLabel('Toggle unsent message').first().click();
    await expect(surface).toContainText('Message was unsent');

    // Reply quote
    await desktopLeft.getByLabel('Reply to message').selectOption({ index: 1 });
    await desktopLeft.getByLabel('Message type').selectOption('text');
    await desktopLeft.getByLabel('Message text').fill('Replying to your message!');
    await desktopLeft.getByTestId('add-message-btn').click();

    // Dark mode toggle
    await desktopRight.getByLabel('Toggle mockup dark mode').click();
    await expect(surface.getByTestId('renderer-instagram-dm')).toHaveAttribute('data-ig-dark', 'true');

    // Switch back to light
    await desktopRight.getByLabel('Toggle mockup dark mode').click();

    // People tab: change name, handle, upload avatar, set verified badge, change active status
    await desktopLeft.getByRole('tab', { name: /People/i }).click();
    await desktopLeft.getByLabel('Display name for Maya Lin').fill('Aria Nova');
    await expect(surface).toContainText('Aria Nova');

    await desktopLeft.getByLabel('Handle for Aria Nova').fill('@arianova.ig');

    await desktopLeft
      .locator('input[type="file"][aria-label*="Upload photo"]')
      .first()
      .setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: VALID_1X1_PNG });

    await desktopLeft.getByLabel('Verification badge for Aria Nova').selectOption('blue');
    await desktopLeft.getByLabel('Active status for Aria Nova').selectOption('active_1h');
  });

  test('is mobile-responsive at 390px and exports PNG, JPG, and WebP cleanly', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/instagram-dm-generator', { waitUntil: 'networkidle' });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);

    const mobilePanels = page.getByLabel('Mobile editing panels');
    await mobilePanels.getByLabel('Message text').fill('Mobile IG DM test message');
    await mobilePanels.getByTestId('add-message-btn').click();
    await expect(page.getByTestId('mockup-export-surface')).toContainText('Mobile IG DM test message');

    await page.getByTestId('footer-download-button').click();
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
