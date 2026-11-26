import { test, expect } from '@playwright/test';

const VALID_1X1_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  'hex'
);

test.describe('TASK 08 Acceptance: Android Messages Generator (/android-message-generator)', () => {
  test('renders authentic Android Messages UI with Material You RCS, Samsung One UI, SMS, punch hole, and receipts', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/android-message-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // 1. Dedicated editor badge and container
    await expect(desktopLeft.getByTestId('android-messages-dedicated-editor')).toBeVisible();
    await expect(desktopLeft.getByTestId('platform-editor-badge')).toContainText('Material You RCS Studio');
    await expect(surface.getByTestId('renderer-android-messages')).toBeVisible();

    // 2. Android Header elements: Material Arrow, Contact name, Subtitle, Video, Phone, More options
    await expect(surface.getByTestId('android-messages-header')).toBeVisible();
    await expect(surface).toContainText('Maya Lin');
    await expect(surface).toContainText('RCS chat');
    await expect(surface.locator('button[aria-label="Video call"]')).toBeVisible();
    await expect(surface.locator('button[aria-label="Voice call"]')).toBeVisible();

    // 3. Status Bar punch hole camera cutout
    await expect(surface.locator('.rounded-full.bg-black\\/90')).toBeVisible();

    // 4. RCS End-to-end encryption notice
    await expect(surface.getByTestId('rcs-encryption-notice')).toBeVisible();
    await expect(surface.getByTestId('rcs-encryption-notice')).toContainText('RCS chat with Maya Lin');

    // 5. Seed messages: Date separator, incoming RCS text, outgoing text with checkmark, voice note
    await expect(surface).toContainText('Today • 10:00 AM');
    await expect(surface).toContainText('Hey! Are you using the new Google Messages RCS features?');
    await expect(surface).toContainText('The Material You dynamic theme and high-res photo sharing work so smoothly');
    await expect(surface).toContainText('0:12'); // Voice message duration

    // 6. Material 3 Emoji Reactions
    await expect(surface.locator('text=👍')).toBeVisible();

    // 7. Add a new RCS text message
    await desktopLeft.getByLabel('Message text').fill('Testing Android Messages RCS message delivery!');
    await desktopLeft.getByRole('button', { name: 'Add to Android Chat' }).click();
    await expect(surface).toContainText('Testing Android Messages RCS message delivery!');

    // 8. Add Google Maps Location message
    await desktopLeft.getByLabel('Message type').selectOption('location');
    await desktopLeft.locator('input[placeholder="Googleplex"]').fill('Google San Francisco');
    await desktopLeft.locator('input[placeholder="1600 Amphitheatre Pkwy"]').fill('345 Spear St, San Francisco, CA');
    await desktopLeft.getByRole('button', { name: 'Add to Android Chat' }).click();
    await expect(surface).toContainText('Google San Francisco');
    await expect(surface).toContainText('Google Maps');

    // 9. Add Contact Card (vCard) message
    await desktopLeft.getByLabel('Message type').selectOption('contact_card');
    await desktopLeft.locator('input[placeholder="Maya Lin"]').fill('Sundeep Patel');
    await desktopLeft.locator('input[placeholder="+1 (415) 555-0194"]').fill('+1 (650) 253-0000');
    await desktopLeft.getByRole('button', { name: 'Add to Android Chat' }).click();
    await expect(surface).toContainText('Sundeep Patel');

    // 10. Add Rich Link Preview message
    await desktopLeft.getByLabel('Message type').selectOption('link_preview');
    await desktopLeft.locator('input[placeholder="Google Pixel 9 Pro"]').fill('Pixel 9 Pro with Gemini');
    await desktopLeft.locator('input[placeholder="store.google.com"]').fill('store.google.com/pixel');
    await desktopLeft.getByRole('button', { name: 'Add to Android Chat' }).click();
    await expect(surface).toContainText('Pixel 9 Pro with Gemini');
    await expect(surface).toContainText('store.google.com/pixel');

    // 11. Attach Photo image
    await desktopLeft.locator('input[type="file"][accept="image/*"]').first().setInputFiles({
      name: 'pixel_shot.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await expect(surface.locator('img[alt="Photo attachment"]').first()).toBeAttached();

    // 12. Toggle Typing Indicator preview
    await desktopLeft.getByTestId('toggle-typing-preview').check();
    await expect(surface.locator('.animate-bounce').first()).toBeVisible();
    await desktopLeft.getByTestId('toggle-typing-preview').uncheck();

    // 13. Switch to Samsung One UI visual profile
    await desktopLeft.getByRole('tab', { name: 'Profile & RCS' }).click();
    await desktopLeft.getByTestId('profile-samsung-oneui').click();
    await expect(surface).toContainText('Online');

    // 14. Switch to Classic Android SMS mode
    await desktopLeft.getByTestId('profile-classic-sms').click();
    await expect(surface.getByTestId('sms-notice')).toBeVisible();
    await expect(surface).toContainText('Texting with Maya Lin (SIM 1)');

    // 15. Switch back to Google Messages RCS
    await desktopLeft.getByTestId('profile-google-messages').click();
    await expect(surface.getByTestId('rcs-encryption-notice')).toBeVisible();

    // 16. Apply One-Click Preset Template
    await desktopLeft.getByRole('tab', { name: 'Presets' }).click();
    await desktopLeft.getByTestId('apply-template-samsung_oneui').click();
    await expect(surface).toContainText('Daniel Kim');
    await expect(surface).toContainText('Sightglass Coffee Roastery');

    // 17. Verify Exports (PNG, JPG, WebP)
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

  test('responsive mobile preview at 390px Android viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/android-message-generator', { waitUntil: 'domcontentloaded' });

    const surface = page.getByTestId('mockup-export-surface');
    await expect(surface.getByTestId('renderer-android-messages')).toBeVisible();

    // Header and messages render cleanly on mobile width
    await expect(surface).toContainText('Maya Lin');
    await expect(surface).toContainText('Hey! Are you using the new Google Messages RCS features?');

    // Bottom composer visible
    await expect(surface.locator('button[aria-label="Send message"]')).toBeVisible();
  });
});
