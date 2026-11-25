import { describe, it, expect, beforeEach } from 'vitest';
import { GENERATOR_MANIFESTS } from '@/core/registry/generators';
import { parseScreenplayText } from '@/core/engine/scriptParser';
import { parseImportedProjectJson } from '@/core/export/exportEngine';
import { createSeedProject, STARTER_TEMPLATES } from '@/core/engine/seedData';
import { TEMPLATE_CATEGORY_LABELS } from '@/core/engine/templateLibrary';
import { getVideoDimensions } from '@/core/export/videoExporter';
import { GENERATOR_SEO_CONTENT } from '@/content/generatorSeoContent';
import { BLOG_ARTICLES } from '@/content/blogArticles';
import { LOCALES, buildHreflangAlternates } from '@/core/i18n/locales';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';

describe('Generator Registry Contracts', () => {
  it('registers all 10 MVP generators with unique IDs and slugs', () => {
    expect(GENERATOR_MANIFESTS).toHaveLength(10);
    const ids = new Set(GENERATOR_MANIFESTS.map((m) => m.id));
    const slugs = new Set(GENERATOR_MANIFESTS.map((m) => m.slug));
    expect(ids.size).toBe(10);
    expect(slugs.size).toBe(10);
  });
});

describe('Screenplay Script Parser', () => {
  it('parses speakers, voice notes, and system lines', () => {
    const res = parseScreenplayText(
      'Maya: Hey there!\nAlex [voice 0:14]: Listen to this\n[system]: Sam joined'
    );
    expect(res.participants).toHaveLength(2);
    expect(res.messages).toHaveLength(3);
    expect(res.messages[1].type).toBe('voice_note');
    expect(res.messages[1].durationSeconds).toBe(14);
    expect(res.messages[2].type).toBe('system');
  });

  it('returns warning on empty input', () => {
    const res = parseScreenplayText('   ');
    expect(res.messages).toHaveLength(0);
    expect(res.warnings.length).toBeGreaterThan(0);
  });
});

describe('Project JSON Validation', () => {
  it('accepts valid serialized projects and rejects malformed JSON', () => {
    const seed = createSeedProject('whatsapp-chat');
    const parsed = parseImportedProjectJson(JSON.stringify(seed));
    expect(parsed.platformId).toBe('whatsapp-chat');
    expect(() => parseImportedProjectJson('{"foo":"bar"}')).toThrow();
  });
});

describe('Studio Store Mutations, Undo/Redo & Persistence', () => {
  beforeEach(() => {
    useStudioStore.setState({
      project: createSeedProject('whatsapp-chat'),
      past: [],
      future: [],
      saveStatus: 'saved',
    });
  });

  it('supports adding messages, undo, and redo', () => {
    const initialCount = getActiveConversation(useStudioStore.getState().project).messages.length;
    useStudioStore.getState().addMessage({
      senderId: 'part_self',
      text: 'Test message from unit suite',
    });
    expect(getActiveConversation(useStudioStore.getState().project).messages.length).toBe(
      initialCount + 1
    );
    expect(useStudioStore.getState().saveStatus).toBe('unsaved');

    useStudioStore.getState().undo();
    expect(getActiveConversation(useStudioStore.getState().project).messages.length).toBe(
      initialCount
    );

    useStudioStore.getState().redo();
    expect(getActiveConversation(useStudioStore.getState().project).messages.length).toBe(
      initialCount + 1
    );
  });

  it('preserves conversation dialogue when switching compatible chat platforms', () => {
    useStudioStore.getState().addMessage({
      senderId: 'part_self',
      text: 'Preserve me across skin switch',
    });
    useStudioStore.getState().switchPlatformInPlace('imessage');
    const conv = getActiveConversation(useStudioStore.getState().project);
    expect(useStudioStore.getState().project.platformId).toBe('imessage');
    expect(conv.messages.some((m) => m.text === 'Preserve me across skin switch')).toBe(true);
  });

  it('hydrates starter templates cleanly', () => {
    useStudioStore.getState().applyTemplate(STARTER_TEMPLATES[0]);
    const conv = getActiveConversation(useStudioStore.getState().project);
    expect(conv.messages).toHaveLength(STARTER_TEMPLATES[0].scriptMessages.length);
  });

  it('saves and restores project via IndexedDB', async () => {
    useStudioStore.getState().setProjectTitle('Persisted Draft Title');
    await useStudioStore.getState().saveNow();
    expect(useStudioStore.getState().saveStatus).toBe('saved');

    useStudioStore.setState({ project: createSeedProject('imessage') });
    await useStudioStore.getState().initPlatform('whatsapp-chat');
    expect(useStudioStore.getState().project.title).toBe('Persisted Draft Title');
  });

  it('duplicates messages, switches sender, and duplicates/restores projects', async () => {
    const convBefore = getActiveConversation(useStudioStore.getState().project);
    const targetMsg = convBefore.messages.find((m) => m.senderId !== 'system')!;
    const origSender = targetMsg.senderId;

    useStudioStore.getState().duplicateMessage(targetMsg.id);
    const convAfterDup = getActiveConversation(useStudioStore.getState().project);
    expect(convAfterDup.messages).toHaveLength(convBefore.messages.length + 1);

    useStudioStore.getState().switchMessageSender(targetMsg.id);
    const updatedMsg = getActiveConversation(useStudioStore.getState().project).messages.find(
      (m) => m.id === targetMsg.id
    )!;
    expect(updatedMsg.senderId).not.toBe(origSender);

    const copy = await useStudioStore.getState().duplicateCurrentProject();
    expect(copy.title).toContain('(Copy)');
    expect(useStudioStore.getState().savedProjects.length).toBeGreaterThanOrEqual(1);

    useStudioStore.getState().resetToSeed();
    expect(useStudioStore.getState().project.title).not.toContain('(Copy)');

    await useStudioStore.getState().restoreProjectById(copy.id);
    expect(useStudioStore.getState().project.id).toBe(copy.id);
  });

  it('covers all 9 template categories and saves/duplicates/deletes custom templates', async () => {
    const categories = new Set(STARTER_TEMPLATES.map((t) => t.category));
    for (const key of Object.keys(TEMPLATE_CATEGORY_LABELS)) {
      expect(categories.has(key as keyof typeof TEMPLATE_CATEGORY_LABELS)).toBe(true);
    }

    const saved = await useStudioStore
      .getState()
      .saveCurrentAsTemplate('My Custom Promo', 'product_promotion', 'Custom promo test');
    expect(useStudioStore.getState().customTemplates.some((t) => t.id === saved.id)).toBe(true);

    const dup = await useStudioStore.getState().duplicateTemplate(saved);
    expect(dup.title).toContain('(Copy)');

    await useStudioStore.getState().deleteCustomTemplate(dup.id);
    expect(useStudioStore.getState().customTemplates.some((t) => t.id === dup.id)).toBe(false);
  });

  it('supports story_reply, shared_post, call_event, custom dimensions, and video ratios', () => {
    useStudioStore.getState().addMessage({
      senderId: 'part_self',
      type: 'story_reply',
      text: 'Love this story!',
      storyAuthorHandle: '@maya',
    });
    useStudioStore.getState().addMessage({
      senderId: 'part_alex',
      type: 'call_event',
      text: 'Missed voice call',
      callOutcome: 'missed',
      callMedia: 'voice',
    });
    useStudioStore.getState().setCustomDimensions(true, 1080, 1350);

    const conv = getActiveConversation(useStudioStore.getState().project);
    expect(conv.messages.some((m) => m.type === 'story_reply')).toBe(true);
    expect(conv.messages.some((m) => m.callEvent?.outcome === 'missed')).toBe(true);
    expect(useStudioStore.getState().project.exportSettings.customWidthPx).toBe(1080);

    expect(getVideoDimensions('9:16')).toEqual({ width: 540, height: 960 });
    expect(getVideoDimensions('4:5')).toEqual({ width: 640, height: 800 });
    expect(getVideoDimensions('1:1')).toEqual({ width: 720, height: 720 });
  });

  it('provides unique SEO content for all 10 generators, editorial articles, and 8-locale i18n config', () => {
    const titles = new Set(GENERATOR_MANIFESTS.map((m) => m.seoTitle));
    const descs = new Set(GENERATOR_MANIFESTS.map((m) => m.seoDescription));
    expect(titles.size).toBe(10);
    expect(descs.size).toBe(10);

    for (const m of GENERATOR_MANIFESTS) {
      const seo = GENERATOR_SEO_CONTENT[m.slug];
      expect(seo).toBeDefined();
      expect(seo.howToSteps.length).toBeGreaterThanOrEqual(3);
      expect(seo.relatedSlugs.length).toBeGreaterThanOrEqual(3);
    }

    expect(BLOG_ARTICLES.length).toBeGreaterThanOrEqual(2);
    expect(Object.keys(LOCALES)).toEqual([
      'en',
      'hi',
      'es',
      'pt',
      'fr',
      'de',
      'ar',
      'id',
    ]);
    expect(LOCALES.ar.direction).toBe('rtl');

    const alternates = buildHreflangAlternates('/whatsapp-chat-generator');
    expect(alternates['en']).toBe('https://chatforge.studio/whatsapp-chat-generator');
    expect(alternates['x-default']).toBe('https://chatforge.studio/whatsapp-chat-generator');
  });
});
