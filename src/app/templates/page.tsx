import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Badge } from '@/components/ui/input';
import { BUILTIN_TEMPLATES, TEMPLATE_CATEGORY_LABELS } from '@/core/engine/templateLibrary';
import { GENERATOR_MANIFESTS } from '@/core/registry/generators';
import { SITE_BASE_URL, buildHreflangAlternates } from '@/core/i18n/locales';

export const metadata: Metadata = {
  title: 'Chat & Social Mockup Templates Gallery | ChatForge',
  description:
    'Browse ready-to-edit WhatsApp, iMessage, Instagram DM, Telegram, Discord, Story, and Call Screen mockup templates. Click to launch inside any generator.',
  alternates: {
    canonical: '/templates',
    languages: buildHreflangAlternates('/templates'),
  },
  openGraph: {
    title: 'Chat & Social Mockup Templates Gallery | ChatForge',
    description:
      'Jumpstart comedy skits, marketing social proof, support mockups, and story reels with built-in templates.',
    url: `${SITE_BASE_URL}/templates`,
    type: 'website',
  },
};

export default function TemplatesPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `${SITE_BASE_URL}/templates` },
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
          / <span className="font-medium text-slate-900 dark:text-white">Templates</span>
        </nav>

        <div className="mb-10 max-w-2xl space-y-2">
          <Badge variant="accent">
            <Sparkles className="h-3 w-3" /> Ready-to-Use Scripts &amp; Scenes
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Conversation &amp; Mockup Templates
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Launch any built-in conversation script directly in its matching dedicated generator.
            Customize speakers, timestamps, reactions, and dark mode without typing from scratch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BUILTIN_TEMPLATES.map((tpl) => {
            const compatible = GENERATOR_MANIFESTS.filter((m) =>
              tpl.supportedArchetypes.includes(m.capabilities.archetype)
            );
            const primaryTarget = compatible[0] ?? GENERATOR_MANIFESTS[0];
            const secondaryTarget = compatible[1];

            return (
              <div
                key={tpl.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">
                      {TEMPLATE_CATEGORY_LABELS[tpl.category] ?? tpl.category}
                    </Badge>
                    <span className="text-[11px] font-medium text-slate-500">
                      {tpl.scriptMessages.length} messages
                    </span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {tpl.title}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                    {tpl.scriptMessages.slice(0, 2).map((msg, idx) => (
                      <p
                        key={`${tpl.id}_${idx}`}
                        className="line-clamp-2 rounded-lg bg-white px-2.5 py-1.5 text-[11px] text-slate-700 shadow-2xs dark:bg-slate-900 dark:text-slate-300"
                      >
                        {msg.text}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <Link
                    href={`${primaryTarget.routePath}?template=${tpl.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    Use in {primaryTarget.shortName}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {secondaryTarget && (
                    <Link
                      href={`${secondaryTarget.routePath}?template=${tpl.id}`}
                      className="inline-flex items-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {secondaryTarget.shortName}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
