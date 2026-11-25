import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/generators/whatsapp',
        destination: '/generators/whatsapp-chat',
        permanent: true,
      },
      {
        source: '/generators/fake-whatsapp-chat-generator',
        destination: '/generators/whatsapp-chat',
        permanent: true,
      },
      {
        source: '/generators/iphone-imessage',
        destination: '/generators/imessage',
        permanent: true,
      },
      {
        source: '/generators/text-message',
        destination: '/generators/imessage',
        permanent: true,
      },
      {
        source: '/generators/sms',
        destination: '/generators/android-messages',
        permanent: true,
      },
      {
        source: '/generators/telegram',
        destination: '/generators/telegram-chat',
        permanent: true,
      },
      {
        source: '/generators/discord',
        destination: '/generators/discord-chat',
        permanent: true,
      },
      {
        source: '/generators/call-screen',
        destination: '/generators/fake-call-screen',
        permanent: true,
      },
      {
        source: '/directory',
        destination: '/generators',
        permanent: true,
      },
      {
        source: '/tools',
        destination: '/generators',
        permanent: true,
      },
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
