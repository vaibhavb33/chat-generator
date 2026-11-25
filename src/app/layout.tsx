import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteThemeProvider } from '@/components/layout/SiteThemeProvider';
import { PwaManager } from '@/components/pwa/PwaManager';
import { SITE_BASE_URL, buildHreflangAlternates } from '@/core/i18n/locales';

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_BASE_URL),
  title: 'ChatForge — Social Media Chat, Story & Mockup Studio (No Watermark)',
  description:
    'Create pixel-accurate WhatsApp, iMessage, Instagram DM, Story, Post, Telegram, Discord, and Call Screen mockups in seconds. 100% client-side with free HD PNG exports.',
  alternates: {
    canonical: '/',
    languages: buildHreflangAlternates('/'),
  },
  openGraph: {
    title: 'ChatForge — Social Media Chat, Story & Mockup Studio',
    description:
      'Create pixel-accurate WhatsApp, iMessage, Instagram DM, Story, Post, Telegram, Discord, and Call Screen mockups without watermarks.',
    url: SITE_BASE_URL,
    siteName: 'ChatForge',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChatForge — Social Media Chat & Mockup Studio',
    description:
      '100% client-side chat, story, post, and call mockup generator with zero watermarks.',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ChatForge',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ChatForge Studio',
    url: SITE_BASE_URL,
    logo: `${SITE_BASE_URL}/icons/icon-512.png`,
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ChatForge',
    url: SITE_BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_BASE_URL}/generators?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <SiteThemeProvider>
          {children}
          <PwaManager />
        </SiteThemeProvider>
      </body>
    </html>
  );
}
