'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { RotateCcw, Search, Sparkles } from 'lucide-react';
import { GENERATOR_MANIFESTS } from '@/core/registry/generators';
import type { GeneratorCategory } from '@/core/types';
import { GeneratorCard } from '@/components/directory/GeneratorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const CATEGORIES: Array<{ id: 'all' | GeneratorCategory; label: string }> = [
  { id: 'all', label: 'All Generators' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'social_post', label: 'Social Posts' },
  { id: 'story_profile', label: 'Stories & Profiles' },
  { id: 'phone_mockup', label: 'Phone Mockups' },
];

const PLATFORMS = [
  'All',
  'WhatsApp',
  'Instagram',
  'Apple',
  'Google',
  'Telegram',
  'Discord',
  'Phone UI',
] as const;

export function GeneratorDirectory({
  initialQuery = '',
  initialCategory = 'all',
}: {
  initialQuery?: string;
  initialCategory?: 'all' | GeneratorCategory;
}) {
  const [query, setQuery] = useState(initialQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const domValue = searchInputRef.current?.value;
    if (domValue && domValue !== initialQuery) {
      setQuery(domValue);
    }
  }, [initialQuery]);
  const [category, setCategory] = useState<'all' | GeneratorCategory>(initialCategory);
  const [platform, setPlatform] = useState<string>('All');
  const [quickFilter, setQuickFilter] = useState<'all' | 'popular' | 'recent'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GENERATOR_MANIFESTS.filter((item) => {
      if (category !== 'all' && item.category !== category) return false;
      if (platform !== 'All' && item.platformFamily !== platform) return false;
      if (quickFilter === 'popular' && !item.popular) return false;
      if (quickFilter === 'recent' && !item.recentlyAdded) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.platformFamily.toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q))
      );
    });
  }, [query, category, platform, quickFilter]);

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setPlatform('All');
    setQuickFilter('all');
  };

  return (
    <div className="space-y-8">
      {/* Search + Quick Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              ref={searchInputRef}
              type="search"
              aria-label="Search generators"
              placeholder="Search WhatsApp, Instagram DM, iMessage, Discord, Call screen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 pl-9"
              data-testid="directory-search-input"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: 'All (10)' },
                { id: 'popular', label: 'Popular' },
                { id: 'recent', label: 'Recently Added' },
              ] as const
            ).map((btn) => (
              <Button
                key={btn.id}
                type="button"
                size="sm"
                variant={quickFilter === btn.id ? 'default' : 'outline'}
                onClick={() => setQuickFilter(btn.id)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer',
                category === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Platform Family Filter */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Platform:
          </span>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatform(p)}
              className={cn(
                'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer',
                platform === p
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> of{' '}
          {GENERATOR_MANIFESTS.length} interactive generators
        </span>
        {(query || category !== 'all' || platform !== 'All' || quickFilter !== 'all') && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> Reset filters
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {filtered.length === 0 ? (
        <div
          data-testid="directory-empty-state"
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sparkles className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
            No matching generators found
          </h3>
          <p className="mt-1 max-w-md text-xs text-slate-600 dark:text-slate-400">
            No tools matched &ldquo;{query}&rdquo; with your current filters. Try clearing your filters to view all 10 MVP generators.
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
            <RotateCcw className="h-3.5 w-3.5" /> Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <GeneratorCard key={item.id} manifest={item} />
          ))}
        </div>
      )}
    </div>
  );
}
