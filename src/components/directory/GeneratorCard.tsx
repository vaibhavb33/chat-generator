import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import type { GeneratorManifest } from '@/core/types';
import { Badge } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function MiniThumbnail({ manifest }: { manifest: GeneratorManifest }) {
  const isStory = manifest.capabilities.archetype === 'ephemeral_story';
  const isPost = manifest.capabilities.archetype === 'social_post';
  const isCall = manifest.capabilities.archetype === 'call_screen';

  return (
    <div
      className={cn(
        'relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br p-3',
        manifest.accentGradient
      )}
    >
      {isStory ? (
        <div className="flex h-24 w-16 flex-col justify-between rounded-xl border border-white/30 bg-black/25 p-2 text-white backdrop-blur-xs">
          <div className="flex gap-0.5">
            <span className="h-0.5 flex-1 rounded bg-white" />
            <span className="h-0.5 flex-1 rounded bg-white/40" />
          </div>
          <div className="rounded-md bg-white/90 p-1 text-[7px] font-bold text-slate-900">
            Poll: A or B?
          </div>
        </div>
      ) : isPost ? (
        <div className="w-36 rounded-xl bg-white p-2 text-slate-900 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600" />
            <span className="h-1.5 w-14 rounded bg-slate-200" />
          </div>
          <div className="mt-1.5 h-11 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100" />
          <div className="mt-1.5 flex gap-1.5">
            <span className="h-1.5 w-8 rounded bg-slate-200" />
            <span className="h-1.5 w-6 rounded bg-slate-200" />
          </div>
        </div>
      ) : isCall ? (
        <div className="flex flex-col items-center gap-1.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/20 text-xs font-bold">
            ML
          </span>
          <span className="text-[10px] font-semibold">Incoming Call...</span>
          <div className="flex gap-4 pt-1">
            <span className="h-4 w-4 rounded-full bg-rose-500" />
            <span className="h-4 w-4 rounded-full bg-emerald-500" />
          </div>
        </div>
      ) : (
        <div className="w-40 space-y-1.5 rounded-xl bg-white/95 p-2.5 shadow-md">
          <div className="w-24 rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-medium text-slate-700">
            Ready for launch?
          </div>
          <div className="ml-auto w-24 rounded-lg bg-indigo-600 px-2 py-1 text-right text-[9px] font-medium text-white">
            Exporting PNG 🚀
          </div>
        </div>
      )}
    </div>
  );
}

export function GeneratorCard({ manifest }: { manifest: GeneratorManifest }) {
  return (
    <Link
      href={`/generators/${manifest.slug}`}
      className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
    >
      <div className="space-y-3">
        <MiniThumbnail manifest={manifest} />

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline">{manifest.platformFamily}</Badge>
          {manifest.popular && (
            <Badge variant="accent">
              <Flame className="h-3 w-3" /> Popular
            </Badge>
          )}
          {manifest.recentlyAdded && (
            <Badge variant="success">
              <Sparkles className="h-3 w-3" /> New
            </Badge>
          )}
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {manifest.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {manifest.tagline}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-indigo-600 dark:border-slate-800 dark:text-indigo-400">
        <span>Launch Generator</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
