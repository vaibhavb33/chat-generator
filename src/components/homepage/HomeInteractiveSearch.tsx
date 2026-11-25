'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';
import { GENERATOR_MANIFESTS } from '@/core/registry/generators';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function HomeInteractiveSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GENERATOR_MANIFESTS.slice(0, 6);
    return GENERATOR_MANIFESTS.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.tagline.toLowerCase().includes(q) ||
        g.tags.some((t) => t.includes(q))
    );
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matches[0]) {
      router.push(`/generators/${matches[0].slug}`);
    } else {
      router.push(`/generators?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            aria-label="Find a mockup generator"
            placeholder="Search any generator (e.g., WhatsApp Group, Instagram Story, iMessage, Call Screen)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 pl-10 text-sm"
            data-testid="hero-generator-search"
          />
        </div>
        <Button type="submit" variant="gradient" size="lg" className="h-11 px-5">
          Launch Tool
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Quick launch:
        </span>
        {matches.slice(0, 5).map((item) => (
          <Link
            key={item.id}
            href={`/generators/${item.slug}`}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/60"
          >
            {item.shortName}
          </Link>
        ))}
      </div>
    </div>
  );
}
