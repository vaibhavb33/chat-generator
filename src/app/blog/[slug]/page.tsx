import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_ARTICLES, getBlogArticleBySlug } from '@/content/blogArticles';
import { GENERATOR_MAP } from '@/core/registry/generators';
import { SITE_BASE_URL, buildHreflangAlternates } from '@/core/i18n/locales';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Badge } from '@/components/ui/input';

export function generateStaticParams() {
  return BLOG_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);
  if (!article) return {};
  const path = `/blog/${article.slug}`;
  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {
      canonical: path,
      languages: buildHreflangAlternates(path),
    },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      url: `${SITE_BASE_URL}${path}`,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.seoDescription,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getBlogArticleBySlug(slug);
  if (!article) notFound();

  const articleUrl = `${SITE_BASE_URL}/blog/${article.slug}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seoDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: articleUrl,
    author: {
      '@type': 'Organization',
      name: 'ChatForge Editorial Team',
      url: SITE_BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ChatForge Studio',
      url: SITE_BASE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-slate-500">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>{' '}
          /{' '}
          <Link href="/blog" className="hover:text-indigo-600">
            Guides
          </Link>{' '}
          / <span className="font-medium text-slate-900 dark:text-white">{article.category}</span>
        </nav>

        <article className="space-y-8">
          <header className="space-y-3 border-b border-slate-200 pb-6 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <Badge variant="accent">{article.category}</Badge>
              <span>Updated {article.updatedAt}</span>
              <span>•</span>
              <span>{article.readingTime}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {article.title}
            </h1>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {article.excerpt}
            </p>
          </header>

          {article.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {section.heading}
              </h2>
              {section.paragraphs.map((p) => (
                <p
                  key={p}
                  className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                >
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Related Interactive Generators
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.relatedGeneratorSlugs.map((gSlug) => {
                const tool = GENERATOR_MAP[gSlug];
                if (!tool) return null;
                return (
                  <Link
                    key={gSlug}
                    href={`/generators/${tool.slug}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-indigo-400"
                  >
                    {tool.name} →
                  </Link>
                );
              })}
            </div>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
