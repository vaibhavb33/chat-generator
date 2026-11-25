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
import { InstagramPostRenderer } from '@/platforms/instagram-post/Renderer';
import { GeneratorDirectory } from '@/components/directory/GeneratorDirectory';
import { getActiveConversation } from '@/core/store/useStudioStore';

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
});
