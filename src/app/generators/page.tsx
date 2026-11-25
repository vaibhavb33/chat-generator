import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import {
  GeneratorDirectory,
  type DirectoryCategoryFilter,
} from '@/components/directory/GeneratorDirectory';
import { Badge } from '@/components/ui/input';
import { SITE_BASE_URL, buildHreflangAlternates } from '@/core/i18n/locales';

export const metadata: Metadata = {
  title: 'All Chat & Social Media Mockup Generators | ChatForge Directory',
  description:
    'Search and filter all 10 interactive chat, story, post, and phone call mockup generators. Free, client-side, and watermark-free.',
  alternates: {
    canonical: '/generators',
    languages: buildHreflangAlternates('/generators'),
  },
  openGraph: {
    title: 'All Chat & Social Media Mockup Generators | ChatForge',
    description:
      'Browse WhatsApp, iMessage, Instagram DM, Story, Post, Telegram, Discord, and Call Screen mockup tools.',
    url: `${SITE_BASE_URL}/generators`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Chat & Social Media Mockup Generators | ChatForge',
    description: 'Browse 10 free, watermark-free chat and social mockup tools.',
  },
};

const VALID_CATEGORIES = new Set<DirectoryCategoryFilter>([
  'all',
  'messaging',
  'social',
  'social_post',
  'story_profile',
  'phone_mockup',
]);

export default async function GeneratorsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const resolved = await searchParams;
  const initialQuery = resolved.q ?? '';
  const initialCategory: DirectoryCategoryFilter =
    resolved.category && VALID_CATEGORIES.has(resolved.category as DirectoryCategoryFilter)
      ? (resolved.category as DirectoryCategoryFilter)
      : 'all';

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_BASE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Generators',
        item: `${SITE_BASE_URL}/generators`,
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>{' '}
          / <span className="font-medium text-slate-900 dark:text-white">Generators</span>
        </nav>

        <div className="mb-8 max-w-2xl space-y-2">
          <Badge variant="accent">Generator Directory</Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            All Chat &amp; Social Mockup Generators
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Filter by category, platform family, popularity, or search directly. Every tool runs
            100% client-side with watermark-free HD exports.
          </p>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-slate-200/60" />}>
          <GeneratorDirectory
            key={initialCategory}
            initialQuery={initialQuery}
            initialCategory={initialCategory}
          />
        </Suspense>
      </main>

      <SiteFooter />
    </div>
  );
}
