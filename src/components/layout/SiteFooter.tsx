import React from 'react';
import Link from 'next/link';
import { Layers, ShieldCheck } from 'lucide-react';
import { GENERATOR_MANIFESTS } from '@/core/registry/generators';

export function SiteFooter() {
  const messagingTools = GENERATOR_MANIFESTS.filter((g) => g.category === 'messaging');
  const otherTools = GENERATOR_MANIFESTS.filter((g) => g.category !== 'messaging');

  return (
    <footer className="border-t border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
                <Layers className="h-4 w-4" />
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Chat<span className="text-indigo-600 dark:text-indigo-400">Forge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Precision social media chat, story, post, and call mockup studio. Built
              for creators, marketers, filmmakers, and educators.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-800 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              100% Client-Side • Zero Watermark PNGs
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Messaging Generators
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {messagingTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/generators/${tool.slug}`}
                    className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Social, Story & Call UIs
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {otherTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/generators/${tool.slug}`}
                    className="text-slate-600 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/generators"
                  className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Browse Full Directory →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Platform & Ethics
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  How ChatForge Works
                </Link>
              </li>
              <li>
                <Link href="/#examples" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Example Outputs
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/blog/how-to-spot-fake-whatsapp-screenshots" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  How to Spot Fake Screenshots
                </Link>
              </li>
              <li>
                <Link href="/blog/are-fake-chat-generators-legal-and-safe" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  Legality &amp; Safety Guide
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  All Media Literacy Guides
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} ChatForge Studio. Intended strictly for creative storytelling,
            UI/UX mockups, marketing previews, and media literacy education.
          </p>
          <p>No affiliation with WhatsApp, Meta, Apple, Google, Telegram, or Discord.</p>
        </div>
      </div>
    </footer>
  );
}
