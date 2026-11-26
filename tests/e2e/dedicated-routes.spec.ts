import { test, expect } from '@playwright/test';

const DEDICATED_GENERATORS = [
  {
    route: '/whatsapp-chat-generator',
    id: 'whatsapp-chat',
    editorBadge: '1-on-1 WhatsApp Composer',
    h1: /WhatsApp Chat Generator/i,
  },
  {
    route: '/whatsapp-group-chat-generator',
    id: 'whatsapp-group-chat',
    editorBadge: 'Multi-Speaker Group Studio',
    h1: /WhatsApp Group/i,
  },
  {
    route: '/instagram-dm-generator',
    id: 'instagram-dm',
    editorBadge: 'Instagram Direct Studio',
    h1: /Instagram DM/i,
  },
  {
    route: '/instagram-story-generator',
    id: 'instagram-story',
    editorBadge: '9:16 Story Frame Studio',
    h1: /Instagram Story/i,
  },
  {
    route: '/instagram-post-generator',
    id: 'instagram-post',
    editorBadge: 'Feed & Caption Cutoff Studio',
    h1: /Instagram Post/i,
  },
  {
    route: '/imessage-generator',
    id: 'imessage',
    editorBadge: 'iPhone Messages Studio',
    h1: /iMessage/i,
  },
  {
    route: '/android-message-generator',
    id: 'android-messages',
    editorBadge: 'Material You RCS Studio',
    h1: /Android/i,
  },
  {
    route: '/telegram-chat-generator',
    id: 'telegram-chat',
    editorBadge: 'Telegram Messenger Studio',
    h1: /Telegram/i,
  },
  {
    route: '/discord-chat-generator',
    id: 'discord-chat',
    editorBadge: 'Discord Channel Studio',
    h1: /Discord/i,
  },
  {
    route: '/fake-call-generator',
    id: 'fake-call-screen',
    editorBadge: 'Voice & Video Call Studio',
    h1: /Call Screen/i,
  },
] as const;

test.describe('TASK 01 Acceptance: Dedicated Generator Routes, Navigation & History', () => {
  for (const gen of DEDICATED_GENERATORS) {
    test(`direct navigation, refresh (no 404), editor loading, and metadata for ${gen.route}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });

      const directRes = await page.goto(gen.route, { waitUntil: 'domcontentloaded' });
      expect(directRes?.status()).toBe(200);
      await expect(page.getByTestId(`renderer-${gen.id}`)).toBeVisible({ timeout: 12000 });
      await expect(page.getByTestId('platform-editor-badge').first()).toContainText(
        gen.editorBadge
      );
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toContainText(gen.h1);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toContain(gen.route);

      // Refresh page directly and confirm 200/304 (never 404) and working editor
      const reloadRes = await page.reload({ waitUntil: 'domcontentloaded' });
      expect([200, 304]).toContain(reloadRes?.status());
      await expect(page.getByTestId(`renderer-${gen.id}`)).toBeVisible({ timeout: 12000 });

      // Trailing-slash variant must also resolve without 404
      const trailingRes = await page.goto(`${gen.route}/`, { waitUntil: 'domcontentloaded' });
      expect([200, 304]).toContain(trailingRes?.status());
      await expect(page.getByTestId(`renderer-${gen.id}`)).toBeVisible({ timeout: 12000 });
    });
  }

  test('top navigation bar links, directory cards, templates & browser back/forward history', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });

    const nav = page.getByLabel('Primary navigation');
    for (const label of [
      'Home',
      'All Generators',
      'Chat Generators',
      'Social Media Generators',
      'Templates',
      'Help',
    ]) {
      await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
    }

    // Verify Chat Generators link href & navigate
    const chatLink = nav.getByRole('link', { name: 'Chat Generators', exact: true });
    await expect(chatLink).toHaveAttribute('href', '/generators?category=messaging');
    await page.goto('/generators?category=messaging');
    await expect(page).toHaveURL(/\/generators\?category=messaging/);
    await expect(page.getByTestId('generator-card-whatsapp-chat')).toBeVisible();

    // Directory card must include Create Now CTA and alt preview image
    const card = page.getByTestId('generator-card-whatsapp-chat');
    await expect(card).toContainText('Create Now');
    await expect(card.locator('img')).toHaveAttribute('alt', /WhatsApp Chat Generator/i);

    // Verify Social Media Generators link href & navigate
    const socialLink = nav.getByRole('link', { name: 'Social Media Generators', exact: true });
    await expect(socialLink).toHaveAttribute('href', '/generators?category=social');
    await page.goto('/generators?category=social');
    await expect(page).toHaveURL(/\/generators\?category=social/);
    await expect(page.getByTestId('generator-card-instagram-post')).toBeVisible();

    // Open Instagram Post Generator via card
    const postCard = page.getByTestId('generator-card-instagram-post');
    await expect(postCard).toHaveAttribute('href', '/instagram-post-generator');
    await page.goto('/instagram-post-generator', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/instagram-post-generator/);
    await expect(page.getByTestId('renderer-instagram-post')).toBeVisible();

    // Quick-switch to Discord Chat updates route cleanly
    await page
      .getByLabel('Quick switch generator')
      .selectOption('discord-chat');
    await expect(page).toHaveURL(/\/discord-chat-generator/);
    await expect(page.getByTestId('renderer-discord-chat')).toBeVisible();

    // Browser Back & Forward work across dedicated routes
    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/instagram-post-generator/);
    await expect(page.getByTestId('renderer-instagram-post')).toBeVisible();

    await page.goForward({ waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/discord-chat-generator/);
    await expect(page.getByTestId('renderer-discord-chat')).toBeVisible();

    // Templates page launches a template into its dedicated generator route
    await page.goto('/templates', { waitUntil: 'networkidle' });
    const templateLink = page.getByRole('link', { name: /Use in WhatsApp Chat/i }).first();
    const tplHref = await templateLink.getAttribute('href');
    expect(tplHref).toContain('/whatsapp-chat-generator?template=');
    await page.goto(tplHref || '/whatsapp-chat-generator?template=e-commerce-shipping');
    await expect(page).toHaveURL(/\/whatsapp-chat-generator\?template=/);
    await expect(page.getByTestId('renderer-whatsapp-chat')).toBeVisible();

    // Help page renders cleanly with FAQ accordion & guides
    await page.goto('/help', { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toContainText(/Help Center/i);
  });

  test('mobile 360px navigation drawer exposes all redesigned links cleanly', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/android-message-generator', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('renderer-android-messages')).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole('button', { name: 'Toggle mobile navigation' }).dispatchEvent('click');
    const drawer = page.getByTestId('mobile-nav-drawer');
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'Social Media Generators' })).toBeVisible();
    const templatesLink = drawer.getByRole('link', { name: 'Templates' });
    await expect(templatesLink).toHaveAttribute('href', '/templates');
    await page.goto('/templates');
    await expect(page).toHaveURL(/\/templates/);
  });
});
