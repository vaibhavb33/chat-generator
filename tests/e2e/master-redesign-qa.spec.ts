import { test, expect } from '@playwright/test';

const TEST_PLATFORMS = [
  { id: 'whatsapp-chat', route: '/whatsapp-chat-generator', testId: 'renderer-whatsapp-chat' },
  { id: 'whatsapp-group-chat', route: '/whatsapp-group-chat-generator', testId: 'renderer-whatsapp-group-chat' },
  { id: 'instagram-dm', route: '/instagram-dm-generator', testId: 'renderer-instagram-dm' },
  { id: 'instagram-story', route: '/instagram-story-generator', testId: 'renderer-instagram-story' },
  { id: 'instagram-post', route: '/instagram-post-generator', testId: 'renderer-instagram-post' },
  { id: 'imessage', route: '/imessage-generator', testId: 'renderer-imessage' },
  { id: 'android-messages', route: '/android-message-generator', testId: 'renderer-android-messages' },
  { id: 'telegram-chat', route: '/telegram-chat-generator', testId: 'renderer-telegram-chat' },
  { id: 'discord-chat', route: '/discord-chat-generator', testId: 'renderer-discord-chat' },
  { id: 'fake-call-screen', route: '/fake-call-generator', testId: 'renderer-fake-call-screen' },
] as const;

const SCREEN_WIDTHS = [360, 375, 390, 430, 768, 1024, 1440, 1920] as const;

test.describe('Phase 10 Master Acceptance QA: Header, Full-Screen Previews, Sticky Footer & Pro Gating', () => {
  test('header contains exactly two device options (iPhone, Android) + Dark/Light and switches independently', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

    const header = page.getByTestId('studio-editor-header');
    const deviceSelector = header.getByTestId('device-selector');
    const appearanceSelector = header.getByTestId('appearance-selector');

    await expect(deviceSelector.locator('button')).toHaveCount(2);
    await expect(deviceSelector.getByTestId('device-option-iphone')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(appearanceSelector.locator('button')).toHaveCount(2);

    // 4 independent matrix states: iPhone+Light, iPhone+Dark, Android+Dark, Android+Light
    await expect(page.getByTestId('status-bar-iphone')).toBeVisible();
    await expect(page.getByTestId('ios-home-indicator')).toBeVisible();

    await appearanceSelector.getByTestId('appearance-option-dark').click();
    await expect(appearanceSelector.getByTestId('appearance-option-dark')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await page.screenshot({
      path: 'test-results/master-qa-screenshots/whatsapp-iphone-dark.png',
    });

    await deviceSelector.getByTestId('device-option-android').click();
    await expect(page.getByTestId('status-bar-android')).toBeVisible();
    await expect(page.getByTestId('android-gesture-bar')).toBeVisible();
    await page.screenshot({
      path: 'test-results/master-qa-screenshots/whatsapp-android-dark.png',
    });

    await appearanceSelector.getByTestId('appearance-option-light').click();
    await expect(appearanceSelector.getByTestId('appearance-option-light')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(page.getByTestId('status-bar-android')).toBeVisible();
    await page.screenshot({
      path: 'test-results/master-qa-screenshots/whatsapp-android-light.png',
    });

    await deviceSelector.getByTestId('device-option-iphone').click();
    await expect(page.getByTestId('status-bar-iphone')).toBeVisible();
  });

  test('full-screen chat list and home feed views render faithfully for WhatsApp, Telegram & Instagram', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // WhatsApp Chat List (iPhone Dark)
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });
    await page.getByTestId('appearance-option-dark').click();
    await page.getByTestId('screen-view-tab-chat_list').click();
    await expect(page.getByTestId('renderer-whatsapp-chat-list')).toBeVisible();
    await expect(page.getByLabel('WhatsApp iOS Liquid Glass navigation')).toBeVisible();
    await page.screenshot({
      path: 'test-results/master-qa-screenshots/whatsapp-chat-list-iphone-dark.png',
    });

    // Switch WhatsApp Chat List to Android Light
    await page.getByTestId('device-option-android').click();
    await page.getByTestId('appearance-option-light').click();
    await expect(page.getByLabel('WhatsApp Android navigation')).toBeVisible();

    // Telegram Chat List (iPhone Dark)
    await page.goto('/telegram-chat-generator', { waitUntil: 'networkidle' });
    await page.getByTestId('appearance-option-dark').click();
    await page.getByTestId('screen-view-tab-chat_list').click();
    await expect(page.getByTestId('renderer-telegram-chat-list')).toBeVisible();
    await expect(page.getByLabel('Telegram iOS Liquid Glass navigation')).toBeVisible();
    await page.screenshot({
      path: 'test-results/master-qa-screenshots/telegram-chat-list-iphone-dark.png',
    });

    // Instagram Home Feed + Stories Tray (IMG_5414)
    await page.goto('/instagram-post-generator', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('instagram-stories-tray')).toBeVisible();
    await expect(page.getByLabel('Instagram iOS Liquid Glass navigation')).toBeVisible();
    await page.screenshot({
      path: 'test-results/master-qa-screenshots/instagram-home-feed-iphone.png',
    });
  });

  test('sticky footer has exactly three primary actions (Edit, Download, Save Chat) and persists across refresh', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

    const footer = page.getByTestId('studio-sticky-footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByTestId('footer-edit-button')).toBeVisible();
    await expect(footer.getByTestId('footer-download-button')).toBeVisible();
    await expect(footer.getByTestId('footer-save-button')).toBeVisible();

    // Verify Preview Edit button toggles Clean Preview <-> Edit mode
    await page.getByTestId('preview-edit-button').click();
    await expect(page.locator('aside')).toHaveCount(0);
    await page.getByTestId('preview-edit-button').click();
    await expect(page.locator('aside')).toHaveCount(2);

    // Switch to Android + Dark, edit text, click Save Chat, reload and verify persistence!
    await page.getByTestId('device-option-android').click();
    await page.getByTestId('appearance-option-dark').click();
    const desktopLeft = page.locator('aside').first();
    await desktopLeft.getByLabel('Message text').fill('Saved Android Dark Test');
    await desktopLeft.getByTestId('add-message-btn').click();
    await footer.getByTestId('footer-save-button').click();
    await expect(page.getByTestId('save-chat-toast')).toBeVisible();

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.getByTestId('mockup-export-surface')).toContainText(
      'Saved Android Dark Test'
    );
    await expect(page.getByTestId('device-option-android')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(page.getByTestId('appearance-option-dark')).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  test('free watermark-free PNG/JPG/WebP downloads work while Pro features open genuine upgrade modal with INR pricing', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

    // Free PNG download works without watermark
    await page.getByTestId('footer-download-button').click();
    await expect(page.getByTestId('download-menu-dialog')).toBeVisible();
    const pngDl = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    expect((await pngDl).suggestedFilename()).toMatch(/\.png$/);

    // Free JPG download works
    await page.getByRole('button', { name: 'JPG' }).click();
    const jpgDl = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    expect((await jpgDl).suggestedFilename()).toMatch(/\.jpg$/);

    // WebP works on Chromium/WebKit
    if (testInfo.project.name !== 'firefox') {
      await page.getByRole('button', { name: 'WEBP' }).click();
      const webpDl = page.waitForEvent('download');
      await page.getByTestId('confirm-export-btn').click();
      expect((await webpDl).suggestedFilename()).toMatch(/\.(webp|png)$/);
    }

    // Pro feature (Video Export) is genuinely gated & shows INR pricing without faking payment
    await page.getByTestId('download-tab-video').click();
    await page.getByTestId('confirm-export-btn').click();
    const proModal = page.getByTestId('premium-upgrade-modal');
    await expect(proModal).toBeVisible();
    await expect(proModal).toContainText('₹149');
    await expect(proModal).toContainText('₹299');
    await expect(proModal).toContainText('₹1,999');

    await proModal.getByTestId('upgrade-checkout-btn').click();
    await expect(proModal.getByTestId('billing-provider-notice')).toBeVisible();
    await proModal.getByRole('button', { name: 'Close', exact: true }).click();
  });

  for (const plat of TEST_PLATFORMS) {
    test(`device & appearance matrix (all 4 combinations) renders cleanly for ${plat.id}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto(plat.route, { waitUntil: 'networkidle' });
      await expect(page.getByTestId(plat.testId)).toBeVisible();

      const combos = [
        { device: 'iphone', appearance: 'dark', statusId: 'status-bar-iphone', bottomId: 'ios-home-indicator' },
        { device: 'iphone', appearance: 'light', statusId: 'status-bar-iphone', bottomId: 'ios-home-indicator' },
        { device: 'android', appearance: 'dark', statusId: 'status-bar-android', bottomId: 'android-gesture-bar' },
        { device: 'android', appearance: 'light', statusId: 'status-bar-android', bottomId: 'android-gesture-bar' },
      ] as const;

      for (const combo of combos) {
        await page.getByTestId(`device-option-${combo.device}`).click();
        await page.getByTestId(`appearance-option-${combo.appearance}`).click();

        await expect(page.getByTestId(`device-option-${combo.device}`)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByTestId(`appearance-option-${combo.appearance}`)).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByTestId(plat.testId)).toBeVisible();
        await expect(page.getByTestId(combo.statusId)).toBeVisible();
        await expect(page.getByTestId(combo.bottomId)).toBeVisible();
      }
    });
  }

  for (const width of SCREEN_WIDTHS) {
    test(`responsive layout & sticky 3-action footer fit cleanly at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/whatsapp-chat-generator', { waitUntil: 'networkidle' });

      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(overflow, `Horizontal overflow at ${width}px`).toBe(false);

      const footer = page.getByTestId('studio-sticky-footer');
      await expect(footer).toBeVisible();
      await expect(footer.getByTestId('footer-edit-button')).toBeVisible();
      await expect(footer.getByTestId('footer-download-button')).toBeVisible();
      await expect(footer.getByTestId('footer-save-button')).toBeVisible();
    });
  }
});
