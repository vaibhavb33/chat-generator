import { test, expect } from '@playwright/test';

const VALID_1X1_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082',
  'hex'
);

test.describe('TASK 07 Acceptance: iMessage Generator (/imessage-generator)', () => {
  test('renders authentic iPhone iMessage UI, blue & green bubbles, status bar, header, and receipts', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/imessage-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();
    const desktopRight = page.locator('aside').nth(1);

    // 1. Dedicated editor badge and container
    await expect(desktopLeft.getByTestId('imessage-dedicated-editor')).toBeVisible();
    await expect(desktopLeft.getByTestId('platform-editor-badge')).toContainText('iPhone Messages Studio');
    await expect(surface.getByTestId('renderer-imessage')).toBeVisible();

    // 2. Header elements: Back button, Contact name, Subtitle, FaceTime action
    await expect(surface).toContainText('Messages');
    await expect(surface).toContainText('Maya Lin');
    await expect(surface).toContainText('iMessage');
    await expect(surface.locator('button[aria-label="FaceTime Video Call"]')).toBeVisible();

    // 3. Seed messages: Date separator, outgoing blue bubble, incoming grey bubble, voice note, receipts
    await expect(surface).toContainText('Today 9:41 AM');
    await expect(surface).toContainText('Hey! Did you check out the new iOS 18 design drop?');
    await expect(surface).toContainText('iMessage Tapbacks and effects look incredible');
    await expect(surface).toContainText('Delivered');
    await expect(surface).toContainText('Keep'); // Voice memo iOS keep button
    await expect(surface).toContainText('Sent with Confetti');

    // 4. Tapback reactions
    await expect(surface.locator('text=❤️')).toBeVisible();
    await expect(surface.locator('text=‼️')).toBeVisible();

    // 5. Add a new text message with Slam effect and Tapback
    await desktopLeft.getByLabel('Message text').fill('Boarding flight now, see you soon!');
    await desktopLeft.getByLabel('Message effect').selectOption('slam');
    await desktopLeft.getByRole('button', { name: 'Add to iMessage Thread' }).click();
    await expect(surface).toContainText('Boarding flight now, see you soon!');
    await expect(surface).toContainText('Sent with Slam');

    // 6. Add Apple Maps Location message
    await desktopLeft.getByLabel('Message type').selectOption('location');
    await desktopLeft.locator('input[placeholder="Apple Park"]').fill('Yerba Buena Gardens');
    await desktopLeft.locator('input[placeholder="1 Apple Park Way"]').fill('Mission St, San Francisco, CA');
    await desktopLeft.getByRole('button', { name: 'Add to iMessage Thread' }).click();
    await expect(surface).toContainText('Yerba Buena Gardens');
    await expect(surface).toContainText('Apple Maps');

    // 7. Add vCard Contact Card message
    await desktopLeft.getByLabel('Message type').selectOption('contact_card');
    await desktopLeft.locator('input[placeholder="Alex Rivera"]').fill('Dr. Alan Grant');
    await desktopLeft.locator('input[placeholder="+1 (415) 555-0194"]').fill('+1 (555) 019-2834');
    await desktopLeft.getByRole('button', { name: 'Add to iMessage Thread' }).click();
    await expect(surface).toContainText('Dr. Alan Grant');

    // 8. Add Rich Link Preview message
    await desktopLeft.getByLabel('Message type').selectOption('link_preview');
    await desktopLeft.locator('input[placeholder="Apple Special Event"]').fill('WWDC Keynote Livestream');
    await desktopLeft.locator('input[placeholder="apple.com"]').fill('apple.com/events');
    await desktopLeft.getByRole('button', { name: 'Add to iMessage Thread' }).click();
    await expect(surface).toContainText('WWDC Keynote Livestream');
    await expect(surface).toContainText('apple.com/events');

    // 9. Attach photo image
    await desktopLeft.locator('input[type="file"][accept="image/*"]').first().setInputFiles({
      name: 'vacation.png',
      mimeType: 'image/png',
      buffer: VALID_1X1_PNG,
    });
    await expect(surface.locator('img[alt="Photo attachment"]').first()).toBeAttached();

    // 10. Toggle typing indicator preview
    await desktopLeft.getByTestId('toggle-typing-preview').check();
    await expect(surface.locator('.animate-bounce').first()).toBeVisible();
    await desktopLeft.getByTestId('toggle-typing-preview').uncheck();

    // 11. Switch bubble style to Green SMS
    await desktopLeft.getByRole('tab', { name: 'Status & Style' }).click();
    await desktopLeft.getByTestId('style-bubble-green').click();
    await expect(surface).toContainText('Text Message • SMS');

    // 12. Switch bubble style back to Blue iMessage
    await desktopLeft.getByTestId('style-bubble-blue').click();
    await expect(surface).toContainText('iMessage');

    // 13. Dynamic Island toggle
    await desktopLeft.getByTestId('notch-dynamic-island').click();
    await desktopLeft.getByTestId('notch-classic').click();

    // 14. Switch to Group Mode
    await desktopLeft.getByRole('tab', { name: 'Contact & Group' }).click();
    await desktopLeft.getByTestId('imessage-group-mode-toggle').click();
    await expect(surface).toContainText('Dinner Crew 🍕');

    // 15. Apply One-Click Template
    await desktopLeft.getByRole('tab', { name: 'Templates' }).click();
    await desktopLeft.getByTestId('apply-template-birthday_celebration').click();
    await expect(surface).toContainText('HAPPY BIRTHDAY TO MY FAVORITE HUMAN!');
    await expect(surface).toContainText('Emma Watson');

    // 16. Verify Exports (PNG, JPG, WebP)
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

  test('responsive mobile preview at 390px iPhone viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/imessage-generator', { waitUntil: 'domcontentloaded' });

    const surface = page.getByTestId('mockup-export-surface');
    await expect(surface.getByTestId('renderer-imessage')).toBeVisible();

    // Header and messages render cleanly on mobile width
    await expect(surface).toContainText('Maya Lin');
    await expect(surface).toContainText('Hey! Did you check out the new iOS 18 design drop?');

    // Bottom composer visible
    await expect(surface.locator('button[aria-label="Send message"]')).toBeVisible();
  });
});
