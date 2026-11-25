'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteTheme } from '@/components/layout/SiteThemeProvider';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/generators', label: 'All Generators' },
  { href: '/generators?category=messaging', label: 'Chat Generators' },
  { href: '/generators?category=social', label: 'Social Media Generators' },
  { href: '/templates', label: 'Templates' },
  { href: '/help', label: 'Help' },
];

function isNavItemActive(href: string, pathname: string | null, currentCategory: string | null): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/generators') return pathname === '/generators' && !currentCategory;
  if (href === '/generators?category=messaging') {
    return pathname === '/generators' && currentCategory === 'messaging';
  }
  if (href === '/generators?category=social') {
    return pathname === '/generators' && currentCategory === 'social';
  }
  if (href === '/templates') return pathname === '/templates';
  if (href === '/help') return pathname === '/help' || pathname?.startsWith('/blog') === true;
  return false;
}

function DesktopNavLinks({
  pathname,
  currentCategory,
}: {
  pathname: string | null;
  currentCategory: string | null;
}) {
  return (
    <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5 xl:gap-1">
      {NAV_LINKS.map((item) => {
        const isActive = isNavItemActive(item.href, pathname, currentCategory);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors xl:px-3 xl:text-sm',
              isActive
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function DesktopNavWithParams({ pathname }: { pathname: string | null }) {
  const searchParams = useSearchParams();
  return <DesktopNavLinks pathname={pathname} currentCategory={searchParams.get('category')} />;
}

export function SiteHeader({
  compact = false,
  sticky = true,
}: {
  compact?: boolean;
  sticky?: boolean;
}) {
  const pathname = usePathname();
  const { siteTheme, toggleSiteTheme } = useSiteTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90',
        sticky ? 'sticky top-0' : 'relative'
      )}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between gap-3 px-4 sm:px-6',
          compact ? 'h-14 max-w-full' : 'h-16 max-w-7xl'
        )}
      >
        <div className="flex items-center gap-4 xl:gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-sm">
              <Layers className="h-4 w-4" />
            </span>
            <span className="text-base font-bold tracking-tight">
              Chat<span className="text-indigo-600 dark:text-indigo-400">Forge</span>
            </span>
          </Link>

          <Suspense fallback={<DesktopNavLinks pathname={pathname} currentCategory={null} />}>
            <DesktopNavWithParams pathname={pathname} />
          </Suspense>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleSiteTheme}
            aria-label={siteTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={siteTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {siteTheme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>

          <Button asChild variant="gradient" size="sm" className="hidden sm:inline-flex">
            <Link href="/whatsapp-chat-generator">
              <Sparkles className="h-3.5 w-3.5" />
              Start Creating
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          data-testid="mobile-nav-drawer"
          className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden dark:border-slate-800 dark:bg-slate-950"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1.5">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Button asChild variant="gradient" className="w-full">
                <Link
                  href="/whatsapp-chat-generator"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Mockup Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
