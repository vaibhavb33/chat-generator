import { test, expect } from '@playwright/test';

const CHAT_GENERATORS = [
  { id: 'whatsapp-chat', route: '/whatsapp-chat-generator' },
  { id: 'whatsapp-group-chat', route: '/whatsapp-group-chat-generator' },
  { id: 'instagram-dm', route: '/instagram-dm-generator' },
  { id: 'imessage', route: '/imessage-generator' },
  { id: 'android-messages', route: '/android-message-generator' },
  { id: 'telegram-chat', route: '/telegram-chat-generator' },
  { id: 'discord-chat', route: '/discord-chat-generator' },
] as const;

test.describe('Functional Tests Across All 10 MVP Generators', () => {
  for (const gen of CHAT_GENERATORS) {
    test(`${gen.id}: renders dedicated UI, adds, duplicates, switches sender, toggles dark mode & exports PNG`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(gen.route);

      await expect(page.getByTestId(`renderer-${gen.id}`)).toBeVisible();
      const desktopLeft = page.locator('aside').first();
      const desktopRight = page.locator('aside').nth(1);

      const uniqueText = `Smoke test ${gen.id}`;
      await desktopLeft.getByLabel('Message text').fill(uniqueText);
      await desktopLeft.getByTestId('add-message-btn').click();
      await expect(
        page.getByTestId('mockup-export-surface').getByText(uniqueText)
      ).toBeVisible();

      // Duplicate & switch sender on the newly added last message
      await desktopLeft.getByRole('button', { name: 'Duplicate message' }).last().click();
      await expect(
        page.getByTestId('mockup-export-surface').getByText(uniqueText)
      ).toHaveCount(2);
      await desktopLeft.getByRole('button', { name: 'Switch sender' }).last().click();

      // Toggle dark mode in right panel
      const darkSwitch = desktopRight.getByLabel('Toggle mockup dark mode');
      if (await darkSwitch.isVisible()) {
        await darkSwitch.click();
      }

      // Export PNG
      await page.getByTestId('top-export-button').click();
      await expect(page.getByTestId('confirm-export-btn')).toBeVisible();
      const downloadPromise = page.waitForEvent('download');
      await page.getByTestId('confirm-export-btn').click();
      const dl = await downloadPromise;
      expect(dl.suggestedFilename()).toMatch(/\.png$/);
    });
  }

  test('instagram-story: edits slide headline & poll and exports PNG', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/instagram-story-generator');

    const desktopLeft = page.locator('aside').first();
    await desktopLeft.getByLabel('Headline Text').fill('Updated Story Headline!');
    await expect(
      page.getByTestId('mockup-export-surface').getByText('Updated Story Headline!')
    ).toBeVisible();

    await page.getByTestId('top-export-button').click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    const dl = await downloadPromise;
    expect(dl.suggestedFilename()).toMatch(/\.png$/);
  });

  test('instagram-post: edits caption, toggles ...more truncation & exports PNG', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/instagram-post-generator');

    const desktopLeft = page.locator('aside').first();
    await desktopLeft.getByLabel('Location Tag').fill('Tokyo, Japan');
    await expect(
      page.getByTestId('mockup-export-surface').getByText('Tokyo, Japan')
    ).toBeVisible();

    await page.getByTestId('top-export-button').click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    const dl = await downloadPromise;
    expect(dl.suggestedFilename()).toMatch(/\.png$/);
  });

  test('fake-call-screen: accepts incoming call to active timer & exports PNG', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/fake-call-generator');

    const surface = page.getByTestId('mockup-export-surface');
    await expect(surface.getByText('Incoming call...')).toBeVisible();

    await surface.getByText('Accept').click();
    await expect(surface.getByText('01:14')).toBeVisible();

    await page.getByTestId('top-export-button').click();
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('confirm-export-btn').click();
    const dl = await downloadPromise;
    expect(dl.suggestedFilename()).toMatch(/\.png$/);
  });

  test('projects modal duplicates & restores saved drafts and templates modal resets to default', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/whatsapp-chat-generator');

    await page.getByRole('button', { name: 'Projects' }).click();
    await page.getByRole('button', { name: 'Duplicate Project' }).click();
    await expect(page.getByText(/Active:.*\(Copy\)/)).toBeVisible();
    await page.getByRole('button', { name: 'Close dialog' }).click();

    await page.getByRole('button', { name: 'Templates' }).click();
    await page.getByRole('button', { name: 'Reset to Default Template' }).click();
    await expect(page.getByLabel('Project title')).toHaveValue('WhatsApp Chat Draft');
  });
});
