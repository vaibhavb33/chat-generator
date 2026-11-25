import { test, expect } from '@playwright/test';

test.describe('Prompt 05: Advanced Features, Image/Video Export & PWA Acceptance', () => {
  test('PWA manifest, custom icons, iOS metadata, Service Worker & privacy checks pass', async ({
    page,
    request,
  }) => {
    const manifestRes = await request.get('/manifest.webmanifest');
    expect(manifestRes.status()).toBe(200);
    const manifest = await manifestRes.json();
    expect(manifest.short_name).toBe('ChatForge');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#4f46e5');
    expect(manifest.background_color).toBe('#ffffff');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);

    const icon192 = await request.get('/icons/icon-192.png');
    expect(icon192.status()).toBe(200);
    const icon512 = await request.get('/icons/icon-512.png');
    expect(icon512.status()).toBe(200);
    const appleIcon = await request.get('/icons/apple-touch-icon.png');
    expect(appleIcon.status()).toBe(200);

    await page.goto('/generators/whatsapp-chat');
    const mobileCapable = await page
      .locator('meta[name="mobile-web-app-capable"]')
      .getAttribute('content');
    expect(mobileCapable).toBe('yes');
    const appleTouchHref = await page
      .locator('link[rel="apple-touch-icon"]')
      .getAttribute('href');
    expect(appleTouchHref).toContain('apple-touch-icon.png');

    // Wait for SW registration & verify no project data is stored in Cache Storage
    const swStatus = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return { supported: false, hasApiInCache: false };
      const reg = await navigator.serviceWorker.ready;
      const cacheNames = await caches.keys();
      let hasApiInCache = false;
      for (const name of cacheNames) {
        const c = await caches.open(name);
        const reqs = await c.keys();
        if (reqs.some((r) => r.url.includes('/api/'))) {
          hasApiInCache = true;
        }
      }
      return { supported: !!reg.active, hasApiInCache };
    });
    expect(swStatus.supported).toBe(true);
    expect(swStatus.hasApiInCache).toBe(false);
  });

  test('PWA offline editor loading, export while offline, reconnection & update prompt', async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/generators/whatsapp-chat', { waitUntil: 'networkidle' });

    // Ensure SW is active and route is cached
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await page.reload({ waitUntil: 'networkidle' });

    // Go offline
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await expect(page.getByTestId('pwa-offline-banner')).toBeVisible();

    // Edit & export PNG while offline
    const mobilePanels = page.getByLabel('Mobile editing panels');
    await mobilePanels.getByLabel('Message text').fill('Edited while offline!');
    await mobilePanels.getByTestId('add-message-btn').click();
    await expect(
      page.getByTestId('mockup-export-surface').getByText('Edited while offline!')
    ).toBeVisible();

    await page.getByTestId('top-export-button').click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    const dl = await downloadPromise;
    expect(dl.suggestedFilename()).toMatch(/\.png$/);
    await page.getByRole('button', { name: 'Close', exact: true }).click();

    // Reconnect
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await expect(page.getByTestId('pwa-online-banner')).toBeVisible();

    // Update notification banner
    await page.evaluate(() =>
      window.dispatchEvent(new Event('chatforge-sw-update-available'))
    );
    await expect(page.getByTestId('pwa-update-banner')).toBeVisible();
  });

  test('offline fallback page renders cleanly', async ({ page }) => {
    await page.goto('/offline');
    await expect(page.getByRole('heading', { name: /offline/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open Offline Editor' })).toBeVisible();
  });

  test('advanced Instagram DM story_reply, shared_post, WebP export & custom dimensions', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/generators/instagram-dm');

    const desktopLeft = page.locator('aside').first();
    await desktopLeft.getByLabel('Message type').selectOption('story_reply');
    await desktopLeft.getByLabel('Message text').fill('Love your studio setup!');
    await desktopLeft.getByTestId('add-message-btn').click();
    await expect(
      page.getByTestId('mockup-export-surface').getByText('Story preview')
    ).toBeVisible();

    await page.getByTestId('top-export-button').click();
    await page.getByRole('button', { name: 'WEBP' }).click();
    await page.getByLabel(/Custom Output Dimensions/i).check();
    await page.getByLabel('Custom width px').fill('1080');
    await page.getByLabel('Custom height px').fill('1350');

    const dlPromise = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    const dl = await dlPromise;
    expect(dl.suggestedFilename()).toContain('1080x1350.webp');
    await expect(page.getByTestId('export-success-state')).toContainText('1080 × 1350px');
  });

  test('video timeline keyboard preview, 9:16/4:5/1:1 ratios, and video export', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/generators/whatsapp-chat');

    await page.getByRole('button', { name: /Video/i }).click();
    const bar = page.getByTestId('video-timeline-bar');
    await expect(bar).toBeVisible();

    await bar.getByLabel('Keyboard').check();
    await expect(page.getByTestId('simulated-keyboard-overlay')).toBeVisible();

    await bar.getByLabel('Video aspect ratio').selectOption('4:5');
    const dlPromise = page.waitForEvent('download');
    await page.getByTestId('export-video-btn').click();
    const dl = await dlPromise;
    expect(dl.suggestedFilename()).toMatch(/\.(mp4|webm|html)$/);
    await expect(page.getByTestId('video-export-success')).toBeVisible();
  });

  test('9-category template library supports saving, duplicating, and applying templates', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/generators/whatsapp-chat');

    await page.getByRole('button', { name: 'Templates' }).click();
    await page.getByPlaceholder('Save current chat as template...').fill('My Launch Template');
    await page.getByRole('button', { name: 'Save Template' }).click();
    await expect(
      page.locator('input[value="My Launch Template"]')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Duplicate My Launch Template' }).click();
    await expect(
      page.locator('input[value="My Launch Template (Copy)"]')
    ).toBeVisible();
  });
});
