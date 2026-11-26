import { test, expect } from '@playwright/test';

test.describe('TASK 06 Acceptance: Instagram Post Generator', () => {
  test('header, carousel navigation, caption truncation, tags, comments, and export', async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/instagram-post-generator', { waitUntil: 'networkidle' });

    const surface = page.getByTestId('mockup-export-surface');
    const desktopLeft = page.locator('aside').first();

    // 1. Dedicated editor is mounted
    await expect(desktopLeft.getByTestId('instagram-post-dedicated-editor')).toBeVisible();

    // 2. Instagram Post Renderer is mounted
    await expect(surface.getByTestId('renderer-instagram-post')).toBeVisible();

    // 3. Post header elements
    await expect(surface).toContainText('mayalin.creates');
    await expect(surface.getByTestId('post-location-label')).toContainText('San Francisco, California');

    // 4. Carousel indicators: counter badge 1/3 and dots
    await expect(surface.getByTestId('carousel-counter-badge')).toContainText('1/3');
    await expect(surface.getByTestId('carousel-dots-pagination')).toBeVisible();

    // Navigate to next slide using overlay arrow
    await surface.getByTestId('carousel-next-btn').click();
    await expect(surface.getByTestId('carousel-counter-badge')).toContainText('2/3');

    // Navigate back to slide 1
    await surface.getByTestId('carousel-prev-btn').click();
    await expect(surface.getByTestId('carousel-counter-badge')).toContainText('1/3');

    // 5. Caption & Truncation fold (...more button)
    const moreBtn = surface.getByRole('button', { name: 'more', exact: true });
    await expect(moreBtn).toBeVisible();
    await moreBtn.click();
    await expect(surface).toContainText('#CreatorTools');

    // 6. Interactive Like & Bookmark
    const likeBtn = surface.getByTestId('post-like-button');
    await expect(surface).toContainText('Liked by daniel.agency and 2,840 others');
    await likeBtn.click();
    // After unliking, like count drops to 2,839 others
    await expect(surface).toContainText('2,839 others');
    // Like again
    await likeBtn.click();
    await expect(surface).toContainText('2,840 others');

    // 7. Tagged accounts overlay
    const tagsBtn = surface.getByTestId('toggle-tags-btn');
    await expect(tagsBtn).toBeVisible();
    await tagsBtn.click();
    await expect(surface.getByTestId('tagged-accounts-overlay')).toBeVisible();
    await expect(surface.getByTestId('tagged-accounts-overlay')).toContainText('@daniel.agency');

    // 8. Edit Location Tag (backward test compatibility)
    await desktopLeft.getByLabel('Location Tag').fill('Tokyo, Japan');
    await expect(surface.getByTestId('post-location-label')).toContainText('Tokyo, Japan');

    // 9. Switch Aspect Ratio to 1:1 Square
    await desktopLeft.getByRole('button', { name: /1:1/i }).click();
    await expect(surface.getByTestId('post-media-container')).toHaveClass(/aspect-square/);

    // 10. Switch Aspect Ratio to 16:9 Landscape
    await desktopLeft.getByRole('button', { name: /16:9/i }).click();
    await expect(surface.getByTestId('post-media-container')).toHaveClass(/aspect-\[16\/9\]/);

    // 11. Switch back to 4:5 Portrait
    await desktopLeft.getByRole('button', { name: /4:5/i }).click();
    await expect(surface.getByTestId('post-media-container')).toHaveClass(/aspect-\[4\/5\]/);

    // 12. Switch to Comments Tab in Editor
    await desktopLeft.getByRole('tab', { name: /Comments/i }).click();
    await expect(desktopLeft.getByText('Existing Comments')).toBeVisible();

    // Add a new comment
    await desktopLeft.getByPlaceholder('Write comment text with @mentions and #hashtags...').fill('Amazing post mockup! 🔥');
    await desktopLeft.getByRole('button', { name: 'Post Comment' }).click();
    await expect(surface).toContainText('Amazing post mockup! 🔥');

    // 13. Switch to Templates Tab and Apply "Giveaway Alert"
    await desktopLeft.getByRole('tab', { name: /Templates/i }).click();
    await expect(desktopLeft.getByText('Instant Post Presets')).toBeVisible();

    await desktopLeft.getByTestId('apply-template-giveaway_post').click();

    // Verify Giveaway template applied
    await expect(surface).toContainText('gadget.giveaways');
    await expect(surface).toContainText('MEGA CREATOR GIVEAWAY');
    await expect(surface).toContainText('Worldwide Entry');
    await expect(surface).toContainText('75,399 others');

    // 14. Apply "Travel Photography" template
    await desktopLeft.getByTestId('apply-template-travel_post').click();

    await expect(surface).toContainText('wanderlust_nomad');
    await expect(surface).toContainText('Kyoto, Japan');
    await expect(surface).toContainText('Arashiyama');

    // 15. Export PNG, JPG and WebP
    await page.getByTestId('footer-download-button').click();
    await expect(page.getByTestId('confirm-export-btn')).toBeVisible();

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

  test('mobile responsiveness: no horizontal overflow at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/instagram-post-generator', { waitUntil: 'networkidle' });

    await expect(page.getByTestId('renderer-instagram-post')).toBeVisible();

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth + 2;
    });
    expect(overflow).toBe(false);

    // Mobile edit drawer opens
    const editBtn = page.getByTestId('mobile-edit-drawer-btn');
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await expect(page.getByTestId('instagram-post-dedicated-editor')).toBeVisible();
    }
  });
});
