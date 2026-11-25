import { test, expect } from '@playwright/test';

// Minimal valid 1x1 PNG buffer for image upload & custom wallpaper E2E tests
const VALID_1X1_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  'hex'
);

test.describe('TASK 02 Acceptance: Realistic WhatsApp Chat Generator', () => {
  test('renders separate iOS and Android WhatsApp UIs, all media/message types, contact customization & wallpaper upload', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();
    const desktopRight = page.locator('aside').nth(1);

    // Default iOS WhatsApp layout uses iOS back chevron + '+' composer and omits Android 3-dot icon
    await expect(surface.getByTestId('wa-ios-back')).toBeVisible();
    await expect(surface.getByTestId('wa-ios-composer')).toBeVisible();
    await expect(surface.getByTestId('wa-android-more')).toHaveCount(0);

    // Switch to Android Material & Android Classic Teal versions
    await desktopRight.getByLabel('WhatsApp UI version').selectOption('android_modern');
    await expect(surface.getByTestId('wa-android-back')).toBeVisible();
    await expect(surface.getByTestId('wa-android-more')).toBeVisible();
    await expect(surface.getByTestId('wa-android-composer')).toBeVisible();

    await desktopRight.getByLabel('WhatsApp UI version').selectOption('android_classic');
    await expect(surface.getByTestId('renderer-whatsapp-chat')).toHaveAttribute(
      'data-whatsapp-version',
      'android_classic'
    );

    // Contact customization: Online / Last Seen presets, typing indicator, People tab name + avatar upload
    await desktopRight.getByRole('button', { name: 'Last Seen' }).click();
    await expect(surface).toContainText('last seen today at 9:41 AM');

    await desktopLeft.getByRole('tab', { name: /People/i }).click();
    await desktopLeft.getByLabel('Display name for Maya Lin').fill('Elena Vance');
    await desktopLeft
      .locator('input[type="file"][aria-label*="Upload photo"]')
      .first()
      .setInputFiles({
        name: 'avatar.png',
        mimeType: 'image/png',
        buffer: VALID_1X1_PNG,
      });
    await expect(surface).toContainText('Elena Vance');

    // Switch back to Messages tab and exercise text + line breaks + emojis + forwarded + reply + media types
    await desktopLeft.getByRole('tab', { name: 'Messages' }).click();
    await desktopLeft.getByLabel('Message text').fill('Line one\nLine two');
    await desktopLeft.getByLabel('Insert emoji 🔥').click();
    await desktopLeft.getByLabel('Forwarded status').selectOption('forwarded');
    await desktopLeft.getByTestId('add-message-btn').click();

    await expect(surface.getByText('Forwarded').first()).toBeVisible();
    await expect(surface).toContainText('Line two🔥');

    // Add Unread Message Divider
    await desktopLeft.getByLabel('Message type').selectOption('unread_divider');
    await desktopLeft.getByLabel('Message text').fill('2 UNREAD MESSAGES');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(surface.getByTestId('wa-unread-divider')).toContainText('2 UNREAD MESSAGES');

    // Exercise media types: voice_note, audio, video_preview, document, location, contact_card, call_event, sticker
    for (const item of [
      { type: 'voice_note', text: 'Voice update' },
      { type: 'audio', text: 'Demo-Mix.mp3' },
      { type: 'video_preview', text: 'Product walkthrough' },
      { type: 'document', text: 'Proposal-2026.pdf' },
      { type: 'location', text: 'Downtown Studio' },
      { type: 'contact_card', text: 'Sam Rivera' },
      { type: 'call_event', text: 'Missed voice call' },
      { type: 'sticker', text: '🎉' },
    ] as const) {
      await desktopLeft.getByLabel('Message type').selectOption(item.type);
      await desktopLeft.getByLabel('Message text').fill(item.text);
      await desktopLeft.getByTestId('add-message-btn').click();
    }

    await expect(surface).toContainText('Demo-Mix.mp3');
    await expect(surface).toContainText('Proposal-2026.pdf');
    await expect(surface).toContainText('Downtown Studio');
    await expect(surface).toContainText('Sam Rivera');
    await expect(surface).toContainText('missed voice call');

    // Upload image attachment directly
    await desktopLeft.locator('input[type="file"][accept="image/*"]').first().setInputFiles({
      name: 'photo.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await expect(surface.locator('img[alt="Chat image"]').first()).toBeVisible();

    // Appearance controls: Dark mode, Bubble style, Text size, Custom wallpaper upload, Simulated label
    await desktopRight.getByLabel('Toggle mockup dark mode').click();
    await desktopRight.getByLabel('WhatsApp bubble style').selectOption('whatsapp_modern_pill');
    await desktopRight.getByLabel('Chat text size').selectOption('1.12');
    await desktopRight.getByLabel('Upload custom wallpaper').setInputFiles({
      name: 'wallpaper.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await desktopRight.getByLabel('Toggle simulated disclosure label').click();
    await expect(surface).toContainText('Simulated Mockup');
  });

  test('exports PNG, JPG, and WebP cleanly without requiring registration', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

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
