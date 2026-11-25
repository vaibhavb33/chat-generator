import { ImageResponse } from 'next/og';
import { getGeneratorBySlug } from '@/core/registry/generators';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function GeneratorOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const manifest = getGeneratorBySlug(slug);
  const title = manifest?.name ?? 'ChatForge Mockup Generator';
  const tagline =
    manifest?.tagline ??
    'Create realistic social media chat and mockup visuals online without watermarks.';

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
          background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 55%, #2563eb 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#e0e7ff' }}>
            ChatForge Studio
          </span>
          <span
            style={{
              background: 'rgba(255,255,255,0.16)',
              padding: '8px 18px',
              borderRadius: '999px',
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            {manifest?.platformFamily ?? 'Mockup Tool'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '60px', fontWeight: 800, lineHeight: 1.08 }}>{title}</div>
          <div style={{ fontSize: '28px', color: '#e2e8f0', maxWidth: '940px' }}>
            {tagline}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '22px', color: '#c7d2fe' }}>
          <span>100% Client-Side</span>
          <span>•</span>
          <span>Free HD PNG / WebP</span>
          <span>•</span>
          <span>No Sign-Up</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
