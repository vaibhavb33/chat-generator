import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  escapeHtml,
  isSafeImageDataUrl,
  sanitizeImportedProject,
  validateImageFileUpload,
} from '@/core/security/validation';
import { createSeedProject } from '@/core/engine/seedData';
import { exportSemanticHtmlSnippet } from '@/core/export/exportEngine';
import { WhatsAppChatRenderer } from '@/platforms/whatsapp-chat/Renderer';
import { WhatsAppGroupChatRenderer } from '@/platforms/whatsapp-group-chat/Renderer';
import { InstagramStoryRenderer } from '@/platforms/InstagramStoryRenderer';
import { InstagramPostRenderer } from '@/platforms/instagram-post/Renderer';
import { GeneratorDirectory } from '@/components/directory/GeneratorDirectory';
import { getActiveConversation, useStudioStore } from '@/core/store/useStudioStore';

describe('Security Validation & Sanitization', () => {
  it('escapes HTML payloads in strings and HTML transcript exports', () => {
    expect(escapeHtml('<script>alert(1)</script>"')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;&quot;'
    );

    const proj = createSeedProject('whatsapp-chat');
    proj.title = 'Test"><script>alert(1)</script>';
    proj.cast[0].displayName = '<img src=x onerror=alert(1)>';
    const out = exportSemanticHtmlSnippet(proj);
    expect(out.textContent).not.toContain('<script>');
    expect(out.textContent).not.toContain('<img src=x');
    expect(out.textContent).toContain('&lt;script&gt;');
  });

  it('validates image data URLs and rejects unsafe schemes', () => {
    expect(isSafeImageDataUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
    expect(isSafeImageDataUrl('data:image/svg+xml;base64,PHN2Zz4=')).toBe(false);
    expect(isSafeImageDataUrl('javascript:alert(1)')).toBe(false);
  });

  it('validates image magic bytes and rejects disguised files', async () => {
    const fakePng = new File(['not a real png payload'], 'evil.png', {
      type: 'image/png',
    });
    await expect(validateImageFileUpload(fakePng)).rejects.toThrow(
      /does not match a valid/i
    );

    const svgFile = new File(['<svg></svg>'], 'icon.svg', {
      type: 'image/svg+xml',
    });
    await expect(validateImageFileUpload(svgFile)).rejects.toThrow(
      /Unsupported image format/i
    );
  });

  it('sanitizes imported JSON bundles and strips unsafe avatar URLs', () => {
    const seed = createSeedProject('whatsapp-chat');
    seed.cast[0].avatarDataUrl = 'javascript:alert(1)';
    const sanitized = sanitizeImportedProject(JSON.stringify(seed));
    expect(sanitized.cast[0].avatarDataUrl).toBeUndefined();

    expect(() =>
      sanitizeImportedProject(JSON.stringify({ ...seed, platformId: 'nonexistent-app' }))
    ).toThrow();
  });
});

describe('Component Tests (React Testing Library)', () => {
  it('renders WhatsAppChatRenderer and supports message selection', () => {
    const proj = createSeedProject('whatsapp-chat');
    const conv = getActiveConversation(proj);
    const byId = Object.fromEntries(proj.cast.map((p) => [p.id, p]));
    let selected = '';

    render(
      <WhatsAppChatRenderer
        conversation={conv}
        participantsById={byId}
        theme={proj.theme}
        visibleMessageCount={10}
        selectedMessageId={null}
        isTypingPreview={false}
        onSelectMessage={(id) => {
          selected = id;
        }}
      />
    );

    const msgEl = screen.getByText(/studio mockup ready/i);
    expect(msgEl).toBeTruthy();
    fireEvent.click(msgEl);
    expect(selected).toBe('msg_1');
  });

  it('renders InstagramPostRenderer and expands "...more" caption on click', () => {
    const proj = createSeedProject('instagram-post');
    const conv = getActiveConversation(proj);
    const byId = Object.fromEntries(proj.cast.map((p) => [p.id, p]));

    render(
      <InstagramPostRenderer
        conversation={conv}
        participantsById={byId}
        theme={proj.theme}
      />
    );

    const moreBtn = screen.getByRole('button', { name: 'more' });
    fireEvent.click(moreBtn);
    expect(screen.getByText(/#CreatorTools/i)).toBeTruthy();
  });

  it('renders GeneratorDirectory and filters by category', () => {
    render(<GeneratorDirectory />);
    fireEvent.click(screen.getByRole('button', { name: 'Phone Mockups' }));
    expect(screen.getByText('Fake Call Screen Generator')).toBeTruthy();
  });

  it('renders distinct WhatsApp iOS and Android chrome and unread/forwarded/audio items', () => {
    const proj = createSeedProject('whatsapp-chat');
    const conv = getActiveConversation(proj);
    conv.messages.push(
      {
        id: 'unread_1',
        senderId: 'system',
        type: 'unread_divider',
        text: '2 UNREAD MESSAGES',
        timestampLabel: '',
        attachments: [],
        reactions: [],
        readReceipt: { status: 'none' },
      },
      {
        id: 'fwd_audio',
        senderId: proj.cast[1].id,
        type: 'audio',
        text: 'Launch-Jingle.mp3',
        forwardedLabel: 'forwarded',
        timestampLabel: '9:45 AM',
        attachments: [
          {
            id: 'att_audio',
            kind: 'audio',
            durationSeconds: 42,
            audioMeta: { trackTitle: 'Launch-Jingle.mp3' },
          },
        ],
        reactions: [],
        readReceipt: { status: 'none' },
      }
    );
    const byId = Object.fromEntries(proj.cast.map((p) => [p.id, p]));

    const { rerender } = render(
      <WhatsAppChatRenderer
        conversation={conv}
        participantsById={byId}
        theme={{ ...proj.theme, uiVersion: 'ios_modern', osVariant: 'ios' }}
        visibleMessageCount={999}
        selectedMessageId={null}
        isTypingPreview={false}
        onSelectMessage={() => undefined}
      />
    );

    expect(screen.getByTestId('wa-ios-composer')).toBeTruthy();
    expect(screen.queryByTestId('wa-android-more')).toBeNull();
    expect(screen.getByTestId('wa-unread-divider').textContent).toContain('2 UNREAD MESSAGES');
    expect(screen.getByText('Forwarded')).toBeTruthy();
    expect(screen.getByText('Launch-Jingle.mp3')).toBeTruthy();

    rerender(
      <WhatsAppChatRenderer
        conversation={conv}
        participantsById={byId}
        theme={{ ...proj.theme, uiVersion: 'android_classic', osVariant: 'android' }}
        visibleMessageCount={999}
        selectedMessageId={null}
        isTypingPreview={false}
        onSelectMessage={() => undefined}
      />
    );

    expect(screen.getByTestId('wa-android-composer')).toBeTruthy();
    expect(screen.getByTestId('wa-android-more')).toBeTruthy();
  });

  it('supports 10+ WhatsApp group participants, admin/creator roles, reordering, pinned & deleted messages', () => {
    const store = useStudioStore.getState();
    store.initPlatform('whatsapp-group-chat');
    store.loadTenMemberGroupDemo();

    let project = useStudioStore.getState().project;
    expect(project.cast.length).toBe(10);
    expect(project.cast[0]?.isGroupCreator).toBe(true);
    expect(project.cast[0]?.isAdmin).toBe(true);

    const thirdId = project.cast[2].id;
    store.toggleGroupAdmin(thirdId);
    store.moveParticipant(thirdId, 'up');
    store.setGroupCreator(thirdId);

    project = useStudioStore.getState().project;
    expect(project.cast[1]?.id).toBe(thirdId);
    expect(project.cast[1]?.isAdmin).toBe(true);
    expect(project.cast[1]?.isGroupCreator).toBe(true);
    expect(project.cast[0]?.isGroupCreator).toBe(false);

    const conv = getActiveConversation(project);
    const byId = Object.fromEntries(project.cast.map((p) => [p.id, p]));

    const { rerender } = render(
      <WhatsAppGroupChatRenderer
        conversation={conv}
        participantsById={byId}
        theme={{ ...project.theme, uiVersion: 'ios_modern', osVariant: 'ios' }}
        visibleMessageCount={999}
        selectedMessageId={null}
        isTypingPreview={false}
        onSelectMessage={() => undefined}
      />
    );

    expect(screen.getByTestId('renderer-whatsapp-group-chat')).toBeTruthy();
    expect(screen.getByTestId('wa-group-pinned-banner')).toBeTruthy();
    expect(screen.getByTestId('wa-group-description')).toBeTruthy();
    expect(screen.getByTestId('wa-ios-back')).toBeTruthy();
    expect(screen.getByText('This message was deleted')).toBeTruthy();

    rerender(
      <WhatsAppGroupChatRenderer
        conversation={conv}
        participantsById={byId}
        theme={{ ...project.theme, uiVersion: 'android_modern', osVariant: 'android' }}
        visibleMessageCount={999}
        selectedMessageId={null}
        isTypingPreview={false}
        onSelectMessage={() => undefined}
      />
    );

    expect(screen.getByTestId('wa-android-more')).toBeTruthy();
  });

  it('renders Instagram Story 9:16 canvas with progress bars, stickers, and slide navigation', () => {
    const project = createSeedProject('instagram-story');
    const conv = getActiveConversation(project);
    const byId = Object.fromEntries(project.cast.map((p) => [p.id, p]));

    const { rerender } = render(
      <InstagramStoryRenderer
        conversation={conv}
        participantsById={byId}
        theme={project.theme}
      />
    );

    expect(screen.getByTestId('renderer-instagram-story')).toBeTruthy();
    expect(screen.getByTestId('story-sticker-mention')).toBeTruthy();
    expect(screen.getByTestId('story-sticker-location')).toBeTruthy();
    expect(screen.getByTestId('story-sticker-hashtag')).toBeTruthy();
    expect(screen.getByTestId('story-sticker-poll')).toBeTruthy();
    expect(screen.getByTestId('story-sticker-link')).toBeTruthy();

    // Switch to slide 2
    const convSlide2 = {
      ...conv,
      storyMeta: {
        ...conv.storyMeta!,
        activeSlideIndex: 1,
      },
    };

    rerender(
      <InstagramStoryRenderer
        conversation={convSlide2}
        participantsById={byId}
        theme={project.theme}
      />
    );

    expect(screen.getByTestId('story-sticker-question')).toBeTruthy();
    expect(screen.getByTestId('story-sticker-slider')).toBeTruthy();
    expect(screen.getByTestId('story-sticker-countdown')).toBeTruthy();
  });
});
