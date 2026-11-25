import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'ChatForge — Social Media Chat & Mockup Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background: 'linear-gradient(135deg, #0f172a 0%, #312e81 55%, #1d4ed8 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: 800,
            }}
          >
            CF
          </div>
          <span style={{ fontSize: '30px', fontWeight: 700 }}>ChatForge Studio</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '58px', fontWeight: 800, lineHeight: 1.1 }}>
            Social Media Chat &amp; Mockup Generator
          </div>
          <div style={{ fontSize: '28px', color: '#cbd5e1', maxWidth: '920px' }}>
            WhatsApp, iMessage, Instagram DM, Story, Post, Telegram, Discord &amp; Call Screens — 100% Client-Side &amp; Watermark-Free
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '22px', color: '#a5b4fc' }}>
          <span>Zero Watermarks</span>
          <span>•</span>
          <span>HD PNG / JPG / WebP</span>
          <span>•</span>
          <span>Video Timeline</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
