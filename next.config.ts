import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/generators/whatsapp-chat', destination: '/whatsapp-chat-generator', permanent: true },
      { source: '/generators/whatsapp', destination: '/whatsapp-chat-generator', permanent: true },
      { source: '/generators/fake-whatsapp-chat-generator', destination: '/whatsapp-chat-generator', permanent: true },
      { source: '/generators/whatsapp-group-chat', destination: '/whatsapp-group-chat-generator', permanent: true },
      { source: '/generators/instagram-dm', destination: '/instagram-dm-generator', permanent: true },
      { source: '/generators/instagram-story', destination: '/instagram-story-generator', permanent: true },
      { source: '/generators/instagram-post', destination: '/instagram-post-generator', permanent: true },
      { source: '/generators/imessage', destination: '/imessage-generator', permanent: true },
      { source: '/generators/iphone-imessage', destination: '/imessage-generator', permanent: true },
      { source: '/generators/text-message', destination: '/imessage-generator', permanent: true },
      { source: '/generators/android-messages', destination: '/android-message-generator', permanent: true },
      { source: '/generators/sms', destination: '/android-message-generator', permanent: true },
      { source: '/generators/telegram-chat', destination: '/telegram-chat-generator', permanent: true },
      { source: '/generators/telegram', destination: '/telegram-chat-generator', permanent: true },
      { source: '/generators/discord-chat', destination: '/discord-chat-generator', permanent: true },
      { source: '/generators/discord', destination: '/discord-chat-generator', permanent: true },
      { source: '/generators/fake-call-screen', destination: '/fake-call-generator', permanent: true },
      { source: '/generators/call-screen', destination: '/fake-call-generator', permanent: true },
      { source: '/directory', destination: '/generators', permanent: true },
      { source: '/tools', destination: '/generators', permanent: true },
      { source: '/all-generators', destination: '/generators', permanent: true },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "media-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
