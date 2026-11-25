import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  GENERATOR_MANIFESTS,
  GENERATOR_MAP,
  getGeneratorBySlug,
} from '@/core/registry/generators';
import { GENERATOR_SEO_CONTENT } from '@/content/generatorSeoContent';
import { SITE_BASE_URL, buildHreflangAlternates } from '@/core/i18n/locales';
import { StudioWorkspace } from '@/components/studio/StudioWorkspace';
import { FaqAccordion } from '@/components/homepage/FaqAccordion';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { GeneratorCard } from '@/components/directory/GeneratorCard';
import { Badge } from '@/components/ui/input';

export function generateStaticParams() {
  return GENERATOR_MANIFESTS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const manifest = getGeneratorBySlug(slug);
  if (!manifest) return {};
  const path = `/generators/${manifest.slug}`;
  return {
    title: manifest.seoTitle,
    description: manifest.seoDescription,
    alternates: {
      canonical: path,
      languages: buildHreflangAlternates(path),
    },
    openGraph: {
      title: manifest.seoTitle,
      description: manifest.seoDescription,
      url: `${SITE_BASE_URL}${path}`,
      type: 'website',
      siteName: 'ChatForge',
    },
    twitter: {
      card: 'summary_large_image',
      title: manifest.seoTitle,
      description: manifest.seoDescription,
    },
  };
}

export default async function GeneratorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const manifest = getGeneratorBySlug(slug);
  if (!manifest) {
    notFound();
  }

  const seo = GENERATOR_SEO_CONTENT[manifest.slug];
  const pageUrl = `${SITE_BASE_URL}/generators/${manifest.slug}`;

  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: manifest.name,
    url: pageUrl,
    description: manifest.seoDescription,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas.',
    featureList: seo?.schemaFeatureList ?? manifest.tags,
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: manifest.name,
    url: pageUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

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
      { '@type': 'ListItem', position: 3, name: manifest.name, item: pageUrl },
    ],
  };

  const relatedManifests = (seo?.relatedSlugs ?? [])
    .map((s) => GENERATOR_MAP[s])
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Interactive Studio Workspace */}
      <StudioWorkspace platformId={manifest.id} />

      {/* Rich On-Page SEO Content, How-To, Examples, Features, FAQs & Related Links */}
      <main className="border-t border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-5xl space-y-14 px-4 sm:px-6">
          {/* Breadcrumbs + Primary H1 + Intro */}
          <section className="space-y-4">
            <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
              <Link href="/" className="hover:text-indigo-600">
                Home
              </Link>{' '}
              /{' '}
              <Link href="/generators" className="hover:text-indigo-600">
                Generators
              </Link>{' '}
              /{' '}
              <span className="font-medium text-slate-900 dark:text-white">
                {manifest.name}
              </span>
            </nav>

            <div className="space-y-3">
              <Badge variant="accent">{manifest.platformFamily} Mockup Tool</Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                {seo?.h1Title ?? manifest.name}
              </h1>
              <p className="text-base font-medium text-indigo-700 dark:text-indigo-400">
                {seo?.subtitle ?? manifest.tagline}
              </p>
              {(seo?.introParagraphs ?? [manifest.description]).map((p) => (
                <p
                  key={p}
                  className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                >
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* How-To Instructions */}
          {seo && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                How to Use the {manifest.name}
              </h2>
              <div className="grid gap-5 md:grid-cols-3">
                {seo.howToSteps.map((step, idx) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                      0{idx + 1}
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {step.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Examples */}
          {seo && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Popular {manifest.shortName} Examples
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                {seo.examples.map((ex) => (
                  <div
                    key={ex.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <Badge variant="outline">{ex.useCase}</Badge>
                    <h3 className="mt-2.5 text-base font-bold text-slate-900 dark:text-white">
                      {ex.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {ex.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Feature Explanations */}
          {seo && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Key Features &amp; Customization Controls
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {seo.features.map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {feat.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {feat.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {manifest.faqs.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <FaqAccordion items={manifest.faqs} />
            </section>
          )}

          {/* Related Generators */}
          {relatedManifests.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Related Mockup Generators
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {relatedManifests.slice(0, 3).map((rel) => (
                  <GeneratorCard key={rel.id} manifest={rel} />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Need guidance on screenshot verification or ethical usage? Read our{' '}
            <Link
              href="/blog/how-to-spot-fake-whatsapp-screenshots"
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Forensic Screenshot Verification Guide
            </Link>{' '}
            or{' '}
            <Link
              href="/blog/are-fake-chat-generators-legal-and-safe"
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Creator &amp; Educator Compliance Guide
            </Link>
            .
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
