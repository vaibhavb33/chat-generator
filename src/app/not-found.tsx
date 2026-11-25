import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Search } from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <Compass className="h-7 w-7" />
        </span>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          The mockup generator or guide you requested could not be found. Browse our active
          generators or return to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="gradient">
            <Link href="/generators">
              <Search className="h-4 w-4" /> Browse All Generators
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" /> Back Home
            </Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
