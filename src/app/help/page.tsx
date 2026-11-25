import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, HelpCircle, ShieldCheck, Smartphone } from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FaqAccordion } from '@/components/homepage/FaqAccordion';
import { Badge } from '@/components/ui/input';
import { SITE_BASE_URL, buildHreflangAlternates } from '@/core/i18n/locales';

export const metadata: Metadata = {
  title: 'Help Center, FAQ & Export Guides | ChatForge',
  description:
    'Learn how to customize chat mockups, import screenplay scripts, export watermark-free 2x/3x PNG/WebP/video clips, use offline PWA mode, and verify fake screenshots.',
  alternates: {
    canonical: '/help',
    languages: buildHreflangAlternates('/help'),
  },
  openGraph: {
    title: 'Help Center, FAQ & Export Guides | ChatForge',
    description:
      'Step-by-step documentation, FAQs, privacy details, and media literacy guides for ChatForge Studio.',
    url: `${SITE_BASE_URL}/help`,
    type: 'website',
  },
};

const HELP_FAQS = [
  {
    question: 'Does ChatForge add any watermarks or require an account?',
    answer:
      'No. Every PNG, JPG, WebP, Semantic HTML, and video export runs 100% locally in your browser without watermarks or sign-up walls.',
  },
  {
    question: 'Where are my chats and uploaded images saved?',
    answer:
      'All messages, uploaded profile avatars, and custom templates stay strictly inside your browser using IndexedDB and localStorage. Nothing is transmitted to remote servers.',
  },
  {
    question: 'How do I paste a long conversation script quickly?',
    answer:
      'Open any dedicated chat generator page, click "Paste Script" above the message composer, and enter lines formatted as "Speaker Name: Message text".',
  },
  {
    question: 'How do I switch between iOS and Android frames or Light/Dark mode?',
    answer:
      'Use the Appearance & Status Bar panel on the right (or the "Style & Frame" mobile tab) to switch Dark Mode, Device Frame presets, battery %, clock time, and 5G/Wi-Fi indicators.',
  },
  {
    question: 'Can I install ChatForge as an app and use it offline?',
    answer:
      'Yes. ChatForge ships a PWA Web App Manifest and Service Worker that caches the workspace shell and preserves your IndexedDB drafts offline.',
  },
];

export default function HelpPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Help', item: `${SITE_BASE_URL}/help` },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/60 dark:bg-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-12 px-4 py-10 sm:px-6 lg:py-14">
        <div className="space-y-3">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
            <Link href="/" className="hover:text-indigo-600">
              Home
            </Link>{' '}
            / <span className="font-medium text-slate-900 dark:text-white">Help</span>
          </nav>

          <Badge variant="accent">
            <HelpCircle className="h-3 w-3" /> Documentation &amp; Support
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            ChatForge Help Center &amp; Guides
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Everything you need to craft realistic, watermark-free chat, story, post, and call
            screen mockups cleanly and responsibly.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <Smartphone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Dedicated Platform Studios
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Each generator runs on its own page with native bubble styles, typography, reactions,
              and customization settings.
            </p>
            <Link
              href="/generators"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Browse All Generators <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Privacy &amp; Ethical Disclosure
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Toggle the optional &ldquo;Simulated Mockup&rdquo; footer in the Appearance panel for
              compliant decks, classrooms, and ads.
            </p>
            <Link
              href="/blog/are-fake-chat-generators-legal-and-safe"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Read Legality Guide <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
              Verification &amp; Forensics
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Learn how educators, journalists, and trust teams inspect chat screenshots for subtle
              visual inconsistencies.
            </p>
            <Link
              href="/blog/how-to-spot-fake-whatsapp-screenshots"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Spot Fake Screenshots <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={HELP_FAQS} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
