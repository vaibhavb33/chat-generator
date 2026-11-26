import { test, expect } from '@playwright/test';

test.describe('TASK 11 Acceptance: Fake Call Screen Generator (/fake-call-generator)', () => {
  test('renders dedicated call studio editor, incoming call controls, and transitions to active timer', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/fake-call-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // 1. Dedicated editor badge and container
    await expect(desktopLeft.getByTestId('fake-call-dedicated-editor')).toBeVisible();
    await expect(desktopLeft.getByTestId('platform-editor-badge')).toContainText(
      'Voice & Video Call Studio'
    );
    await expect(surface.getByTestId('renderer-fake-call-screen')).toBeVisible();

    // 2. Incoming call screen verification
    await expect(surface.getByTestId('call-display-name')).toBeVisible();
    await expect(surface.getByTestId('call-phone-number')).toBeVisible();
    await expect(surface.getByTestId('call-status-indicator')).toContainText('Incoming call...');
    await expect(surface.getByTestId('call-decline-button')).toBeVisible();
    await expect(surface.getByTestId('call-accept-button')).toBeVisible();

    // 3. Accept call transitions to active timer
    await surface.getByTestId('call-accept-button').click();
    await expect(surface.getByTestId('call-btn-mute')).toBeVisible();
    await expect(surface.getByTestId('call-btn-speaker')).toBeVisible();
    await expect(surface.getByTestId('call-btn-keypad')).toBeVisible();
    await expect(surface.getByTestId('call-btn-add-call')).toBeVisible();
    await expect(surface.getByTestId('call-end-button')).toBeVisible();
    await expect(surface.getByTestId('call-status-indicator')).toContainText('01:14');
  });

  test('toggles all 4 call states: incoming, outgoing, ongoing, missed', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/fake-call-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // State 1: Outgoing Call
    await desktopLeft.getByTestId('state-btn-outgoing').click();
    await expect(surface.getByTestId('call-status-indicator')).toContainText('Calling...');
    await expect(surface.getByTestId('call-end-button')).toBeVisible();

    // State 2: Ongoing (Active) Call
    await desktopLeft.getByTestId('state-btn-active').click();
    await expect(surface.getByTestId('call-btn-mute')).toBeVisible();
    await expect(surface.getByTestId('call-btn-speaker')).toBeVisible();
    await expect(surface.getByTestId('call-end-button')).toBeVisible();

    // State 3: Missed Call
    await desktopLeft.getByTestId('state-btn-missed').click();
    await expect(surface.getByTestId('call-status-indicator')).toContainText('Missed Call');
    await expect(surface.getByTestId('call-callback-button')).toBeVisible();
    await expect(surface.getByTestId('call-message-button')).toBeVisible();

    // State 4: Back to Incoming
    await desktopLeft.getByTestId('state-btn-incoming').click();
    await expect(surface.getByTestId('call-accept-button')).toBeVisible();
    await expect(surface.getByTestId('call-decline-button')).toBeVisible();
  });

  test('interacts with in-call keypad overlay, mute/speaker toggles, and contact customization', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/fake-call-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // Go to active call
    await desktopLeft.getByTestId('state-btn-active').click();

    // Toggle Keypad
    await surface.getByTestId('call-btn-keypad').click();
    await expect(surface.getByTestId('call-keypad-overlay')).toBeVisible();
    await expect(surface.getByText('ABC')).toBeVisible();
    await expect(surface.getByText('WXYZ')).toBeVisible();

    // Toggle Speaker and Mute
    await surface.getByTestId('call-btn-speaker').click();
    await surface.getByTestId('call-btn-mute').click();

    // Customize Caller Name and Phone
    await desktopLeft.getByRole('tab', { name: 'Caller' }).click();
    const nameInput = desktopLeft.getByTestId('input-caller-name');
    await nameInput.fill('CEO Eleanor Sterling');
    await expect(surface.getByTestId('call-display-name')).toContainText('CEO Eleanor Sterling');

    const phoneInput = desktopLeft.getByTestId('input-caller-phone');
    await phoneInput.fill('+1 (800) 555-EXEC');
    await expect(surface.getByTestId('call-phone-number')).toContainText('+1 (800) 555-EXEC');
  });

  test('switches device modes (iPhone vs Android), background styles, and presets', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/fake-call-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // First switch to active call state while on Call tab
    await desktopLeft.getByTestId('state-btn-active').click();

    // Device Tab
    await desktopLeft.getByRole('tab', { name: 'Device' }).click();

    // Switch to Android
    await desktopLeft.getByTestId('device-mode-android').click();
    await expect(surface.getByTestId('call-btn-hold')).toBeVisible();

    // Switch back to iPhone
    await desktopLeft.getByTestId('device-mode-ios').click();
    await expect(surface.getByTestId('call-btn-video')).toBeVisible();

    // Toggle Fictional Badge
    await desktopLeft.getByTestId('toggle-fictional-watermark').check();
    await expect(surface.getByTestId('fictional-mockup-watermark')).toBeVisible();

    // Presets Tab - Apply WhatsApp Preset
    await desktopLeft.getByRole('tab', { name: 'Presets' }).click();
    await desktopLeft.getByTestId('preset-card-whatsapp-international').click();
    await expect(surface.getByText('End-to-end encrypted')).toBeVisible();
    await expect(surface.getByTestId('call-display-name')).toContainText('Sofia Alvarez');
  });

  test('exports fake call screen mockup as PNG', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/fake-call-generator', { waitUntil: 'networkidle' });

    // Open export dialog
    await page.getByTestId('top-export-button').click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.png$/);
  });
});
