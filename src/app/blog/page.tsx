import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Badge } from '@/components/ui/input';
import { BLOG_ARTICLES } from '@/content/blogArticles';
import { SITE_BASE_URL, buildHreflangAlternates } from '@/core/i18n/locales';

export const metadata: Metadata = {
  title: 'Media Literacy, Forensics & Mockup Guides | ChatForge Blog',
  description:
    'Educational guides on spotting fabricated chat screenshots, ethical creative storytelling, and privacy-first browser mockup workflows.',
  alternates: {
    canonical: '/blog',
    languages: buildHreflangAlternates('/blog'),
  },
  openGraph: {
    title: 'Media Literacy & Mockup Guides | ChatForge',
    description:
      'Practical verification checklists and responsible mockup creation guides.',
    url: `${SITE_BASE_URL}/blog`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Media Literacy & Mockup Guides | ChatForge',
    description:
      'Practical verification checklists and responsible mockup creation guides.',
  },
};

export default function BlogIndexPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_BASE_URL}/blog` },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>{' '}
          / <span className="font-medium text-slate-900 dark:text-white">Guides</span>
        </nav>

        <div className="mb-10 max-w-2xl space-y-2">
          <Badge variant="accent">
            <BookOpen className="h-3 w-3" /> Guides &amp; Media Literacy
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Verification, Ethics &amp; Mockup Guides
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Educational resources for journalists, teachers, creators, and marketers using
            synthetic chat and social UI mockups responsibly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {BLOG_ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Badge variant="outline">{article.category}</Badge>
                  <span>{article.readingTime}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {article.excerpt}
                </p>
              </div>
              <p className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Read guide <ArrowRight className="h-3.5 w-3.5" />
              </p>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
