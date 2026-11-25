import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ChatForge — Social Media Chat & Mockup Studio',
    short_name: 'ChatForge',
    description:
      'Privacy-first client-side social media chat, story, post, and call mockup generator.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#4f46e5',
    categories: ['design', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
